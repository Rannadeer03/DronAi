"""Tests for MavlinkClient.connect()'s heartbeat handling.

wait_heartbeat() returns the HEARTBEAT message on success, or None on
timeout — it never raises for a timeout. connect() must not report
"connected" (and must not let the caller proceed) when no heartbeat
arrives, since main.py calls connect() with no try/except and relies on
an exception to trigger the systemd crash-restart loop.
"""

from unittest.mock import MagicMock, patch

import pytest

from mavlink_client import MavlinkClient


def test_connect_marks_connected_on_real_heartbeat():
    client = MavlinkClient("udp:127.0.0.1:14550")
    mock_master = MagicMock()
    mock_heartbeat_msg = MagicMock()
    mock_master.wait_heartbeat.return_value = mock_heartbeat_msg

    with patch("mavlink_client.mavutil.mavlink_connection", return_value=mock_master):
        client.connect(heartbeat_timeout=5.0)

    assert client.snapshot()["connected"] is True
    mock_master.wait_heartbeat.assert_called_once_with(timeout=5.0)


def test_connect_raises_and_stays_disconnected_on_heartbeat_timeout():
    client = MavlinkClient("/dev/serial0")
    mock_master = MagicMock()
    mock_master.wait_heartbeat.return_value = None  # pymavlink's timeout return

    with patch("mavlink_client.mavutil.mavlink_connection", return_value=mock_master):
        with pytest.raises(TimeoutError):
            client.connect(heartbeat_timeout=0.01)

    assert client.snapshot()["connected"] is False


def test_connect_timeout_propagates_uncaught_for_systemd_restart():
    """No internal retry/except here — main.py calls connect() bare and
    depends on the exception reaching asyncio.run() so systemd's
    Restart=always relaunches the process."""
    client = MavlinkClient("/dev/serial0")
    mock_master = MagicMock()
    mock_master.wait_heartbeat.return_value = None

    with patch("mavlink_client.mavutil.mavlink_connection", return_value=mock_master):
        try:
            client.connect(heartbeat_timeout=0.01)
        except TimeoutError as exc:
            assert "no MAVLink heartbeat received" in str(exc)
        else:
            pytest.fail("connect() should have raised TimeoutError")

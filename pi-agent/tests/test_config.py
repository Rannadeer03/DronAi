"""Tests for MAVLINK_BAUD's default/override behavior in config.py.

config.py reads os.environ at import time into module-level constants, so
each test reloads the module under a controlled environment rather than
importing it once at collection time.
"""

import importlib
import os

os.environ.setdefault("DRONAI_DEVICE_UID", "DRA-TEST")

import config


def _reload_config(monkeypatch, **env):
    monkeypatch.setenv("DRONAI_DEVICE_UID", "DRA-TEST")
    for key, value in env.items():
        monkeypatch.setenv(key, value)
    return importlib.reload(config)


def test_mavlink_baud_defaults_to_57600(monkeypatch):
    monkeypatch.delenv("MAVLINK_BAUD", raising=False)
    reloaded = _reload_config(monkeypatch)
    assert reloaded.MAVLINK_BAUD == 57600
    assert isinstance(reloaded.MAVLINK_BAUD, int)


def test_mavlink_baud_override_from_env(monkeypatch):
    reloaded = _reload_config(monkeypatch, MAVLINK_BAUD="115200")
    assert reloaded.MAVLINK_BAUD == 115200
    assert isinstance(reloaded.MAVLINK_BAUD, int)

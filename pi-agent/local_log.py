"""SQLite buffer for drone_logs events so the agent never loses history
when the backend is unreachable. The MAVLink control loop never depends on
this — it's write-then-forget, flushed opportunistically on reconnect.
"""

import json
import os
import sqlite3
import time


class LocalLog:
    def __init__(self, db_path: str) -> None:
        os.makedirs(os.path.dirname(db_path) or ".", exist_ok=True)
        self._conn = sqlite3.connect(db_path)
        self._conn.execute(
            """
            create table if not exists pending_logs (
                id integer primary key autoincrement,
                event_type text not null,
                level text not null,
                message text,
                metadata text,
                ts real not null,
                synced integer not null default 0
            )
            """
        )
        self._conn.commit()

    def buffer(self, event_type: str, level: str = "info", message: str | None = None, metadata: dict | None = None) -> None:
        self._conn.execute(
            "insert into pending_logs (event_type, level, message, metadata, ts) values (?, ?, ?, ?, ?)",
            (event_type, level, message, json.dumps(metadata or {}), time.time()),
        )
        self._conn.commit()

    def unsynced(self) -> list[dict]:
        rows = self._conn.execute(
            "select id, event_type, level, message, metadata from pending_logs where synced = 0 order by id"
        ).fetchall()
        return [
            {"id": r[0], "event_type": r[1], "level": r[2], "message": r[3], "metadata": json.loads(r[4] or "{}")}
            for r in rows
        ]

    def mark_synced(self, ids: list[int]) -> None:
        if not ids:
            return
        self._conn.executemany("update pending_logs set synced = 1 where id = ?", [(i,) for i in ids])
        self._conn.commit()

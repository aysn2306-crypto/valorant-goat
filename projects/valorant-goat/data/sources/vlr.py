"""vlr.gg access.

- Event-wide player stats come from the vendored vlrggapi server running on
  localhost (start it with scripts/start_vlrggapi.sh). vlrdevapi has no
  event-stats endpoint.
- Players, events, standings, series stats come from vlrdevapi.
Everything goes through the disk cache, so each page is hit once.
"""
import time
import requests
import vlrdevapi

from .cache import cached

VLRGGAPI = "http://127.0.0.1:3001"
POLITE_DELAY_S = 1.5


def event_stats(event_id: int) -> list[dict]:
    """Every player's stats at one event (rating, ACS, ADR, KAST, FK/FD, clutches)."""
    def fetch():
        time.sleep(POLITE_DELAY_S)
        r = requests.get(f"{VLRGGAPI}/v2/stats",
                         params={"region": "all", "timespan": "all", "event_id": event_id, "min_rounds": 1},
                         timeout=120)
        r.raise_for_status()
        return r.json()["data"]["segments"]
    rows = cached("vlr_event_stats", str(event_id), fetch)["data"]
    return [dict(r, event_id=event_id) for r in rows]


def event_standings(event_id: int) -> list[dict]:
    def fetch():
        time.sleep(POLITE_DELAY_S)
        s = vlrdevapi.event.standings(event_id=event_id)
        return [
            {"stage": st.stage_name, "place": e.place, "team_id": e.team.id if e.team else None,
             "team": e.team.name if e.team else None, "prize_usd": e.prize_money}
            for st in s.stages for e in st.standings
        ]
    return cached("vlr_standings", str(event_id), fetch)["data"]


def event_info(event_id: int) -> dict:
    def fetch():
        time.sleep(POLITE_DELAY_S)
        e = vlrdevapi.event.info(event_id=event_id)
        return {"event_id": event_id, "name": e.name, "start": str(e.start_date), "end": str(e.end_date)}
    return cached("vlr_event_info", str(event_id), fetch)["data"]

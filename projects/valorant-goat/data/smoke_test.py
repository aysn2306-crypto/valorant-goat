"""Proves both sources work: pulls Champions 2022 (vlr.gg event 1015) stats and
standings, plus its Liquipedia page awards, and writes small sample CSVs.
Run from the repo root:  python -m data.smoke_test   (vlrggapi must be running)"""
import pathlib
import pandas as pd

from data.sources import vlr, liquipedia

OUT = pathlib.Path(__file__).resolve().parent / "csv"
OUT.mkdir(exist_ok=True)

info = vlr.event_info(1015)
stats = pd.DataFrame(vlr.event_stats(1015))
standings = pd.DataFrame(vlr.event_standings(1015))
awards = pd.DataFrame(liquipedia.event_awards("VCT/2022/Champions"))

stats.to_csv(OUT / "sample_champions_2022_stats.csv", index=False)
standings.to_csv(OUT / "sample_champions_2022_standings.csv", index=False)
awards.to_csv(OUT / "sample_champions_2022_awards.csv", index=False)

print(info)
print(f"{len(stats)} player rows, {len(standings)} standings rows, {len(awards)} awards")
print(stats[["player", "rounds_played", "rating", "average_combat_score", "average_damage_per_round"]].head(5).to_string(index=False))
print(standings.head(4).to_string(index=False))
print(awards.to_string(index=False))

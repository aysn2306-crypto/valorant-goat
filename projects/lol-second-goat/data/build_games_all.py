"""Every game with a winner, 2011 on (ay 18 Nov: count 2013-15 in Elo, clutch and plus-minus).
early_games.csv (player rows 2011-15) + early_winners.csv (who won) + games_2016on.csv -> data/csv/games_all.csv"""
import os, pandas as pd
CSV = os.path.join(os.path.dirname(os.path.abspath(__file__)), "csv")
e = pd.read_csv(os.path.join(CSV, "early_games.csv"))
w = pd.read_csv(os.path.join(CSV, "early_winners.csv"), usecols=["GameId", "WinTeam", "Date"])
e = e.merge(w, on="GameId", how="inner")
e["Win"] = (e.Team == e.WinTeam).map({True: "Yes", False: "No"})
g = pd.read_csv(os.path.join(CSV, "games_2016on.csv"))
pd.concat([e.drop(columns="WinTeam"), g], ignore_index=True).to_csv(os.path.join(CSV, "games_all.csv"), index=False)
print(len(e), "early rows +", len(g))

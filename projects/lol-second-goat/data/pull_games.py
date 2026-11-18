"""Game-level scoreboards for every kept tournament from 2016 on (2011-2015 are in early_games.csv).
Used for team-relative numbers: damage share, vision share, kill share, and the gap to teammates."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import cargo
HERE = os.path.dirname(__file__)
FIELDS = ("SP.OverviewPage=Page,SP.Link,SP.Role,SP.Team,SP.GameId,SP.Kills,SP.Deaths,SP.Assists,SP.Gold,SP.CS,"
          "SP.DamageToChampions=Dmg,SP.VisionScore=Vision,SP.PlayerWin=Win,SG.Gamelength_Number=Min,SP.DateTime_UTC=Date")

def main():
    s = list(csv.DictReader(open(os.path.join(HERE, "csv", "player_event_stats.csv"))))
    pages = sorted({r["Page"] for r in s if r["First"][:4] >= "2016"})
    out = []
    part, parts = (int(sys.argv[1]), int(sys.argv[2])) if len(sys.argv) > 2 else (0, 1)
    for n, i in enumerate(range(0, len(pages), 4)):
        if n % parts != part and parts > 1 and not os.environ.get("MERGE"):
            continue
        chunk = pages[i:i + 4]
        where = "SP.OverviewPage IN (%s)" % ",".join('"%s"' % p.replace('"', '\\"') for p in chunk)
        out += cargo.query("ScoreboardPlayers=SP,ScoreboardGames=SG", FIELDS, where=where, join_on="SP.GameId=SG.GameId")
        print(i + len(chunk), len(pages), len(out), flush=True)
    if parts > 1 and not os.environ.get("MERGE"):
        return
    with open(os.path.join(HERE, "csv", "games_2016on.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)

if __name__ == "__main__":
    main()

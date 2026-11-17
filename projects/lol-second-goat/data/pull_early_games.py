"""Game-level scoreboards for 2011-2015, to rebuild team kills, team gold and team CS that the
grouped scoreboards leave empty in early games (kill participation and resource share)."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import cargo
HERE = os.path.dirname(__file__)

def main():
    t = list(csv.DictReader(open(os.path.join(HERE, "csv", "tournaments.csv"))))
    s = list(csv.DictReader(open(os.path.join(HERE, "csv", "player_event_stats.csv"))))
    pages = sorted({r["Page"] for r in s if r["First"][:4] <= "2015"})
    out = []
    for i in range(0, len(pages), 6):
        chunk = pages[i:i + 6]
        where = "OverviewPage IN (%s)" % ",".join('"%s"' % p for p in chunk)
        out += cargo.query("ScoreboardPlayers", "OverviewPage=Page,Link,Role,Team,GameId,Kills,Deaths,Assists,Gold,CS", where=where)
        print(i + len(chunk), len(pages), len(out), flush=True)
    with open(os.path.join(HERE, "csv", "early_games.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)

if __name__ == "__main__":
    main()

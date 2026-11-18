"""Who won each game, 2011-2015 (ScoreboardGames), so Elo, clutch and plus-minus can cover Faker's 2013-15 and
Bengi's prime. Writes data/csv/early_winners.csv."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import cargo
HERE = os.path.dirname(__file__)

def main():
    s = list(csv.DictReader(open(os.path.join(HERE, "csv", "player_event_stats.csv"))))
    pages = sorted({r["Page"] for r in s if r["First"][:4] <= "2015"})
    out = []
    for i in range(0, len(pages), 6):
        chunk = pages[i:i + 6]
        where = "OverviewPage IN (%s)" % ",".join('"%s"' % p.replace('"', '\\"') for p in chunk)
        out += cargo.query("ScoreboardGames", "OverviewPage=Page,GameId,MatchId,Team1,Team2,WinTeam,DateTime_UTC=Date,N_GameInMatch", where=where)
        print(i + len(chunk), len(pages), len(out), flush=True)
    with open(os.path.join(HERE, "csv", "early_winners.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)

if __name__ == "__main__":
    main()

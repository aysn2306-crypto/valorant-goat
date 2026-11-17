"""Team vs team game results at international events (one scoreboard row per team per game)."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import cargo
HERE = os.path.dirname(__file__)

def main():
    t = list(csv.DictReader(open(os.path.join(HERE, "csv", "tournaments.csv"))))
    pages = sorted({r["OverviewPage"] for r in t if r["League"] in
                    ("World Championship", "Mid-Season Invitational", "First Stand", "Mid-Season Cup 2020")})
    where = "SP.OverviewPage IN (%s) AND SP.Role_Number=1" % ",".join('"%s"' % p for p in pages)
    rows = cargo.query("ScoreboardPlayers=SP", "SP.OverviewPage=Page,SP.Team=Team,SP.TeamVs=TeamVs,COUNT(*)=G,"
                       "SUM(SP.PlayerWin=\"Yes\")=W,MIN(SP.DateTime_UTC)=First", where=where,
                       group_by="SP.OverviewPage,SP.Team,SP.TeamVs")
    with open(os.path.join(HERE, "csv", "intl_team_games.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
    print(len(pages), "events,", len(rows), "team-vs-team rows")

if __name__ == "__main__":
    main()

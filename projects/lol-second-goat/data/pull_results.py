"""Top-4 placements with rosters for Worlds, MSI, First Stand and the major leagues (Leaguepedia Cargo)."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import cargo

LEAGUES = ["World Championship", "Mid-Season Invitational", "First Stand", "Mid-Season Cup 2020",
           "LoL The Champions", "LoL Champions Korea", "Tencent LoL Pro League",
           "Europe League Championship Series", "LoL EMEA Championship",
           "North America League Championship Series", "League of Legends Championship Series",
           "League of Legends Championship of The Americas North", "League of Legends Championship of The Americas",
           "LoL Master Series"]

def main():
    lg = ",".join('"%s"' % l for l in LEAGUES)
    rows = cargo.query(
        "TournamentResults=TR,Tournaments=T",
        "T.Name=Name,T.OverviewPage=Page,T.League=League,T.Region=Region,T.Year=Year,T.IsPlayoffs=IsPlayoffs,"
        "T.IsQualifier=IsQualifier,T.Split=Split,TR.Date=Date,TR.Place=Place,TR.Place_Number=PlaceN,TR.Team=Team,"
        "TR.Showmatch=Showmatch",
        where=f'T.League IN ({lg}) AND TR.Place_Number <= 16',
        join_on="TR.OverviewPage=T.OverviewPage", order_by="TR.Date")
    out = os.path.join(os.path.dirname(__file__), "csv", "results_top16.csv")
    with open(out, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
        w.writeheader(); w.writerows(rows)
    print(len(rows), "rows ->", out)

if __name__ == "__main__":
    main()

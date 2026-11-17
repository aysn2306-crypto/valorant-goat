"""Per player per tournament totals from Leaguepedia scoreboards, for every in-scope tournament."""
import csv, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
import cargo
from pull_results import LEAGUES

HERE = os.path.dirname(__file__)
SKIP = re.compile(r"Showmatch|All[- ]?Star|LPPL|Qualif|Promotion|Regional Finals|Relegation|Kickoff|Rift Rivals", re.I)


def tournaments():
    lg = ",".join('"%s"' % l for l in LEAGUES)
    rows = cargo.query("Tournaments", "Name,OverviewPage,League,Region,Year,DateStart,Date,IsPlayoffs,IsQualifier,Split,TournamentLevel",
                       where=f"League IN ({lg})", order_by="DateStart")
    keep = [r for r in rows if not SKIP.search(r["Name"]) and r["IsQualifier"] != "1"]
    with open(os.path.join(HERE, "csv", "tournaments.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(keep[0].keys())); w.writeheader(); w.writerows(keep)
    return keep


FIELDS = ("SP.OverviewPage=Page,SP.Link=Link,SP.Role=Role,SP.Team=Team,COUNT(*)=G,SUM(SP.PlayerWin=\"Yes\")=W,"
          "SUM(SP.Kills)=K,SUM(SP.Deaths)=D,SUM(SP.Assists)=A,SUM(SP.Gold)=Gold,SUM(SP.CS)=CS,"
          "SUM(SP.DamageToChampions)=Dmg,SUM(SP.TeamKills)=TK,SUM(SP.TeamGold)=TG,SUM(SG.Gamelength_Number)=Min,"
          "MIN(SP.DateTime_UTC)=First,MAX(SP.DateTime_UTC)=Last")


def main():
    pages = sorted({t["OverviewPage"] for t in tournaments()})
    print(len(pages), "tournaments")
    out = []
    for i in range(0, len(pages), 15):
        chunk = pages[i:i + 15]
        where = "SP.OverviewPage IN (%s)" % ",".join('"%s"' % p.replace('"', '\\"') for p in chunk)
        out += cargo.query("ScoreboardPlayers=SP,ScoreboardGames=SG", FIELDS, where=where,
                           join_on="SP.GameId=SG.GameId", group_by="SP.OverviewPage,SP.Link,SP.Role,SP.Team")
        print(i + len(chunk), len(out), flush=True)
    with open(os.path.join(HERE, "csv", "player_event_stats.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=list(out[0].keys())); w.writeheader(); w.writerows(out)
    print("rows", len(out))


if __name__ == "__main__":
    main()

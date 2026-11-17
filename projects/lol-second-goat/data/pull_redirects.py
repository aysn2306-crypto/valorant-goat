"""Map every scoreboard player link to the player's current Leaguepedia page (PlayerRedirects)."""
import csv, os, sys
sys.path.insert(0, os.path.dirname(__file__))
import cargo
HERE = os.path.dirname(__file__)

def main():
    links = sorted({r["Link"] for r in csv.DictReader(open(os.path.join(HERE, "csv", "player_event_stats.csv")))})
    out = []
    for i in range(0, len(links), 40):
        chunk = links[i:i + 40]
        where = "AllName IN (%s)" % ",".join('"%s"' % l.replace('"', '\\"') for l in chunk)
        out += cargo.query("PlayerRedirects", "AllName,OverviewPage", where=where)
    with open(os.path.join(HERE, "csv", "player_redirects.csv"), "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=["AllName", "OverviewPage"]); w.writeheader(); w.writerows(out)
    print(len(links), "links,", len(out), "redirect rows")

if __name__ == "__main__":
    main()

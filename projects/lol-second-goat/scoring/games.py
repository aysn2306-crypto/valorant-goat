"""Team strength from every game since 2016 (Elo), and what it feeds:
- opponent strength per team at each event (opponent-adjusted stats, title difficulty)
- clutch: best-of-five results and deciding games against what Elo expected

Input: data/csv/games_all.csv (2011 on, built by data/build_games_all.py) (one row per player per game; GameId = <match>_<game number>).
Output: data/csv/event_opp.csv, data/csv/clutch.csv. Games before 2016 have no win flag, so they are not covered."""
import os
import numpy as np
import pandas as pd

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
K, CARRY, BASE = 24, 0.75, 1500     # Elo step per game; 25% pulled back to the mean each new year


def team_games():
    g = pd.read_csv(os.path.join(CSV, "games_all.csv"), usecols=["Page", "Team", "GameId", "Win", "Date"])
    g = g.dropna(subset=["Team", "GameId", "Date"]).drop_duplicates(["GameId", "Team"])
    g["win"] = (g.Win == "Yes").astype(int)
    two = g.groupby("GameId").Team.transform("size") == 2
    g = g[two].sort_values(["Date", "GameId"])
    a = g.groupby("GameId").first().reset_index()
    b = g.groupby("GameId").last().reset_index()
    m = a.merge(b[["GameId", "Team", "win"]], on="GameId", suffixes=("", "_b"))
    m = m[m.win != m.win_b].rename(columns={"Team": "A", "Team_b": "B", "win": "a_win"})
    m["match"] = m.GameId.str.rsplit("_", n=1).str[0]
    m["game_no"] = pd.to_numeric(m.GameId.str.rsplit("_", n=1).str[1], errors="coerce")
    m["year"] = m.Date.str[:4].astype(int)
    return m.sort_values(["Date", "match", "game_no"]).reset_index(drop=True)


def elo(m):
    r, last_year = {}, {}
    pa, pb, ea = [], [], []
    for row in m.itertuples():
        for t in (row.A, row.B):
            if t in r and last_year[t] != row.year:
                r[t] = BASE + CARRY * (r[t] - BASE)
            r.setdefault(t, BASE)
            last_year[t] = row.year
        e = 1 / (1 + 10 ** ((r[row.B] - r[row.A]) / 400))
        pa.append(r[row.A]); pb.append(r[row.B]); ea.append(e)
        r[row.A] += K * (row.a_win - e)
        r[row.B] -= K * (row.a_win - e)
    m["elo_a"], m["elo_b"], m["exp_a"] = pa, pb, ea
    return m


def main():
    m = elo(team_games())
    # opponent strength each team met at each event (Elo before the game)
    side = pd.concat([m[["Page", "A", "elo_b"]].set_axis(["Page", "Team", "opp"], axis=1),
                      m[["Page", "B", "elo_a"]].set_axis(["Page", "Team", "opp"], axis=1)])
    ev = side.groupby(["Page", "Team"]).agg(opp_elo=("opp", "mean"), games=("opp", "size")).reset_index()
    ev.to_csv(os.path.join(CSV, "event_opp.csv"), index=False)

    # series: best-of-five = the winner took 3 games
    s = m.groupby("match").agg(Page=("Page", "first"), A=("A", "first"), B=("B", "first"), year=("year", "first"),
                               a_w=("a_win", "sum"), n=("a_win", "size"), elo_a=("elo_a", "first"), elo_b=("elo_b", "first")).reset_index()
    s["b_w"] = s.n - s.a_w
    s = s[(s.a_w == 3) | (s.b_w == 3)]
    p = 1 / (1 + 10 ** ((s.elo_b - s.elo_a) / 400))                 # one game
    # chance to take a best of five from the single-game chance
    q = 1 - p
    s["exp_a"] = p ** 3 * (1 + 3 * q + 6 * q ** 2)
    s["a_series"] = (s.a_w == 3).astype(int)
    # deciding game 5: the last game of a 3-2 series
    last = m[m.match.isin(s[s.n == 5].match)].sort_values("game_no").groupby("match").last().reset_index()
    rows = []
    pg = pd.read_csv(os.path.join(CSV, "games_all.csv"), usecols=["Link", "Team", "GameId"]).dropna()
    pg["match"] = pg.GameId.str.rsplit("_", n=1).str[0]
    roster = pg[pg.match.isin(s.match)].drop_duplicates(["match", "Team", "Link"])
    for r in s.itertuples():
        rows.append(dict(match=r.match, Page=r.Page, Team=r.A, year=r.year, kind="bo5", won=r.a_series, exp=r.exp_a))
        rows.append(dict(match=r.match, Page=r.Page, Team=r.B, year=r.year, kind="bo5", won=1 - r.a_series, exp=1 - r.exp_a))
    for r in last.itertuples():
        rows.append(dict(match=r.match, Page=r.Page, Team=r.A, year=r.year, kind="game5", won=r.a_win, exp=r.exp_a))
        rows.append(dict(match=r.match, Page=r.Page, Team=r.B, year=r.year, kind="game5", won=1 - r.a_win, exp=1 - r.exp_a))
    S = pd.DataFrame(rows).merge(roster[["match", "Team", "Link"]], on=["match", "Team"])
    S.to_csv(os.path.join(CSV, "clutch.csv"), index=False)
    print(len(m), "games,", len(s), "best-of-fives,", len(last), "game fives;", len(S), "player rows")


if __name__ == "__main__":
    main()

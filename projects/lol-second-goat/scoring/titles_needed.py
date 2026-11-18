"""Titles to reach Faker (ay 18 Nov, after the radar): for active players not on T1, how many more Worlds titles
(and how many dream seasons, a Worlds plus their league's main title) pass Faker's v12 score, Faker winning nothing
more. Trophies only: the other five parts stay where they are. Each Worlds is worth the 2026 Worlds at full
credit (base 110.3), each league title the 2026 final of the player's league at full credit. Writes
data/csv/titles_needed.csv."""
import os, re, pandas as pd, yaml
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSV = os.path.join(ROOT, "data", "csv")
CFG = yaml.safe_load(open(os.path.join(ROOT, "config", "weights.yaml")))
W = pd.Series(CFG["pillars"], dtype=float)
P = pd.read_csv(os.path.join(CSV, "draft_scores.csv"), index_col=0)
T = pd.read_csv(os.path.join(CSV, "title_credits.csv"))
C = P[["c_" + k for k in W.index]].copy(); C.columns = W.index
g = pd.read_csv(os.path.join(CSV, "games_all.csv"), usecols=["Link", "Team", "Date", "Page"])
g = g[g.Date.astype(str).str[:4] == "2026"]
T1_NOW = set(g[g.Team == "T1"].Link.value_counts().loc[lambda v: v >= 20].index)
WORLDS = T[(T.tier == "worlds") & (T.year == 2026) & (T.place == 1)].base.iloc[0]
LEAGUE = {"LCK": "LCK 2026 Season Playoffs", "LPL": "LPL 2026 Grand Finals", "LEC": "LEC 2026 Summer Playoffs",
          "LCS": "LCS 2026 Summer Playoffs"}
d26 = T[(T.tier == "domestic") & (T.place == 1) & (T.year == 2026)].groupby("event").base.first()
FK = "Faker"

def score(pts):
    c = C.copy(); c["trophies"] = pts / pts.max() * 100
    return (c[W.index] * W).sum(axis=1) / W.sum()

def needed(l, add):
    for k in range(0, 21):
        p = P.trophy_pts.copy(); p[l] += k * add
        s = score(p)
        if s[l] > s[FK]:
            return k, round(s[l], 1), round(s[FK], 1)
    return None, None, None

names = ["Knight", "Chovy", "Ruler", "Bin", "Zeus", "Canyon", "Viper", "Caps", "Gumayusi", "Kiin", "TheShy",
         "JackeyLove", "Scout", "Rookie", "Peanut", "Deft", "Uzi"]
rows = []
for nm in names:
    l = P.index[P.name == nm][0]
    league = g[g.Link == l].Page.str.extract(r"^(LCK|LPL|LEC|LCS)")[0].mode()
    active = len(league) > 0
    if l in T1_NOW or not active:
        continue
    dom = d26[LEAGUE[league.iloc[0]]]
    w, s_w, f_w = needed(l, WORLDS)
    y, s_y, f_y = needed(l, WORLDS + dom)
    rows.append(dict(link=l, name=nm, league=league.iloc[0], rank=int(P.score.rank(ascending=False)[l]),
                     score_now=round(P.score[l], 1), worlds_now=int(P.worlds_titles[l]), worlds_needed=w,
                     score_after_worlds=s_w, faker_after_worlds=f_w, dream_seasons_needed=y,
                     score_after_seasons=s_y, faker_after_seasons=f_y))
out = pd.DataFrame(rows).sort_values(["worlds_needed", "rank"])
out.to_csv(os.path.join(CSV, "titles_needed.csv"), index=False)
print("excluded (T1 now):", sorted(T1_NOW), "| Worlds value", round(WORLDS, 1))
print(out.to_string(index=False))

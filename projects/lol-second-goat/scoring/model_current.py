"""Writes MODEL-CURRENT.md (the one file every thread reads) from the saved scores. Header text lives in config/model_notes.md."""
import os, pandas as pd, yaml
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__))); CSV = os.path.join(ROOT, "data", "csv")
CFG = yaml.safe_load(open(os.path.join(ROOT, "config", "weights.yaml"))); W = pd.Series(CFG["pillars"], dtype=float)
P = pd.read_csv(os.path.join(CSV, "draft_scores.csv"), index_col=0).sort_values("score", ascending=False)
L = lambda n: P.index[P.name == n][0]
cols = ["c_" + k for k in W.index]
t = P.head(16)[["name", "role", "score", "trophy_pts", "worlds_titles"] + cols].copy()
t.insert(3, "pct_of_faker", (t.score / P.score.max() * 100).round(0).astype(int))
t.columns = ["Player", "Role", "Score", "% of Faker", "Trophy pts", "Worlds"] + [f"{k.replace('_', ' ')} ({int(W[k])})" for k in W.index]
t.insert(0, "Rank", range(1, 17))
C = P[cols]; C.columns = W.index
def gap(a, b, tw):
    w = W.copy(); r = W.drop("trophies"); w[r.index] = r / r.sum() * (100 - tw); w["trophies"] = tw
    sc = (C * w).sum(axis=1); return sc[L(a)] - sc[L(b)]
cross = next((tw for tw in range(30, 91) if gap("Ruler", "Chovy", tw) > 0), None)
sf = pd.read_csv(os.path.join(CSV, "draft_scores_split_faker.csv")).sort_values("score", ascending=False).reset_index(drop=True)
sfm = sf.head(14)[["name", "score"]].round(1); sfm.insert(0, "Rank", range(1, 15))
io = pd.read_csv(os.path.join(CSV, "whatif_intl_only.csv"))[["name", "score"]]
kn = pd.read_csv(os.path.join(CSV, "whatif_knight_needs.csv")); fw = pd.read_csv(os.path.join(CSV, "whatif_four_worlds.csv"))
import re as _re
kn2 = f"{int(pd.read_csv(os.path.join(ROOT, 'data', 'csv', 'shuffle_counts.csv'), index_col=0).seconds.get('Knight (Zhuo Ding)', 0)):,}"   # from the saved reruns, not a log file
rk = P.score.rank(ascending=False).astype(int)
notes = open(os.path.join(ROOT, "config", "model_notes.md")).read()
doc = f"""{notes}
## How the score is added up
Each part is 0 to 100: pool median = 50, best player = 100 (trophies: Faker = 100, the rest in proportion). Score = weighted sum:
{', '.join(f"{k.replace('_', ' ')} {int(v)}" for k, v in W.items())}. {len(P)} players with 150+ games. A raw 60 is already top 2-3%,
so **on screen show rank and % of Faker, not the raw score.**

## Top 16 with part scores
{t.round(1).to_markdown(index=False)}

Weight reruns (each weight moved up to 30%, 1,000 times): Faker #1 in 1,000; Knight #2 in {kn2} (see whatif.py output).
Players above 70: {(P.score > 70).sum()}. Caps #{rk[L('Caps')]} ({round(P.score[L('Caps')] / P.score.max() * 100)}% of Faker). Uzi #{rk[L('Uzi')]}. Bengi #{rk[L('Bengi')]}.

## Twists and what-ifs
**International trophies only:** {', '.join(f"{r.name} {r.score}" for r in io.itertuples())}.

**Two Fakers (2013-19 and 2020-26, even halves by years, 3 Worlds each; ay 17:23):** {(sf.score > 70).sum()} players above 70 in this version.
{sfm.to_markdown(index=False)}
Faker 2020-26 is #{int(sf.index[sf.name == 'Faker 2020-26'][0]) + 1} at {sf.score[sf.name == 'Faker 2020-26'].iloc[0]:.1f}. Weight reruns in this version: #1 Faker 2013-19 951, Knight 49.

**What Knight or Gumayusi need to pass Faker:** on hold (ay 16:57). The old frozen-stats tables were wrong (they only added trophies) and are removed.

**Ruler vs Chovy:** gap {gap('Ruler', 'Chovy', W['trophies']) / 100:+.1f} for Ruler at the current weights. Ruler passes Chovy once trophies are {cross}% or more of the score.

## Known limits (say them on screen)
- Bengi and other setup junglers: box scores can't see them.
- Best of five and plus-minus data start in 2016, so Faker's 2013 to 2015 series and games aren't in clutch or team impact.
- Intangibles are proxies (All-Pro votes, team record with and without). Uzi (Hall of Legends) sits low because the Hall honours impact and fame while we weight titles at 40%.
"""
open(os.path.join(ROOT, "MODEL-CURRENT.md"), "w").write(doc)
print("written", len(doc))

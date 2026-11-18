"""Team impact (v12, ay 18 Nov 19:14): plus-minus (RAPM) over every game since 2011.
log-odds(team A wins) = sum over A's players of (career rating + season rating) minus B's, ridge-shrunk logistic
regression. Season keys alone cannot tell five players apart when they play every game together (half of all
seasons got a rating identical to a teammate's, audit 18 Nov); the career key is identified by roster changes
across years, so stable rosters split. A season's rating is career + season. Writes data/csv/rapm_seasons.csv and
rapm_career.csv. Run from the project folder."""
import sys, numpy as np, pandas as pd, scipy.sparse as sp
from sklearn.linear_model import LogisticRegression
sys.path.insert(0, 'scoring'); import score
g = pd.read_csv('data/csv/games_all.csv', usecols=['Page', 'Link', 'Role', 'Team', 'GameId', 'Win', 'Date'])
g['Link'] = [score.redirect(l) for l in g.Link]
g['year'] = g.Date.astype(str).str[:4].astype(int)
g = g[g.Win.isin(['Yes', 'No'])]
# keep games with exactly 2 teams x 5
n = g.groupby('GameId').Team.agg(['nunique', 'size']); ok = n[(n['nunique'] == 2) & (n['size'] == 10)].index
g = g[g.GameId.isin(ok)].copy()
g['key'] = g.Link + '|' + g.year.astype(str)
keys = pd.Index(sorted(g.key.unique())); players = pd.Index(sorted(g.Link.unique()))
games = pd.Index(sorted(g.GameId.unique())); gix = pd.Series(range(len(games)), index=games)
first = g.groupby('GameId').Team.min()   # team A = alphabetically first team in the game
g['side'] = np.where(g.Team.values == first.reindex(g.GameId).values, 1.0, -1.0)
nk, rows = len(keys), gix[g.GameId].values
Xs = sp.csr_matrix((g.side.values, (rows, pd.Series(range(nk), index=keys)[g.key].values)), shape=(len(games), nk))
Xc = sp.csr_matrix((g.side.values, (rows, pd.Series(range(len(players)), index=players)[g.Link].values)), shape=(len(games), len(players)))
X = sp.hstack([Xs, Xc]).tocsr()
yA = g[g.side == 1].groupby('GameId').Win.first().reindex(games).eq('Yes').astype(int).values
X2 = sp.vstack([X, -X]); y2 = np.concatenate([yA, 1 - yA])   # symmetric, so no intercept bias
m = LogisticRegression(C=0.05, fit_intercept=False, max_iter=5000).fit(X2, y2)
cs = pd.Series(m.coef_[0][:nk], index=keys); cc = pd.Series(m.coef_[0][nk:], index=players)
ps = pd.DataFrame({'key': keys}); ps[['Link', 'year']] = ps.key.str.split('|', expand=True); ps.year = ps.year.astype(int)
ps['r'] = cs.values + cc.reindex(ps.Link).values
gp = g.groupby('key').size(); ps['G'] = gp.reindex(ps.key).values
ps['waa'] = ps.G * ps.r / 4    # wins above an average player (logistic slope 1/4 at 50%)
car = ps.groupby('Link').agg(waa=('waa', 'sum'), G=('G', 'sum'), best=('r', 'max'))
car = car[car.G >= 150].sort_values('waa', ascending=False)
car.to_csv('data/csv/rapm_career.csv')
ps[['key', 'r', 'Link', 'year', 'G', 'waa']].to_csv('data/csv/rapm_seasons.csv', index=False)
p10 = ps[ps.G >= 10].assign(rr=lambda d: d.r.round(6))
print('games', len(games), 'player-seasons', nk, 'identical-to-teammate share:', round(p10.duplicated(['year', 'rr'], keep=False).mean(), 3))
print(car.head(15).round(2).to_string())

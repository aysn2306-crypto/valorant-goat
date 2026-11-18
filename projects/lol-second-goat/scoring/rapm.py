"""Team impact (v10, ay 18 Nov): plus-minus (RAPM) over every game from 2016 on. log-odds(team A wins) = sum of A's player-season ratings minus B's, ridge-shrunk logistic regression. Writes data/csv/rapm_seasons.csv. Run from the project folder."""
import sys, numpy as np, pandas as pd, scipy.sparse as sp
from sklearn.linear_model import LogisticRegression
sys.path.insert(0,'scoring'); import score
g=pd.read_csv('data/csv/games_all.csv',usecols=['Page','Link','Role','Team','GameId','Win','Date'])
g['Link']=[score.redirect(l) for l in g.Link]
g['year']=g.Date.astype(str).str[:4].astype(int)
g=g[g.Win.isin(['Yes','No'])]
# keep games with exactly 2 teams x 5
n=g.groupby('GameId').Team.agg(['nunique','size']); ok=n[(n['nunique']==2)&(n['size']==10)].index
g=g[g.GameId.isin(ok)].copy()
g['key']=g.Link+'|'+g.year.astype(str)
keys=pd.Index(sorted(g.key.unique())); kix=pd.Series(range(len(keys)),index=keys)
games=pd.Index(sorted(g.GameId.unique())); gix=pd.Series(range(len(games)),index=games)
# team A = alphabetically first team in game
first=g.groupby('GameId').Team.min()
g['side']=np.where(g.Team.values==first.reindex(g.GameId).values,1.0,-1.0)
X=sp.csr_matrix((g.side.values,(gix[g.GameId].values,kix[g.key].values)),shape=(len(games),len(keys)))
yA=g[g.side==1].groupby('GameId').Win.first().reindex(games).eq('Yes').astype(int).values
# symmetric augmentation so no intercept bias
X2=sp.vstack([X,-X]); y2=np.concatenate([yA,1-yA])
for C in [0.05]:
    m=LogisticRegression(C=C,fit_intercept=False,max_iter=3000).fit(X2,y2)
r=pd.Series(m.coef_[0],index=keys)
ps=pd.DataFrame({'key':keys,'r':r.values}); ps[['Link','year']]=ps.key.str.split('|',expand=True); ps.year=ps.year.astype(int)
gp=g.groupby('key').size(); ps['G']=gp.reindex(ps.key).values
ps['waa']=ps.G*ps.r/4    # wins above an average player (logistic slope 1/4 at 50%)
car=ps.groupby('Link').agg(waa=('waa','sum'),G=('G','sum'),best=('r','max'))
car=car[car.G>=150].sort_values('waa',ascending=False)
car.to_csv('data/csv/rapm_career.csv')
ps.to_csv('data/csv/rapm_seasons.csv',index=False)
print('games',len(games),'player-seasons',len(keys))
print(car.head(25).round(2).to_string())

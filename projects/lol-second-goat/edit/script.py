"""The video script, beat by beat. Every number is read from video/src/data/league.json, so a rerun of the model
rewrites the narration and the graphics together. Each beat = one scene + the lines spoken over it.
Cue strings in props: "@k" = frame where line k starts (inside the beat), "@k+n" = n frames later, "@end" = beat end.
Written in ay's voice (first person). No dashes: the copy lint refuses them."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = json.load(open(os.path.join(ROOT, "video", "src", "data", "league.json")))
P = {p["id"]: p for p in D["players"]}
RANK = [p["id"] for p in D["players"]]
W = D["meta"]["weights"]


def nm(i):
    return P[i]["name"]


def rk(i):
    return P[i]["rank"]


def num(x, d=0):
    return f"{x:,.{d}f}"


def ordinal(n):
    return f"{n}{'th' if 11 <= n % 100 <= 13 else {1: 'st', 2: 'nd', 3: 'rd'}.get(n % 10, 'th')}"


WORDS = {1: "one", 2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten"}


def w(n):
    return WORDS.get(n, str(n))


def val(model, set_="held-out test (2022-2026)", key="first_team_hit"):
    for r in D["validation"]:
        if r["model"] == model and r["set"] == set_:
            return r[key]


def board(cat, k=5):
    return D["boards"][cat][:k]


NAMES = dict(trophies="Trophies", big_stage="Big stage", peak="Peak", longevity="Longevity", winning="Winning",
             consistency="Consistency", laning="Laning", killing="Killing", teamfight="Teamfighting", clean_play="Clean play",
             vision="Vision", team_carry="Team carry", solo_carry="Solo carry", recognition="Recognition", team_lift="Team lift")

B = []          # beats


def beat(scene, props, lines, chapter=None, tail=14, sfx=None):
    if scene == "chapter":
        tail = 85
    B.append(dict(scene=scene, props=props, lines=lines, chapter=chapter, tail=tail, sfx=sfx or []))


def cat_rows(cat, ids, statfn, value="raw"):
    top = P[ids[0]]["raw"][cat] or 1
    return [dict(id=i, stat=statfn(i)[0], statLabel=statfn(i)[1], value=round(100 * (P[i]["raw"][cat] or 0) / top, 1)) for i in ids]


TOP = RANK[:12]
two, three, four, five = RANK[1], RANK[2], RANK[3], RANK[4]
FAKER = "faker"
fk = P[FAKER]

# ---------------------------------------------------------------- COLD OPEN
CH = "Cold open"
beat("worlds", dict(team="Bilibili Gaming", ids=["bin", "xun", "knight", "viper", "on"], score="3 – 1", opp="Gen.G",
                    place="Barclays Center, New York", date="14 Nov 2026", mvp="knight", tTeam="@0", tScore="@1", tMvp="@2"),
     ["Worlds just ended. Bilibili Gaming are world champions.",
      "They beat Gen.G three games to one in New York.",
      "Knight was Finals MVP, the first Chinese mid laner to win Worlds, and Viper now has two world titles."], chapter=CH,
     sfx=[("whoosh.mp3", "@0", 0.35), ("impact-bass-1.mp3", "@2", 0.45)])
beat("fakersix", dict(years=[2013, 2015, 2016, 2023, 2024, 2025], t0="@1", tSlot="@3"),
     ["But one name still sits above everyone.",
      "Faker has six Worlds titles. Nobody else has more than three.",
      "Nobody argues about the greatest of all time in League.",
      "The real argument is who comes second."], chapter=CH, sfx=[("pop.mp3", "@1", 0.3), ("riser.mp3", "@3", 0.3)])
WALL = [i for i in ["knight", "keria", "ruler", "chovy", "viper", "canyon", "uzi", "bin", "zeus", "oner", "gumayusi", "deft",
                    "rookie", "theshy", "showmaker", "caps", "rekkles", "bengi", "peanut", "meiko", "kanavi", "marin", "bang", "mata"] if i in P]
beat("wall", dict(ids=WALL, cols=8, size=150, title="Who is #2?", at="@0"),
     ["Is it Knight, after that run? Viper, with two rings? Keria? Ruler? Chovy? Uzi?",
      "Everyone has an opinion. So I stopped guessing and built a model."], chapter=CH)
beat("numbers", dict(title="What went into it", items=[
    dict(v=D["meta"]["tournaments"], label="tournaments", at="@0"),
    dict(v=D["meta"]["games"], label="pro games", at="@0+12"),
    dict(v=D["meta"]["players"], label="players", at="@0+24"),
    dict(v=D["meta"]["lastYear"] - D["meta"]["firstYear"] + 1, label="seasons", at="@0+36")]),
     [f"Every major league and every international event from {D['meta']['firstYear']} to Worlds {D['meta']['lastYear']}. "
      f"{num(D['meta']['games'])} games and {num(D['meta']['players'])} players.",
      "Fifteen categories, tested against the experts, then run a thousand different ways.",
      "This is who the data says is the second greatest League of Legends player of all time."], chapter=CH)
beat("statement", dict(text="WHO IS #2 AFTER FAKER?", sub="a data investigation", field="orange"), ["Let's find out."], chapter=CH, tail=24,
     sfx=[("impact-bass-1.mp3", "@0", 0.5)])

# ---------------------------------------------------------------- 1. THE RULES
CH = "The rules"
beat("chapter", dict(n=1, name="The rules", line="Set before looking at a single name.", field="dark"), [], chapter=CH, tail=50,
     sfx=[("whoosh.mp3", 0, 0.35)])
beat("formula", dict(title="Four rules, set before the results", lines=[
    dict(t="1. Everyone is ranked the same way, [[Faker included]].", at="@0"),
    dict(t="2. Trophies count at [[full value]], and {{Worlds}} counts the most.", at="@1"),
    dict(t="3. You only get credit for a title you [[carried your share of]].", at="@2"),
    dict(t="4. Stats are compared [[inside your role and your year]], and weaker regions count for less.", at="@3")]),
     ["Four rules, locked in before I looked at any results.",
      "One. Everyone goes through the same formula. Faker too. No special treatment.",
      "Two. Trophies count at full value. A Worlds title is worth a Worlds title, whether it is your first or your sixth.",
      "Three. Winning on a stacked team is not the same as carrying one. Your credit depends on how you played next to your teammates.",
      "Four. A support is compared to supports, a 2014 jungler to 2014 junglers, and a domestic title counts more in a stronger region."],
     chapter=CH)

# ---------------------------------------------------------------- 2. THE DATA
CH = "The data"
beat("chapter", dict(n=2, name="The data", line="Fifteen seasons of pro League.", field="dark"), [], chapter=CH, tail=50, sfx=[("whoosh.mp3", 0, 0.35)])
beat("timeline", dict(title="Every world champion", sub="2011 to 2026", t0="@0", step=7),
     ["Here is every world champion since season one.",
      "Korea won seven in a row from 2013. China broke through in 2018, and since then it has been a two-region fight.",
      "That matters, because a title from a strong region is harder to win."], chapter=CH)
rs = D["regionStrength"]
yrs = sorted(int(y) for y in rs)
ser = []
for r, c in [("LCK", "#22D3EE"), ("LPL", "#FF5A5F"), ("LEC", "#F59E0B"), ("LCS", "#A78BFA")]:
    ser.append(dict(name=r, color=c, pts=[[y, rs[str(y)][r]] for y in yrs if y >= 2013], at="@1"))
beat("line", dict(title="How strong is each region?", sub="from head-to-head games at Worlds, MSI and First Stand; best region each year = 1.0",
                  series=ser, x0=2013, x1=2026, y0=0, y1=1.05, yTicks=[0, 0.25, 0.5, 0.75, 1.0], yFmt="d1", xTicks=list(range(2013, 2027, 2)),
                  axis="year", yAxis="region strength", dur=70),
     ["So I measured region strength from the only games where regions actually meet: international events.",
      "Every cross-region game goes into a rating, like chess Elo for regions.",
      "Korea and China sit at the top most years. Europe peaked around 2018 to 2020. North America has mostly sat near the bottom.",
      "A domestic title is multiplied by that number. An LCK title is worth about twice an LCS one."], chapter=CH)
beat("numbers", dict(title="Who made the list", items=[
    dict(v=D["meta"]["pool"], label=f"players with {D['meta']['minGames']}+ games", at="@0"),
    dict(v=D["meta"]["minGames"], label="minimum games", at="@0+14")]),
     [f"To make the list you need at least {D['meta']['minGames']} games in a major league or at an international. "
      f"That leaves {D['meta']['pool']} players.",
      "Fewer games than that and a hot streak looks like greatness."], chapter=CH)

# ---------------------------------------------------------------- 3. THE FORMULA
CH = "The formula"
beat("chapter", dict(n=3, name="The formula", line="How a career becomes one number.", field="bone"), [], chapter=CH, tail=50, sfx=[("whoosh.mp3", 0, 0.35)])
tp = D["meta"]["trophyPoints"]
beat("formula", dict(title="Trophy points", sub="by tier, full value, no diminishing returns", lines=[
    dict(t=f"{{{{Worlds}}}}: win {tp['worlds']['1']} · final {tp['worlds']['2']} · semis {tp['worlds']['3']} · quarters {tp['worlds']['5']}", at="@0"),
    dict(t=f"[[MSI]]: win {tp['msi']['1']} · final {tp['msi']['2']} · semis {tp['msi']['3']}", at="@1"),
    dict(t=f"[[First Stand]]: win {tp['first_stand']['1']} · final {tp['first_stand']['2']}", at="@1+10"),
    dict(t=f"Domestic title: {tp['domestic']['1']} × region strength · final {tp['domestic']['2']} × strength", at="@2"),
    dict(t=f"Worlds Finals MVP +{tp['awards']['worlds_mvp']} · MSI MVP +{tp['awards']['msi_mvp']}", at="@3", small=True)]),
     ["First, trophies. A Worlds title is worth 100 points. Making the final is 60, semis 35.",
      "MSI is worth half of Worlds. First Stand half again.",
      "A domestic title is 20, times the strength of that region in that year.",
      "And a Finals MVP adds a bonus on top."], chapter=CH)
cred = next(x for x in D["worlds"] if x["year"] == 2026)
bars = [dict(label=p[1], v=p[2], at=f"@1+{6 * k}", hi=k == 0, photo=p[0] if p[0] in P else None) for k, p in enumerate(sorted(cred["players"], key=lambda x: -x[2]))]
beat("hbars", dict(title="Carry share: Worlds 2026, Bilibili Gaming", sub="credit for the same trophy, from each player's impact vs his own teammates",
                   bars=bars, max=1.6, fmt="d2", ref=dict(v=1.0, label="1.0 = average teammate")),
     ["Then comes the carry share. Every player on a winning team gets credit between half and one and a half times the points.",
      f"For Worlds 2026, Knight gets {bars[0]['v']:.2f} times, so his title is worth {round(100 * bars[0]['v'])} points.",
      f"{bars[-1]['label']} gets {bars[-1]['v']:.2f}. Same trophy, different share.",
      "That is how the model tells carrying a team from being carried."], chapter=CH)
FW = D["fittedWeights"]
fwl = [("gd15", "gold lead at 15 min"), ("kda", "KDA"), ("kills_pm", "kills per minute"), ("xpd15", "XP lead at 15"), ("dshare", "damage share"),
       ("csd15", "CS lead at 15"), ("dpm", "damage per minute"), ("kp", "kill participation"), ("vis_pm", "vision score")]
fwl = sorted(fwl, key=lambda x: -FW[x[0]])
beat("hbars", dict(title="Which stats do the experts reward?", sub="fitted on 3,951 player-splits of All-Pro voting, 2015 to 2026",
                   bars=[dict(label=l, v=max(0, FW[k]), at=f"@1+{5 * i}", hi=i < 3) for i, (k, l) in enumerate(fwl)], max=max(FW[k] for k, _ in fwl) * 1.1, fmt="d2"),
     ["Next, the stats. I didn't want to pick the stat weights by gut feeling, so I let the experts pick them.",
      "Every split, casters, coaches and journalists vote for the All-Pro teams: the best player in each role.",
      f"I fed the model every split's stats and the votes, and asked which numbers predict who gets picked. "
      f"The answer: your lead in lane at 15 minutes, your KDA and your kills.",
      "Those learned weights turn every season into one rating, which feeds most of the categories you'll see."], chapter=CH)
cats = list(W.keys())
beat("formula", dict(title="Fifteen categories", sub="weights add up to 100", lines=[
    dict(t=" · ".join(f"{NAMES[c]} {int(W[c])}" for c in cats[:5]), at="@0"),
    dict(t=" · ".join(f"{NAMES[c]} {int(W[c])}" for c in cats[5:10]), at="@1"),
    dict(t=" · ".join(f"{NAMES[c]} {int(W[c])}" for c in cats[10:]), at="@2"),
    dict(t="Each category: your percentile in the pool, 0 to 100. Final score = weighted average.", at="@3", small=True)]),
     [f"All of that lands in fifteen categories. Trophies are the biggest at {int(W['trophies'])} percent, then big stage form and peak.",
      "Then the parts of the game: laning, killing, teamfighting, vision, clean play.",
      "And the League stuff: who carried their team, who carried a weak team, and two proxies for the things stats can't see.",
      "Each category ranks all the players from 0 to 100, and the final score is the weighted average."], chapter=CH)
ca = D["variants"].get("career_avg")
if ca:
    order_b = RANK[:15]
    rows = []
    rank_b = {i: k + 1 for k, i in enumerate(RANK)}
    for i in dict.fromkeys([x for x, _ in ca["top"][:15]] + order_b):
        if i in P:
            sc_a = next((s for x, s in ca["top"] if x == i), None)
            rows.append(dict(id=i, a=sc_a if sc_a else 0, b=P[i]["score"], ra=ca["rank"].get(i, 99), rb=rank_b[i]))
    fr = ca["rank"].get(FAKER)
    beat("rankshift", dict(title="My first ranking was wrong", sub="career averages vs each player's best five years", rows=rows, tSwap="@3",
                           labelA="career averages", labelB="best five years", focus=[FAKER], stamp=dict(text="WRONG", at="@1")),
         [f"And my first ranking was wrong. Faker came out {ordinal(fr)}.",
          "The problem was averages. Every year after his peak pulled his average down.",
          "So a player who stayed great for thirteen years looked worse than one who retired at his best.",
          "The fix: big stage, winning and stat categories use each player's best five years. Longevity gets its own category, so a long career is never punished."],
         chapter=CH, sfx=[("impact-bass-1.mp3", "@1", 0.4), ("whoosh.mp3", "@3", 0.35)])

# ---------------------------------------------------------------- 4. IS IT ACCURATE?
CH = "Is it accurate?"
beat("chapter", dict(n=4, name="Is it accurate?", line="Testing the model against the experts.", field="dark"), [], chapter=CH, tail=50, sfx=[("whoosh.mp3", 0, 0.35)])
chance = val("m_fitted", key="chance_first_team") * 100
beat("hbars", dict(title="Does it pick the same players as the voters?", sub="held-out seasons 2022 to 2026, never used to fit the model; % of roles where our #1 = the 1st-team All-Pro",
                   bars=[dict(label="random pick", v=chance, at="@1"),
                         dict(label="my first formula", v=val("m_v3_impact") * 100, at="@1+10"),
                         dict(label="team win rate only", v=val("m_win_only") * 100, at="@2"),
                         dict(label="final model", v=val("m_fitted") * 100, at="@3", hi=True)], max=80, fmt="pct"),
     ["So is any of this right? I tested it on seasons the model never saw.",
      f"I trained it on 2015 to 2021, then asked it to pick the first-team All-Pro in every role from 2022 to 2026. Picking at random gets about {round(chance)} percent.",
      f"My first formula got {round(val('m_v3_impact') * 100)}. Just picking the player from the best team gets {round(val('m_win_only') * 100)}, because voters love winners.",
      f"The final model gets {round(val('m_fitted') * 100)} percent, and the player it picks lands somewhere on the All-Pro teams {round(val('m_fitted', key='all_pro_overlap') * 100)} percent of the time."],
     chapter=CH)
beat("formula", dict(title="What the model can't see", sub="honest blind spots", lines=[
    dict(t="[[Shotcalling and comms]]: no public data. Proxy only.", at="@1"),
    dict(t="[[Champion pool and draft value]]: not measured.", at="@2"),
    dict(t="[[Team strength]]: partly handled by carry share and solo carry.", at="@3"),
    dict(t="[[Early seasons]]: 2011 to 2013 have thin stats; damage before 2014 is missing.", at="@4")]),
     ["It is not perfect, and here is where it is blind.",
      "Shotcalling and comms. Nobody publishes who makes the calls, so I can only use proxies, and I'll show you those at the end.",
      "Champion pool and what a player brings to the draft.",
      "Team strength is only partly fixed by carry share. Being on a great team still helps.",
      "And the early seasons have thin data. The numbers are better from 2014 on."], chapter=CH)
bengi = P.get("bengi")
if bengi:
    beat("card", dict(id="bengi", rank=bengi["rank"], tName=0, profileAt="@1", lines=[
        dict(k="Worlds titles", v=str(bengi["titles"]["worlds"]), at="@0+10"),
        dict(k="Gold lead at 15", v=f"{bengi['stats'].get('gd15') or 0:+.0f}", at="@1"),
        dict(k="Kills per game", v=f"{bengi['stats'].get('kills_pg'):.1f}", at="@1+10"),
        dict(k="Overall rank", v=f"#{bengi['rank']}", at="@2")]),
        [f"The best example is Bengi. Three Worlds titles next to Faker.",
         "But his box score is quiet: few kills and no lane leads, because his job was enabling everyone else.",
         f"So the model has him at {ordinal(bengi['rank'])}. If you think that's too low, you're probably right, and that's exactly what stats can't see."],
        chapter=CH)

# ---------------------------------------------------------------- 5. THE CATEGORIES
CATS = [
    ("trophies", "The resume", "Points from every title and deep run, times carry share.",
     lambda i: (f"{P[i]['titles']['worlds']} Worlds · {P[i]['titles']['msi']} MSI", f"{num(P[i]['trophyPts'])} trophy points"),
     "trophy points (log scale)"),
    ("big_stage", "Big stage", "Season rating at Worlds, MSI and First Stand, best five years.",
     lambda i: (f"{P[i]['stats'].get('intl_games')} international games", f"{P[i]['stats'].get('intl_wr')}% won"), "rating at internationals (SD above role average)"),
    ("peak", "Peak", "The best single calendar year, against the same role that year.",
     lambda i: (f"best year {P[i]['peakYear']}", f"{P[i]['raw']['peak']:+.2f} SD above role"), "best-year rating (SD above role average)"),
    ("longevity", "Longevity", "Years at an elite level: 20+ games, clearly above the role average.",
     lambda i: (f"{P[i]['eliteYears']} elite years", P[i]["years"]), "elite years"),
    ("winning", "Winning", "Win rate, scaled by region strength, best five years.",
     lambda i: (f"{P[i]['stats'].get('wr')}% of games won", f"{num(P[i]['games'])} games"), "region-adjusted win rate above 50%"),
    ("laning", "Laning", "Gold, CS and XP lead over the opposite laner at 15 minutes.",
     lambda i: (f"{P[i]['stats'].get('gd15') or 0:+.0f} gold at 15", f"{P[i]['stats'].get('csd15') or 0:+.1f} CS at 15"), "laning rating (SD above role average)"),
    ("killing", "Killing", "Kills per minute and damage per minute against the same role.",
     lambda i: (f"{P[i]['stats'].get('kills_pg')} kills a game", f"{P[i]['stats'].get('dpm') or 0:.0f} damage a minute"), "killing rating (SD above role average)"),
    ("teamfight", "Teamfighting", "Share of the team's damage, and share of the team's kills you were part of.",
     lambda i: (f"{P[i]['stats'].get('dshare')}% of team damage", f"{P[i]['stats'].get('kp')}% kill participation"), "teamfight rating (SD above role average)"),
    ("vision", "Vision and supporting", "Vision score and assists per minute, against the same role.",
     lambda i: (f"{P[i]['stats'].get('vis_pm')} vision a minute", f"{P[i]['role']}"), "vision rating (SD above role average)"),
    ("team_carry", "MVP of the team", "How far above his own four teammates a player rated, every event.",
     lambda i: (f"{P[i]['raw']['team_carry']:+.2f} SD over his teammates", P[i]["regions"]), "gap to own teammates (SD)"),
    ("solo_carry", "Solo carry", "Trophy points earned above teammates, worth more when the teammates were weaker.",
     lambda i: (f"{P[i]['soloCarryPts']} carry points", f"{P[i]['titles']['worlds']} Worlds"), "carry points (log scale)"),
    ("clean_play", "Clean play", "KDA and deaths per minute against the same role.",
     lambda i: (f"KDA {P[i]['stats'].get('kda')}", f"{P[i]['stats'].get('deaths_pg')} deaths a game"), "clean-play rating (SD above role average)"),
    ("consistency", "Consistency", "Share of events where he played above his role's average.",
     lambda i: (f"{P[i]['raw']['consistency'] * 100:.0f}% of events above par", P[i]["years"]), "share of events above average"),
    ("recognition", "Intangibles 1: what the voters saw", "PROXY: All-Pro and MVP votes per split (LCK and LPL votes recorded from 2020).",
     lambda i: (f"{P[i]['allpro']} All-Pro points", f"{P[i]['coveredSplits']} splits with a vote"), "vote points per split"),
    ("team_lift", "Intangibles 2: does the team win more with him?", "PROXY: team win rate with him vs the same team without him, two years either side.",
     lambda i: (f"{P[i]['teamLift']:+.1f} points of win rate", P[i]["regions"]), "team win rate with him minus without (points)"),
]

SPOKEN = dict(
    trophies=lambda b: [f"Category one, the resume. Faker is so far ahead that the chart needs a log scale.",
                        f"Behind him: {nm(b[4])}, {nm(b[3])}, {nm(b[2])}, and in second, {nm(b[1])}, with {P[b[1]]['titles']['worlds']} Worlds titles and a big carry share in each.",
                        f"First is Faker with {num(P['faker']['trophyPts'])} points. Nobody is within {round(P['faker']['trophyPts'] - P[b[1]]['trophyPts'], -1):.0f} of him."],
    big_stage=lambda b: [f"Big stage. Who plays their best when the whole world is watching?",
                         f"{nm(b[4])}, {nm(b[3])}, then {nm(b[2])}.",
                         f"Second is {nm(b[1])}, and first, {nm(b[0])}. The best international form over five years in the data."],
    peak=lambda b: [f"Peak. The single best year anyone has had, compared to their own role that year.",
                    f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                    f"And number one is {nm(b[0])} in {P[b[0]]['peakYear']}. The best season in fifteen years of data."],
    longevity=lambda b: [f"Longevity. How many years were you elite?",
                         f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                         f"{nm(b[0])} leads with {P[b[0]]['eliteYears']} elite years."],
    winning=lambda b: [f"Winning. Win rate, scaled by how strong the league was.",
                       f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                       f"And {nm(b[0])} on top, winning {P[b[0]]['stats'].get('wr')} percent of his games."],
    laning=lambda b: [f"Laning. How far ahead of the opposite laner you are at fifteen minutes.",
                      f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                      f"And the best laner in League history, by this measure: {nm(b[0])}, {P[b[0]]['stats'].get('gd15') or 0:+.0f} gold at fifteen on average."],
    killing=lambda b: [f"Killing. Who finds the most kills and puts out the most damage for their role?",
                       f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                       f"First, {nm(b[0])}."],
    teamfight=lambda b: [f"Teamfighting. Your share of the team's damage, and how many of the team's kills you were part of.",
                         f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                         f"And the best teamfighter: {nm(b[0])}."],
    vision=lambda b: [f"Vision and supporting. This one is supports only, ranked on vision score and assists.",
                      f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                      f"Number one: {nm(b[0])}. Voters barely reward vision, so it carries only one point of weight. But somebody has to ward."],
    team_carry=lambda b: [f"MVP of the team. How far above his own teammates did a player rate?",
                          f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                          f"And the clearest number one on his own team: {nm(b[0])}."],
    solo_carry=lambda b: [f"Solo carry. This is the one for players who dragged a team further than it had any right to go.",
                          f"Trophy points you earned above your teammates, worth more when those teammates were weaker. A stacked roster gets less.",
                          f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                          f"And first, {nm(b[0])}. If you ever said someone carried their team to a final, this is the chart that proves it."],
    clean_play=lambda b: [f"Clean play. KDA and how rarely you die.",
                          f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                          f"Cleanest player in League history: {nm(b[0])}, with a KDA of {P[b[0]]['stats'].get('kda')}."],
    consistency=lambda b: [f"Consistency. In how many events did you play above your role's average?",
                           f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}.",
                           f"{nm(b[0])}: {P[b[0]]['raw']['consistency'] * 100:.0f} percent of the time."],
    recognition=lambda b: [f"Now the intangibles. Shotcalling, comms, leadership. There's no stat for them, so I used two proxies, and I'm labelling them as proxies.",
                           f"The first is what the voters saw: All-Pro and MVP votes, per split. If you make everyone around you better, the people watching usually notice.",
                           f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}, and {nm(b[0])} on top."],
    team_lift=lambda b: [f"The second proxy: does the team win more when you're on it? Same team, two years either side, with and without you.",
                         f"{nm(b[4])}, {nm(b[3])}, {nm(b[2])}, {nm(b[1])}, {nm(b[0])}.",
                         f"It's noisy, rosters change five players at once, so it only carries two points of weight."],
)

beat("chapter", dict(n=5, name="Fifteen categories", line="The top five in each. Faker is in every board.", field="dark"), [], chapter="Categories", tail=50,
     sfx=[("whoosh.mp3", 0, 0.35)])
for k, (cat, title, how, statfn, axis) in enumerate(CATS):
    ids = board(cat) if cat != "vision" else D["roleBoards"]["vision"]["Support"][:5]
    spoken = SPOKEN[cat](ids)
    ch = f"Category {k + 1} / {len(CATS)} · {NAMES[cat]}"
    n_intro = len(spoken) - 2
    tTop = [f"@{n_intro}", f"@{n_intro}+25", f"@{n_intro}+50", f"@{n_intro}+75", f"@{n_intro + 1}+10"]
    props = dict(cat=cat, title=title, sub=how, axis=axis, chapter=ch, ids=ids, tTop=tTop)
    if cat == "vision":
        props["role"] = "Support"
    beat("field", props, spoken, chapter=ch, tail=40,
         sfx=[("whoosh-short.mp3", 0, 0.3)] + [("pop.mp3", t, 0.28) for t in tTop[:4]] + [("impact-bass-1.mp3", tTop[4], 0.35)])

# ---------------------------------------------------------------- 6. TWISTS
CH = "Twists"
beat("chapter", dict(n=6, name="Twists", line="Change the rules and see who survives.", field="bone"), [], chapter=CH, tail=50, sfx=[("whoosh.mp3", 0, 0.35)])
sw = D["sweep"]
changes = []
prev = None
for s in sw:
    if s["top"][0][0] != prev:
        changes.append((s["w"], s["top"][0][0])); prev = s["top"][0][0]
faker_from = next((x for x, i in changes if i == FAKER), None)
first_low = changes[0][1]
beat("slider", {"from": 0, "to": 40, "t0": "@1", "t1": "@3", "real": int(W["trophies"])},
     ["Twist one. What if trophies counted for less?",
      f"At zero, with trophies switched off completely, the best player in League history is {nm(first_low)}.",
      f"Turn trophies up and Faker takes over at {faker_from} percent.",
      f"I use {int(W['trophies'])}. So Faker's crown needs trophies to count for at least {faker_from} percent. Below that, it's {nm(first_low)}'s."],
     chapter=CH, sfx=[("riser.mp3", "@2", 0.3)])
sc = [dict(id=p["id"], x=round(sum(p["cats"][c] for c in ["big_stage", "peak", "winning", "laning", "killing", "teamfight", "team_carry", "clean_play", "consistency"]) / 9, 1),
           y=round(p["cats"]["trophies"], 1)) for p in D["players"]]
dec = sorted(D["players"], key=lambda p: -(p["rawPts"] or 0))[:5]
dom = sorted(sc, key=lambda q: -q["x"])[:5]
named = list(dict.fromkeys([FAKER] + [d["id"] for d in dec[:4]] + [d["id"] for d in dom[:4]]))
beat("scatter", dict(title="Most decorated vs most dominant", sub="every player: trophy score vs individual categories", pts=sc, named=named,
                     xLabel="individual categories (average percentile)", yLabel="trophy score", xr=[0, 100], yr=[0, 100],
                     tNamed=[f"@1+{4 * i}" if named[i] in [d['id'] for d in dec] else f"@2+{4 * i}" for i in range(len(named))],
                     quad=["trophies, quiet stats", "the complete package", "", "dominant, fewer trophies"]),
     ["Twist two. Trophies against individual play, for every player.",
      f"Most decorated: {', '.join(nm(d['id']) for d in dec[:4])}.",
      f"Most dominant on the stats: {', '.join(nm(d['id']) for d in dom[:4])}.",
      f"Only one player sits alone in the top right corner. Faker."], chapter=CH)
nr = D["variants"].get("no_region")
if nr:
    west = [i for i in ["caps", "rekkles", "perkz", "bjergsen", "jankos", "doublelift"] if i in P]
    mover = max(west, key=lambda i: P[i]["rank"] - nr["rank"].get(i, 999))
    rows = []
    rank_b = {i: k + 1 for k, i in enumerate(RANK)}
    for i in dict.fromkeys(RANK[:12] + [x for x, _ in nr["top"][:12]] + [mover]):
        sc_b = next((s for x, s in nr["top"] if x == i), P[i]["score"])
        rows.append(dict(id=i, a=P[i]["score"], b=sc_b, ra=rank_b[i], rb=nr["rank"].get(i, 99)))
    beat("rankshift", dict(title="Switch off region strength", sub="every region counted as equal", rows=rows, tSwap="@1", labelA="with region strength",
                           labelB="regions equal", focus=[mover]),
         ["Twist three. What if every region counted the same?",
          f"{nm(mover)} jumps from {ordinal(P[mover]['rank'])} to {ordinal(nr['rank'][mover])}. That's the price of playing in Europe.",
          f"But the top of the list barely moves. The best players won the hardest leagues and the international events too."], chapter=CH,
         sfx=[("whoosh.mp3", "@1", 0.35)])

# ---------------------------------------------------------------- 7. THE COUNTDOWN
CH = "The countdown"
beat("chapter", dict(n=7, name="The countdown", line="#10 to #3.", field="dark"), [], chapter=CH, tail=50, sfx=[("whoosh.mp3", 0, 0.35)])
miss = RANK[5:10]
beat("top5", dict(title="Just missed out", sub="#6 to #10", rows=[dict(id=i, stat=f"{P[i]['titles']['worlds']} Worlds · {P[i]['titles']['msi']} MSI",
                                                                       statLabel=f"#{P[i]['rank']} overall", value=P[i]["score"]) for i in miss],
                  tRow=[f"@{k}" for k in range(len(miss))][::-1], max=100, valueLabel="overall score", gold=False, rankOffset=5),
     [f"{w(10)}th, {nm(miss[4])}.", f"Ninth, {nm(miss[3])}.", f"Eighth, {nm(miss[2])}.", f"Seventh, {nm(miss[1])}.", f"And sixth, {nm(miss[0])}."],
     chapter=CH)


def best_cats(i, k=3):
    return sorted(P[i]["cats"].items(), key=lambda x: -x[1])[:k]


def card(i, intro, closing):
    p = P[i]
    bc = best_cats(i)
    beat("card", dict(id=i, rank=p["rank"], tName="@0", gold=False, profileAt="@2", lines=[
        dict(k="Titles", v=f"{p['titles']['worlds']} Worlds · {p['titles']['msi']} MSI · {p['titles']['domestic']} domestic", at="@1"),
        dict(k="Best categories", v=", ".join(f"{NAMES[c]} {v:.0f}" for c, v in bc), at="@2"),
        dict(k="Overall score", v=f"{p['score']:.1f}  ({p['vsFaker']:.0f}% of Faker)", at="@3")]),
         [intro, f"{p['titles']['worlds']} Worlds, {p['titles']['msi']} MSI, {p['titles']['domestic']} domestic titles.",
          f"His best categories: {', '.join(NAMES[c].lower() for c, _ in bc)}.", closing], chapter=CH,
         sfx=[("impact-bass-1.mp3", "@0", 0.35)])


card(five, f"Number five. {nm(five)}.", f"A score of {P[five]['score']:.1f}.")
card(four, f"Number four. {nm(four)}.", f"{P[four]['score']:.1f}.")
card(three, f"Number three. {nm(three)}.", f"{P[three]['score']:.1f}, and only {P[two]['score'] - P[three]['score']:.1f} points off second.")

# ---------------------------------------------------------------- 8. THE REVEAL
CH = "The reveal"
beat("chapter", dict(n=8, name="Number two", line="", field="orange"), [], chapter=CH, tail=50, sfx=[("riser.mp3", 0, 0.35)])
p2 = P[two]
bc = best_cats(two, 4)
beat("card", dict(id=two, rank=2, tName=0, gold=True, blurUntil="@4", profileAt="@1", lines=[
    dict(k="Worlds", v=f"{p2['titles']['worlds']}", at="@0"),
    dict(k="Best categories", v=", ".join(f"{NAMES[c]} {v:.0f}" for c, v in bc[:3]), at="@1"),
    dict(k="Chance to be #2 in 1,000 weight shuffles", v=f"{next((v for x, v in D['shuffle']['second'] if x == two), 0) / 10:.1f}%", at="@2"),
    dict(k="Overall score", v=f"{p2['score']:.1f}", at="@3")]),
     [f"So who is number two? {w(p2['titles']['worlds']).capitalize()} Worlds {'title' if p2['titles']['worlds'] == 1 else 'titles'}.",
      f"Top of the pool in {', '.join(NAMES[c].lower() for c, v in bc if v >= 99) or NAMES[bc[0][0]].lower()}.",
      f"I shuffled every weight by up to thirty percent, a thousand times. This player came second in {next((v for x, v in D['shuffle']['second'] if x == two), 0) / 10:.1f} percent of them.",
      f"Score: {p2['score']:.1f}.",
      f"The second greatest League of Legends player of all time is {nm(two)}."],
     chapter=CH, sfx=[("impact-bass-1.mp3", "@4", 0.6)])
beat("breakdown", dict(title=f"{nm(two)} vs Faker", sub="points from each category", ids=[FAKER, two, three, four, five], cats=cats, names=NAMES, t0="@0"),
     [f"And here's the gap to Faker: {fk['score'] - p2['score']:.1f} points.",
      f"{nm(two)} matches or beats him in {sum(1 for c in cats if P[two]['cats'][c] >= fk['cats'][c])} of the fifteen categories.",
      "But trophies are worth the most, and nobody comes close to six Worlds titles."], chapter=CH)

# ---------------------------------------------------------------- 9. CLOSE
CH = "Close"
new = [i for i in ["knight", "viper", "bin"] if i in P]
beat("hbars", dict(title="Where the new champions landed", bars=[dict(label=nm(i), v=P[i]["score"], at=f"@{k}", hi=True, photo=i, note=f"#{P[i]['rank']} all time")
                                                                  for k, i in enumerate(new)], max=100, fmt="d1"),
     [f"And the world champions we started with: {' '.join(f'{nm(i)} is {ordinal(rk(i))}.' for i in new)}"], chapter=CH)
beat("statement", dict(text="WHO'S YOUR #2?", sub="Tell me in the comments. Full method and data in the description.", field="dark"),
     ["That's what the data says. Now tell me what it got wrong. Who's your number two?"], chapter=CH, tail=40)
beat("statement", dict(text="Not endorsed by Riot Games.", sub="Data: Leaguepedia (CC-BY-SA), Oracle's Elixir, Liquipedia (CC-BY-SA). Player photos: Leaguepedia.", field="dark"),
     [], chapter=CH, tail=90)

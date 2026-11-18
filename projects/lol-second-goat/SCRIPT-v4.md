# League #2 after Faker: script v4 (model v11, final)

18 Nov 2026. Same structure as v3, every number updated to model v11 (MODEL-CURRENT.md). Changes from v3:
- the trophy slider twist is cut;
- "Intangibles" is now **Recognition**;
- the outro has no future-title numbers yet (on hold until ay asks for them);
- the Gumayusi joke is added.

Timing:
- about 12 minutes at 150 words a minute;
- VO is ay;
- **[SILENCE]** marks where the backing track drops out;
- the graphs thread is drawing every GRAPHIC as a still.

---

## 1. Cold open (0:00 to 0:40)

| VO | SCREEN |
|---|---|
| (broadcast call only) | FOOTAGE: Worlds 2026 final, the last fight and BLG's winning moment, caster call left in. |
| Bilibili Gaming just won the World Championship. | FOOTAGE: BLG lifting the trophy. |
| Knight is Finals MVP, the first Chinese mid laner to ever win Worlds. Viper has his second title. | FOOTAGE: Knight close up, then Viper. Lower third: KNIGHT, FINALS MVP 2026. |
| Faker is still the greatest of all time. Nobody serious argues that. | FOOTAGE: Faker, slow motion. |
| But this win changes the race for number two. So who is it now? | Hard cut to black, then the title. **[SILENCE]** |

## 2. The debate (0:40 to 1:20)

| VO | SCREEN |
|---|---|
| This is one of the most asked questions in League. | GRAPHIC: debate screenshots stacked one by one (Reddit, Team Liquid, Esports Insider, Knight MVP headlines). |
| Some say Keria, three world titles before most players win one. | Keria screenshot comes forward. |
| Some say Chovy, maybe the best laner we have ever seen, still chasing a Worlds. | Chovy screenshot comes forward. |
| And after this month, a lot of people are saying Knight. | Knight headlines pile on top. |
| Everyone has an opinion. I wanted an answer. | Screenshots fall away. |
| So I built a model that scores every pro with enough games, from 2011 to now. Five hundred and twenty seven players. | GRAPHIC: star field of every player, the count ticking up to 527. |

## 3. Building the model (1:20 to 6:40)

### 3.1 The first answer was wrong

| VO | SCREEN |
|---|---|
| My first version did the obvious thing. Add up trophies, add up stats, rank everyone. | GRAPHIC: the formula as one line. |
| And it put Faker at number 14. | GRAPHIC: ranking list, Faker's face drops to 14. |
| That's obviously wrong. So the question is why. | Hold. |
| It was averaging his whole career, rebuilding years and all. | GRAPHIC: Faker's rating by year, the average line dragging it down. |
| Nobody judges a great by their quiet years. So the model looks at each player's best years, and longevity gets its own score. | GRAPHIC: best years lit, the rest greyed. Faker climbs. |

### 3.2 Not every league plays the same game

| VO | SCREEN |
|---|---|
| Next problem. LPL players looked like monsters. | GRAPHIC: kills per game by region. |
| Since 2016, an LPL game has had about three more kills in it than an LCK game. More fighting, more kills for everyone. | GRAPHIC: 26.6 vs 23.6, the gap labelled. |
| So every stat is compared only against players in the same role, same league, same year. | GRAPHIC: one dot cloud per league, recentred. |

### 3.3 Who you beat matters

| VO | SCREEN |
|---|---|
| Then there's who you're playing against. Stomping a bottom team is not the same as beating Gen.G. | GRAPHIC: two match cards. |
| So I rated every team after every game since 2011, like chess ratings. Almost twenty six thousand games. | GRAPHIC: team rating lines over time, T1 and BLG lit. |
| Against stronger teams, the same stat line counts for more. | GRAPHIC: opponent strength vs stat line, slope drawn. |

### 3.4 What is a trophy worth?

| VO | SCREEN |
|---|---|
| Trophies are the biggest part of any GOAT case. But how much is an MSI worth next to a Worlds? | FOOTAGE: a trophy lift. |
| I worked it out from the brackets. For every title, how many coin flips in a row would a top team need to win it, against those exact opponents? | GRAPHIC: a bracket, each series turning into coin flips. |
| T1's 2024 Worlds run was the hardest since 2016: almost nine coin flips in a row. BLG this year, second. | GRAPHIC: titles ranked by difficulty, T1 2024 and BLG 2026 lit. |
| So the price list is half tradition, half maths. Worlds 100. MSI 56. An LCK title 44, an LPL title 35. | GRAPHIC: trophy price list builds line by line. |
| And five players lift a trophy. A support doesn't win less of a Worlds, so everyone on the team gets close to equal credit. | GRAPHIC: five equal bars, Knight and On side by side. |

### 3.5 Luck or skill

| VO | SCREEN |
|---|---|
| Here's the part I find most interesting. Some players look clutch. They win every game five. | GRAPHIC: game fives won, a few players far ahead. |
| But flip a coin ten times and sometimes you get eight heads. That doesn't make the coin clutch. | GRAPHIC: coin flips, then fifty lines, the band of luck. |
| So the model asks how many more best of fives you won than the team ratings expected, across a whole career. | GRAPHIC: the band narrows as series count grows. |
| The most clutch player in the data? Faker, about 25 more series won than expected. Just ahead of Bin. | Faker and Bin ringed above the band. **[SILENCE]** |

### 3.6 Who actually makes the team win?

| VO | SCREEN |
|---|---|
| Last piece, borrowed from basketball. Plus minus. | GRAPHIC: a basketball box score, the +/- column lit. |
| Every game, five players against five. Over twenty six thousand games, you can work out who makes their team win more than the lineup says it should. | GRAPHIC: two teams of five dots, one dot glowing. |
| It knows nothing about kills or trophies. Only who won. | Hold. |
| And it still puts Faker first, by a mile. Then Ruler, then Chovy. | GRAPHIC: impact board, Faker far ahead, Ruler and Chovy next. |

### 3.7 Does it actually work?

| VO | SCREEN |
|---|---|
| So how do you know a model like this is right? | Hold. |
| I hid the All-Pro votes from it. Every year, the people who watch every game pick the best players at each position. | GRAPHIC: All-Pro team cards. |
| Then I asked the model to pick them. Picking at random gets it right 12% of the time. Just picking players from winning teams, 58%. | GRAPHIC: dots appear one by one: 12, 58. |
| My model: 63%. | 63 lands. **[SILENCE]** |
| The final score is out of 100, from six parts. Trophies are the biggest at 40%. Then skill, big games and clutch, team impact, longevity, and recognition: the All-Pro votes. | GRAPHIC: one score card, six parts, each named with its weight. |

## 4. The categories, quick (6:40 to 7:40)

*About 12 seconds each. One chart, one winner, one sentence.*

| VO | SCREEN |
|---|---|
| Before the final ranking, here's who wins each part. | |
| Best on the big stage, Worlds and MSI form: Keria. | GRAPHIC: Keria lit in the field. |
| Best single season: Knight, this year. | GRAPHIC: peak chart, Knight 2026 at the top. |
| Most skilled: Chovy, by a hair over Knight. | GRAPHIC: skill board. |
| Most titles with different teams: Peanut, with five. | GRAPHIC. |
| And the trophy cabinet. Canyon wins it, just ahead of Ruler and Knight. | GRAPHIC: trophy cabinet star field, Canyon ringed. |
| Oh, and here's Faker, by the way. | GRAPHIC: the climb through empty axis. |
| 1,509. | Faker lands. **[SILENCE 3 s]** then zoom out. |
| More than double anyone else. So the real fight is for second. | Gap bracket: 795 points between Faker and the next best. |

## 5. The tease (7:40 to 8:20)

| VO | SCREEN |
|---|---|
| To test how solid this is, I ran the ranking a thousand times, each time shaking every weight up or down. | GRAPHIC: 1,000 small dots filling in. |
| Faker came first in all one thousand. | Dots fill gold. |
| And one name came second in 996 of them. | Dots fill cyan, the name hidden. **[SILENCE]** |
| We'll get to who. First, a couple of things that could change the answer. | Hard cut. |

## 6. The twists (8:20 to 9:40)

| VO | SCREEN |
|---|---|
| What if only international trophies counted? | GRAPHIC: domestic trophies fall away. |
| Then number two is Keria. | Keria rises. |
| And one more, because I had to. Split Faker's career down the middle. 2013 to 2019, and 2020 to now. Three world titles in each half. | GRAPHIC: Faker's face splits into two. |
| So I split him into two players. | Hold. |
| The young Faker alone is number two of all time, less than a point behind Knight. In a third of the reruns, he's number one. The second half is still top fifteen. He did both. | GRAPHIC: Faker 2013 to 2019 lands at #2 (87.3, Knight 88.0), Faker 2020 to 2026 at #13. **[SILENCE]** |
| And the model can't see everything. Shotcalling, comms, being the voice in the room. Bengi helped win three Worlds and sits at 44 here. | GRAPHIC: Bengi's dot far down, note: what the model can't see. |

## 7. The GOAT pyramid (9:40 to 11:00)

*Tiers follow our ranking only, built from the bottom up. 17 example faces in circles, rank badge on each, small TIER labels. Spec in MODEL-CURRENT.md.*

| VO | SCREEN |
|---|---|
| So here's the pyramid. Not a top ten. Tiers of greatness. | GRAPHIC: empty pyramid, five tiers. |
| At the bottom, numbers thirty two to sixty. Legends of their own regions. | Tier 5 fills: Scout, Perkz, Doinb, Bengi, Jankos. |
| Then the stars. The best player on a great team. | Tier 4 fills: Gumayusi, Caps, Deft, TheShy, Uzi. |
| Now, the internet won't like this. Every all-time list from the last two years has Uzi and Bengi in its top ten. | Everything dims except Uzi (#31) and Bengi (#44). Small list cards pop beside them: esports.net 2025 (Bengi #2, Uzi #4), spilled.gg 2026 (Uzi #5, Bengi #9). Red Bull's list is unranked, so it isn't on screen. |
| We have them at thirty one and forty four. Uzi never won Worlds, and trophies are the biggest part of this model. Bengi won three, but his own numbers rank two hundred and forty seventh. | Hold on the two faces. **[SILENCE]** |
| Then the absolute top of League. | Tier 3 fills: Keria, Ruler, Bin, Viper. |
| Then a tier of two, a point and a half apart. | Two empty slots. **[SILENCE]** |
| Chovy. | Chovy fills. |
| And second greatest of all time... | Hold. |
| Knight. | Knight fills the slot. |
| One world title. But the best single season ever recorded, by this model, near the top for years, and he just beat everyone. | FOOTAGE: Knight at Worlds 2026. |
| And none of those lists even have him. They were written before he won Worlds. | Knight's face, the two list cards with no Knight on them. |
| And at the top, alone, Faker. | Faker at the peak. Gap to Knight shown. |
| Number two. | Zoom in on Knight's face at #2. Hold. |
| But what would it take to get from here... to here? | An arrow draws from tier 2 up to Faker's tier, then the camera follows it into section 8. |

## 8. What would it take? (11:00 to 12:00)

| VO | SCREEN |
|---|---|
| What would it take for Knight to reach Faker's legacy? | GRAPHIC: Knight vs Faker, one row per part. |
| Knight already beats Faker at skill, at big games, and at recognition. | Three rows light up for Knight. |
| Faker wins team impact and longevity. And winning. | Three rows light for Faker. The trophies row: Faker 100, Knight 46. **[SILENCE]** |
| [NUMBERS ON HOLD: how many more titles, with future seasons simulated. ay asked to park this 16:57.] | |
| Speaking of catching Faker. Gumayusi left T1 last year, and said this. | QUOTE FLASH: "If my goal was to become the best player in the world, I couldn't stay with T1 forever." Gumayusi, Daily Esports. |
| Gumayusi is number eleven. Two thirds of Faker. | GRAPHIC: Gumayusi's dot, label 66% of Faker. |
| Yeah buddy. Long way to go. | Hold. |
| Who's your number two? Let me know in the comments. | END CARD: "Not endorsed by Riot Games." |

---

## Numbers used (model v11, 18 Nov 17:20)

| Claim | Number | Source |
|---|---|---|
| Pool | 527 players, 150+ games | draft_scores.csv |
| Top 10 | Faker 92.6, Knight 73.9, Chovy 72.4, Keria 69.0, Ruler 68.5, Zeus 66.0, Canyon 65.7, Bin 64.1, Peanut 64.1, Viper 63.1 | draft_scores.csv |
| Pyramid tiers | by rank: T1 #1; T2 #2 to 3; T3 #4 to 10 (Keria, Ruler, Bin, Viper); T4 #11 to 31 (Gumayusi, Caps, Deft, TheShy, Uzi); T5 #32 to 60 (Scout, Perkz, Doinb, Bengi, Jankos) | MODEL-CURRENT.md |
| 1,000 reruns | Faker #1 in 1,000; Knight #2 in 996 (Chovy in 4) | whatif.py |
| International only | Faker 92.6, Keria 72.9, Knight 71.4, Zeus 68.8, Ruler 66.4 | whatif_intl_only.csv |
| Two Fakers (even halves) | Knight 88.0, Faker 2013-19 87.3 (#2, #1 in 377 of 1,000 reruns), Chovy 86.4 ... Faker 2020-26 69.6 (#13) | draft_scores_split_faker.csv |
| Trophy points | Faker 1,509; Canyon 714, Ruler 705, Knight 695, Chovy 684; gap 795 | draft_scores.csv |
| Trophy values | Worlds 100, MSI 56, First Stand 40, LCK 44, LPL 35, LEC about 12 | config/weights.yaml |
| Hardest Worlds since 2016 | T1 2024 8.7 coin flips, BLG 2026 7.2 (research measure) | research/trophy-values-from-data.md |
| Validation | model 63%, win rate only 58%, chance about 12% (held-out 2022-26 first-team All-Pro) | validate.py, rerun 18 Nov |
| Kills per game | LPL 26.6 vs LCK 23.6 (2016 on) | games_2016on.csv |
| Games rated | 25,987 games, 2011 on | games.py |
| Clutch #1 | Faker (100), Bin 99, Gumayusi 90 | draft_scores.csv |
| Team impact | Faker 100, Ruler 94, Chovy 91 | draft_scores.csv |
| Category winners | big stage Keria; peak Knight 2026; skill Chovy (100) over Knight (99.9); titles with different teams Peanut 5; trophy cabinet Canyon | draft_scores.csv |
| Knight vs Faker by part | trophies 46 vs 100, big stage + clutch 99 vs 94, skill 100 vs 79, team impact 85 vs 100, longevity 90 vs 100, recognition 78 vs 61 | draft_scores.csv |
| Bengi | #44 | draft_scores.csv |
| Gumayusi | #11, 61.4, 66% of Faker | draft_scores.csv |

## Still to check before recording

1. **"Thirteen years" line removed.** It now says "rebuilding years and all".
2. **Peanut, five titles with different teams:** confirm against Liquipedia.
3. **Canyon winning the trophy cabinet:** his LCK titles plus 2 MSI; Ruler is 9 points behind. Fine to say "just ahead".
4. **Knight, "best single season ever recorded":** true by the model's peak board (Knight 2026); keep "by this model".
5. **Gumayusi quote:** it is a translation (Daily Esports via Sheep Esports); credit it on screen.
6. **Names to check by ear:** Knight, Bin, Viper, ON. Gen.G is read as "Jen Jee".

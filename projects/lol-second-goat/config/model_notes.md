# Current League model (the one every thread uses)

**Version 11 (FINAL unless ay reopens), 18 Nov 2026, 17:20 London.** ay approved each change on cards: halfway trophy blend (16:58), LCK/LPL fix (17:09), keep trophies as share of Faker (17:09), count 2013-15 games (17:10). Owner: the model thread. If a number here differs from anything older (script, stills, notes), this file wins.
Scores file: `projects/lol-second-goat/data/csv/draft_scores.csv` (branch claude/project-thread-a343zy). Video data: `video/src/data/league.json`. Regenerate this file with `python3 scoring/model_current.py`.

## GOAT pyramid (tiers of greatness, ay 18 Nov 17:38)

Styled like Jxmy's basketball pyramid: cutout photos sitting on each row, a small "TIER N" label centred above each row, and no text beside the tiers or "next ten" list. 24 players in total (Jxmy uses 30). Each face keeps a small overall rank badge from the model. Tiers use the model, titles and how players are seen. Ranks inside a tier can therefore cross (Gumayusi #11 sits above Bin #8), as in any GOAT pyramid.

| Tier | Players (overall rank) |
|---|---|
| 1 | Faker (#1) |
| 2 | Knight (#2), Chovy (#3) |
| 3 | Keria (#4), Ruler (#5), Zeus (#6), Canyon (#7), Gumayusi (#11), Oner (#12) |
| 4 | Bin (#8), Peanut (#9), Viper (#10), Caps (#14), Deft (#18), TheShy (#25), Rookie (#29), Uzi (#31) |
| 5 | Meiko (#17), Bang (#20), Wolf (#33), Impact (#40), Mata (#41), Bengi (#44), CoreJJ (#47) |

Tier meanings (ay, for the voiceover, not on screen): 5 great players on great teams, 4 stars, 3 the absolute top, 2 the greatest who aren't Faker, 1 Faker.

Reveal: build from the bottom up. In tier 2, Chovy fills first, then a beat of silence, then Knight. Faker goes alone on top. Then zoom in on Knight at #2, and draw an arrow from tier 2 up to tier 1 ("what would it take to get from here to here?") that leads into the outro.

## What changed
**v11 (from 10.1):** trophy values = halfway blend of our values and measured title difficulty (region offsets and byes counted): Worlds 100, MSI 56, First Stand 40, LCK title 44, LPL 35, LEC (20 x strength + 13)/2, LCS (20 x strength + 8)/2; placings scaled the same. Every 2011-15 game result added (data/build_games_all.py), so Elo, clutch, team impact and title difficulty cover Faker's 2013-15. Trophies stay a share of Faker's total. On screen, call "intangibles" **Recognition** (All-Pro votes + team record with and without him). Note: LEC 2026 splits count at full value (no Season Finals that year); small.

**v10.1:** bug fix. The harder-path bonus (0.85x to 1.15x by opponent strength) was never applied to Worlds titles from 2017 on (their games sit on a "/Main Event" page). Now applied: BLG 2026 x1.08, T1 2024 x1.14, T1 2023 x1.11, DWG 2020 x0.86. Knight unchanged at 73.1, Keria 70.1 to 70.7, Chovy and Ruler down slightly.

**v10 (from v9):** new part **Team impact (12%)**: plus-minus (RAPM, basketball's method; WAR idea from baseball) over 21,851 games from 2016 on, one rating per player per season, best 5 seasons (careers that began before 2016 average their covered seasons). It replaces **Carry** (still shown as a board, unweighted). Skill 22 to 18. Code: `scoring/rapm.py`.

**v9 (from v8):** longevity years capped at 0.4 above the line; clutch as a career total; peak and individual merged into skill; team lift median when never apart; short careers padded.

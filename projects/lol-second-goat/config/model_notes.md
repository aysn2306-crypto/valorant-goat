# Current League model (the one every thread uses)

**Version 12 (FINAL unless ay reopens), 18 Nov 2026, 19:25 London. v12 = career-level plus-minus (ay chose "Fix it" 19:14).** ay approved each change on cards: halfway trophy blend (16:58), LCK/LPL fix (17:09), keep trophies as share of Faker (17:09), count 2013-15 games (17:10). Owner: the model thread. If a number here differs from anything older (script, stills, notes), this file wins.
Scores file: `projects/lol-second-goat/data/csv/draft_scores.csv` (branch claude/project-thread-a343zy). Video data: `video/src/data/league.json`. Regenerate this file with `python3 scoring/model_current.py`.

## GOAT pyramid (ay 18 Nov 17:46, final design)

Tiers follow the model's ranking only, never reputation. A few example faces per tier, sorted by rank. Uses the earlier circle design (round photos, rank badge, name under the photo), with a small "TIER N" label on each row. No percentages, no text beside the tiers, no next ten. 18 faces.

| Tier | Ranks | Faces shown |
|---|---|---|
| 1 | #1 | Faker (#1) |
| 2 | #2 to #3 | Knight (#2), Chovy (#3) |
| 3 | #4 to #10 | Ruler (#4), Keria (#5), Bin (#8), Viper (#10) |
| 4 | #11 to #30 | Gumayusi (#12), Caps (#13), Deft (#17), TheShy (#21), Uzi (#30) |
| 5 | #31 to #62 | Scout (#31), Doinb (#35), Bengi (#41), Perkz (#43), Bjergsen (#56), Jankos (#62) |

Faces picked for a spread of regions (ay 18:09: less LCK and old SKT heavy).

Reveal: build from the bottom up. In tier 2, Chovy fills first, then a beat of silence, then Knight. Faker goes alone on top. Zoom in on Knight at #2, then an arrow draws from tier 2 up to tier 1 ("what would it take to get from here to here?") and leads into the outro.

## What changed
**v12 (ay 19:14, audit thread):** team impact plus-minus now fits a career rating per player under each season rating. Season-only keys could not tell five players apart when they played every game together (49% of player seasons had a rating identical to a teammate's; now 3%). Ruler moves to #4 and Keria to #5. Top 10: Faker 92.6, Knight 72.9, Chovy 70.7, Ruler 68.1, Keria 66.7, Zeus 64.5, Canyon 64.4, Bin 63.3, Peanut 62.8, Viper 61.2. Knight #2 in all 1,000 reruns. Two Fakers: Faker 2013-19 is now #1 (88.1, ahead of Knight 86.7, #1 in 768 of 1,000 reruns); Faker 2020-26 #13.

**v11.1 (audit fixes, 18 Nov 19:15):** Recognition counts major-league All-Pro votes only (academy and minor-league picks such as LCK CL and LTA South used to add points). Team impact averages the best 5 plus-minus seasons for everyone (data now covers 2011 on). Scores move by 0.01 to 0.02 at most in the top 12, and no rank changes in the top 80.

**v11 (from 10.1):** trophy values = halfway blend of our values and measured title difficulty (region offsets and byes counted): Worlds 100, MSI 56, First Stand 40, LCK title 44, LPL 35, LEC (20 x strength + 13)/2, LCS (20 x strength + 8)/2; placings scaled the same. Every 2011-15 game result added (data/build_games_all.py), so Elo, clutch, team impact and title difficulty cover Faker's 2013-15. Trophies stay a share of Faker's total. On screen, call "intangibles" **Recognition** (All-Pro votes + team record with and without him). Note: LEC 2026 splits count at full value (no Season Finals that year); small.

**v10.1:** bug fix. The harder-path bonus (0.85x to 1.15x by opponent strength) was never applied to Worlds titles from 2017 on (their games sit on a "/Main Event" page). Now applied: BLG 2026 x1.08, T1 2024 x1.14, T1 2023 x1.11, DWG 2020 x0.86. Knight unchanged at 73.1, Keria 70.1 to 70.7, Chovy and Ruler down slightly.

**v10 (from v9):** new part **Team impact (12%)**: plus-minus (RAPM, basketball's method; WAR idea from baseball) over 21,851 games from 2016 on, one rating per player per season, best 5 seasons (careers that began before 2016 average their covered seasons). It replaces **Carry** (still shown as a board, unweighted). Skill 22 to 18. Code: `scoring/rapm.py`.

**v9 (from v8):** longevity years capped at 0.4 above the line; clutch as a career total; peak and individual merged into skill; team lift median when never apart; short careers padded.

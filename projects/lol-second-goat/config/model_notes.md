# Current League model (the one every thread uses)

**Version 14.1 (audit fixes, 20 Nov 2026, ~01:30 London), on top of v14 (19 Nov 16:45). v14.1 = bug fixes only, no design change (see "What changed"). v14 = big games count domestic playoffs and finals in every region (ay 16:16). v13 = Recognition fixed (ay 21:00: the LCK held no All-Pro vote before 2020, so Faker's prime counted nothing). v12 = career-level plus-minus (ay chose "Fix it" 19:14).** ay approved each change on cards: halfway trophy blend (16:58), LCK/LPL fix (17:09), keep trophies as share of Faker (17:09), count 2013-15 games (17:10). Owner: the model thread. If a number here differs from anything older (script, stills, notes), this file wins.
Scores file: `projects/lol-second-goat/data/csv/draft_scores.csv` (branch claude/project-thread-a343zy). Video data: `video/src/data/league.json`. Regenerate this file with `python3 scoring/model_current.py`.

## GOAT pyramid (ay 18 Nov 17:46, final design)

Tiers follow the model's ranking only, never reputation. A few example faces per tier, sorted by rank. Uses the earlier circle design (round photos, rank badge, name under the photo), with a small "TIER N" label on each row. No percentages, no text beside the tiers, no next ten. 18 faces.

| Tier | Ranks | Faces shown |
|---|---|---|
| 1 | #1 | Faker (#1) |
| 2 | #2 to #3 | Knight (#2), Chovy (#3) |
| 3 | #4 to #10 | Ruler (#4), Keria (#5), Bin (#9), Viper (#10) |
| 4 | #11 to #30 | Caps (#11), Gumayusi (#14), Deft (#17), Uzi (#21), TheShy (#24), Scout (#27) |
| 5 | #31 to #62 | Doinb (#37), Perkz (#40), Bengi (#44), Bjergsen (#51), Jankos (#53) |

Faces picked for a spread of regions (ay 18:09: less LCK and old SKT heavy).

Reveal: build from the bottom up. In tier 2, Chovy fills first, then a beat of silence, then Knight. Faker goes alone on top. Zoom in on Knight at #2, then an arrow draws from tier 2 up to tier 1 ("what would it take to get from here to here?") and leads into the outro.

## What changed
**v14.1 (audit thread, 20 Nov, bug fixes only; AUDIT20=0 reproduces v14 exactly):**
1. Recognition counted the same MVP twice when Leaguepedia lists it under two names (Chovy 2024 Spring, Keria 2023 Spring, Ruler 2022 Summer, Bdd 2020 Spring). Now one MVP per player per split.
2. Recognition counted domestic finals MVPs only for LCK 2015-2020 (stored as "Most Valuable Player" on playoff pages; later ones are "Finals MVP" and never counted). Now season MVPs only, as documented, in every era.
3. A league-year with a vote for only one of its two splits (LPL 2020, EU/NA LCS 2015, LMS 2019) left the other split with no honours; it now gets a model All-Pro like any unvoted split.
4. Big games (v14) missed the knockout games of title events where groups and knockouts share one page (OGN Champions 2012-14, LCK Cup 2025-26), including Faker's 2013 and 2013-14 OGN finals. Now counted at the event rating and title value.
5. Silverware what-if: the player's other parts were still capped at 100 inside the what-if run while Faker stayed on today's scale (the Gumayusi cap in big games, skill, longevity and recognition). Now every part is scored on today's scale with no cap (scoring/silverware.py). Copied seasons keep only the international events that season wins, and a player with no Worlds title (Chovy) gets his latest Worlds knockout run as wins in clutch.
Result: top 10 order unchanged (Faker 94.4, Knight 73.7, Chovy 71.4, Ruler 68.6, Keria 66.7). Caps #12 to #11 (passes Oner). Knight #2 in 1,000 of 1,000. Two Fakers: Faker 2013-19 #1 in 933 of 1,000, Faker 2020-26 #14. End of 2025: Chovy #2, Ruler #3, Keria #4, Knight #5. Gen.G wins: Chovy #2, Ruler #3, Knight #4. Silverware (Faker frozen at 94.4): Knight 3 more Worlds + 3 MSIs + 9 LPL titles (99.8); Chovy 3 Worlds + 3 MSIs + 6 LCK titles (94.9, only just); Gumayusi 5 more Worlds + 5 MSIs + 10 LCK titles (98.2).

**v14 (ay 19 Nov 16:16):** big games (the big-stage half, 60% of big games + clutch) used only Worlds, MSI, First Stand and MSC games. Now every domestic playoff and final game in every region (LCK, LPL, LEC, LCS, LMS) counts too, region-adjusted, and each game is weighted by what the model already says that title is worth next to a Worlds title (LCK split about 0.44, LPL about 0.30, LEC and LCS about 0.1). No hand-picked weight. Clutch already counted domestic best-of-fives. Top 10 order unchanged: Faker 94.5, Knight 73.5, Chovy 71.4, Ruler 68.8, Keria 66.9, Canyon 65.0, Zeus 64.5, Peanut 63.2, Bin 62.6, Viper 61.5. Oner #11 edges Caps #12 (60.04 vs 60.02). Knight #2 in 1,000 of 1,000. Big-stage form alone still Keria; big games + clutch: Zeus and Knight tied at 100. Two Fakers: Faker 2013-19 #1 90.1 (948 of 1,000), Knight 87.3, Faker 2020-26 #13. End of 2025: Chovy #2, Knight #5 (Knight 5, 3, 5, 2 in 2023-26). Gen.G wins what-if: Chovy #2 74.2, Ruler 71.2, Knight #4 70.5. Dream seasons: Knight passes Faker after 3 (2029), Chovy after 4 (2030).

**v13 (ay 21:00, Recognition fix):** the LCK and LPL held no All-Pro vote before 2020, so a prime spent there (Faker 2013-19) counted nothing. (1) Every regular-season split of a major league in a year with no vote gets a model All-Pro: the top three at each role by impact rating, 3/2/1 points, among players with half the role's most games. Real votes are used wherever they exist; MVPs count 3 as before. (2) Honours are counted in full, as All-NBA selections are in a Hall of Fame case; the old per-split rate let every late season water down the peak. (3) The with/without half is dropped from Recognition: it gave Faker the pool median because T1 never played without him, and plus-minus (team impact) measures the same thing properly. Faker's Recognition 61 to 88 (#4 of 527 behind Chovy, Caps, Bjergsen); Knight 78 to 85. Top 10: Faker 94.5, Knight 73.4, Chovy 70.7, Ruler 68.5, Keria 66.9, Canyon 64.8, Zeus 64.5, Peanut 62.8, Bin 62.6, Viper 61.1. Knight #2 in all 1,000 reruns. Two Fakers: Faker 2013-19 #1 at 90.0 (951 of 1,000 reruns), Knight 87.2; Faker 2020-26 #13. Uzi 30 to 21, Bengi 41 to 44, Scout 31 to 27. 99 of the top 100 unchanged as a set.

**What-ifs on v13 (not the model):** Gen.G win the Worlds 2026 final (Finals MVP to Chovy): Chovy #2 73.5, Ruler #3 71.0, Knight #4 70.4 (data/csv/draft_scores_geng_wins.csv). Dream seasons (Worlds + MSI + best domestic year + a copy of the title season's stats, plus-minus, clutch and honours; Faker plays no more): Knight passes Faker after 3 (2029: 93.5 vs 91.0), Chovy after 4 (2030: 95.0 vs 89.5) (data/csv/dream_seasons.csv). Year-end ranks for every player 2014-2026: data/csv/score_by_year_all.csv (2014 pool is 14 players; use 2015 on).

**v12 (ay 19:14, audit thread):** team impact plus-minus now fits a career rating per player under each season rating. Season-only keys could not tell five players apart when they played every game together (49% of player seasons had a rating identical to a teammate's; now 3%). Ruler moves to #4 and Keria to #5. Top 10: Faker 92.6, Knight 72.9, Chovy 70.7, Ruler 68.1, Keria 66.7, Zeus 64.5, Canyon 64.4, Bin 63.3, Peanut 62.8, Viper 61.2. Knight #2 in all 1,000 reruns. Two Fakers: Faker 2013-19 is now #1 (88.1, ahead of Knight 86.7, #1 in 768 of 1,000 reruns); Faker 2020-26 #13.

**v11.1 (audit fixes, 18 Nov 19:15):** Recognition counts major-league All-Pro votes only (academy and minor-league picks such as LCK CL and LTA South used to add points). Team impact averages the best 5 plus-minus seasons for everyone (data now covers 2011 on). Scores move by 0.01 to 0.02 at most in the top 12, and no rank changes in the top 80.

**v11 (from 10.1):** trophy values = halfway blend of our values and measured title difficulty (region offsets and byes counted): Worlds 100, MSI 56, First Stand 40, LCK title 44, LPL 35, LEC (20 x strength + 13)/2, LCS (20 x strength + 8)/2; placings scaled the same. Every 2011-15 game result added (data/build_games_all.py), so Elo, clutch, team impact and title difficulty cover Faker's 2013-15. Trophies stay a share of Faker's total. On screen, call "intangibles" **Recognition** (All-Pro votes + team record with and without him). Note: LEC 2026 splits count at full value (no Season Finals that year); small.

**v10.1:** bug fix. The harder-path bonus (0.85x to 1.15x by opponent strength) was never applied to Worlds titles from 2017 on (their games sit on a "/Main Event" page). Now applied: BLG 2026 x1.08, T1 2024 x1.14, T1 2023 x1.11, DWG 2020 x0.86. Knight unchanged at 73.1, Keria 70.1 to 70.7, Chovy and Ruler down slightly.

**v10 (from v9):** new part **Team impact (12%)**: plus-minus (RAPM, basketball's method; WAR idea from baseball) over 21,851 games from 2016 on, one rating per player per season, best 5 seasons (careers that began before 2016 average their covered seasons). It replaces **Carry** (still shown as a board, unweighted). Skill 22 to 18. Code: `scoring/rapm.py`.

**v9 (from v8):** longevity years capped at 0.4 above the line; clutch as a career total; peak and individual merged into skill; team lift median when never apart; short careers padded.

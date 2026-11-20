# Final model review (20 Nov, 23:40), on v15.3 with the recommended clutch option

## Fan check, top 20
Faker, Knight, Chovy, Ruler, Canyon, Keria, Zeus, Peanut, Bin, Viper, Oner, Gumayusi, Caps, Kiin, Kanavi, Xiaohu, Bang, Deft, ON, Meiko.
Wolf 21, 369, BeryL, JackeyLove, Zeka, Rookie 26, Uzi 27, TheShy 30, Scout 31, Ming 32, Bengi 36, Doinb 38, Perkz 40, Clearlove 41, Mata 42, PraY 45, Bjergsen 46, Smeb 53, Jankos 60, Rekkles 72, Imp 74.
Passes: Faker clear #1, every top 10 name has Worlds or many LCK/LPL titles, roles mixed (top 30: 7 mid, 7 bot, 6 support, 6 top, 4 jungle), regions sensible (Caps the one Western player in the top 20).

## What I'd change
1. Must fix (not a judgement call): config/weights.yaml comments are out of date (impact still says best 5 seasons; intangibles still mentions with/without win rate, removed in v13). Fix with v15.3.
2. Must fix: clutch_mode in the config still says career total. Switch when ay picks the clutch option.
3. Judgement call, recommend NO change: early careers (2013-14) have thinner game data. Bengi shows 276 games, so his skill (56) rests on few games. Mata 42 and Bengi 36 may feel low to older fans. Recommend a one-line caveat in the video, not a model change, because any boost would be a guess.
4. Judgement call, recommend NO change: Uzi 27 and Bjergsen 46 sit below players with more trophies. That is the 40% trophy weight ay chose. Fans will argue, which is good for comments.
5. Judgement call, recommend NO change: jungle has only 4 of the top 30. Junglers score lower on laning stats; the season rating is z-scored within role, so this is mostly trophies (Bengi, Peanut era). Fine to leave.
6. Watch: Wolf (21) above Mata (42). Wolf has 2 Worlds with SKT; Mata 1. Fair by the model.
7. Faker's team impact is still 100 even as a per-game career average (0.84 per game vs Ruler 0.73), so it is not a volume effect. Good answer if fans ask.

## Things to think about (no change)
- Recognition is honours only, so it favours eras with more awards (newer LCK). Small weight (7).
- Longevity rewards long careers by design; Zeus and Bin will rise with time. The "what it takes to reach Faker" section already covers this.

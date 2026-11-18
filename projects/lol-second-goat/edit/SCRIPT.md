# League #2 after Faker: script (generated from edit/script.py)


## Cold open

*[0:00, on screen: worlds]*

Worlds just ended. Bilibili Gaming are world champions.

They beat Gen.G three games to one in New York.

Knight was Finals MVP, the first Chinese mid laner to win Worlds, and Viper now has two world titles.

*[0:17, on screen: fakersix]*

But one name still sits above everyone.

Faker has six Worlds titles. Nobody else has more than three.

Nobody argues about the greatest of all time in League.

The real argument is who comes second.

*[0:33, on screen: wall]*

Is it Knight, after that run? Viper, with two rings? Keria? Ruler? Chovy? Uzi?

Everyone has an opinion. So I stopped guessing and built a model.

*[0:49, on screen: numbers]*

Every major league and every international event from 2011 to Worlds 2026. 25,987 games and 1,915 players.

Fifteen categories, tested against the experts, then run a thousand different ways.

This is who the data says is the second greatest League of Legends player of all time.

*[1:12, on screen: statement]*

Let's find out.


## The rules

*[1:18, on screen: formula]*

Four rules, locked in before I looked at any results.

One. Everyone goes through the same formula. Faker too. No special treatment.

Two. Trophies count at full value. A Worlds title is worth a Worlds title, whether it is your first or your sixth.

Three. Winning on a stacked team is not the same as carrying one. Your credit depends on how you played next to your teammates.

Four. A support is compared to supports, a 2014 jungler to 2014 junglers, and a domestic title counts more in a stronger region.


## The data

*[2:01, on screen: timeline]*

Here is every world champion since season one.

Korea won five in a row from 2013 to 2017. China broke through in 2018, and since then it has been a two-region fight.

That matters, because a title from a strong region is harder to win.

*[2:20, on screen: line]*

So I measured region strength from the only games where regions actually meet: international events.

Every cross-region game goes into a rating, like chess Elo for regions.

Korea and China sit at the top most years. Europe peaked around 2018 to 2020. North America has mostly sat near the bottom.

A domestic title is multiplied by that number. Most years, an LCK title is worth at least twice an LCS one.

*[2:50, on screen: numbers]*

To make the list you need at least 150 games in a major league or at an international. That leaves 527 players.

Fewer games than that and a hot streak looks like greatness.


## The formula

*[3:06, on screen: formula]*

First, trophies. A Worlds title is worth 100 points. Making the final is 60, semis 35.

MSI is worth half of Worlds. First Stand half again.

A domestic title is 20, times the strength of that region in that year.

And a Finals MVP adds a bonus on top.

*[3:30, on screen: hbars]*

Then comes the carry share. Every player on a winning team gets credit between half and one and a half times the points.

For Worlds 2026, Knight gets 1.50 times, so his title is worth 150 points.

ON gets 0.64. Same trophy, different share.

That is how the model tells carrying a team from being carried.

*[3:56, on screen: hbars]*

Next, the stats. I didn't want to pick the stat weights by gut feeling, so I let the experts pick them.

Every split, casters, coaches and journalists vote for the All-Pro teams: the best player in each role.

I fed the model every split's stats and the votes, and asked which numbers predict who gets picked. The answer: your lead in lane at 15 minutes, your KDA and your kills.

Those learned weights turn every season into one rating, which feeds most of the categories you'll see.

*[4:28, on screen: formula]*

All of that lands in fifteen categories. Trophies are the biggest at 28 percent, then big stage form and peak.

Then the parts of the game: laning, killing, teamfighting, vision, clean play.

And the League stuff: who carried their team, who carried a weak team, and two proxies for the things stats can't see.

Each category ranks all the players from 0 to 100, and the final score is the weighted average.

*[4:56, on screen: rankshift]*

And my first ranking was wrong. Faker came out 3rd.

The problem was averages. Every year after his peak pulled his average down.

So a player who stayed great for thirteen years looked worse than one who retired at his best.

The fix: big stage, winning and stat categories use each player's best five years. Longevity gets its own category, so a long career is never punished.


## Is it accurate?

*[5:26, on screen: hbars]*

So is any of this right? I tested it on seasons the model never saw.

I trained it on 2015 to 2021, then asked it to pick the first-team All-Pro in every role from 2022 to 2026. Picking at random gets about 12 percent.

My first formula got 38. Just picking the player from the best team gets 57, because voters love winners.

The final model gets 63 percent, and its top three in each role match the voters' three All-Pro picks 75 percent of the time.

*[6:00, on screen: formula]*

It is not perfect, and here is where it is blind.

Shotcalling and comms. Nobody publishes who makes the calls, so I can only use proxies, and I'll show you those at the end.

Champion pool and what a player brings to the draft.

Team strength is only partly fixed by carry share. Being on a great team still helps.

And the early seasons have thin data. The numbers are better from 2014 on.

*[6:30, on screen: card]*

The best example is Bengi. Three Worlds titles next to Faker.

But his box score is quiet: few kills and no lane leads, because his job was enabling everyone else.

So the model has him at 137th. If you think that's too low, you're probably right, and that's exactly what stats can't see.


## Categories


## Category 1 / 15

*[6:54, on screen: field]*

Category one, the resume. Faker is so far ahead that the chart needs a log scale.

Behind him: Chovy, Knight, Ruler, and in second, Keria, with 3 Worlds titles and a big carry share in each.

First is Faker with 1,267 points. Nobody is within 460 of him.


## Category 2 / 15

*[7:18, on screen: field]*

Big stage. Who plays their best when the whole world is watching?

Zeus, Meiko, then Knight.

Second is Uzi, and first, Keria. The best international form over five years in the data.


## Category 3 / 15

*[7:36, on screen: field]*

Peak. The single best year anyone has had, compared to their own role that year.

BeryL, Nuguri, Smeb, Lehends.

And number one is Knight in 2026. The best season in fifteen years of data.


## Category 4 / 15

*[7:54, on screen: field]*

Longevity. How many years were you elite?

Scout, Chovy, Kiin, Knight.

Ruler leads with 9 elite years.


## Category 5 / 15

*[8:07, on screen: field]*

Winning. Win rate, scaled by how strong the league was.

Peanut, Ruler, Canyon, Faker.

And Chovy on top, winning 69.2 percent of his games.


## Category 6 / 15

*[8:22, on screen: field]*

Laning. How far ahead of the opposite laner you are at fifteen minutes.

Bin, Chovy, Knight, SofM.

And the best laner in League history, by this measure: TheShy, +551 gold at fifteen on average.


## Category 7 / 15

*[8:40, on screen: field]*

Killing. Who finds the most kills and puts out the most damage for their role?

Rookie, Uzi, Kanavi, Knight.

First, TheShy.


## Category 8 / 15

*[8:54, on screen: field]*

Teamfighting. Your share of the team's damage, and how many of the team's kills you were part of.

Froggen, Knight, Doinb, Uzi.

And the best teamfighter: Elk.


## Category 9 / 15

*[9:09, on screen: field]*

Vision and supporting. This one is supports only, ranked on vision score and assists.

Mikyx, Mata, Ming, Meiko.

Number one: Baolan. Voters barely reward vision, so it carries only one point of weight. But somebody has to ward.


## Category 10 / 15

*[9:30, on screen: field]*

MVP of the team. How far above his own teammates did a player rate?

Uzi, Kanavi, Bjergsen, Froggen.

And the clearest number one on his own team: Knight.


## Category 11 / 15

*[9:45, on screen: field]*

Solo carry. This is the one for players who dragged a team further than it had any right to go.

Trophy points you earned above your teammates, worth more when those teammates were weaker. A stacked roster gets less.

Huni, Chovy, Keria, Knight.

And first, Uzi. If you ever said someone carried their team to a final, this is the chart that proves it.


## Category 12 / 15

*[10:12, on screen: field]*

Clean play. KDA and how rarely you die.

Bdd, Rekkles, Knight, ShowMaker.

Cleanest player in League history: Chovy, with a KDA of 5.67.


## Category 13 / 15

*[10:28, on screen: field]*

Consistency. In how many events did you play above your role's average?

Froggen, Viper, Kanavi, Knight.

Chovy: 94 percent of the time.


## Category 14 / 15

*[10:42, on screen: field]*

Now the intangibles. Shotcalling, comms, leadership. There's no stat for them, so I used two proxies, and I'm labelling them as proxies.

The first is what the voters saw: All-Pro and MVP votes, per split. If you make everyone around you better, the people watching usually notice.

Rekkles, Caps, Canyon, Keria, and Chovy on top.


## Category 15 / 15

*[11:09, on screen: field]*

The second proxy: does the team win more when you're on it? Same team, two years either side, with and without you.

Zest, Dhokla, Ambition, MMD, DanDy.

It's noisy, rosters change five players at once, so it only carries two points of weight.


## Twists

*[11:32, on screen: slider]*

Twist one. What if trophies counted for less?

At zero, with trophies switched off completely, the best player in League history is Knight.

Turn trophies up and Faker takes over at 15 percent.

I use 28. So Faker's crown needs trophies to count for at least 15 percent. Below that, it's Knight's.

*[11:56, on screen: scatter]*

Twist two. Trophies against individual play, for every player.

Most decorated: Faker, Ruler, Keria, Canyon.

Most dominant on the stats: Knight, Chovy, Ruler, Viper.

Faker is alone at the top on trophies. But on individual play alone, four players rate higher than him.

*[12:19, on screen: rankshift]*

Twist three. What if every region counted the same?

Bjergsen jumps from 41st to 18th. That's the price of playing in Europe.

But the top of the list barely moves. The best players won the hardest leagues and the international events too.


## The countdown

*[12:40, on screen: top5]*

tenth, Meiko.

Ninth, Zeus.

Eighth, Kanavi.

Seventh, Canyon.

And sixth, Viper.

*[12:53, on screen: card]*

Number five. Chovy.

0 Worlds, 2 MSI, 7 domestic titles.

His best categories: winning, consistency, clean play.

A score of 85.1.

*[13:10, on screen: card]*

Number four. Ruler.

1 Worlds, 2 MSI, 6 domestic titles.

His best categories: longevity, winning, consistency.

85.5.

*[13:26, on screen: card]*

Number three. Keria.

3 Worlds, 0 MSI, 1 domestic titles.

His best categories: big stage, recognition, solo carry.

86.3, and only 1.1 points off second.


## The reveal

*[13:47, on screen: card]*

So who is number two? One Worlds title.

Top of the pool in peak, team carry, longevity, consistency.

I shuffled every weight by up to thirty percent, a thousand times. This player came second in 99.3 percent of them.

Score: 87.4.

The second greatest League of Legends player of all time is Knight.

*[14:14, on screen: breakdown]*

And here's the gap to Faker: 6.7 points.

Knight matches or beats him in 12 of the fifteen categories.

But trophies are worth the most, and nobody comes close to six Worlds titles.


## Close

*[14:28, on screen: hbars]*

And the world champions we started with: Knight is 2nd. Viper is 6th. Bin is 11th.

*[14:35, on screen: statement]*

That's what the data says. Now tell me what it got wrong. Who's your number two?


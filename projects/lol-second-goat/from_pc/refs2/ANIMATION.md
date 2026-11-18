# How the reference graphs move (Jxmy Highroller + MachineLoLing), 18 Nov 2026

Sources:
- the 0.5 s frame sheets in `*/graphs_0.5s/` (367 sheets, 59 graphs, 10 videos);
- `motion_0.5s.csv`, which measures every 0.5 s step: camera shift (phase correlation, in px per second at 1920 wide), zoom ratio, and the share of the frame that changed.

Speeds are measured. Easing curves are read by eye from 0.5 s steps. The 10 fps pass (`tools/jxmy_stage_c.py`, waiting on ay's go for the PC) will confirm them.

## 1. The numbers that matter most

- **64% of all graph time is completely still.** On top of that, 8% is something being added, 10% is a camera move, 11% is a zoom and 7% is a cut.
- **Still holds:** median 3.5 s; a quarter of them last 7 s or longer; the longest is 56 s. 90% of still time sits in holds of 3 s or more.
- **The rule:** one change, then hold while the voice explains it. Nothing drifts or pulses to fill time.
- **MachineLoLing is even calmer.** There are no camera moves at all in either video. Everything is an element appearing on a fixed chart.

## 2. The six moves, with timings

### A. Cut-axis climb (VCIK 10:02-10:25, the Warriors 399 chart)

| Time | What happens |
|---|---|
| 10:02-10:08 | 6 s hold on the pack. The axis shows only 290 to 330. Big condensed numbers every 10 sit on a thin white vertical line. Dots are plain white, about 18 px. The label "Team (value)" is tiny and sits under each dot. |
| 10:08-10:11.5 | Camera climbs 300 to 400 in 3.5 s, about 28 units/s, which is roughly 650 px/s at 1080p. It starts gently in the first 0.5 s, then holds a constant speed. Nothing on screen except axis numbers going by. |
| 10:11.5 | Stops with almost no ease out (about 6 px of settle). The top dot is in the upper third. |
| 10:11.5-10:15 | 3.5 s still hold. Music is cut, at 10:12. |
| 10:15-10:20 | 5 s zoom out, scale about 1.0 to 0.3. It is slow at first and fastest around 10:16-10:18 (ease in-out). The vertical axis title appears as it comes into frame. Teams below the old frame appear at the bottom. |
| 10:20-10:22.5 | 2.5 s hold on the whole chart. The chart sits in a narrow left column, about 25% of the width; the rest is empty. |
| 10:22.5 | Dashed vertical bracket plus a two-line text "92 wins between Warriors and the 2nd best team in the league" pop on in one frame (no animation), right of the chart. Then held for 3 s or more. |

### B. Cloud, cut in, ease out (R4 08:42-09:06, blue scatter)

| Time | What happens |
|---|---|
| 08:42-08:52 | 10 s hold of the whole cloud. Small blue dots, only the 3 top outliers are labelled (tiny). |
| 08:52 | **Hard cut** (no zoom) to about 4x on the 3 outliers. Each gets a small round face (about 40 px) + UPPERCASE NAME + value under the name. |
| 08:52-08:53.5 | 1.5 s hold. |
| 08:53.5-08:56 | Zoom out in about 2.5 s. It is fast at first and settles slowly (ease out). More labelled players come into view as it widens. |
| 08:56-09:05 | 9 s hold. |
| 09:05 | Zoom in again, accelerating (ease in), to the next subject. |

### C. Slow drift over a full star field (R4 04:22-05:34)

- Opens with a hard cut from the previous chart, already fully built. Nothing animates in.
- The camera drifts upward continuously at about 17 to 25 px/s for over a minute, a barely visible Ken Burns move.
- Labelled players have thin white rings and tiny NAME/value text. Only about 15 of roughly 300 stars are labelled.
- Background: navy on the left fading to maroon on the right, with a dark vignette. Axis names sit at bottom centre with arrow pairs ("MINUTES PER GAME ← →", "ESTIMATED PLUS-MINUS ↑ ↓").

### D. Fall down a ranked wall to one gold bar (QF 13:36-13:52)

| Time | What happens |
|---|---|
| 13:37.5 | Hard cut from footage to the top of about 300 grey horizontal bars, zoomed in. |
| 13:38-13:39.5 | Camera falls down the wall fast (about 1.5 s) to the gold bar near the bottom. |
| 13:39.5 | Curved yellow arrow draws from the bar end (0.5 s). |
| 13:40.5 | Zoom out starts, and the face cut-out + yellow NAME, value and rank pop at the arrow's tip. |
| 13:41 | Camera slides left. A second wall slides in from the right with its own gold bar and callout (13:42.5). |
| 13:42.5-13:52 | 9.5 s hold on the side-by-side. |

### E. Race lines, then light one (Ibc 09:10-09:30)

- The red reference line is already complete, with a face at its tip.
- All other lines draw left to right together at constant speed, over about 4 s (09:16-09:20).
- 09:21: all other lines dim to about 25% within 0.5 to 1 s.
- 09:23: one line is lit in its colour, with a face plus a value tag at its end. 09:23.5: the next line redraws from the start in its colour.

### F. Climb while dots arrive (dPZ 22:12-22:20, ISO photo scatter)

- Hard cut to a flat royal blue chart showing only the x axis and a yellow italic title under it.
- The camera tilts up at about 60 to 70 px/s. As the y axis comes into view, photo dots (about 30 px faces) drop in from above in small groups.
- One outlier is a much larger face.

### G. MachineLoLing build (j7t 02:40-02:48)

- The chart sits in a rounded dark panel with a red-to-green gradient (bad to good zone). There is a thin zero line, small tick numbers, and a plain sans axis label under it. The subject's name and icon sit top right.
- Icons fall into a histogram stack, staggered, in about 1 s.
- The bell curve fades in over the icons (0.5 s).
- At 02:42.5 an equation box pops top right ("true spread² = measured spread² − noise²"), then everything holds for 5 s or more.

### H. Head to head (IVd 05:00)

- Two cut-outs on solid team colours (red, yellow) fill both sides. Stat names are centred in a column.
- The labels alone are held for 7 s or more before any values tick in. The viewer reads what is coming first.

## 3. Rules for our graphs (from the above)

1. **One change, then hold 3 s or more.** Target about 60% still time on every graph.
2. **Enter by hard cut to a finished chart.** Build only the part being talked about.
3. **Camera speeds:**
   - climb through empty axis at about 600 to 700 px/s;
   - fall down a list at about 1.5 s per screen;
   - drift at about 20 px/s, or not at all.
4. **Easing:**
   - climbs: short ease in, nearly hard stop;
   - zoom out after a reveal: ease in-out over 2.5 to 5 s;
   - zoom out after a cut-in: ease out.
5. **After a reveal, the frame can be 75% empty.** Put the bracket or text in the empty side. It pops on with no animation.
6. **Labels:**
   - tiny UPPERCASE NAME + value, only on the players being talked about (5% of dots or fewer);
   - faces about 30 to 40 px, with one oversized face for the outlier.
7. **Highlight by dimming everyone else to about 25%** in 0.5 to 1 s, then light the subject in its colour.
8. **Big moments cut music** at the stop of the camera (see `README.md`). Small entrances carry no sound in MachineLoLing.

The sound-effects timing against these moves comes with the 10 fps pass (`onsets.csv` per moment).

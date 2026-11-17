# Cutting music to the picture

What music editors do that a beginner doesn't. Each rule says how we do it in our Remotion edit. Sources are at the
bottom.

## Choosing a track

1. **Audition the end of the first verse into the first chorus.** That 20 seconds tells you the track's range
   faster than the intro does.
2. **Avoid dense tracks with no gaps.** Busy is fine if the parts can be pulled apart; a wall of sound fights the
   voice. Our `edit/music_report.csv` already measures the clash in the 1 to 4 kHz voice band.
3. **Pick a feeling, not a mood word.** "Pensive", "hopeful", "tense" beat "sad" or "happy".
4. **Valorant first.** Where a creator-safe VALORANT track fits a section, it beats any stock track (see
   [[sources]]).

## Laying the bed

5. **Mark the beats before cutting.** Put a marker on every beat and a different one on the first beat of every
   four bars. Every music cut, entry and exit lands on one of those. In code: `edit/beats.py` gives beat and bar
   times; snap section starts to the nearest bar.
6. **Change or strip the bed every 30 to 60 seconds**, or when the story turns. A bed that loops longer than that
   tires the ear even if nobody notices why.
7. **Small changes between big ones:** drop an instrument out and bring it back, or swap the lead, instead of a new
   track. This needs stems (Epidemic has them).
8. **Strip back before a key line, then bring the full beat back** on the payoff. With stems: mute drums and bass
   under the setup sentence, unmute on the reveal word.
9. **Duck under the voice, rise in the gaps.** [[SOUND]] rule 7 has the levels.

## Getting in

10. **Enter on a strong bar, not the quiet intro** ([[SOUND]] rule 8).
11. **No lead-in? Reverse the track's first beat and use it as a riser** into the real first beat. If that sounds
    wrong, reverse the track's ending instead. Same trick to come back in after a quiet bridge.

## Getting out

12. **Button the ending: use the track's real ending, not a fade.** Cut the last ~10 seconds of the track onto a
    second layer, slide it so its final hit lands where the section ends, line up the waveforms, and cut both at
    the same beat spike so they join. In code: find a downbeat in the body and a matching downbeat before the
    outro (same bar position), splice there with a 10 to 30 ms crossfade, and offset so the last hit lands on the
    section's last frame.
13. **Or end on a reverb tail:** cut just before the next beat and let a large hall reverb ring out from the last
    hit. Good for the end of a chapter before a hard cut to the next title.
14. **Silence before the biggest hit.** Drop the music 0.3 to 0.75 s before the reveal ([[SOUND]] rule 6).

## Making a track fit a section exactly

15. **With Epidemic:** ask the connector's `EditRecording` for the section length and pin the drop to the reveal
    time. It rebuilds the track on its own bar lines, which sounds better than any cut we make by hand.
16. **Without it:** remove or repeat whole 4 or 8 bar phrases (never part of a bar), cut on downbeats, and button
    the ending (rule 12).

## Effects that belong to the music

17. **Hit** accents one beat. **Suckback** (reversed swell) leads into a hit. **Whoosh** is a suckback and hit in
    one. **Riser** builds over several seconds to a major moment, under the voice leading to a reveal. **Drone** is a
    low bed that sets unease under a whole section. See [[sfx-craft]].
18. **Reverb partway through a song** makes it feel bigger or more distant: use it for the turn into the GOAT
    reveal chapter.

## Sources

- No Film School, "How to Edit Trailer Music Like a Hollywood Pro" (beat markers, hit, suckback, whoosh, riser,
  drone, stems): https://nofilmschool.com/how-to-edit-trailer-music
- PremiumBeat, "Cap your music tracks for a smooth ending": https://www.premiumbeat.com/blog/cap-your-music-tracks-for-a-smooth-ending/
- Descript, "How to sound design a YouTube video" (audition, density, 30 to 60 s bed changes, stems, mood words):
  https://www.descript.com/blog/article/how-to-sound-design-a-youtube-video
- "3 Sound Design Secrets That Feel Like Cheating" (reversed beat riser, reverb ending), transcript:
  https://sozai.app/transcript/sound-design-secrets-cheating/
- Epidemic Sound connector docs: https://developers.epidemicsound.com/docs/mcp/

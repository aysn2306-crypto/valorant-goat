# Music report (YouTube Audio Library, 17 Nov 2026)

Measured: ffmpeg ebur128 (integrated LUFS, true peak), librosa beat_track + onset strength, 1 s RMS.
VO clash hint is rough: share of energy in 1-4 kHz plus spectral flatness there (low flatness = tonal = lead/vocal).

| Track | Dur | LUFS | TP dBTP | BPM | 1st downbeat | Loudest 20 s | VO clash |
|---|---|---|---|---|---|---|---|
| Event Horizon | 4:00 | -11.4 | -1.0 | 129.2 | 5.48 s | 3:00-3:20 | MEDIUM |
| False Vacuum Decay | 3:45 | -11.2 | -0.8 | 129.2 | 0.12 s | 0:18-0:38 | MEDIUM |
| Fire In The Sky | 4:31 | -13.7 | -0.8 | 112.3 | 61.14 s | 2:26-2:46 | MEDIUM |
| Horizons | 2:43 | -13.6 | -0.8 | 99.4 | 19.25 s | 1:19-1:39 | MEDIUM |
| Legend | 2:59 | -7.9 | 0.5 | 112.3 | 3.32 s | 0:50-1:10 | MEDIUM |
| Let It Ride | 2:29 | -8.9 | 0.6 | 92.3 | 0.67 s | 1:34-1:54 | MEDIUM |
| Mirror Mirror | 2:29 | -9.7 | 0.7 | 152.0 | 0.07 s | 2:03-2:23 | LOW |
| Misdirection | 3:04 | -11.7 | -0.5 | 117.5 | 1.04 s | 1:04-1:24 | LOW |
| On The Flip | 3:03 | -10.1 | -0.7 | 83.4 | 22.89 s | 2:17-2:37 | MEDIUM |
| Once Upon A Time | 3:22 | -10.2 | -0.4 | 112.3 | 0.58 s | 2:09-2:29 | LOW |
| Pulsar | 4:08 | -10.9 | -1.0 | 103.4 | 5.78 s | 0:49-1:09 | LOW |
| Rapid Unscheduled Disassembly | 5:37 | -12.7 | -1.0 | 123.0 | 1.49 s | 4:42-5:02 | HIGH |
| Rubberband | 3:07 | -10.3 | -0.5 | 92.3 | 0.7 s | 0:41-1:01 | LOW |
| Stake Out | 3:04 | -13.6 | -0.9 | 99.4 | 19.25 s | 1:33-1:53 | MEDIUM |
| Two Inside | 3:32 | -8.4 | 0.7 | 143.6 | 13.0 s | 1:14-1:34 | MEDIUM |

## Energy over time

- **Event Horizon**: quiet intro 0:00-0:30, builds 0:30-1:27, full 1:27-3:32, drops back 3:32-3:47, quiet outro 3:47-4:00, ends 4:00
- **False Vacuum Decay**: quiet intro 0:00-0:21, full 0:21-3:20, drops back 3:20-3:28, quiet outro 3:28-3:45, ends 3:45
- **Fire In The Sky**: quiet intro 0:00-0:35, builds 0:35-0:43, full 0:43-2:48, drops back 2:48-3:03, full 3:03-3:56, drops back 3:56-4:15, quiet outro 4:15-4:31, ends 4:31
- **Horizons**: quiet intro 0:00-0:35, builds 0:35-1:16, full 1:16-1:59, drops back 1:59-2:34, quiet outro 2:34-2:43, ends 2:43
- **Legend**: quiet intro 0:00-0:19, builds 0:19-0:33, full 0:33-2:59, ends 2:59
- **Let It Ride**: mid-level open 0:00-0:11, full 0:11-2:29, ends 2:29
- **Mirror Mirror**: mid-level open 0:00-0:27, full 0:27-1:19, drops back 1:19-1:35, full 1:35-2:29, ends 2:29
- **Misdirection**: mid-level open 0:00-0:15, full 0:15-0:50, drops back 0:50-1:05, full 1:05-3:04, ends 3:04
- **On The Flip**: mid-level open 0:00-0:23, full 0:23-2:44, winds down 2:44-3:03, ends 3:03
- **Once Upon A Time**: full 0:00-3:22, ends 3:22
- **Pulsar**: quiet intro 0:00-0:19, full 0:19-3:39, drops back 3:39-3:48, quiet outro 3:48-4:08, ends 4:08
- **Rapid Unscheduled Disassembly**: quiet intro 0:00-0:09, builds 0:09-0:58, full 0:58-1:13, drops back 1:13-1:21, full 1:21-5:20, quiet outro 5:20-5:37, ends 5:37
- **Rubberband**: mid-level open 0:00-0:12, full 0:12-3:07, ends 3:07
- **Stake Out**: mid-level open 0:00-1:07, full 1:07-2:01, drops back 2:01-2:10, full 2:10-2:55, quiet outro 2:55-3:04, ends 3:04
- **Two Inside**: full 0:00-3:04, drops back 3:04-3:12, quiet outro 3:12-3:32, ends 3:32

Curves: `curves/<title>.png` (blue = 1 s RMS, grey ticks = beats, orange = loudest 20 s, red dashed = first strong downbeat).

## Missing

- none

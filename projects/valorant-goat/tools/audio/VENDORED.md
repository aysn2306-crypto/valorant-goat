# Vendored audio tools

| File | From | Commit | Licence |
| --- | --- | --- | --- |
| `sfx_source.py` | [Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft) `assets/scripts/sfx-source.py` | 8710751 | Apache-2.0 (`LICENSE-video-shotcraft-Apache-2.0`), unmodified |

`sfx_source.py`: searches Freesound's public pages (no API key), downloads CC0 (default) or CC-BY previews,
writes `audio-manifest.json` (source, author, licence, SHA-256, measured peak) and `FREESOUND-CREDITS.md`.
`mixkit_fetch.py` is ours: same idea for Mixkit music and SFX (Mixkit Free License, no attribution needed).

Both need internet access to freesound.org / mixkit.co, which the cloud container doesn't have: run them on ay's PC.

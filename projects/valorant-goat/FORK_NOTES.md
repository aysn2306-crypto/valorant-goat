# How this repo is laid out

This repo is a fork of [claude-code-video-toolkit](https://github.com/digitalsamba/claude-code-video-toolkit)
(MIT) for the editing side, with the Valorant GOAT work in `projects/valorant-goat/`.

- `projects/valorant-goat/`: data pull, scoring, panels, rough-cut tools, research log (see its README)
- `brands/valorant-goat/`: channel colours and fonts for the toolkit's templates
- Everything else: the upstream toolkit, unchanged. Pull upstream updates with
  `git fetch upstream && git merge upstream/main`.

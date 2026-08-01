# Keep the editor authoritative during live preview synchronization

Authoring synchronization treats the Markdown editor as authoritative: cursor movement navigates the existing live preview without rendering, while source changes trigger a delayed atomic presentation refresh that preserves slide and fragment state. Preview initialization, automatic playback, and editor-driven navigation never move the editor selection; only deliberate preview navigation may do so. Invalid source or rendering keeps the last valid preview visible, favoring stable authoring and rendering correctness over fragile in-place DOM patching.

## Considered options

- Treat every Reveal.js slide change as preview navigation: rejected because refresh initialization feeds back into the editor and moves the cursor while typing.
- Patch the Reveal.js DOM in place after every edit: deferred because plugin, theme, script, and configuration changes cannot be updated reliably through one partial-rendering path.

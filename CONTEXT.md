# VS Code Reveal

This context describes the vocabulary used by the VS Code Reveal extension and its documentation. It distinguishes the extension's own behavior from capabilities provided by upstream Reveal.js.

## Presentation domain

**Presentation**:
A set of Markdown-authored slides rendered as an interactive Reveal.js deck.
_Avoid_: Deck when referring to the source document itself.

**Slide**:
One navigable unit inside a presentation, separated from neighboring slides by the presentation's Markdown separator.
_Avoid_: Page when discussing the interactive presentation.

**Front matter**:
Presentation-wide metadata at the beginning of the Markdown source, outside the navigable content of every slide.
_Avoid_: First slide or slide content.

**Live preview**:
The continuously refreshed presentation view opened from VS Code while a Markdown presentation is being edited.
_Avoid_: Export when the view is still connected to the source document.

**Authoring synchronization**:
The live preview following the authoring position while Markdown is being edited, with the editor remaining authoritative and preview refreshes leaving the editor selection unchanged.
_Avoid_: Two-way synchronization, which conflates authoring with deliberate preview navigation.

**Preview navigation**:
A deliberate navigation action inside the live preview that selects a slide and may move the editor to that slide.
_Avoid_: Preview refresh, initialization, or other automatic presentation changes.

**Last valid preview**:
The most recent live preview produced successfully from a presentation; it remains visible while a later edit or render is temporarily invalid.
_Avoid_: Best-effort preview that exposes invalid source as slide content, or a broken error page.

**Presentation refresh**:
An update of the live preview's rendered content after the presentation source changes, preserving the authoring position and current slide.
_Avoid_: Preview navigation or cursor synchronization.

**Feature example**:
A small, copyable Markdown sample paired with the rendered result of a VS Code Reveal capability.
_Avoid_: Demo when the example is intended as documentation rather than marketing.

**Verified extension feature**:
A behavior demonstrated locally and confirmed against the VS Code Reveal extension, rather than merely linked from upstream Reveal.js documentation.
_Avoid_: Reveal.js feature when extension support has not been checked.

**Export**:
A generated PDF or HTML artifact detached from the live preview and suitable for sharing.
_Avoid_: Preview when referring to a generated artifact.

# GameCue UI Style Guide

**Project:** GameCue  
**Version:** 0.1  
**Status:** Draft / Living UI Guide  
**Purpose:** Define the visual direction, layout rules, component styling, and UI boundaries for GameCue so Codex can build a consistent interface one small ticket at a time.

---

# 1. Purpose

This guide exists to keep GameCue visually consistent as the app grows.

Use this document when working on:

- App layout
- React UI components
- CSS
- Cue controls
- Transport controls
- Track cards
- Save/load panels
- Project summaries
- Future note viewers/editors
- Future mixer/export panels

GameCue should feel like a focused **game-audio creation tool**, not a generic SaaS dashboard and not a full professional DAW.

---

# 2. Product UI Identity

## 2.1 Visual Tone

GameCue should feel:

```text
dark
focused
clean
studio-like
game-development friendly
practical
slightly cinematic
```

It should not feel:

```text
cartoony
neon overload
generic corporate SaaS
full DAW clone
mobile game UI
overdesigned music toy
```

## 2.2 UI Inspiration

Safe inspiration categories:

- Dark code editor panels
- Audio tool panels
- Game dev tool inspectors
- Lightweight synth/plugin interfaces
- Unity-style utility layout
- Minimal studio control surfaces

Avoid directly copying any commercial DAW or plugin UI.

---

# 3. MVP UI Principle

GameCue should start as a simple utility.

The MVP UI should help the user answer:

```text
What kind of cue am I making?
What tracks were generated?
Can I play/stop it?
Can I save/load it?
What is the current project state?
```

The MVP UI should **not** try to be:

- Ableton
- FL Studio
- Logic
- Pro Tools
- Reaper
- A full piano roll editor
- A full timeline editor
- A mastering suite

Those ideas can influence future features, but not early tickets.

---

# 4. Layout Direction

## 4.1 Base Layout

Use a clear workspace layout:

```text
+---------------------------------------------------------+
| Header / Project Summary                                |
+----------------------+----------------------------------+
| Cue Controls         | Main Workspace / Track List       |
| Left Panel           | Right / Main Panel                |
+----------------------+----------------------------------+
| Transport / Status                                      |
+---------------------------------------------------------+
| Save / Load / Project Actions                           |
+---------------------------------------------------------+
```

For T0003, this can be simple:

```text
Header
Cue Controls placeholder
Track List placeholder
Transport placeholder
Save / Load placeholder
```

## 4.2 Preferred Regions

| Region | Purpose |
|---|---|
| Header | App name, current project/cue summary |
| Left panel | Cue settings and generation controls |
| Main panel | Track list, generated tracks, future editor |
| Transport bar | Play, stop, loop, tempo/status |
| Project panel | Save/load/export actions |
| Status/error area | Build/user feedback, warnings, validation errors |

## 4.3 Layout Rules

- Use panels/cards for major areas.
- Keep controls grouped by purpose.
- Make the primary workflow obvious from top-left to bottom-right.
- Avoid too many nested boxes.
- Avoid tiny cramped controls.
- Avoid huge empty hero sections after T0001.
- Keep the layout usable at common laptop widths.

---

# 5. Responsive Behavior

GameCue is desktop-first, but should not break at narrower widths.

## 5.1 Desktop

Preferred:

```text
Left controls column + main workspace column
```

## 5.2 Narrow Screens

When width gets narrow:

```text
Header
Cue Controls
Track List
Transport
Save / Load
```

Panels should stack vertically.

## 5.3 Minimum Usability

At smaller widths:

- Text should remain readable.
- Buttons should not overlap.
- Panels should not overflow horizontally.
- Track cards should stack cleanly.
- No hidden essential controls.

Mobile-first design is **not** required during MVP.

---

# 6. Color System

Use CSS custom properties for colors.

## 6.1 Recommended Tokens

```css
:root {
  --color-bg: #0b0f14;
  --color-surface: #111821;
  --color-surface-raised: #17212d;
  --color-surface-soft: #1d2937;

  --color-border: #2a3747;
  --color-border-strong: #3c4f63;

  --color-text: #edf3f8;
  --color-text-muted: #9fb0c0;
  --color-text-subtle: #738394;

  --color-accent: #7dd3fc;
  --color-accent-strong: #38bdf8;
  --color-accent-soft: rgba(125, 211, 252, 0.12);

  --color-success: #5eead4;
  --color-warning: #facc15;
  --color-danger: #fb7185;

  --shadow-panel: 0 16px 40px rgba(0, 0, 0, 0.28);
}
```

## 6.2 Usage

| Token | Use |
|---|---|
| `--color-bg` | App background |
| `--color-surface` | Base panels |
| `--color-surface-raised` | Cards, controls, elevated regions |
| `--color-border` | Normal panel/control borders |
| `--color-text` | Main text |
| `--color-text-muted` | Secondary text |
| `--color-accent` | Primary highlight |
| `--color-warning` | Non-blocking warning |
| `--color-danger` | Error/danger |
| `--shadow-panel` | Subtle depth |

## 6.3 Color Rules

- Use dark backgrounds.
- Use one main accent color.
- Use warning/danger colors only when meaningful.
- Do not use rainbow track colors early.
- Do not use neon everywhere.
- Do not rely on color alone to communicate state.

---

# 7. Typography

## 7.1 Font Stack

Use system fonts unless a ticket explicitly adds a font.

Recommended:

```css
font-family:
  Inter,
  ui-sans-serif,
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

Fallback-only is fine.

## 7.2 Type Scale

Recommended CSS variables:

```css
:root {
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.5rem;
  --font-size-2xl: 2rem;
}
```

## 7.3 Text Rules

- Headings should be clear and short.
- Labels should use direct language.
- Body/helper text should be readable, not tiny.
- Avoid decorative fonts.
- Avoid all-caps paragraphs.
- Use muted text for helper descriptions.

---

# 8. Spacing and Sizing

Use a consistent spacing scale.

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
}
```

## 8.1 Layout Rules

- Use consistent panel gaps.
- Use enough padding inside panels.
- Avoid cramped text.
- Avoid oversized margins that waste workspace.
- Keep controls aligned.

Recommended panel padding:

```css
padding: var(--space-5);
```

Recommended layout gap:

```css
gap: var(--space-4);
```

---

# 9. Borders, Radius, and Depth

## 9.1 Radius

Use a modest radius.

```css
:root {
  --radius-sm: 0.375rem;
  --radius-md: 0.75rem;
  --radius-lg: 1rem;
}
```

## 9.2 Panel Style

Panels should feel like dark tool windows.

Recommended:

```css
.panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-panel);
}
```

## 9.3 Depth Rules

- Use subtle shadows.
- Avoid glassmorphism overload.
- Avoid heavy glowing borders.
- Use raised surfaces sparingly.

---

# 10. Component Style Rules

## 10.1 Panels

Panels should have:

- Clear heading
- Optional short helper text
- Consistent padding
- Subtle border
- Dark surface
- Good spacing between children

Panel heading example:

```text
Cue Controls
Choose the cue type, mood, tempo, and intensity.
```

## 10.2 Buttons

Buttons should be:

- Easy to identify
- Large enough to click
- Clearly disabled when unavailable
- Consistent in style

Recommended button variants:

| Variant | Use |
|---|---|
| Primary | Main action, such as Generate Cue |
| Secondary | Normal actions |
| Ghost | Low-emphasis actions |
| Danger | Destructive actions only |

Do not create many button styles early.

## 10.3 Inputs and Selects

Inputs/selects should:

- Have visible labels
- Use dark backgrounds
- Use clear borders
- Show disabled state clearly
- Avoid cramped widths

Every form control should have a text label.

## 10.4 Track Cards

Track cards should show:

- Track name
- Track type
- Instrument name or placeholder
- Event count when available
- Mute/solo/lock/regenerate controls later

Early placeholders can show:

```text
Generated tracks will appear here.
```

## 10.5 Transport Bar

Transport should eventually show:

- Play
- Stop
- Loop
- BPM
- Current status

During T0003, transport can remain placeholder-only.

## 10.6 Status/Error Messages

Use clear short messages.

Examples:

```text
No project generated yet.
Project saved.
Invalid project file.
Playback engine not initialized.
```

Do not show raw stack traces to users unless in a dev/debug section.

---

# 11. CSS Organization

For early MVP, keep CSS simple.

Allowed:

```text
src/app/styles.css
```

Later, component-level CSS may be introduced if needed.

## 11.1 CSS Rules

- Use CSS custom properties for tokens.
- Use semantic class names.
- Keep selectors readable.
- Avoid deeply nested selectors.
- Avoid adding CSS frameworks without an approved ticket.
- Avoid inline styles unless trivial/dynamic.

## 11.2 Class Naming

Use simple kebab-case class names.

Examples:

```text
app-shell
app-header
workspace-grid
side-panel
main-panel
panel
panel-header
panel-title
panel-description
transport-bar
status-message
```

Avoid vague names:

```text
box1
thing
stuff
left
right
cool-panel
```

---

# 12. Accessibility Basics

Even during MVP:

- Use semantic HTML where possible.
- Use buttons for actions.
- Use labels for form controls.
- Maintain readable contrast.
- Preserve visible focus states.
- Do not rely on color alone for state.
- Avoid tiny click targets.

## 12.1 Focus State

Use an obvious focus style:

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
}
```

## 12.2 Motion

Avoid unnecessary animation during MVP.

If animations are added later:

- Keep them subtle.
- Respect reduced-motion preferences.
- Do not animate essential state changes in confusing ways.

---

# 13. Icon Rules

Do not add an icon library during early MVP unless a ticket explicitly approves it.

Use text labels first.

Acceptable early labels:

```text
Play
Stop
Loop
Mute
Solo
Save
Load
Generate Cue
```

Icons can be added later if they improve usability.

---

# 14. Avoided UI Work During Early Tickets

Do not implement these during T0003/T0004 unless explicitly scoped:

- Piano roll
- Drum grid
- Timeline arranger
- Waveform display
- Mixer with meters
- Drag-and-drop panels
- Resizable split panes
- Plugin-style knobs
- Animated visualizers
- Theme picker
- Sample browser
- Full export wizard
- AI chat panel

These are later features.

---

# 15. T0003 Layout Guidance

For `T0003 — Basic App Layout`, implement only:

- Header/project summary area
- Left cue-control placeholder area
- Main/right track-list placeholder area
- Transport placeholder area
- Save/load placeholder panel
- Simple responsive layout
- Clean CSS tokens if not already present

Do not implement:

- Real cue controls
- Real track data
- Playback controls that do anything
- Save/load actions
- Generation logic
- New dependencies

## 15.1 Recommended T0003 Structure

```tsx
<main className="app-shell">
  <header className="app-header">
    ...
  </header>

  <section className="workspace-grid">
    <aside className="side-panel panel">
      ...
    </aside>

    <section className="main-panel panel">
      ...
    </section>
  </section>

  <section className="transport-panel panel">
    ...
  </section>

  <section className="project-panel panel">
    ...
  </section>
</main>
```

---

# 16. T0004 Cue Controls Guidance

For `T0004 — Cue Controls UI`, controls should be simple and readable.

Preferred fields:

- Cue type
- Mood
- BPM
- Key
- Mode
- Intensity
- Bars

Use normal inputs/selects first.

Do not use:

- custom sliders unless simple
- complex piano keyboards
- waveform previews
- AI prompt controls
- generation logic

---

# 17. Empty and Placeholder States

Use calm empty states.

Examples:

```text
No cue generated yet.
Generated tracks will appear here after the generator is added.
Playback controls will be wired in a later ticket.
Project file actions will be added after save/load is implemented.
```

Avoid:

```text
Nothing here lol
Coming soon!!!
This is broken
```

---

# 18. Copywriting Rules

Use direct, practical text.

Preferred:

```text
Generate loopable game music cues.
Choose the cue type and mood.
Generated tracks will appear here.
Playback controls will be wired later.
```

Avoid:

```text
Unleash your sonic destiny!
Craft infinite bangers!
AI magic happens here!
```

GameCue can be creative, but the UI should stay useful.

---

# 19. UI Review Checklist

When reviewing Codex UI work, check:

```text
1. Does the UI still feel like GameCue?
2. Is the layout readable?
3. Are sections clearly labeled?
4. Did Codex avoid full DAW scope?
5. Did Codex avoid real behavior not in the ticket?
6. Are colors consistent with the style guide?
7. Are spacing and panel styles consistent?
8. Are controls labeled?
9. Does the app work at narrower widths?
10. Does npm run build pass?
```

---

# 20. Codex Prompt Add-On

For UI tickets, include:

```text
Follow docs/UI_Style_Guide.md. Keep the UI dark, clean, readable, and tool-like. Do not implement full DAW features, real playback, generation, save/load, export, or AI behavior unless the current ticket explicitly asks for it.
```

If `AGENTS.md` already includes this guide in its read-first list, prompts can simply say:

```text
Follow AGENTS.md and the project docs.
```

---

# 21. AGENTS.md Update

Add this file to the `AGENTS.md` read-first list:

```text
docs/UI_Style_Guide.md
```

Recommended `AGENTS.md` doc list:

```text
docs/GameCue_Full_Design_Document.md
docs/GameCue_MVP_Technical_Design.md
docs/Tickets.md
docs/Codex_Prompt_Playbook.md
docs/Naming_And_Code_Conventions.md
docs/UI_Style_Guide.md
```

---

# 22. Summary

GameCue’s UI should be:

```text
dark
readable
panel-based
game-audio focused
simple first
consistent
not a full DAW
```

The first layout tickets should create a stable visual foundation, not a finished music workstation.

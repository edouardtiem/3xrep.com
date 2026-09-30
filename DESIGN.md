---
name: 3xrep public reading surfaces
description: Incumbent reading identity, Sales Strategy Library and shared deal circuit
colors:
  reading-copper: "#945421"
  paper: "#eef0f2"
  foreground: "#16171a"
  muted: "#5c6168"
  divider: "#d5d8dc"
  raised: "#ffffff"
  supported: "#276341"
  assumed: "#875018"
  contradicted: "#9c3030"
typography:
  display:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-.035em"
  headline:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-.025em"
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: ".94rem"
    lineHeight: 1.75
  note:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    lineHeight: 1.65
rounded:
  action: "7px"
  library-panel: "14px"
spacing:
  reading-gutter: "40px"
  small-reading-gutter: "20px"
  section-divider-gap: "32px"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.raised}"
    rounded: "{rounded.action}"
  scenario-choice:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.action}"
    padding: "11px 15px"
  scenario-choice-selected:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.raised}"
    rounded: "{rounded.action}"
  strategy-panel:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.library-panel}"
    padding: "28px"
---

# Design System: 3xrep public reading surfaces

## Overview

**Creative North Star: "The Evidence Reading Room"**

The documentation and Sales Strategy Library share a quiet reading surface: cool gray paper, dark text, copper links, thin dividers and white working panels. The existing IBM Plex Sans family carries both explanatory prose and compact evidence labels.

This record covers those public reading surfaces, the completed library extension and the shared deal circuit embedded in the library and homepage. It does not define the complete homepage, other assistant demonstrations, dashboard or a new brand. The library adds evidence states and selectable scenarios within the incumbent documentation language. The circuit keeps the same paper, copper and IBM Plex Sans identity while showing how context becomes a next move.

**Key Characteristics:**

- Reading first, interaction second.
- Flat sections divided by fine rules.
- Copper links and visible keyboard focus.
- Evidence labels retain their words as well as color.
- Persistent arrows and finite, replayable circuit motion.

## Colors

### Primary

Reading copper marks documentation links, the current documentation navigation item and keyboard focus. It is the darker reading accent observed in the documentation and library, not a replacement for the global homepage copper.

### Neutral

Cool paper is the page surface. Foreground ink carries headings and primary actions. Muted gray carries supporting prose. Divider gray separates sections and rows. Raised white contains prompts and the library's strategy.

### Evidence states

Supported green, assumed brown and contradicted red annotate evidence. Unknown uses muted gray. These are library semantics, not general success or error tokens for other interfaces.

**The Reading Surface Rule.** Use the cool paper background for reading and white for contained working material.

**The Named State Rule.** Evidence colors always accompany a written state; color alone does not carry the meaning.


## Typography

**Display and Body Font:** IBM Plex Sans with system sans-serif fallbacks. The loaded family provides regular and medium weights. Existing rules sometimes request stronger emphasis; this record does not add a new font weight.

Headings are medium weight with tight tracking. Documentation display sizes span (clamp(2.25rem, 4vw, 3.4rem)); library displays span (clamp(2.3rem, 4.6vw, 3.7rem)). Section headings vary by surface, retaining the shared medium weight and close tracking. Reading prose uses a relaxed line height. Notes and evidence captions sit below body size without switching family. Provenance values use the existing monospace utility treatment.

**The Quiet Hierarchy Rule.** Use medium-weight headings, close tracking and generous prose line height rather than heavy display type.

## Layout

Documentation uses a centered shell (1240px maximum) with a narrow sticky navigation and a reading article (780px maximum). The library uses a centered reading shell (1120px maximum), an introductory answer, dividers, evidence rows and a next-move panel. Shared desktop gutters are (40px); small-screen gutters are (20px).

Library actors occupy three columns. Evidence and strategy use a (1:1.2) two-column relationship with a (42px) gap. At (760px), both grids stack and the strategy padding reduces from (28px) to (22px). Library index rows place title, explanation and arrow across columns, then move the explanation below the title on smaller screens. Documentation narrows at (950px) and becomes a stacked surface with wrapping sticky navigation at (700px).

**The Stacked Evidence Rule.** The library evidence and strategy columns become a single reading sequence on small screens.

The shared circuit is a centered vertical flow (700px maximum). Three source lanes—meeting notes, connected CRM and buyer email—converge into the assistant. Each uses a compact inline line icon. The flow then passes through 3xrep with its evidence diagnosis inside the same panel, the next move and the wording returned to the assistant. Six persistent arrows connect the flow: three input arrows and three downstream arrows. The source lanes remain side by side on small screens; their gap and padding tighten at (500px). The same component supports explanation in the library and persuasion on the homepage without changing the sequence.

## Elevation & Depth

These reading surfaces have no shadow vocabulary. Fine borders group evidence, article sections and expandable details. White panels distinguish working material from the cool paper background.

**The Flat Reading Rule.** Documentation and library sections use dividers and surface color rather than shadows.

## Shapes

Actions and scenario choices have modest rounded corners. The library prompt and next-move panel share softer corners. Documentation prompt panels use their incumbent (12px) radius and navigation uses (6px). These variations remain local; they are not an invented universal radius scale.

## Components

### Buttons

Dark primary links use white text and compact rounded corners. Documentation and library variants differ slightly in vertical padding. Their hover darkens to the incumbent softer charcoal. Keyboard focus uses a copper outline (2px) offset from the component (4px).

### Scenario choices

White, outlined buttons wrap into multiple rows. Hover changes the border to copper. The selected choice uses dark ink with white text and exposes its pressed state. No animated transition is defined in the library stylesheet.

### Cards / Containers

The next-move panel and reusable library prompt sit on raised white with soft corners. The evidence file remains a sequence of open rows separated by fine lines rather than boxed cards.

### Navigation

Documentation navigation is muted by default. Hover uses a cool gray surface; the current page uses copper ink on a pale copper surface. The library shares the incumbent header and adds a small underlined breadcrumb. Header styling itself is outside this record.

### Evidence file and details

Evidence headings align each point with a textual state. Quotes, reasons and compact method mappings follow underneath. Native expandable details retain their disclosure affordance and visible keyboard focus. The evidence overview wraps instead of forcing a horizontal scroll.

### Shared deal circuit

Sources enter through three white source panels, then pass through a cool gray assistant panel and a pale copper 3xrep panel. The assistant provides native expandable details for the fictional quote and declared stage. Evidence diagnosis sits inside 3xrep with a fine divider. The next move sits on white; the returned wording is outlined. These tonal distinctions mark roles within this component rather than new global surface tokens. Rounded containers retain the incumbent gentle form language.

The six arrows remain visible before, during and after playback. Copper packets move along them in a finite staggered sequence. Playback is visual only: the evidence diagnosis, strategy and wording stay visible; the optional source context remains independently expandable, and playback changes no calculated state. The homepage starts playback once when the circuit comes into view; both placements provide a replay control. A status message describes playback. With reduced motion, packets stay hidden, the complete static flow remains visible and the playback control is disabled. Circuit controls use the incumbent copper focus outline and a minimum target height (44px).

**The Persistent Circuit Rule.** Keep every stage, its core text and all six arrows visible independently of playback; source context expands separately.

**The Finite Signal Rule.** Circuit motion is a finite, replayable explanation; reduced motion presents the complete static circuit.

## Do's and Don'ts

### Do:

- Do reuse the existing font, reading colors and copper focus treatment.
- Do keep evidence labels visible beside their state colors.
- Do preserve a single reading sequence when columns stack.
- Do use white panels for prompts and the next move.
- Do retain the complete circuit when playback stops or reduced motion is requested.

### Don't:

- Don't apply this scoped record as a complete homepage design system.
- Don't replace textual evidence states with color alone.
- Don't hide circuit content behind playback or treat animation as a new proof.
- Don't introduce shadow elevation into these reading surfaces without a new design decision.

### Homepage placement — approved revision

The original Acme conversation and mascot stay in the hero. The shared circuit follows in a separate two-column section with the same deal as its narrative bridge; below 700px the section stacks. On the homepage, evidence diagnosis uses a native details disclosure inside 3xrep so the next move and returned wording appear sooner. In the library, the diagnosis remains expanded. Playback never changes this disclosure or hides any connector.

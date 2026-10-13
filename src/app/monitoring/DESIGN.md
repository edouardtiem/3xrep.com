---
name: 3xrep private monitoring
description: Local extension of the existing paper and copper identity for private monitoring
colors:
  reading-copper: "#945421"
  paper: "#eef0f2"
  foreground: "#16171a"
  muted: "#5c6168"
  divider: "#d5d8dc"
  raised: "#ffffff"
  used-ink: "#276341"
  used-surface: "#e0ece3"
  unused-ink: "#69441f"
  unused-surface: "#eee4d8"
typography:
  display:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(30px, 4vw, 44px)"
    fontWeight: 500
    lineHeight: 1.12
    letterSpacing: "-.03em"
  headline:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "-.02em"
  body:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  note:
    fontFamily: "IBM Plex Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  action: "7px"
  panel: "14px"
spacing:
  compact-gap: "12px"
  content-gap: "20px"
  panel-inset: "24px"
  mobile-inset: "20px"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.raised}"
    rounded: "{rounded.action}"
    padding: "12px 16px"
  button-refresh:
    backgroundColor: "{colors.raised}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.action}"
    padding: "9px 16px"
  button-logout:
    textColor: "{colors.muted}"
    padding: "9px 0"
  private-code:
    rounded: "{rounded.action}"
    padding: "10px 12px"
  panel:
    backgroundColor: "{colors.raised}"
    rounded: "{rounded.panel}"
    padding: "{spacing.panel-inset}"
  state-used:
    backgroundColor: "{colors.used-surface}"
    textColor: "{colors.used-ink}"
    padding: "5px 9px"
  state-unused:
    backgroundColor: "{colors.unused-surface}"
    textColor: "{colors.unused-ink}"
    padding: "5px 9px"
---

# Design System: 3xrep private monitoring

## Overview

**Creative North Star: "The Evidence Reading Room"**

This local record extends the existing 3xrep reading identity into the private monitoring surface. Cool gray paper, white working panels, copper disclosure controls and IBM Plex Sans retain the incumbent material language. Dark ink, fine rules and concise labels make a compact register readable.

The scope is src/app/monitoring/page.tsx and monitoring.module.css, with inherited typography and page colors from the root layout and stylesheet. The root DESIGN.md remains the public reading record. These local decisions do not redefine the homepage, the brand or the public library.

**Key Characteristics:**

- Flat surfaces and thin row separators.
- Regular and medium IBM Plex Sans weights.
- Numbers aligned with tabular figures.
- Written usage states beside color.
- Native disclosures and visible keyboard focus.

## Colors

The incumbent cool paper and dark ink palette uses copper for reading controls and quiet tonal backgrounds for usage states.

### Primary

Reading copper marks disclosure summaries and visible keyboard focus. Primary buttons use foreground ink rather than a new accent.

### Neutral

Paper is inherited from the global page. Raised white groups counts, the login form and expanded facts. Foreground carries headings, counts and primary actions; muted gray carries dates, labels and explanations. Divider gray separates the header, organisations and supporting notes.

### Usage states

Used green marks organisations that received a first useful result. Unused brown covers both an untried connector and a connector tried without that first result. Each tag spells out the more precise state. These are local usage roles, not a replacement for the public library's evidence colors.

**The Named State Rule.** Keep the written usage state beside its color; green and brown never carry the meaning alone.

## Typography

**Display and Body Font:** IBM Plex Sans with system sans-serif fallbacks. The inherited font loader supplies regular and medium weights.

The title is fluid and tightly tracked. Section headings use medium weight. Organisation titles use medium text (18px); count labels and disclosure summaries use smaller regular text (14px). Notes and metadata use the note role. Journey counts use medium tabular figures (36px), reducing to (30px) on small screens. Organisation counts use tabular figures (22px), while dates stay at reading size (15px).

Body copy inherits the local shell's compact line height. Introductory prose is limited to (60ch), and explanatory notes to (75ch). Expanded facts use smaller body text (14px).

**The Quiet Hierarchy Rule.** Use regular body text and medium headings within the incumbent family; compact labels keep their natural sentence case.

## Layout

The centered shell has a maximum width (1100px), full available width and desktop padding (26px 32px 56px). Header actions wrap. The white count panel and login panel share the panel inset. Organisation rows remain open on the paper surface with fine top borders and vertical padding (24px).

Count groups use four equal columns separated by vertical rules. Each organisation's measurements use a four-column grid (1fr 1fr 1fr 1.6fr). Expanded facts use label/value columns (180px 1fr). Repeated gaps and insets favor the compact and content spacing roles rather than large empty areas.

At the local small-screen breakpoint (680px), shell padding becomes (20px 20px 40px), the header stacks, panels use the mobile inset and count groups become two columns. Lower count rows gain horizontal separators. Organisation measurements also become two columns; titles and state tags stack. Expanded facts become one column with a small label/value gap (3px).

## Elevation & Depth

No shadows or animated transitions are defined in this surface. White panels, fine borders and open row separators provide depth and grouping. Hover changes ink, underline or border color without moving the component.

**The Flat Register Rule.** Separate organisations with fine rules; reserve white contained surfaces for grouped counts, login and expanded facts.

## Shapes

Buttons and the private-code field share the action corner. Login and journey panels share the softer panel corner. Local state tags use compact corners (5px); expanded fact blocks use gently rounded corners (12px). These two component-specific values remain local rather than expanding the shared radius scale.

## Components

### Buttons

The login action uses white text on dark ink, changing to softer charcoal on hover. Refresh uses an outlined white button whose border becomes foreground ink on hover. Logout is a muted text button that darkens and underlines on hover. Buttons retain a minimum target height (44px); disabled buttons reduce opacity and use the unavailable cursor.

### Chips

Usage tags have no interaction. Their small rounded backgrounds distinguish a first result from its absence. The accompanying words differentiate recent use, a historical first result, a connector trial and no recorded use.

### Cards / Containers

Journey counts and login sit in bordered white panels. Their shared inset decreases on small screens. Expanded facts use a white inset block. Organisation rows use separators rather than individual panel borders.

### Inputs / Fields

The private-code field has an explicit label, a gray stroke, action corners and a minimum height (48px). Password characters remain masked. The local error message uses the existing red reading treatment and an alert role.

### Organisation register and details

A wrapping organisation heading places identity and enrollment date beside a written usage tag. The measurement grid follows with named counts and a last-result date. Long identities and values wrap instead of causing horizontal scroll. Native details reveal source, campaign and first-use facts, preserving the browser disclosure marker. Summary hover underlines the copper text.

Buttons, the input and disclosure summaries share a copper focus outline (2px) offset by (4px). Native interaction stays operable without JavaScript.

## Do's and Don'ts

### Do:

- Do reuse the inherited paper, ink and IBM Plex Sans family.
- Do keep native disclosure markers and copper keyboard focus.
- Do preserve written labels beside every usage state and count.
- Do keep count groups in two columns on small screens and allow long addresses to wrap.

### Don't:

- Don't apply this local record as a replacement for the root design system.
- Don't remove textual state labels in favor of color alone.
- Don't turn flat organisation rows into elevated cards without a new local design decision.

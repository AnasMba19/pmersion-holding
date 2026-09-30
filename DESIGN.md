---
version: alpha
name: "PMersion — Dossier en mouvement"
colors:
  primary: "#185E48"
  ink: "#182D28"
  background: "#F4F5F2"
  surface: "#FFFFFF"
  sage: "#DCE7D9"
  forest: "#143B30"
  accent: "#C48536"
typography:
  body:
    fontFamily: "Manrope, Arial, sans-serif"
  display:
    fontFamily: "Georgia, Times New Roman, serif"
  utility:
    fontFamily: "ui-monospace, monospace"
rounded:
  DEFAULT: "2px"
spacing:
  mobileMargin: "20px"
  desktopMargin: "52px"
components:
  button: {}
  dossier: {}
  trajectory: {}
---

# PMersion public art direction

## Overview

Dossier en mouvement is the brand expression for the public homepage of a French project-management
training simulation. The owner retained the sage/ink base but explicitly requested a stronger
visual composition and movement across the site, beyond functional data transitions.

The signature is a paper dossier and an articulated project trace: oversized typography, layered
sheets, a three-part drawn trajectory and an asymmetric gallery. The public app remains the
reading/workshop surface with its separate existing functional contract.

## Colors

Runtime ownership: site.css owns the accepted base; visual.css owns the named marketing extension
(--paper, --sage, --forest, --display, --motion-ease). This document mirrors them, not generates
them. Forest and sage alternate with paper to change section silhouette. Ochre is a trace/accent,
not a semantic warning or small body text color.

## Typography

Locally bundled Manrope carries the body and large sans title. System Georgia adds a restrained
italic voice only to expressive display text; figures stay tabular sans. Body copy is enlarged
from the earlier miniature marketing scale. Utility metadata is secondary. French accents remain
literal and no third-party font request is added.

## Layout

Desktop: wide title, offset dossier layers, three-word manifesto, large sage drawing, project
journey, living example, forest asymmetric workshop gallery, calm reference/FAQ and final action.
Mobile: native document flow, complete text and controls, stacked gallery, diagram scaled as a
nonessential illustration. Navigation and actions never require hovering, dragging or animation.

## Elevation & Depth

Paper layers may rotate; all functional controls and numerical results stay horizontal. Decorative
sheets use pointer-events:none and aria-hidden. Depth belongs to the brand composition rather than
an artificial window system. No galaxy, ornamental cockpit, stock customer logos or invented stats.

## Shapes

Sheets have fine rules and nearly square corners. A broad SVG path bends between paper notes.
The path is explicitly illustrative and never substitutes for numerical model output.

## Components

Preserve native links/buttons/fieldset semantics and all existing IDs for the canonical previews.
The static baseline disables JS-only controls until their owner initializes; real beta links work
without script. motion.js owns visual enhancement, site.js owns values from dossier-data.js.
Existing beta assets and browser-local retained decisions are not rewritten by presentation code.

## Do's and Don'ts

Respect OS reduced motion and a page-local manual reduction button. Content is visible by default;
IntersectionObserver starts finite WAAPI reveals only for elements entering view. No hidden CSS
startup state. Scroll position drives only decorative SVG progress and note posture through a
bounded RAF; no continuous animation loop, scroll hijacking or autoplay audio. Manual reduction
also suppresses existing value pulses and cancels running animations. Restore listeners on bfcache.

Five references: Dopple Press (current split entry), Chiara Luzzana (typographic composition),
Esther Jansma (geometric editorial identity), Fluffy/Jade Nargeot (showcase composition), Sarah
Lupton (exploratory states). These are principles reinterpreted for PMersion; no assets/code copied.
The old Wix Dopple description is not treated as the current site.

12ui CLI was installed and attempted; generation requires a connected account, and no candidates
were returned. This design is a bespoke implementation, not a claimed 12ui-generated result.

Verification: source syntax, CSS parsing, existing public beta browser regression, four viewport
widths, scripts-disabled rendering, OS/manual reduced motion, real motion screenshots/video and
live-domain inspection after release. Passing tests is not proof of superiority to the references.

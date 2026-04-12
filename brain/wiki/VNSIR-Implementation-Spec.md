---
tags: [vnsir, spec]
date: 2026-04-12
status: active
---

# VNSIR — Full Implementation Specification

> **Project:** vn-sir-web  
> **Type:** Browser-based Visual Novel with Self-Insert Route (SIR)  
> **Last Updated:** 2026-04-12  
> **Owner:** Project Manager (Rin Tanaka agent)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Page Inventory](#3-page-inventory)
4. [Acceptance Criteria Per Page](#4-acceptance-criteria-per-page)
5. [Data Flow Diagrams](#5-data-flow-diagrams)
6. [Game State Model](#6-game-state-model)
7. [Save / Load Architecture](#7-save--load-architecture)
8. [Routing Map](#8-routing-map)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [Glossary](#10-glossary)

---

## 1. Project Overview

`vn-sir-web` is a browser-delivered visual novel where the player customises their self-insert protagonist (name, pronouns, appearance token) before entering a branching narrative. Choices alter a **relationship affection score** per character and unlock one of several route endings. All game state is persisted client-side (localStorage) with optional cloud sync.

### Core Pillars

| Pillar | Description |
|--------|-------------|
| **SIR (Self-Insert Route)** | Player names & configures their in-world avatar before chapter 1 |
| **Branching Narrative** | At least 3 diverging routes each with a Good, Normal, and Bad ending |
| **Progressive Disclosure** | Gallery, extras, and true-route content unlock through repeated playthroughs |
| **Accessibility First** | Full keyboard navigation, screen-reader-compatible dialogue, adjustable text size / contrast |

---

## 2. Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 18 + TypeScript | Component model maps cleanly to VN "scenes" |
| Routing | React Router v7 | SPA navigation, URL-based save-state deep-linking |
| State | Zustand | Lightweight, serialisable store for game state |
| Styling | Tailwind CSS + CSS custom properties | Theming; dark/light; responsive |
| Asset Pipeline | Vite | Fast HMR, asset hashing |
| Persistence | localStorage (primary) + IndexedDB (large assets) | Offline-first |
| Audio | Howler.js | BGM looping + SFX channel management |
| Testing | Vitest + React Testing Library + Playwright | Unit, integration, E2E |
| CI | GitHub Actions | Lint → Test → Build → Deploy (GitHub Pages / Vercel) |

---

## 3. Page Inventory

Each page has a **Page ID** (used in routing and acceptance criteria), a route path, and a one-line responsibility.

| # | Page ID | Route Path | Responsibility |
|---|---------|-----------|----------------|
| 1 | `PAGE_SPLASH` | `/` | Animated title card; entry point |
| 2 | `PAGE_MAIN_MENU` | `/menu` | Start, Continue, Load, Gallery, Settings, Credits |
| 3 | `PAGE_SIR_SETUP` | `/setup` | Player customises their self-insert avatar |
| 4 | `PAGE_CHAPTER_SELECT` | `/chapters` | Chapter/route map; locked nodes visible but greyed |
| 5 | `PAGE_GAME` | `/play/:chapterId/:sceneId` | Core VN engine: dialogue, sprites, BG, choices |
| 6 | `PAGE_CHOICE` | *(overlay on `/play`)* | Full-screen choice prompt rendered inside game page |
| 7 | `PAGE_TRANSITION` | *(overlay on `/play`)* | Fade/wipe scene transitions with optional chapter title card |
| 8 | `PAGE_SAVE_LOAD` | `/saves` | Slot-based save file management |
| 9 | `PAGE_GALLERY` | `/gallery` | CG art viewer; locked tiles with unlock hint |
| 10 | `PAGE_MUSIC_ROOM` | `/music` | BGM track list; play/pause per unlocked track |
| 11 | `PAGE_SETTINGS` | `/settings` | Audio, display, accessibility, data controls |
| 12 | `PAGE_CREDITS` | `/credits` | Scrolling staff roll with asset attributions |
| 13 | `PAGE_ENDING` | `/ending/:endingId` | Ending CG + text reveal + route completion stat |
| 14 | `PAGE_EXTRAS` | `/extras` | Side stories, character bios, lore dictionary |
| 15 | `PAGE_404` | `*` | Friendly not-found with link back to menu |

---

## 4. Acceptance Criteria Per Page

Each section follows the pattern:  
**Given** [precondition] **When** [action] **Then** [observable result]

---

### 4.1 `PAGE_SPLASH`

**Purpose:** Animated title card; transitions automatically or on any input.

#### AC-SPLASH-01 — Auto-advance
- **Given** the user navigates to `/`  
- **When** the intro animation completes (≤ 4 s)  
- **Then** the page automatically redirects to `/menu`

#### AC-SPLASH-02 — Skip on input
- **Given** the splash animation is playing  
- **When** the user presses any key, clicks, or taps  
- **Then** the animation stops and immediately redirects to `/menu`

#### AC-SPLASH-03 — No splash on subsequent loads
- **Given** `splashSeen` flag is `true` in localStorage  
- **When** the user navigates to `/`  
- **Then** the page redirects to `/menu` without playing the animation

#### AC-SPLASH-04 — Accessibility
- **Given** the splash page is displayed  
- **Then** a visually hidden `<h1>` with the game title exists for screen readers  
- **And** the skip mechanism is keyboard-accessible (Enter / Space)

---

### 4.2 `PAGE_MAIN_MENU`

**Purpose:** Central hub for all top-level navigation.

#### AC-MENU-01 — Continue button state
- **Given** no save files exist  
- **When** the Main Menu renders  
- **Then** the "Continue" button is disabled (visually muted, `aria-disabled="true"`)

#### AC-MENU-02 — Continue loads latest save
- **Given** at least one save slot is populated  
- **When** the user clicks "Continue"  
- **Then** the game resumes from the most recently written save, navigating to `/play/:chapterId/:sceneId`

#### AC-MENU-03 — New Game routes to SIR setup if no avatar exists
- **Given** no SIR avatar is configured  
- **When** the user clicks "New Game"  
- **Then** the app navigates to `/setup`

#### AC-MENU-04 — New Game routes directly to chapter 1 if avatar exists
- **Given** an SIR avatar is already configured  
- **When** the user clicks "New Game"  
- **Then** a confirmation modal appears asking "Start over?" with options "Yes" / "No"  
- **And** confirming navigates to `/setup` with avatar fields pre-populated

#### AC-MENU-05 — All navigation items are keyboard-reachable
- **When** the user presses Tab through the menu  
- **Then** every button receives a visible focus ring in sequence

#### AC-MENU-06 — Background ambient audio
- **Given** BGM is not muted in settings  
- **When** the main menu renders  
- **Then** the menu theme BGM begins playing, looped, at the user's stored volume level

---

### 4.3 `PAGE_SIR_SETUP`

**Purpose:** Capture player identity data for the self-insert protagonist.

#### AC-SETUP-01 — Required fields
- **Given** the SIR Setup page is displayed  
- **When** the user submits without filling in `displayName`  
- **Then** an inline validation error "Name is required" is shown beneath the field  
- **And** the form does not advance

#### AC-SETUP-02 — Name character limit
- **Given** the user types more than 24 characters in `displayName`  
- **Then** input is truncated at 24 characters  
- **And** a live character counter shows remaining characters

#### AC-SETUP-03 — Pronoun selection
- **Given** the pronoun radio group presents options: She/Her, He/Him, They/Them, Custom  
- **When** the user selects "Custom"  
- **Then** two text inputs appear for subject and object pronouns (e.g., "xe / xem")

#### AC-SETUP-04 — Appearance token selection
- **Given** a grid of avatar tokens (≥ 6 options) is displayed  
- **When** the user selects a token  
- **Then** the token receives a visible selected-state border and `aria-checked="true"`

#### AC-SETUP-05 — Data persistence
- **When** the user clicks "Begin Story"  
- **Then** the SIR avatar object is written to Zustand store and persisted to localStorage  
- **And** the app navigates to `/play/ch01/scene001`

#### AC-SETUP-06 — Back navigation
- **When** the user clicks "Back"  
- **Then** the app navigates to `/menu` without saving any partial SIR data

---

### 4.4 `PAGE_CHAPTER_SELECT`

**Purpose:** Visual map of chapters; shows completion and lock state.

#### AC-CHAPTERS-01 — Lock state for unplayed content
- **Given** the player has not reached chapter 3  
- **When** the Chapter Select page renders  
- **Then** chapter 3 node is visually locked (padlock icon) and not clickable

#### AC-CHAPTERS-02 — Completion indicator
- **Given** the player has completed chapter 2 with a Good Ending  
- **When** the chapter 2 node renders  
- **Then** a star or badge icon appears indicating completion tier (Good / Normal / Bad)

#### AC-CHAPTERS-03 — Navigation on click
- **Given** a chapter node is unlocked  
- **When** the user clicks it  
- **Then** the app navigates to `/play/:chapterId/scene001`

#### AC-CHAPTERS-04 — Route fork visibility
- **Given** chapter 4 branches into Route A and Route B  
- **When** both routes have been unlocked  
- **Then** both fork nodes are visible and individually selectable

---

### 4.5 `PAGE_GAME`

**Purpose:** Core VN engine rendering dialogue, characters, background, and UI chrome.

#### AC-GAME-01 — Dialogue rendering
- **Given** a scene JSON has a `dialogue` array  
- **When** the scene loads  
- **Then** each dialogue entry renders the speaker name (styled) and message text in the dialogue box

#### AC-GAME-02 — Text reveal animation
- **Given** a dialogue line is displayed  
- **When** the line is first shown  
- **Then** characters appear one-by-one at the configured text speed (default: 40 ms/char)  
- **And** clicking/pressing Enter skips to full-text instantly

#### AC-GAME-03 — Advance on input
- **Given** full dialogue text is visible  
- **When** the user presses Enter, Space, clicks, or taps the dialogue box  
- **Then** the game advances to the next dialogue line or triggers a choice if at a branch point

#### AC-GAME-04 — Character sprites
- **Given** a sprite change event in scene JSON (`{ type: "sprite", character: "aoi", expression: "happy", position: "left" }`)  
- **When** the engine processes that event  
- **Then** the specified sprite renders at the specified position with a 150 ms cross-fade  
- **And** characters not referenced in the current line are visually dimmed (opacity 0.5)

#### AC-GAME-05 — Background
- **Given** a background change event (`{ type: "bg", asset: "school_rooftop_day" }`)  
- **Then** the background image transitions with a 300 ms fade

#### AC-GAME-06 — Save shortcut
- **When** the user presses F5 or the save icon in the HUD  
- **Then** a quick-save is written to the dedicated quick-save slot and a toast confirms "Game Saved"

#### AC-GAME-07 — Menu shortcut
- **When** the user presses Escape or the menu icon in the HUD  
- **Then** a pause overlay appears with options: Resume, Save/Load, Settings, Return to Menu

#### AC-GAME-08 — History log
- **When** the user presses H or the log icon  
- **Then** a scrollable overlay shows all dialogue lines from the current chapter session, most recent at bottom  
- **And** text-to-speech can be triggered per line (if enabled in settings)

#### AC-GAME-09 — Auto-play mode
- **Given** the user enables Auto Play via the HUD  
- **When** a dialogue line's reveal animation finishes  
- **Then** the engine automatically advances after a configurable delay (default: 1500 ms)

#### AC-GAME-10 — Affection tracking
- **Given** scene JSON includes affection delta events (`{ type: "affection", character: "aoi", delta: +5 }`)  
- **When** the engine processes that event  
- **Then** the character's affection score in Zustand store is updated  
- **And** no UI indicator is shown during normal gameplay (scores are hidden)

---

### 4.6 `PAGE_CHOICE` *(overlay)*

**Purpose:** Present branching choices to the player.

#### AC-CHOICE-01 — Rendering
- **Given** the engine reaches a `choice` event  
- **When** the choice overlay mounts  
- **Then** all available options render as labelled buttons in the centre of the screen

#### AC-CHOICE-02 — Selection effect
- **When** the user clicks or keyboard-activates a choice  
- **Then** the selected option is highlighted for 200 ms  
- **And** the overlay unmounts  
- **And** the engine advances to the scene/branch specified by that choice

#### AC-CHOICE-03 — Affection consequences
- **Given** a choice has an associated affection delta  
- **When** the player selects it  
- **Then** the affection delta is applied before the next scene loads (no visible notification)

#### AC-CHOICE-04 — No empty options
- **Given** a choice event JSON  
- **Then** CI validation rejects any choice with an empty `label` string

#### AC-CHOICE-05 — Keyboard navigation
- **When** the choice overlay is open  
- **Then** focus is trapped inside the overlay  
- **And** Tab / arrow keys cycle between options  
- **And** pressing Enter confirms the focused option

---

### 4.7 `PAGE_TRANSITION` *(overlay)*

**Purpose:** Inter-scene fade/wipe with optional chapter title card.

#### AC-TRANS-01 — Fade transition
- **Given** a `transition: "fade"` event  
- **Then** a full-screen black overlay fades in (300 ms) then fades out (300 ms)

#### AC-TRANS-02 — Chapter title card
- **Given** a `transition` event with `title: "Chapter 2 — Monsoon Season"`  
- **Then** the title string is displayed in the centre of the black overlay during the transition

#### AC-TRANS-03 — Non-blocking
- **Given** a transition is playing  
- **Then** player input is ignored until the transition completes

---

### 4.8 `PAGE_SAVE_LOAD`

**Purpose:** Manage save slots; create, overwrite, and delete saves.

#### AC-SAVES-01 — Slot display
- **Given** the save/load page renders  
- **Then** exactly 12 save slots are displayed in a 4×3 grid (plus 1 quick-save slot at the top)

#### AC-SAVES-02 — Empty slot
- **Given** a slot has no data  
- **Then** it displays "Empty Slot" and a placeholder thumbnail

#### AC-SAVES-03 — Populated slot metadata
- **Given** a slot has save data  
- **Then** it displays: chapter name, scene description excerpt (≤ 60 chars), timestamp (locale-formatted), and a screenshot thumbnail

#### AC-SAVES-04 — Saving into a slot
- **When** the user clicks a slot while in Save mode  
- **Then** if the slot is occupied, a confirmation modal asks "Overwrite existing save?"  
- **And** confirming writes the current game state to that slot  
- **And** a toast confirms "Save successful"

#### AC-SAVES-05 — Loading from a slot
- **When** the user clicks a populated slot while in Load mode  
- **Then** the game state is restored from that slot  
- **And** the app navigates to `/play/:chapterId/:sceneId` matching the save

#### AC-SAVES-06 — Deleting a save
- **When** the user right-clicks or activates a "Delete" context option on a populated slot  
- **Then** a confirmation modal appears  
- **And** confirming removes the save data and reverts the slot to "Empty Slot"

#### AC-SAVES-07 — Storage quota guard
- **Given** localStorage is near capacity (> 4.5 MB used)  
- **When** a save is attempted  
- **Then** a warning toast informs the user and offers to delete old saves

---

### 4.9 `PAGE_GALLERY`

**Purpose:** CG art viewer with unlock gating.

#### AC-GALLERY-01 — Grid layout
- **Given** the gallery page renders  
- **Then** all CG entries are shown in a responsive grid (min 2 cols mobile, 4 cols desktop)

#### AC-GALLERY-02 — Locked tile
- **Given** a CG has not been unlocked  
- **Then** the tile renders as a dark silhouette with a padlock icon  
- **And** clicking it shows a tooltip "Unlock by completing [route hint]"

#### AC-GALLERY-03 — Unlocked tile
- **Given** a CG has been unlocked  
- **Then** a thumbnail of the CG is displayed

#### AC-GALLERY-04 — Lightbox
- **When** the user clicks an unlocked tile  
- **Then** a lightbox opens with the full-resolution CG  
- **And** left/right navigation arrows cycle through unlocked CGs  
- **And** pressing Escape closes the lightbox

#### AC-GALLERY-05 — Unlock event
- **Given** the game engine processes a `cg_unlock` event for a CG ID  
- **Then** the CG ID is added to `unlockedCGs` in the store and persisted

---

### 4.10 `PAGE_MUSIC_ROOM`

**Purpose:** Listen to unlocked BGM tracks.

#### AC-MUSIC-01 — Track list
- **Given** the music room renders  
- **Then** all tracks are listed with title, source attribution, and duration  
- **And** locked tracks show "???" for title and are non-playable

#### AC-MUSIC-02 — Playback
- **When** the user clicks a track row  
- **Then** the track begins playing  
- **And** a visual waveform or animated indicator shows it is active  
- **And** clicking again or pressing Space pauses

#### AC-MUSIC-03 — Volume control
- **Then** a volume slider affects music room playback independently of game BGM volume

#### AC-MUSIC-04 — Track unlock
- **Given** the game engine processes a `track_unlock` event  
- **Then** the track ID is added to `unlockedTracks` and persisted

---

### 4.11 `PAGE_SETTINGS`

**Purpose:** Persistent configuration for audio, display, accessibility, and data management.

#### AC-SETTINGS-01 — Audio controls
- **Then** separate sliders exist for: Master Volume, BGM Volume, SFX Volume, Voice Volume  
- **And** changes take effect immediately (no save button required)

#### AC-SETTINGS-02 — Text speed
- **Then** a slider (Slow / Normal / Fast / Instant) sets the character reveal interval  
- **And** a live preview text field demonstrates the current speed

#### AC-SETTINGS-03 — Auto-play delay
- **Then** a slider sets the auto-advance delay (0.5 s – 5 s)

#### AC-SETTINGS-04 — Display options
- **Then** toggles exist for: Fullscreen, Skip unread text, Show transition animations, High-contrast mode

#### AC-SETTINGS-05 — Accessibility options
- **Then** options include: Font size (Small / Medium / Large), Dyslexia-friendly font toggle, Reduce motion, Screen-reader dialogue narration

#### AC-SETTINGS-06 — Data management
- **Then** buttons exist for: "Export Save Data" (JSON download), "Import Save Data" (file picker), "Reset All Progress" (with double-confirmation modal)

#### AC-SETTINGS-07 — Persistence
- **Given** the user changes any setting  
- **Then** the new value is immediately written to `settings` in localStorage  
- **And** survives a page refresh

---

### 4.12 `PAGE_CREDITS`

**Purpose:** Acknowledge all contributors and asset licences.

#### AC-CREDITS-01 — Auto-scroll
- **When** the credits page loads  
- **Then** the credits scroll upward automatically at a readable pace (≈ 40 px/s)

#### AC-CREDITS-02 — Pause on hover / focus
- **When** the user hovers over or focuses the credits container  
- **Then** auto-scroll pauses

#### AC-CREDITS-03 — Back button
- **Then** a "Back to Menu" button is always visible (fixed, non-scrolling)  
- **And** clicking it navigates to `/menu`

#### AC-CREDITS-04 — Sections
- **Then** the credits include sections: Story & Script, Art & Character Design, Background Art, Music & Sound, Programming, QA & Testing, Special Thanks, Third-Party Licences

---

### 4.13 `PAGE_ENDING`

**Purpose:** Display the ending CG, narrative conclusion text, and playthrough stats.

#### AC-ENDING-01 — Ending CG reveal
- **Given** the game engine routes to an ending  
- **Then** the ending CG loads with a fade-in  
- **And** the CG is automatically added to `unlockedCGs`

#### AC-ENDING-02 — Narrative text
- **Then** the ending description text is displayed with the same typewriter animation as in-game dialogue  
- **And** the player can click to skip to full text

#### AC-ENDING-03 — Playthrough stats
- **Then** the following stats are shown: Route name, Ending tier (Good / Normal / Bad), Total play time, Affection scores per character at time of ending

#### AC-ENDING-04 — Post-ending options
- **Then** buttons are displayed for: "Return to Menu", "Chapter Select", "View Ending CG in Gallery"

#### AC-ENDING-05 — Ending unlock flag
- **Given** an ending is reached  
- **Then** `completedEndings` in the store is updated with `{ endingId, tier, timestamp }`  
- **And** this persists to localStorage, potentially unlocking gallery items or extras

---

### 4.14 `PAGE_EXTRAS`

**Purpose:** Bonus content: side stories, character bios, lore dictionary.

#### AC-EXTRAS-01 — Sub-sections
- **Then** the Extras page has three tabs: Side Stories, Character Profiles, Lore Dictionary

#### AC-EXTRAS-02 — Side story lock
- **Given** a side story requires completing Route A  
- **When** Route A is not completed  
- **Then** the side story entry is shown as locked with an unlock hint

#### AC-EXTRAS-03 — Character profiles
- **Given** a character profile is unlocked  
- **Then** it displays: name, age, height, personality summary, and affection stat from the player's last completed route

#### AC-EXTRAS-04 — Lore dictionary
- **Then** terms are sorted alphabetically  
- **And** a search/filter input narrows results in real-time  
- **And** locked entries show "???" until the term is referenced in-game

---

### 4.15 `PAGE_404`

**Purpose:** Catch unknown routes gracefully.

#### AC-404-01 — Display
- **Given** the user navigates to any unrecognised path  
- **Then** a styled 404 page renders with the game's visual theme

#### AC-404-02 — Navigation
- **Then** a "Return to Main Menu" button navigates to `/menu`  
- **And** the browser history entry for the 404 path is replaced (not pushed) to avoid back-button trapping

---

## 5. Data Flow Diagrams

### 5.1 Application Boot Flow

```
User navigates to "/"
        │
        ▼
┌─────────────────────┐
│  Check localStorage  │
│  splashSeen flag     │
└────────┬────────────┘
         │
    ┌────┴────┐
    │         │
  false      true
    │         │
    ▼         ▼
PAGE_SPLASH  PAGE_MAIN_MENU ◄──────────────────────────────────────────┐
    │                                                                    │
    │ (animation complete OR user input)                                 │
    ▼                                                                    │
Write splashSeen=true to localStorage                                    │
    │                                                                    │
    └──────────────────► PAGE_MAIN_MENU                                  │
                               │                                         │
              ┌────────────────┼──────────────────────────────┐          │
              │                │                              │          │
         "New Game"       "Continue"                  "Load Game"        │
              │                │                              │          │
              ▼                ▼                              ▼          │
       Check SIR      Load latest save slot          PAGE_SAVE_LOAD     │
       avatar in      → navigate to                        │             │
       store          /play/:ch/:scene                     │             │
              │                                         User selects    │
    ┌─────────┴─────┐                                   save slot       │
    │               │                                        │           │
  No SIR        SIR exists                                  └───────────┘
    │               │
    ▼               ▼
PAGE_SIR_SETUP  Confirm "Start Over?"
    │               │
    │          ┌────┴────┐
    │          Yes       No
    │          │         │
    │          ▼         ▼
    │      PAGE_SIR  Stay on menu
    │      _SETUP
    │
    └─────────────────────► /play/ch01/scene001
```

---

### 5.2 Core Game Loop (PAGE_GAME)

```
                ┌────────────────────────────────────────────────────┐
                │                  GAME ENGINE                        │
                │                                                      │
  Scene JSON ──►│  Scene Loader                                        │
  (/data/       │       │                                              │
   scenes/)     │       ▼                                              │
                │  Event Queue  [bg, sprite, dialogue, choice,         │
                │               affection, cg_unlock, track_unlock,   │
                │               transition, goto_scene]               │
                │       │                                              │
                │       ▼                                              │
                │  ┌─────────────────────────────────────────────┐   │
                │  │           Event Dispatcher                   │   │
                │  └──┬────────┬────────┬────────┬──────┬────────┘   │
                │     │        │        │        │      │             │
                │     ▼        ▼        ▼        ▼      ▼             │
                │  Render   Render   Render   Choice  Affection       │
                │   BG     Sprites  Dialogue  Overlay  Store         │
                │  Layer    Layer    Box      (modal)  Update        │
                │                    │                  │             │
                │                    │                  ▼             │
                │                    │           Zustand Store        │
                │          Player    │           (persisted to        │
                │          Input     │            localStorage)       │
                │          (click/   │                                 │
                │           key)     │                                 │
                │             │      │                                 │
                │             └─────►│ Advance                        │
                │                    ▼                                 │
                │               Next Event                             │
                │               in Queue                               │
                │                    │                                 │
                │            ┌───────┴────────┐                       │
                │            │                │                        │
                │       More events      Queue empty                  │
                │            │                │                        │
                │            └───┐    ┌───────┘                       │
                │                │    │ Evaluate ending condition      │
                │                │    ▼                                │
                │                │  Load next scene JSON              │
                │                │  OR navigate to /ending/:id        │
                │                │                                     │
                └────────────────┼─────────────────────────────────────┘
                                 │
                                 ▼
                         Continue loop
```

---

### 5.3 Choice & Affection Resolution

```
Engine hits choice event
          │
          ▼
    Render PAGE_CHOICE overlay
    (focus trap, keyboard nav)
          │
     User selects option N
          │
          ▼
    ┌─────────────────────────┐
    │  Choice Resolver         │
    │  ─────────────────────  │
    │  1. Apply affection delta│  ──► Zustand store.affection[char] += delta
    │  2. Set flag (if any)    │  ──► Zustand store.flags[flagId] = true
    │  3. Determine next scene │
    └──────────┬──────────────┘
               │
               ▼
    Navigate to next_scene_id
    (engine loads new scene JSON)
```

---

### 5.4 Save / Load Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                     SAVE OPERATION                                │
│                                                                    │
│  User triggers save (F5 / HUD / Save-Load page)                   │
│          │                                                         │
│          ▼                                                         │
│  Capture current state snapshot:                                   │
│    { chapterId, sceneId, eventIndex, sirAvatar,                    │
│      affection, flags, unlockedCGs, unlockedTracks,                │
│      completedEndings, settings, timestamp, thumbnail }            │
│          │                                                         │
│          ▼                                                         │
│  JSON.stringify(snapshot)                                          │
│          │                                                         │
│  ┌───────┴────────────────────────────────────────┐               │
│  │  localStorage key: `vnsir_save_slot_{n}`        │               │
│  └────────────────────────────────────────────────┘               │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                     LOAD OPERATION                                │
│                                                                    │
│  User selects save slot                                            │
│          │                                                         │
│          ▼                                                         │
│  Read localStorage key `vnsir_save_slot_{n}`                       │
│          │                                                         │
│          ▼                                                         │
│  JSON.parse(raw)  ──► Schema validation (Zod)                      │
│          │                       │                                 │
│     Valid ◄────────────────   Invalid                              │
│          │                       │                                 │
│          ▼                       ▼                                 │
│  Hydrate Zustand store    Show error toast                         │
│          │                "Save file corrupted"                    │
│          ▼                                                         │
│  navigate(`/play/${chapterId}/${sceneId}`)                         │
│          │                                                         │
│  Engine seeks to saved eventIndex in scene JSON                    │
└──────────────────────────────────────────────────────────────────┘
```

---

### 5.5 Unlock Propagation Flow

```
In-game engine event
  { type: "cg_unlock",      { type: "track_unlock",   Ending reached
    cgId: "cg_ch2_rain" }     trackId: "ost_03" }          │
          │                          │                      │
          ▼                          ▼                      ▼
  store.unlockedCGs           store.unlockedTracks   store.completedEndings
    .add(cgId)                  .add(trackId)          .push(endingRecord)
          │                          │                      │
          └──────────────────────────┴──────────────────────┘
                                     │
                                     ▼
                           Zustand persist middleware
                                     │
                                     ▼
                             localStorage sync
                                     │
                                     ▼
                  PAGE_GALLERY / PAGE_MUSIC_ROOM / PAGE_EXTRAS
                  re-renders reactively via Zustand subscriptions
```

---

### 5.6 Settings Data Flow

```
User changes setting
(slider / toggle / select)
          │
          ▼
  Zustand settings store
  (immediate state update)
          │
  ┌───────┴───────────────────────────────────────────────────────┐
  │  Side-effect handlers (via Zustand subscriptions):             │
  │   • BGM/SFX volume  ──► Howler.js volume update              │
  │   • Text speed      ──► TypewriterEngine.setInterval(ms)     │
  │   • High contrast   ──► document.documentElement className   │
  │   • Reduce motion   ──► CSS custom property --motion-scale   │
  │   • Font size       ──► CSS custom property --base-font-size │
  └───────────────────────────────────────────────────────────────┘
          │
          ▼
  localStorage `vnsir_settings` updated via persist middleware
  (debounced 200 ms to avoid write storms on slider drag)
```

---

## 6. Game State Model

```typescript
// Canonical Zustand store shape (TypeScript)

interface SIRAvatar {
  displayName: string;          // max 24 chars
  pronounSubject: string;       // "she" | "he" | "they" | custom
  pronounObject: string;        // "her" | "him" | "them" | custom
  appearanceTokenId: string;    // references /assets/avatars/{id}.svg
}

interface AffectionMap {
  [characterId: string]: number;  // e.g. { "aoi": 45, "rei": 30 }
}

interface EndingRecord {
  endingId: string;
  tier: "good" | "normal" | "bad";
  timestamp: number;            // unix ms
}

interface GameProgress {
  chapterId: string;            // e.g. "ch01"
  sceneId: string;              // e.g. "scene042"
  eventIndex: number;           // position within scene event queue
  affection: AffectionMap;
  flags: Record<string, boolean>; // story flags set by choices
  unlockedCGs: string[];
  unlockedTracks: string[];
  completedEndings: EndingRecord[];
  totalPlaytimeMs: number;
}

interface Settings {
  masterVolume: number;         // 0–1
  bgmVolume: number;
  sfxVolume: number;
  voiceVolume: number;
  textSpeedMs: number;          // ms per character; 0 = instant
  autoPlayDelayMs: number;
  skipUnread: boolean;
  showTransitions: boolean;
  highContrast: boolean;
  reduceMotion: boolean;
  fontSize: "small" | "medium" | "large";
  dyslexiaFont: boolean;
  screenReaderNarration: boolean;
  fullscreen: boolean;
}

interface VNSIRStore {
  sirAvatar: SIRAvatar | null;
  progress: GameProgress;
  settings: Settings;
  splashSeen: boolean;
}
```

---

## 7. Save / Load Architecture

### Slot Layout

| Slot Key | Description |
|----------|-------------|
| `vnsir_save_quick` | Quick-save (F5); single slot, always overwritten |
| `vnsir_save_slot_01` … `vnsir_save_slot_12` | Manual save slots |
| `vnsir_settings` | Settings object (separate from progress saves) |
| `vnsir_global` | SIR avatar, splash flag, unlock state (shared across saves) |

### Thumbnail Generation

On save, the game canvas is captured via `html2canvas` at 320×180 px and stored as a base64 Data URI in the save slot JSON. Total per-slot budget: ≤ 80 KB.

### Schema Versioning

Save files include a `schemaVersion: number` field. On load, a migration chain upgrades older saves to the current schema before hydrating the store.

---

## 8. Routing Map

```
/                     → PAGE_SPLASH
/menu                 → PAGE_MAIN_MENU
/setup                → PAGE_SIR_SETUP
/chapters             → PAGE_CHAPTER_SELECT
/play/:chapterId/:sceneId  → PAGE_GAME
  (overlays within /play):
    choice prompt     → PAGE_CHOICE (modal)
    scene transition  → PAGE_TRANSITION (overlay)
    pause menu        → pause overlay (inline)
    history log       → log overlay (inline)
/saves                → PAGE_SAVE_LOAD
/gallery              → PAGE_GALLERY
/music                → PAGE_MUSIC_ROOM
/settings             → PAGE_SETTINGS
/credits              → PAGE_CREDITS
/ending/:endingId     → PAGE_ENDING
/extras               → PAGE_EXTRAS
*                     → PAGE_404
```

### Route Guards

| Condition | Guard Behaviour |
|-----------|-----------------|
| SIR avatar not set AND path starts with `/play` | Redirect to `/setup` |
| No progress AND path is `/chapters` | Redirect to `/menu` |
| Authenticated chapter not unlocked AND navigated directly | Redirect to `/chapters` with toast warning |

---

## 9. Non-Functional Requirements

### Performance

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5 s on 4G |
| Time to Interactive | < 3 s on 4G |
| Dialogue advance latency | < 16 ms (one frame) |
| Scene JSON load time | < 200 ms (lazy-loaded per chapter) |
| Memory footprint | < 150 MB with all chapter 1 assets loaded |

### Accessibility

- WCAG 2.2 AA compliance throughout
- All interactive elements have visible focus indicators
- No reliance on colour alone to convey information
- All animations respect `prefers-reduced-motion`
- Dialogue history accessible to screen readers at all times

### Browser Support

- Chrome / Edge ≥ 110, Firefox ≥ 115, Safari ≥ 16
- Mobile: iOS Safari ≥ 16, Chrome Android ≥ 110
- Minimum viewport: 320 px wide

### Security

- No external CDN dependencies at runtime (all assets bundled or self-hosted)
- CSP header: `default-src 'self'; img-src 'self' data:; media-src 'self'`
- No personal data transmitted; all state is local

### Internationalisation

- All user-facing strings extracted to `/src/i18n/en.json` from day 1
- RTL layout tested for future localisation readiness

---

## 10. Glossary

| Term | Definition |
|------|------------|
| **SIR** | Self-Insert Route — the mechanism by which the player defines their in-world avatar |
| **Scene JSON** | JSON file defining one scene's ordered event queue (dialogue, sprite changes, backgrounds, choices) |
| **Event Queue** | Ordered list of engine events within a single scene |
| **Affection Score** | Per-character integer tracking relationship progress; gates route and ending outcomes |
| **Route** | A narrative branch, typically defined by cumulative affection scores at key chapter decision points |
| **Ending Tier** | Quality classification of a route conclusion: Good, Normal, or Bad |
| **CG** | "Computer Graphic" — a full-screen illustration unlocked at key story moments |
| **BGM** | Background Music — looping audio track playing during scenes |
| **Quick-Save** | Single-slot save overwritten instantly via F5 or HUD button |
| **Flag** | Boolean story variable set by a player choice and checked by later branching conditions |
| **Schema Version** | Integer incremented when the save file structure changes; enables forward migration |

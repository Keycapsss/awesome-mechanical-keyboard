---
description: Add a keyboard entry from a GitHub repository URL
argument-hint: <github-url>
allowed-tools: WebFetch, Read, Write, Glob, Grep, AskUserQuestion, Bash
model: haiku
---

# Add Keyboard Entry from GitHub

Add a new keyboard to the catalog from a GitHub repository.

## Input

GitHub URL: $ARGUMENTS

## Instructions

### Step 1: Validate URL

Verify the URL is a valid GitHub repository URL (github.com/owner/repo format).
If invalid, inform the user and stop.

### Step 2: Check for Duplicates

Use Grep to search for the URL in `src/content/keyboards/**/*.md`.
If the keyboard already exists, inform the user and ask how to proceed.

### Step 3: Fetch Repository Data

Use WebFetch once to retrieve all needed information from `$ARGUMENTS`:

**Extract from the GitHub repository page and README**:

- Repository name (clean it up: replace hyphens/underscores with spaces, title case)
- Repository description from the About section
- GitHub topics/tags
- First significant image URL from README (look for `![` markdown or `<img` tags showing the keyboard)
- Raw mentions of: QMK, ZMK, Vial, KiCad, PCB, STL, 3MF, case files, key counts (40%, 60%, 65%, 75%, TKL, 3x5, 4x6), layouts (Alice, Arisu), switch types (Choc, MX, low profile, hotswap), controllers (Pro Micro, RP2040, STM32, Elite-C, nice!nano, ATmega32U4, nRF52840, integrated controller), features (wireless, bluetooth, USB-C, rotary encoder, RGB, underglow, OLED, screen, e-ink, Cirque, Azoteq, trackball, tenting, TRRS, through hole, handwiring, reversible, 3D printed)

Return this information in a structured format.

### Step 4: Generate Tags

Generate tags from the fetched data by normalizing raw mentions to canonical tags.

**Tag normalization rules**:

- `qmk`, `zmk`, `vial` - use as-is (lowercase)
- `pcb` - if KiCad or PCB mentioned
- `case` - if STL, 3MF, or case files mentioned
- `40%`, `60%`, `65%`, `75%`, `tkl`, `3x5`, `4x6` - use as-is (lowercase)
- `alice` - use for both Alice and Arisu layouts
- `choc`, `mx`, `low profile`, `hotswap` - use as-is (lowercase)
- `pro micro`, `rp2040`, `stm32`, `elite-c`, `nice!nano`, `atmega32u4`, `nrf52840` - use as-is (lowercase)
- `wireless`, `bluetooth`, `usb-c`, `rotary encoder`, `per-key rgb`, `underglow`, `tenting puck`, `trrs`, `through hole`, `handwiring`, `reversible`, `3d printed`, `trackball` - use as-is (lowercase)

**Aliases** (convert raw mentions to these canonical tags):

- `display` ← oled, screen, e-ink
- `onboard controller` ← integrated controller, integrated RP2040, integrated nRF52840, integrated STM32
- `trackpad` ← cirque, azoteq
- `generative` ← if a tool like openscad, or python code generates the keyboard files

Format as comma-separated string (e.g., "split, choc, pcb, case, display").

### Step 5: Determine Category

Use AskUserQuestion to let the user select the category:

```yaml
Question: "Which category best describes this keyboard?"
Header: "Category"
Options:
  - split: Two separate halves connected together
  - ortholinear: Grid layout with no row stagger
  - staggered: Traditional row-staggered layout
  - other: Numpad, macropad, or unique design
```

### Step 6: Generate Description

Create a concise description (max 500 characters) from:

- Repository description
- First paragraph of README
- Key features detected

The description should explain what makes this keyboard interesting or unique.

### Step 7: Preview Entry

Show the user a concise preview:

```text
Name: [keyboard name]
Category: [category]
Tags: [tags]
Path: src/content/keyboards/[category]/[slug].md
```

Use AskUserQuestion to confirm:

```yaml
Question: "Create this keyboard entry?"
Header: "Confirm"
Options:
  - Yes, create it: Proceed with creating the file
  - Let me edit: I want to modify some fields first
  - Cancel: Don't create the entry
```

If "Let me edit" is selected, ask which field to modify and get the new value.

### Step 8: Create the File

Generate a filename slug from the keyboard name (lowercase, hyphens, no special chars).

Write to `src/content/keyboards/[category]/[slug].md`:

```yaml
---
name: "[Name]"
url: "[GitHub URL]"
category: "[category]"
tags: "[tags]"
description: "[description]"
image: "[image URL]"
---
```

### Step 9: Confirm Success

Tell the user:

1. File created successfully at [path]
2. Run `npm run dev` to preview the site
3. The image will be automatically downloaded and converted to WebP during build

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

### Step 1: Validate and Normalize URL

Normalize the URL before doing anything else:

- Strip trailing slashes
- Remove `www.`
- Strip any path suffix beyond `owner/repo` (e.g. `/tree/main`, `/blob/...`, `#readme`)
- Result must match `https://github.com/{owner}/{repo}`

Extract `owner` and `repo`. If the URL is not a valid GitHub repo URL, inform the user and stop.

### Step 2: Check for Duplicates

Use Grep to search for the normalized URL in `src/content/keyboards/**/*.md`.
If the keyboard already exists, inform the user and ask how to proceed.

### Step 3: Fetch Repository Data via gh CLI

Run these two calls in parallel with Bash:

**3a. Repository metadata** (includes archive/activity status):

```bash
gh repo view owner/repo --json name,description,repositoryTopics,url,defaultBranchRef,isArchived,pushedAt
```

**3b. Root README content:**

```bash
gh api repos/owner/repo/readme --jq '.content' | base64 -d
```

If `gh` is not available or the calls fail (e.g., private repo without access), fall back to `WebFetch` on the GitHub URL.

**Archive/activity check**: If `isArchived` is `true`, or `pushedAt` is more than 3 years ago, warn the user:
> "⚠ This repo appears inactive (last push: {date} / archived). Continue anyway?"
Use AskUserQuestion with Yes/Cancel options before proceeding.

**Monorepo handling**: If the root README is sparse (under 200 characters or contains no keyboard-related keywords), check for a nested README by searching common subdirectory patterns:

```bash
gh api repos/owner/repo/contents | jq '[.[] | select(.type=="dir") | .name]'
```

If a relevant subdirectory exists (e.g., matches the repo name, or contains `keyboard`/`pcb`/`case`), fetch its README too:

```bash
gh api repos/owner/repo/contents/{subdir}/README.md --jq '.content' | base64 -d
```

Use whichever README has richer content.

**Extract from the results**:

- Repository name (clean it up: replace hyphens/underscores with spaces, title case)
- Repository description from the `description` field
- Topics from the `repositoryTopics` array (each topic has a `topic.name`)
- Up to 3 candidate image URLs from the README (see image selection below)
- Raw mentions of: QMK, ZMK, Vial, KiCad, PCB, STL, 3MF, case files, key counts (40%, 60%, 65%, 75%, TKL, 3x5, 4x6), layouts (Alice, Arisu), switch types (Choc, MX, low profile, hotswap), controllers (Pro Micro, RP2040, STM32, Elite-C, nice!nano, ATmega32U4, nRF52840, integrated controller), features (wireless, bluetooth, USB-C, rotary encoder, RGB, underglow, OLED, screen, e-ink, Cirque, Azoteq, trackball, tenting, TRRS, through hole, handwiring, reversible, 3D printed)

**Image selection**: Scan the README for all `![...](...) ` markdown images and `<img src="...">` tags. Collect up to 3 candidates, filtering out badges (shields.io, badge URLs, tiny images) and favoring `.jpg`, `.png`, `.gif`, `.webp`. Resolve relative paths to raw GitHub URLs using the default branch:
`https://raw.githubusercontent.com/owner/repo/{branch}/{path}`

### Step 4: Select Image

If more than one image candidate was found, present them to the user:

```yaml
Question: "Which image best shows the keyboard?"
Header: "Select image"
Options:
  - 1: [URL of candidate 1]
  - 2: [URL of candidate 2]
  - 3: [URL of candidate 3]  # if available
  - None: Skip image
```

If only one candidate was found, use it without asking. If none were found, omit the `image` field.

### Step 5: Generate Tags

Scan existing keyboard entries to see what tags are already in use, so new tags stay consistent:

```bash
grep -h "^tags:" src/content/keyboards/**/*.md | sort | uniq -c | sort -rn | head -40
```

Generate tags from the fetched data by normalizing raw mentions to canonical tags. Cross-reference against the existing tag list — prefer an existing tag spelling over inventing a new variant.

Also include any relevant GitHub topics from Step 3a.

**Tag normalization rules**:

- `qmk`, `zmk`, `vial` — use as-is (lowercase)
- `pcb` — if KiCad or PCB mentioned
- `case` — if STL, 3MF, or case files mentioned
- `40%`, `60%`, `65%`, `75%`, `tkl`, `3x5`, `4x6` — use as-is (lowercase)
- `alice` — use for both Alice and Arisu layouts
- `choc`, `mx`, `low profile`, `hotswap` — use as-is (lowercase)
- `pro micro`, `rp2040`, `stm32`, `elite-c`, `nice!nano`, `atmega32u4`, `nrf52840` — use as-is (lowercase)
- `wireless`, `bluetooth`, `usb-c`, `rotary encoder`, `per-key rgb`, `underglow`, `tenting puck`, `trrs`, `through hole`, `handwiring`, `reversible`, `3d printed`, `trackball` — use as-is (lowercase)

**Aliases** (convert raw mentions to these canonical tags):

- `display` ← oled, screen, e-ink
- `onboard controller` ← integrated controller, integrated RP2040, integrated nRF52840, integrated STM32
- `trackpad` ← cirque, azoteq
- `generative` ← if a tool like openscad, or python code generates the keyboard files

Format as comma-separated string (e.g., "split, choc, pcb, case, display").

### Step 6: Determine Category

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

### Step 7: Generate Description

Create a concise description (max 500 characters) from:

- Repository description
- First paragraph of README
- Key features detected

The description should explain what makes this keyboard interesting or unique. If none of the above yield meaningful content, omit the `description` field rather than writing a generic filler sentence.

### Step 8: Preview Entry

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

### Step 9: Create the File

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

Omit `description` and/or `image` if they have no value.

### Step 10: Confirm Success

Tell the user:

1. File created successfully at [path]
2. Run `npm run dev` to preview the site
3. The image will be automatically downloaded and converted to WebP during build

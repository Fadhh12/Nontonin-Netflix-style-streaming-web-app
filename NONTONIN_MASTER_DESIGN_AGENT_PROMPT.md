# NONTONIN — MASTER UI DESIGN AGENT PROMPT
## Netflix-style cinematic streaming interface — implementation source of truth

You are the UI/UX design and frontend implementation agent for **Nontonin**.

Your job is NOT to invent a generic streaming dashboard. Build Nontonin as a **premium cinematic streaming website with the visual grammar of a major streaming platform**, closely following the supplied Netflix reference image in layout, hierarchy, density, proportions, and interaction patterns.

IMPORTANT:
- The reference image is the visual benchmark.
- The Nontonin PRD is the product/feature benchmark.
- This document is the implementation benchmark.
- When these conflict, use the PRD for functionality and this document for visual behavior.
- Do not create extra features that are not requested.
- Do not redesign the concept into SaaS/dashboard style.

---

# 01. CORE VISUAL TARGET

The website should immediately communicate:

> "This is a serious, cinematic streaming platform."

It should NOT look like:
- a SaaS dashboard
- a portfolio landing page
- a generic card-based web template
- a mobile app stretched onto desktop
- a glassmorphism website
- a Bootstrap-style website

The design must have the following visual hierarchy:

1. Fixed/sticky top navigation
2. Large cinematic hero/banner
3. Hero title + metadata + description + CTA
4. Multiple horizontal content rails
5. Large media artwork
6. Dense but clean dark composition
7. Hover interactions over posters
8. Full-screen or centered title modal
9. Search results as poster grid
10. Profile selection screen
11. My List
12. Authentication screens
13. Trailer modal
14. Footer with TMDB attribution

The page should feel immersive and image-led.

---

# 02. BRAND

Product name:

Nontonin

Wordmark:
- Use plain text "Nontonin" or a custom wordmark.
- Do NOT use the Netflix logo.
- Do NOT write "Netflix" anywhere in the actual product UI.
- Do NOT reproduce Netflix's N symbol.
- Do NOT use Netflix trademark assets.

Brand accent:

#FF6B35

This is intentionally Nontonin's own orange/coral accent.

Do NOT use Netflix red as Nontonin's brand color.

---

# 03. COLOR SYSTEM

Use this exact palette:

```text
Background:
#0B0B0F

Primary Surface:
#15151C

Secondary Surface:
#1D1D25

Primary Text:
#F2F2F5

Secondary Text:
#A3A3B2

Brand:
#FF6B35

Brand Hover:
#E95A2B

Success:
#16A34A

Warning:
#F59E0B

Error:
#DC2626

Overlay:
rgba(0,0,0,0.60)
```

The majority of the UI must remain near-black.

Color ratio:
- approximately 70% dark background/media
- approximately 20% neutral surfaces
- approximately 10% accent/highlight

Never turn the website into an orange website.

Orange is for:
- primary CTA
- active navigation
- focus
- selected state
- important status
- small highlights

---

# 04. TYPOGRAPHY

Use:

Headings:
Plus Jakarta Sans

Body/UI:
Inter

Weights:
- 400 regular
- 500 medium
- 600 semibold
- 700 bold
- 800 only for major display wordmark/hero

Typography should be compact.

Do NOT use:
- huge marketing typography everywhere
- playful rounded fonts
- serif fonts
- decorative fonts

Desktop hero title:
56–72px

Section title:
20–24px

Card title:
12–14px

Metadata:
11–13px

Description:
14–16px

Navigation:
13–14px

---

# 05. GLOBAL DESKTOP CANVAS

Design for desktop first.

Primary target:
1440 × 900

Also support:
1280 × 720
1536 × 864
1920 × 1080

Content width:
approximately 90% viewport width

Maximum content width:
1440px

Desktop side padding:
40–64px

Navbar:
64–72px high

Do not center the entire website inside a small fixed-width container.

The hero and media rails should visually extend close to the viewport edges.

---

# 06. NAVBAR — VERY IMPORTANT

The navbar must visually resemble the compact navigation pattern of a premium streaming service.

Desktop:

```text
[Nontonin]   Beranda   Film   Series   My List             Search  🔔  Avatar
```

Position:
fixed/sticky at top.

Initial state:
transparent/dark gradient over hero.

After scrolling:
solid #0B0B0F / #15151C.

Height:
68px.

Horizontal padding:
40–64px.

Logo:
left aligned.

Navigation:
immediately after logo.

Actions:
right aligned.

Use subtle white/gray text.

Active page:
white text + small orange underline or orange indicator.

Do NOT:
- make navbar huge
- use boxed menu buttons
- use sidebar on desktop
- use glassmorphism cards around nav
- put every navigation item inside pills

---

# 07. HERO — MOST IMPORTANT SCREEN ELEMENT

The hero must be the dominant visual element.

Desktop height:
approximately 620px.

Use a cinematic 16:9+ backdrop.

The background image fills the entire hero.

Do not place the image inside a card.

Hero composition:

```text
------------------------------------------------------------
| NAVBAR                                                    |
|                                                          |
|  FEATURED                                                |
|                                                          |
|  MOVIE TITLE                                             |
|  2026   •   2h 08m   •   ⭐ 8.4                          |
|                                                          |
|  Two or three lines of synopsis...                       |
|                                                          |
|  [ ▶ Putar Trailer ]   [ + My List ]                     |
|                                                          |
|                                      CINEMATIC IMAGE      |
|                                      CINEMATIC IMAGE      |
------------------------------------------------------------
```

Text should occupy approximately 35–45% of hero width.

Image should dominate the remaining area.

Use:
- left-to-right black gradient
- bottom black gradient
- slight overall darkening

The left side must be substantially darker than the image.

Hero title:
40–64px.

Do not put hero content in a white/dark rectangular card.

---

# 08. HERO IMAGE TREATMENT

This is critical.

Use:

```css
background-size: cover;
background-position: center;
```

Layer order:

1. Image
2. right/overall dark overlay
3. left gradient
4. bottom gradient
5. content

Recommended visual gradient:

```css
linear-gradient(
  90deg,
  #0B0B0F 0%,
  rgba(11,11,15,.90) 18%,
  rgba(11,11,15,.55) 43%,
  rgba(11,11,15,.10) 70%,
  rgba(11,11,15,.35) 100%
)
```

and:

```css
linear-gradient(
  0deg,
  #0B0B0F 0%,
  transparent 45%
)
```

Do not use colored gradient overlays.

The image itself provides the color.

---

# 09. HERO CTA

Primary:

`▶ Putar Trailer`

Secondary:

`+ My List`

Primary:
- Nontonin orange
- dark text or white depending on contrast
- 44–48px high
- 8px radius
- horizontal padding 20–24px

Secondary:
- rgba(255,255,255,.12)
- white text
- no thick border

Buttons must be compact.

Do not make giant rounded pills.

---

# 10. CONTENT RAILS

This is one of the most important visual patterns.

After the hero, use horizontal media rails.

Examples:

```text
Trending Hari Ini
[poster][poster][poster][poster][poster][poster]

Populer
[poster][poster][poster][poster][poster][poster]

Top Rated
[poster][poster][poster][poster][poster][poster]

Action
[poster][poster][poster][poster][poster][poster]

Drama
[poster][poster][poster][poster][poster][poster]

Series Populer
[poster][poster][poster][poster][poster][poster]
```

Desktop:
approximately 6 posters visible.

Poster:
2:3 ratio.

Gap:
12–16px.

Border radius:
6–8px.

Do NOT use equal-height giant cards with large text underneath.

The poster image must be the dominant object.

---

# 11. POSTER CARD

Default state:

Only show:
- poster image
- optional small metadata/title

Hover state:

The card slightly grows:

```text
scale(1.05)
```

Duration:
200ms.

The hovered card may reveal:

```text
[poster]

▶
Title
2026 · ⭐ 8.4
+ My List     ♡
```

Use a dark bottom overlay.

Do not reveal an enormous information panel.

Do not make cards look like SaaS widgets.

---

# 12. MEDIA RAIL NAVIGATION

On desktop, show left/right arrows only when useful.

Arrow:
40×40px

Background:
rgba(0,0,0,.75)

Border:
none

Icon:
white

Position:
vertically centered at rail edges.

On mobile:
hide arrows.

Allow horizontal swipe.

---

# 13. SECTION SPACING

The reference must feel dense like a streaming catalog.

Use:

Hero → first rail:
approximately 10–24px overlap/transition.

Between rails:
32–42px.

Section title:
margin-bottom 12–16px.

Do NOT create huge 100px whitespace between every section.

This is a streaming platform, not a marketing landing page.

---

# 14. BROWSE PAGE

Route:

`/browse`

Structure:

```text
Navbar
Hero
Trending Hari Ini
Populer
Top Rated
Genre rows
Series Populer
Footer
```

If watch history exists:

```text
Lanjut Menonton
```

can appear before Trending.

Every row uses the same poster component.

The page should feel continuous and scrollable.

---

# 15. SEARCH PAGE

Route:

`/search`

Do not redesign search as a SaaS filter dashboard.

Top:

Navbar

Then:

```text
Cari film atau series...

Hasil pencarian
```

Desktop:
6 columns.

Tablet:
3 columns.

Mobile:
2 columns.

Poster cards remain visually identical to Browse.

Each result may show:
- title
- year
- type

No oversized filter sidebar.

---

# 16. MY LIST

Route:

`/my-list`

Header:

```text
My List
Judul yang kamu simpan.
```

Then poster grid.

Desktop:
6 columns.

No huge cards.

Hover:
remove button / info.

Empty:

```text
My List masih kosong

Jelajahi film
```

Center the empty state but keep it visually minimal.

---

# 17. PROFILE SELECTION

Route:

`/profiles`

This screen should closely follow the reference image's profile-selection composition.

Full dark background.

Centered vertically and horizontally.

Top:
Nontonin wordmark.

Center heading:

`Siapa yang menonton?`

Profiles:

```text
○ Nabila
○ Raka
○ Dina
○ Kids
○ + Tambah profil
```

Avatar:
120px desktop.

Names:
14px.

No cards around each profile unless needed for hover.

On hover:
avatar gets subtle orange border.

Keep lots of clean empty space.

---

# 18. TITLE DETAIL

Desktop can use a centered modal.

Maximum width:
850px.

Background:
#15151C.

Backdrop at top.

Structure:

```text
[ BACKDROP IMAGE                         X ]

TITLE
2026 • 2h 08m • ⭐ 8.4

[▶ Putar Trailer] [+ My List] [♡ Suka]

Synopsis

Genre
Cast

Judul Serupa
[poster][poster][poster][poster]
```

Scrim:
rgba(0,0,0,.60)

Radius:
12px.

On mobile:
convert modal into a full-screen detail page.

---

# 19. TRAILER MODAL

Maximum width:
960px.

Video:
16:9.

Black player.

Close button:
top right.

Below:
title + metadata.

If no trailer:

`Trailer belum tersedia`

Do not show a fake movie player interface with unnecessary controls.

---

# 20. AUTHENTICATION

Login and Register must still belong to the cinematic product.

Do NOT make them look like corporate SaaS login pages.

Background:
dark cinematic image + dark overlay.

Centered card:
approximately 400–420px.

Surface:
#15151C.

Radius:
12px.

Login:

```text
Nontonin

Masuk ke Nontonin

Email
Kata sandi

[Masuk]

atau

[Lanjut dengan Google]

Belum punya akun? Daftar
```

Register:

```text
Buat akun Nontonin

Email
Kata sandi
Konfirmasi kata sandi

[Daftar]

Sudah punya akun? Masuk
```

---

# 21. FOOTER

Keep footer small.

Include:

Nontonin

TMDB attribution.

Links:
- Tentang
- Privasi
- Ketentuan
- Bantuan

Do not make a giant marketing footer.

---

# 22. RESPONSIVE BEHAVIOR

Desktop:
1280px+

Use full navigation.

6 poster columns.

Tablet:
768–1279px.

3–5 columns depending width.

Mobile:
360–767px.

2 poster columns.

Mobile navbar:

Top:
Nontonin + Search + Avatar

Bottom fixed navigation:

```text
Beranda
Cari
My List
Profil
```

Mobile hero:
- shorter
- title smaller
- buttons may stack or shrink
- image remains cinematic
- text remains readable

Mobile rails:
horizontal scroll.

Mobile detail:
full screen.

Do NOT simply shrink the desktop layout.

---

# 23. ICONOGRAPHY

Use Lucide-style icons.

Preferred:
- Search
- Bell
- User
- Play
- Plus
- Heart
- Info
- ChevronLeft
- ChevronRight
- X
- Check

Stroke:
1.75–2px.

No emoji in production UI.

---

# 24. IMAGE RULES

Use cinematic movie/series imagery.

Preferred aspect:
- Hero: 16:9 or wider
- Poster: 2:3
- Avatar: 1:1

All images:
object-fit: cover.

Do not distort images.

Use lazy loading for poster grids.

Provide alt text.

If TMDB images are available:
use their official image URLs.

Do not permanently hardcode random stock photography in the final production build.

---

# 25. DATA / PRD ALIGNMENT

The PRD defines Nontonin as a streaming web app centered on:
- browse
- title detail
- trailer
- search
- authentication
- multi-profile
- My List

The interface must therefore visually prioritize those features.

Do not add:
- payroll
- recruitment
- HR dashboard
- admin dashboard
- pricing
- subscriptions
- advertisements
- social feed
- full movie hosting

Those belong to other projects and must NOT appear in Nontonin.

---

# 26. COMPONENT ARCHITECTURE

Create reusable components:

```text
Navbar
HeroBanner
MediaRail
MediaCard
MediaGrid
SearchBar
ProfileSelector
TitleDetailModal
TrailerModal
AuthCard
Footer
MobileBottomNav
```

The same `MediaCard` must be reused across:
- Trending
- Popular
- Top Rated
- Search
- My List
- Similar Titles

Do not create five visually different card components.

---

# 27. ROUTES

Implement/design:

```text
/
 /browse
 /search
 /my-list
 /profiles
 /login
 /register
 /title/[type]/[id]
```

Modal states:

```text
title detail
trailer
profile management
```

---

# 28. INTERACTION STATES

Every major interactive component needs:

1. Default
2. Hover
3. Focus
4. Active
5. Disabled
6. Loading
7. Error
8. Empty

Do not only design the happy path.

Example:

Search:
- loading
- results
- no results
- error

My List:
- populated
- empty
- loading

Trailer:
- loading
- available
- unavailable

Auth:
- default
- validation error
- loading
- success

---

# 29. ACCESSIBILITY

Minimum:
- keyboard navigation
- visible focus
- aria-label for icon buttons
- alt text
- modal focus trap
- Escape closes modal
- sufficient text contrast
- touch target >= 44px
- reduced motion support

Do not rely on hover for essential information.

---

# 30. CRITICAL VISUAL CHECKLIST

Before declaring the design complete, compare it against the supplied reference.

Ask:

### Navbar
- Is it compact?
- Is it dark?
- Is the logo left?
- Are actions right?

### Hero
- Does the image fill the area?
- Is the left side dark enough?
- Is the title large?
- Are metadata and CTA directly below?
- Does it feel cinematic?

### Rails
- Are posters dominant?
- Are there approximately 6 visible on desktop?
- Are rows horizontal?
- Are gaps tight?
- Is the page dense enough?

### Cards
- Are posters 2:3?
- Are corners subtle?
- Does hover scale slightly?
- Is there no giant card text?

### Detail
- Does it look like a streaming title overlay?
- Is the backdrop prominent?
- Is the modal approximately 850px?

### Profiles
- Is the selection centered?
- Are avatars large?
- Is there generous empty space?

### Search/My List
- Are they poster-first?
- Are they grids rather than dashboard tables?

If any answer is "no", fix it before implementation.

---

# 31. FINAL INSTRUCTION TO THE AI AGENT

DO NOT interpret this document as a suggestion.

Treat it as the **design specification**.

The desired result is:

**Nontonin = a cinematic, premium, dark streaming website whose layout and interaction language closely follow the supplied Netflix reference, while using Nontonin's own branding, coral-orange accent, Indonesian UI copy, and PRD-defined functionality.**

When generating code:
- preserve this hierarchy
- preserve these proportions
- preserve these colors
- preserve these component behaviors
- preserve these responsive rules
- preserve these states

Do not simplify the design into generic cards.

Do not invent a new visual direction.

Do not turn it into a dashboard.

Do not replace the horizontal streaming rails with ordinary CSS grids on Browse.

Do not replace the cinematic hero with a plain banner.

Do not replace the profile screen with a normal settings page.

Do not replace the title modal with a generic dialog.

The final UI must visually read as a **real streaming platform** at first glance.

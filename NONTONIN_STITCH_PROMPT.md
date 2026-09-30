# Nontonin — STITCH DESIGN PROMPT

## Purpose

Use this prompt together with the attached reference image. The reference image is the visual direction: a dark cinematic streaming-service presentation with one large hero screen and several supporting desktop web screens arranged as a coherent product system.

The product is **Nontonin**, a portfolio web streaming application. It uses movie and series metadata/trailers from TMDB and YouTube, but it must use its own wordmark and visual identity. Do **not** copy Netflix branding, logo, UI text, or red brand color.

---

## MASTER INSTRUCTION

Replicate the attached reference image as closely as possible in **composition, visual hierarchy, density, cinematic mood, screen proportions, and presentation quality**, while replacing the content and brand with the Nontonin product requirements below.

Create a **desktop-first responsive web design**, not a mobile app mockup.

The final design should look like a real streaming website that could be implemented with Next.js + TypeScript + Tailwind CSS. It must be high-fidelity, pixel-crisp, straight-on, and suitable for a portfolio presentation.

---

# DESIGN LANGUAGE

### Brand
- Product name: **Nontonin**
- Brand type: custom text wordmark, not a copied streaming-service logo.
- Brand personality: cinematic, confident, warm, accessible, portfolio-ready.
- Core visual language: dark cinematic streaming UI + coral-orange action accent.

### Exact design tokens
- Background: `#0B0B0F`
- Surface: `#15151C`
- Surface-alt: `#1D1D25`
- Primary: `#FF6B35`
- Primary-hover: `#E95A2B`
- Text-primary: `#F2F2F5`
- Text-secondary: `#A3A3B2`
- Border: `rgba(255,255,255,0.10)`
- Success: `#16A34A`
- Warning: `#F59E0B`
- Error: `#DC2626`
- Overlay: `rgba(0,0,0,0.60)`

### Typography
- Heading: **Plus Jakarta Sans**, 700
- Body/UI: **Inter**, 400/500/600
- Display: 56px / 60px
- H1: 40px / 48px
- H2: 28px / 36px
- Body: 16px / 24px
- Small: 14px / 20px
- Caption: 12px / 16px
- Heading tracking: `-0.02em`

### Shape and spacing
- Base spacing: 4px
- Card radius: 8px
- Modal radius: 12px
- Button radius: 8px
- Avatar radius: full
- Desktop gutter: 24px
- Desktop page margin: 40px to 64px depending on viewport
- Content max-width: 1280px
- Navbar height: 68px
- Card hover scale: 1.05x over 200ms
- Standard transition: 200ms ease-out
- Focus ring: 2px `#FF6B35`
- Reduced motion: disable scale/transform animations

### Image treatment
Use real cinematic poster/backdrop placeholders or TMDB-style image areas. Do not invent a competing brand logo.

All media uses:
- `object-cover`
- poster ratio: 2:3
- hero ratio: approximately 16:9
- dark bottom/left gradient overlay for readable text
- no decorative 3D mockup frame

---

# SCREEN SET

Stitch generates maximum 5 screens per prompt. Keep the same design system across all batches.

## PROMPT 1/3 — PUBLIC DISCOVERY

### SCREEN 1 — Landing `/`

Create a concise cinematic landing page for Nontonin.

Top:
- transparent dark navbar, 68px high
- Nontonin wordmark on left
- links: `Beranda`, `Film`, `Series`, `My List`
- right: search icon, `Masuk`, coral `Coba Demo` button

Hero:
- full-width cinematic backdrop
- dark gradient from left and bottom
- headline: **“Temukan tontonan berikutnya.”**
- supporting copy: **“Jelajahi film dan series, putar trailer, dan simpan judul favoritmu.”**
- primary button: `Jelajahi`
- secondary button: `Coba Demo`

Below hero:
- exactly 3 feature blocks:
  1. `Jelajahi film`
  2. `Putar trailer`
  3. `Simpan favorit`
- each has a 24px outline icon and one short supporting line.

### SCREEN 2 — Browse `/browse`

This is the main screen and the strongest visual match to the reference.

Navbar:
- transparent over hero, becomes `#15151C` after scrolling
- Nontonin left
- `Beranda`, `Film`, `Series`, `My List`
- search icon and avatar on right

Hero billboard:
- approximately 560–640px tall
- full-width cinematic backdrop
- left-aligned content inside max-width 1280px
- title, metadata, two-line synopsis
- buttons: `Putar Trailer`, `Info`
- gradient must make white text readable

Rows below:
- `Baru dilihat` only when history exists
- `Trending hari ini`
- `Populer`
- `Top Rated`
- `Film Aksi`
- `Series Populer`
- each row is horizontally scrollable
- desktop shows approximately 6 cards
- left/right arrow controls are visible on desktop
- poster cards are 2:3
- card hover enlarges to 1.05x

Footer:
- TMDB logo area
- official attribution text
- compact navigation links

### SCREEN 3 — Title Detail Modal

Show a centered modal over a darkened browse page.

- max width: 850px
- top: wide backdrop with gradient
- close button top-right
- title and metadata
- metadata: year, duration/seasons, rating
- buttons: `Putar Trailer`, `+ List`, `Suka`
- lower section split:
  - left: synopsis
  - right: genre + cast
- bottom: `Judul serupa` with compact poster cards
- modal scrim: black 60%
- modal radius: 12px

---

## PROMPT 2/3 — SEARCH, PROFILES, MY LIST

### SCREEN 4 — Search `/search`

Dark page with the same Nontonin navbar.

Search field:
- prominent centered/expanded field
- height 48px
- radius 8px
- placeholder: `Cari film atau series...`
- search icon on left
- no unnecessary filters

Results:
- heading: `Hasil pencarian`
- 6-column poster grid on desktop
- 3 columns tablet
- 2 columns mobile
- each result has title, year, and small `Film` or `Series` badge
- button at bottom: `Muat lebih banyak`

Empty state:
- `Tidak ada hasil untuk "..."`

### SCREEN 5 — Who's Watching `/profiles`

Reference the attached image's centered profile-selection composition.

- background `#0B0B0F`
- centered Nontonin wordmark at top
- heading: **`Siapa yang menonton?`**
- horizontal row of profile cards
- each avatar is circular, 120px desktop
- profile names underneath
- maximum 5 profiles
- final card: `+ Tambah profil`
- secondary action: `Kelola profil`
- keep generous empty space
- no Netflix-style branding

Use 4 example profile names:
- `Nabila`
- `Raka`
- `Dina`
- `Kids`

### SCREEN 6 — My List `/my-list`

- same navbar
- page heading: `My List`
- subtitle: `Judul yang kamu simpan.`
- 6-column desktop poster grid
- delete/remove icon appears on hover
- cards remain visually consistent with Browse
- empty state version must also be designed:
  - title: `My List masih kosong`
  - button: `Jelajahi film`

---

## PROMPT 3/3 — AUTH AND TRAILER

### SCREEN 7 — Login `/login`

Dark cinematic auth page.

- Nontonin wordmark top-left
- centered auth card, width 420px
- title: `Masuk ke Nontonin`
- fields:
  - `Email`
  - `Kata sandi`
- primary button: `Masuk`
- divider: `atau`
- secondary Google button: `Lanjut dengan Google`
- text: `Belum punya akun? Daftar`
- error state: `Email atau kata sandi salah`
- loading state must be represented by disabled button

### SCREEN 8 — Register `/register`

Same layout and tokens as login.

Title: `Buat akun Nontonin`

Fields:
- `Email`
- `Kata sandi`
- `Konfirmasi kata sandi`

Primary: `Daftar`

Secondary text:
`Sudah punya akun? Masuk`

### SCREEN 9 — Trailer Modal

Centered video modal over the current title page.

- width approximately 960px
- 16:9 video area
- black player surface
- close button top-right
- title below video
- loading state
- unavailable state:
  - `Trailer belum tersedia`

### SCREEN 10 — Profile Management Modal

Modal over `/profiles`.

Fields:
- `Nama profil`
- 8 preset avatar choices
- switch: `Profil anak`
- primary: `Simpan`
- destructive: `Hapus profil`
- confirmation state:
  - `Hapus profil ini?`
  - `Batal`
  - `Hapus`

---

# RESPONSIVE RULES

Desktop:
- 1280px and above: 6 poster columns
- 1024px: 5 columns
- 768px: 3 columns
- 360–767px: 2 columns

Desktop navbar:
- logo + menu + actions

Mobile navbar:
- Nontonin logo
- search icon
- avatar
- main navigation moves to a fixed bottom navigation:
  `Beranda`, `Cari`, `My List`, `Profil`

Mobile rows:
- horizontal swipe
- hide desktop arrow buttons

Mobile detail:
- full-screen page instead of modal

Do not change the visual identity between breakpoints.

---

# CONTENT RULES

Use Indonesian interface text.

Movie and series titles may remain in their TMDB-provided language.

Use only the exact labels specified in this prompt.

Do not use lorem ipsum.
Do not create fake statistics.
Do not add subscription/payment screens.
Do not add advertisements.
Do not show full copyrighted movies.
Do not add social-feed features.

---

# DO

- Match the attached reference's dark cinematic presentation and screen density.
- Use Nontonin's coral-orange `#FF6B35`, not Netflix red.
- Keep every screen part of one coherent product.
- Preserve strong hero imagery, dark gradients, poster rows, modal overlays, and high contrast.
- Keep spacing on the 4px grid.
- Use Plus Jakarta Sans + Inter consistently.
- Make the interface implementation-ready for Next.js/Tailwind.
- Use semantic hierarchy and accessible focus states.

# DON'T

- Do not use the Netflix logo, wordmark, red brand color, or copied Netflix UI.
- Do not use generic SaaS dashboard styling.
- Do not use glassmorphism as the dominant style.
- Do not use excessive rounded 24px cards; Nontonin cards are 8px radius.
- Do not add gradients unrelated to image readability.
- Do not add pricing, payment, ads, full-film streaming, or native-mobile UI.
- Do not use device frames, browser frames, perspective mockups, hands, or watermarks.
- Do not introduce extra colors outside the defined semantic palette.

# SOURCE OF TRUTH

Product requirements are based on the Nontonin Project Plan:
- MVP: browse, detail + trailer, search, auth, multi-profile, My List, guest access.
- Should: history, reactions, recommendations, kids profile, Google login, demo account.
- Desktop browse has hero + category rows and TMDB attribution.
- Detail modal max width is 850px.
- Search uses a 6/3/2 column responsive grid.
- Profiles use 120px circular avatars.
- Mobile uses bottom navigation.

The visual reference controls composition and cinematic presentation; the Project Plan controls product content and behavior.

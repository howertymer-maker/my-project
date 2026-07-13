# Design Style Bundle

---
name: Neon Protocol
colors:
  surface: '#131314'
  surface-dim: '#131314'
  surface-bright: '#3a393a'
  surface-container-lowest: '#0e0e0f'
  surface-container-low: '#1c1b1c'
  surface-container: '#201f20'
  surface-container-high: '#2a2a2b'
  surface-container-highest: '#353436'
  on-surface: '#e5e2e3'
  on-surface-variant: '#b9cacb'
  inverse-surface: '#e5e2e3'
  inverse-on-surface: '#313031'
  outline: '#849495'
  outline-variant: '#3a494b'
  surface-tint: '#00dbe7'
  primary: '#e1fdff'
  on-primary: '#00363a'
  primary-container: '#00f2ff'
  on-primary-container: '#006a71'
  inverse-primary: '#00696f'
  secondary: '#ffffff'
  on-secondary: '#253600'
  secondary-container: '#b6f700'
  on-secondary-container: '#4f6e00'
  tertiary: '#fff5fd'
  on-tertiary: '#510074'
  tertiary-container: '#f3cfff'
  on-tertiary-container: '#9128c5'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#74f5ff'
  primary-fixed-dim: '#00dbe7'
  on-primary-fixed: '#002022'
  on-primary-fixed-variant: '#004f54'
  secondary-fixed: '#b6f700'
  secondary-fixed-dim: '#9fd800'
  on-secondary-fixed: '#141f00'
  on-secondary-fixed-variant: '#374e00'
  tertiary-fixed: '#f6d9ff'
  tertiary-fixed-dim: '#e9b3ff'
  on-tertiary-fixed: '#310048'
  on-tertiary-fixed-variant: '#7200a3'
  background: '#131314'
  on-background: '#e5e2e3'
  surface-variant: '#353436'
typography:
  display-lg:
    fontFamily: Sora
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: JetBrains Mono
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Sora
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
  display-lg-mobile:
    fontFamily: Sora
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 38px
  headline-lg-mobile:
    fontFamily: Sora
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 20px
  stack-gap: 16px
  inline-gap: 12px
  card-padding: 16px
  section-spacing: 32px
---

## Brand & Style

The design system is engineered for a gamified self-improvement experience that treats personal growth as a high-stakes tactical mission. The brand personality is disciplined, futuristic, and high-energy, targeting users who find motivation in RPG mechanics and cyberpunk aesthetics. 

The visual style is a fusion of **Glassmorphism** and **High-Contrast Neon**. It utilizes deep, "ink-trap" blacks to create an infinite sense of depth, layered with translucent cards that appear as holographic HUD elements. Vibrant neon accents serve as "energy signatures" for different life categories (e.g., Physical, Mental, Social), providing immediate visual feedback and a sense of progression through light and glow.

## Colors

The palette is anchored in a true-black background to maximize the luminance of neon accents. 

- **Primary (Cyan):** Used for core navigation, essential progress, and "System" level communications.
- **Secondary (Lime):** Represents physical vitality, health, and completed actions.
- **Tertiary (Purple):** Associated with mental acuity, meditation, and deep work missions.
- **Quaternary (Gold):** Reserved for achievements, legendary streaks, and premium status.
- **Neutral/Surface:** A range of deep charcoals with slight blue tints to maintain a "cold" high-tech feel. 

All interactive neons must utilize a "glow" state—a secondary layer with 20-40% opacity of the base color to simulate light emission against the dark background.

## Typography

The typography strategy pairs a geometric, wide-aperture sans-serif for headings with a technical monospaced font for data and body content.

**Sora** provides a bold, futuristic "Display" feel for titles and stats, emphasizing the game-like nature of the interface. **JetBrains Mono** is used for descriptions, logs, and secondary labels to evoke a "terminal" or "developer" aesthetic, suggesting that the user is "programming" their own habits. 

Keep line heights tight for headlines to maintain a compact, high-density HUD look. All labels should utilize a slight letter spacing increase and uppercase transform to distinguish them as metadata.

## Layout & Spacing

The layout follows a high-density, card-based HUD (Heads-Up Display) model optimized for mobile-first interaction. 

- **Grid:** Use a 4-column fluid grid for mobile with a consistent 20px outer margin.
- **Safe Areas:** Ensure all critical game actions are within the lower "thumb zone."
- **Visual Density:** Components are tightly packed with 12px or 16px gaps to mimic a complex tactical interface. 
- **Adaptation:** On larger screens, the layout should transition to a sidebar-controlled multi-pane view, keeping cards at a maximum width of 400px to maintain readability.

## Elevation & Depth

This design system avoids traditional drop shadows in favor of **Tonal Layering** and **Luminance**.

1.  **Background:** The lowest layer is `#0A0A0B`.
2.  **Surfaces:** Interactive cards use `#161618` with a 1px solid border at 10% opacity of the accent color (e.g., 10% Cyan border).
3.  **Holographic Overlays:** Active states or "Epic" missions use a background blur (20px) with a semi-transparent surface (60% opacity) to create a glass effect.
4.  **Outer Glows:** Instead of shadows, use `box-shadow` with 0px offset and high blur (15-20px) using the accent color at low alpha (0.2) to make progress bars and active buttons appear as if they are emitting light.

## Shapes

The shape language uses "Rounded" (0.5rem) as the base to balance the aggressive high-tech aesthetic with a modern, premium feel. 

- **Standard Elements:** Buttons, cards, and input fields use an 8px (0.5rem) radius.
- **Progress Bars:** Use a fully pill-shaped (rounded-xl) style to emphasize the fluid nature of "filling" a meter.
- **Avatars/Status Icons:** Use octagonal or hex-clipped containers for a more military-grade, tactical appearance, differentiating them from standard UI buttons.

## Components

- **Buttons:** Primary buttons are solid neon fills with black text. Secondary buttons use a "Ghost" style with a 1.5px neon border and a subtle inner glow.
- **Glowing Progress Bars:** The core of the gamification. A dark background track with a high-saturation foreground fill. The "head" of the progress bar should have a vertical light-flare or a 10px outer glow.
- **Mission Cards:** Feature a top-aligned category label (uppercase, monospaced) and a "Hold to Complete" interaction area. Use subtle 1px borders colored by the category accent.
- **Chips/Badges:** Small, monospaced tags with a subtle background tint (15% opacity of the accent color) used for difficulty levels (e.g., "Elite," "Legendary").
- **Stat Readouts:** Use large Sora-bold numbers paired with small JetBrains Mono units (e.g., "85% XP").
- **Inputs:** Darker than the card surface, using a "focus glow" that changes the border color to the primary neon when active.


# Example 1 Code

<!DOCTYPE html><html class="dark" lang="ru"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Профиль - УРОВЕНЬ 42</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&amp;family=Sora:wght@400;600;700;800&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-variant": "#353436",
                      "secondary-container": "#b6f700",
                      "background": "#131314",
                      "primary-fixed": "#74f5ff",
                      "on-surface-variant": "#b9cacb",
                      "on-background": "#e5e2e3",
                      "tertiary-fixed-dim": "#e9b3ff",
                      "on-secondary-container": "#4f6e00",
                      "primary-container": "#00f2ff",
                      "tertiary-fixed": "#f6d9ff",
                      "surface-tint": "#00dbe7",
                      "on-error": "#690005",
                      "outline-variant": "#3a494b",
                      "on-tertiary-fixed": "#310048",
                      "on-secondary-fixed-variant": "#374e00",
                      "secondary-fixed": "#b6f700",
                      "on-tertiary-fixed-variant": "#7200a3",
                      "error": "#ffb4ab",
                      "tertiary": "#fff5fd",
                      "on-primary-container": "#006a71",
                      "error-container": "#93000a",
                      "primary-fixed-dim": "#00dbe7",
                      "on-surface": "#e5e2e3",
                      "on-secondary": "#253600",
                      "on-secondary-fixed": "#141f00",
                      "surface-container-lowest": "#0e0e0f",
                      "surface-container-low": "#1c1b1c",
                      "on-error-container": "#ffdad6",
                      "surface-container-highest": "#353436",
                      "surface-container": "#201f20",
                      "primary": "#e1fdff",
                      "inverse-surface": "#e5e2e3",
                      "surface-dim": "#131314",
                      "surface": "#131314",
                      "inverse-on-surface": "#313031",
                      "on-primary": "#00363a",
                      "surface-bright": "#3a393a",
                      "on-tertiary-container": "#9128c5",
                      "outline": "#849495",
                      "inverse-primary": "#00696f",
                      "tertiary-container": "#f3cfff",
                      "on-primary-fixed-variant": "#004f54",
                      "secondary-fixed-dim": "#9fd800",
                      "secondary": "#ffffff",
                      "on-tertiary": "#510074",
                      "on-primary-fixed": "#002022",
                      "surface-container-high": "#2a2a2b"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "section-spacing": "32px",
                      "inline-gap": "12px",
                      "stack-gap": "16px",
                      "card-padding": "16px",
                      "container-margin": "20px"
              },
              "fontFamily": {
                      "display-lg": [
                              "Sora"
                      ],
                      "display-lg-mobile": [
                              "Sora"
                      ],
                      "headline-lg": [
                              "Sora"
                      ],
                      "label-md": [
                              "JetBrains Mono"
                      ],
                      "body-lg": [
                              "JetBrains Mono"
                      ],
                      "headline-lg-mobile": [
                              "Sora"
                      ],
                      "headline-md": [
                              "Sora"
                      ],
                      "body-md": [
                              "JetBrains Mono"
                      ],
                      "label-lg": [
                              "Sora"
                      ]
              },
              "fontSize": {
                      "display-lg": [
                              "40px",
                              {
                                      "lineHeight": "48px",
                                      "letterSpacing": "-0.02em",
                                      "fontWeight": "800"
                              }
                      ],
                      "display-lg-mobile": [
                              "32px",
                              {
                                      "lineHeight": "38px",
                                      "fontWeight": "800"
                              }
                      ],
                      "headline-lg": [
                              "32px",
                              {
                                      "lineHeight": "40px",
                                      "letterSpacing": "-0.01em",
                                      "fontWeight": "700"
                              }
                      ],
                      "label-md": [
                              "10px",
                              {
                                      "lineHeight": "14px",
                                      "fontWeight": "500"
                              }
                      ],
                      "body-lg": [
                              "16px",
                              {
                                      "lineHeight": "24px",
                                      "fontWeight": "400"
                              }
                      ],
                      "headline-lg-mobile": [
                              "24px",
                              {
                                      "lineHeight": "30px",
                                      "fontWeight": "700"
                              }
                      ],
                      "headline-md": [
                              "24px",
                              {
                                      "lineHeight": "32px",
                                      "fontWeight": "600"
                              }
                      ],
                      "body-md": [
                              "14px",
                              {
                                      "lineHeight": "20px",
                                      "fontWeight": "400"
                              }
                      ],
                      "label-lg": [
                              "12px",
                              {
                                      "lineHeight": "16px",
                                      "letterSpacing": "0.08em",
                                      "fontWeight": "700"
                              }
                      ]
              }
            }
          }
        }
    </script>
<style>
        body {
            background-color: #0A0A0B; /* Deepest ink-trap black */
            color: #e5e2e3;
        }
        
        .glass-panel {
            background: rgba(22, 22, 24, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 242, 255, 0.1);
        }

        .neon-glow-primary {
            box-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
        }
        
        .neon-glow-secondary {
            box-shadow: 0 0 15px rgba(182, 247, 0, 0.2);
        }

        .progress-bar-fill {
            box-shadow: 0 0 10px currentColor;
        }
        
        /* Specific Skill Colors based on image */
        .skill-discipline { color: #f97316; } /* Orange */
        .skill-social { color: #eab308; } /* Yellow */
        .skill-mental { color: #22c55e; } /* Green */
        .skill-physical { color: #3b82f6; } /* Blue */
        .skill-financial { color: #a855f7; } /* Purple */
        .skill-appearance { color: #ec4899; } /* Pink */
        
        /* Hide scrollbar for clean UI */
        ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="antialiased min-h-screen flex flex-col pt-[72px] pb-[90px]">
<!-- TopAppBar -->
<header class="bg-background/80 dark:bg-background/80 backdrop-blur-md shadow-[0_0_15px_rgba(0,242,255,0.1)] flex justify-between items-center px-container-margin py-4 w-full fixed top-0 z-50 bg-surface-container-low dark:bg-surface-container-low border-b border-primary-container/20">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container/30">
<img class="w-full h-full object-cover" data-alt="A highly detailed close-up portrait of a determined, futuristic cyber-monk character in a high-tech illuminated setting. The lighting is moody with neon cyan rim lights reflecting off metallic cybernetic implants on their neck. The art style is high-end 3D render, hyper-realistic, dark mode aesthetic, meant for a premium gamified avatar." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBC6bOZlh1AOCmbXJk_CJTHcxeXPsaID-RfRy8lcjzBfgq1o0DsrjdtSRLepLiMATNf27DJdWEgUtCjd_tRgLAqBaTBVu8ZgRcbppFF1L5eR0BrQmwmbL1q6yHbrcFbxTnpQaTcYh_7bT0d-ObJNmSm25cQzXjWc7sLGMAiK5IaAZIRp48ezUiyN6vXtQt51NV14QYGa9QywipKMpx1DqigBHhZWZ9kzQ1GaGAKDy6r7QyGjWLIofhRfwmydCG9vUzE-e2u6e5DNjY">
</div>
</div>
<div class="flex items-center"><div class="flex items-center gap-4"><button class="flex items-center justify-center text-primary-container hover:text-secondary-fixed-dim transition-all"><span class="material-symbols-outlined">notifications</span></button><button class="flex items-center justify-center text-primary-container hover:text-secondary-fixed-dim transition-all"><span class="material-symbols-outlined">settings</span></button></div></div>
</header>
<!-- Main Content Canvas -->
<main class="flex-1 px-container-margin py-stack-gap flex flex-col gap-section-spacing max-w-[600px] mx-auto w-full">
<!-- Avatar & Rank Section -->
<section class="flex flex-col items-center gap-4 relative mt-4">
<div class="relative w-32 h-32">
<!-- Decorative background ring -->
<div class="absolute inset-0 rounded-full border-4 border-surface-variant animate-[spin_10s_linear_infinite]"></div>
<div class="absolute inset-0 rounded-full border-t-4 border-primary-container animate-[spin_4s_linear_infinite] neon-glow-primary"></div>
<div class="absolute inset-2 rounded-full overflow-hidden bg-surface-container border-2 border-outline-variant">
<img class="w-full h-full object-cover" data-alt="A highly detailed, cinematic portrait of a rugged, determined hero character in a futuristic cyberpunk setting. He wears tactical dark clothing with subtle glowing accents. The lighting is dramatic, high-contrast, with deep shadows and vibrant neon cyan backlighting. The aesthetic is premium AAA video game quality, dark mode." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc36pobIrEEk77hMRMfVTBwno_WbEE_gT73WdkqKGpSzOVZhZMzCqrqrTttnkHoztl9zjT09PmN_kmthn40gmTygKnz3Zcz6WCyBKo4fQWCyPbhSFe_NEtBd8fAqErHUKCqAcny2pBClqL_zKXtPyyD_tT4STYxwRjSO6zkz1wHp8lQ6OuEVzwkX3fzcI-quJwBOP_GPZsHtc_bJoGpzTkKbF9UaSbKAY8UNQtEbPh31iHMqvfjJCjhTLCFrCHdQvTUcQ8g2Bndhk">
</div>
<!-- Rank Badge Overlay -->
<div class="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-surface-container-highest px-4 py-1 rounded-full border border-primary-container/50 neon-glow-primary z-10 flex items-center gap-2">
<span class="material-symbols-outlined text-[16px] text-primary-container" style="font-variation-settings: 'FILL' 1;">workspace_premium</span>
<span class="font-label-md text-label-md text-on-surface uppercase tracking-widest">Endeavorer</span>
</div>
</div>
<h2 class="font-headline-md text-headline-md text-on-surface mt-4">Endeavorise Eric</h2>
<!-- XP Bar -->
<div class="w-full max-w-[280px] flex flex-col gap-1 mt-2">
<div class="flex justify-between font-label-md text-label-md text-on-surface-variant">
<span class="">XP</span>
<span class="font-body-md text-primary-fixed-dim">84,520 / 100,000</span>
</div>
<div class="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-primary-container rounded-full progress-bar-fill w-[84%]"></div>
</div>
</div>
</section>
<!-- Skills Bars Section -->
<section class="glass-panel rounded-xl p-card-padding flex flex-col gap-4">
<h3 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Атрибуты</h3>
<div class="flex flex-col gap-3">
<!-- Skill: Discipline -->
<div class="flex flex-col gap-1">
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[14px] skill-discipline">fitness_center</span>
<span class="font-label-md text-label-md text-on-surface uppercase tracking-wide">Дисциплина</span>
</div>
<span class="font-body-md text-body-md font-bold text-on-surface">6.8</span>
</div>
<div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-[#f97316] rounded-full w-[68%] progress-bar-fill" style="color: #f97316;"></div>
</div>
</div>
<!-- Skill: Social -->
<div class="flex flex-col gap-1">
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[14px] skill-social">forum</span>
<span class="font-label-md text-label-md text-on-surface uppercase tracking-wide">Социальность</span>
</div>
<span class="font-body-md text-body-md font-bold text-on-surface">7.4</span>
</div>
<div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-[#eab308] rounded-full w-[74%] progress-bar-fill" style="color: #eab308;"></div>
</div>
</div>
<!-- Skill: Mental -->
<div class="flex flex-col gap-1">
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[14px] skill-mental">psychology</span>
<span class="font-label-md text-label-md text-on-surface uppercase tracking-wide">Ментал</span>
</div>
<span class="font-body-md text-body-md font-bold text-on-surface">7.7</span>
</div>
<div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-[#22c55e] rounded-full w-[77%] progress-bar-fill" style="color: #22c55e;"></div>
</div>
</div>
<!-- Skill: Physical -->
<div class="flex flex-col gap-1">
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[14px] skill-physical">directions_run</span>
<span class="font-label-md text-label-md text-on-surface uppercase tracking-wide">Физика</span>
</div>
<span class="font-body-md text-body-md font-bold text-on-surface">4.6</span>
</div>
<div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-[#3b82f6] rounded-full w-[46%] progress-bar-fill" style="color: #3b82f6;"></div>
</div>
</div>
<!-- Skill: Financial -->
<div class="flex flex-col gap-1">
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[14px] skill-financial">payments</span>
<span class="font-label-md text-label-md text-on-surface uppercase tracking-wide">Финансы</span>
</div>
<span class="font-body-md text-body-md font-bold text-on-surface">7.2</span>
</div>
<div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-[#a855f7] rounded-full w-[72%] progress-bar-fill" style="color: #a855f7;"></div>
</div>
</div>
<!-- Skill: Appearance -->
<div class="flex flex-col gap-1">
<div class="flex justify-between items-center">
<div class="flex items-center gap-2">
<span class="material-symbols-outlined text-[14px] skill-appearance">face</span>
<span class="font-label-md text-label-md text-on-surface uppercase tracking-wide">Внешность</span>
</div>
<span class="font-body-md text-body-md font-bold text-on-surface">5.8</span>
</div>
<div class="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div class="h-full bg-[#ec4899] rounded-full w-[58%] progress-bar-fill" style="color: #ec4899;"></div>
</div>
</div>
</div>
</section>
<!-- Progress Statistics Chart -->
<section class="glass-panel rounded-xl p-card-padding flex flex-col gap-4">
<div class="flex justify-between items-center">
<h3 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">Статистика прогресса</h3>
<select class="bg-surface-container-highest border border-outline-variant rounded-md text-on-surface font-label-md text-label-md py-1 px-2 focus:border-primary-container focus:ring-1 focus:ring-primary-container outline-none">
<option>6М</option>
<option>1М</option>
<option>1Г</option>
</select>
</div>
<!-- Chart Area -->
<div class="relative h-56 w-full rounded-lg overflow-hidden flex flex-col pr-2 pb-2">
<div class="flex-1 relative flex">
<!-- Y Axis Labels -->
<div class="w-8 flex flex-col justify-between text-on-surface-variant font-label-md text-[10px] text-right pr-2 py-2 z-20">
<span>100k</span>
<span>75k</span>
<span>50k</span>
<span>25k</span>
<span>0</span>
</div>
<!-- Chart Content -->
<div class="flex-1 relative border-l border-b border-on-surface-variant/30">
<!-- Horizontal Grid Lines -->
<div class="absolute inset-0 flex flex-col justify-between opacity-10">
<div class="border-b border-on-surface w-full h-0"></div>
<div class="border-b border-on-surface w-full h-0"></div>
<div class="border-b border-on-surface w-full h-0"></div>
<div class="border-b border-on-surface w-full h-0"></div>
<div class="border-b border-on-surface w-full h-0"></div>
</div>
<!-- Vertical Grid Lines -->
<div class="absolute inset-0 flex justify-between opacity-10">
<div class="border-l border-on-surface h-full w-0"></div>
<div class="border-l border-on-surface h-full w-0"></div>
<div class="border-l border-on-surface h-full w-0"></div>
<div class="border-l border-on-surface h-full w-0"></div>
<div class="border-l border-on-surface h-full w-0"></div>
<div class="border-l border-on-surface h-full w-0"></div>
</div>
<!-- Animated Chart SVG placeholder -->
<div class="w-full h-full relative z-10 opacity-80" style="background: linear-gradient(to top, rgba(0,242,255,0.2) 0%, transparent 100%);">
<svg class="w-full h-full absolute inset-0 drop-shadow-[0_0_8px_rgba(0,242,255,0.8)]" preserveAspectRatio="none" viewBox="0 0 100 100">
<path d="M0,100 L0,95 Q10,88 20,80 T40,65 T60,45 T80,30 T100,10 L100,100 Z" fill="rgba(0,242,255,0.1)" stroke="none"></path>
<path class="animate-[dash_3s_ease-out_forwards]" d="M0,95 Q10,88 20,80 T40,65 T60,45 T80,30 T100,10" fill="none" stroke="#00f2ff" stroke-dasharray="300" stroke-dashoffset="0" stroke-width="2"></path>
</svg>
</div>
</div>
</div>
<!-- X Axis Labels -->
<div class="ml-8 flex justify-between text-on-surface-variant font-label-md text-[10px] pt-2 px-1 z-20">
<span>Янв</span>
<span>Фев</span>
<span>Мар</span>
<span>Апр</span>
<span>Май</span>
<span>Июн</span>
</div>
</div>
<!-- Quick Stats -->
<div class="flex justify-between mt-2 pt-4 border-t border-outline-variant/30">
<div class="flex flex-col items-center">
<span class="material-symbols-outlined text-[20px] text-primary-container">local_fire_department</span>
<span class="font-label-md text-label-md text-on-surface-variant mt-1">42 Дня</span>
</div>
<div class="flex flex-col items-center">
<span class="material-symbols-outlined text-[20px] text-primary-container">task_alt</span>
<span class="font-label-md text-label-md text-on-surface-variant mt-1">84%</span>
</div>
<div class="flex flex-col items-center">
<span class="material-symbols-outlined text-[20px] text-primary-container">emoji_events</span>
<span class="font-label-md text-label-md text-on-surface-variant mt-1">Топ 5%</span>
</div>
</div>
</section>
</main>
<!-- BottomNavBar -->
<nav class="bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-xl docked full-width bottom-0 rounded-t-xl border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 md:hidden">
<!-- Profile (Active) -->
<a class="flex flex-col items-center justify-center text-secondary-fixed dark:text-secondary-fixed scale-110 drop-shadow-[0_0_8px_rgba(182,247,0,0.5)] active:scale-90 duration-150 group" href="#">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">person</span>
<span class="font-label-lg text-label-lg">Профиль</span>
</a>
<!-- Habits (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group" href="#">
<span class="material-symbols-outlined mb-1">check_circle</span>
<span class="font-label-lg text-label-lg">Привычки</span>
</a>
<!-- Missions (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group" href="#">
<span class="material-symbols-outlined mb-1">rocket_launch</span>
<span class="font-label-lg text-label-lg">Миссии</span>
</a>
<!-- Community (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group" href="#">
<span class="material-symbols-outlined mb-1">group</span>
<span class="font-label-lg text-label-lg">Сообщество</span>
</a>
</nav>
</body></html>


# Example 2 Code

<!DOCTYPE html>

<html class="dark" lang="ru"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Миссии - УРОВЕНЬ 42</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&amp;family=Sora:wght@600;700;800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-variant": "#353436",
                        "secondary-container": "#b6f700",
                        "background": "#131314",
                        "primary-fixed": "#74f5ff",
                        "on-surface-variant": "#b9cacb",
                        "on-background": "#e5e2e3",
                        "tertiary-fixed-dim": "#e9b3ff",
                        "on-secondary-container": "#4f6e00",
                        "primary-container": "#00f2ff",
                        "tertiary-fixed": "#f6d9ff",
                        "surface-tint": "#00dbe7",
                        "on-error": "#690005",
                        "outline-variant": "#3a494b",
                        "on-tertiary-fixed": "#310048",
                        "on-secondary-fixed-variant": "#374e00",
                        "secondary-fixed": "#b6f700",
                        "on-tertiary-fixed-variant": "#7200a3",
                        "error": "#ffb4ab",
                        "tertiary": "#fff5fd",
                        "on-primary-container": "#006a71",
                        "error-container": "#93000a",
                        "primary-fixed-dim": "#00dbe7",
                        "on-surface": "#e5e2e3",
                        "on-secondary": "#253600",
                        "on-secondary-fixed": "#141f00",
                        "surface-container-lowest": "#0e0e0f",
                        "surface-container-low": "#1c1b1c",
                        "on-error-container": "#ffdad6",
                        "surface-container-highest": "#353436",
                        "surface-container": "#201f20",
                        "primary": "#e1fdff",
                        "inverse-surface": "#e5e2e3",
                        "surface-dim": "#131314",
                        "surface": "#131314",
                        "inverse-on-surface": "#313031",
                        "on-primary": "#00363a",
                        "surface-bright": "#3a393a",
                        "on-tertiary-container": "#9128c5",
                        "outline": "#849495",
                        "inverse-primary": "#00696f",
                        "tertiary-container": "#f3cfff",
                        "on-primary-fixed-variant": "#004f54",
                        "secondary-fixed-dim": "#9fd800",
                        "secondary": "#ffffff",
                        "on-tertiary": "#510074",
                        "on-primary-fixed": "#002022",
                        "surface-container-high": "#2a2a2b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "section-spacing": "32px",
                        "inline-gap": "12px",
                        "stack-gap": "16px",
                        "card-padding": "16px",
                        "container-margin": "20px"
                    },
                    "fontFamily": {
                        "display-lg": ["Sora"],
                        "display-lg-mobile": ["Sora"],
                        "headline-lg": ["Sora"],
                        "label-md": ["JetBrains Mono"],
                        "body-lg": ["JetBrains Mono"],
                        "headline-lg-mobile": ["Sora"],
                        "headline-md": ["Sora"],
                        "body-md": ["JetBrains Mono"],
                        "label-lg": ["Sora"]
                    },
                    "fontSize": {
                        "display-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                        "display-lg-mobile": ["32px", {"lineHeight": "38px", "fontWeight": "800"}],
                        "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                        "label-md": ["10px", {"lineHeight": "14px", "fontWeight": "500"}],
                        "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                        "headline-lg-mobile": ["24px", {"lineHeight": "30px", "fontWeight": "700"}],
                        "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                        "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                        "label-lg": ["12px", {"lineHeight": "16px", "letterSpacing": "0.08em", "fontWeight": "700"}]
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-color: #0A0A0B;
            color: #e5e2e3;
            min-height: max(884px, 100dvh);
        }
        
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #131314; }
        ::-webkit-scrollbar-thumb { background: #3a494b; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #00dbe7; }

        #bg-canvas {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
        }

        .glass-panel {
            background: rgba(22, 22, 24, 0.6);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            position: relative;
            overflow: hidden;
        }

        .neon-border-primary { border: 1px solid rgba(0, 242, 255, 0.2); }
        .neon-border-tertiary { border: 1px solid rgba(233, 179, 255, 0.2); }

        @keyframes fadeInSlideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .mission-card {
            animation: fadeInSlideUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            opacity: 0;
        }

        @keyframes neonBreath {
            0%, 100% { opacity: 0.6; filter: brightness(1); }
            50% { opacity: 1; filter: brightness(1.5); }
        }

        .neon-accent {
            animation: neonBreath 3s ease-in-out infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%) skewX(-15deg); }
            20%, 100% { transform: translateX(200%) skewX(-15deg); }
        }

        .shimmer-effect::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.05), transparent);
            animation: shimmer 5s infinite;
            pointer-events: none;
        }

        .btn-check-active:hover, .btn-check-active:active {
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(0, 242, 255, 0.4);
        }

        .nav-item-active {
            animation: springScale 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        @keyframes springScale {
            0% { transform: scale(0.8); }
            70% { transform: scale(1.15); }
            100% { transform: scale(1.1); }
        }

        @media (prefers-reduced-motion: reduce) {
            .mission-card, .neon-accent, .shimmer-effect::after, .nav-item-active, .btn-check-active {
                animation: none !important;
                transition: none !important;
                opacity: 1 !important;
                transform: none !important;
            }
        }
    </style>
</head>
<body class="antialiased min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container pb-24 md:pb-0">
<canvas id="bg-canvas"></canvas>
<header class="flex justify-between items-center px-container-margin py-4 w-full sticky top-0 z-50 bg-background/60 backdrop-blur-md border-b border-primary-container/10">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-surface-container overflow-hidden border border-primary-container/30">
<img alt="User Avatar" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAr2gOmvcDsqVbQdbqxcZAYrqErV-CxHv4RMRxpU-RRcmwPg3xFAJk82WYYxaRTNDwPBhtt_vI5B-LJXXQZjc3JPA_74h6s_4vSe1FqrpTCL7wurxMzL3nMUj377bZWiGja5TJsDZ7y3flyhviKxnCuDopeWJxvwfhUtEmMCmd5unJa9949K-LEjkr2F3lbMkZQ8YKsYOZBFZspMbSitK0uxhYNmHJWG0j1e7U67p9k3y5KkUhdHgDN23WTzbCXKfFGtzt6JToAjpk"/>
</div>
</div>
<div class="flex items-center gap-4">
<button class="text-on-surface-variant hover:text-primary-fixed transition-colors">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-on-surface-variant hover:text-primary-fixed transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
</div>
</header>
<main class="flex-grow w-full max-w-[600px] mx-auto px-container-margin pt-6 flex flex-col gap-stack-gap">
<div class="flex flex-col items-center justify-center py-4 mb-2">
<div class="flex items-center gap-2 mb-1">
<span class="material-symbols-outlined text-tertiary-fixed-dim text-[28px]" style="font-variation-settings: 'FILL' 1;">shield</span>
<h2 class="font-headline-lg-mobile text-headline-lg-mobile text-on-background uppercase tracking-wider">Миссии</h2>
</div>
<p class="font-body-md text-body-md text-on-surface-variant text-center max-w-[80%]">Выполняйте задания для получения опыта и повышения уровня развития.</p>
</div>
<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
<button class="shrink-0 px-4 py-2 rounded-full bg-primary-container/20 border border-primary-container text-primary-fixed font-label-md text-label-md uppercase tracking-wider shadow-[0_0_10px_rgba(0,242,255,0.2)]">
<span class="material-symbols-outlined text-[14px] align-middle mr-1">grid_view</span> Все
        </button>
<button class="shrink-0 px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined text-[14px] align-middle mr-1">fitness_center</span> Физическое развитие
        </button>
<button class="shrink-0 px-4 py-2 rounded-full bg-surface-container border border-outline-variant text-on-surface-variant font-label-md text-label-md uppercase tracking-wider hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined text-[14px] align-middle mr-1">forum</span> Социальное развитие
        </button>
</div>
<div class="flex flex-col gap-4">
<!-- Card 1 -->
<div class="mission-card shimmer-effect glass-panel rounded-xl p-card-padding neon-border-primary flex flex-col" style="animation-delay: 0.1s;">
<div class="absolute top-0 left-0 w-1 h-full bg-primary-container neon-accent shadow-[0_0_15px_rgba(0,242,255,0.8)]"></div>
<div class="flex justify-between items-start mb-3 pl-2">
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">Дыхание носом</h3>
<div class="flex gap-2 mt-1">
<span class="inline-flex items-center gap-1 bg-primary-container/10 text-primary-fixed font-label-md text-[10px] px-2 py-0.5 rounded border border-primary-container/30 uppercase tracking-widest">
<span class="material-symbols-outlined text-[12px]">fitness_center</span> Физическое развитие
                        </span>
</div>
</div>
<button class="text-on-surface-variant hover:text-primary-fixed transition-colors">
<span class="material-symbols-outlined">push_pin</span>
</button>
</div>
<div class="flex justify-between items-end pl-2 mt-2">
<div class="flex gap-3">
<div class="flex items-center gap-1 text-tertiary-fixed-dim">
<span class="material-symbols-outlined text-[16px]">arrow_upward</span>
<span class="font-label-md text-label-md">+0.28</span>
</div>
<div class="flex items-center gap-1 text-secondary-fixed">
<span class="material-symbols-outlined text-[16px]">favorite</span>
<span class="font-label-md text-label-md">+0.13</span>
</div>
</div>
<button class="btn-check-active relative w-12 h-12 rounded-full bg-surface-variant border border-primary-container/30 flex items-center justify-center transition-all">
<span class="material-symbols-outlined text-primary-fixed">done</span>
</button>
</div>
</div>
<!-- Card 2 -->
<div class="mission-card shimmer-effect glass-panel rounded-xl p-card-padding border-2 border-secondary-container/40 flex flex-col shadow-[0_0_15px_rgba(182,247,0,0.1)]" style="animation-delay: 0.2s;">
<div class="absolute top-0 left-0 w-1 h-full bg-secondary-container neon-accent shadow-[0_0_15px_rgba(182,247,0,1)]"></div>
<div class="flex justify-between items-start mb-3 pl-2">
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">Процент жира в теле 4 <span class="text-body-md text-on-surface-variant block mt-1">(15-20%)</span></h3>
<div class="flex gap-2 mt-2">
<span class="inline-flex items-center gap-1 bg-secondary-container/10 text-secondary-fixed font-label-md text-[10px] px-2 py-0.5 rounded border border-secondary-container/30 uppercase tracking-widest">
<span class="material-symbols-outlined text-[12px]">fitness_center</span> Физическое развитие
                        </span>
</div>
</div>
<button class="text-secondary-fixed">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">push_pin</span>
</button>
</div>
<div class="flex justify-between items-end pl-2 mt-2">
<div class="flex gap-3">
<div class="flex items-center gap-1 text-tertiary-fixed-dim"><span class="material-symbols-outlined text-[16px]">arrow_upward</span><span class="font-label-md text-label-md">+0.26</span></div>
<div class="flex items-center gap-1 text-secondary-fixed"><span class="material-symbols-outlined text-[16px]">favorite</span><span class="font-label-md text-label-md">+0.17</span></div>
</div>
<button class="btn-check-active relative w-12 h-12 rounded-full bg-surface-variant border border-secondary-container/50 flex items-center justify-center transition-all">
<span class="material-symbols-outlined text-secondary-fixed">done</span>
</button>
</div>
</div>
<!-- Card 3 -->
<div class="mission-card shimmer-effect glass-panel rounded-xl p-card-padding neon-border-tertiary flex flex-col" style="animation-delay: 0.3s;">
<div class="absolute top-0 left-0 w-1 h-full bg-tertiary-fixed-dim neon-accent shadow-[0_0_15px_rgba(233,179,255,0.8)]"></div>
<div class="flex justify-between items-start mb-3 pl-2">
<div>
<h3 class="font-headline-md text-headline-md text-on-surface">Изысканный стиль</h3>
<div class="flex gap-2 mt-1">
<span class="inline-flex items-center gap-1 bg-tertiary-fixed-dim/10 text-tertiary-fixed-dim font-label-md text-[10px] px-2 py-0.5 rounded border border-tertiary-fixed-dim/30 uppercase tracking-widest">
<span class="material-symbols-outlined text-[12px]">forum</span> Социальное развитие
                        </span>
</div>
</div>
<button class="text-on-surface-variant hover:text-tertiary-fixed-dim transition-colors">
<span class="material-symbols-outlined">push_pin</span>
</button>
</div>
<div class="flex justify-between items-end pl-2 mt-2">
<div class="flex gap-3">
<div class="flex items-center gap-1 text-tertiary-fixed-dim"><span class="material-symbols-outlined text-[16px]">arrow_upward</span><span class="font-label-md text-label-md">+0.58</span></div>
</div>
<button class="btn-check-active relative w-12 h-12 rounded-full bg-surface-variant border border-tertiary-fixed-dim/30 flex items-center justify-center transition-all">
<span class="material-symbols-outlined text-tertiary-fixed-dim">done</span>
</button>
</div>
</div>
</div>
</main>
<nav class="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-surface-container-lowest/80 backdrop-blur-xl rounded-t-xl border-t border-outline-variant/20 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
<button class="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all">
<span class="material-symbols-outlined mb-1">person</span>
<span class="font-label-lg text-label-lg">Профиль</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all">
<span class="material-symbols-outlined mb-1">check_circle</span>
<span class="font-label-lg text-label-lg">Привычки</span>
</button>
<button class="nav-item-active flex flex-col items-center justify-center text-secondary-fixed scale-110 drop-shadow-[0_0_12px_rgba(182,247,0,0.6)]">
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">rocket_launch</span>
<span class="font-label-lg text-label-lg">Миссии</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all">
<span class="material-symbols-outlined mb-1">group</span>
<span class="font-label-lg text-label-lg">Сообщество</span>
</button>
</nav>
<script>
    const canvas = document.getElementById('bg-canvas');
    const gl = canvas.getContext('webgl');

    if (gl) {
        const vertexShaderSource = `
            attribute vec2 position;
            varying vec2 v_texCoord;
            void main() {
                v_texCoord = (position + 1.0) / 2.0;
                gl_Position = vec4(position, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            varying vec2 v_texCoord;
            uniform float u_time;
            uniform vec2 u_resolution;

            float noise(vec2 p) {
                return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
            }

            void main() {
                vec2 uv = v_texCoord;
                vec3 color = vec3(0.05, 0.05, 0.06);
                float glow = sin(uv.x * 1.5 + u_time * 0.4) * cos(uv.y * 1.5 - u_time * 0.2) * 0.5 + 0.5;
                color += vec3(0.0, 0.95, 1.0) * glow * 0.02;
                vec2 particle_uv = uv * 12.0;
                vec2 id = floor(particle_uv);
                vec2 gv = fract(particle_uv) - 0.5;
                float n = noise(id);
                float t = u_time * 0.3 + n * 6.28;
                vec2 offset = vec2(sin(t), cos(t)) * 0.4;
                float dist = length(gv - offset);
                float p = smoothstep(0.06, 0.0, dist);
                p *= (sin(u_time * 2.5 + n * 10.0) * 0.5 + 0.5);
                color += vec3(0.0, 0.95, 1.0) * p * 0.25;
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);

        const positionLocation = gl.getAttribLocation(program, 'position');
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const timeLocation = gl.getUniformLocation(program, 'u_time');
        const resolutionLocation = gl.getUniformLocation(program, 'u_resolution');

        function render(time) {
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                // Static version for reduced motion
                gl.uniform1f(timeLocation, 100.0); 
            } else {
                gl.uniform1f(timeLocation, time * 0.001);
            }
            
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
</script>
</body></html>


# Example 3 Code

<!DOCTYPE html><html class="dark" lang="ru"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Привычки - УРОВЕНЬ 42</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&amp;family=Sora:wght@400;600;700;800&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "surface-variant": "#353436",
                        "secondary-container": "#b6f700",
                        "background": "#131314",
                        "primary-fixed": "#74f5ff",
                        "on-surface-variant": "#b9cacb",
                        "on-background": "#e5e2e3",
                        "tertiary-fixed-dim": "#e9b3ff",
                        "on-secondary-container": "#4f6e00",
                        "primary-container": "#00f2ff",
                        "tertiary-fixed": "#f6d9ff",
                        "surface-tint": "#00dbe7",
                        "on-error": "#690005",
                        "outline-variant": "#3a494b",
                        "on-tertiary-fixed": "#310048",
                        "on-secondary-fixed-variant": "#374e00",
                        "secondary-fixed": "#b6f700",
                        "on-tertiary-fixed-variant": "#7200a3",
                        "error": "#ffb4ab",
                        "tertiary": "#fff5fd",
                        "on-primary-container": "#006a71",
                        "error-container": "#93000a",
                        "primary-fixed-dim": "#00dbe7",
                        "on-surface": "#e5e2e3",
                        "on-secondary": "#253600",
                        "on-secondary-fixed": "#141f00",
                        "surface-container-lowest": "#0e0e0f",
                        "surface-container-low": "#1c1b1c",
                        "on-error-container": "#ffdad6",
                        "surface-container-highest": "#353436",
                        "surface-container": "#201f20",
                        "primary": "#e1fdff",
                        "inverse-surface": "#e5e2e3",
                        "surface-dim": "#131314",
                        "surface": "#131314",
                        "inverse-on-surface": "#313031",
                        "on-primary": "#00363a",
                        "surface-bright": "#3a393a",
                        "on-tertiary-container": "#9128c5",
                        "outline": "#849495",
                        "inverse-primary": "#00696f",
                        "tertiary-container": "#f3cfff",
                        "on-primary-fixed-variant": "#004f54",
                        "secondary-fixed-dim": "#9fd800",
                        "secondary": "#ffffff",
                        "on-tertiary": "#510074",
                        "on-primary-fixed": "#002022",
                        "surface-container-high": "#2a2a2b"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "spacing": {
                        "section-spacing": "32px",
                        "inline-gap": "12px",
                        "stack-gap": "16px",
                        "card-padding": "16px",
                        "container-margin": "20px"
                    },
                    "fontFamily": {
                        "display-lg": ["Sora"],
                        "display-lg-mobile": ["Sora"],
                        "headline-lg": ["Sora"],
                        "label-md": ["JetBrains Mono"],
                        "body-lg": ["JetBrains Mono"],
                        "headline-lg-mobile": ["Sora"],
                        "headline-md": ["Sora"],
                        "body-md": ["JetBrains Mono"],
                        "label-lg": ["Sora"]
                    },
                    "fontSize": {
                        "display-lg": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "800" }],
                        "display-lg-mobile": ["32px", { "lineHeight": "38px", "fontWeight": "800" }],
                        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700" }],
                        "label-md": ["10px", { "lineHeight": "14px", "fontWeight": "500" }],
                        "body-lg": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
                        "headline-lg-mobile": ["24px", { "lineHeight": "30px", "fontWeight": "700" }],
                        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
                        "body-md": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
                        "label-lg": ["12px", { "lineHeight": "16px", "letterSpacing": "0.08em", "fontWeight": "700" }]
                    }
                }
            }
        }
    </script>
<style>
        body {
            background-color: #0A0A0B; /* Deepest black background */
        }
        
        /* Custom scrollbar for webkit */
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background-color: #3a494b;
            border-radius: 10px;
        }
        
        /* Glow effects */
        .glow-physical { box-shadow: 0 0 15px rgba(0, 242, 255, 0.15); border-color: rgba(0, 242, 255, 0.2); }
        .glow-mental { box-shadow: 0 0 15px rgba(182, 247, 0, 0.15); border-color: rgba(182, 247, 0, 0.2); }
        .glow-social { box-shadow: 0 0 15px rgba(233, 179, 255, 0.15); border-color: rgba(233, 179, 255, 0.2); }
        
        /* Checkmark interaction */
        .check-btn-physical:active { transform: scale(0.95); box-shadow: 0 0 20px rgba(0, 242, 255, 0.4); }
        .check-btn-mental:active { transform: scale(0.95); box-shadow: 0 0 20px rgba(182, 247, 0, 0.4); }
        .check-btn-social:active { transform: scale(0.95); box-shadow: 0 0 20px rgba(233, 179, 255, 0.4); }

        .progress-bar-glow-physical { box-shadow: 0 0 10px rgba(0, 242, 255, 0.5); }
        .progress-bar-glow-mental { box-shadow: 0 0 10px rgba(182, 247, 0, 0.5); }
        .progress-bar-glow-social { box-shadow: 0 0 10px rgba(233, 179, 255, 0.5); }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="text-on-background font-body-md min-h-screen pb-[100px] flex flex-col md:flex-row relative overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
<!-- Ambient Background Glow -->
<div class="fixed inset-0 pointer-events-none z-0">
<div class="absolute top-1/4 left-0 w-96 h-96 bg-primary-container/5 rounded-full blur-[100px]"></div>
<div class="absolute bottom-1/4 right-0 w-96 h-96 bg-secondary-fixed/5 rounded-full blur-[100px]"></div>
</div>
<!-- TopAppBar (Hidden on MD, visible on Mobile for consistency if needed, but nav goes to bottom) -->
<header class="bg-background/80 dark:bg-background/80 backdrop-blur-md text-primary-container dark:text-primary-fixed docked full-width top-0 bg-surface-container-low dark:bg-surface-container-low shadow-[0_0_15px_rgba(0,242,255,0.1)] flex justify-between items-center px-container-margin py-4 w-full fixed top-0 z-50 md:hidden">
<div class="flex items-center gap-inline-gap">
<div class="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
<img alt="User Pilot Avatar" class="w-full h-full object-cover" data-alt="A futuristic cyberpunk avatar portrait, neon lighting, dark background, highly detailed digital art style. Profile picture of a gamer or sci-fi character." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpCiGqCcazLvPiC9PBstsx9hyveu5H48kJnuBVowhlyZLltXRc9HfJYCePdBKa9Ww0imeGEI9-HrQvD_qU5UigR975qg3LM_-mO5D9xtsuFXN6dosVzXXUo43CCTceiHgIPhI11Pyk4j486kPuK95yPi6JILwaGEt8eVVc5HRSRj3z4LRUqUe5HQCtNIeK05jHPPJCKDBW39CTUUoY4YYQXgs_PIykw1JKSqU2pXeK7Vs2vJ2xbxwBkT73lWjJXv-ihg_OGbJOgT0">
</div>
</div>
<div><div class="flex items-center gap-4">
<button class="text-on-surface-variant hover:text-primary-fixed transition-colors">
<span class="material-symbols-outlined">notifications</span>
</button>
<button class="text-on-surface-variant hover:text-primary-fixed transition-colors">
<span class="material-symbols-outlined">settings</span>
</button>
</div></div>
</header>
<!-- Top Padding for Mobile Header -->
<div class="h-[72px] md:hidden w-full shrink-0"></div>
<!-- SideNav for Web (Hidden on Mobile) -->
<nav class="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-outline-variant/30 bg-surface-container-lowest/90 backdrop-blur-xl z-50 px-4 py-8 overflow-y-auto">
<div class="mb-12 px-2 flex items-center justify-between">
<span class="font-display-lg-mobile text-display-lg-mobile tracking-tighter text-primary-container font-bold">УРОВЕНЬ 42</span>
</div>
<div class="flex flex-col gap-2">
<!-- Nav Item: Profile -->
<a class="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors group" href="#">
<span class="material-symbols-outlined group-hover:text-primary-fixed transition-colors">person</span>
<span class="font-label-lg text-label-lg">Профиль</span>
</a>
<!-- Nav Item: Habits (ACTIVE) -->
<a class="flex items-center gap-4 px-4 py-3 rounded-lg bg-surface-variant text-primary-container font-bold shadow-[0_0_15px_rgba(0,242,255,0.1)] transition-transform scale-95 relative overflow-hidden" href="#">
<div class="absolute left-0 top-0 bottom-0 w-1 bg-primary-container shadow-[0_0_10px_#00f2ff]"></div>
<span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="font-label-lg text-label-lg">Привычки</span>
</a>
<!-- Nav Item: Missions -->
<a class="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors group" href="#">
<span class="material-symbols-outlined group-hover:text-primary-fixed transition-colors">rocket_launch</span>
<span class="font-label-lg text-label-lg">Миссии</span>
</a>
<!-- Nav Item: Community -->
<a class="flex items-center gap-4 px-4 py-3 rounded-lg text-on-surface-variant hover:bg-surface-variant transition-colors group" href="#">
<span class="material-symbols-outlined group-hover:text-primary-fixed transition-colors">group</span>
<span class="font-label-lg text-label-lg">Сообщество</span>
</a>
</div>
<div class="mt-auto pt-8 border-t border-outline-variant/30 flex items-center gap-4 px-2">
<div class="w-10 h-10 rounded-full overflow-hidden border border-primary-container/50 shadow-[0_0_10px_rgba(0,242,255,0.2)]">
<img alt="User Avatar" class="w-full h-full object-cover" data-alt="A futuristic cyberpunk avatar portrait, neon lighting, dark background, highly detailed digital art style. Profile picture of a gamer or sci-fi character." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD2Xiu9UHQueBp1kh1QGzyjm6fukrVt8CMbhLgZEjks-Y5iWvrRdzwz5Yxsz3iq7YI7VsL-pqMpAnlg_rLcUdoGM3RAmMgGBdSyeIFf0NX0PAk6TGPqaPMOt9NwJYWC0A3OK5-vbNy7ytt3lHYJ_k_a9Ui6T1oAIseGejkpocsGaxaGTsKb2VFhTqpc6Ssd4P_faIx7CqxlQxKc4yBPwPF59B6LiSZwzIu7ckTE33wxySWRFDRhG5Ce16XFX_zt035ZCQKsVm4eUxc">
</div>
<div class="flex flex-col">
<span class="font-label-md text-label-md text-on-background">Pilot-74</span>
<span class="font-label-md text-label-md text-secondary-fixed">1,250 CR</span>
</div>
</div>
</nav>
<!-- Main Content Canvas -->
<main class="flex-1 w-full max-w-lg mx-auto md:ml-64 md:max-w-3xl px-container-margin py-section-spacing z-10 flex flex-col gap-stack-gap">
<!-- Header / Date Selector -->
<div class="flex flex-col items-center justify-center mb-4">
<h1 class="font-headline-lg-mobile text-headline-lg-mobile text-on-background flex items-center gap-2">
<span class="material-symbols-outlined text-primary-container" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                Привычки
            </h1>
<p class="font-label-md text-label-md text-outline mt-1 uppercase tracking-widest">Персонально для вас</p>
<div class="flex items-center gap-4 mt-6 bg-[#161618] border border-outline-variant/30 rounded-full px-4 py-1.5">
<button class="text-on-surface-variant hover:text-primary-fixed transition-colors"><span class="material-symbols-outlined text-sm">chevron_left</span></button>
<span class="font-label-md text-label-md text-on-surface">29 февраля 2024</span>
<button class="text-on-surface-variant hover:text-primary-fixed transition-colors"><span class="material-symbols-outlined text-sm">chevron_right</span></button>
</div>
</div>
<!-- Filter / Stats Row -->
<div class="flex justify-between items-center mb-2">
<div class="flex gap-2">
<span class="font-label-md text-label-md bg-surface-variant text-on-surface px-3 py-1 rounded-full border border-outline-variant/50">Все</span>
<span class="font-label-md text-label-md text-on-surface-variant px-3 py-1 hover:text-on-surface transition-colors cursor-pointer">Физические</span>
</div>
<div class="flex items-center gap-1 text-secondary-fixed">
<span class="material-symbols-outlined text-sm">local_fire_department</span>
<span class="font-label-md text-label-md font-bold">Серия: 14 дней</span>
</div>
</div>
<!-- Habit List -->
<div class="flex flex-col gap-4">
<!-- Habit Card 1: Weightlifting (Completed) -->
<div class="bg-[#161618] border border-primary-container/20 rounded-xl p-card-padding flex flex-col gap-3 relative overflow-hidden glow-physical group">
<div class="absolute inset-0 bg-primary-container/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
<div class="flex justify-between items-start z-10">
<div class="flex flex-col gap-1">
<h3 class="font-headline-md text-headline-md text-primary-container">Тяжелая атлетика мин. 2д/н</h3>
<div class="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
<span class="flex items-center gap-1 text-secondary-fixed"><span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">person</span>+0.50</span>
<span class="flex items-center gap-1 text-error"><span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">favorite</span>+0.50</span>
<span class="flex items-center gap-1 text-tertiary-fixed-dim"><span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">bolt</span>+0.27</span>
</div>
</div>
<!-- Check Button -->
<button class="w-12 h-12 rounded-full bg-primary-container/10 border border-primary-container text-primary-container flex items-center justify-center check-btn-physical transition-all duration-200">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check</span>
</button>
</div>
<div class="flex items-center justify-between mt-2 z-10">
<div class="flex flex-col w-3/5 gap-1">
<div class="flex justify-between font-label-md text-label-md text-outline">
<span class="">22 фев - 28 фев</span>
<span class="">серия 7 дн.</span>
</div>
<div class="h-1.5 bg-surface-variant rounded-full overflow-hidden flex">
<div class="h-full bg-primary-container w-full progress-bar-glow-physical rounded-full"></div>
</div>
</div>
<span class="font-label-md text-label-md text-outline text-[8px] uppercase">Удерживать для отмены</span>
</div>
</div>
<!-- Habit Card 2: Sleep (Completed) -->
<div class="bg-[#161618] border border-secondary-fixed/20 rounded-xl p-card-padding flex flex-col gap-3 relative overflow-hidden glow-mental group">
<div class="absolute inset-0 bg-secondary-fixed/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
<div class="flex justify-between items-start z-10">
<div class="flex flex-col gap-1">
<h3 class="font-headline-md text-headline-md text-secondary-fixed">Сон мин. 7.5ч</h3>
<div class="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
<span class="flex items-center gap-1 text-secondary-fixed"><span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">psychology</span>+0.52</span>
<span class="flex items-center gap-1 text-primary-fixed"><span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">bolt</span>+0.31</span>
</div>
</div>
<button class="w-12 h-12 rounded-full bg-secondary-fixed/10 border border-secondary-fixed text-secondary-fixed flex items-center justify-center check-btn-mental transition-all duration-200">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check</span>
</button>
</div>
<div class="flex items-center justify-between mt-2 z-10">
<div class="flex flex-col w-3/5 gap-1">
<div class="flex justify-between font-label-md text-label-md text-outline">
<span class="">22 фев - 28 фев</span>
<span class="">серия 7 дн.</span>
</div>
<div class="h-1.5 bg-surface-variant rounded-full overflow-hidden flex gap-1">
<div class="h-full bg-secondary-fixed w-full progress-bar-glow-mental rounded-full"></div>
</div>
</div>
<span class="font-label-md text-label-md text-outline text-[8px] uppercase">Удерживать для отмены</span>
</div>
</div>
<!-- Habit Card 3: Set Goals (Pending) -->
<div class="bg-[#161618] border border-tertiary-fixed-dim/20 rounded-xl p-card-padding flex flex-col gap-3 relative overflow-hidden glow-social group opacity-90">
<div class="flex justify-between items-start z-10">
<div class="flex flex-col gap-1">
<h3 class="font-headline-md text-headline-md text-on-surface">Ставить цели с вечера</h3>
<div class="flex items-center gap-3 font-label-md text-label-md text-on-surface-variant">
<span class="flex items-center gap-1 text-tertiary-fixed-dim"><span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">flag</span>+0.14</span>
<span class="flex items-center gap-1 text-primary-fixed"><span class="material-symbols-outlined text-[10px]" style="font-variation-settings: 'FILL' 1;">bolt</span>+0.15</span>
</div>
</div>
<button class="w-12 h-12 rounded-full bg-surface-variant border border-outline-variant text-on-surface-variant flex items-center justify-center check-btn-social transition-all duration-200 hover:border-tertiary-fixed-dim hover:text-tertiary-fixed-dim">
<span class="material-symbols-outlined">check</span>
</button>
</div>
<div class="flex items-center justify-between mt-2 z-10">
<div class="flex flex-col w-3/5 gap-1">
<div class="flex justify-between font-label-md text-label-md text-outline">
<span class="">22 фев - 28 фев</span>
<span class="">серия 7 дн.</span>
</div>
<div class="flex gap-1 h-1.5">
<div class="h-full bg-tertiary-fixed-dim w-1/2 progress-bar-glow-social rounded-full"></div>
<div class="h-full bg-error w-1/2 rounded-full opacity-70"></div>
</div>
<div class="flex justify-between font-label-md text-[8px] text-outline mt-0.5">
<span class="text-tertiary-fixed-dim">7/7</span>
<span class="text-error">1/2</span>
</div>
</div>
<span class="font-label-md text-label-md text-outline text-[8px] uppercase">Удерживать для отметки</span>
</div>
</div>
</div>
<!-- Weekly Overview -->
<div class="bg-[#161618] border border-outline-variant/30 rounded-xl p-card-padding mt-4">
<h4 class="font-headline-md text-body-lg text-on-surface mb-4 flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-sm text-outline">grid_on</span>
                Обзор за неделю
            </h4>
<div class="overflow-x-auto pb-2">
<table class="w-full text-left border-collapse min-w-[300px]">
<thead>
<tr>
<th class="font-label-md text-label-md text-outline font-normal pb-2 w-24"></th>
<th class="font-label-md text-[10px] text-outline font-normal text-center pb-2">Вс</th>
<th class="font-label-md text-[10px] text-outline font-normal text-center pb-2">Пн</th>
<th class="font-label-md text-[10px] text-outline font-normal text-center pb-2">Вт</th>
<th class="font-label-md text-[10px] text-outline font-normal text-center pb-2">Ср</th>
<th class="font-label-md text-[10px] text-outline font-normal text-center pb-2">Чт</th>
<th class="font-label-md text-[10px] text-outline font-normal text-center pb-2">Пт</th>
<th class="font-label-md text-[10px] text-on-surface font-bold text-center pb-2">Сегодня</th>
</tr>
</thead>
<tbody class="font-label-md text-[9px] text-on-surface-variant gap-2">
<tr class="h-8 border-b border-surface-variant/50">
<td class="pr-2 truncate max-w-[80px]">Тяжелая атлетика мин...</td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-primary-container rounded-sm mx-auto shadow-[0_0_5px_#00f2ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-surface-variant rounded-sm mx-auto"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-surface-variant rounded-sm mx-auto"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-primary-container rounded-sm mx-auto shadow-[0_0_5px_#00f2ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-surface-variant rounded-sm mx-auto"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-primary-container rounded-sm mx-auto shadow-[0_0_5px_#00f2ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-primary-container rounded-sm mx-auto shadow-[0_0_5px_#00f2ff]"></div></td>
</tr>
<tr class="h-8 border-b border-surface-variant/50">
<td class="pr-2 truncate max-w-[80px]">Сон мин. 7.5ч</td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-secondary-fixed rounded-sm mx-auto shadow-[0_0_5px_#b6f700]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-secondary-fixed rounded-sm mx-auto shadow-[0_0_5px_#b6f700]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-secondary-fixed rounded-sm mx-auto shadow-[0_0_5px_#b6f700]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-secondary-fixed rounded-sm mx-auto shadow-[0_0_5px_#b6f700]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-secondary-fixed rounded-sm mx-auto shadow-[0_0_5px_#b6f700]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-secondary-fixed rounded-sm mx-auto shadow-[0_0_5px_#b6f700]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-secondary-fixed rounded-sm mx-auto shadow-[0_0_5px_#b6f700]"></div></td>
</tr>
<tr class="h-8">
<td class="pr-2 truncate max-w-[80px]">Ставить цели с вечера</td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-sm mx-auto shadow-[0_0_5px_#e9b3ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-sm mx-auto shadow-[0_0_5px_#e9b3ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-sm mx-auto shadow-[0_0_5px_#e9b3ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-sm mx-auto shadow-[0_0_5px_#e9b3ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-sm mx-auto shadow-[0_0_5px_#e9b3ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-tertiary-fixed-dim rounded-sm mx-auto shadow-[0_0_5px_#e9b3ff]"></div></td>
<td class="text-center"><div class="w-2.5 h-2.5 bg-surface-variant rounded-sm mx-auto"></div></td>
</tr>
</tbody>
</table>
</div>
</div>
</main>
<!-- BottomNavBar (Visible only on Mobile) -->
<nav class="bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-xl docked full-width bottom-0 rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.5)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 md:hidden">
<!-- Profile (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group" href="#">
<span class="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">person</span>
<span class="font-label-lg text-[10px]">Профиль</span>
</a>
<!-- Habits (Active) -->
<a class="flex flex-col items-center justify-center text-secondary-fixed dark:text-secondary-fixed scale-110 drop-shadow-[0_0_8px_rgba(182,247,0,0.5)] relative" href="#">
<div class="absolute -top-2 w-8 h-1 bg-secondary-fixed rounded-full blur-[2px]"></div>
<span class="material-symbols-outlined mb-1" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span class="font-label-lg text-[10px]">Привычки</span>
</a>
<!-- Missions (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group" href="#">
<span class="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">rocket_launch</span>
<span class="font-label-lg text-[10px]">Миссии</span>
</a>
<!-- Community (Inactive) -->
<a class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group" href="#">
<span class="material-symbols-outlined mb-1 group-hover:scale-110 transition-transform">group</span>
<span class="font-label-lg text-[10px]">Сообщество</span>
</a>
</nav>
</body></html>


# Example 4 Code

<!DOCTYPE html><html class="dark" lang="ru"><head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>Сообщество - Уровень 42</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet">
<script id="tailwind-config">
        tailwind.config = {
          darkMode: "class",
          theme: {
            extend: {
              "colors": {
                      "surface-variant": "#353436",
                      "secondary-container": "#b6f700",
                      "background": "#131314",
                      "primary-fixed": "#74f5ff",
                      "on-surface-variant": "#b9cacb",
                      "on-background": "#e5e2e3",
                      "tertiary-fixed-dim": "#e9b3ff",
                      "on-secondary-container": "#4f6e00",
                      "primary-container": "#00f2ff",
                      "tertiary-fixed": "#f6d9ff",
                      "surface-tint": "#00dbe7",
                      "on-error": "#690005",
                      "outline-variant": "#3a494b",
                      "on-tertiary-fixed": "#310048",
                      "on-secondary-fixed-variant": "#374e00",
                      "secondary-fixed": "#b6f700",
                      "on-tertiary-fixed-variant": "#7200a3",
                      "error": "#ffb4ab",
                      "tertiary": "#fff5fd",
                      "on-primary-container": "#006a71",
                      "error-container": "#93000a",
                      "primary-fixed-dim": "#00dbe7",
                      "on-surface": "#e5e2e3",
                      "on-secondary": "#253600",
                      "on-secondary-fixed": "#141f00",
                      "surface-container-lowest": "#0e0e0f",
                      "surface-container-low": "#1c1b1c",
                      "on-error-container": "#ffdad6",
                      "surface-container-highest": "#353436",
                      "surface-container": "#201f20",
                      "primary": "#e1fdff",
                      "inverse-surface": "#e5e2e3",
                      "surface-dim": "#131314",
                      "surface": "#131314",
                      "inverse-on-surface": "#313031",
                      "on-primary": "#00363a",
                      "surface-bright": "#3a393a",
                      "on-tertiary-container": "#9128c5",
                      "outline": "#849495",
                      "inverse-primary": "#00696f",
                      "tertiary-container": "#f3cfff",
                      "on-primary-fixed-variant": "#004f54",
                      "secondary-fixed-dim": "#9fd800",
                      "secondary": "#ffffff",
                      "on-tertiary": "#510074",
                      "on-primary-fixed": "#002022",
                      "surface-container-high": "#2a2a2b"
              },
              "borderRadius": {
                      "DEFAULT": "0.25rem",
                      "lg": "0.5rem",
                      "xl": "0.75rem",
                      "full": "9999px"
              },
              "spacing": {
                      "section-spacing": "32px",
                      "inline-gap": "12px",
                      "stack-gap": "16px",
                      "card-padding": "16px",
                      "container-margin": "20px"
              },
              "fontFamily": {
                      "display-lg": ["Sora"],
                      "display-lg-mobile": ["Sora"],
                      "headline-lg": ["Sora"],
                      "label-md": ["JetBrains Mono"],
                      "body-lg": ["JetBrains Mono"],
                      "headline-lg-mobile": ["Sora"],
                      "headline-md": ["Sora"],
                      "body-md": ["JetBrains Mono"],
                      "label-lg": ["Sora"]
              },
              "fontSize": {
                      "display-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "800"}],
                      "display-lg-mobile": ["32px", {"lineHeight": "38px", "fontWeight": "800"}],
                      "headline-lg": ["32px", {"lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "700"}],
                      "label-md": ["10px", {"lineHeight": "14px", "fontWeight": "500"}],
                      "body-lg": ["16px", {"lineHeight": "24px", "fontWeight": "400"}],
                      "headline-lg-mobile": ["24px", {"lineHeight": "30px", "fontWeight": "700"}],
                      "headline-md": ["24px", {"lineHeight": "32px", "fontWeight": "600"}],
                      "body-md": ["14px", {"lineHeight": "20px", "fontWeight": "400"}],
                      "label-lg": ["12px", {"lineHeight": "16px", "letterSpacing": "0.08em", "fontWeight": "700"}]
              }
            }
          }
        }
    </script>
<style>
        body {
            background-color: #0A0A0B; /* Override base background for deep ink-trap black */
            color: #e5e2e3;
        }
        /* Custom Scrollbar for sleekness */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #3a494b; border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: #00dbe7; }

        .glass-panel {
            background: rgba(22, 22, 24, 0.6);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(0, 242, 255, 0.1);
        }
        .neon-glow {
            box-shadow: 0 0 15px rgba(0, 242, 255, 0.2);
        }
        .neon-glow-secondary {
            box-shadow: 0 0 15px rgba(182, 247, 0, 0.2);
        }
        .neon-text-glow {
            text-shadow: 0 0 8px rgba(0, 242, 255, 0.5);
        }
    </style>
<style>
    body {
      min-height: max(884px, 100dvh);
    }
  </style>
</head>
<body class="antialiased min-h-screen flex flex-col pb-24 md:pb-0 overflow-x-hidden">
<!-- TopAppBar -->
<header class="bg-background/80 dark:bg-background/80 backdrop-blur-md flex justify-between items-center px-container-margin py-4 w-full fixed top-0 z-50 bg-surface-container-low dark:bg-surface-container-low border-b border-primary-container/20 shadow-[0_0_15px_rgba(0,242,255,0.1)]">
<div class="flex items-center gap-4">
<div class="w-10 h-10 rounded-full overflow-hidden border-2 border-primary-container neon-glow">
<img class="w-full h-full object-cover" data-alt="A futuristic, neon-lit avatar portrait of a sci-fi pilot wearing a sleek helmet with glowing blue visors, set against a dark, cyberpunk city backdrop. The lighting is high-contrast, emphasizing deep blacks and intense cyan accents. The mood is determined and tactical." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB4Q3fynJF72SXZIKLcjhJVfcdq0kifpoFzR_30jLlNY__36BADLQ-6NHI-Fx4eDTw_g_c2dy19eVQj6Ym8t1TIluF53xjqvp62MJNzebJo-f7QexbeRuegup_OeSJoY1mx1eRNBynsNub7Ori2qRYR8ryw-ARaxuxKc2Tp_dYliTurlUxuu6Ood0WqxeLc-tGyjLCuPo_VNb6ZqEdP7y90eAe8F7_nWVi7oTWkjfOPya3hy_AZZ7GAZFMFkTkQs-OLe0vo7QgPmkI">
</div>
</div>
<div class="flex items-center font-label-md text-label-md text-primary-container dark:text-primary-fixed gap-4"><button class="text-primary-container hover:text-primary-fixed transition-colors p-1">
<span class="material-symbols-outlined text-[24px]">notifications</span>
</button>
<button class="text-primary-container hover:text-primary-fixed transition-colors p-1">
<span class="material-symbols-outlined text-[24px]">settings</span>
</button></div>
</header>
<!-- Main Content Canvas -->
<main class="flex-1 mt-24 mb-16 px-container-margin w-full max-w-2xl mx-auto md:max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 relative">
<!-- Left Sidebar / Filters (Hidden on Mobile, visible on Desktop) -->
<aside class="hidden md:block md:col-span-3 sticky top-28 h-fit space-y-6">
<div class="glass-panel p-card-padding rounded-xl">
<h2 class="font-headline-md text-headline-md text-on-surface mb-4">Фильтры ленты</h2>
<div class="flex flex-col gap-2">
<button class="flex items-center gap-3 p-2 rounded-lg bg-surface-variant text-primary-container font-label-lg text-label-lg neon-glow">
<span class="material-symbols-outlined">public</span>
                        Вся активность
                    </button>
<button class="flex items-center gap-3 p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors font-label-lg text-label-lg">
<span class="material-symbols-outlined">recommend</span>
                        Актуальное
                    </button>
<button class="flex items-center gap-3 p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors font-label-lg text-label-lg">
<span class="material-symbols-outlined">history</span>
                        Мои посты
                    </button>
<button class="flex items-center gap-3 p-2 rounded-lg text-on-surface-variant hover:bg-surface-variant hover:text-on-surface transition-colors font-label-lg text-label-lg">
<span class="material-symbols-outlined">lightbulb</span>
                        Советы
                    </button>
</div>
</div>
<div class="glass-panel p-card-padding rounded-xl">
<h3 class="font-label-lg text-label-lg text-on-surface-variant mb-3 uppercase tracking-wider">Топ участников</h3>
<div class="space-y-3">
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full bg-surface-variant border border-secondary-container"></div>
<div class="flex-1">
<p class="font-body-md text-body-md text-on-surface leading-none">Elena R.</p>
<p class="font-label-md text-label-md text-secondary-container mt-1">Мастер V</p>
</div>
</div>
</div>
</div>
</aside>
<!-- Feed Center Column -->
<div class="col-span-1 md:col-span-9 space-y-stack-gap">
<!-- Mobile Filters Horizontal Scroll -->
<div class="md:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-container-margin px-container-margin">
<button class="whitespace-nowrap px-4 py-2 rounded-full bg-surface-variant text-primary-container font-label-md text-label-md border border-primary-container/30 neon-glow">Всё</button>
<button class="whitespace-nowrap px-4 py-2 rounded-full bg-surface text-on-surface-variant font-label-md text-label-md border border-outline-variant/30">Актуальное</button>
<button class="whitespace-nowrap px-4 py-2 rounded-full bg-surface text-on-surface-variant font-label-md text-label-md border border-outline-variant/30">Мои посты</button>
<button class="whitespace-nowrap px-4 py-2 rounded-full bg-surface text-on-surface-variant font-label-md text-label-md border border-outline-variant/30">Советы</button>
</div>
<!-- Post Card 1 -->
<article class="glass-panel rounded-xl p-card-padding relative overflow-hidden group">
<!-- Top Header -->
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden border border-tertiary-fixed">
<img class="w-full h-full object-cover" data-alt="A cinematic, low-light portrait of a user named Adrian Gavalyan. He looks determined, wearing dark futuristic activewear. The lighting features sharp magenta rim light and deep shadows, fitting a sci-fi cyberpunk aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBLnxHt6XXtS48kJB2dWlrzt8IX9ojOEX2V4ufzyGV7y0bo9RWG76tbf-VjoifY5cIvI-VSbCo2L2sOT1Y3buRpuUsvUXg1V5Wx2ZT82BpO_nGMSoz1jkubHSyE59duUNZz8s5ZWWS9HhLMxoAqZTb8PGEUuIEN-6jCr095Lc69KOsQcmEM4W2l71RxzHIRiLjmGxq_HSY_OxS7xVuLgFUPbpKYeFa2GcCiWnMh6Cx7lIxsSlFr8g1yyPO1DDgcVocZDnn0XpkM1pA">
</div>
<div>
<h3 class="font-headline-md text-headline-md-mobile text-on-surface">Adrián Gavalyan</h3>
<div class="flex items-center gap-2 mt-1">
<span class="bg-surface-variant text-tertiary-fixed font-label-md text-label-md px-2 py-0.5 rounded-sm">Подмастерье II</span>
<span class="text-on-surface-variant font-label-md text-label-md">4 дня назад</span>
</div>
</div>
</div>
<button class="text-on-surface-variant hover:text-primary-container transition-colors">
<span class="material-symbols-outlined">more_horiz</span>
</button>
</div>
<!-- Content -->
<div class="mb-4">
<h4 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Начало всего</h4>
<p class="font-body-md text-body-md text-on-surface-variant line-clamp-3">
                        Я новичок в этом приложении, и оно мне очень нравится. Обычно такие приложения кажутся слишком корпоративными, но относиться к своей жизни как к RPG действительно работает. Сейчас сосредоточен на физическом развитии.
                    </p>
<button class="text-primary-container font-label-md text-label-md mt-2 uppercase tracking-wide hover:text-primary-fixed transition-colors">Читать далее</button>
</div>
<!-- Attached Metric/Mission Snippet -->
<div class="bg-surface-container-low border border-tertiary-fixed/20 rounded-lg p-3 mb-4 flex items-center justify-between">
<div class="flex items-center gap-2 text-tertiary-fixed">
<span class="material-symbols-outlined text-[18px]">fitness_center</span>
<span class="font-label-md text-label-md uppercase">Физическое развитие</span>
</div>
<span class="font-body-md text-body-md text-on-surface">+120 XP</span>
</div>
<!-- Action Bar -->
<div class="flex items-center justify-between border-t border-outline-variant/30 pt-3">
<div class="flex gap-6">
<button class="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md group/btn">
<span class="material-symbols-outlined group-hover/btn:scale-110 transition-transform">thumb_up</span>
                            74
                        </button>
<button class="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md group/btn">
<span class="material-symbols-outlined group-hover/btn:scale-110 transition-transform">chat_bubble</span>
                            19
                        </button>
</div>
<button class="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md">
<span class="material-symbols-outlined text-[16px]">translate</span>
                        Перевести
                    </button>
</div>
</article>
<!-- Post Card 2 -->
<article class="glass-panel rounded-xl p-card-padding relative overflow-hidden group border-secondary-container/20">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden border border-secondary-container">
<img class="w-full h-full object-cover" data-alt="A neon-lit portrait of a user named Max Thompson. He looks focused and slightly weary, set against a dark background with subtle glowing green UI elements floating around him, evoking a cyberpunk hacker vibe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfq-_5r_zqklOYM8Sk5zyjTl_fG4kSzkyTNu3etMNPrXk92NdVnhdj_lBFermE4ounYcwoDWeVfP_exwM5Bl9oPwcaVD434yKEqeZ4JKwxGfJy7lgE1sfV-uCBTV41LYmjyH9Pw3SGaQWSFUSB1yW1z1qSQB91VuIBOWpzGcHIz2JxB7UoBQAICUueE2h0nPc8Y33lXCttGape-6OT60sXkJI4q4xCeYSAla8dLFn0jr5QglGg8qNVH_SLK7EOzAb2JaSv7ByM-tM">
</div>
<div>
<h3 class="font-headline-md text-headline-md-mobile text-on-surface">Max Thompson</h3>
<div class="flex items-center gap-2 mt-1">
<span class="bg-surface-variant text-secondary-container font-label-md text-label-md px-2 py-0.5 rounded-sm">Новичок I</span>
<span class="bg-surface-variant text-on-surface-variant font-label-md text-label-md px-2 py-0.5 rounded-sm border border-outline-variant">Советы</span>
<span class="text-on-surface-variant font-label-md text-label-md">3 дня назад</span>
</div>
</div>
</div>
<button class="text-on-surface-variant hover:text-secondary-container transition-colors">
<span class="material-symbols-outlined">more_horiz</span>
</button>
</div>
<div class="mb-4">
<h4 class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface mb-2">Нужен узкоспециализированный совет</h4>
<p class="font-body-md text-body-md text-on-surface-variant">
                        Привет, ребята, давайте расти вместе. Мне нужна помощь. Нужен друг, который научит меня оптимизировать график сна. Я усердно тренируюсь в зале, но восстановление хромает. Есть элитные советы?
                    </p>
</div>
<div class="flex items-center justify-between border-t border-outline-variant/30 pt-3">
<div class="flex gap-6">
<button class="flex items-center gap-1 text-on-surface-variant hover:text-secondary-container transition-colors font-label-md text-label-md group/btn">
<span class="material-symbols-outlined group-hover/btn:scale-110 transition-transform">thumb_up</span>
                            91
                        </button>
<button class="flex items-center gap-1 text-on-surface-variant hover:text-secondary-container transition-colors font-label-md text-label-md group/btn">
<span class="material-symbols-outlined group-hover/btn:scale-110 transition-transform">chat_bubble</span>
                            24
                        </button>
</div>
<button class="flex items-center gap-1 text-on-surface-variant hover:text-secondary-container transition-colors font-label-md text-label-md">
<span class="material-symbols-outlined text-[16px]">translate</span>
                        Перевести
                    </button>
</div>
</article>
<!-- Post Card 3 -->
<article class="glass-panel rounded-xl p-card-padding relative overflow-hidden group">
<div class="flex justify-between items-start mb-4">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden border border-primary-container">
<img class="w-full h-full object-cover" data-alt="A portrait of a user named Samir Patel. Confident expression, warm but high-contrast neon blue lighting illuminating one side of his face, set against a dark tech-noir background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6d0A0xjKi0eTblKQxj6l4BvS9gFzQR3KPUqAiQZoH_5OAL8TqLPtET7-uDSyTl2IBn6DbLpAoxKgaugRN0dPA6KEuKBMTc88jvgUeMJzAoXEWFbivGuMDuyk1TiGUomCTNBbWBgHDdFvG0TAhCDK_nPQytvplmtRMsa8BLo8OIwNdYZXIMYlNgHJBy_nUJ5auSHeJ9yv5RBL3Qgujdi73AHhaf7QjSnXq9D6nTM0svZ7Mm4WmDFPlFtGNlPevkURya39vOR8p05s">
</div>
<div>
<h3 class="font-headline-md text-headline-md-mobile text-on-surface">Samir Patel</h3>
<div class="flex items-center gap-2 mt-1">
<span class="bg-surface-variant text-primary-container font-label-md text-label-md px-2 py-0.5 rounded-sm">Новичок I</span>
<span class="bg-surface-variant text-on-surface-variant font-label-md text-label-md px-2 py-0.5 rounded-sm border border-outline-variant">Советы</span>
<span class="text-on-surface-variant font-label-md text-label-md">7 дней назад</span>
</div>
</div>
</div>
</div>
<div class="mb-4">
<p class="font-body-md text-body-md text-on-surface-variant">
                        Испытываю трудности с миссией "Глубокая работа". Отвлекающие факторы повсюду.
                    </p>
</div>
<div class="flex items-center justify-between border-t border-outline-variant/30 pt-3">
<div class="flex gap-6">
<button class="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md">
<span class="material-symbols-outlined">thumb_up</span>
                            12
                        </button>
<button class="flex items-center gap-1 text-on-surface-variant hover:text-primary-container transition-colors font-label-md text-label-md">
<span class="material-symbols-outlined">chat_bubble</span>
                            3
                        </button>
</div>
</div>
</article>
</div>
</main>
<!-- Floating Action Button (Create Post) -->
<button class="fixed bottom-24 md:bottom-12 right-6 w-14 h-14 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center neon-glow hover:scale-105 active:scale-95 transition-all z-40 shadow-[0_0_20px_rgba(0,242,255,0.4)]">
<span class="material-symbols-outlined text-[28px]">add</span>
</button>
<!-- BottomNavBar -->
<nav class="md:hidden bg-surface-container-lowest/90 dark:bg-surface-container-lowest/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 rounded-t-xl">
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group">
<span class="material-symbols-outlined text-[24px] mb-1 group-active:scale-90 duration-150">person</span>
<span class="font-label-lg text-label-lg">Профиль</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group">
<span class="material-symbols-outlined text-[24px] mb-1 group-active:scale-90 duration-150">check_circle</span>
<span class="font-label-lg text-label-lg">Привычки</span>
</button>
<button class="flex flex-col items-center justify-center text-on-surface-variant dark:text-on-surface-variant opacity-60 hover:text-secondary-fixed-dim transition-all group">
<span class="material-symbols-outlined text-[24px] mb-1 group-active:scale-90 duration-150">rocket_launch</span>
<span class="font-label-lg text-label-lg">Миссии</span>
</button>
<!-- Active Tab: Community -->
<button class="flex flex-col items-center justify-center text-secondary-fixed dark:text-secondary-fixed scale-110 drop-shadow-[0_0_8px_rgba(182,247,0,0.5)] active:scale-90 duration-150">
<span class="material-symbols-outlined text-[24px] mb-1" style="font-variation-settings: 'FILL' 1;">group</span>
<span class="font-label-lg text-label-lg">Сообщество</span>
</button>
</nav>
</body></html>

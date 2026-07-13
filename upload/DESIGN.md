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
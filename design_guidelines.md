# Knight Guide - Design Guidelines

## Design Approach
**System-Based:** Material Design 3 principles with enhanced accessibility features. This approach provides robust accessibility patterns, clear visual feedback, and proven interaction models essential for users with disabilities.

## Core Design Principles
1. **Accessibility First:** Every design decision prioritizes users with visual, auditory, or motor impairments
2. **High Contrast & Clarity:** Bold color differentiation, large touch targets, clear typography
3. **Predictable Navigation:** Consistent patterns across all features for cognitive ease
4. **Multi-Modal Feedback:** Visual, auditory, and haptic confirmations for all actions

## Typography System
- **Primary Font:** Inter (Google Fonts) - excellent readability and accessibility
- **Headings:** 
  - H1: 3xl to 4xl (48px desktop), Bold
  - H2: 2xl to 3xl (36px desktop), Semibold
  - H3: xl to 2xl (24px desktop), Semibold
- **Body Text:** Base to lg (16-18px), Regular weight, 1.6-1.8 line height
- **Minimum Text Size:** Never below text-base (16px) for accessibility
- **Emphasis:** Use font weight and size, avoid color-only differentiation

## Layout & Spacing System
**Tailwind Units:** Consistently use 4, 6, 8, 12, 16, 20, 24 for spacing
- Section Padding: py-16 to py-24 (desktop), py-10 to py-12 (mobile)
- Component Spacing: gap-6 to gap-8 within sections
- Container: max-w-7xl with px-6 for comfortable reading
- Cards/Panels: p-6 to p-8 with rounded-xl borders

## Component Library

### Navigation & Header
- Sticky top navigation with high-contrast background
- Large, clearly labeled navigation items (text-lg)
- Emergency SOS button: Fixed position, bright accent, minimum 56px touch target
- Accessibility toggle: High-contrast mode switcher prominently placed
- Voice command indicator when active

### Hero Section
**Full-width hero** with empowering accessibility-focused imagery showing diverse travelers with disabilities exploring destinations
- Hero content: Layered over image with backdrop-blur and semi-transparent dark overlay
- Primary CTA: Extra large (px-8 py-4), high contrast
- Trust indicators: "Trusted by 10,000+ travelers" with accessibility icons
- Quick access buttons: Voice Guide, Emergency Contact, Trip Planner

### Trip Planning Interface
- **Multi-step wizard** with clear progress indicators
- Disability type selection: Large icon cards (3 columns desktop, 1 mobile)
- Accessibility filters: Checkbox groups with descriptive labels and icons
  - Wheelchair Access
  - Tactile Paths
  - Audio Guides
  - Sign Language Support
- AI-generated itinerary display: Timeline card layout with clear visual hierarchy

### Accessibility Score Map
- **Interactive map component** taking full section width
- Color-coded markers: Green (fully accessible), Yellow (partially), Red (limited)
- Legend panel: Fixed position with high-contrast icons and labels
- Location cards: Pop-up panels with accessibility details, images, and ratings
- Filter bar above map: Large toggle buttons for different accessibility features

### Emergency & Safety Dashboard
- **Two-column layout** (desktop): Live tracking map + Status panel
- Emergency contact cards: Large touch targets with phone, message, location share
- Quick SOS button: Persistent, extra-large, uses accent color
- Status indicators: Visual + text (never color alone) showing tracking active/inactive
- Recent alerts timeline: Card-based with timestamps

### Volunteer Portal
- **Grid layout:** 2-3 columns of volunteer profile cards
- Profile cards include: Photo, name, languages, specializations, availability
- Match indicator: Percentage with visual progress bar
- Connect button: Prominent, large touch target
- Filter sidebar: Collapsible with large checkboxes and clear labels

### Communication Tools Panel
- **Floating action buttons** for quick access:
  - Text-to-Speech
  - Speech-to-Text  
  - Sign Language Translator
- Tool interface: Full-screen overlay when activated
- Large input/output areas with high contrast
- Visual feedback for active listening/processing states

### Blog Section
- **Masonry grid** of featured stories (2 columns desktop, 1 mobile)
- Article cards: Large featured images, clear headlines (text-xl), category tags
- Accessibility badges: Icons showing which disabilities each story addresses
- "Read More" links: Underlined and high contrast, never rely on color alone

### Forms & Inputs
- **Extra-large input fields:** min-h-14 with text-lg
- Labels: Always visible above inputs, never placeholder-only
- Error states: Icon + color + text description
- Success confirmations: Visual checkmark + color + text
- High-contrast borders: 2px solid with clear focus states (4px outline)

### Modals & Overlays
- Backdrop blur with high-contrast modal containers
- Large close buttons (top-right, minimum 44px)
- Clear headings and action buttons
- Modal width: max-w-2xl for readability

## Images Strategy
- **Hero:** Full-width, high-quality image of travelers with disabilities at iconic destinations, diverse representation required
- **Feature sections:** Supporting images showing app features in use, accessibility tools being utilized
- **Blog cards:** Destination photos with accessibility features visible (ramps, tactile paths, etc.)
- **Volunteer profiles:** Real human photos for trust and connection
- **Map markers:** Custom pin designs with accessibility symbols

## Animations
**Minimal and purposeful only:**
- Smooth page transitions (fade-in)
- Button hover states (subtle scale)
- Loading states for AI processing with clear progress indicators
- NO distracting scroll animations
- Focus on immediate, clear feedback over decorative motion

## Accessibility Implementation
- **Color Contrast:** Minimum WCAG AAA (7:1 for body text, 4.5:1 for large text)
- **Touch Targets:** Minimum 44x44px for all interactive elements
- **Focus Indicators:** 4px offset outline on all focusable elements
- **Screen Reader:** Semantic HTML with ARIA labels throughout
- **Keyboard Navigation:** Full functionality without mouse
- **High-Contrast Mode:** Toggle in header switches to enhanced contrast palette

This design creates a comprehensive, accessible, and empowering experience that respects the dignity and independence of travelers with disabilities while providing all necessary safety and planning tools.
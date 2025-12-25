# Event Service Landing Page

A beautiful, fully-designed landing page for The Expréss event service has been created at `/landing`.

## Features

### Design Elements
- **Typography**: Custom fonts (DM Sans, Instrument Serif, Archivo Black)
- **Color Scheme**: 
  - Dark background: `#0D0D0D`
  - Light text: `#F2F0EF`
  - Footer background: `#E2E0DF`
- **Sections**:
  1. Hero navigation with logo and menu links
  2. Main hero section featuring "Dinner Parties"
  3. Contact form section
  4. Calendly integration for scheduling calls
  5. Footer with contact information and navigation

### Interactive Elements
- Hover states on all buttons and links
- Responsive layout with centered max-width containers
- Decorative star icons throughout
- Gradient text effects in footer

## Accessing the Page

To view the landing page, navigate to:
```
http://localhost:3000/landing
```

## Customization

### Updating Contact Information
Edit the footer section in `src/app/landing/page.tsx`:
- Phone: `832-693-9729`
- Email: `plan@theexpress.io`
- Social media links

### Updating Images
Replace the placeholder image URLs in the component with your actual images:
- Logo images
- Background images
- Calendly embed

### Updating Navigation Links
Modify the `NavLink` components to point to your actual page sections or routes.

## Technical Stack
- Next.js 16
- React 19
- Tailwind CSS 4
- Google Fonts (DM Sans, Instrument Serif, Archivo Black)
- TypeScript

## Future Enhancements
- [ ] Integrate actual Calendly embed
- [ ] Connect form functionality
- [ ] Add smooth scroll navigation
- [ ] Implement mobile responsive design
- [ ] Add animation effects on scroll
- [ ] Connect navigation links to actual sections

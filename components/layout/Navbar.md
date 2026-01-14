
# Navbar.tsx Documentation

## Purpose
The primary navigation header for authenticated users.

## Responsibilities
- Provide links to key areas of the app (Dashboard, Exams, etc.).
- Handle user sign-out logic.
- Differentiate between Admin and User navigation items.

## UI Behavior
- Sticky at top (managed by parent container).
- High contrast colors (Emerald/White) for readability.
- Clean logo with colored emphasis.

## Props
- `role`: Decides which links to show.

## Related Files
- `App.tsx`: Renders this component conditionally.

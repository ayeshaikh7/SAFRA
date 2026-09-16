# SAFRA — Smart AI for Safer Routes & Awareness

A hackathon-ready React + Vite prototype for CX1002: **The Route Nobody Warned Her About**.

## What is included

- Destination input
- Travel-time slider from 6 PM to 11 PM
- Three route options: Fastest, Safer, Alternative
- Dynamic time-aware prototype safety scores
- Transparent explanation of route indicators
- Interactive OpenStreetMap/Leaflet map
- Prototype incident-report modal
- Responsive layout

## Run in VS Code

1. Install Node.js 18+.
2. Open this folder in VS Code.
3. Open the integrated terminal.
4. Run:

```bash
npm install
npm run dev
```

5. Open the localhost URL printed by Vite.

## Important prototype note

The route coordinates, incident counts, lighting and activity values are **illustrative demo data**. The score is an experimental UI/demo indicator, not a scientifically validated measure or a guarantee of safety.

For a production/hackathon backend, replace the demo `routes` array and `scoreFor()` function in `src/main.jsx` with real, carefully sourced data and a documented model.

## Suggested next upgrades

- FastAPI backend
- PostgreSQL/Supabase safety database
- Real routing API (Mapbox/Google Maps/OSRM)
- Time-stamped public datasets
- Verified/unverified report status
- Privacy-preserving user reports
- AI report classification and explanation

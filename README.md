# Usman Butt Portfolio

## Run locally

Run `npm install`, then `npm run dev`. In a second terminal, run `npm run server` to enable the contact endpoint (the Vite development server proxies `/api` requests to it). Create a `.env` file from `.env.example` first.

## Production build

Run `npm run build`. Deploy the static site plus `server.js` (or move its single `/api/contact` handler into your host's serverless-function convention).

## Content and images

All editable copy, contact information, services, projects, and journal entries live in `src/data/content.js`. Replace `src/assets/images/projects/arc-studio.jpg` and add clear project image files in that folder; update each project `image` import/reference in the same data file. Replace `src/assets/images/profile/usman-portrait.jpg` with Usman's real photo (keep the filename, or update the import in `src/App.jsx`).

## Resend setup

Set these server-side variables only—never prefix them with `VITE_`:

- `RESEND_API_KEY`: Usman's Resend API key
- `CONTACT_TO_EMAIL`: where enquiries should arrive
- `CONTACT_FROM_EMAIL`: a sender on a verified Resend domain, e.g. `Portfolio <hello@yourdomain.com>`

Resend requires the sender domain to be verified in its dashboard. The visitor's email is set as the email reply-to address.

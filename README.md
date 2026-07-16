# Usman Butt Portfolio

## Run locally

Run `npm install`, then `npm run dev` to work on the site. To test the contact form locally, use `npx netlify dev`; it loads the Netlify Function and local variables from `.env`. Create a `.env` file from `.env.example` first.

## Production build

Run `npm run build`. Deploy the static Vite output to Netlify; the contact form is handled by the Netlify Function at `/.netlify/functions/contact`.

## Content and images

All editable copy, contact information, services, projects, and journal entries live in `src/data/content.js`. Replace `src/assets/images/projects/arc-studio.jpg` and add clear project image files in that folder; update each project `image` import/reference in the same data file. Replace `src/assets/images/profile/usman-portrait.jpg` with Usman's real photo (keep the filename, or update the import in `src/App.jsx`).

## Resend setup

Set these server-side variables only—never prefix them with `VITE_`:

- `RESEND_API_KEY`: Usman's Resend API key
- `CONTACT_TO_EMAIL`: where enquiries should arrive
- `CONTACT_FROM_EMAIL`: a sender on a verified Resend domain, e.g. `Portfolio <hello@yourdomain.com>`

Resend requires the sender domain to be verified in its dashboard. The visitor's email is set as the email reply-to address.

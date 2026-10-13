# Ankit & Swati — Editable Wedding Invitation Website

A mobile-friendly, static wedding invitation inspired by premium Indian wedding invitation websites. Includes animated hero, countdown, events, photo gallery, music controls, venue directions, and a demo RSVP form.

## Quick start
1. Extract the ZIP.
2. Open `config.js` in a text editor.
3. Change names, date, venue, events, and gallery images.
4. Add a licensed MP3 to `assets/music/` named `replace-with-your-song.mp3`.
5. Open `index.html` in a browser to preview. For best results, use a local server or upload to hosting.

## Edit wedding details
All main content is in `config.js`:
- `groom`, `bride`: couple's names.
- `weddingDate`: countdown target in ISO date/time format. Include timezone, e.g. `2027-02-14T18:00:00+05:30`.
- `dateLabel`: visible date text.
- `venueName`, `venueAddress`, `mapUrl`: venue details and directions.
- `events`: edit event names, dates, times, venue, and notes.
- `gallery`: replace each image URL with your own image URL. For local images, put files in `assets/gallery/` and use paths such as `assets/gallery/photo-1.jpg`.

## Music
Browsers usually block autoplay with sound. Guests should tap **Play music**. Use only music you own or are licensed to use. Put the MP3 at:
`assets/music/replace-with-your-song.mp3`

## Upload to Hostinger
1. Log in to Hostinger hPanel → Websites → Manage → File Manager.
2. Open `public_html` for the domain/subdomain.
3. Upload the extracted project files and folders (not the outer project folder itself).
4. Make sure `index.html`, `config.js`, `script.js`, `styles.css`, and `assets/` are directly inside `public_html`.
5. Open your domain with HTTPS and test on a phone.

## Deploy to Netlify
Option A — drag and drop:
1. Extract the ZIP.
2. Open Netlify's manual deploy page and drag the project folder (the folder containing `index.html`) into the deploy area.
3. Netlify will publish a preview URL. You can set a custom domain in Site settings.

Option B — Git:
1. Push the extracted project to a Git repository.
2. In Netlify, choose Add new site → Import an existing project.
3. Select the repository. No build command is required; publish directory is `.`.

## Important limitations / notes
- This is a front-end static website; it does not include a server or database.
- The RSVP form is a demo: it saves responses in the guest's own browser only. To collect responses from guests remotely, connect a form service such as Netlify Forms or Formspree and configure it.
- The countdown currently uses a sample date. Update it before sharing.
- Sample gallery/hero photos load from Unsplash over the internet; replace with your own images for a personal invitation.
- The source page could not be fully inspected, so this is an original implementation inspired by the reference, not an exact source-code clone.

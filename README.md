

b69ca9421649cc83f625c58547628923a551e7bb5ea17775b5603d2875108f9a
# InLabels Notes App
Minimal notes app built with SvelteKit and TypeScript, featuring CRUD, search, pagination, dark mode, keyboard shortcuts, and offline-aware UI.
This notes app was built as part of the **Frontend Engineer Intern** hiring process for **InLabels**.
- ### Live app: https://inlabels-notes-app.vercel.app  
- Tech stack: SvelteKit · TypeScript · Tailwind CSS · MockAPI · Vercel
   <img width="1000" height="1041" alt="image" src="https://github.com/user-attachments/assets/bd2f068e-fa69-4103-b0b1-1ac21be04286" />

> First line is the SHA-256 hash of my GitHub username (`AnkitDimri4`), per assignment instructions.

---

## Table of Contents

- Features  
- Tech Stack  
- Project Context  
- Getting Started  
- Project Structure  
- Deployment  
- Author  

---

## Features

- Create, read, update, and delete notes (CRUD).  
- Search notes by title or content.  
- Client-side pagination for large note lists.  
- Dark / light mode with persisted theme preference.  
- Keyboard shortcuts for faster note actions.  
- Offline-aware UI with loading, empty, and error states.  
- Responsive layout built with Tailwind CSS.

---

## Tech Stack

**Frontend**

- SvelteKit  
- TypeScript  
- Tailwind CSS  

**Data Layer**

- MockAPI (mockapi.io) for persisting notes data.  

**Tooling & Deployment**

- Vite  
- ESLint & svelte-check  
- Deployed on Vercel  

---

## Project Context

This project demonstrates:

- Comfortable use of Svelte/SvelteKit.  
- Ability to integrate with a REST-style MockAPI backend.  
- Production-ready UI/UX practices (state handling, theme, responsiveness).  

---

## Getting Started

### Prerequisites

- Node.js (LTS) and npm installed.
- A MockAPI project with a `notes` resource (or adjust the API URL accordingly).

### Installation

```bash
# clone the repo
git clone https://github.com/<your-username>/inlabels-notes-app.git
cd inlabels-notes-app

# install dependencies
npm install
```

### Configuration

If the API base URL is configurable, create `.env` (or update `src/lib/api/notes.ts`):

```bash
VITE_API_BASE_URL=https://<your-mockapi-project>.mockapi.io/api/v1
```

Please make sure this matches how your `notes.ts` file reads the base URL.

### Run in development

```bash
npm run dev
# or
npm run dev -- --open
```

Visit the URL printed in the terminal (typically `http://localhost:5173`).

### Lint & type-check

```bash
npm run lint
npm run check
```

### Build for production

```bash
npm run build
npm run preview
```

---

## Project Structure

```text
.
├── eslint.config.js
├── postcss.config.js
├── svelte.config.js
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── src
    ├── app.css
    ├── app.html
    ├── lib
    │   ├── api
    │   │   └── notes.ts        # Notes CRUD API helpers
    │   ├── components
    │   │   ├── NoteCard.svelte # Single note card
    │   │   └── NoteForm.svelte # Create / edit note form
    │   ├── assets
    │   │   └── favicon.svg
    │   └── types.ts            # Shared types (Note, API shapes, etc.)
    └── routes
        ├── +layout.svelte      # Layout, theme handling
        ├── +page.svelte        # Notes list, search, pagination, create/edit flows
        └── +error.svelte       # Custom error page
```

---

## Deployment

This project is deployed on **Vercel**.

Basic steps if you want to redeploy or fork:

1. Push the repository to your GitHub account.  
2. Go to https://vercel.com and create a new project from this repo.  
3. Set any required environment variables (e.g. `VITE_API_BASE_URL`).  
4. Trigger a deploy; Vercel will detect SvelteKit automatically.  

---

## Author

**Ankit Dimri**  
Frontend / Full‑Stack Developer  
📍 Dehradun, India  

[![GitHub](https://img.shields.io/badge/GitHub-AnkitDimri4-black?logo=github)](https://github.com/AnkitDimri4)   [![LinkedIn](https://img.shields.io/badge/LinkedIn-Ankit%20Dimri-blue?logo=linkedin)](https://linkedin.com/in/ankit-dimri-a6ab98263)   [![LeetCode](https://img.shields.io/badge/LeetCode-Profile-orange?logo=leetcode)](https://leetcode.com/u/user4612MW/)

## Tech Stack

<p align="left">
  <img src="https://img.shields.io/badge/Framework-SvelteKit-orange?logo=svelte" alt="SvelteKit" />
  <img src="https://img.shields.io/badge/Language-TypeScript-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/CSS-TailwindCSS-0ea5e9?logo=tailwindcss" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/API-MockAPI.io-green" alt="MockAPI" />
  <img src="https://img.shields.io/badge/Build-Vite-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel" alt="Vercel" />
</p>

---

## Reflection

I approached this assignment by first building the core CRUD flow against MockAPI, then layering in UX features like search, sorting, pagination, dark mode, and keyboard shortcuts to keep the app fast and easy to use. For offline behaviour, I focused on keeping existing notes readable when the network is lost and clearly blocking new writes with an “You are offline. Please reconnect to create notes.” message instead of silently failing. A conscious trade-off was not implementing a full offline sync queue and conflict resolution system due to time, and instead shipping a lighter “offline-aware” UX with optimistic updates when online. Besides the default SvelteKit stack, I only added tooling/styling dependencies that improved developer experience while keeping the bundle small. My chosen “own feature” is the keyboard shortcuts combined with polished empty and loading states to make power usage smoother. With more time, I would add pinning, labels, and a more robust offline sync strategy with retries and a visual history of pending changes.

---

<div align="center">
Built with ❤️ by <strong>Ankit Dimri</strong> as part of the InLabels Frontend Engineer Intern assignment.
</div>

---

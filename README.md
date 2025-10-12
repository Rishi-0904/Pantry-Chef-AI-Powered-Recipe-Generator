# Pantry Chef – AI Powered Recipe Generator

Pantry Chef helps home cooks turn whatever ingredients they already have into creative meal ideas. Users maintain a virtual pantry, trigger an AI recipe generator (via a Firebase Cloud Function), review generated dishes, save favourites, and plan a weekly menu – all while keeping API keys secure on the server side.

## Features
- **Ingredient management** – build and maintain a personalised pantry inventory.
- **AI recipe generation** – securely invoke an AI provider (e.g. Gemini) through Firebase Cloud Functions.
- **Recipe library** – save generated recipes per user using Firestore.
- **Weekly planner** – organise favourite meals across the week.
- **Firebase Authentication** – protect user data and enable personalised experiences.

## Tech Stack
- **Frontend**: React (Vite, JavaScript), React Router, PropTypes for runtime validation.
- **Backend**: Firebase Cloud Functions (Node.js, planned configuration).
- **Services**: Firebase Authentication, Firestore, Cloud Functions.

## Repository Structure
```text
pantry-chef/
  config/              # Firebase configs, security rules, environment templates
  docs/                # Architecture and requirements documentation (planned)
  functions/           # Firebase Cloud Functions source (to be initialised)
    src/
      api/
      services/
      utils/
      index.js
  scripts/             # Deployment and seeding scripts (placeholders)
  tests/               # Automated tests for functions and web (placeholders)
  web/                 # React frontend managed by Vite
    public/
    src/
      components/
      contexts/
      hooks/
      pages/
      routes/
      services/
      styles/
      main.jsx
      App.jsx
```

## Prerequisites
- Node.js 18+ and npm 9+
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project with Authentication and Firestore enabled
- API access to an AI provider (e.g. Gemini or OpenAI) with a valid API key

## Environment Configuration
Create an environment file for the frontend (Vite expects a `.env` file in `web/`).

```bash
cp config/env.example web/.env
```

Populate the file with your Firebase project settings:

```env
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=sender-id
VITE_FIREBASE_APP_ID=app-id
```

> **Tip:** Add any AI provider secrets to Firebase Functions configuration (via `firebase functions:config:set`) instead of storing them in the frontend.

## Frontend Setup (`web/`)
```bash
cd web
npm install
npm run dev
```

The development server runs at `http://localhost:5173/` by default.

## Functions Setup (`functions/`)
Cloud Functions scaffolding is reserved for secure AI calls. Initialise when ready:

```bash
cd functions
firebase init functions   # choose JavaScript, ESLint, npm when prompted
npm install
```

Expose your AI integration via `functions/src/api/` and ensure you export callable functions from `functions/src/index.js`. Deploy with `firebase deploy --only functions` once implemented.

## Running the Full Stack Locally
1. **Start emulators (optional but recommended):**
   ```bash
   firebase emulators:start --only auth,firestore,functions
   ```
2. **Run the frontend:** in another terminal, `npm run dev` from `web/`.
3. **Invoke Cloud Functions:** configure the frontend to call the local emulator (`useEmulator()` helpers) while developing.

## Deployment Workflow
- Build frontend: `cd web && npm run build`.
- Deploy hosting + functions: `firebase deploy`.
- CI/CD suggestions: add linting (`npm run lint`) and automated tests before deploying.

## Testing
- **Frontend**: add tests with Vitest/React Testing Library (coming soon).
- **Functions**: add unit tests with Jest or the Firebase Functions Test SDK.

## Roadmap / Next Steps
- Implement Firebase Cloud Functions for AI gateway calls.
- Add persistent storage for pantry items and saved recipes in Firestore.
- Build authentication screens and route guards (`LoginPage`, `ProtectedRoute`).
- Add comprehensive unit/integration tests.

## Contributing
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit changes: `git commit -m "Add amazing feature"`.
4. Push and open a pull request.

## License
Specify a license for the project (e.g. MIT) or remove this section once decided.

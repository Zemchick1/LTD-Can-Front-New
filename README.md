# LTD-Can-Frontend (Libroty)

LTD-Can-Frontend is a React application for browsing, searching, filtering, viewing, and adding written media such as books, manga, and comics.

This was my first collaborative project (Last Commit 2023), so the codebase reflects a practical learning process: shared UI components, typed data models, Redux-based state management, API integration, testing, and deployment configuration are all organized in one frontend repository.

Unfortunately, the project was not completed due to changes in team availability before development reached its final stages. See also: 

[Backend Repository](https://github.com/Zemchick1/LTD-Can-Back-New).
[Figma Project](https://www.figma.com/design/HxFkG1hi9y0f25SmmzMQeJ/Libroty)

Note: The content below was generated with AI assistance.

## What Was Used

### Core Frontend

- **React 18** for building the user interface.
- **TypeScript** for typed components, store state, actions, and API data models.
- **Create React App / react-scripts** for local development, builds, and the default React tooling.
- **React Router DOM v6** for category-based routing, search pages, authentication pages, and writing detail pages.
- **Sass / Sass modules** for component-scoped styles.

### State and Data

- **Redux Toolkit** and **Redux** for application state setup.
- **React Redux** for connecting components to the store.
- **Redux Persist** for keeping the profile slice in browser storage between sessions.
- **Fetch API** for backend requests.
- **react-cookie** for cookie consent state.
- **query-string** for passing writing data through URL query parameters.

### UI Helpers

- **react-select** for multi-select and autocomplete-style inputs in the writing addition form.
- **styled-content-loader** for loading placeholders.
- **Font Awesome**, **styled-components**, and **react-waypoint** are installed as UI-related dependencies, although the current implementation mainly uses Sass modules and custom components.

### Testing, Build, and Delivery

- **Jest**, **ts-jest**, and **React Testing Library** for component tests.
- **jest-dom** for DOM assertions.
- **jest-sonar-reporter** and **lcov** for coverage and Sonar-compatible reports.
- **Babel** presets/plugins for TypeScript and React transforms in the test/build toolchain.
- **Docker** with **Nginx Alpine** for serving the production build.
- **GitHub Actions** for CI steps: install, build, test, archive build output, build Docker image, and push it to Docker Hub.

## Main Features

- Browse content by category: `book`, `manga`, and `comics`.
- Switch between navigation themes such as popular, genres, collections, and random.
- Search writings by text.
- Filter search results by backend-provided categories such as authors, genres, and tags.
- Combine filter items with `AND`, `OR`, and `NOT` statuses.
- View writing cards and writing detail pages.
- Register, log in, and log out through backend authentication endpoints.
- Persist profile-related client state between page reloads.
- Accept cookie consent using a browser cookie.
- Work with an early-stage writing addition form for metadata such as title, authors, type, genres, tags, ISBN, series, pages, publication year, language, and related writings.

## Architecture Overview

The project follows a classic React single-page application structure:

```text
public/
  index.html          HTML template and root element

src/
  index.tsx           React entry point
  App.tsx             Application providers and top-level layout gates
  components/         Pages and reusable UI components
  store/              Redux reducers, selectors, and action creators
  interfaces/         TypeScript interfaces for domain data
  utils/              Constants, enums, hooks, fonts, and style helpers
  assets/             Fonts and images
```

At runtime the application is composed like this:

```text
Browser
  -> src/index.tsx
  -> App
  -> Redux Provider
  -> Redux PersistGate
  -> Router
  -> Page components
  -> Shared UI components
  -> Redux action creators
  -> Backend API / Google Storage
```

## Application Entry Flow

`src/index.tsx` creates the React root and renders `App`.

`src/App.tsx` wraps the UI with:

- `Provider`, which exposes the Redux store.
- `PersistGate`, which waits for persisted Redux state to rehydrate.
- `Router`, which owns all client-side routes.
- `CookieConsent`, which appears until the `cookieConsent` browser cookie is accepted.

This means global state, persisted profile data, routing, and cookie consent are initialized before the main pages are used.

## Routing

Routes are defined in `src/components/Router/Router.tsx`.

| Route | Component | Purpose |
| --- | --- | --- |
| `/` | Redirect | Redirects to the user's selected/default category. |
| `/:category` | `Home` | Shows the feed for a category such as books, manga, or comics. |
| `/:category/search` | `SearchPage` | Shows search results without a search text parameter. |
| `/:category/search/:searchTextParam` | `SearchPage` | Shows search results for a specific search query. |
| `/login` | `LoginForm` | User login page. |
| `/signUp` | `SignUpForm` | User registration page. |
| `/:category/writing` | `WritingView` | Writing view route without an id. |
| `/:category/writing/:writingId` | `WritingView` | Writing detail page. |
| `/:category/addition` | `WritingsAddition` | Form for adding a new writing. |
| `*` | Inline 404 | Fallback for unknown routes. |

The router also checks persisted profile state on mount and merges it with the current profile state shape. This helps older persisted profile data stay compatible after state fields change.

## State Management

Redux state is configured in `src/store/index.tsx`.

The root reducer combines four slices:

- `profile` stores authentication status, user information, selected/default category, navigation marks, language, and cookie consent shape.
- `writings` stores request status and request error information for writing-related API calls.
- `filter` stores selected filter categories and year range values.
- `helper` is currently an empty helper slice reserved for shared state if needed later.

Redux Persist is configured with the key `ltd`. Only the `profile` slice is persisted because `writings`, `helper`, and `filter` are blacklisted. That keeps user/profile preferences across reloads while avoiding stale feed and filter data.

## Data and API Layer

The project keeps API calls inside Redux action creator files rather than directly inside every component.

Important files:

- `src/store/profile/actionsCreators.tsx` handles registration, login, logout, profile merge, language changes, and auth state.
- `src/store/writings/actionsCreators.tsx` handles feed loading, search, adding writings, series book lists, and autocomplete search.
- `src/store/filter/actionsCreators.tsx` handles selected filters, year range, and fetching complete filter item lists.
- `src/store/helper/actionCreators.tsx` handles cover image loading from storage, object-key comparison, access token renewal, and retrying a request after token renewal.

The app expects two environment variables:

```bash
REACT_APP_API_KEY=http://localhost:8080/
REACT_APP_GOOGLE_STORAGE_KEY=https://your-storage-base-url/
```

`REACT_APP_API_KEY` is used as the backend API base URL. `REACT_APP_GOOGLE_STORAGE_KEY` is used to load cover images from the `books/` path.

Backend requests use `credentials: "include"`, so authentication is expected to work with cookies. Some protected requests can call `auth/renew_token` and retry after access token renewal.

## Component Structure

The `components` directory contains both page-level components and smaller UI blocks:

- `Header`, `Navigation`, `SearchBar`, and `Footer` build the shared page frame.
- `Home` renders the category feed through `PaginationFeed`.
- `PaginationFeed`, `PaginationFeedLoader`, and `WritingItem` build the feed and animated page changes.
- `SearchPage`, `SearchItem`, and the `Filter` components build the search and filtering experience.
- `LoginForm` and `SignUpForm` handle authentication UI and validation.
- `WritingView` displays a selected writing.
- `WritingsAddition` contains the larger form intended for creating a new writing.
- `CookieConsent` manages the cookie banner.
- `NotFoundPage` and `EditionsAddition` exist as early or reserved components for future expansion.

Each major component has its own `.module.sass` file, which keeps styling local to that component.

## Styling and Assets

Global styles are imported from `src/index.sass`. Shared Sass utilities live in `src/utils`, including:

- `variables.sass`
- `mixins.sass`
- `fonts.sass`

The project includes local **Lora** and **Roboto** font files in `src/assets/fonts`. The default placeholder cover image is stored in `src/assets/images/foodBanner.jpg`.

## Testing

The project includes component tests for:

- `Header`
- `SearchBar`
- `SignUpForm`

Testing helpers are in `src/utils/test.utils.tsx`. The helper wraps tested components with Redux Provider and BrowserRouter so components can be tested in an environment close to the real app.

Run tests with:

```bash
npm test
```

The custom Jest configuration also collects coverage into `.scannerwork/coverage` and writes a Sonar-compatible report to `.scannerwork/sonar-report.xml`.

## CI/CD and Deployment

The GitHub Actions workflow in `.github/workflows` runs on pushes and pull requests to `main`.

The workflow contains three main jobs:

1. **build**: installs dependencies, builds the React app, and uploads the `build` folder as an artifact.
2. **test**: installs dependencies and runs the test suite.
3. **docker**: downloads the build artifact, builds a Docker image, logs in to Docker Hub, and pushes the frontend image.

Production serving is handled by:

- `Dockerfile`, based on `nginx:1.22.0-alpine`.
- `nginx.conf`, which serves `/usr/share/nginx/html`, supports client-side routing with `try_files ... /index.html`, and adds long-term caching for static assets.

## Getting Started

Install dependencies:

```bash
npm install
```

The CI workflow currently uses Node.js 14.

Create a local `.env` file with the required API values:

```bash
REACT_APP_API_KEY=http://localhost:8080/
REACT_APP_GOOGLE_STORAGE_KEY=https://your-storage-base-url/
```

Start the development server:

```bash
npm start
```

Build for production:

```bash
npm run build
```

Build and run the Docker image after creating a production build:

```bash
docker build -t ltd-can-frontend .
docker run -p 80:80 ltd-can-frontend
```

## Available Scripts

- `npm start` starts the local development server.
- `npm run build` creates a production build in `build/`.
- `npm test` runs the test suite.
- `npm run eject` ejects Create React App configuration.
- `npm run start:prod` starts React with `prod.env` through `env-cmd`.

## Notes

- The package includes a proxy to `http://localhost:8080/` for local backend development.
- The codebase currently keeps API request logic in Redux action creators. This keeps components lighter, but a future refactor could move repeated fetch logic into a dedicated API client.
- Some UI and feature areas are still early-stage, such as `EditionsAddition`, placeholder images, and parts of the writing detail page.
- Because this was a first collaborative project, the architecture is intentionally straightforward and easy to follow: page components own screen layout, Redux owns shared state, action creators own backend communication, and Sass modules own component styling.

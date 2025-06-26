# 📚 Quotes App (Expo + React Native)

> [!IMPORTANT]
> This project was created to learn best practices and challenge myself, as it is my first meaningful React Native project.

A mobile application built with Expo, displaying random quotes and a paginated list of quotes. It includes:

- **Expo Router** – bottom-tabs navigation with Home / Quotes / Favourites.
- **React Query** (`@tanstack/react-query`) – infinite scroll, pull-to-refresh, state handling
- **Axios** – typed client (API layer in `/services`).
- **Global Theme** (light/dark) + `AppThemeSwitcher` with animated icon.
- **TypeScript** 100 %
- **Jest + @testing-library/react-native** – logical coverage 80%+.
- **GitHub Actions** – lint → tests → coverage badge
- **Storage** - local storage to keep favourite quotes

---

## ✨ Features

| Screen             | Functionality                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Home**           | Random quote (fetch), _New quote_ / _Add to favourites_ buttons                                                 |
| **Quotes**         | Infinite-scroll list, search bar (debounced with `router.setParams`), pull-to-refresh, loading indicator/footer |
| **Favourites**     | Placeholder for saved quotes                                                                                    |
| **Theme switcher** | Animated sun/moon icon rotation, `ThemeProvider` context                                                        |
| **CI / Tests**     | Prettier on every push • Jest + @testing-library/react-native • ~ 98 % line coverage • Coverage badge on PRs    |

---

## 🛠 Tech Stack

| Area                | Library / Tool                                              |
| ------------------- | ----------------------------------------------------------- |
| Navigation          | **Expo Router** (`expo-router`, bottom-tabs)                |
| Data fetching / C-S | **React Query** (@tanstack/react-query 5)                   |
| HTTP client         | **Axios** (typed)                                           |
| Global state        | Custom hooks & React Contexts (`useTheme`, `useFavourites`) |
| Storage             | AsyncStorage (persist favourites & theme)                   |
| Styling / Icons     | `StyleSheet` / `Pressable` • Lucide-react-native icons      |
| Quality             | ESLint, Prettier, TypeScript strict, Husky pre-commit       |
| Tests               | Jest • @testing-library/react-native • `msw` for API mocks  |
| CI / CD             | GitHub Actions (`lint → test → coverage`)                   |

---

## 🚀 Getting Started

```bash

# 1. Clone & install
git clone https://github.com/your-user/quotes-app.git
cd quotes-app
npm install

# 2. Run Metro + Expo Go
npm run start          # press "i" for iOS sim, "a" for Android

# 3. Jest tests
npm test               # or  npm test --watch

# 4. Lint & format
npm run format         # Prettier --write .
```

---

## 📁 File structure

```
quotes-app
├── app/                        # Expo Router routes
│   ├── _layout.tsx             # Root layout (providers)
│   └── (tabs)/
│       └── _layout.tsx         # Bottom-tab navigator
├── components/                 # Global components
├── hooks/                      # Custom hooks
├── services/                   # API Functions
├── types/                      # Global interfaces
├── __tests__/                  # Jest tests (unit + integration)
├── constants/                  # Fonts, icons, splash
├── jest.config.js
├── tsconfig.json
└── README.md
```

---

## 📱 Preview

<div align="center">

| Light                                                                                                     | Dark                                                                                                      |
| --------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| <img src="https://github.com/user-attachments/assets/16994e41-7ac4-49ce-ad65-4cedfb374fe6" width="250" /> | <img src="https://github.com/user-attachments/assets/a66cc272-778d-4e3c-bb58-ee89d7a011f9" width="250" /> |

</div>

### Whole app overview

<div align="center">
  <img src="https://github.com/user-attachments/assets/1554e2b5-60e6-4c3f-a39c-a3f115344a5d" width="250" />

</div>

---

## 📝 Commit convention

This repo follows the **Conventional Commits** specification (e.g. feat:, fix:, docs:).
Using a clear, structured message format helps me practise team-friendly workflows and makes it obvious what each commit adds or changes.

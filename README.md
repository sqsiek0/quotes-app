# 📚 Quotes App (Expo + React Native)

> [!IMPORTANT]
> This project was created to learn best practices and challenge myself, as it is my first meaningful React Native project.

A mobile application built with Expo, displaying random quotes and a paginated list of quotes. It includes:

- **Expo Router** – bottom-tabs navigation with Home / Quotes / Favorites.
- **React Query** (`@tanstack/react-query`) – infinite scroll, pull-to-refresh, state handling
- **Axios** – typed client (API layer in `/services`).
- **Global Theme** (light/dark) + `AppThemeSwitcher` with animated icon.
- **TypeScript** 100 %
- **Jest + @testing-library/react-native** – logical coverage 80%+.
- **GitHub Actions** – lint → tests → coverage badge

#### Future implementation:

- **Storage** - need to check how it works
- and more...

---

## ✨ Features

| Screen             | Functionality                                                                                                   |
| ------------------ | --------------------------------------------------------------------------------------------------------------- |
| **Home**           | Random quote (fetch), _New quote_ / _Add to favorites_ buttons                                                  |
| **Quotes**         | Infinite-scroll list, search bar (debounced with `router.setParams`), pull-to-refresh, loading indicator/footer |
| **Favorites**      | Placeholder for saved quotes                                                                                    |
| **Theme switcher** | Animated sun/moon icon rotation, `ThemeProvider` context                                                        |

---

## 🚀 How to

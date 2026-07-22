# Contributing to LearnFlow

First off, thank you for considering contributing to LearnFlow! It's people like you who make this system amazing.

---

## 🛠️ How to Contribute

### 1. Reporting Bugs & Suggesting Features
*   Check the [Issues](https://github.com/your-username/learnflow/issues) tab to see if your bug/feature has already been reported.
*   If not, open a new Issue, clearly describing:
    *   Expected vs. actual behavior.
    *   Steps to reproduce.
    *   Any relevant logs or screenshots.

### 2. Pull Requests (PRs)
*   Fork the repository and create a new branch from `main`:
    ```bash
    git checkout -b feature/my-amazing-feature
    ```
*   Implement your changes, adhering to the codebase style.
*   Run the linting and formatting checks to make sure everything passes:
    ```bash
    npm run lint
    npm run build
    ```
*   Commit your changes using clear, descriptive commit messages:
    ```bash
    git commit -m "feat: add support for local PDF parsing"
    ```
*   Push to your fork and submit a PR to the `main` branch.

---

## 💻 Development Guidelines

*   **TypeScript:** All new files should use TypeScript (`.ts` or `.tsx`). Always define explicit interfaces and avoid using the `any` type.
*   **Components:** Reusable UI elements belong in `src/components/ui/` and should use Tailwind CSS alongside `@base-ui/react` primitives.
*   **Database:** Keep the database schema in `prisma/schema.prisma` clean and document any new fields or relationships.
*   **Prisma 7 Compatibility:** Do not hardcode database connection strings in the schema file; configuration resides solely in `prisma.config.ts`.

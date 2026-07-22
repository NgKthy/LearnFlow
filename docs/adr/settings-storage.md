# ADR 2: Settings Storage Strategy

## Context
LearnFlow requires configuration settings that can be customized at runtime, specifically:
1. AI API keys (e.g. Gemini API Key)
2. Telegram Bot tokens (if modified)
3. Scanner settings or system preferences

We evaluate whether to store these configurations in **Environment Variables (.env)** or in the **Database (Postgres)**.

## Comparison

### 1. Environment Variables (.env)
* **Pros:** Standard practice, highly secure, easily read at server startup.
* **Cons:** Static. Editing settings requires server restarts, redeployments, or container configuration changes. Users cannot easily update API keys directly through the UI without code access.

### 2. Database Storage (Postgres)
* **Pros:** Highly dynamic. Settings can be updated instantly via a "Settings" page in the UI. No redeployment or process restart is required.
* **Cons:** Requires database queries (mitigated by lightweight queries or cache structures). Keys are stored alongside application data, requiring sensible encryption or access controls.

## Decision
We choose **Database-Level Storage with Environment Fallbacks**:
1. Create a `Setting` key-value model in [schema.prisma](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/prisma/schema.prisma) to save settings dynamically.
2. In our service files, we will try to load configurations from the `Setting` model first.
3. If not found in the database, we fallback to standard `process.env` variables.
4. Provide a secure, simple key-value update form in the `/settings` page.

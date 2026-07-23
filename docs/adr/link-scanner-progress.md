# ADR 3: Link Scanner Real-time Progress Tracking

## Context
The Link Scanner processes a list of resource links batch-by-batch (size 5, 1s delay) to find broken URLs.
Because Next.js Server Actions execute in a single HTTP request, running the entire scan synchronously can block the request for a long time (especially with many links), resulting in timeouts and blocking the UI.
We need a mechanism to:
1. Trigger the link scanner asynchronously (in the background).
2. Report the scan progress (percentage, processed count, error count, status) in real-time to the client UI.

## Options Considered

### 1. WebSockets / Server-Sent Events (SSE)
* **Pros:** Real-time push communication.
* **Cons:** High architectural overhead. Setting up WebSockets or SSE requires configuring custom servers, subscription pools, and state management, which is excessive for a personal LMS app.

### 2. Database-Driven Progress Polling
* **Pros:** Extremely simple to implement and fits the existing architecture perfectly. The current app already uses a `Setting` database model to store settings.
* **Cons:** Overhead of database writes/reads during polling (mitigated by scanning in batches of 5 with a 1-second delay, which means we only update the DB once per second).

## Decision
We choose **Database-Driven Progress Polling**:
1. When starting a scan, the client calls a Server Action `runLinkScanner()`.
2. `runLinkScanner()` checks if a scan is already running. If not, it sets the scan status to `SCANNING` in the `Setting` table, zeroes out statistics, triggers `scanBrokenLinks()` asynchronously (without `await`ing it), and returns `{ success: true }` immediately.
3. As the scanner executes on the server in the background, it updates progress settings (`LINK_SCAN_PROCESSED`, `LINK_SCAN_FAILED`, `LINK_SCAN_PERCENTAGE`) in the database after each batch.
4. When finished, it sets `LINK_SCAN_STATUS` to `COMPLETED` (or `FAILED` if crashed), and saves the results.
5. The client polls a Server Action `getLinkScannerProgress()` every 1 second to fetch the progress status and updates the Progress Bar.

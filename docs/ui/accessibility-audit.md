# Accessibility Audit (WCAG AA Compliance)

This document contains the audit findings for LearnFlow's Light Theme, focusing on Typography sizes and Color Contrast ratios.

---

## 1. Typography Audit (Target: `text-[9px]`)

The WCAG guidelines recommend avoiding extremely small text sizes that impair readability. All text sizes under `10px` or `12px` are candidates for upgrading to a minimum of `text-[10px]` or `text-xs` (approx. `12px`).

### Affected Components & Occurrences

| Component / File | Line No. | Current Code Snippet | Recommended Change | Rationale |
| :--- | :---: | :--- | :--- | :--- |
| [PathCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathCard.tsx) | 73 | `text-[9px]` in Route Badge | `text-[10px]` | Badge labels need to be readable. |
| [PathCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathCard.tsx) | 124 | `text-[9px]` in course/resource counts | `text-[10px]` | Metadata info needs to be readable. |
| [PathCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathCard.tsx) | 139 | `text-[9px]` in "Thứ tự các khóa học:" header | `text-[10px]` | Group headings. |
| [PathCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathCard.tsx) | 151 | `text-[9px]` in numbering circle | `text-[10px]` | Index circular badge. |
| [TodayTasks.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/dashboard/TodayTasks.tsx) | 114 | `text-[9px]` in course metadata badge | `text-[10px]` | Course tag badge text. |
| [TodayTasks.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/dashboard/TodayTasks.tsx) | 120 | `text-[9px]` in resource metadata badge | `text-[10px]` | Resource tag badge text. |
| [OpportunityCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/opportunity/OpportunityCard.tsx) | 57, 64, 71 | `text-[9px]` in Status Badges (`OPEN`, `APPLIED`, `CLOSED`) | `text-[10px]` | Status labels. |
| [OpportunityCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/opportunity/OpportunityCard.tsx) | 87, 92 | `text-[9px]` in Opportunity Type Badges | `text-[10px]` | Type labels. |
| [page.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/app/courses/%5Bid%5D/page.tsx) | 224 | `text-[9px]` in resource status badge | `text-[10px]` | Status badge inside course. |

---

## 2. Contrast Audit (Target: `text-slate-400` on Light Backgrounds)

Standard `text-slate-400` (Hex `#94A3B8`) has a contrast ratio of **2.5:1** on a white background (`#FFFFFF`), which is below the WCAG AA minimum requirement of **4.5:1** for body text and **3.0:1** for large text/ui elements.

We propose migrating to:
- `text-slate-500` (Hex `#64748B`, contrast ratio **4.5:1** on white) for body copy/descriptions.
- `text-slate-600` (Hex `#475569`, contrast ratio **6.1:1** on white) for critical labels, small metadata, and headers.

### Primary Candidates for Refactoring

| File | Line | Snippet | Context | Recommended Change |
| :--- | :---: | :--- | :--- | :--- |
| [APIKeyForm.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/settings/APIKeyForm.tsx) | 95 | `<p className="text-[10px] text-slate-400 font-medium">` | Help description text on card bg | `text-slate-500` |
| [PathsPageClient.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathsPageClient.tsx) | 56 | `<p className="text-slate-400 text-[10px] font-semibold mt-0.5">` | Header description text | `text-slate-500` |
| [PathManager.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathManager.tsx) | 178 | `<p className="text-[10px] text-slate-400 font-semibold italic ...">` | Italicized helper block | `text-slate-500` |
| [PathCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathCard.tsx) | 124 | `text-slate-400` | Course/resource counts | `text-slate-500` |
| [PathCard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/path/PathCard.tsx) | 139 | `text-slate-400` | "Thứ tự các khóa học:" header | `text-slate-600` |
| [OpportunitiesPageClient.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/opportunity/OpportunitiesPageClient.tsx) | 41 | `<p className="text-slate-400 text-[10px] font-semibold mt-0.5">` | Header description text | `text-slate-500` |
| [InboxManager.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/inbox/InboxManager.tsx) | 117 | `<span className="text-xs font-semibold text-slate-400">` | Date / Time of inbox item | `text-slate-500` |
| [InboxManager.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/inbox/InboxManager.tsx) | 130 | `text-slate-400 hover:text-[#0056D2]` | Quick action label | `text-slate-500` |
| [TodayTasks.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/dashboard/TodayTasks.tsx) | 85 | `text-slate-400` | Empty state desc | `text-slate-500` |
| [KanbanBoard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/course/KanbanBoard.tsx) | 44 | `text-slate-400` | Loading state text | `text-slate-500` |
| [KanbanBoard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/course/KanbanBoard.tsx) | 128 | `text-slate-400 font-medium` | Drag-n-drop helper message | `text-slate-500` |
| [KanbanBoard.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/course/KanbanBoard.tsx) | 160 | `text-slate-400` | Column title metadata | `text-slate-600` |
| [CourseTable.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/course/CourseTable.tsx) | 156 | `text-slate-400 font-medium` | Empty table text | `text-slate-500` |
| [CourseTable.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/course/CourseTable.tsx) | 169 | `text-slate-400 mt-0.5` | Sub-resource short desc | `text-slate-500` |
| [CourseTable.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/components/course/CourseTable.tsx) | 189 | `text-slate-400` | Course resource count text | `text-slate-500` |
| [page.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/app/page.tsx) | 176 | `text-slate-400` | Dashboard stat card subtext | `text-slate-500` |
| [page.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/app/page.tsx) | 223 | `text-slate-400` | Dashboard stat card subtext | `text-slate-500` |
| [page.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/app/page.tsx) | 241 | `text-slate-400` | Streak unit "ngày" label | `text-slate-600` |
| [page.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/app/page.tsx) | 243 | `text-slate-400` | Dashboard stat card subtext | `text-slate-500` |
| [page.tsx](file:///c:/Users/asus/Downloads/LearnFlow/personal-lms/src/app/page.tsx) | 266 | `text-slate-400` | Help message inside button | `text-slate-500` |

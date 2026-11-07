# Profile README Setup

1. Ensure your public profile repository is named exactly `tejasrawool186`.
2. Copy `README.md`, `assets/`, `scripts/`, and `.github/workflows/` into your repository root.
3. Commit and push to `main`.
4. Open **Actions → Update Contribution City → Run workflow** if you want to refresh it manually.
5. The workflow refreshes `assets/city.svg` after pushes to `main` and daily at 00:23 UTC (05:53 IST).
6. The generator reads the public GitHub contribution calendar and requires an exact tooltip count for every day; if GitHub's page cannot be read completely, it keeps the previous SVG and marks the workflow as failed instead of writing estimated counts.

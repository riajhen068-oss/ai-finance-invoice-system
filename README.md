# AI Finance & Invoice Management System

A working portfolio prototype for supplier invoice tracking and review.

## Features
- Dashboard with invoice counts and totals
- Invoice list with search and status filtering
- Add invoice form with validation
- Review queue with approve and request-changes actions
- Demo invoice extraction workflow using clearly labeled sample data
- Browser localStorage persistence

## Run locally
Open `index.html` in a modern browser. No installation or build step is required.

## Important scope note
This is a frontend prototype. The AI extraction is simulated with sample data. It does not connect to Azure AI Document Intelligence, MYOB, PostgreSQL, or any live accounting system. Do not present the simulated integrations as completed production integrations.

## Suggested next steps
1. Add a TypeScript/Node.js API.
2. Add PostgreSQL persistence and migrations.
3. Implement authentication and role-based access.
4. Connect Azure AI Document Intelligence using secure server-side credentials.
5. Connect MYOB through its official OAuth/API flow.
6. Add automated tests and CI/CD.

## Tech
HTML, CSS, and vanilla JavaScript for this first runnable prototype.

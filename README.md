# Lifestyle Balance Board

Track whether my lifestyle is balanced across my own key areas: meditation, strength, cardio, recovery, nutrition, and mobility.

## What it does

-   Shows if each habit area is on track and balanced
-   Keeps daily/weekly checks simple and focused

## Tech & Deployment

-   Frontend: Vite app on Azure Static Web Apps (SWA)
-   Backend: Node.js/Express container on Azure Container Apps (ACA)
-   Database: PostgreSQL on Neon (EU region)
-   Cache/Queues: Redis (redis.io / Upstash / Redis Cloud)
-   Dev workflow: Docker

## Dev (Docker)

```bash
docker compose up --build
```

# beer-tracker

Personal home beer inventory and consumption tracker.

**Stack:** Go + Gin + GORM (SQLite) · React + Vite

## Features

- **Beer catalog** — add beers with name, brewery, style, ABV, IBU, description
- **Inventory** — track bottles/cans on hand with purchase date and price
- **Consumption log** — log drinks with 1–5 star ratings and notes
- **Stats dashboard** — totals, average rating, favourite beer

## Setup

**Requirements:** Go 1.22+, Node.js 18+

```bash
make install   # go mod tidy + npm install
```

## Run

```bash
make dev       # starts backend :8080 and frontend :3000 concurrently
```

Or separately:

```bash
make backend   # Go API on http://localhost:8080
make frontend  # React app on http://localhost:3000
```

The SQLite database (`backend/beer_tracker.db`) is created automatically on first run.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET/POST | `/api/beers` | List (search `?q=`) / Create |
| GET/PUT/DELETE | `/api/beers/:id` | Get / Update / Delete |
| GET/POST | `/api/inventory` | List (filter `?beer_id=`) / Create |
| GET/PUT/DELETE | `/api/inventory/:id` | Get / Update / Delete |
| GET/POST | `/api/consumption` | List / Log a drink |
| GET/DELETE | `/api/consumption/:id` | Get / Delete |
| GET | `/api/stats` | Aggregated stats |

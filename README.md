# Netflix Clone API

A scalable REST API for a Netflix-style streaming platform built with Node.js, Express, and MongoDB.

## Features

- **JWT Authentication** - Register, login, role-based access (user/admin)
- **Movies & TV Shows** - Full CRUD with admin authorization
- **Trending, Popular, Top-Rated, Upcoming** - Curated content endpoints
- **Search** - Search by title, genre, or release year
- **Genres** - Manage genre categories
- **Watchlist** - Add/remove content for authenticated users
- **Pagination & Filtering** - Sort, filter by genre/category/year
- **Input Validation** - express-validator on all inputs
- **Centralized Error Handling** - Consistent error responses
- **Swagger Documentation** - Interactive API docs at `/api-docs`

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Auth**: JSON Web Tokens (JWT)
- **Validation**: express-validator
- **Documentation**: Swagger (swagger-jsdoc + swagger-ui-express)

## Project Structure

```
netflix-clone-api/
├── server.js                  # Entry point
├── seed.js                    # Database seeder
├── package.json
├── .env.example
├── src/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js
│   │   ├── Movie.js
│   │   ├── TVShow.js
│   │   ├── Genre.js
│   │   └── Watchlist.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── movies.js
│   │   ├── tvshows.js
│   │   ├── genres.js
│   │   ├── watchlist.js
│   │   ├── search.js
│   │   └── content.js
│   └── middleware/
│       ├── auth.js            # JWT protect & authorize
│       ├── validate.js        # Input validation
│       └── errorHandler.js    # Centralized error handler
```

## Setup Instructions

### Prerequisites

- Node.js (v16+)
- MongoDB (local or Atlas)

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/netflix-clone-api.git
cd netflix-clone-api
npm install
```

### Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/netflix-clone
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Seed Database

```bash
node seed.js
```

This creates:
- 10 genres
- 10 movies (trending, popular, top-rated, upcoming)
- 6 TV shows
- Admin account: `admin@netflix.com` / `admin123`
- User account: `john@netflix.com` / `user123`

### Run

```bash
# Development
npm run dev

# Production
npm start
```

API runs at `http://localhost:5000`
Swagger docs at `http://localhost:5000/api-docs`

## API Endpoints

### Authentication

| Method | Endpoint              | Description         | Auth     |
| ------ | --------------------- | ------------------- | -------- |
| POST   | `/api/auth/register`  | Register new user   | No       |
| POST   | `/api/auth/login`     | Login user          | No       |
| GET    | `/api/auth/me`        | Get current user    | Bearer   |

### Movies

| Method | Endpoint          | Description                   | Auth   |
| ------ | ----------------- | ----------------------------- | ------ |
| GET    | `/api/movies`     | Get all movies (paginated)    | No     |
| GET    | `/api/movies/:id` | Get single movie              | No     |
| POST   | `/api/movies`     | Create movie                  | Admin  |
| PUT    | `/api/movies/:id` | Update movie                  | Admin  |
| DELETE | `/api/movies/:id` | Delete movie                  | Admin  |

**Query params**: `page`, `limit`, `genre`, `category`, `year`, `sort` (rating|releaseYear|title|createdAt), `order` (asc|desc)

### TV Shows

| Method | Endpoint           | Description                    | Auth   |
| ------ | ------------------ | ------------------------------ | ------ |
| GET    | `/api/tvshows`     | Get all TV shows (paginated)   | No     |
| GET    | `/api/tvshows/:id` | Get single TV show             | No     |
| POST   | `/api/tvshows`     | Create TV show                 | Admin  |
| PUT    | `/api/tvshows/:id` | Update TV show                 | Admin  |
| DELETE | `/api/tvshows/:id` | Delete TV show                 | Admin  |

### Genres

| Method | Endpoint         | Description    | Auth   |
| ------ | ---------------- | -------------- | ------ |
| GET    | `/api/genres`    | Get all genres | No     |
| GET    | `/api/genres/:id`| Get genre      | No     |
| POST   | `/api/genres`    | Create genre   | Admin  |
| PUT    | `/api/genres/:id`| Update genre   | Admin  |
| DELETE | `/api/genres/:id`| Delete genre   | Admin  |

### Content (Trending/Popular/etc.)

| Method | Endpoint                  | Description                | Auth |
| ------ | ------------------------- | -------------------------- | ---- |
| GET    | `/api/content/trending`   | Get trending content       | No   |
| GET    | `/api/content/popular`    | Get popular content        | No   |
| GET    | `/api/content/top-rated`  | Get top-rated content      | No   |
| GET    | `/api/content/upcoming`   | Get upcoming content       | No   |

### Search

| Method | Endpoint      | Description                          | Auth |
| ------ | ------------- | ------------------------------------ | ---- |
| GET    | `/api/search` | Search by title, genre, or year      | No   |

**Query params**: `q` (text search), `genre` (genre ID), `year`, `type` (movie|tvshow|all), `page`, `limit`

### Watchlist

| Method | Endpoint              | Description                  | Auth   |
| ------ | --------------------- | ---------------------------- | ------ |
| GET    | `/api/watchlist`      | Get user's watchlist         | Bearer |
| POST   | `/api/watchlist`      | Add to watchlist             | Bearer |
| DELETE | `/api/watchlist/:id`  | Remove from watchlist        | Bearer |

## Database Schema

### User
| Field    | Type   | Notes                    |
| -------- | ------ | ------------------------ |
| name     | String | Required, max 50 chars   |
| email    | String | Required, unique, email  |
| password | String | Required, min 6, hashed  |
| role     | String | "user" or "admin"        |
| avatar   | String | Optional                 |

### Movie
| Field          | Type     | Notes                           |
| -------------- | -------- | ------------------------------- |
| title          | String   | Required, text indexed          |
| description    | String   | Required, max 2000 chars        |
| releaseYear    | Number   | Required                        |
| duration       | Number   | Required (minutes)              |
| rating         | Number   | 0-10                            |
| poster         | String   | Image URL                       |
| backdrop       | String   | Image URL                       |
| trailer        | String   | Video URL                       |
| genres         | [Ref]    | Reference to Genre              |
| category       | String   | action, comedy, drama, etc.     |
| maturityRating | String   | G, PG, PG-13, R, NC-17         |
| isTrending     | Boolean  | Flag for trending section       |
| isPopular      | Boolean  | Flag for popular section        |
| isTopRated     | Boolean  | Flag for top-rated section      |
| isUpcoming     | Boolean  | Flag for upcoming section       |
| cast           | [String] | Actor names                     |
| director       | String   | Director name                   |
| language       | String   | Default: "English"              |

### TVShow
Same as Movie with `numberOfSeasons` and `status` (ongoing/ended/cancelled) replacing `duration` and `isUpcoming`.

### Genre
| Field | Type   | Notes             |
| ----- | ------ | ----------------- |
| name  | String | Required, unique  |
| slug  | String | Auto-generated    |

### Watchlist
| Field           | Type   | Notes                              |
| --------------- | ------ | ---------------------------------- |
| user            | Ref    | Reference to User                  |
| contentType     | String | "movie" or "tvshow"                |
| contentId       | Ref    | Reference to Movie or TVShow       |
| contentTypeModel| String | "Movie" or "TVShow" (Mongoose ref) |

## ER Diagram

```
┌─────────┐       ┌────────────┐       ┌─────────┐
│  User   │──1:N──│ Watchlist  │──N:1──│  Movie  │
│         │       │            │       │         │
│ - name  │       │ - user     │       │ - title │
│ - email │       │ - content  │       │ - year  │
│ - role  │       │   Type     │       │ - rating│
└─────────┘       │ - contentId│       │ - genres│──N:1──┌───────┐
                  └────────────┘       └─────────┘       │ Genre │
                                                         │ - name│
                  ┌────────────┐       ┌─────────┐       │ - slug│
                  │ Watchlist  │──N:1──│ TVShow  │       └───────┘
                  │ (tvshow)   │       │         │
                  └────────────┘       │ - title │
                                       │ - seasons│
                                       │ - rating│
                                       │ - genres│──N:1──│ Genre │
                                       └─────────┘
```

## License

MIT

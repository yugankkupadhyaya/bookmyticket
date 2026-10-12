# BookMyTicket API Reference

Base URL:

```text
http://localhost:3000/mba/api/v1
```

Movie and theatre IDs are PostgreSQL UUIDs, for example:

```text
645a1a5c-caa8-492b-bf40-25bb0ab26493
```

All endpoints return this general response shape:

```json
{
  "success": true,
  "error": {},
  "message": "...",
  "data": {}
}
```

## Pagination

List endpoints accept `page` and `limit` query parameters:

```text
?page=1&limit=10
```

## User validation

User request validation is handled with Zod middleware:

- `validateUserRegistration` validates name, email, and password.
- `validateUserLogin` validates email and password.
- `validateUserUpdate` validates optional profile fields and requires at least one field.

Validation failures return HTTP `400` with field-level messages. Passwords must be between 8 and 72 characters, `confirmPassword` must match `password`, and emails are normalized to lowercase. `confirmPassword` is validation-only and should not be stored.

Defaults are `page=1` and `limit=10`. The maximum limit is `100`.

Paginated responses include:

```json
"pagination": {
  "page": 1,
  "limit": 10,
  "total": 25,
  "totalPages": 3,
  "hasNextPage": true,
  "hasPreviousPage": false
}
```

## Health check

### `GET /`

Returns:

```text
BookMyTicket server is running
```

## Movie endpoints

### `POST /movies`

Creates a movie.

Required body fields:

```json
{
  "name": "Inception",
  "description": "A skilled extractor enters dreams.",
  "trailerUrl": "https://www.youtube.com/watch?v=YoHD9XEInc0",
  "language": "English",
  "releaseStatus": "Released",
  "casts": ["Leonardo DiCaprio", "Joseph Gordon-Levitt"]
}
```

Controller: `createMovie`

### `GET /movies`

Returns paginated movies.

```text
GET /movies?page=1&limit=10
```

Controller: `getAllMovies`

### `GET /movies/search`

Searches movies and includes all theatres showing each result.

Fuzzy name search:

```text
GET /movies/search?q=Inceptin&page=1&limit=10
```

Exact ID search:

```text
GET /movies/search?movieId=cf5650d0-2e4b-451b-be5f-a1f609ca77c3
```

`name` can also be used instead of `q`. `id` can also be used instead of `movieId`.

Controller: `searchMovies`

### `GET /movies/filter`

Fuzzy-filters movies by name. It also accepts exact `movieId` or `id` filtering.

```text
GET /movies/filter?name=dark&page=1&limit=10
GET /movies/filter?movieId=645a1a5c-caa8-492b-bf40-25bb0ab26493
```

Controller: `getMoviesByFilter`

### `GET /movies/:id`

Returns one movie by MongoDB ObjectId.

```text
GET /movies/645a1a5c-caa8-492b-bf40-25bb0ab26493
```

Controller: `getMovieById`

### `GET /movies/:id/theatres`

Returns all theatres where a movie is available.

```text
GET /movies/645a1a5c-caa8-492b-bf40-25bb0ab26493/theatres?page=1&limit=10
```

Controller: `getTheatresByMovie`

### `PUT /movies/:id`

Updates a movie.

```json
{
  "name": "Inception",
  "description": "Updated description",
  "trailerUrl": "https://example.com/trailer",
  "language": "English",
  "releaseStatus": "Released"
}
```

Controller: `updateMovieById`

### `DELETE /movies/:id`

Deletes a movie by ID.

Controller: `deleteMovieById`

## Theatre endpoints

### `POST /theatres`

Creates a theatre.

Required body fields:

```json
{
  "name": "PVR ICON Mumbai",
  "description": "Premium multiplex",
  "pincode": 400013,
  "address": "High Street Phoenix, Lower Parel",
  "city": "Mumbai",
  "rating": 4.5
}
```

Controller: `createTheatreController`

### `GET /theatres`

Returns paginated theatres.

```text
GET /theatres?page=1&limit=10
```

Controller: `getAllTheatresController`

### `GET /theatres/filter`

Filters theatres by pincode, city, or name. City and name use fuzzy matching.

```text
GET /theatres/filter?city=Mumbai&page=1&limit=10
GET /theatres/filter?name=PVR
GET /theatres/filter?pincode=400013
```

Controller: `getTheatresByFilterController`

### `GET /theatres/search`

Searches by one flexible `q` value. Theatre name and city use fuzzy matching; pincode uses exact matching.

```text
GET /theatres/search?q=mumb&page=1&limit=10
GET /theatres/search?q=PVR
GET /theatres/search?q=400013
```

Controller: `searchTheatresController`

### `GET /theatres/rating`

Returns theatres with a rating greater than or equal to `minRating`.

```text
GET /theatres/rating?minRating=4&page=1&limit=10
```

`minRating` must be between `0` and `5`.

Controller: `getTheatresByRatingController`

### `GET /theatres/:id`

Returns one theatre by MongoDB ObjectId.

Controller: `getTheatreByIdController`

### `PUT /theatres/:id`

Updates a theatre.

```json
{
  "name": "PVR ICON Mumbai",
  "description": "Updated description",
  "pincode": 400013,
  "address": "High Street Phoenix, Lower Parel",
  "city": "Mumbai",
  "rating": 4.6
}
```

Controller: `updateTheatreController`

### `DELETE /theatres/:id`

Deletes a theatre by ID.

Controller: `deleteTheatreController`

### `PATCH /theatres/:id/movies`

Adds or removes movies from a theatre. This updates both `theatre.movies` and `movie.theatres`.

Add movies:

```json
{
  "movieIds": [
    "645a1a5c-caa8-492b-bf40-25bb0ab26493",
    "cf5650d0-2e4b-451b-be5f-a1f609ca77c3"
  ],
  "insert": true
}
```

Remove movies:

```json
{
  "movieIds": ["645a1a5c-caa8-492b-bf40-25bb0ab26493"],
  "insert": false
}
```

Controller: `updateMovieInTheatreController`

### `GET /theatres/:id/movies`

Returns all movies currently showing in a theatre.

```text
GET /theatres/a169cab6-76ee-4978-a91c-7b583dfe777e/movies?page=1&limit=10
```

Controller: `getMoviesByTheatreController`

### `GET /theatres/:id/movies/:movieId`

Checks whether a movie is available in a theatre.

```text
GET /theatres/a169cab6-76ee-4978-a91c-7b583dfe777e/movies/645a1a5c-caa8-492b-bf40-25bb0ab26493
```

Response when the movie is available:

```json
{
  "success": true,
  "data": {
    "theatreId": "a169cab6-76ee-4978-a91c-7b583dfe777e",
    "movieId": "645a1a5c-caa8-492b-bf40-25bb0ab26493",
    "available": true
  }
}
```

Controller: `checkMovieInTheatreController`

## Main controller functions

### Movie controller

- `createMovie` — creates a movie.
- `getAllMovies` — returns paginated movies.
- `searchMovies` — fuzzy/ID search with theatre details.
- `getMoviesByFilter` — filters movies by name or ID.
- `getMovieById` — returns one movie.
- `getTheatresByMovie` — returns theatres showing a movie.
- `updateMovieById` — updates a movie.
- `deleteMovieById` — deletes a movie.

### Theatre controller

- `createTheatreController` — creates a theatre.
- `getAllTheatresController` — returns paginated theatres.
- `getTheatresByFilterController` — filters theatres.
- `getTheatresByRatingController` — filters by minimum rating.
- `getTheatreByIdController` — returns one theatre.
- `getMoviesByTheatreController` — returns movies in a theatre.
- `updateMovieInTheatreController` — adds/removes movies and synchronizes both models.
- `updateTheatreController` — updates a theatre.
- `deleteTheatreController` — deletes a theatre.

## Main service functions

### Movie service

- `getMovieByIdService`
- `fetchMovies`
- `fetchMoviesWithTheatres`
- `fetchTheatresByMovie`
- `updateMovie`

### Theatre service

- `createTheatre`
- `fetchTheatres`
- `fetchTheatresByFilter`
- `searchTheatres`
- `fetchTheatresByRating`
- `getTheatreById`
- `updateTheatre`
- `deleteTheatre`
- `fetchMoviesByTheatre`
- `updateMovieInTheatre`

## Data relationships

Movies store theatre IDs in `movie.theatres`.

Theatres store movie IDs in `theatre.movies`.

Use `PATCH /theatres/:id/movies` to modify availability so both arrays stay synchronized.

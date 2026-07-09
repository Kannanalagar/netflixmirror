#!/bin/bash
cd /workspaces/netflixmirror

echo "=== Starting Netflix Clone API Demo ==="
echo ""

# Kill any existing processes on port 5000
lsof -ti:5000 | xargs kill -9 2>/dev/null
sleep 1

# Start server
echo "Starting server..."
node server.js &
SERVER_PID=$!
sleep 3

echo ""
echo "========================================="
echo " 1. HEALTH CHECK"
echo "========================================="
curl -s http://localhost:5000/api/health | python3 -m json.tool

echo ""
echo "========================================="
echo " 2. ADMIN LOGIN"
echo "========================================="
ADMIN_RESPONSE=$(curl -s http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"admin@netflix.com","password":"admin123"}')
echo "$ADMIN_RESPONSE" | python3 -m json.tool
ADMIN_TOKEN=$(echo "$ADMIN_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo ""
echo "========================================="
echo " 3. USER LOGIN"
echo "========================================="
USER_RESPONSE=$(curl -s http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d '{"email":"john@netflix.com","password":"user123"}')
echo "$USER_RESPONSE" | python3 -m json.tool
USER_TOKEN=$(echo "$USER_RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo ""
echo "========================================="
echo " 4. GET ALL MOVIES (with pagination)"
echo "========================================="
curl -s "http://localhost:5000/api/movies?page=1&limit=3" | python3 -m json.tool

echo ""
echo "========================================="
echo " 5. GET TRENDING CONTENT"
echo "========================================="
curl -s http://localhost:5000/api/content/trending | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'trending_movies': [m['title'] for m in data['data']['movies']],
    'trending_tvshows': [t['title'] for t in data['data']['tvshows']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 6. GET POPULAR CONTENT"
echo "========================================="
curl -s http://localhost:5000/api/content/popular | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'popular_movies': [m['title'] for m in data['data']['movies']],
    'popular_tvshows': [t['title'] for t in data['data']['tvshows']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 7. GET TOP-RATED CONTENT"
echo "========================================="
curl -s http://localhost:5000/api/content/top-rated | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'top_rated_movies': [m['title'] for m in data['data']['movies']],
    'top_rated_tvshows': [t['title'] for t in data['data']['tvshows']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 8. GET UPCOMING CONTENT"
echo "========================================="
curl -s http://localhost:5000/api/content/upcoming | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'upcoming_movies': [m['title'] for m in data['data']['movies']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 9. SEARCH BY TITLE"
echo "========================================="
curl -s "http://localhost:5000/api/search?q=dark" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'total_results': data['total'],
    'results': [{'title': r['title'], 'type': r['_type']} for r in data['data']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 10. SEARCH BY YEAR"
echo "========================================="
curl -s "http://localhost:5000/api/search?year=2010" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'total_results': data['total'],
    'results': [{'title': r['title'], 'type': r['_type']} for r in data['data']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 11. GET ALL GENRES"
echo "========================================="
curl -s http://localhost:5000/api/genres | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'count': data['count'],
    'genres': [g['name'] for g in data['data']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 12. ADD TO WATCHLIST"
echo "========================================="
# Get first movie ID
MOVIE_ID=$(curl -s "http://localhost:5000/api/movies?limit=1" | python3 -c "import sys,json; print(json.load(sys.stdin)['data'][0]['_id'])")
echo "Adding movie $MOVIE_ID to watchlist..."
curl -s http://localhost:5000/api/watchlist -H "Content-Type: application/json" -H "Authorization: Bearer $USER_TOKEN" -d "{\"contentType\":\"movie\",\"contentId\":\"$MOVIE_ID\"}" | python3 -m json.tool

echo ""
echo "========================================="
echo " 13. GET USER'S WATCHLIST"
echo "========================================="
curl -s http://localhost:5000/api/watchlist -H "Authorization: Bearer $USER_TOKEN" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'count': data['count'],
    'items': [{'title': w['contentId']['title'], 'type': w['contentType']} for w in data['data']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 14. FILTER MOVIES BY CATEGORY"
echo "========================================="
curl -s "http://localhost:5000/api/movies?category=action" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'count': data['count'],
    'action_movies': [m['title'] for m in data['data']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 15. SORT MOVIES BY RATING (DESC)"
echo "========================================="
curl -s "http://localhost:5000/api/movies?sort=rating&order=desc&limit=5" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'top_movies_by_rating': [{'title': m['title'], 'rating': m['rating']} for m in data['data']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 16. GET SINGLE MOVIE"
echo "========================================="
curl -s "http://localhost:5000/api/movies/$MOVIE_ID" | python3 -c "
import sys, json
data = json.load(sys.stdin)
m = data['data']
print(json.dumps({
    'success': data['success'],
    'movie': {
        'title': m['title'],
        'description': m['description'][:100] + '...',
        'year': m['releaseYear'],
        'rating': m['rating'],
        'duration': str(m['duration']) + ' min',
        'category': m['category'],
        'director': m['director'],
        'cast': m['cast']
    }
}, indent=2))
"

echo ""
echo "========================================="
echo " 17. GET TV SHOWS"
echo "========================================="
curl -s "http://localhost:5000/api/tvshows?limit=3" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'success': data['success'],
    'count': data['count'],
    'tvshows': [{'title': t['title'], 'seasons': t['numberOfSeasons'], 'rating': t['rating']} for t in data['data']]
}, indent=2))
"

echo ""
echo "========================================="
echo " 18. GET CURRENT USER"
echo "========================================="
curl -s http://localhost:5000/api/auth/me -H "Authorization: Bearer $USER_TOKEN" | python3 -m json.tool

echo ""
echo "========================================="
echo " 19. SWAGGER DOCS"
echo "========================================="
echo "Available at: http://localhost:5000/api-docs"
curl -s -o /dev/null -w "Swagger UI HTTP Status: %{http_code}\n" http://localhost:5000/api-docs

echo ""
echo "========================================="
echo "  ALL DEMOS COMPLETE!"
echo "========================================="

# Clean up
kill $SERVER_PID 2>/dev/null

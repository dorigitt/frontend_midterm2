const API_KEY = '66633bcf8d5a4bfa2ddcb13b2790a28a';
const API_BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const searchInput = document.getElementById('search');
const moviesGrid = document.getElementById('movies-grid');
const watchlistSection = document.getElementById('watchlist');

function loadWatchlist() {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    renderMovies(watchlist, watchlistSection);
}

function renderMovies(movies, container) {
    container.innerHTML = '';
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${IMAGE_BASE_URL + movie.poster_path}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p>Release Date: ${movie.release_date}</p>
            <button onclick="addToWatchlist(${movie.id})">Add to watchlist</button>
        `;
        container.appendChild(movieCard);
    });
}

function addToWatchlist(movieId) {
    const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    const movie = currentMovies.find(m => m.id === movieId);
    if (!watchlist.some(m => m.id === movieId)) {
        watchlist.push(movie);
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        loadWatchlist();
    }
}

async function searchMovies(query) {
    try {
        const response = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`);
        const data = await response.json();
        currentMovies = data.results;
        renderMovies(currentMovies, moviesGrid);
    } catch (error) {
        console.error('Error searching for movies:', error);
    }
}

searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        searchMovies(query);
    } else {
        moviesGrid.innerHTML = '';
    }
});

let currentMovies = [];
loadWatchlist();
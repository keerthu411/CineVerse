import { useEffect, useState } from "react";
import "./App.css";

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

function App() {
  const [searchTerm, setSearchTerm] = useState("avengers");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  const searchMovies = async (movieName) => {
    if (!movieName.trim()) {
      setError("Please enter a movie name.");
      setMovies([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&s=${movieName}`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setMovies(data.Search);
      } else {
        setMovies([]);
        setError(data.Error || "No movies found.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const getMovieDetails = async (imdbID) => {
    setSelectedMovie(imdbID);
    setDetailsLoading(true);
    setMovieDetails(null);

    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`
      );

      const data = await response.json();

      if (data.Response === "True") {
        setMovieDetails(data);
      }
    } catch (err) {
      setMovieDetails(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchMovies(searchTerm);
  };

  const closeModal = () => {
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  useEffect(() => {
    searchMovies(searchTerm);
  }, []);

  return (
    <div className="app">
      <header className="hero">
        <nav className="navbar">
          <h1 className="logo">CineVerse</h1>
          <p className="tagline">Movie Search Library</p>
        </nav>

        <div className="hero-content">
          <h2>Discover Movies, Series & More</h2>
          <p>
            Search your favorite movies and explore details like rating, plot,
            genre, actors, and release year.
          </p>

          <form className="search-box" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search movies like Batman, Avatar, Avengers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </header>

      <main className="movie-section">
        <div className="section-title">
          <h2>Movie Results</h2>
          <p>Click any movie card to view more details.</p>
        </div>

        {loading && <p className="message">Loading movies...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="movie-grid">
            {movies.map((movie) => (
              <div
                className="movie-card"
                key={movie.imdbID}
                onClick={() => getMovieDetails(movie.imdbID)}
              >
                <img
                  src={
                    movie.Poster !== "N/A"
                      ? movie.Poster
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movie.Title}
                />

                <div className="movie-info">
                  <h3>{movie.Title}</h3>
                  <p>{movie.Year}</p>
                  <span>{movie.Type}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>

            {detailsLoading && <p className="message">Loading details...</p>}

            {movieDetails && (
              <div className="modal-content">
                <img
                  src={
                    movieDetails.Poster !== "N/A"
                      ? movieDetails.Poster
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={movieDetails.Title}
                />

                <div className="details">
                  <h2>{movieDetails.Title}</h2>
                  <p className="rating">IMDb Rating: {movieDetails.imdbRating}</p>

                  <p>
                    <strong>Year:</strong> {movieDetails.Year}
                  </p>
                  <p>
                    <strong>Genre:</strong> {movieDetails.Genre}
                  </p>
                  <p>
                    <strong>Runtime:</strong> {movieDetails.Runtime}
                  </p>
                  <p>
                    <strong>Actors:</strong> {movieDetails.Actors}
                  </p>
                  <p>
                    <strong>Plot:</strong> {movieDetails.Plot}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <footer>
        <p>© 2026 CineVerse | Built with React and OMDb API</p>
      </footer>
    </div>
  );
}

export default App;
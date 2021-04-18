const MovieDB = require('node-themoviedb');
const mdb = new MovieDB(process.env.TMDB_TOKEN);

module.exports = async id => {
    const args = { pathParameters: { movie_id: id } };
    const movie = await mdb.movie.getDetails(args);

    let genres = ``, production_companies = ``, spoken_languages = ``, backdrop_path, url = ``, runtime = `NA.`;

    movie.data.genres.forEach(g => genres +=  g.name + ` | `);
    movie.data.production_companies.forEach(p => production_companies += " " + p.name + " | " );
    movie.data.spoken_languages.forEach(l => spoken_languages += " " + l.english_name + " | " );

    if(movie.data.belongs_to_collection) backdrop_path = `https://image.tmdb.org/t/p/w500${movie.data.belongs_to_collection.backdrop_path}`;

    if(movie.data.imdb_id) url += `https://www.imdb.com/title/${movie.data.imdb_id}/`;
    else url += `https://www.themoviedb.org/movie/${movie.data.id}`;

    if(movie.data.runtime !== null) runtime = movie.data.runtime + ' min.';

    return {
        name: movie.data.original_title,
        url: url,
        vote: movie.data.vote_average,
        runtime: runtime,
        status: movie.data.status,
        date: movie.data.release_date,
        genres: genres,
        languages: spoken_languages,
        tagline: movie.data.tagline,
        overview: movie.data.overview,
        companies: production_companies,
        poster: "https://image.tmdb.org/t/p/w500" + movie.data.poster_path,
        image: backdrop_path
    }
}
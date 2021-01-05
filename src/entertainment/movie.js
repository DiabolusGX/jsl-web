require("dotenv").config();
const MovieDB = require('node-themoviedb');
const mdb = new MovieDB(process.env.TMDB_TOKEN);

module.exports = async (req, res) => {
    if(req.body.action === "searchMovie") {
        if(!req.body.movieName) return resRenderErr(req, res, "<b>ERROR :</b> <br> Please enter a valid movie name!");
        const moviedb = require("../../movie_ids.json");
        // Sort on basis of popularity!
        //moviedb.sort((a, b) => parseInt(a.popularity) - parseInt(b.popularity));
        const movieIds = [], movieNames = [];
        let result;
        moviedb.forEach(movie => {
            result = movie.original_title.match(new RegExp(req.body.movieName, "i"));
            if(result){
                movieIds.push(movie.id);
                movieNames.push(movie.original_title);
                result = null;
            }
        });
        if(movieIds.length === 0) return resRenderErr(req, res, "No movie found!<br>Make sure you entered the correct name.");
        else return resRenderErr(req, res, movieNames);
    }
}

const resRenderErr = (req, res, matching, info) => {
    let out1, out2;
    if(typeof(matching) === "string") out1 = `<div class="note"><p class="vertical font-weight-bold"> ${matching} </p></div>`;
    else{
        out1 = `<h1 class="heading">Found Movies :</h1><p>Work In Progress...</p>`;
        out1 += `<div class="note"><p class="vertical font-weight-bold">`;
        matching.forEach(movie => out1 += movie + "<br>");
        out1 += `</p></div>`;
    }
    if(typeof(info) === "string") out2 = `<div class="note"><p class="vertical font-weight-bold"> ${info} </p></div>`;
    
    return res.render("movie.ejs", {
        req: req,
        res: res,
        matchingMovies: out1,
        movieInfo: out2
    });
}
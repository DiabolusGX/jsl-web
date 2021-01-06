require("dotenv").config();

module.exports = async (req, res, query) => {
    if(query.id){
        const movieInfo = require("./movieInfo");
        const info = await movieInfo(req.query.id);
        return resRenderErr(req, res, "", info);
    }
    else if(req.body.action === "searchMovie") {
        if(!req.body.movieName) return resRenderErr(req, res, "<b>ERROR :</b> <br> Please enter a valid movie name!");
        const moviedb = require("../../movie_ids.json");
        // Sort on basis of popularity! !!! (NO NEED) !!!
        //moviedb.sort((a, b) => parseInt(a.popularity) - parseInt(b.popularity));
        const matchingMovies = [];
        let result;
        moviedb.forEach(movie => {
            result = movie.original_title.match(new RegExp(req.body.movieName, "i"));
            if(result){
                matchingMovies.push({ id: movie.id, name: movie.original_title });
                result = null;
            }
        });
        if(matchingMovies.length === 0) return resRenderErr(req, res, "No movie found!<br>Make sure you entered the correct name.");
        else return resRenderErr(req, res, matchingMovies.reverse());
    }
    else return resRenderErr(req, res, "", "");
}

const resRenderErr = (req, res, matching, info) => {
    let out;
    if(matching) {
        if(typeof(matching) === "string") out = `<div class="note"><p class="vertical font-weight-bold"> ${matching} </p></div>`;
        else {
            out = `<hr><div class="note">`;
            out += `<h1 class="heading centered">Found Movies :</h1> <div class="row centered">`;
            let count = 1;
            matching.every(movie => {
                out += `<div class="col-lg-6 info-card rounded">` +
                    `<h3> ${count++}. ${movie.name} </h3> <p> Id:<u>${movie.id}</u> </p>` +
                    `<a class="btn btn-outline-success" href="/movie?id=${movie.id}"> <i class="fas fa-info-circle"></i> Get Info. </a>` +
                    `<p></p>` +
                `</div>`;
                if(count > 6) return false;
                else return true;
            });
            out += `</div></div>`;
        }
    }
    else if(info) {
        if(typeof(info) === "string") out = `<div class="note"><p class="vertical font-weight-bold"> ${info} </p></div>`;
        else {
            // `<img class="img-thumbnail thumbnail position-absolute rounded-circle" alt="profile_pic" src="${info.poster}">` +
            out = `<hr><div class="note">` +
                `<h1> <a href="${info.url}" target="_blank"> ${info.name} </a> </h1>` +
                `<p>• Rating - ${info.vote} ⭐<br>• Time - ${info.runtime} 🎞️ </p>`+
                `<p>• ${info.status} - ${info.date} <br>• Genres - ${info.genres} <br> • Languages - ${info.languages} </p>` +
                `<p class="vertical"> 💬 - <i>${info.tagline}</i> </p>` +
                `<p class="vertical"> ${info.overview} </p>` +
                `<p class="font-italic"> ~ ${info.companies} </p>` +
                `<div class="centered"><img src="${info.poster}" alt="movie_poster"></div>` +
            `</div>`;
        }
    }
    else out = null;
    
    return res.render("movie.ejs", {
        req: req,
        res: res,
        movieInfo: out,
    });
}
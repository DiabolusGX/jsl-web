require("dotenv").config();
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);

const gameDetails = require("./gameDetails");

module.exports = async (req, res, game) => {

    if(!isNaN(game)) {
        steam.getGameDetails(game).then(async summary => { 

            const result = await gameDetails(summary);
            if(typeof(result) === "string") resRenderErr(result);
            else return res.render("steam.ejs", { 
                req: req, 
                res: res,
                steamInfo: `<div class="note">
                    <img class="img-thumbnail thumbnail position-absolute" src="${result.thumbnail}" alt="game_thumbnail">
                    <h1><a href="${result.url}">${result.name}</a></h1>
                    <p> Release Date - ${result.releaseDate} <br> Game ID - <u>${result.id}</u> </p> 
                    <p> Genres - ${result.genres} <br> Platform - ${result.platform}</p>
                    <p> ${result.review} </p> <p> ${result.pricing} </p>
                    <p class="vertical"> ${result.desc} </p>
                    <p class="font-italic"> ~ ${result.devs} </p>
                    <img class="screenshot" src="${result.fullImage}" alt="profile_sccreenshot">
                </div>` 
            });
        })
        .catch(err => {
            if(err){
                console.log(err);
                return resRenderErr(req, res, `There is no game with that Name or ID on Steam.`);
            }
        });
    }
    else {
        const steamdb = require('../../steamApps.json');
        const appNames = [];
        const pattern = new RegExp(game, "i");

        for(let i=steamdb.applist.apps.length - 1; i>0; i--){
            const result = steamdb.applist.apps[i].name.match(pattern);
            if(result) appNames.push({ id: steamdb.applist.apps[i].appid, name: steamdb.applist.apps[i].name });
        }
        if(appNames.length === 0) return resRenderErr(req, res, "No games found!<br>Make sure you entered the correct NAME or ID.");
        else return resRenderErr(req, res, appNames);
        //return resRenderErr(req, res, "Please use Game ID.<br>Search games by name is work in progress...");
    }
}

const resRenderErr = (req, res, matching) => {
    let out;
    if(matching) {
        if(typeof(matching) === "string") out = `<div class="note"><p class="vertical font-weight-bold"> ${matching}! </p></div>`;
        else {
            out = `<hr><div class="note">`;
            out += `<h1 class="heading centered">Top 6 matching games :</h1> <div class="row centered">`;
            let count = 1;
            matching.every(game => {
                out += `<div class="col-lg-6 info-card rounded">` +
                    `<h3> ${count++}. ${game.name} </h3> <p> Id:<u>${game.id}</u> </p>` +
                    `<a class="btn btn-outline-success" href="/steam?id=${game.id}"> <i class="fas fa-info-circle"></i> Get Info. </a>` +
                    `<p></p>` +
                `</div>`;
                if(count > 6) return false;
                else return true;
            });
            out += `</div></div>`;
        }
    }
    return res.render("steam.ejs", { 
        req: req, 
        res: res, 
        steamInfo: out
    });
}
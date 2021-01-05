require("dotenv").config();
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);

const gameDetails = require("./gameDetails");

module.exports = async (req, res, game) => {

    if(!isNaN(game)){
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
        return resRenderErr(req, res, "Please use Game ID.<br>Search games by name is work in progress...");
    }
}

const resRenderErr = (req, res, err) => {
    return res.render("steam.ejs", { 
        req: req, 
        res: res, 
        steamInfo: `<div class="note"><p class="vertical font-weight-bold"> ${err}! </p></div>` 
    });
}
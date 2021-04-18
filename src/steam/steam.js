require("dotenv").config();
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);

const searchProfile = require("./searchProfile");
const searchGame = require("./searchGame");

module.exports = steamModule = async (req, res) => {
    const { action } = req.body;

    if(action === "searchProfile") {
        let steamId, steamUrl;
        if(!req.body.inputSteamId || req.body.inputSteamId === "NA"){
            if(!req.body.userSteamId || req.body.userSteamId === "NA")
            return resRenderErr( req, res, `Please enter a valid Steam ID or URL`);
            else steamId = req.body.userSteamId;
        }
        else steamId = req.body.inputSteamId;
    
        if(isNaN(steamId) && steamId.startsWith("https://steamcommunity.com")) steamUrl = steamId;
        else steamUrl = "https://steamcommunity.com/id/" + steamId;
        steam.resolve(steamUrl).then(async id => {
            const result = await searchProfile(id);
            if(typeof(result) === "string") return resRenderErr(result);
            else return res.render("steam.ejs", {
                req: req,
                res: res,
                steamInfo: `<div class="note"> 
                    ${result.profilePic} ${result.userName} ${result.dateStats} ${result.banString} 
                    ${result.otherStats} ${result.profileScreenshot}
                </div>`
            });
        }).catch(err => {
            if (err) {
                console.log(err);
                return resRenderErr(req, res, `Please enter a valid Steam ID or URL`);
            }
        });
    }
    else if(action === "gameSearch" || req.query.id) {
        if(!req.body.game && !req.query.id) return resRenderErr(req, res, `Please enter a valid Game Name or Game ID`);
        const search = req.query.id ? req.query.id : req.body.game;
        searchGame(req, res, search);
    }
}

const resRenderErr = (req, res, err) => {
    return res.render("steam.ejs", { 
        req: req, 
        res: res, 
        steamInfo: `<div class="note"><p class="vertical font-weight-bold"> ${err}! </p></div>` 
    });
}
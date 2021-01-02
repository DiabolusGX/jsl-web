require("dotenv");
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);

const timeConverter = require("../scripts/timeConverter");
const profile = require("./profile");
const bans = require("./bans");
const badges = require("./badges");
const games = require("./ownedGames");
const friends = require("./friends");

module.exports = steamModule = (req, res) => {
    const { action } = req.body;
    let steamId, steamUrl;
    if(!req.body.inputSteamId || req.body.inputSteamId === "NA"){
        if(!req.body.userSteamId || req.body.userSteamId === "NA") return res.render("steam.ejs", { req: req, res: res, steamInfo: `<div class="vertical"> Please enter a valid Steam ID or URL</div>` });
        else steamId = req.body.userSteamId;
    }
    else steamId = req.body.inputSteamId;

    if(isNaN(steamId) && steamId.startsWith("https://steamcommunity.com")) steamUrl = steamId;
    else steamUrl = "https://steamcommunity.com/id/" + steamId;

    if(action === "profile") {
        steam.resolve( steamUrl ).then( async id => {

            const profileSummary = await profile(id, true);
            const userBans = await bans(id);
            const userBadges = await badges(id);
            const ownedGames = await games(id);
            const userFriends = await friends(id);

            if(typeof(profileSummary) === "string") return resRenderErr(profileSummary, res);
            else if(typeof(userBans) === "string") return resRenderErr(userBans, res);

            const userName = `<h2 class="heading display-4"><a href="${profileSummary.url}">${profileSummary.nickname}</a>'s Steam Profile :</h2>`;
            const dateStats = `<p class="font-weight-normal">• Created at - ${timeConverter(profileSummary.created)} <br> • Last Log Off - ${timeConverter(profileSummary.lastLogOff)} </p>`;
            const banString = `<p class="font-weight-normal">• BANS - ${userBans.banString || "⁣<b>NO</b> bans on record. <br>"}</p>`;
            const profileScreenshot = `<img src="images/profile_screenshot.png" class="spacing profile-screenshot" alt="profile_ascreenshot">`;
            const profilePic = `<img style="right: 25%;" src="${profileSummary.avatar.large}" class="img-thumbnail position-absolute rounded-circle" alt="profile_pic">`;

            let badgeStats = "";
            if(typeof(userBadges) === "string") badgeStats = `• Badges - Not Available (Private) <br>`;
            else badgeStats += `• <a href="${profileSummary.url}badges/">Badges</a> - ${userBadges.totalBadges} <br>`;
            let gameStats = "";
            if(typeof(ownedGames) === "string") gameStats = `• Games - Not Available (Private) <br>`;
            else gameStats += `• <a href="${profileSummary.url}games/?tab=all">Games</a> - ${ownedGames.totalOwnedGames} <br>`;
            let friendStats = "";
            if(typeof(userFriends) === "string") friendStats = `• Friends - Not Available (Private) <br>`;
            else friendStats += `• <a href="${profileSummary.url}friends/">Friends</a> - ${userFriends.totalFriends} <br>`;
            
            const otherStats = `<p class="font-weight-normal"> ${badgeStats} ${gameStats} ${friendStats} </p>`;

            return res.render("steam.ejs", { 
                req: req, 
                res: res, 
                steamInfo: `<div class="vertical"> 
                ${profilePic} ${userName} ${dateStats} ${banString} ${otherStats} ${profileScreenshot}
                </div>`
            });
            
        }).catch(err => { if(err){ 
            console.log(err);
            return res.render("steam.ejs", { req: req, res: res, steamInfo: `<div class="vertical">Please enter a valid Steam ID or URL</div>` });
        }});
    }
}

const resRenderErr = (err, res) => {
    return res.render("steam.ejs", { 
        req: req, 
        res: res, 
        steamInfo: err 
    });
}
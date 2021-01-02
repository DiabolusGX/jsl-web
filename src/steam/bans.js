require("dotenv");
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);

module.exports = async (id) => {
    const summary = await steam.getUserBans(id).catch(err => { 
        if(err){ 
            console.log(err);
            return '<div class="vertical">Please make sure your profile is <em>public</em> i.e Visible to everyone. </div>';
        }
    });

    let communityBanned, vacBanned, daysSinceLastBan, economyBan, vacBans, gameBans, banString = "", bans = 0;

    if(summary.communityBanned) communityBanned = 'Yes';
    else communityBanned = 'None';
    if(summary.vacBanned) { 
        vacBanned = 'Yes'; 
        vacBans = summary.vacBans;
    }
    else vacBanned = 'None'; vacBans = 'None';
    economyBan = summary.economyBan;
    gameBans = summary.gameBans;
    daysSinceLastBan = summary.daysSinceLastBan;

    if(communityBanned != 'None') {
        banString += "Community Ban - " + communityBanned + "<br>";
        bans++;
    }
    if(vacBanned != 'None') {
        banString += "VAC Ban - " + vacBanned + "<br>";
        bans += vacBans; 
    }
    if(gameBans != 0) {
        banString += "Game Ban - " + gameBans + "<br>"; 
        bans++;
    }
    if(economyBan != 'none') {
        banString += "Economy Ban - " + economyBan + "<br>"; 
        bans++; 
    }
    if(bans >= 1) {
        banString += "Days since last ban - " + daysSinceLastBan;
    }

    return {
        banString: banString,
        totalBans: bans
    };
}
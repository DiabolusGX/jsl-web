require("dotenv").config();
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);

module.exports = async id => {

    const summary = await steam.getUserFriends(id).catch(err => { 
        if(err){ 
            console.log(err);
            return '<div class="vertical">Please make sure your profile is <em>public</em> i.e Visible to everyone. </div>';
        }
    });
    
    return {
        friends: summary,
        totalFriends: summary.length,
    };
}
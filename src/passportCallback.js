const userModel = require("../database/models/user");

const findOrCreate = (_accessToken, _refreshToken, profile, done) => {
    let picture = "https://cdn.discordapp.com/avatars/"+profile.id+"/", email = "", steamId = "NA";
    if (profile.avatar) picture += profile.avatar + ".png";
    if (profile.email) email = profile.email;
    profile.connections.forEach(con => { if(con.type === "steam") steamId = con.id });

    userModel.findOne({
        id: profile.id 
    }, (err, user) => {
        if (err) return done(err);
        //No user was found... so create a new user with values from Facebook (all the profile. stuff)
        if (!user) {
            user = new userModel({
                id: profile.id,
                displayName: profile.username,
                email: email,
                picture: picture,
                steamId: steamId,
                discordGuilds: profile.guilds,
                discordConnections: profile.connections
            });
            user.save( err => {
                if (err) console.log(err);
                return done(err, user);
            });
        } 
        else return done(err, user);
    });
}

module.exports = findOrCreate;
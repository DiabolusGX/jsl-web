const guildConfigModel = require("../../database/models/guildconfig");
const Permissions = require("../discord/Permissions");

module.exports = async (req, res) => {
    const userGuilds = req.user.discordGuilds;
    const botGuidls = await guildConfigModel.find({});

    const userPermsGuilds = [], userNonPermsGuilds = [], managableGuilds = [], commonGuilds = [], invitableGuilds = [];
    
    userGuilds.forEach(g => {
        const perms = new Permissions(g.permissions);
        if(perms.toArray().includes("MANAGE_GUILD")) userPermsGuilds.push(g);
        else userNonPermsGuilds.push(g);
    });

    // user has perms and bot is there
    userPermsGuilds.forEach(g => {
        botGuidls.forEach(bg => {
            if(g.id === bg.guildId) return managableGuilds.push(g);
        });
    });
    // user has perms but bot is not in server
    userPermsGuilds.forEach(g => {
        if(!managableGuilds.includes(g)) invitableGuilds.push(g);
    });
    // user does not has perms but bot is there
    userNonPermsGuilds.forEach(g => {
        botGuidls.forEach(bg => {
            if(g.id === bg.guildId) return commonGuilds.push(g);
        });
    });

    return res.render("servers.ejs", { 
        req: req, res: res, 
        serverInfo: {
            managableGuilds: managableGuilds,
            commonGuilds: commonGuilds,
            invitableGuilds: invitableGuilds
        }
    });
}
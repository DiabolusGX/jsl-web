const guildConfigModel = require("../../database/models/guildconfig");
const Permissions = require("../discord/Permissions");

module.exports = async (req, res) => {
    const userGuilds = req.user.discordGuilds;
    // const userGuilds = [
    //     {
    //         id:"81384788765712384",
    //         name:"Discord API",
    //         icon:"a363a84e969bcbe1353eb2fdfb2e50e6",
    //         owner:false,
    //         permissions:104189632,
    //         features :[
    //             "VANITY_URL","BANNER","NEWS","WELCOME_SCREEN_ENABLED","VIP_REGIONS","INVITE_SPLASH","COMMUNITY"
    //         ],
    //         permissions_new:"104189632",
    //     },
    //     {
    //         id:"356926900779876373",
    //         name:"Y0ken's Domain",
    //         icon:"a_b214b2c268b169e82169e4fbe6c65890",
    //         owner:false,
    //         permissions:2147352567,
    //         features :[
    //             "ANIMATED_ICON","NEWS","WELCOME_SCREEN_ENABLED","PREVIEW_ENABLED","INVITE_SPLASH","COMMUNITY"
    //         ],
    //         permissions_new:"2147352567",
    //     }
    // ]
    const botGuidls = await guildConfigModel.find({});

    const userPermsGuilds = [], userNonPermsGuilds = [], managableGuilds = [], commonGuilds = [], otherGuilds = [];
    
    userGuilds.forEach(g => {
        const perms = new Permissions(g.permissions);
        if(perms.toArray().includes("MANAGE_GUILD")) userPermsGuilds.push(g);
        else userNonPermsGuilds.push(g);
    });
    userPermsGuilds.forEach(g => {
        botGuidls.forEach(bg => {
            if(g.id === bg.guildId) managableGuilds.push(g);
        });
    });
    userNonPermsGuilds.forEach(g => {
        botGuidls.forEach(bg => {
            if(g.id === bg.guildId) commonGuilds.push(g);
            else if(!commonGuilds.includes(g) && !otherGuilds.includes(g)) otherGuilds.push(g);
        });
    });

    return res.render("servers.ejs", { 
        req: req, res: res, 
        serverInfo: {
            managableGuilds: managableGuilds,
            commonGuilds: commonGuilds,
            otherGuilds: otherGuilds
        }
    });
}
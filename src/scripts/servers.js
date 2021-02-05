const guildConfigModel = require("../../database/models/guildconfig");
const Permissions = require("../discord/Permissions");

module.exports = async (req, res) => {

    const userGuilds = req.user.discordGuilds;
    const botGuidls = await guildConfigModel.find({});
    const userPermsGuilds = [], userNonPermsGuilds = [], managableGuilds = [], commonGuilds = [], invitableGuilds = [];

    // filter perms and no-perms guilds
    userGuilds.forEach(g => {
        const perms = new Permissions(g.permissions);
        if (perms.toArray().includes("MANAGE_GUILD")) userPermsGuilds.push(g);
        else userNonPermsGuilds.push(g);
    });

    // user has perms and bot is there
    userPermsGuilds.forEach(g => {
        botGuidls.forEach(bg => {
            if (g.id === bg.guildId) return managableGuilds.push(g);
        });
    });
    // user has perms but bot is not in server
    userPermsGuilds.forEach(g => {
        if (!managableGuilds.includes(g)) invitableGuilds.push(g);
    });
    // user does not has perms but bot is there
    userNonPermsGuilds.forEach(g => {
        botGuidls.forEach(bg => {
            if (g.id === bg.guildId) return commonGuilds.push(g);
        });
    });

    const icon = "https://cdn.discordapp.com/icons/";
    const inviteUrl = "https://discord.com/oauth2/authorize?&client_id=699505785847283785&scope=bot&permissions=1026911319&guild_id=";
    const endUrl = "&response_type=code&redirect_uri=https://jsl-web.herokuapp.com/auth/discord/secrets";

    let manage = "", invite = "", common = "";
    managableGuilds.forEach(g => {
        manage += `<div class="col-lg-6 info-card rounded" >
            <a href="/"><img class="rounded-circle" src="${icon}${g.id}/${g.icon}.png?size=1024" alt="server_icon">
            <p> ${g.name} </p></a>
            </div>`;
    });
    invitableGuilds.forEach(g => {
        invite += `<div class="col-lg-6 info-card rounded" >
            <img class="rounded-circle" src="${icon}${g.id}/${g.icon}.png?size=1024" alt="server_icon">
            <p> ${g.name} </p>
            <a class="btn btn-outline-success" href="${inviteUrl + g.id + endUrl}"> <i class="fa fa-plus" aria-hidden="true"></i> Add Bot </a>
            <p></p>
            </div>`;
    });
    commonGuilds.forEach(g => {
        common += `<div class="col-lg-3 info-card rounded" >
            <img class="rounded-circle" src="${icon}${g.id}/${g.icon}.png?size=1024" alt="server_icon">
            <p> ${g.name} </p>
            </div>`;
    });

    const servers = `<div class="row"> 
        <div class="col-lg-6"> <div class="note">
        <h1 class="spacing centered heading">Manage</h1>
        <div class="row centered"> 
            ${manage} 
        </div> </div> </div>

        <div class="col-lg-6"> <div class="note">
        <h1 class="spacing centered heading">Invite to</h1>
        <div class="row centered">
            ${invite}
        </div> </div> </div>

        <div class="col-lg-12"> <div class="note">
        <h1 class="spacing centered heading">Other Common Servers</h1>
        <div class="row centered">
            ${common}
        </div> </div> </div>
    </div>`;

    return res.render("servers.ejs", { 
        req: req, res: res, 
        servers: servers
    });

}
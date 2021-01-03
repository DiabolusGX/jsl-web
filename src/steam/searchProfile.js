const timeConverter = require("../scripts/timeConverter");
const profile = require("./profile");
const bans = require("./bans");
const badges = require("./badges");
const games = require("./ownedGames");
const friends = require("./friends");

module.exports = async id => {

    const profileSummary = await profile(id, true);
    const userBans = await bans(id);
    const userBadges = await badges(id);
    const ownedGames = await games(id);
    const userFriends = await friends(id);

    if (typeof (profileSummary) === "string") return profileSummary;
    else if (typeof (userBans) === "string") return userBans;

    const userName = `<h2 class="heading display-4"><a href="${profileSummary.url}">${profileSummary.nickname}</a>'s Profile :</h2>`;
    const dateStats = `<p class="font-weight-normal">• Created at - ${timeConverter(profileSummary.created)} <br> • Last Log Off - ${timeConverter(profileSummary.lastLogOff)} </p>`;
    const banString = `<p class="font-weight-normal">• BANS - ${userBans.banString || "⁣<b>NO</b> bans on record. <br>"}</p>`;
    const profileScreenshot = `<img class="screenshot" alt="profile_sccreenshot" src="images/profile_screenshot.png">`;
    const profilePic = `<img class="img-thumbnail thumbnail position-absolute rounded-circle" alt="profile_pic" src="${profileSummary.avatar.large}">`;

    let badgeStats = "";
    if (typeof (userBadges) === "string") badgeStats = `• Badges - Not Available (Private) <br>`;
    else badgeStats += `• <a href="${profileSummary.url}badges/">Badges</a> - ${userBadges.totalBadges} <br>`;
    
    let gameStats = "";
    if (typeof (ownedGames) === "string") gameStats = `• Games - Not Available (Private) <br>`;
    else gameStats += `• <a href="${profileSummary.url}games/?tab=all">Games</a> - ${ownedGames.totalOwnedGames} <br>`;
    
    let friendStats = "";
    if (typeof (userFriends) === "string") friendStats = `• Friends - Not Available (Private) <br>`;
    else friendStats += `• <a href="${profileSummary.url}friends/">Friends</a> - ${userFriends.totalFriends} <br>`;

    const otherStats = `<p class="font-weight-normal"> ${badgeStats} ${gameStats} ${friendStats} </p>`;

    return {
        userName: userName,
        profilePic:profilePic,
        dateStats: dateStats,
        banString: banString,
        otherStats: otherStats,
        profileScreenshot: profileScreenshot
    }
}
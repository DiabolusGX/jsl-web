const https = require("https");

module.exports = joke = (req, res) => {
    let joke = "", bans = "";
    if (req.body.flag) {
        if (typeof (req.body.flag) === "string") bans = req.body.flag;
        else if (typeof (req.body.flag) === "object") bans = req.body.flag.join(",");
    }
    const url = "https://sv443.net/jokeapi/v2/joke/" + req.body.jokeType + "?blacklistFlags=" + bans;
    https.get(url, (response) => {
        response.on("data", (data) => {
            const jokeData = JSON.parse(data);
            if (jokeData.type === "twopart") joke += jokeData.setup + "<br>" + jokeData.delivery;
            else if (jokeData.type === "single") joke = jokeData.joke;

            res.render("joke.ejs", { req: req, res: res, joke: `<div class="vertical"> ${joke} </div>` });
        });
    });
}
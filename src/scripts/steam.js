require("dotenv");
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);
const puppeteer = require('puppeteer');
const device = puppeteer.devices['iPad Mini landscape'];

module.export = steamModule = (req, res) => {
    res.render("steam.ejs", { req: req, res: res, steamInfo: "ok ok" });
}
require("dotenv");
const SteamAPI = require('steamapi');
const steam = new SteamAPI(process.env.STEAM_API_KEY);
const puppeteer = require('puppeteer');
const device = puppeteer.devices['iPad Mini landscape'];

module.exports = async (id, savePic) => {
    const summary = await steam.getUserSummary(id).catch(err => { 
        if(err){ 
            console.log(err);
            return '<div class="vertical">Please make sure your profile is <em>public</em> i.e Visible to everyone. </div>';
        }
    });

    if(savePic){
        const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.goto(summary.url);
        await page.emulate(device);
        await page.screenshot({path: "./public/images/profile_screenshot.png", type: "png"});
        await browser.close();
    }

    return summary;
}
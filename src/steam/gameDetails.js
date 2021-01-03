const fetch = require('node-fetch');

module.exports = async summary => {
    
    let feedbackString;
    const url = `https://store.steampowered.com/appreviews/${summary.steam_appid}?json=1`;
    const raw = await fetch(url);
    const data = await raw.json();
    let tempPercent = (data.query_summary.total_positive / data.query_summary.total_reviews) * 100;
    if(data.success === 1) feedbackString =  tempPercent.toFixed(2) + `% (` + data.query_summary.review_score_desc + `)`;
    else feedbackString = `'NA'`;

    let gamePricing = "Free to play.";
    if(summary.price_overview){
        if(summary.price_overview.discount_percent === 0 ) gamePricing = `Final Price - ${summary.price_overview.final_formatted} <br> (No discount)`;
        else gamePricing = `Initial price - ${summary.price_overview.initial_formatted} <br> Discount - ${summary.price_overview.discount_percent}% <br> Final Price - ${summary.price_overview.final_formatted}`;    
    }
    
    let releaseDate = summary.release_date.date;
    if(summary.release_date.coming_soon) releaseDate = 'Coming Soon...';

    let gameGenres = '', gamePlatforms = '';
    for(let i = 0; i < summary.genres.length; i++){
        gameGenres += summary.genres[i].description + ' | ';
    }
    if(summary.platforms.windows) gamePlatforms += `Windows | `;
    if(summary.platforms.mac) gamePlatforms += `Mac |`;
    if(summary.platforms.linux) gamePlatforms += `Linux`;

    let devString = `Devs - ${summary.developers} <br> Publishers - ${summary.publishers} <br>`;
    let reviewsString;
    if(!summary.recommendations) reviewsString = `Recommended by - 'NA' Users. <br> Reviews - <u>${feedbackString}</u>`;
    else reviewsString = `Recommended by - <u>${ summary.recommendations.total || `NA` }</u> Users. <br> Reviews - <u>${feedbackString}</u>`;

    return {
        id: summary.steam_appid,
        name: summary.name,
        url: `https://store.steampowered.com/app/${summary.steam_appid}`,
        pricing: gamePricing,
        releaseDate: releaseDate,
        review: reviewsString,
        genres: gameGenres,
        desc: summary.short_description,
        devs: devString,
        platform: gamePlatforms,
        thumbnail: summary.header_image,
        fullImage: summary.screenshots[Math.floor(Math.random() * summary.screenshots.length)].path_full
    }
}
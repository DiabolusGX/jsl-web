const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    id: { type: String },
    displayName: { type: String },
    picture: { type: String },
    steamId: { type: String },
    discordGuilds: { type: Array },
    discordConnections: { type: Array }
});

const userModel = module.exports = mongoose.model("User", userSchema);

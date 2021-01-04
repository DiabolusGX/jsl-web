const mongoose = require('mongoose');

const guildConfigSchema = new mongoose.Schema({
	guildId: { type: String },
	guildOwner: { type: String },
	guildPrefix: { type: String },
	guildDjRoleId: { type: String },
	guildModRoleId: { type: String },
	guildMuteRoleId: { type: String },
	guildLogChannelId: { type: String },
	guildModChannelId: { type: String },
	guildMainChannelId: { type: String },
	guildWelcomeChannelId: { type: String },
	guildBotCommandChannelId: { type: String }
});

const guildConfigModel = module.exports = mongoose.model('guildConfig', guildConfigSchema);
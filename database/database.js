require("dotenv").config();
const mongoose = require("mongoose");

module.exports = mongoose.connect(process.env.MONGO_URL, { dbName: "express", useNewUrlParser: true, useUnifiedTopology: true });

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

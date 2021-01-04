require("dotenv").config();
const mongoose = require("mongoose");

module.exports = () => {
	mongoose.set('useFindAndModify', false);
	mongoose.set('useCreateIndex', true);
	mongoose.connect(process.env.MONGO_URL, { dbName: "JSL", useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("connected to mongodb."));
}

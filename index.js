const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const router = express.Router();
require("dotenv").config();

const ImageModel = require('./models/imageModel');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const uri = process.env.MONGO_DB_ATLAS_URL;

mongoose.connect(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});

const connection = mongoose.connection;

connection.once("open", () => {
	console.log("MongoDB database connection established successfully");
});

router.route("/").post((req, res) => {
	const imageUrl = req.body.canvasUrl;

	if (imageUrl) {
		const newImageUrl = new ImageModel({
			imageUrl: imageUrl,
		});

		newImageUrl.save()
			.then(() => res.json(imageUrl))
			.catch((err) => res.json(err));
	}
	else{
		res.send("No imageUrl found");
	}
});

router.route("/").get((req, res) => {

	ImageModel.find({})
		.then((data) => {
			res.send(data);
		})
		.catch(() => {
			console.log("cannot fetch data from database")
		})
});

app.use("/", (req, res) => {
	res.send("Welcome to the server");
})
app.use("/create", router);
app.use("/getImages", router);


const port = process.env.PORT || 8000;

app.listen(port, () => {
	console.log(`Server is running at port no. : 8000`);
});
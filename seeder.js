const fs = require("fs");
const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Load models
const Bootcamp = require("./models/Bootcamp");
const Course = require("./models/Course");
const User = require("./models/User");
const Review = require("./models/Review");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Read JSON files
const bootcamps = JSON.parse(
  fs.readFileSync(`/${__dirname}/_data/bootcamps.json`, "utf-8")
);

const courses = JSON.parse(
  fs.readFileSync(`/${__dirname}/_data/courses.json`, "utf-8")
);

const user = JSON.parse(
  fs.readFileSync(`/${__dirname}/_data/users.json`, "utf-8")
);

const review = JSON.parse(
  fs.readFileSync(`/${__dirname}/_data/reviews.json`, "utf-8")
);
// Import in DB
const importData = async () => {
  try {
    await Bootcamp.create(bootcamps);
    await Course.create(courses);
    await User.create(user);
    await Review.create(review);

    console.log("Data Imported ...".green.inverse);
    process.exit();
  } catch (error) {
    console.log(err);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Bootcamp.deleteMany();
    await Course.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();

    console.log("Data Destroyed...".red.inverse);
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}

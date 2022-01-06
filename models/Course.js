const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      // required: [true, "Please add a course title"],
    },
    description: {
      type: String,
      // required: [true, "Please add a description"],
    },
    weeks: {
      type: String,
      // required: [true, "Please add number of weeks"],
    },
    fee: {
      type: Number,
      // required: [true, "Please add a tuition cost"],
    },
    level: {
      type: String,
      // required: [true, "Please add level"],
      enum: ["beginner", "intermediate", "advanced", "all levels"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    lessons: [
      {
        title: String,
        duration: String,
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    bootcamp: {
      type: mongoose.Schema.ObjectId,
      ref: "Bootcamp",
      required: true,
    },
    photo: {
      type: String,
      default: "no-photo.png",
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Static method to get avg of course tuitions
CourseSchema.statics.getAverageCost = async function (bootcampId) {
  const obj = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: "$bootcamp",
        averageCost: { $avg: "$fee" },
      },
    },
  ]);

  try {
    await this.model("Bootcamp").findByIdAndUpdate(bootcampId, {
      averageCost: Math.ceil(obj[0].averageCost / 10) * 10,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
CourseSchema.post("save", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost after remove
CourseSchema.post("remove", async function () {
  await this.constructor.getAverageCost(this.bootcamp);
});

CourseSchema.virtual("reviews", {
  ref: "Review", // Model
  localField: "_id",
  foreignField: "course", // Field that you want to show
  justOne: false, // because we want array
});

module.exports = mongoose.model("Course", CourseSchema);

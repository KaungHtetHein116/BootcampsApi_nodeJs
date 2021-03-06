const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please add a title for the review"],
    maxlength: 100,
  },
  description: {
    type: String,
    required: [true, "Please add some description"],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please add a rating between 1 and 5"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

// Static method to get avg rating and save
ReviewSchema.statics.getAverageRating = async function (courseId) {
  const obj = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(obj);
  try {
    await this.model("Course").findByIdAndUpdate(courseId, {
      averageRating: obj[0].averageRating,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getAverageCost after save
ReviewSchema.post("save", async function () {
  await this.constructor.getAverageRating(this.course);
});

// Call getAverageCost before remove
ReviewSchema.post("remove", async function () {
  await this.constructor.getAverageRating(this.course);
});

module.exports = mongoose.model("Review", ReviewSchema);

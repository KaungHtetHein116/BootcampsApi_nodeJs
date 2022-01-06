const express = require("express");
const {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses");

const Course = require("../models/Course");
const advancedResults = require("../middleware/advancedResult");
const { protect, authorize } = require("../middleware/auth");
const reviewRouter = require("./reviews");

const router = express.Router({ mergeParams: true });

router.use("/:courseId/reviews", reviewRouter);

router.route("/").get(
  advancedResults(Course, [
    {
      path: "reviews",
    },
    {
      path: "bootcamp",
    },
    {
      path: "user",
    },
  ]),
  getCourses
);

router
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize("publisher", "admin"), updateCourse)
  .delete(protect, authorize("publisher", "admin"), deleteCourse);

router.route("/").post(protect, authorize("publisher", "admin"), addCourse);

module.exports = router;

const express = require("express");
const router = express.Router();

const Enrollment = require("../models/Enrollment");
const LessonProgress = require("../models/LessonProgress");

router.post("/enroll", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const exists = await Enrollment.findOne({ userId, courseId });
    if (exists) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    const enroll = new Enrollment({ userId, courseId });
    await enroll.save();

    res.status(201).json({ message: "Learner enrolled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/my-courses/:userId", async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      userId: req.params.userId
    }).populate("courseId");

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/lesson-complete", async (req, res) => {
  try {
    const { userId, courseId, lessonId } = req.body;

    const progress = new LessonProgress({
      userId,
      courseId,
      lessonId,
      completed: true,
      completedAt: new Date()
    });

    await progress.save();

    res.json({ message: "Lesson marked as completed" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
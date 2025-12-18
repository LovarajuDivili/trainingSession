const express = require("express");
const OpeningsEvents = require("../models/OpeningsEvents");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const logActivity = require("../utils/logActivity");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    let data = await OpeningsEvents.findOne({ userId });

    if (!data) {
      data = await OpeningsEvents.create({
        userId,
        eventImages: [],
        jobOpenings: [],
      });
    }

    res.json(data);
  } catch (err) {
    console.error("Error fetching openings-events:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/images", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { imageUrl, title, order } = req.body;

    let doc = await OpeningsEvents.findOne({ userId });

    if (!doc) {
      doc = new OpeningsEvents({
        userId,
        eventImages: [],
        jobOpenings: [],
      });
    }

    const newImage = { imageUrl, title, order };
    doc.eventImages.push(newImage);
    await doc.save();

    await logActivity(req.user.userId, "event_image_added", "Success", {
      title,
    });

    res.status(201).json(newImage);
  } catch (err) {
    console.error("Error adding image:", err);
    await logActivity(req.user.userId, "event_image_added", "Failed");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/images/:imageId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { imageId } = req.params;

    const doc = await OpeningsEvents.findOne({ userId });
    if (!doc) return res.status(404).json({ message: "Not found" });

    const idx = doc.eventImages.findIndex(
      (img) => img._id.toString() === imageId
    );

    if (idx === -1) return res.status(404).json({ message: "Image not found" });

    const deletedImage = doc.eventImages.splice(idx, 1)[0];
    await doc.save();

    await logActivity(req.user.userId, "event_image_deleted", "Success", {
      title: deletedImage.title,
    });

    res.json({ message: "Image deleted", deletedImage });
  } catch (err) {
    console.error("Error deleting image:", err);
    await logActivity(req.user.userId, "event_image_deleted", "Failed");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/jobs", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { title, description, location, openings, requirements } = req.body;

    let doc = await OpeningsEvents.findOne({ userId });
    if (!doc) {
      doc = new OpeningsEvents({
        userId,
        eventImages: [],
        jobOpenings: [],
      });
    }

    const newJob = {
      title,
      description,
      location,
      openings: openings ?? 0,
      requirements: requirements || [],
    };

    doc.jobOpenings.push(newJob);
    await doc.save();

    await logActivity(req.user.userId, "job_created", "Success", {
      title,
    });

    res.status(201).json(doc.jobOpenings[doc.jobOpenings.length - 1]);
  } catch (err) {
    console.error("Error adding job:", err);
    await logActivity(req.user.userId, "job_created", "Failed");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/jobs/:jobId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;
    const { title, description, location, openings, requirements } = req.body;

    const doc = await OpeningsEvents.findOne({ userId });
    if (!doc) return res.status(404).json({ message: "Not found" });

    const job = doc.jobOpenings.id(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.title = title;
    job.description = description;
    job.location = location;
    job.openings = openings;
    job.requirements = requirements;

    await doc.save();

    await logActivity(req.user.userId, "job_updated", "Success", {
      title,
    });

    res.json(job);
  } catch (err) {
    console.error("Error updating job:", err);
    await logActivity(req.user.userId, "job_updated", "Failed");
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/jobs/:jobId", auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { jobId } = req.params;

    const doc = await OpeningsEvents.findOne({ userId });
    if (!doc) return res.status(404).json({ message: "Not found" });

    const idx = doc.jobOpenings.findIndex(
      (job) => job._id.toString() === jobId
    );

    if (idx === -1) return res.status(404).json({ message: "Job not found" });

    const deletedJob = doc.jobOpenings.splice(idx, 1)[0];
    await doc.save();

    await logActivity(req.user.userId, "job_deleted", "Success", {
      title: deletedJob.title,
    });

    res.json({ message: "Job deleted", deletedJob });
  } catch (err) {
    console.error("Error deleting job:", err);
    await logActivity(req.user.userId, "job_deleted", "Failed");
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

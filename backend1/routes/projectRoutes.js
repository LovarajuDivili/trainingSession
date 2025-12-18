const express = require("express");
const Project = require("../models/Project");
const auth = require("../middleware/auth");
const logActivity = require("../utils/logActivity");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.userId });
    res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!project) return res.status(404).json({ message: "Project not found" });

    res.json(project);
  } catch (err) {
    console.error("Error fetching project:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const newProject = new Project({
      ...req.body,
      userId: req.user.userId,
    });

    const savedProject = await newProject.save();

    await logActivity(req.user.userId, "project_created", "Success", {
      id: savedProject._id,
      name: savedProject.name,
    });

    res.status(201).json(savedProject);
  } catch (err) {
    console.error("Error creating project:", err);
    await logActivity(req.user.userId, "project_created", "Failed");
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updatedProject = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updatedProject) {
      await logActivity(req.user.userId, "project_updated", "Failed", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Project not found" });
    }

    await logActivity(req.user.userId, "project_updated", "Success", {
      id: req.params.id,
    });

    res.json(updatedProject);
  } catch (err) {
    console.error("Error updating project:", err);
    await logActivity(req.user.userId, "project_updated", "Failed");
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!deleted) {
      await logActivity(req.user.userId, "project_deleted", "Failed", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Project not found" });
    }

    await logActivity(req.user.userId, "project_deleted", "Success", {
      id: req.params.id,
    });

    res.json({ message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    await logActivity(req.user.userId, "project_deleted", "Failed");
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

const express = require("express");
const Employee = require("../models/Employee");
const auth = require("../middleware/auth");
const logActivity = require("../utils/logActivity");

const router = express.Router();

router.get("/project/:projectName", auth, async (req, res) => {
  try {
    const { projectName } = req.params;

    const employees = await Employee.find({
      projectName,
      userId: req.user.userId,
    });

    return res.json(employees);
  } catch (err) {
    console.error("Error fetching employees by project:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const employees = await Employee.find({
      userId: req.user.userId,
    });

    return res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    const employee = await Employee.findOne({
      id: req.params.id,
      userId: req.user.userId,
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    return res.json(employee);
  } catch (err) {
    console.error("Error fetching employee:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const newEmployee = new Employee({
      ...req.body,
      userId: req.user.userId,
    });

    const savedEmployee = await newEmployee.save();

    await logActivity(req.user.userId, "employee_created", "Success", {
      id: savedEmployee.id,
      name: savedEmployee.name,
    });

    return res.status(201).json(savedEmployee);
  } catch (err) {
    console.error("Error creating employee:", err);

    await logActivity(req.user.userId, "employee_created", "Failed");

    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Employee with this email or ID already exists" });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const updatedEmployee = await Employee.findOneAndUpdate(
      { id: req.params.id, userId: req.user.userId },
      req.body,
      { new: true }
    );

    if (!updatedEmployee) {
      await logActivity(req.user.userId, "employee_updated", "Failed", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Employee not found" });
    }

    await logActivity(req.user.userId, "employee_updated", "Success", {
      id: req.params.id,
    });

    return res.json(updatedEmployee);
  } catch (err) {
    console.error("Error updating employee:", err);
    await logActivity(req.user.userId, "employee_updated", "Failed");
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const deleted = await Employee.findOneAndDelete({
      id: req.params.id,
      userId: req.user.userId,
    });

    if (!deleted) {
      await logActivity(req.user.userId, "employee_deleted", "Failed", {
        id: req.params.id,
      });
      return res.status(404).json({ message: "Employee not found" });
    }

    await logActivity(req.user.userId, "employee_deleted", "Success", {
      id: req.params.id,
    });

    return res.json({ message: "Employee deleted" });
  } catch (err) {
    console.error("Error deleting employee:", err);
    await logActivity(req.user.userId, "employee_deleted", "Failed");
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/stats/monthly-joinings", auth, async (req, res) => {
  try {
    const employees = await Employee.find({
      userId: req.user.userId,
    });

    const monthlyData = Array(12).fill(0);

    employees.forEach((emp) => {
      if (emp.joinDate) {
        const month = new Date(emp.joinDate).getMonth();
        monthlyData[month]++;
      }
    });

    return res.json({ monthlyJoinings: monthlyData });
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/stats/department-distribution", auth, async (req, res) => {
  try {
    const employees = await Employee.find({
      userId: req.user.userId,
    });

    const distribution = {};

    employees.forEach((emp) => {
      const dept = emp.role;
      distribution[dept] = (distribution[dept] || 0) + 1;
    });

    return res.json(distribution);
  } catch (err) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

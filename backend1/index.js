const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const bodyParser = require("./middleware/bodyParser");
if (typeof bodyParser === "function") {
  bodyParser(app);
} else {
  console.error("bodyParser middleware is not a function");
}

const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const projectRoutes = require("./routes/projectRoutes");
const openingsEventsRoutes = require("./routes/openingsEventsRoutes");
const uploadRoutes = require("./routes/upload");
const logRoutes = require("./routes/logRoutes");
const accountantRoutes = require("./routes/accountantRoutes");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/orderRoutes");

const safeUse = (path, router) => {
  if (typeof router !== "function") {
    console.error(`Router at "${path}" is NOT a function`);
    process.exit(1);
  }
  app.use(path, router);
};

safeUse("/api/auth", authRoutes);
safeUse("/api/employees", employeeRoutes);
safeUse("/api/projects", projectRoutes);
safeUse("/api/openings-events", openingsEventsRoutes);
safeUse("/api/logs", logRoutes);
safeUse("/api/accountant", accountantRoutes);
safeUse("/api/cart", cartRoutes);
safeUse("/api/orders", orderRoutes);
safeUse("/api", uploadRoutes);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const mongoURI = process.env.MONGOURI;

if (!mongoURI) {
  console.error("MONGOURI is not defined in .env");
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected!"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

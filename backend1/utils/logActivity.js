const Log = require("../models/Logs");
const User = require("../models/User");

function getFormattedDateTime() {
  const now = new Date();

  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const year = now.getFullYear();

  const date = `${month}-${day}-${year}`;
  const time = now.toLocaleTimeString("en-US", { hour12: false });

  return { date, time };
}

async function logActivity(userId, action, status = "Success", details = {}) {
  try {
    let name = "Unknown";

    if (userId) {
      const user = await User.findById(userId).select("name");
      if (user && user.name) name = user.name.trim();
    }

    const { date, time } = getFormattedDateTime();

    await Log.create({
      name,
      action,
      status,
      details,
      date,
      time,
    });

    console.log(`LOG SAVED: ${name} - ${action}`);
  } catch (err) {
    console.error("Log error:", err);
  }
}

module.exports = logActivity;

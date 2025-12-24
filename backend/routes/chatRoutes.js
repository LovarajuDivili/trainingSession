const express = require("express");
const Chat = require("../models/Chat");
const auth = require("../middleware/auth");
const OpenAI = require("openai");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/send", auth, async (req, res) => {
  try {
    const { message, deepResearch } = req.body;
    const { email } = req.user;

    await Chat.create({
      userEmail: email,
      role: "user",
      message,
    });

    const completion = await openai.chat.completions.create({
      model: deepResearch ? "gpt-4.1" : "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: deepResearch
            ? "You are an expert research assistant. Give deep, detailed, structured answers in markdown."
            : "You are a helpful AI assistant. Answer clearly in markdown.",
        },
        { role: "user", content: message },
      ],
    });

    const reply = completion.choices[0].message.content;

    console.log("BOT RAW REPLY:\n", reply);

    await Chat.create({
      userEmail: email,
      role: "assistant",
      message: reply,
    });

    res.json({ reply });
  } catch (err) {
    console.error("AI chat error:", err);
    res.status(500).json({ reply: "AI error 😢" });
  }
});

router.get("/history", auth, async (req, res) => {
  try {
    const { email } = req.user;

    console.log("Fetching chats for:", email);

    const chats = await Chat.find({ userEmail: email }).sort({
      createdAt: 1,
    });

    console.log("Chats found:", chats.length);

    res.json(chats);
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Failed to fetch history" });
  }
});

router.delete("/clear", auth, async (req, res) => {
  try {
    await Chat.deleteMany({ userEmail: req.user.email });
    console.log("Chat cleared for:", req.user.email);
    res.json({ success: true });
  } catch (err) {
    console.error("Clear chat error:", err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;

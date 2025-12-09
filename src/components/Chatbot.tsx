import { useEffect, useRef, useState } from "react";
import {
  Box,
  Fab,
  Tooltip,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { useLocation } from "react-router-dom";
import { useThemeColors } from "../hooks/useThemeColors";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";

type Message = {
  sender: "user" | "bot";
  text: string;
  time: string;
};

const Chatbot = () => {
  const location = useLocation();
  const colors = useThemeColors();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hi! I'm your AI assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (location.pathname === "/welcome" || location.pathname === "/signup" || location.pathname === "/signin" ) return null;

  const getTime = () =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const getBotReply = (userMsg: string) => {
    const msg = userMsg.toLowerCase();

    if (msg.includes("hello") || msg.includes("hi"))
      return "Hello 👋 How can I help you today?";

    if (msg.includes("help")) return "Sure! Tell me what you'd like help with.";

    if (msg.includes("admin"))
      return "You're on the Admin dashboard. I can help with projects, users, or logs.";

    if (msg.includes("accountant"))
      return "I can help with accounting flows and HR data.";

    return "✅ Got it! Real AI responses coming soon.";
  };

  const sendMessage = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      sender: "user",
      text: input,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setTimeout(() => {
      const botReply: Message = {
        sender: "bot",
        text: getBotReply(userMsg.text),
        time: getTime(),
      };

      setMessages((prev) => [...prev, botReply]);
    }, 600);
  };

  return (
    <>
      {!open && (
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          <Tooltip title="AI Assistant" placement="left">
            <Fab
              sx={{
                color: "#fff",
                width: 56,
                height: 56,
                fontSize: "40px",
                "&:hover": {
                  backgroundColor: colors.primary.dark,
                },
              }}
              onClick={() => setOpen(true)}
            >
              🤖
            </Fab>
          </Tooltip>
        </Box>
      )}

      {open && (
        <Box
          sx={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "540px",
            height: "650px",
            backgroundColor: colors.background.white,
            borderRadius: "16px",
            display: "flex",
            flexDirection: "column",
            zIndex: 9999,
            boxShadow: "0px 8px 30px rgba(0,0,0,0.3)",
          }}
        >
          {/* HEADER */}
          <Box
            sx={{
              backgroundColor: colors.primary.main,
              color: "#fff",
              padding: "10px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <Typography fontWeight="bold">🤖 AI Assistant</Typography>

            <IconButton
              size="small"
              sx={{ color: "#fff" }}
              onClick={() => setOpen(false)}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* MESSAGES */}
          <Box
            sx={{
              flex: 1,
              p: 1.2,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 0.8,
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  maxWidth: "80%",
                  position: "relative",
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                  }}
                >
                  {msg.sender === "user" ? (
                    <PersonIcon
                      sx={{
                        fontSize: "16px",
                        color: colors.text.secondary,
                      }}
                    />
                  ) : (
                    <SmartToyIcon
                      sx={{
                        fontSize: "16px",
                        color: colors.text.secondary,
                      }}
                    />
                  )}
                </Box>

                {/* Message Container */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    "&:hover .timestamp": {
                      opacity: 1,
                    },
                  }}
                >
                  {/* Message Bubble */}
                  <Box
                    sx={{
                      backgroundColor:
                        msg.sender === "user"
                          ? colors.primary.light
                          : colors.background.lightGray,
                      px: 1.2,
                      py: 0.8,
                      borderRadius: "12px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      maxWidth: "100%",
                    }}
                  >
                    {msg.text}
                  </Box>

                  <Typography
                    className="timestamp"
                    sx={{
                      fontSize: "9px",
                      color: colors.text.secondary,
                      textAlign: "right",
                      marginTop: "1px",
                      paddingRight: "4px",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      height: "12px",
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}

            <div ref={bottomRef} />
          </Box>

          {/* INPUT */}
          <Box
            sx={{
              borderTop: `1px solid ${colors.border.light}`,
              p: 1,
              display: "flex",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              value={input}
              size="small"
              fullWidth
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type your message..."
              sx={{
                flex: 1,

                "& .MuiOutlinedInput-root": {
                  borderRadius: "10px",

                  "&:hover fieldset": {
                    borderColor: colors.border.light,
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: colors.border.light,
                  },
                },
              }}
            />

            {/* SEND BUTTON */}
            <SendIcon sx={{ fontSize: "30px", color: colors.primary.main }} />

            {/* MICROPHONE ICON */}
            <Tooltip
              title="Voice input"
              PopperProps={{
                sx: {
                  zIndex: 10000,
                },
              }}
            >
              <IconButton
                size="small"
                sx={{
                  color: colors.primary.main,
                  borderRadius: "10px",
                  height: "36px",
                  width: "36px",
                  "&:hover": {
                    backgroundColor: colors.primary.main,
                    color: "#fff",
                  },
                }}
                onClick={() => {
                  console.log("🎤 Microphone clicked");
                }}
              >
                <MicIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Chatbot;

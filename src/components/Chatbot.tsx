/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Box,
  Fab,
  Tooltip,
  Typography,
  IconButton,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
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
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = useCallback(() =>
    new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }), []);

  const startNewConversation = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/v-1/application/chatbot/new-conversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setConversationId(data.conversation_id);
      }
    } catch (err) {
      console.error("Failed to start new conversation:", err);
    }
  }, []);

  // Initialize new conversation when chatbot opens
  useEffect(() => {
    if (open && !conversationId) {
      startNewConversation();
    }
  }, [open, conversationId, startNewConversation]); // Added all dependencies

  // If you want to start a new conversation every time the chatbot opens,
  // regardless of existing conversationId, use this version:
  /*
  useEffect(() => {
    if (open) {
      startNewConversation();
    }
  }, [open, startNewConversation]);
  */

  if (
    location.pathname === "/welcome" ||
    location.pathname === "/signup" ||
    location.pathname === "/signin"
  )
    return null;

  const getContextFromLocation = (): string => {
    const path = location.pathname;
    
    if (path.includes("/admin")) return "User is on admin dashboard";
    if (path.includes("/accountant")) return "User is an accountant";
    if (path.includes("/projects")) return "User is viewing projects";
    if (path.includes("/inventory")) return "User is viewing inventory";
    if (path.includes("/hr")) return "User is viewing HR section";
    
    return "General user context";
  };

  const sendMessageToAPI = async (userMessage: string): Promise<{ reply: string; conversation_id?: string }> => {
    try {
      const context = getContextFromLocation();
      
      const response = await fetch("http://localhost:8000/v-1/application/chatbot/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          context: context,
          conversation_id: conversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      sender: "user",
      text: input,
      time: getTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await sendMessageToAPI(input);
      
      // Update conversation ID if returned
      if (result.conversation_id && !conversationId) {
        setConversationId(result.conversation_id);
      }
      
      const botReply: Message = {
        sender: "bot",
        text: result.reply,
        time: getTime(),
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      
      // Show error to user
      setError(error.message || "Failed to get AI response. Please try again.");
      
      // Fallback to basic response if AI fails
      const errorReply: Message = {
        sender: "bot",
        text: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        time: getTime(),
      };
      
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  const handleClearConversation = () => {
    setMessages([
      {
        sender: "bot",
        text: "👋 Hi! I'm your AI assistant. I've cleared our previous conversation. How can I help you now?",
        time: getTime(),
      },
    ]);
    setConversationId(null);
    startNewConversation();
  };

  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

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
              padding: "8px 10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography fontWeight="bold">
                <span style={{ fontSize: "30px" }}>🤖 </span>AI Assistant
              </Typography>
              {conversationId && (
                <Tooltip title="Clear conversation">
                  <IconButton
                    size="small"
                    sx={{ color: "#fff", ml: 1 }}
                    onClick={handleClearConversation}
                  >
                    <Typography variant="caption" sx={{ fontSize: "10px" }}>
                      Clear
                    </Typography>
                  </IconButton>
                </Tooltip>
              )}
            </Box>

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
                    fontSize: "16px",
                    color: colors.text.secondary,
                  }}
                >
                  {msg.sender === "user" ? "👤" : "🤖"}
                </Box>

                {/* Message Container */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
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
                      borderRadius: "8px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                      maxWidth: "100%",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {msg.text}
                  </Box>

                  <Typography
                    sx={{
                      fontSize: "9px",
                      color: colors.text.secondary,
                      textAlign: "right",
                      marginTop: "1px",
                      paddingRight: "4px",
                      opacity: 1,
                      transition: "opacity 0.2s ease",
                      height: "12px",
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}

            {/* Loading indicator */}
            {loading && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 0.8,
                  alignSelf: "flex-start",
                  maxWidth: "80%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                    fontSize: "16px",
                    color: colors.text.secondary,
                  }}
                >
                  🤖
                </Box>
                <Box
                  sx={{
                    backgroundColor: colors.background.lightGray,
                    px: 1.2,
                    py: 0.8,
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2">Thinking...</Typography>
                </Box>
              </Box>
            )}

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
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Type your message..."
              disabled={loading}
              multiline
              maxRows={3}
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
            <IconButton
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              sx={{
                color: input.trim() && !loading ? colors.primary.main : colors.text.disabled,
                "&:hover": {
                  backgroundColor: input.trim() && !loading ? colors.primary.light : "transparent",
                },
              }}
            >
              <SendIcon sx={{ fontSize: "30px" }} />
            </IconButton>

            {/* MICROPHONE ICON */}
            <Tooltip
              title="Voice input (coming soon)"
              PopperProps={{
                sx: {
                  zIndex: 10000,
                },
              }}
            >
              <IconButton
                size="small"
                sx={{
                  color: colors.text.disabled,
                  borderRadius: "10px",
                  height: "36px",
                  width: "36px",
                  cursor: "not-allowed",
                }}
                disabled
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
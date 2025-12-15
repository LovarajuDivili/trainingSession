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
  Button,
  MenuItem,
  Menu,
  Switch,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import { useThemeColors } from "../hooks/useThemeColors";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import type { RootState } from "../store/Store";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setHistory } from "../store/ChatSlice";
import { useAuth } from "../contexts/AuthContext";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import AssistantIcon from "@mui/icons-material/Assistant";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import HistoryIcon from "@mui/icons-material/History";
//import AutoFixHighIcon  from "@mui/icons-material/AutoFixHigh";
//import ContentCutIcon from "@mui/icons-material/Screenshot";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TuneIcon from "@mui/icons-material/Tune";
import DvrIcon from "@mui/icons-material/Dvr";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ImageIcon from "@mui/icons-material/Image";
//import ScreenshotIcon from "@mui/icons-material/Screenshot";
import html2canvas from "html2canvas";

type Message = {
  sender: "user" | "bot";
  text: string;
  time: string;
};

const Chatbot = () => {
  const location = useLocation();
  //const navigate = useNavigate();
  const colors = useThemeColors();
  const { user, getToken, getUserEmail } = useAuth();
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const messages = useSelector((s: RootState) => s.chat.messages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedModel, setSelectedModel] = useState<string>("Select Model");
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [lightMode, setLightMode] = useState<boolean>(true);
  const [isTakingScreenshot, setIsTakingScreenshot] = useState<boolean>(false);

  const models = [
    { provider: "Meta", models: ["meta-llama/llama-prompt-guard-2-8"] },
    {
      provider: "Moonshot AI",
      models: [
        "moonshotai/kimi-k2-instruct",
        "moonshotai/kimi-k2-instruct-0905 (Deprecated)",
      ],
    },
    {
      provider: "OpenAI",
      models: [
        "openai/gpt-oss-120b",
        "openai/gpt-oss-20b",
        "openai/gpt-oss-safeguard-20b",
        "whisper-large-v3",
        "whisper-large-v3-turbo",
      ],
    },
    {
      provider: "PlayAI",
      models: ["playai-tts", "playai-tts-arabic"],
    },
    {
      provider: "Groq",
      models: ["groq/compound", "groq/compound-mini"],
    },
    {
      provider: "Meta (Llama)",
      models: [
        "llama-3.1-8b-instant",
        "llama-3.3-70b-versatile",
        "meta-llama/llama-4-maverick-17b-12...",
        "meta-llama/llama-4-scout-17b-16e-i...",
        "meta-llama/llama-guard-4-12b",
        "meta-llama/llama-prompt-guard-2-2...",
        "meta-llama/llama-prompt-guard-2-8...",
      ],
    },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleThemeMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeMenuClose = () => {
    setThemeAnchorEl(null);
  };

  const handleModelSelect = (modelName: string) => {
    setSelectedModel(modelName);
    handleMenuClose();
    // Here you can add logic to switch the AI model
    console.log("Selected model:", modelName);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setLightMode(!newDarkMode);
    // Here you can add logic to switch to dark mode
    console.log("Dark Mode:", newDarkMode);
  };

  const handleLightModeToggle = () => {
    const newLightMode = !lightMode;
    setLightMode(newLightMode);
    setDarkMode(!newLightMode);
    // Here you can add logic to switch to light mode
    console.log("Light Mode:", newLightMode);
  };

  const handleImageUpload = () => {
    // Create a file input element
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("Image selected:", file.name);
        // Here you can add logic to handle the image upload
        // For example, upload to server or process the image
        // setInput(`[Image uploaded: ${file.name}]`);
        handleThemeMenuClose();
      }
    };

    input.click();
  };

  const takeScreenshot = async () => {
    try {
      setIsTakingScreenshot(true);

      // Get the chat container element
      const chatContainer = document.querySelector(
        ".chat-container"
      ) as HTMLElement;

      if (!chatContainer) {
        throw new Error("Chat container not found");
      }

      // Create a clone of the chat container to avoid affecting the original
      const clone = chatContainer.cloneNode(true) as HTMLElement;

      // Hide the confirmation dialog overlay if it's open in the clone
      const confirmDialog = clone.querySelector(
        '[style*="rgba(0, 0, 0, 0.5)"]'
      );
      if (confirmDialog) {
        (confirmDialog as HTMLElement).style.display = "none";
      }

      // Set the clone's position and size for the screenshot
      clone.style.position = "fixed";
      clone.style.top = "0";
      clone.style.left = "0";
      clone.style.width = chatContainer.offsetWidth + "px";
      clone.style.height = chatContainer.offsetHeight + "px";
      clone.style.zIndex = "-9999";
      clone.style.opacity = "0";
      document.body.appendChild(clone);

      // Use html2canvas to capture the screenshot
      const canvas = await html2canvas(clone, {
        backgroundColor: colors.background.white,
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        allowTaint: true,
      });

      // Remove the clone
      document.body.removeChild(clone);

      // Convert canvas to image URL
      const imageUrl = canvas.toDataURL("image/png");

      // Create a download link
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `chat-screenshot-${new Date()
        .toISOString()
        .slice(0, 10)}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Show success message
      setError("Screenshot saved successfully!");
      setTimeout(() => setError(null), 2000);
    } catch (error) {
      console.error("Error taking screenshot:", error);
      setError("Failed to take screenshot. Please try again.");
    } finally {
      setIsTakingScreenshot(false);
    }
  };

  const getAuthToken = (): string | null => {
    if (!getToken) {
      return sessionStorage.getItem("token");
    }
    return getToken();
  };

  const getCurrentUserEmail = (): string | undefined => {
    if (!getUserEmail) {
      return (
        user?.email || JSON.parse(sessionStorage.getItem("user") || "{}")?.email
      );
    }
    return getUserEmail();
  };

  const currentUserEmail = getCurrentUserEmail();
  const currentToken = getAuthToken();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getTime = useCallback(
    () =>
      new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    []
  );

  useEffect(() => {
    if (!open || !currentUserEmail || !currentToken) return;

    const loadHistory = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:8000/v-1/application/chatbot/history?user_email=${encodeURIComponent(
            currentUserEmail
          )}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${currentToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (res.ok) {
          const data = await res.json();
          dispatch(setHistory(data.messages));

          if (data.conversation_id) {
            setConversationId(data.conversation_id);
          }
        } else {
          console.error("Failed to load history:", await res.text());
        }
      } catch (error) {
        console.error("Failed to load chat history:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, [open, currentUserEmail, currentToken, dispatch]);

  useEffect(() => {
    // This runs when chat opens for the first time
    if (open && messages.length === 0 && !loading) {
      const greetingMessage: Message = {
        sender: "bot",
        text: "Hello! 👋 How can I help you today?", // Change this text if you want
        time: getTime(),
      };

      dispatch(addMessage(greetingMessage));
    }
  }, [open, messages.length, loading, dispatch, getTime]);

  useEffect(() => {
    return () => {
      dispatch(setHistory([]));
      setConversationId(null);
    };
  }, [dispatch]);

  if (
    location.pathname === "/welcome" ||
    location.pathname === "/signup" ||
    location.pathname === "/signin"
  )
    return null;

  // const getContextFromLocation = (): string => {
  //   const path = location.pathname;

  //   if (path.includes("/admin")) return "User is on admin dashboard";
  //   if (path.includes("/accountant")) return "User is an accountant";
  //   if (path.includes("/projects")) return "User is viewing projects";
  //   if (path.includes("/inventory")) return "User is viewing inventory";
  //   if (path.includes("/hr")) return "User is viewing HR section";

  //   return "General user context";
  // };

  const sendMessageToAPI = async (
    userMessage: string
  ): Promise<{ reply: string; conversation_id?: string }> => {
    try {
      //const context = getContextFromLocation();
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      console.log(
        "Sending to API:",
        JSON.stringify(
          {
            message: userMessage,
            //context: context,
            conversation_id: conversationId,
          },
          null,
          2
        )
      );

      const response = await fetch(
        "http://localhost:8000/v-1/application/chatbot/ask",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: userMessage,
            //context: context,
            conversation_id: conversationId,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        let errorData = {};
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }

        throw new Error(
          (errorData as any).detail ||
            (errorData as any).message ||
            `API error: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Error calling chatbot API:", error);
      throw error;
    }
  };

  // Add this function after the sendMessageToAPI function
  const clearChatFromDB = async () => {
    try {
      const token = getAuthToken();

      if (!token || !currentUserEmail) {
        console.error("Cannot clear chat: No token or email");
        return;
      }

      const response = await fetch(
        `http://localhost:8000/v-1/application/chatbot/clear-chat?user_email=${encodeURIComponent(
          currentUserEmail
        )}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to clear chat from DB:", errorText);
        setError("Failed to clear chat history from server.");
      }
    } catch (error) {
      console.error("Error clearing chat from DB:", error);
      setError("Failed to clear chat history.");
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || !user?.email) return;

    const userMsg: Message = {
      sender: "user",
      text: input,
      time: getTime(),
    };

    dispatch(addMessage(userMsg));
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const result = await sendMessageToAPI(input);

      if (result.conversation_id && !conversationId) {
        setConversationId(result.conversation_id);
      }

      const botReply: Message = {
        sender: "bot",
        text: result.reply,
        time: getTime(),
      };

      dispatch(addMessage(botReply));
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      setError(error.message || "Failed to get AI response. Please try again.");

      const errorReply: Message = {
        sender: "bot",
        text: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment.",
        time: getTime(),
      };

      dispatch(addMessage(errorReply));
    } finally {
      setLoading(false);
    }
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <>
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
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
          className="chat-container"
        >
          {/* Confirmation Dialog Overlay */}
          {openConfirmDialog && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10000,
                borderRadius: "16px",
              }}
            >
              <Box
                sx={{
                  backgroundColor: colors.background.white,
                  borderRadius: "12px",
                  padding: "20px",
                  width: "320px",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                }}
              >
                <Typography
                  fontWeight="bold"
                  color="text.primary"
                  mb={1}
                  fontSize="16px"
                >
                  Clear Chat History
                </Typography>
                <Typography variant="body2" color="text.primary" mb={3}>
                  Are you sure you want to delete all chat messages? This action
                  cannot be undone.
                </Typography>
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}
                >
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setOpenConfirmDialog(false)}
                    sx={{
                      textTransform: "none",
                      fontSize: "14px",
                      px: 2,
                      borderColor: colors.border.light,
                      color: colors.text.primary,
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={async () => {
                      setOpenConfirmDialog(false);
                      try {
                        // Clear from Redux state
                        dispatch(setHistory([]));
                        setConversationId(null);

                        // Clear from database
                        await clearChatFromDB();

                        // Show success message
                        setError("Chat cleared successfully!");
                        setTimeout(() => setError(null), 2000);
                      } catch (error) {
                        console.error("Error clearing chat:", error);
                        setError("Failed to clear chat. Please try again.");
                      }
                    }}
                    sx={{
                      textTransform: "none",
                      fontSize: "14px",
                      px: 2,
                      backgroundColor: colors.status.error,
                      "&:hover": {
                        backgroundColor: colors.status.error,
                      },
                    }}
                  >
                    Delete All
                  </Button>
                </Box>
              </Box>
            </Box>
          )}

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
            ref={messagesContainerRef}
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

            {/* Screenshot loading indicator */}
            {isTakingScreenshot && (
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
                  📸
                </Box>
                <Box
                  sx={{
                    backgroundColor: colors.primary.light,
                    px: 1.2,
                    py: 0.8,
                    borderRadius: "8px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <CircularProgress size={16} color="inherit" />
                  <Typography variant="body2">Taking screenshot...</Typography>
                </Box>
              </Box>
            )}

            <div ref={bottomRef} />
          </Box>
          {/* BUTTONS SECTION */}
          <Box
            sx={{
              //borderTop: `1px solid ${colors.border.light}`,
              p: 1,
              display: "flex",
              gap: 1,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Button
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                fontSize: "12px",
                textTransform: "none",
                borderRadius: "8px",
                borderColor: colors.border.light,
                color: colors.text.primary,
                "&:hover": {
                  borderColor: colors.primary.main,
                  backgroundColor: colors.primary.light + "20",
                },
              }}
            >
              <FullscreenIcon sx={{ fontSize: "15px", mr: 0.5 }} /> Full Screen
            </Button>
            <Button
              onClick={() =>
                window.open("https://chat.deepseek.com/", "_blank")
              }
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                fontSize: "12px",
                textTransform: "none",
                borderRadius: "8px",
                borderColor: colors.border.light,
                color: colors.text.primary,
                "&:hover": {
                  borderColor: colors.primary.main,
                  backgroundColor: colors.primary.light + "20",
                },
              }}
            >
              <AssistantIcon sx={{ fontSize: "small", mr: 0.5 }} /> Deep
              Research
            </Button>
            <Button
              onClick={() => setOpenConfirmDialog(true)}
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                fontSize: "12px",
                textTransform: "none",
                borderRadius: "8px",
                borderColor: colors.border.light,
                color: colors.text.primary,
                "&:hover": {
                  borderColor: colors.status.error,
                  backgroundColor: colors.status.error + "20",
                },
              }}
            >
              <DeleteForeverIcon sx={{ fontSize: "small", mr: 0.5 }} /> Clear
              Chat
            </Button>
            <Button
              variant="outlined"
              size="small"
              sx={{
                flex: 1,
                fontSize: "12px",
                textTransform: "none",
                borderRadius: "8px",
                borderColor: colors.border.light,
                color: colors.text.primary,
                "&:hover": {
                  borderColor: colors.primary.main,
                  backgroundColor: colors.primary.light + "20",
                },
              }}
            >
              <DvrIcon sx={{ mr: 0.5, fontSize: "15px" }} /> AI Slides
            </Button>
          </Box>

          <Box
            sx={{
              borderTop: `1px solid ${colors.border.light}`,
              gap: 2,
              pl: 1,
              display: "flex",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Tooltip title="Select AI Model">
              <IconButton
                onClick={handleMenuOpen}
                size="small"
                sx={{
                  color: colors.text.secondary,
                  "&:hover": { color: colors.primary.main },
                }}
              >
                <AutoAwesomeIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Take Screenshot">
              <IconButton
                onClick={takeScreenshot}
                size="small"
                disabled={isTakingScreenshot}
                sx={{
                  color: isTakingScreenshot
                    ? colors.text.disabled
                    : colors.text.secondary,
                  "&:hover": {
                    color: isTakingScreenshot
                      ? colors.text.disabled
                      : colors.primary.main,
                  },
                }}
              >
                {isTakingScreenshot ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  <span
                    style={{
                      display: "inline-block",
                      transform: "rotate(-90deg)",
                      fontSize: "20px",
                    }}
                  >
                    ✂
                  </span>
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Theme & Image">
              <IconButton
                onClick={handleThemeMenuOpen}
                size="small"
                sx={{
                  color: colors.text.secondary,
                  "&:hover": { color: colors.primary.main },
                }}
              >
                <TuneIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Scroll to History Top">
              <IconButton
                onClick={() => {
                  if (messagesContainerRef.current) {
                    messagesContainerRef.current.scrollTop = 0;
                  }
                }}
                size="small"
                sx={{
                  color: colors.text.secondary,
                  "&:hover": { color: colors.primary.main },
                }}
              >
                <HistoryIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          {/* INPUT */}
          <Box
            sx={{
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
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && sendMessage()
              }
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
                color:
                  input.trim() && !loading
                    ? colors.primary.main
                    : colors.text.disabled,
                "&:hover": {
                  backgroundColor:
                    input.trim() && !loading
                      ? colors.primary.light
                      : "transparent",
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

          {/* AI MODEL MENU */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            sx={{
              zIndex: 10001,
              "& .MuiPaper-root": {
                marginTop: "-8px",
                zIndex: 10001,
              },
            }}
            PaperProps={{
              sx: {
                maxHeight: 400,
                width: 320,
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                zIndex: 10001,
              },
            }}
            disablePortal={false}
            container={() => document.querySelector(".chat-container")}
            style={{ zIndex: 10001 }}
          >
            <Box
              sx={{
                p: 1.5,
                borderBottom: `1px solid ${colors.border.light}`,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="text.primary"
              >
                Select AI Model
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Currently selected: {selectedModel}
              </Typography>
            </Box>

            <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
              {models.map((providerGroup, index) => (
                <Box key={index}>
                  <Typography
                    variant="caption"
                    sx={{
                      px: 2,
                      py: 1,
                      display: "block",
                      fontWeight: "bold",
                      color: colors.text.secondary,
                      backgroundColor: colors.background.lightGray,
                    }}
                  >
                    {providerGroup.provider}
                  </Typography>
                  {providerGroup.models.map((model, modelIndex) => (
                    <MenuItem
                      key={modelIndex}
                      onClick={() => handleModelSelect(model)}
                      sx={{
                        fontSize: "13px",
                        py: 1,
                        borderLeft: `3px solid ${
                          selectedModel === model
                            ? colors.primary.main
                            : "transparent"
                        }`,
                        backgroundColor:
                          selectedModel === model
                            ? colors.primary.light + "20"
                            : "transparent",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: colors.text.primary,
                          fontFamily: model.includes("Deprecated")
                            ? "'Courier New', monospace"
                            : "inherit",
                          opacity: model.includes("Deprecated") ? 0.7 : 1,
                        }}
                      >
                        {model}
                      </Typography>
                    </MenuItem>
                  ))}
                </Box>
              ))}
            </Box>
          </Menu>

          {/* THEME & IMAGE MENU */}
          <Menu
            anchorEl={themeAnchorEl}
            open={Boolean(themeAnchorEl)}
            onClose={handleThemeMenuClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            sx={{
              zIndex: 10001,
              "& .MuiPaper-root": {
                marginTop: "-8px",
                zIndex: 10001,
              },
            }}
            PaperProps={{
              sx: {
                width: 250,
                borderRadius: "8px",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.15)",
                zIndex: 10001,
              },
            }}
            disablePortal={false}
            container={() => document.querySelector(".chat-container")}
            style={{ zIndex: 10001 }}
          >
            <Box
              sx={{
                p: 1.5,
                borderBottom: `1px solid ${colors.border.light}`,
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="bold"
                color="text.primary"
              >
                Theme & Image
              </Typography>
            </Box>

            {/* Dark Mode Option */}
            <MenuItem
              onClick={handleDarkModeToggle}
              sx={{
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon>
                <DarkModeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Dark Mode" />
              <Switch
                size="small"
                checked={darkMode}
                onChange={handleDarkModeToggle}
                onClick={(e) => e.stopPropagation()}
              />
            </MenuItem>

            {/* Light Mode Option */}
            <MenuItem
              onClick={handleLightModeToggle}
              sx={{
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon>
                <LightModeIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Light Mode" />
              <Switch
                size="small"
                checked={lightMode}
                onChange={handleLightModeToggle}
                onClick={(e) => e.stopPropagation()}
              />
            </MenuItem>

            {/* Image Upload Option */}
            <MenuItem
              onClick={handleImageUpload}
              sx={{
                py: 1.5,
                px: 2,
              }}
            >
              <ListItemIcon>
                <ImageIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Image" />
            </MenuItem>
          </Menu>
        </Box>
      )}
    </>
  );
};

export default Chatbot;

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
  ThemeProvider,
  createTheme,
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
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import TuneIcon from "@mui/icons-material/Tune";
import DvrIcon from "@mui/icons-material/Dvr";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import ImageIcon from "@mui/icons-material/Image";
import html2canvas from "html2canvas";

type Message = {
  sender: "user" | "bot";
  text: string;
  time: string;
};

const Chatbot = () => {
  const location = useLocation();
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
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [selectedModelId, setSelectedModelId] = useState<string>(
    "llama-3.3-70b-versatile"
  );
  const [mode, setMode] = useState<"light" | "dark">("light");

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

  // Create theme based on mode
  const theme = createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "dark" ? "#90caf9" : colors.primary.main,
      },
      background: {
        default: mode === "dark" ? "#121212" : "#ffffff",
        paper: mode === "dark" ? "#1e1e1e" : colors.background.white,
      },
      text: {
        primary: mode === "dark" ? "#ffffff" : colors.text.primary,
        secondary: mode === "dark" ? "#b0b0b0" : colors.text.secondary,
      },
      divider: mode === "dark" ? "#333" : colors.border.light,
    },
  });

  // Handle Escape key to exit full screen
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isFullScreen) {
        setIsFullScreen(false);
      }
    };

    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isFullScreen]);

  // Load saved preferences
  useEffect(() => {
    const savedFullScreen = localStorage.getItem("chatFullScreen");
    if (savedFullScreen) {
      setIsFullScreen(JSON.parse(savedFullScreen));
    }

    const savedTheme = localStorage.getItem("chatTheme");
    if (savedTheme) {
      const themeMode = JSON.parse(savedTheme) as "light" | "dark";
      setMode(themeMode);
      setDarkMode(themeMode === "dark");
      setLightMode(themeMode === "light");
    }
  }, []);

  // Save preferences
  useEffect(() => {
    localStorage.setItem("chatFullScreen", JSON.stringify(isFullScreen));
  }, [isFullScreen]);

  useEffect(() => {
    localStorage.setItem("chatTheme", JSON.stringify(mode));
  }, [mode]);

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
    const modelId = modelName.split(" (")[0];
    setSelectedModelId(modelId);
    handleMenuClose();
    console.log("Selected model:", modelId);
  };

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    setLightMode(!newDarkMode);
    setMode(newDarkMode ? "dark" : "light");
    console.log("Dark Mode:", newDarkMode);
  };

  const handleLightModeToggle = () => {
    const newLightMode = !lightMode;
    setLightMode(newLightMode);
    setDarkMode(!newLightMode);
    setMode(newLightMode ? "light" : "dark");
    console.log("Light Mode:", newLightMode);
  };

  const handleImageUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log("Image selected:", file.name);
        handleThemeMenuClose();
      }
    };

    input.click();
  };

  const takeScreenshot = async () => {
    try {
      setIsTakingScreenshot(true);

      const chatContainer = document.querySelector(
        ".chat-container"
      ) as HTMLElement;

      if (!chatContainer) {
        throw new Error("Chat container not found");
      }

      const originalStyles = {
        position: chatContainer.style.position,
        top: chatContainer.style.top,
        left: chatContainer.style.left,
        transform: chatContainer.style.transform,
        zIndex: chatContainer.style.zIndex,
      };

      chatContainer.style.position = "fixed";
      chatContainer.style.top = "0";
      chatContainer.style.left = "0";
      chatContainer.style.transform = "none";
      chatContainer.style.zIndex = "99999";

      await new Promise((resolve) => setTimeout(resolve, 100));

      const canvas = await html2canvas(chatContainer, {
        backgroundColor: mode === "dark" ? "#1e1e1e" : colors.background.white,
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        removeContainer: true,

        x: 0,
        y: 0,
        scrollX: -window.scrollX,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.scrollWidth,
        windowHeight: document.documentElement.scrollHeight,

        onclone: (clonedDocument) => {
          const clonedContainer =
            clonedDocument.querySelector(".chat-container");
          if (clonedContainer) {
            (clonedContainer as HTMLElement).style.position = "fixed";
            (clonedContainer as HTMLElement).style.top = "0";
            (clonedContainer as HTMLElement).style.left = "0";
            (clonedContainer as HTMLElement).style.transform = "none";

            const confirmDialogs = clonedContainer.querySelectorAll(
              '[style*="rgba(0, 0, 0, 0.5)"]'
            );
            confirmDialogs.forEach((dialog) => {
              (dialog as HTMLElement).style.display = "none";
            });
          }
        },
      });

      Object.assign(chatContainer.style, originalStyles);

      const imageUrl = canvas.toDataURL("image/png", 1.0);

      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `chat-screenshot-${new Date()
        .toISOString()
        .slice(0, 10)}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
    if (open && messages.length === 0 && !loading) {
      const greetingMessage: Message = {
        sender: "bot",
        text: "Hello! 👋 How can I help you today?",
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

  const sendMessageToAPI = async (
    userMessage: string
  ): Promise<{ reply: string; conversation_id?: string }> => {
    try {
      const token = getAuthToken();

      if (!token) {
        throw new Error("Authentication required. Please log in again.");
      }

      console.log(
        "Sending to API:",
        JSON.stringify(
          {
            message: userMessage,
            model: selectedModelId,
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
            model: selectedModelId,
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
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              position: "fixed",
              bottom: isFullScreen ? "0" : "20px",
              right: isFullScreen ? "0" : "20px",
              width: isFullScreen ? "calc(100vw - 40px)" : "540px",
              height: isFullScreen ? "calc(100vh - 40px)" : "650px",
              backgroundColor:
                mode === "dark" ? "#1e1e1e" : colors.background.white,
              borderRadius: isFullScreen ? "20px" : "16px",
              display: "flex",
              flexDirection: "column",
              zIndex: 9999,
              boxShadow: isFullScreen
                ? "0px 8px 40px rgba(0,0,0,0.3)"
                : "0px 8px 30px rgba(0,0,0,0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              ...(isFullScreen && {
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                bottom: "auto",
                right: "auto",
              }),
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
                  borderRadius: "inherit",
                }}
              >
                <Box
                  sx={{
                    backgroundColor:
                      mode === "dark" ? "#2a2a2a" : colors.background.white,
                    borderRadius: "12px",
                    padding: "20px",
                    width: "320px",
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
                  }}
                >
                  <Typography
                    fontWeight="bold"
                    color={mode === "dark" ? "#ffffff" : colors.text.primary}
                    mb={1}
                    fontSize="16px"
                  >
                    Clear Chat History
                  </Typography>
                  <Typography
                    variant="body2"
                    color={mode === "dark" ? "#b0b0b0" : colors.text.primary}
                    mb={3}
                  >
                    Are you sure you want to delete all chat messages? This
                    action cannot be undone.
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
                        borderColor:
                          mode === "dark" ? "#555" : colors.border.light,
                        color:
                          mode === "dark" ? "#ffffff" : colors.text.primary,
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
                          dispatch(setHistory([]));
                          setConversationId(null);
                          await clearChatFromDB();
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
                backgroundColor: mode === "dark" ? "#333" : colors.primary.main,
                color: "#fff",
                padding: "12px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderTopLeftRadius: "inherit",
                borderTopRightRadius: "inherit",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography fontWeight="bold">
                  <span style={{ fontSize: "30px" }}>🤖 </span>AI Assistant
                  {isFullScreen && " (Full Screen)"}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {isFullScreen && (
                  <Tooltip title="Exit Full Screen">
                    <IconButton
                      size="small"
                      sx={{ color: "#fff" }}
                      onClick={() => setIsFullScreen(false)}
                    >
                      <FullscreenIcon />
                    </IconButton>
                  </Tooltip>
                )}
                <IconButton
                  size="small"
                  sx={{ color: "#fff" }}
                  onClick={() => {
                    setOpen(false);
                    setIsFullScreen(false);
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            </Box>

            {/* MESSAGES */}
            <Box
              ref={messagesContainerRef}
              sx={{
                flex: 1,
                p: 2,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                backgroundColor: mode === "dark" ? "#121212" : "transparent",
              }}
            >
              {messages.map((msg, i) => (
                <Box
                  key={i}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    alignSelf:
                      msg.sender === "user" ? "flex-end" : "flex-start",
                    flexDirection:
                      msg.sender === "user" ? "row-reverse" : "row",
                    maxWidth: "85%",
                    position: "relative",
                  }}
                >
                  {/* Icon */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1.5,
                      fontSize: "18px",
                      color:
                        mode === "dark" ? "#b0b0b0" : colors.text.secondary,
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
                            ? mode === "dark"
                              ? "#2d3b4d"
                              : colors.primary.light
                            : mode === "dark"
                            ? "#2a2a2a"
                            : colors.background.lightGray,
                        px: 2,
                        py: 1.2,
                        borderRadius: "12px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                        maxWidth: "100%",
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        lineHeight: 1.5,
                        color: mode === "dark" ? "#ffffff" : "inherit",
                      }}
                    >
                      {msg.text}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "10px",
                        color:
                          mode === "dark" ? "#b0b0b0" : colors.text.secondary,

                        textAlign: msg.sender === "user" ? "left" : "right",

                        marginTop: "3px",

                        paddingLeft: msg.sender === "user" ? "6px" : 0,
                        paddingRight: msg.sender === "user" ? 0 : "6px",

                        opacity: 1,
                        transition: "opacity 0.2s ease",
                        height: "14px",
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
                    gap: 1,
                    alignSelf: "flex-start",
                    maxWidth: "85%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1.5,
                      fontSize: "18px",
                      color:
                        mode === "dark" ? "#b0b0b0" : colors.text.secondary,
                    }}
                  >
                    🤖
                  </Box>
                  <Box
                    sx={{
                      backgroundColor:
                        mode === "dark"
                          ? "#2a2a2a"
                          : colors.background.lightGray,
                      px: 2,
                      py: 1.2,
                      borderRadius: "12px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      color: mode === "dark" ? "#ffffff" : "inherit",
                    }}
                  >
                    <CircularProgress
                      size={18}
                      color={mode === "dark" ? "inherit" : "primary"}
                    />
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
                    gap: 1,
                    alignSelf: "flex-start",
                    maxWidth: "85%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mt: 1.5,
                      fontSize: "18px",
                      color:
                        mode === "dark" ? "#b0b0b0" : colors.text.secondary,
                    }}
                  >
                    📸
                  </Box>
                  <Box
                    sx={{
                      backgroundColor:
                        mode === "dark" ? "#2d3b4d" : colors.primary.light,
                      px: 2,
                      py: 1.2,
                      borderRadius: "12px",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.12)",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.2,
                      color: mode === "dark" ? "#ffffff" : "inherit",
                    }}
                  >
                    <CircularProgress size={18} color="inherit" />
                    <Typography variant="body2">
                      Taking screenshot...
                    </Typography>
                  </Box>
                </Box>
              )}

              <div ref={bottomRef} />
            </Box>
            {/* BUTTONS SECTION */}
            <Box
              sx={{
                p: isFullScreen ? 2 : 1,
                display: "flex",
                gap: 1,
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: mode === "dark" ? "#1e1e1e" : "transparent",
              }}
            >
              <Button
                variant="outlined"
                size="small"
                onClick={() => setIsFullScreen(!isFullScreen)}
                sx={{
                  flex: 1,
                  fontSize: "12px",
                  textTransform: "none",
                  borderRadius: "8px",
                  borderColor: mode === "dark" ? "#555" : colors.border.light,
                  color: mode === "dark" ? "#ffffff" : colors.text.primary,
                  "&:hover": {
                    borderColor:
                      mode === "dark" ? "#90caf9" : colors.primary.main,
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(144, 202, 249, 0.08)"
                        : colors.primary.light + "20",
                  },
                }}
              >
                <FullscreenIcon sx={{ fontSize: "15px", mr: 0.5 }} />
                {isFullScreen ? "Exit Full Screen" : "Full Screen"}
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
                  borderColor: mode === "dark" ? "#555" : colors.border.light,
                  color: mode === "dark" ? "#ffffff" : colors.text.primary,
                  "&:hover": {
                    borderColor:
                      mode === "dark" ? "#90caf9" : colors.primary.main,
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(144, 202, 249, 0.08)"
                        : colors.primary.light + "20",
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
                  borderColor: mode === "dark" ? "#555" : colors.border.light,
                  color: mode === "dark" ? "#ffffff" : colors.text.primary,
                  "&:hover": {
                    borderColor: colors.status.error,
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(244, 67, 54, 0.08)"
                        : colors.status.error + "20",
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
                  borderColor: mode === "dark" ? "#555" : colors.border.light,
                  color: mode === "dark" ? "#ffffff" : colors.text.primary,
                  "&:hover": {
                    borderColor:
                      mode === "dark" ? "#90caf9" : colors.primary.main,
                    backgroundColor:
                      mode === "dark"
                        ? "rgba(144, 202, 249, 0.08)"
                        : colors.primary.light + "20",
                  },
                }}
              >
                <DvrIcon sx={{ mr: 0.5, fontSize: "15px" }} /> AI Slides
              </Button>
            </Box>

            <Box
              sx={{
                borderTop: `1px solid ${
                  mode === "dark" ? "#333" : colors.border.light
                }`,
                gap: 2,
                pl: 1,
                display: "flex",
                alignItems: "center",
                position: "relative",
                backgroundColor: mode === "dark" ? "#1e1e1e" : "transparent",
              }}
            >
              <Tooltip title="Select AI Model">
                <IconButton
                  onClick={handleMenuOpen}
                  size="small"
                  sx={{
                    color: mode === "dark" ? "#b0b0b0" : colors.primary.main,
                    "&:hover": {
                      color: mode === "dark" ? "#90caf9" : colors.primary.main,
                    },
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
                      ? colors.primary.main
                      : mode === "dark"
                      ? "#b0b0b0"
                      : colors.primary.main,
                    "&:hover": {
                      color: isTakingScreenshot
                        ? colors.text.disabled
                        : mode === "dark"
                        ? "#90caf9"
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
                        color: mode === "dark" ? "#b0b0b0" : "inherit",
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
                    color: mode === "dark" ? "#b0b0b0" : colors.primary.main,
                    "&:hover": {
                      color: mode === "dark" ? "#90caf9" : colors.primary.main,
                    },
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
                    color: mode === "dark" ? "#b0b0b0" : colors.primary.main,
                    "&:hover": {
                      color: mode === "dark" ? "#90caf9" : colors.primary.main,
                    },
                  }}
                >
                  <HistoryIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            {/* INPUT */}
            <Box
              sx={{
                p: isFullScreen ? 2 : 1,
                display: "flex",
                gap: 1,
                alignItems: "center",
                backgroundColor: mode === "dark" ? "#1e1e1e" : "transparent",
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
                    backgroundColor:
                      mode === "dark" ? "#2a2a2a" : "transparent",
                    "& fieldset": {
                      borderColor:
                        mode === "dark" ? "#555" : colors.border.light,
                    },
                    "&:hover fieldset": {
                      borderColor:
                        mode === "dark" ? "#777" : colors.border.light,
                    },
                    "&.Mui-focused fieldset": {
                      borderColor:
                        mode === "dark" ? "#90caf9" : colors.border.light,
                    },
                    "& .MuiInputBase-input": {
                      color: mode === "dark" ? "#ffffff" : "inherit",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: mode === "dark" ? "#888" : "inherit",
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
                      ? mode === "dark"
                        ? "#90caf9"
                        : colors.primary.main
                      : colors.text.disabled,
                  "&:hover": {
                    backgroundColor:
                      input.trim() && !loading
                        ? mode === "dark"
                          ? "rgba(144, 202, 249, 0.08)"
                          : colors.primary.light
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
                  backgroundColor: mode === "dark" ? "#2a2a2a" : "#ffffff",
                },
              }}
              disablePortal={false}
              container={() => document.querySelector(".chat-container")}
              style={{ zIndex: 10001 }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderBottom: `1px solid ${
                    mode === "dark" ? "#333" : colors.border.light
                  }`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color={mode === "dark" ? "#ffffff" : colors.text.primary}
                >
                  Select AI Model
                </Typography>
                <Typography
                  variant="caption"
                  color={mode === "dark" ? "#b0b0b0" : colors.text.secondary}
                >
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
                        color:
                          mode === "dark" ? "#b0b0b0" : colors.text.secondary,
                        backgroundColor:
                          mode === "dark"
                            ? "#333"
                            : colors.background.lightGray,
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
                              ? mode === "dark"
                                ? "#90caf9"
                                : colors.primary.main
                              : "transparent"
                          }`,
                          backgroundColor:
                            selectedModel === model
                              ? mode === "dark"
                                ? "rgba(144, 202, 249, 0.08)"
                                : colors.primary.light + "20"
                              : "transparent",
                          color:
                            mode === "dark" ? "#ffffff" : colors.text.primary,
                          "&:hover": {
                            backgroundColor:
                              mode === "dark"
                                ? "#333"
                                : colors.background.lightGray,
                          },
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color:
                              mode === "dark" ? "#ffffff" : colors.text.primary,
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
                  backgroundColor: mode === "dark" ? "#2a2a2a" : "#ffffff",
                },
              }}
              disablePortal={false}
              container={() => document.querySelector(".chat-container")}
              style={{ zIndex: 10001 }}
            >
              <Box
                sx={{
                  p: 1.5,
                  borderBottom: `1px solid ${
                    mode === "dark" ? "#333" : colors.border.light
                  }`,
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontWeight="bold"
                  color={mode === "dark" ? "#ffffff" : colors.text.primary}
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
                  color: mode === "dark" ? "#ffffff" : colors.text.primary,
                }}
              >
                <ListItemIcon>
                  <DarkModeIcon
                    fontSize="small"
                    color={mode === "dark" ? "inherit" : "action"}
                  />
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
                  color: mode === "dark" ? "#ffffff" : colors.text.primary,
                }}
              >
                <ListItemIcon>
                  <LightModeIcon
                    fontSize="small"
                    color={mode === "dark" ? "inherit" : "action"}
                  />
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
                  color: mode === "dark" ? "#ffffff" : colors.text.primary,
                }}
              >
                <ListItemIcon>
                  <ImageIcon
                    fontSize="small"
                    color={mode === "dark" ? "inherit" : "action"}
                  />
                </ListItemIcon>
                <ListItemText primary="Image" />
              </MenuItem>
            </Menu>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
};

export default Chatbot;

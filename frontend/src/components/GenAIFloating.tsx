import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
} from "@mui/material";

import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import ScienceIcon from "@mui/icons-material/Science";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import TuneIcon from "@mui/icons-material/Tune";
import HistoryIcon from "@mui/icons-material/History";

const SEND_BG = "#8f6bff";
const HEADER_HEIGHT = 64;
const DARK_BG = "#0f0f10";
const DARK_PANEL = "#1a1a1d";
const DARK_CARD = "#232327";
const DARK_BORDER = "#2f2f33";
const DARK_TEXT = "#eaeaea";
const DARK_MUTED = "#9a9a9a";

interface ChatMsg {
  role: "user" | "assistant";
  message: string;
}

const actionBtnSx = (dark: boolean) => ({
  textTransform: "none",
  fontSize: 11,
  minWidth: "auto",
  padding: "4px 6px",
  whiteSpace: "nowrap",
  color: dark ? DARK_TEXT : "#000",
  "& .MuiButton-startIcon": {
    color: dark ? DARK_TEXT : "#000",
  },
});

const GenAIFloatingDialog: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [fullScreen, setFullScreen] = useState(false);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem("token");
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, loading]);

  useEffect(() => {
    if (!open || !token) return;
    fetch("http://localhost:5000/api/chat/history", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setChats(Array.isArray(data) ? data : []));
  }, [open, token]);

  const sendMessage = async () => {
    if (!message.trim() || loading || !token) return;
    const text = message;
    setChats(prev => [...prev, { role: "user", message: text }]);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setChats(prev => [...prev, { role: "assistant", message: data.reply || "No reply" }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    if (!token) return;
    await fetch("http://localhost:5000/api/chat/clear", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setChats([]);
  };

  const openDeepResearch = () => {
    window.open("https://chat.openai.com", "_blank");
  };

  const takeScreenshot = async () => {
    if (!chatContainerRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(chatContainerRef.current);
    const link = document.createElement("a");
    link.download = "chat.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const toggleTheme = () => setDarkMode(p => !p);

  const scrollToTop = () => {
    chatContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {!open && (
        <Box
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 20,
            right: 20,
            width: 48,
            height: 48,
            borderRadius: "12px",
            background: SEND_BG,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            cursor: "pointer",
            zIndex: 1500,
          }}
        >
          <AutoAwesomeIcon />
        </Box>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={fullScreen}
        PaperProps={{
          sx: {
            m: 0,
            ml: "auto",
            position: "fixed",
            right: 0,
            width: fullScreen ? "100vw" : 420,
            height: fullScreen ? "100vh" : `calc(100vh - ${HEADER_HEIGHT}px)`,
            mt: fullScreen ? 0 : `${HEADER_HEIGHT}px`,
            borderRadius: fullScreen ? 0 : "16px 0 0 16px",
          },
        }}
      >
        <Box
          sx={{
            height: 56,
            px: 2,
            background: SEND_BG,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography fontWeight={600}>✨ AI Assistant</Typography>
          <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <DialogContent
          sx={{
            p: 0,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            background: darkMode ? DARK_BG : "#fff",
          }}
        >
          <Box
            ref={chatContainerRef}
            sx={{
              flex: 1,
              p: 2,
              overflowY: "auto",
              background: darkMode ? DARK_PANEL : "#fff",
            }}
          >
            {chats.map((c, i) => (
              <Box
                key={i}
                sx={{
                  mb: 1,
                  display: "flex",
                  justifyContent: c.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <Box
                  sx={{
                    px: 1.5,
                    py: 1,
                    borderRadius: 2,
                    maxWidth: "75%",
                    fontSize: 14,
                    background:
                      c.role === "user"
                        ? SEND_BG
                        : darkMode
                        ? DARK_CARD
                        : "#f0f0f0",
                    color:
                      c.role === "user"
                        ? "#fff"
                        : darkMode
                        ? DARK_TEXT
                        : "#000",
                  }}
                >
                  {c.message}
                </Box>
              </Box>
            ))}
            {loading && (
              <Typography fontSize={12} sx={{ color: DARK_MUTED }}>
                AI is typing…
              </Typography>
            )}
            <div ref={bottomRef} />
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              px: 1,
              py: 0.75,
              borderTop: `1px solid ${darkMode ? DARK_BORDER : "#eee"}`,
              background: darkMode ? DARK_CARD : "#fafafa",
              flexWrap: "nowrap",
              overflow: "hidden",
            }}
          >
            <Button sx={actionBtnSx(darkMode)} startIcon={<FullscreenIcon />} onClick={() => setFullScreen(p => !p)}>
              Full Screen
            </Button>
            <Button sx={actionBtnSx(darkMode)} startIcon={<ScienceIcon />} onClick={openDeepResearch}>
              Deep Research
            </Button>
            <Button sx={actionBtnSx(darkMode)} startIcon={<DeleteOutlineIcon />} onClick={clearChat}>
              Clear Chat
            </Button>
            <Button sx={actionBtnSx(darkMode)} startIcon={<SlideshowIcon />}>
              AI Slides
            </Button>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              px: 1.5,
              py: 0.5,
              borderBottom: `1px solid ${darkMode ? DARK_BORDER : "#eee"}`,
              background: darkMode ? DARK_PANEL : "#fff",
            }}
          >
            <IconButton size="small" onClick={takeScreenshot}>
              <ContentCutIcon sx={{ color: darkMode ? DARK_MUTED : "#555" }} />
            </IconButton>
            <IconButton size="small" onClick={toggleTheme}>
              <TuneIcon sx={{ color: darkMode ? DARK_MUTED : "#555" }} />
            </IconButton>
            <IconButton size="small" onClick={scrollToTop}>
              <HistoryIcon sx={{ color: darkMode ? DARK_MUTED : "#555" }} />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              background: darkMode ? DARK_BG : "#fff",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Type your message…"
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              InputProps={{
                sx: {
                  background: darkMode ? DARK_CARD : "#fff",
                  color: darkMode ? DARK_TEXT : "#000",
                  borderRadius: "8px",
                  "& fieldset": {
                    borderColor: darkMode ? DARK_BORDER : "#ccc",
                  },
                },
              }}
            />
            <IconButton onClick={sendMessage} sx={{ background: SEND_BG, color: "#fff" }}>
              <SendIcon />
            </IconButton>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GenAIFloatingDialog;

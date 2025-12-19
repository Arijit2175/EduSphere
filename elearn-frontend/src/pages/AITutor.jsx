import { Box, TextField, Button, Typography, Paper, Avatar, Stack, IconButton, Card, CardContent, Divider, Menu, MenuItem, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import SendIcon from "@mui/icons-material/Send";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import RefreshIcon from "@mui/icons-material/Refresh";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import { useSidebar } from "../contexts/SidebarContext";

const MotionPaper = motion(Paper);

export default function AITutor() {
  const { isOpen } = useSidebar();
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Tutor. Ask me anything about any topic!", sender: "ai" },
  ]);
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNewChat = () => {
    if (messages.length > 1) {
      const chatTitle = messages.find((m) => m.sender === "user")?.text?.slice(0, 50) || "Untitled Chat";
      const newHistoryItem = {
        id: Date.now().toString(),
        title: chatTitle,
        messages: messages,
        timestamp: new Date().toLocaleString(),
      };
      setChatHistory((prev) => [newHistoryItem, ...prev]);
    }

    setCurrentChatId(null);
    setMessages([{ id: 1, text: "Hello! I'm your AI Tutor. Ask me anything about any topic!", sender: "ai" }]);
    setInput("");
  };

  const handleLoadChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
    }
  };

  const handleDeleteChat = (chatId, e) => {
    e.stopPropagation();
    setChatHistory((prev) => prev.filter((c) => c.id !== chatId));
    if (currentChatId === chatId) {
      handleNewChat();
    }
  };

  const handleClearChat = () => {
    setMessages([{ id: 1, text: "Hello! I'm your AI Tutor. Ask me anything about any topic!", sender: "ai" }]);
    setInput("");
    setCurrentChatId(null);
    handleMenuClose();
  };

  const handleCopyLastMessage = () => {
    if (messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      navigator.clipboard.writeText(lastMessage.text);
      handleMenuClose();
    }
  };

  const handleExportChat = () => {
    const chatText = messages.map((m) => `${m.sender.toUpperCase()}: ${m.text}`).join("\n\n");
    const element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(chatText));
    element.setAttribute("download", `chat-${new Date().toISOString().slice(0, 10)}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    handleMenuClose();
  };

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: "user" }]);
      setInput("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "That's a great question! Let me explain that for you...",
            sender: "ai",
          },
        ]);
      }, 500);
    }
  };

  const suggestedPrompts = [
    { icon: "📚", text: "Explain quantum physics" },
    { icon: "💻", text: "Help me with Python" },
    { icon: "🧮", text: "Solve this math problem" },
    { icon: "📝", text: "Write an essay outline" },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          background: "#fff",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "row",
            // Remove left margin to sit flush with the permanent Drawer Sidebar
            ml: 0,
          }}
        >
          {/* Chat History Sidebar */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              width: 260,
              background: "#f9fafb",
              borderRight: "1px solid #e5e7eb",
            }}
          >
            <Box sx={{ p: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleNewChat}
                sx={{
                  background: "#667eea",
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                New Chat
              </Button>
            </Box>

            <Divider />

            <Box sx={{ flexGrow: 1, overflowY: "auto", p: 1 }}>
              {chatHistory.length === 0 ? (
                <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", p: 2, textAlign: "center" }}>
                  No chat history yet
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {chatHistory.map((chat) => (
                    <Box
                      key={chat.id}
                      onClick={() => handleLoadChat(chat.id)}
                      sx={{
                        p: 2,
                        borderRadius: 1,
                        background: currentChatId === chat.id ? "#e0e7ff" : "transparent",
                        cursor: "pointer",
                        border: "1px solid transparent",
                        transition: "all 0.2s",
                        "&:hover": {
                          background: currentChatId === chat.id ? "#e0e7ff" : "#f3f4f6",
                          border: "1px solid #e5e7eb",
                        },
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: 1,
                      }}
                    >
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: currentChatId === chat.id ? 600 : 500,
                            color: currentChatId === chat.id ? "#667eea" : "#374151",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {chat.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", fontSize: "0.7rem" }}>
                          {chat.timestamp}
                        </Typography>
                      </Box>
                      <Tooltip title="Delete">
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteChat(chat.id, e)}
                          sx={{ color: "#ef4444", opacity: 0.6, "&:hover": { opacity: 1 } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          </Box>

          {/* Main Chat Area */}
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
            {/* Messages Container */}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflowY: "auto", backgroundColor: "#fff" }}>
              {messages.length === 1 ? (
                <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", p: 3 }}>
                  <Avatar sx={{ width: 80, height: 80, background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", fontSize: "2.5rem", mb: 2 }}>
                    🤖
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, textAlign: "center" }}>
                    AI Tutor
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666", mb: 4, textAlign: "center", maxWidth: 400 }}>
                    24/7 intelligent learning companion - Ask me anything about any topic!
                  </Typography>

                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 2, width: "100%", maxWidth: 600 }}>
                    {suggestedPrompts.map((prompt, i) => (
                      <Button
                        key={i}
                        onClick={() => setInput(prompt.text)}
                        sx={{
                          p: 2.5,
                          border: "1px solid #e5e7eb",
                          borderRadius: 2,
                          textAlign: "left",
                          color: "#374151",
                          textTransform: "none",
                          transition: "all 0.2s",
                          background: "#f9fafb",
                          "&:hover": { background: "#f3f4f6", borderColor: "#d1d5db" },
                        }}
                      >
                        <Stack spacing={0.5}>
                          <Typography sx={{ fontSize: "1.5rem" }}>{prompt.icon}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {prompt.text}
                          </Typography>
                        </Stack>
                      </Button>
                    ))}
                  </Box>
                </Box>
              ) : (
                <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2.5 }}>
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ display: "flex", justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}
                    >
                      <Box sx={{ display: "flex", gap: 2, maxWidth: "80%", alignItems: "flex-end", flexDirection: msg.sender === "user" ? "row-reverse" : "row" }}>
                        {msg.sender === "ai" && (
                          <Avatar sx={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", fontWeight: 700, width: 32, height: 32, fontSize: "1rem" }}>
                            🤖
                          </Avatar>
                        )}
                        <Paper
                          sx={{
                            p: 2,
                            background: msg.sender === "user" ? "#667eea" : "#f3f4f6",
                            color: msg.sender === "user" ? "white" : "#1f2937",
                            borderRadius: 2,
                            boxShadow: msg.sender === "user" ? "0 4px 6px rgba(102, 126, 234, 0.1)" : "none",
                          }}
                        >
                          <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                            {msg.text}
                          </Typography>
                        </Paper>
                      </Box>
                    </motion.div>
                  ))}
                </Box>
              )}
            </Box>

            {/* Input Area - Fixed at Bottom */}
            <Box sx={{ p: 3, borderTop: "1px solid #e5e7eb", background: "#fff" }}>
              <Box sx={{ maxWidth: "100%", mx: "auto" }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                  <IconButton size="small" onClick={handleMenuOpen} sx={{ color: "#667eea" }}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: "top", horizontal: "left" }}
                    transformOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    <MenuItem onClick={handleCopyLastMessage} disabled={messages.length <= 1}>
                      <ContentCopyIcon fontSize="small" sx={{ mr: 1 }} />
                      Copy last message
                    </MenuItem>
                    <MenuItem onClick={handleExportChat}>
                      <Box sx={{ mr: 1 }}>📥</Box>
                      Export chat
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleClearChat}>
                      <RefreshIcon fontSize="small" sx={{ mr: 1 }} />
                      Clear conversation
                    </MenuItem>
                  </Menu>
                  <TextField
                    fullWidth
                    placeholder="Ask anything..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    multiline
                    maxRows={4}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        backgroundColor: "#f9fafb",
                        "&.Mui-focused fieldset": { borderColor: "#667eea" },
                      },
                    }}
                  />
                  <IconButton
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    sx={{
                      background: "#667eea",
                      color: "white",
                      "&:hover": { background: "#5568d3" },
                      "&:disabled": { background: "#d1d5db", color: "#9ca3af" },
                    }}
                  >
                    <SendIcon />
                  </IconButton>
                </Box>
                <Typography variant="caption" sx={{ color: "#9ca3af", display: "block", mt: 1, textAlign: "center" }}>
                  AI Tutor can make mistakes. Always verify important information.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
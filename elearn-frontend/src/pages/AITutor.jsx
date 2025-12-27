import { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, CircularProgress, IconButton, List, ListItem, ListItemText } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = "http://127.0.0.1:8000";

export default function AITutor() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);

  // Load chat logs on mount
  useEffect(() => {
    fetch(`${API_URL}/ai-tutor-chats/`)
      .then(res => res.json())
      .then(data => setChats(data));
  }, []);

  // Load messages for selected chat
  useEffect(() => {
    if (currentChatId) {
      fetch(`${API_URL}/ai-tutor-chats/${currentChatId}`)
        .then(res => res.json())
        .then(chat => setMessages(JSON.parse(chat.messages || "[]")));
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer("");
    const res = await fetch(`${API_URL}/ai-tutor/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
    setLoading(false);

    // Save to chat log
    const newMessage = { role: "user", content: question };
    const aiMessage = { role: "ai", content: data.answer };
    const updatedMessages = [...messages, newMessage, aiMessage];
    setMessages(updatedMessages);

    if (currentChatId) {
      await fetch(`${API_URL}/ai-tutor-chats/${currentChatId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: JSON.stringify(updatedMessages) }),
      });
    } else {
      // Create new chat log
      const chatTitle = `Chat ${new Date().toLocaleString()}`;
      const res = await fetch(`${API_URL}/ai-tutor-chats/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: 1, chat_title: chatTitle, messages: JSON.stringify(updatedMessages) }),
      });
      const chat = await res.json();
      setCurrentChatId(chat.id);
      setChats(prev => [chat, ...prev]);
    }
    setQuestion("");
  };

  const handleDeleteChat = async (chatId) => {
    await fetch(`${API_URL}/ai-tutor-chats/${chatId}`, { method: "DELETE" });
    setChats(prev => prev.filter(c => c.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
      setAnswer("");
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>AI Tutor</Typography>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box sx={{ flex: 1 }}>
          <TextField
            label="Ask the AI Tutor"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleAsk}
            disabled={loading || !question.trim()}
          >
            {loading ? <CircularProgress size={24} /> : "Ask"}
          </Button>
          <List sx={{ mt: 3, bgcolor: "#f5f5f5", borderRadius: 2 }}>
            {messages.map((msg, idx) => (
              <ListItem key={idx} alignItems="flex-start">
                <ListItemText
                  primary={msg.role === "user" ? "You" : "AI Tutor"}
                  secondary={msg.content}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ width: 220 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Chat History</Typography>
          <List>
            {chats.map(chat => (
              <ListItem
                key={chat.id}
                button
                selected={currentChatId === chat.id}
                onClick={() => setCurrentChatId(chat.id)}
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDeleteChat(chat.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText primary={chat.chat_title} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </Box>
  );
}
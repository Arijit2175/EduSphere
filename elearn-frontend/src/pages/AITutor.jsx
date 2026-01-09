import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, IconButton, Avatar, CircularProgress, Tooltip, Button, List, ListItem, ListItemText, TextField, Paper } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Sidebar from "../components/Sidebar";

const API_URL = "http://127.0.0.1:8000";
const emojiList = ["😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊", "😇", "🙂", "🙃", "😉", "😍", "🥰", "🤩", "🤔", "🤓", "😎", "🤖", "🎓", "📚", "💡", "🔥", "✨", "👍", "👏", "🙌"];

// Animated background component
function AnimatedBackground() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      {/* Gradient orbs */}
      {[...Array(5)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: 300 + i * 100,
            height: 300 + i * 100,
            borderRadius: '50%',
            background: [
              'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(99, 102, 241, 0.12) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(167, 139, 250, 0.1) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(79, 70, 229, 0.08) 0%, transparent 70%)',
              'radial-gradient(circle, rgba(196, 181, 253, 0.12) 0%, transparent 70%)',
            ][i],
            left: [`10%`, `60%`, `30%`, `70%`, `20%`][i],
            top: [`20%`, `60%`, `80%`, `10%`, `50%`][i],
            transform: 'translate(-50%, -50%)',
            animation: `float${i} ${8 + i * 2}s ease-in-out infinite`,
            [`@keyframes float${i}`]: {
              '0%, 100%': { transform: `translate(-50%, -50%) scale(1)` },
              '50%': { transform: `translate(${-50 + (i % 2 === 0 ? 10 : -10)}%, ${-50 + (i % 2 === 0 ? -10 : 10)}%) scale(1.1)` },
            },
          }}
        />
      ))}
      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={`particle-${i}`}
          sx={{
            position: 'absolute',
            width: 4 + (i % 3) * 2,
            height: 4 + (i % 3) * 2,
            borderRadius: '50%',
            bgcolor: ['rgba(139, 92, 246, 0.4)', 'rgba(167, 139, 250, 0.5)', 'rgba(99, 102, 241, 0.4)'][i % 3],
            left: `${(i * 5) % 100}%`,
            top: `${(i * 7) % 100}%`,
            animation: `particle${i} ${10 + (i % 5) * 2}s linear infinite`,
            [`@keyframes particle${i}`]: {
              '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.6 },
              '50%': { opacity: 1 },
              '100%': { transform: `translateY(-${100 + i * 10}px) rotate(360deg)`, opacity: 0 },
            },
          }}
        />
      ))}
      {/* Mesh gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(167, 139, 250, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 40%)
          `,
        }}
      />
    </Box>
  );
};

function AITutor() {
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const recommendations = [
    "Ask for summaries or explanations.",
    "Try practice questions.",
    "Use emojis for fun!",
  ];

  // Example prompts for the intro area
  const examplePrompts = [
    "Explain photosynthesis",
    "Quiz me on algebra",
    "Tell me a science joke",
    "What is the capital of France?",
    "Summarize the water cycle",
    "How do airplanes fly?",
    "Give me a fun fact about space",
  ];

  // Shuffle prompts on mount
  const [shuffledPrompts, setShuffledPrompts] = useState([]);
  useEffect(() => {
    const shuffled = [...examplePrompts].sort(() => Math.random() - 0.5);
    setShuffledPrompts(shuffled.slice(0, 3));
  }, []);
  const [showEmojis, setShowEmojis] = useState(false);


  useEffect(() => {
    fetch(`${API_URL}/ai-tutor-chats/`)
      .then(res => res.json())
      .then(data => setChats(data));
  }, []);

  useEffect(() => {
    if (currentChatId) {
      fetch(`${API_URL}/ai-tutor-chats/${currentChatId}`)
        .then(res => res.json())
        .then(chat => setMessages(JSON.parse(chat.messages || "[]")));
    } else {
      setMessages([]);
    }
  }, [currentChatId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    // Prepare chat history for backend (role: 'user'|'ai', content: string)
    const history = messages.map(msg => ({ role: msg.role === 'ai' ? 'ai' : 'user', content: msg.content }));
    const res = await fetch(`${API_URL}/ai-tutor/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: question,
        mode: "socratic", // or "direct"/"guided" if you want to support modes
        history,
        context: null
      }),
    });
    const data = await res.json();
    setLoading(false);

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
    }
  };

  const handleEmojiClick = (emoji) => {
    setQuestion((prev) => prev + emoji);
    setShowEmojis(false);
  };

    return (
      <Box sx={{ display: "flex", minHeight: "100vh", background: "#e9d8fd", position: 'relative', overflow: 'hidden' }}>
        <Sidebar />
        <Box sx={{ display: "flex", flexGrow: 1, height: "100vh" }}>
          {/* Sidebar for chat history */}
          <Box sx={{ width: 280, bgcolor: "#fff", borderRight: "1px solid #e5e7eb", p: 2, display: { xs: "none", md: "block" } }}>
            <Typography variant="h6" sx={{ mb: 2, mt: 3.5, textAlign: 'center', width: '100%' }}>Chats</Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              sx={{ mt: 4, mb: 2, fontWeight: 600, borderRadius: 2, textTransform: 'none' }}
              onClick={() => {
                setCurrentChatId(null);
                setMessages([]);
              }}
            >
              + New Chat
            </Button>
            <List>
              {chats.map(chat => (
                <ListItem
                  key={chat.id}
                  button="true"
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
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>Recommendations</Typography>
              <List>
                <ListItem><ListItemText primary="Ask for summaries or explanations." /></ListItem>
                <ListItem><ListItemText primary="Try practice questions." /></ListItem>
                <ListItem><ListItemText primary="Use emojis for fun!" /></ListItem>
              </List>
            </Box>
          </Box>
          <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh", position: "relative", background: "#e9d8fd" }}>
            <Box sx={{ flexGrow: 1, overflowY: "auto", px: { xs: 1, md: 6 }, pt: 4, pb: 16, position: 'relative', background: 'transparent', zIndex: 1 }}>
              {/* Animated background absolutely positioned in chat area */}
              <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                <AnimatedBackground />
              </Box>
              {/* Blurry overlay for chat area, only behind messages and never over sidebar */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                  background: 'rgba(255,255,255,0.25)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  pointerEvents: 'none',
                  borderRadius: 0,
                }}
              />
              {/* No blurred background, keep solid purple */}
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                {messages.length === 0 ? (
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mt: 10,
                      mb: 6,
                      animation: 'fadeInPop 0.7s',
                      '@keyframes fadeInPop': {
                        '0%': { opacity: 0, transform: 'scale(0.95)' },
                        '100%': { opacity: 1, transform: 'scale(1)' },
                      },
                    }}
                  >
                    <Avatar sx={{ bgcolor: '#ae00ff', width: 72, height: 72, mb: 2, fontSize: 40, boxShadow: '0 4px 24px 0 rgba(174,0,255,0.18)' }}>
                      🤖
                    </Avatar>
                    <Typography variant="h5" sx={{ color: '#ae00ff', fontWeight: 700, mb: 1, letterSpacing: 1 }}>
                      Start a conversation with Lumina!
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#7c3aed', mb: 2, textAlign: 'center', maxWidth: 420 }}>
                      Ask questions, get explanations, or just say hello. Lumina is here to help you learn and have fun!
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
                      <Typography variant="body2" sx={{ color: '#6b7280', mr: 1, display: 'inline', verticalAlign: 'middle' }}>Try:</Typography>
                      {shuffledPrompts.map((prompt, idx) => (
                        <Box
                          key={prompt}
                          component="span"
                          onClick={() => setQuestion(prompt)}
                          sx={{
                            color: '#6366f1',
                            fontWeight: 500,
                            cursor: 'pointer',
                            px: 1.2,
                            py: 0.5,
                            borderRadius: 2,
                            transition: 'background 0.18s, color 0.18s, box-shadow 0.18s',
                            display: 'inline',
                            verticalAlign: 'middle',
                            '&:hover': {
                              background: 'rgba(99,102,241,0.08)',
                              color: '#ae00ff',
                              boxShadow: '0 2px 8px 0 rgba(174,0,255,0.10)',
                            },
                          }}
                        >
                          &quot;{prompt}&quot;{idx < shuffledPrompts.length - 1 ? ',' : ''}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : (
                  <>
                    {/* Render chat messages */}
                    {messages.map((msg, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        mb: 2,
                        flexDirection: msg.role === "user" ? "row-reverse" : "row",
                        position: "relative",
                        zIndex: 2,
                      }}
                    >
                      {msg.role === "ai" && (
                        <Avatar sx={{ bgcolor: "#23233b", mr: 2 }}>{"🤖"}</Avatar>
                      )}
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          bgcolor: msg.role === "user" ? "#e0e7ff" : "#fff",
                          borderRadius: 3,
                          maxWidth: "70%",
                          wordBreak: "break-word",
                          fontSize: "1.1rem",
                        }}
                      >
                        {msg.content}
                      </Paper>
                      {msg.role === "user" && (
                        <Avatar sx={{ bgcolor: "#667eea", ml: 2 }}>{"👤"}</Avatar>
                      )}
                    </Box>
                  ))}
                  </>
                )}
              </Box>
              <div ref={chatEndRef} />
            </Box>
            {/* Chat input fixed at bottom */}
            <Box sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              bgcolor: "rgba(255,255,255,0.35)",
              backdropFilter: "blur(16px)",
              WebkitBackdropFilter: "blur(16px)",
              px: { xs: 1, md: 6 },
              py: 2,
              borderTop: "1px solid #e5e7eb",
              boxShadow: "0 -2px 16px 0 rgba(120, 120, 180, 0.10)",
              zIndex: 2
            }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  boxShadow: "none",
                  border: "none",
                  outline: "none",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  '&:hover': {
                    boxShadow: "0 2px 12px 0 rgba(120, 120, 180, 0.12)",
                    transform: "scale(1.01)",
                  },
                }}
              >
                <TextField
                  placeholder="Type your message..."
                  value={question}
                  onChange={e => setQuestion(e.target.value)}
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={4}
                  InputProps={{
                    endAdornment: (
                      <Tooltip title="Add emoji">
                        <IconButton onClick={() => setShowEmojis((v) => !v)}>
                          <EmojiEmotionsIcon />
                        </IconButton>
                      </Tooltip>
                    ),
                  }}
                  sx={{ bgcolor: "#fff", borderRadius: 2, boxShadow: "none", border: "none", outline: "none", '& fieldset': { border: 'none' } }}
                />
                <Button
                  variant="contained"
                  onClick={handleAsk}
                  disabled={loading || !question.trim()}
                  sx={{ minWidth: 80, height: 48, fontWeight: 600, fontSize: "1rem" }}
                >
                  {loading ? <CircularProgress size={24} /> : "Send"}
                </Button>
              </Box>
              {showEmojis && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 1,
                    mb: 1,
                    bgcolor: "#fff",
                    borderRadius: 2,
                    p: 1,
                    boxShadow: "0 2px 12px 0 rgba(120, 120, 180, 0.18)",
                    animation: "fadeInScale 0.25s",
                    '@keyframes fadeInScale': {
                      '0%': { opacity: 0, transform: 'scale(0.95)' },
                      '100%': { opacity: 1, transform: 'scale(1)' },
                    },
                  }}
                >
                  {emojiList.map((emoji) => (
                    <Button key={emoji} onClick={() => handleEmojiClick(emoji)} sx={{ minWidth: 32, fontSize: 22 }}>{emoji}</Button>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
  );
}

export default AITutor;
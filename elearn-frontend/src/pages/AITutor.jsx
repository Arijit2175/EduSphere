import { Box, Container, Card, CardContent, TextField, Button, Typography, Paper, Avatar, Grid } from "@mui/material";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";

const MotionCard = motion(Card);
const MotionPaper = motion(Paper);

export default function AITutor() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your AI Tutor. Ask me anything about any topic!", sender: "ai" },
  ]);
  const [input, setInput] = useState("");

  const handleSendMessage = () => {
    if (input.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: input, sender: "user" }]);
      setInput("");

      // Simulate AI response
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

  const features = [
    { icon: "💬", title: "Natural Conversations", desc: "Chat naturally about any topic" },
    { icon: "📚", title: "Explain Concepts", desc: "Get detailed explanations of complex ideas" },
    { icon: "📝", title: "Quiz Generation", desc: "Get quizzes to test your understanding" },
    { icon: "🎓", title: "Homework Help", desc: "Get assistance with assignments" },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: 25 },
          mt: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          minHeight: "100vh",
          py: 4,
        }}
      >
        <Navbar />

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <PageHeader
            title="AI Tutor"
            subtitle="24/7 intelligent learning companion - Ask anything!"
            backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />

          <Grid container spacing={3}>
            {/* Chat Area */}
            <Grid item xs={12} md={8}>
              <MotionCard
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                sx={{
                  height: 600,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 3,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                }}
              >
                {/* Chat Messages */}
                <Box
                  sx={{
                    flexGrow: 1,
                    overflowY: "auto",
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      sx={{
                        display: "flex",
                        justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          maxWidth: "70%",
                          alignItems: "flex-end",
                          flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                        }}
                      >
                        {msg.sender === "ai" && (
                          <Avatar
                            sx={{
                              background: "#667eea",
                              color: "white",
                              fontWeight: 700,
                            }}
                          >
                            AI
                          </Avatar>
                        )}
                        <Paper
                          sx={{
                            p: 2,
                            background: msg.sender === "user" ? "#667eea" : "#f0f0f0",
                            color: msg.sender === "user" ? "white" : "#2c3e50",
                            borderRadius: 2,
                          }}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                        </Paper>
                      </Box>
                    </motion.div>
                  ))}
                </Box>

                {/* Input Area */}
                <Box sx={{ p: 2, borderTop: "1px solid #eee" }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Ask me anything..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      variant="outlined"
                      size="small"
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "&.Mui-focused fieldset": {
                            borderColor: "#667eea",
                          },
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={handleSendMessage}
                      sx={{
                        background: "#667eea",
                      }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </Box>
              </MotionCard>
            </Grid>

            {/* Features Sidebar */}
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#2c3e50" }}>
                What Can I Help With?
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {features.map((feature, i) => (
                  <MotionCard
                    key={i}
                    whileHover={{ scale: 1.05 }}
                    sx={{
                      cursor: "pointer",
                      background: "white",
                      borderRadius: 2,
                      border: "2px solid transparent",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        borderColor: "#667eea",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ fontSize: "2rem", mb: 1 }}>{feature.icon}</Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "#666" }}>
                        {feature.desc}
                      </Typography>
                    </CardContent>
                  </MotionCard>
                ))}
              </Box>

              {/* Settings */}
              <MotionCard
                whileHover={{ scale: 1.02 }}
                sx={{
                  mt: 3,
                  background: "linear-gradient(135deg, #667eea20 0%, #764ba220 100%)",
                  borderRadius: 2,
                  border: "2px solid #667eea30",
                }}
              >
                <CardContent>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                    📋 Teaching Mode
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    {["Like I'm 12", "Beginner", "Intermediate", "Expert"].map((mode) => (
                      <Button
                        key={mode}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{
                          textTransform: "none",
                          borderColor: "#667eea",
                          color: "#667eea",
                        }}
                      >
                        {mode}
                      </Button>
                    ))}
                  </Box>
                </CardContent>
              </MotionCard>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
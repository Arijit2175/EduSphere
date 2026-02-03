import API_URL from "../config";
import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  TextField,
  Paper,
  Divider,
  Fade,
  Drawer,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import Sidebar from "../components/Sidebar.jsx";
import { useAuth } from "../contexts/AuthContext.jsx";


const emojiList = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "😊",
  "😇", "🙂", "🙃", "😉", "😍", "🥰", "🤩", "🤔",
  "🤓", "😎", "🤖", "🎓", "📚", "💡", "🔥", "✨",
  "👍", "👏", "🙌", "💪", "🎉", "⭐", "💜", "🚀",
];

const recommendations = [
  { icon: <LightbulbOutlinedIcon sx={{ fontSize: 18 }} />, text: "Ask for summaries or explanations." },
  { icon: <QuizOutlinedIcon sx={{ fontSize: 18 }} />, text: "Try practice questions." },
  { icon: <EmojiEmotionsOutlinedIcon sx={{ fontSize: 18 }} />, text: "Use emojis for fun!" },
];

const examplePrompts = [
  "Explain photosynthesis",
  "Quiz me on algebra",
  "Tell me a science joke",
  "What is the capital of France?",
  "Summarize the water cycle",
  "How do airplanes fly?",
  "Give me a fun fact about space",
];

export default function AITutor() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const { user } = useAuth();
  const [initialLoading, setInitialLoading] = useState(user ? true : false);

  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [rateLimitError, setRateLimitError] = useState("");
  const chatEndRef = useRef(null);

  const [shuffledPrompts, setShuffledPrompts] = useState([]);

  useEffect(() => {
    const shuffled = [...examplePrompts].sort(() => Math.random() - 0.5);
    setShuffledPrompts(shuffled.slice(0, 3));
  }, []);

  useEffect(() => {
    if (!user) {
      setInitialLoading(false);
      return;
    }
    setInitialLoading(true);
    fetch(`${API_URL}/ai-tutor-chats/`, {
      headers: {
        'Authorization': user?.access_token ? `Bearer ${user.access_token}` : ''
      }
    })
      .then(res => res.ok ? res.json() : [])
        .then(data => {
          setChats(Array.isArray(data) ? data : []);
          setInitialLoading(false);
        })
        .catch(() => {
          setChats([]);
          setInitialLoading(false);
        });
      }, [user]);

  if (initialLoading && user) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="h6" sx={{ color: "#666" }}>
                Loading AI Tutor...
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  useEffect(() => {
    if (currentChatId && user) {
      fetch(`${API_URL}/ai-tutor-chats/${currentChatId}`, {
        headers: {
          'Authorization': user?.access_token ? `Bearer ${user.access_token}` : ''
        }
      })
        .then(res => {
          if (!res.ok) {
            console.error('Failed to fetch chat:', res.status);
            return null;
          }
          return res.json();
        })
        .then(chat => {
          if (chat && chat.messages) {
            try {
              const parsedMessages = typeof chat.messages === 'string' 
                ? JSON.parse(chat.messages) 
                : chat.messages;
              setMessages(Array.isArray(parsedMessages) ? parsedMessages : []);
            } catch (err) {
              console.error('Error parsing messages:', err);
              setMessages([]);
            }
          } else {
            setMessages([]);
          }
        })
        .catch((err) => {
          console.error('Error fetching chat:', err);
          setMessages([]);
        });
    } else if (!currentChatId) {
      setMessages([]);
    }
  }, [currentChatId, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);

    const history = messages.map(msg => ({
      role: msg.role === 'ai' ? 'ai' : 'user',
      content: msg.content
    }));

    try {
      const res = await fetch(`${API_URL}/ai-tutor/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.access_token ? { 'Authorization': `Bearer ${user.access_token}` } : {})
        },
        body: JSON.stringify({
          message: question,
          mode: "direct",
          history,
          context: null
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setRateLimitError("Rate limit exceeded. Please wait before asking another question.");
          setLoading(false);
          return;
        }
        throw new Error(data.detail || "Error getting response");
      }

      setRateLimitError("");
      const newMessage = { role: "user", content: question };
      const aiMessage = { role: "ai", content: data.answer };
      const updatedMessages = [...messages, newMessage, aiMessage];
      setMessages(updatedMessages);

      if (currentChatId) {
        await fetch(`${API_URL}/ai-tutor-chats/${currentChatId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(user?.access_token ? { 'Authorization': `Bearer ${user.access_token}` } : {})
          },
          body: JSON.stringify({ messages: JSON.stringify(updatedMessages) }),
        });
      } else {
        const chatTitle = question.slice(0, 30) + (question.length > 30 ? '...' : '');
        const chatRes = await fetch(`${API_URL}/ai-tutor-chats/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(user?.access_token ? { 'Authorization': `Bearer ${user.access_token}` } : {})
          },
          body: JSON.stringify({
            chat_title: chatTitle,
            messages: JSON.stringify(updatedMessages)
          }),
        });
        const chat = await chatRes.json();
        setCurrentChatId(chat.id);
        setChats(prev => [chat, ...prev]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }

    setLoading(false);
    setQuestion("");
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await fetch(`${API_URL}/ai-tutor-chats/${chatId}`, {
        method: "DELETE",
        headers: {
          ...(user?.access_token ? { 'Authorization': `Bearer ${user.access_token}` } : {})
        }
      });
      setChats(prev => prev.filter(c => c.id !== chatId));
      if (currentChatId === chatId) {
        setCurrentChatId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setMobileDrawerOpen(false);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    setMobileDrawerOpen(false);
  };

  const handleEmojiClick = (emoji) => {
    setQuestion(prev => prev + emoji);
    setShowEmojis(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (question.trim() && !loading) {
        handleAsk();
      }
    }
  };

  // Custom Lumina Logo Component
  const LuminaLogo = ({ size = 80 }) => (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 50%, #4F46E5 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)',
        animation: 'logoFloat 3s ease-in-out infinite',
        '@keyframes logoFloat': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          width: size * 1.3,
          height: size * 1.3,
          borderRadius: '50%',
          border: '2px solid rgba(139, 92, 246, 0.2)',
          animation: 'logoRing 2s ease-out infinite',
        },
        '@keyframes logoRing': {
          '0%': { transform: 'scale(0.8)', opacity: 1 },
          '100%': { transform: 'scale(1.2)', opacity: 0 },
        },
      }}
    >
      {/* Inner star/sparkle design */}
      <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <SmartToyRoundedIcon sx={{ color: '#fff', fontSize: size * 0.42, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }} />
      </Box>
      {/* Orbiting dots */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          animation: 'orbit 4s linear infinite',
          '@keyframes orbit': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -4,
            left: '50%',
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: '#fff',
            transform: 'translateX(-50%)',
            boxShadow: '0 0 8px rgba(255,255,255,0.8)',
          }}
        />
      </Box>
    </Box>
  );

  // Animated Background Component
  const AnimatedBackground = () => (
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
            background: `radial-gradient(circle, ${
              ['rgba(139, 92, 246, 0.15)', 'rgba(99, 102, 241, 0.12)', 'rgba(167, 139, 250, 0.1)', 'rgba(79, 70, 229, 0.08)', 'rgba(196, 181, 253, 0.12)'][i]
            } 0%, transparent 70%)`,
            left: `${[10, 60, 30, 70, 20][i]}%`,
            top: `${[20, 60, 80, 10, 50][i]}%`,
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

  // Chat Sidebar Content Component
  const ChatSidebarContent = (
    <Box
      sx={{
        width: 300,
        minWidth: 300,
        flexShrink: 0,
        height: '100vh',
        bgcolor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(139, 92, 246, 0.1)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#1F2937', mb: 3, textAlign: 'center' }}>
          Chats
        </Typography>

        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={handleNewChat}
          sx={{
            py: 1.5,
            fontSize: '0.95rem',
            borderColor: '#8B5CF6',
            color: '#7C3AED',
            borderRadius: 3,
            textTransform: 'none',
            fontWeight: 600,
            '&:hover': {
              borderColor: '#7C3AED',
              bgcolor: 'rgba(139, 92, 246, 0.08)',
            },
          }}
        >
          New Chat
        </Button>
      </Box>

      <Divider sx={{ mx: 2, borderColor: 'rgba(139, 92, 246, 0.1)' }} />

      {/* Chat List - Scrollable */}
      <Box sx={{ flex: 1, overflow: 'auto', px: 2, py: 2 }}>
        <List disablePadding>
          {chats.map((chat, index) => (
            <Fade in key={chat.id} timeout={300} style={{ transitionDelay: `${index * 50}ms` }}>
              <ListItem
                disablePadding
                secondaryAction={
                  <IconButton
                    edge="end"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      '.MuiListItem-root:hover &': { opacity: 1 },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />
                  </IconButton>
                }
                sx={{ '&:hover .MuiIconButton-root': { opacity: 1 } }}
              >
                <ListItemButton
                  selected={currentChatId === chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  sx={{
                    borderRadius: 2,
                    py: 1.5,
                    '&.Mui-selected': {
                      bgcolor: 'rgba(139, 92, 246, 0.1)',
                      '&:hover': { bgcolor: 'rgba(139, 92, 246, 0.15)' },
                    },
                  }}
                >
                  <ChatBubbleOutlineIcon sx={{ fontSize: 18, color: '#9CA3AF', mr: 1.5 }} />
                  <ListItemText
                    primary={chat.chat_title}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: currentChatId === chat.id ? 600 : 400,
                      color: currentChatId === chat.id ? '#7C3AED' : '#4B5563',
                      noWrap: true,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </Fade>
          ))}
        </List>

        {chats.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4, color: '#9CA3AF' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
            <Typography variant="body2">No chats yet</Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ mx: 2, borderColor: 'rgba(139, 92, 246, 0.1)' }} />

      {/* Recommendations - Fixed at bottom */}
      <Box sx={{ p: 3, flexShrink: 0 }}>
        <Typography variant="subtitle2" sx={{ mb: 1.5, color: '#6B7280', fontWeight: 600 }}>
          Recommendations
        </Typography>
        <List disablePadding>
          {recommendations.map((rec, idx) => (
            <ListItem key={idx} disablePadding sx={{ mb: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 0.5 }}>
                <Box sx={{ color: '#8B5CF6' }}>{rec.icon}</Box>
                <Typography variant="body2" sx={{ color: '#6B7280', fontSize: '0.85rem' }}>
                  {rec.text}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          height: '100vh',
          width: '100%',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #E9D8FD 0%, #DDD6FE 50%, #C4B5FD 100%)',
          position: 'relative',
        }}
      >
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Desktop Chat Sidebar - Fixed */}
      {!isMobile && ChatSidebarContent}

      {/* Mobile Drawer */}
      <Drawer
        open={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 300 },
        }}
      >
        {ChatSidebarContent}
      </Drawer>

      {/* Main Chat Area */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}
      >
        {/* Mobile Menu Button */}
        {isMobile && (
          <Box sx={{ p: 2, position: 'absolute', top: 0, left: 0, zIndex: 10 }}>
            <IconButton
              onClick={() => setMobileDrawerOpen(true)}
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': { bgcolor: 'rgba(255, 255, 255, 1)' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Chat Messages Area - Scrollable */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: { xs: 2, md: 6 },
            pt: { xs: 8, md: 4 },
            pb: '200px',
          }}
        >
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {messages.length === 0 ? (
              // Welcome Screen
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mt: { xs: 6, md: 10 },
                  animation: 'fadeInPop 0.7s ease-out',
                  '@keyframes fadeInPop': {
                    '0%': { opacity: 0, transform: 'scale(0.95) translateY(20px)' },
                    '100%': { opacity: 1, transform: 'scale(1) translateY(0)' },
                  },
                }}
              >
                <Box sx={{ mb: 3 }}>
                  <LuminaLogo size={80} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: '#7C3AED',
                    fontWeight: 700,
                    mb: 1.5,
                    textAlign: 'center',
                  }}
                >
                  Start a conversation with Lumina!
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: '#6B7280',
                    mb: 4,
                    textAlign: 'center',
                    maxWidth: 450,
                    lineHeight: 1.7,
                  }}
                >
                  Ask questions, get explanations, or just say hello. Lumina is here to help you learn and have fun!
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 1.5,
                    justifyContent: 'center',
                  }}
                >
                  {shuffledPrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outlined"
                      onClick={() => setQuestion(prompt)}
                      sx={{
                        borderRadius: 3,
                        px: 2.5,
                        py: 1,
                        textTransform: 'none',
                        borderColor: 'rgba(139, 92, 246, 0.3)',
                        color: '#7C3AED',
                        bgcolor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        '&:hover': {
                          borderColor: '#8B5CF6',
                          bgcolor: 'rgba(139, 92, 246, 0.1)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      "{prompt}"
                    </Button>
                  ))}
                </Box>
              </Box>
            ) : (
              // Chat Messages
              messages.map((msg, idx) => (
                <Fade in key={idx} timeout={400}>
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      mb: 3,
                      flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                      alignItems: 'flex-start',
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 44,
                        height: 44,
                        bgcolor: msg.role === 'user'
                          ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                          : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                          : 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.25)',
                      }}
                    >
                      {msg.role === 'user' ? (
                        <PersonRoundedIcon sx={{ fontSize: 24 }} />
                      ) : (
                        <SmartToyRoundedIcon sx={{ fontSize: 24 }} />
                      )}
                    </Avatar>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2.5,
                        maxWidth: '75%',
                        borderRadius: 3,
                        bgcolor: msg.role === 'user'
                          ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                          : 'rgba(255, 255, 255, 0.95)',
                        background: msg.role === 'user'
                          ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
                          : 'rgba(255, 255, 255, 0.95)',
                        color: msg.role === 'user' ? '#fff' : '#374151',
                        backdropFilter: 'blur(10px)',
                        boxShadow: msg.role === 'user'
                          ? '0 4px 20px rgba(139, 92, 246, 0.3)'
                          : '0 4px 20px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '1rem',
                          lineHeight: 1.7,
                          whiteSpace: 'pre-wrap',
                        }}
                      >
                        {msg.content}
                      </Typography>
                    </Paper>
                  </Box>
                </Fade>
              ))
            )}
            <div ref={chatEndRef} />
          </Box>
        </Box>

        {/* Chat Input - Fixed at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(139, 92, 246, 0.1)',
            p: 3,
            zIndex: 10,
          }}
        >
          <Box sx={{ maxWidth: 900, mx: 'auto' }}>
            {/* Emoji Picker */}
            {showEmojis && (
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  mb: 2,
                  p: 2,
                  bgcolor: '#FFFFFF',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  animation: 'fadeInScale 0.2s ease-out',
                  '@keyframes fadeInScale': {
                    '0%': { opacity: 0, transform: 'scale(0.95)' },
                    '100%': { opacity: 1, transform: 'scale(1)' },
                  },
                }}
              >
                {emojiList.map((emoji) => (
                  <IconButton
                    key={emoji}
                    onClick={() => handleEmojiClick(emoji)}
                    sx={{
                      fontSize: '1.4rem',
                      p: 1,
                      '&:hover': {
                        transform: 'scale(1.2)',
                        bgcolor: 'rgba(139, 92, 246, 0.1)',
                      },
                    }}
                  >
                    {emoji}
                  </IconButton>
                ))}
              </Box>
            )}

            {/* Input Field */}
            {rateLimitError && (
              <Box
                sx={{
                  bgcolor: '#FEE2E2',
                  color: '#DC2626',
                  p: 1.5,
                  borderRadius: 2,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  border: '1px solid #FECACA',
                }}
              >
                {rateLimitError}
              </Box>
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1.5,
                bgcolor: '#FFFFFF',
                borderRadius: 4,
                p: 1,
                boxShadow: '0 4px 24px rgba(139, 92, 246, 0.1)',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.15)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <TextField
                placeholder="Type your message..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                fullWidth
                multiline
                maxRows={4}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: '1rem', px: 2, py: 1 },
                }}
              />

              <Tooltip title="Add emoji" arrow>
                <IconButton
                  onClick={() => setShowEmojis(!showEmojis)}
                  sx={{
                    color: showEmojis ? '#8B5CF6' : '#9CA3AF',
                    '&:hover': { color: '#8B5CF6' },
                  }}
                >
                  <EmojiEmotionsOutlinedIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="contained"
                onClick={handleAsk}
                disabled={loading || !question.trim()}
                sx={{
                  minWidth: 100,
                  height: 48,
                  borderRadius: 3,
                  px: 3,
                  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                    boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)',
                  },
                  '&:disabled': {
                    background: '#E5E7EB',
                    color: '#9CA3AF',
                  },
                }}
              >
                {loading ? "Sending..." : "Send"}
                {!loading && <SendRoundedIcon sx={{ ml: 1, fontSize: 18 }} />}
              </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

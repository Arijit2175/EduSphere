import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import API_URL from "../config";
import ImageIcon from "@mui/icons-material/Image";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  IconButton,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

import BarLoader from "../components/BarLoader";




import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Grainient from "../components/Grainient";
import TextType from "../components/TextType";
import { useSidebar } from "../contexts/SidebarContext";
import { useAuth } from "../contexts/AuthContext";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import SendIcon from "@mui/icons-material/Send";
import CodeIcon from "@mui/icons-material/Code";
import BrushIcon from "@mui/icons-material/Brush";
import ScienceIcon from "@mui/icons-material/Science";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import GroupsIcon from "@mui/icons-material/Groups";
import SearchIcon from "@mui/icons-material/Search";
import LayersIcon from "@mui/icons-material/Layers";
import CloseIcon from "@mui/icons-material/Close";

// Topics will be fetched from backend
const DEFAULT_TOPICS = ["All"];
const SORTS = [
  { value: "recent", label: "Most recent" },
  { value: "upvotes", label: "Most upvoted" },
  { value: "comments", label: "Most commented" },
];

const topicIconMap = {
  all: <LayersIcon fontSize="small" />,
  tech: <CodeIcon fontSize="small" />,
  arts: <BrushIcon fontSize="small" />,
  science: <ScienceIcon fontSize="small" />,
  "soft skills": <PsychologyIcon fontSize="small" />,
  "daily tips": <TipsAndUpdatesIcon fontSize="small" />,
  "daily learning tips": <TipsAndUpdatesIcon fontSize="small" />,
};

const getTopicIcon = (topic) => {
  const key = (topic || "").toLowerCase();
  return topicIconMap[key] || <LayersIcon fontSize="small" />;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
};

export default function InformalLearning() {
    // State for delete dialog
    const [deleteDialog, setDeleteDialog] = useState({ open: false, postId: null });

    // Handler to delete post (frontend + backend)
    const handleDeletePost = async (postId) => {
      // Get access token from AuthContext or localStorage
      let accessToken = null;
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userObj = JSON.parse(userStr);
          accessToken = userObj.access_token;
        }
      } catch {}
      if (!accessToken) {
        alert("You must be logged in to delete posts.");
        setDeleteDialog({ open: false, postId: null });
        return;
      }
      try {
        await axios.delete(`${API_URL}/informal-posts/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        });
        setPosts((prev) => prev.filter((p) => p.id !== postId));
      } catch (err) {
        alert("Failed to delete post. Please try again.");
      }
      setDeleteDialog({ open: false, postId: null });
    };
  const { isOpen } = useSidebar();
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [topics, setTopics] = useState(DEFAULT_TOPICS);
  const [followingTopics, setFollowingTopics] = useState([]);
  const [followingCreators, setFollowingCreators] = useState(() => {
    const stored = localStorage.getItem("informalFollowCreators");
    return stored ? JSON.parse(stored) : [];
  });
  const [filterTopic, setFilterTopic] = useState("All");
  const [sortBy, setSortBy] = useState("recent");
  const [search, setSearch] = useState("");
  const [composer, setComposer] = useState({ title: "", body: "", topic: "Tech", type: "post", tagsInput: "", media: null });
  const [commentDraft, setCommentDraft] = useState({});
  const [aiResponses, setAiResponses] = useState({});
  const [composerOpen, setComposerOpen] = useState(false);

  const normalizePost = (post) => {
    const parsedComments = typeof post.comments === "string"
      ? (() => { try { return JSON.parse(post.comments); } catch { return []; } })()
      : (post.comments || []);
    const parsedTags = Array.isArray(post.tags)
      ? post.tags
      : typeof post.tags === "string"
        ? post.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];
    const parsedLikers = Array.isArray(post.likers)
      ? post.likers
      : typeof post.likers === "string"
        ? post.likers.split(",").map((x) => x.trim()).filter(Boolean).map(Number)
        : (post.likers || []);
    const parsedSavers = Array.isArray(post.savers)
      ? post.savers
      : typeof post.savers === "string"
        ? post.savers.split(",").map((x) => x.trim()).filter(Boolean).map(Number)
        : (post.savers || []);

    const createdAt = post.created_at || post.createdAt || new Date().toISOString();
    const authorId = post.author_id ?? post.authorId ?? post.userId;

    return {
      ...post,
      id: post.id,
      title: post.title,
      content: post.content || post.body || "",
      body: post.content || post.body || "",
      topic: post.topic || "Tech",
      type: post.type || "post",
      author_id: authorId,
      authorId,
      author: post.author_name || post.userName || post.creator || "Anonymous",
      creator_email: post.creator_email || post.email || post.author_name || post.userName || post.creator,
      creator_role: post.creator_role || post.role,
      created_at: createdAt,
      createdAt,
      likes: post.likes_count ?? post.likes ?? 0,
      likers: parsedLikers,
      comments: parsedComments,
      tags: parsedTags,
      savers: parsedSavers,
      media_url: post.media_url || post.mediaUrl,
    };
  };

  useEffect(() => {
    localStorage.setItem("informalPosts", JSON.stringify(posts));
  }, [posts]);

  // Fetch initial posts from backend
  useEffect(() => {
    setInitialLoading(true);
    axios.get(`${API_URL}/informal-posts/`)
      .then(res => {
        // Backend returns paginated format: {data: [...], total, skip, limit}
        const postsArray = res.data.data || res.data || [];
        const posts = (Array.isArray(postsArray) ? postsArray : []).map(normalizePost);
        setPosts(posts);
        setInitialLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching posts:", err);
        setPosts([]);
        setInitialLoading(false);
      });
    }, []);

  // Fetch topics and followed topics from backend
  useEffect(() => {
    axios.get(`${API_URL}/topics/`)
      .then(res => {
        const backendTopics = res.data.map(t => t.name);
        setTopics(["All", ...backendTopics]);
      });
    if (user && user.access_token) {
      axios.get(`${API_URL}/topics/followed`, {
        headers: { Authorization: `Bearer ${user.access_token}` }
      }).then(res => {
        setFollowingTopics(res.data.map(t => t.name));
      });
    } else {
      setFollowingTopics([]);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem("informalFollowCreators", JSON.stringify(followingCreators));
  }, [followingCreators]);

  const filtered = useMemo(() => {
    let data = [...posts];
    if (filterTopic !== "All") data = data.filter((p) => p.topic === filterTopic);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((p) => {
        const tagsArr = Array.isArray(p.tags)
          ? p.tags
          : typeof p.tags === 'string'
            ? p.tags.split(',').map(t => t.trim())
            : [];
        return p.title.toLowerCase().includes(q)
          || (p.content || p.body || '').toLowerCase().includes(q)
          || tagsArr.some((t) => t.toLowerCase().includes(q));
      });
    }
    data.sort((a, b) => {
      if (sortBy === "upvotes") return (b.likes || 0) - (a.likes || 0);
      if (sortBy === "comments") return (b.comments?.length || 0) - (a.comments?.length || 0);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return data;
  }, [posts, filterTopic, sortBy, search]);

  const trendingTopics = useMemo(() => {
    const counts = posts.reduce((acc, p) => {
      acc[p.topic] = (acc[p.topic] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);
  }, [posts]);

  const badges = useMemo(() => {
    const contributions = posts.filter((p) => p.authorId === user?.id).length;
    const comments = Object.values(commentDraft).length;
    const likesGiven = posts.reduce((acc, p) => acc + (p.likers?.includes(user?.id) ? 1 : 0), 0);
    return [
      contributions > 0 && { label: "Contributor", icon: <FlashOnIcon fontSize="small" /> },
      likesGiven > 5 && { label: "Helper", icon: <FavoriteIcon fontSize="small" /> },
      contributions > 3 && { label: "Top Insight", icon: <WhatshotIcon fontSize="small" /> },
      comments > 3 && { label: "Community Mentor", icon: <ChatBubbleOutlineIcon fontSize="small" /> },
    ].filter(Boolean);
  }, [posts, user?.id, commentDraft]);

  const BACKEND_URL = API_URL;
  const handleLike = async (id) => {
    try {
      if (!user || !user.access_token) throw new Error("Not authenticated");
      const res = await axios.post(
        `${BACKEND_URL}/informal-posts/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );
      if (res.data && res.data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, likes: res.data.likes, likers: res.data.likers }
              : p
          )
        );
      }
    } catch (err) {
      // Optionally show error
    }
  };

  const handleSave = async (id) => {
    try {
      if (!user || !user.access_token) throw new Error("Not authenticated");
      const res = await axios.post(
        `${BACKEND_URL}/informal-posts/${id}/save`,
        {},
        { headers: { Authorization: `Bearer ${user.access_token}` } }
      );
      if (res.data && res.data.success) {
        // Re-fetch all posts to guarantee sync with DB
        axios.get(`${API_URL}/informal-posts/`)
          .then(res2 => {
            const postsArray = res2.data.data || res2.data || [];
            const posts = (Array.isArray(postsArray) ? postsArray : []).map(normalizePost);
            setPosts(posts);
          })
          .catch(() => {
            setPosts([]);
          });
      }
    } catch (err) {
      // Optionally show error
    }
  };

  const handleComment = async (id) => {
    const text = (commentDraft[id] || "").trim();
    if (!text) return;
    try {
      if (!user || !user.access_token) throw new Error("Not authenticated");
      const res = await axios.post(
        `${BACKEND_URL}/informal-posts/${id}/comment`,
        text,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.access_token}`,
          },
        }
      );
      if (res.data && res.data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, comments: res.data.comments }
              : p
          )
        );
        setCommentDraft((prev) => ({ ...prev, [id]: "" }));
      }
    } catch (err) {
      // Optionally show error
    }
  };

  // Handler to delete a comment
  const handleDeleteComment = async (postId, commentId) => {
    try {
      if (!user || !user.access_token) throw new Error("Not authenticated");
      const res = await axios.delete(`${BACKEND_URL}/informal-posts/${postId}/comment/${commentId}`, {
        headers: { Authorization: `Bearer ${user.access_token}` }
      });
      if (res.data && res.data.success) {
        setPosts((prev) => prev.map((p) =>
          p.id === postId
            ? { ...p, comments: res.data.comments }
            : p
        ));
      }
    } catch (err) {
      // Optionally show error
    }
  };

  // Load persisted informal state on first render
  useEffect(() => {
    try {
      // Demo-friendly reset: start clean each run
      localStorage.removeItem("informalPosts");
      localStorage.removeItem("informalSaved");
      localStorage.removeItem("informalFollowingTopics");
      localStorage.removeItem("informalFollowingCreators");
      localStorage.removeItem("informalBadges");

      const storedPosts = JSON.parse(localStorage.getItem("informalPosts") || "null");
      const storedFollowingTopics = JSON.parse(localStorage.getItem("informalFollowingTopics") || "null");
      const storedFollowingCreators = JSON.parse(localStorage.getItem("informalFollowingCreators") || "null");
      const storedBadges = JSON.parse(localStorage.getItem("informalBadges") || "null");

      if (storedPosts) setPosts(storedPosts);
      if (storedFollowingTopics) setFollowingTopics(storedFollowingTopics);
      if (storedFollowingCreators) setFollowingCreators(storedFollowingCreators);
      if (storedBadges) setBadges(storedBadges);
    } catch (e) {
      // ignore storage errors
    }
  }, []);

  // Persist changes
  useEffect(() => {
    try {
      localStorage.setItem("informalPosts", JSON.stringify(posts));
    } catch {}
  }, [posts]);



  useEffect(() => {
    try {
      localStorage.setItem("informalFollowingTopics", JSON.stringify(followingTopics));
    } catch {}
  }, [followingTopics]);

  useEffect(() => {
    try {
      localStorage.setItem("informalFollowingCreators", JSON.stringify(followingCreators));
    } catch {}
  }, [followingCreators]);

  useEffect(() => {
    try {
      localStorage.setItem("informalBadges", JSON.stringify(badges));
    } catch {}
  }, [badges]);

  const handleAddPost = () => {
    if (!composer.title.trim() || !composer.body.trim()) return;
    const tags = composer.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)
      .join(",");
    const postPayload = {
      title: composer.title,
      content: composer.body,  // Map body to content for backend
      topic: composer.topic,
      type: composer.type,
      tags: tags || null,
      media_url: composer.media ? composer.media.src : null,
    };
    // Get access token from AuthContext or localStorage
    let accessToken = null;
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userObj = JSON.parse(userStr);
        accessToken = userObj.access_token;
      }
    } catch {}
    if (!accessToken) {
      alert("You must be logged in to post.");
      return;
    }
    axios.post(
      `${API_URL}/informal-posts/`,
      postPayload,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        withCredentials: true,
      }
    )
      .then((res) => {
        // After creating, re-fetch all posts for instant sync
        axios.get(`${API_URL}/informal-posts/`)
          .then(res2 => {
            const postsArray = res2.data.data || res2.data || [];
            const posts = (Array.isArray(postsArray) ? postsArray : []).map(normalizePost);
            setPosts(posts);
          })
          .catch(() => {
            setPosts([]);
          });
        setComposer({ title: "", body: "", topic: composer.topic, type: "post", tagsInput: "", media: null });
      })
      .catch((err) => {
        alert("Failed to save post. Please try again.");
      });
  };

  const handleMediaUpload = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result;
      const isVideo = file.type.startsWith("video");
      setComposer((prev) => ({ ...prev, media: { src: base64, kind: isVideo ? "video" : "image", name: file.name } }));
    };
    reader.readAsDataURL(file);
  };

  const handleFollowTopic = async (topic) => {
    if (topic === "All" || !user || !user.access_token) return;
    const topicObj = topics.find(t => t === topic);
    // Fetch topic id from backend topics endpoint
    let topicId = null;
    try {
      const res = await axios.get(`${API_URL}/topics/`);
      const found = res.data.find(t => t.name === topic);
      if (found) topicId = found.id;
    } catch {}
    if (!topicId) return;
    if (followingTopics.includes(topic)) {
      // Unfollow
      await axios.post(`${API_URL}/topics/unfollow`, topicId, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.access_token}` }
      });
      setFollowingTopics(prev => prev.filter(t => t !== topic));
    } else {
      // Follow
      await axios.post(`${API_URL}/topics/follow`, topicId, {
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.access_token}` }
      });
      setFollowingTopics(prev => [...prev, topic]);
    }
  };

  const handleFollowCreator = (creator) => {
    if (!creator || followingCreators.includes(creator)) return;
    setFollowingCreators((prev) => [...prev, creator]);
  };

  const floatingSymbols = useMemo(() => {
    const rand = (min, max) => Math.random() * (max - min) + min;
    const edgePosition = () => {
      const lanePick = Math.random();
      if (lanePick < 0.4) {
        return `${rand(4, 22).toFixed(1)}%`;
      }
      if (lanePick < 0.8) {
        return `${rand(78, 96).toFixed(1)}%`;
      }
      return `${rand(38, 62).toFixed(1)}%`;
    };
    const icons = [
      { id: "code", node: <CodeIcon fontSize="medium" /> },
      { id: "brush", node: <BrushIcon fontSize="medium" /> },
      { id: "science", node: <ScienceIcon fontSize="medium" /> },
      { id: "mind", node: <PsychologyIcon fontSize="medium" /> },
      { id: "tips", node: <TipsAndUpdatesIcon fontSize="medium" /> },
      { id: "code2", node: <CodeIcon fontSize="medium" /> },
      { id: "brush2", node: <BrushIcon fontSize="medium" /> },
      { id: "science2", node: <ScienceIcon fontSize="medium" /> },
      { id: "mind2", node: <PsychologyIcon fontSize="medium" /> },
      { id: "tips2", node: <TipsAndUpdatesIcon fontSize="medium" /> },
      { id: "code3", node: <CodeIcon fontSize="medium" /> },
      { id: "brush3", node: <BrushIcon fontSize="medium" /> },
      { id: "science3", node: <ScienceIcon fontSize="medium" /> },
      { id: "mind3", node: <PsychologyIcon fontSize="medium" /> },
    ];
    return icons.map((icon) => ({
      id: icon.id,
      icon: icon.node,
      left: edgePosition(),
      top: `${rand(6, 90).toFixed(1)}%`,
      size: Math.round(rand(42, 72)),
      delay: `${rand(0, 4).toFixed(1)}s`,
      duration: `${rand(16, 26).toFixed(1)}s`,
      rotate: `${rand(-22, 22).toFixed(1)}deg`,
      floatDistance: Math.round(rand(18, 34)),
      driftX: Math.round(rand(12, 28)) * (Math.random() > 0.5 ? 1 : -1),
      driftY: Math.round(rand(8, 22)) * (Math.random() > 0.5 ? 1 : -1),
    }));
  }, []);


  if (initialLoading) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box sx={{ textAlign: "center" }}>
              <BarLoader />
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "#eef2f7",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
          }}
        >
          <Grainient
            color1="#6d28d9"
            color2="#2563eb"
            color3="#ffffff"
            timeSpeed={1}
            colorBalance={0}
            warpStrength={1}
            warpFrequency={5}
            warpSpeed={2}
            warpAmplitude={50}
            blendAngle={0}
            blendSoftness={0.05}
            rotationAmount={500}
            noiseScale={2}
            grainAmount={0.08}
            grainScale={2}
            grainAnimated
            contrast={1.3}
            gamma={1}
            saturation={1}
            centerX={0}
            centerY={0}
            zoom={0.95}
          />
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            pointerEvents: "none",
            "@keyframes floatSymbol": {
              "0%": { transform: "translate3d(0, 0, 0) rotate(var(--rotate))" },
              "50%": { transform: "translate3d(var(--drift-x), calc(-1 * var(--float)), 0) rotate(var(--rotate))" },
              "100%": { transform: "translate3d(0, var(--drift-y), 0) rotate(var(--rotate))" },
            },
          }}
        >
          {floatingSymbols.map((symbol) => (
            <Box
              key={symbol.id}
              sx={{
                position: "absolute",
                left: symbol.left,
                top: symbol.top,
                width: symbol.size,
                height: symbol.size,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(30, 58, 138, 0.65)",
                background: "rgba(255, 255, 255, 0.45)",
                boxShadow: "0 12px 28px rgba(15, 23, 42, 0.12)",
                animation: `floatSymbol ${symbol.duration} ease-in-out ${symbol.delay} infinite`,
                "--rotate": symbol.rotate,
                "--float": `${symbol.floatDistance}px`,
                "--drift-x": `${symbol.driftX}px`,
                "--drift-y": `${symbol.driftY}px`,
              }}
            >
              {symbol.icon}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            background: "linear-gradient(180deg, rgba(248,250,252,0.35) 0%, rgba(237,242,247,0.45) 100%)",
            pointerEvents: "none",
          }}
        />
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: isOpen ? 25 : 8.75 },
            transition: "margin-left 0.3s ease",
            pb: 4,
            position: "relative",
            zIndex: 3,
          }}
        >
          <Box sx={{ mt: 4, px: { xs: 2, md: 3 }, maxWidth: "1400px", mx: "auto" }}>
            <Box
              sx={{
                position: "relative",
                overflow: "hidden",
                borderRadius: 3,
                px: { xs: 3, md: 4 },
                py: { xs: 3, md: 4 },
                mb: 3,
                background: "linear-gradient(120deg, #0b1f5e 0%, #1d4ed8 38%, #2563eb 62%, #ffffff 100%)",
                backgroundSize: "200% 200%",
                animation: "communityGradient 12s ease-in-out infinite",
                color: "#ffffff",
                "@keyframes communityGradient": {
                  "0%": { backgroundPosition: "0% 50%" },
                  "50%": { backgroundPosition: "100% 50%" },
                  "100%": { backgroundPosition: "0% 50%" },
                },
              }}
            >
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  color: "#ffffff",
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "rgba(255, 255, 255, 0.18)",
                    }}
                  >
                    <GroupsIcon fontSize="small" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    <TextType
                      text={["Community Feed", "Share to everyone!"]}
                      typingSpeed={75}
                      pauseDuration={1500}
                      deletingSpeed={50}
                      showCursor
                      cursorCharacter="|"
                      cursorBlinkDuration={0.5}
                      loop
                    />
                  </Typography>
                </Stack>
                <Typography variant="body2" sx={{ maxWidth: 520, color: "#ffffff" }}>
                  A modern space for micro-learning, tips, and peer knowledge sharing.
                </Typography>
              </Box>
              <Box sx={{ position: "absolute", right: -30, top: -30, width: 120, height: 120, borderRadius: "50%", bgcolor: "rgba(255, 255, 255, 0.18)" }} />
              <Box sx={{ position: "absolute", right: 20, bottom: -20, width: 80, height: 80, borderRadius: "50%", bgcolor: "rgba(255, 255, 255, 0.12)" }} />
            </Box>

            <Card sx={{ mb: 2, borderRadius: 2 }}>
              <CardContent sx={{ py: 2 }}>
                <Box sx={{ position: "relative" }}>
                  <SearchIcon sx={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search posts, tips, topics..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        pl: 3.5,
                        borderRadius: 2,
                        bgcolor: "#f8fafc",
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>

            <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
              <Card sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    {topics.map((t) => (
                      <Chip
                        key={t}
                        label={t}
                        icon={getTopicIcon(t)}
                        onClick={() => setFilterTopic(t)}
                        sx={{
                          bgcolor: filterTopic === t ? "#111827" : "#eef2f7",
                          color: filterTopic === t ? "#fff" : "#334155",
                        }}
                      />
                    ))}
                  </Stack>
                  <FormControl size="small" fullWidth>
                    <InputLabel>Sort</InputLabel>
                    <Select value={sortBy} label="Sort" onChange={(e) => setSortBy(e.target.value)}>
                      {SORTS.map((s) => (
                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </CardContent>
              </Card>
            </Box>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "240px 1fr 280px" },
                gap: 2,
              }}
            >
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Box sx={{ position: "sticky", top: 16, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="overline" sx={{ fontWeight: 700, color: "#64748b" }}>
                        Topics
                      </Typography>
                      <Stack spacing={0.5} sx={{ mt: 1 }}>
                        {topics.map((t) => (
                          <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Button
                              fullWidth
                              onClick={() => setFilterTopic(t)}
                              sx={{
                                justifyContent: "flex-start",
                                textTransform: "none",
                                color: filterTopic === t ? "#111827" : "#64748b",
                                fontWeight: filterTopic === t ? 700 : 500,
                                backgroundColor: filterTopic === t ? "#e2e8f0" : "transparent",
                                "&:hover": { backgroundColor: "#e2e8f0" },
                              }}
                              startIcon={getTopicIcon(t)}
                            >
                              {t}
                            </Button>
                            {t !== "All" && user && (
                              <IconButton
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFollowTopic(t);
                                }}
                                sx={{ color: followingTopics.includes(t) ? "#f59e0b" : "#cbd5f5" }}
                              >
                                {followingTopics.includes(t) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="overline" sx={{ fontWeight: 700, color: "#64748b" }}>
                        Sort By
                      </Typography>
                      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
                        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                          {SORTS.map((s) => (
                            <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </CardContent>
                  </Card>
                </Box>
              </Box>

              <Box>
                {!composerOpen ? (
                  <Card
                    sx={{ mb: 3, borderRadius: 2, border: "2px dashed #cbd5f5", cursor: "pointer" }}
                    onClick={() => setComposerOpen(true)}
                  >
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ width: 36, height: 36, borderRadius: "50%", bgcolor: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <SendIcon fontSize="small" />
                        </Box>
                        <Typography variant="body2" sx={{ color: "#64748b" }}>
                          Share a tip, insight, or start a discussion...
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                ) : (
                  <Card sx={{ mb: 3, borderRadius: 2, border: "1px solid #e2e8f0" }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Create a post
                        </Typography>
                        <IconButton size="small" onClick={() => setComposerOpen(false)}>
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                      <Stack spacing={2}>
                        <TextField
                          label="Title"
                          value={composer.title}
                          onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                          size="small"
                          fullWidth
                        />
                        <TextField
                          label="Share your thoughts, tips, or a quick snippet"
                          value={composer.body}
                          onChange={(e) => setComposer({ ...composer, body: e.target.value })}
                          multiline
                          rows={3}
                          size="small"
                          fullWidth
                        />
                        <TextField
                          label="Tags (comma separated)"
                          value={composer.tagsInput}
                          onChange={(e) => setComposer({ ...composer, tagsInput: e.target.value })}
                          placeholder="react, tips, learning"
                          size="small"
                          fullWidth
                        />
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "center" }}>
                          <Button
                            variant="outlined"
                            component="label"
                            startIcon={<ImageIcon />}
                            sx={{ textTransform: "none" }}
                            size="small"
                          >
                            Upload image/video
                            <input hidden type="file" accept="image/*,video/*" onChange={(e) => handleMediaUpload(e.target.files?.[0])} />
                          </Button>
                          {composer.media && (
                            <Chip
                              label={`${composer.media.kind === "video" ? "Video" : "Image"}: ${composer.media.name}`}
                              onDelete={() => setComposer((prev) => ({ ...prev, media: null }))}
                              size="small"
                            />
                          )}
                        </Stack>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ xs: "stretch", sm: "flex-start" }}>
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Topic</InputLabel>
                            <Select value={composer.topic} label="Topic" onChange={(e) => setComposer({ ...composer, topic: e.target.value })}>
                              {topics.filter((t) => t !== "All").map((t) => (
                                <MenuItem key={t} value={t}>{t}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <InputLabel>Type</InputLabel>
                            <Select value={composer.type} label="Type" onChange={(e) => setComposer({ ...composer, type: e.target.value })}>
                              <MenuItem value="post">Post</MenuItem>
                              <MenuItem value="video">Short video</MenuItem>
                              <MenuItem value="note">Note</MenuItem>
                              <MenuItem value="code">Code snippet</MenuItem>
                            </Select>
                          </FormControl>
                          <Box sx={{ flexGrow: 1 }} />
                          <Button variant="contained" onClick={handleAddPost} startIcon={<SendIcon />} size="small">
                            Post
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                )}

                <Stack spacing={2}>
                  {filtered.length === 0 && (
                    <Card sx={{ borderRadius: 2 }}>
                      <CardContent sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          No posts found. Try adjusting your filters or be the first to share!
                        </Typography>
                      </CardContent>
                    </Card>
                  )}

                  {filtered.map((post) => {
                    const isLiked = Array.isArray(post.likers) && post.likers.includes(user?.id);
                    const isSaved = Array.isArray(post.savers) && post.savers.includes(user?.id);
                    const isAuthor = user && post.author_id === user.id;
                    return (
                      <Card key={post.id} sx={{ borderRadius: 2, border: "1px solid #e2e8f0" }}>
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                            <Avatar sx={{ bgcolor: "#e2e8f0", width: 40, height: 40, color: "#334155" }}>
                              <PersonIcon fontSize="small" />
                            </Avatar>
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ flexWrap: "wrap" }}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                                  {post.author || post.creator || "Anonymous"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                  {timeAgo(post.created_at || post.createdAt)}
                                </Typography>
                              </Stack>
                              <Chip
                                size="small"
                                label={post.topic}
                                icon={getTopicIcon(post.topic)}
                                sx={{ mt: 0.75, bgcolor: "#eef2ff" }}
                              />
                            </Box>
                            {isAuthor && (
                              <Button
                                variant="text"
                                color="error"
                                size="small"
                                onClick={() => setDeleteDialog({ open: true, postId: post.id })}
                              >
                                Delete
                              </Button>
                            )}
                          </Stack>

                          <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "1rem" }}>
                            {post.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "#475569", mb: 2, lineHeight: 1.6 }}>
                            {post.content || post.body}
                          </Typography>

                          {post.tags && post.tags.length > 0 && (
                            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                              {(Array.isArray(post.tags) ? post.tags : typeof post.tags === "string" ? post.tags.split(",") : []).map((t) => (
                                <Chip key={t} label={`#${t.trim()}`} size="small" variant="outlined" />
                              ))}
                            </Stack>
                          )}

                          {post.media_url && (
                            <Box sx={{ mb: 2, borderRadius: 2, overflow: "hidden", border: "1px solid #e2e8f0", maxWidth: "100%" }}>
                              {post.media_url.startsWith("data:image") ? (
                                <img src={post.media_url} alt="uploaded" style={{ width: "100%", display: "block" }} />
                              ) : post.media_url.startsWith("data:video") ? (
                                <video src={post.media_url} controls style={{ width: "100%", display: "block" }} />
                              ) : null}
                            </Box>
                          )}

                          <Divider sx={{ mb: 1.5 }} />

                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                            <Button
                              size="small"
                              startIcon={isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                              onClick={() => handleLike(post.id)}
                              sx={{ textTransform: "none", color: isLiked ? "#ef4444" : "#64748b" }}
                            >
                              {post.likes || 0}
                            </Button>
                            <Button
                              size="small"
                              startIcon={<ChatBubbleOutlineIcon />}
                              sx={{ textTransform: "none", color: "#64748b" }}
                            >
                              {post.comments?.length || 0}
                            </Button>
                            <Button
                              size="small"
                              startIcon={isSaved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                              onClick={() => handleSave(post.id)}
                              sx={{ textTransform: "none", color: isSaved ? "#2563eb" : "#64748b" }}
                            >
                              Save
                            </Button>
                          </Stack>

                          <Stack spacing={1.5}>
                            {(Array.isArray(post.comments) ? post.comments : []).map((c) => (
                              <Box key={c.id} sx={{ bgcolor: "#f8fafc", p: 1.5, borderRadius: 2, border: "1px solid #e2e8f0", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
                                <Box sx={{ minWidth: 0 }}>
                                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#0f172a" }}>
                                    {c.author}
                                  </Typography>
                                  <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "#475569" }}>
                                    {c.text}
                                  </Typography>
                                </Box>
                                {user && c.author === user.email && (
                                  <Button
                                    size="small"
                                    color="error"
                                    sx={{ minWidth: 0, fontWeight: 700 }}
                                    onClick={() => handleDeleteComment(post.id, c.id)}
                                  >
                                    &times;
                                  </Button>
                                )}
                              </Box>
                            ))}

                            <Stack direction="row" spacing={1} alignItems="flex-start">
                              <TextField
                                size="small"
                                fullWidth
                                placeholder="Write a comment..."
                                value={commentDraft[post.id] || ""}
                                onChange={(e) => setCommentDraft((prev) => ({ ...prev, [post.id]: e.target.value }))}
                                onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                                sx={{
                                  "& .MuiOutlinedInput-root": {
                                    borderRadius: 2,
                                  },
                                }}
                              />
                              <IconButton onClick={() => handleComment(post.id)} color="primary" sx={{ mt: 0.5 }}>
                                <SendIcon fontSize="small" />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>

                <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, postId: null })}>
                  <DialogTitle>Delete Post?</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you sure you want to delete this post? This action cannot be undone.
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setDeleteDialog({ open: false, postId: null })} color="primary">
                      Cancel
                    </Button>
                    <Button onClick={() => handleDeletePost(deleteDialog.postId)} color="error" autoFocus>
                      Delete
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>

              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Box sx={{ position: "sticky", top: 16, display: "flex", flexDirection: "column", gap: 2 }}>
                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <TrendingUpIcon fontSize="small" sx={{ color: "#3b82f6" }} />
                        <Typography variant="overline" sx={{ fontWeight: 700, color: "#64748b" }}>
                          Trending
                        </Typography>
                      </Stack>
                      <Stack spacing={1}>
                        {trendingTopics.length === 0 ? (
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                            No trending topics yet
                          </Typography>
                        ) : (
                          trendingTopics.map(([t, count]) => (
                            <Box
                              key={t}
                              onClick={() => setFilterTopic(t)}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 1,
                                borderRadius: 2,
                                bgcolor: "#eef2f7",
                                cursor: "pointer",
                                "&:hover": { bgcolor: "#e2e8f0" },
                              }}
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                {getTopicIcon(t)}
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {t}
                                </Typography>
                              </Stack>
                              <Chip size="small" label={count} variant="outlined" />
                            </Box>
                          ))
                        )}
                      </Stack>
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <StarIcon fontSize="small" sx={{ color: "#f59e0b" }} />
                        <Typography variant="overline" sx={{ fontWeight: 700, color: "#64748b" }}>
                          Following
                        </Typography>
                      </Stack>
                      {followingTopics.length === 0 ? (
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          Star topics to follow them
                        </Typography>
                      ) : (
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {followingTopics.map((t) => (
                            <Chip key={t} label={t} size="small" onClick={() => setFilterTopic(t)} sx={{ cursor: "pointer" }} />
                          ))}
                        </Stack>
                      )}
                    </CardContent>
                  </Card>

                  <Card sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                        <BookmarkIcon fontSize="small" sx={{ color: "#2563eb" }} />
                        <Typography variant="overline" sx={{ fontWeight: 700, color: "#64748b" }}>
                          My Library
                        </Typography>
                      </Stack>
                      {(() => {
                        if (!user) return <Typography variant="caption" sx={{ color: "#94a3b8" }}>Login to save posts</Typography>;
                        const savedPosts = posts.filter((p) => Array.isArray(p.savers) && p.savers.includes(user.id));
                        if (savedPosts.length === 0) {
                          return <Typography variant="caption" sx={{ color: "#94a3b8" }}>Save posts to revisit later</Typography>;
                        }
                        return (
                          <Stack spacing={1}>
                            {savedPosts.slice(0, 5).map((p) => (
                              <Box
                                key={p.id}
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  p: 1,
                                  borderRadius: 2,
                                  bgcolor: "#f8fafc",
                                }}
                              >
                                <Typography variant="caption" sx={{ color: "#334155", flex: 1, mr: 1 }}>
                                  {p.title}
                                </Typography>
                                <Chip size="small" label={p.topic} />
                              </Box>
                            ))}
                            {savedPosts.length > 5 && (
                              <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                                +{savedPosts.length - 5} more
                              </Typography>
                            )}
                          </Stack>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
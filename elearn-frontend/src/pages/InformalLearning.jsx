import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import PersonIcon from "@mui/icons-material/Person";
import axios from "axios";
import API_URL from "../config";
import ImageIcon from "@mui/icons-material/Image";
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Container,
  Grid,
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




import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PageHeader from "../components/PageHeader";
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
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CodeIcon from "@mui/icons-material/Code";
import BrushIcon from "@mui/icons-material/Brush";
import ScienceIcon from "@mui/icons-material/Science";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

// Topics will be fetched from backend
const DEFAULT_TOPICS = ["All"];
const SORTS = [
  { value: "recent", label: "Most recent" },
  { value: "upvotes", label: "Most upvoted" },
  { value: "comments", label: "Most commented" },
];

const topicIcon = {
  Tech: <CodeIcon fontSize="small" />,
  Arts: <BrushIcon fontSize="small" />,
  Science: <ScienceIcon fontSize="small" />,
  "Soft skills": <PsychologyIcon fontSize="small" />,
  "Daily learning tips": <TipsAndUpdatesIcon fontSize="small" />,
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

  // Fetch posts from backend on mount and when user changes
  useEffect(() => {
    axios.get(`${API_URL}/informal-posts/`)
      .then(res => {
        const posts = (res.data || []).map(post => ({
          ...post,
          comments: typeof post.comments === 'string' ? (() => { try { return JSON.parse(post.comments); } catch { return []; } })() : (post.comments || []),
          savers: Array.isArray(post.savers)
            ? post.savers
            : post.savers == null
              ? []
              : [post.savers]
        }));
        setPosts(posts);
        // Debug log: posts and user
        // Log each post's id, savers, and the user id for debugging
        posts.forEach((p, i) => {
          console.log(`Post[${i}] id:`, p.id, 'savers:', p.savers);
        });
        if (user) {
          console.log('Current user id:', user.id, 'type:', typeof user.id);
        } else {
          console.log('No user logged in');
        }
      })
      .catch(() => {
        setPosts([]);
      });
  }, [user]);
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

  useEffect(() => {
    localStorage.setItem("informalPosts", JSON.stringify(posts));
  }, [posts]);



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
          || p.body.toLowerCase().includes(q)
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
            const posts = (res2.data || []).map(post => ({
              ...post,
              comments: typeof post.comments === 'string' ? (() => { try { return JSON.parse(post.comments); } catch { return []; } })() : (post.comments || []),
              savers: Array.isArray(post.savers)
                ? post.savers
                : post.savers == null
                  ? []
                  : [post.savers]
            }));
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
            const posts = (res2.data || []).map(post => ({
              ...post,
              comments: typeof post.comments === 'string' ? (() => { try { return JSON.parse(post.comments); } catch { return []; } })() : (post.comments || []),
              savers: Array.isArray(post.savers)
                ? post.savers
                : post.savers == null
                  ? []
                  : [post.savers]
            }));
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

  const formatDate = (iso) => new Date(iso).toLocaleString();



  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f7 100%)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Navbar />
        <Box
          sx={{
            flexGrow: 1,
            ml: { xs: 0, md: isOpen ? 25 : 8.75 },
            transition: "margin-left 0.3s ease",
            pb: 4,
          }}
        >
          <Box sx={{ mt: 4, pl: { xs: 2, md: 1 }, pr: { xs: 2, md: 3 }, maxWidth: "1600px", mx: "auto" }}>
            <PageHeader
              title="Community Feed"
              subtitle="A modern, free-flow feed for micro-learning, tips, and peer knowledge"
              backgroundGradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
              disableAnimation={true}
            />

            {/* REDDIT-LIKE THREE-COLUMN LAYOUT */}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "260px 1fr 300px",
                },
                gap: { xs: 2, md: 0.75 },
                mt: 2,
                ml: { xs: 0, md: -3 },
              }}
            >
              {/* LEFT SIDEBAR - FILTERS (Sticky) */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Box sx={{ position: "sticky", top: 20 }}>
                  {/* Topic Filter Card */}
                  <Card sx={{ mb: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: "0.85rem" }}>
                        TOPICS
                      </Typography>
                      <Stack spacing={0.5}>
                        {topics.map((t) => (
                          <Box key={t} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <Button
                              fullWidth
                              onClick={() => setFilterTopic(t)}
                              sx={{
                                justifyContent: "flex-start",
                                textTransform: "none",
                                color: filterTopic === t ? "#0066cc" : "#666",
                                fontWeight: filterTopic === t ? 700 : 500,
                                fontSize: "0.9rem",
                                backgroundColor: filterTopic === t ? "#f0f4f8" : "transparent",
                                "&:hover": {
                                  backgroundColor: filterTopic === t ? "#e8eef7" : "#f7f9fa",
                                },
                                py: 0.75,
                                pl: 1,
                              }}
                              startIcon={t !== "All" ? topicIcon[t] : undefined}
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
                                sx={{
                                  color: followingTopics.includes(t) ? "#fbbf24" : "#d1d5db",
                                  "&:hover": {
                                    color: followingTopics.includes(t) ? "#f59e0b" : "#9ca3af",
                                  },
                                }}
                              >
                                {followingTopics.includes(t) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                              </IconButton>
                            )}
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Sort Options Card */}
                  <Card sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: "0.85rem" }}>
                        SORT BY
                      </Typography>
                      <FormControl fullWidth size="small">
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

              {/* CENTER FEED */}
              <Box>
                {/* Search Bar */}
                <Card sx={{ mb: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <CardContent sx={{ pb: 1.5, pt: 1.5 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Search posts, tips, topics..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          backgroundColor: "#f7f9fa",
                        },
                      }}
                    />
                  </CardContent>
                </Card>

                {/* Mobile Filters */}
                <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
                  <Card sx={{ mb: 2, boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                        {topics.map((t) => (
                          <Chip
                            key={t}
                            label={t}
                            icon={t !== "All" ? topicIcon[t] : undefined}
                            color={filterTopic === t ? "primary" : "default"}
                            onClick={() => setFilterTopic(t)}
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

                {/* Create Post Card */}
                <Card sx={{ mb: 3, boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "2px solid #667eea" }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, fontSize: "1rem" }}>
                      Share something quick
                    </Typography>
                    <Stack spacing={2}>
                      <TextField
                        label="Title"
                        value={composer.title}
                        onChange={(e) => setComposer({ ...composer, title: e.target.value })}
                        fullWidth
                        size="small"
                      />
                      <TextField
                        label="Your note, tip, or snippet"
                        value={composer.body}
                        onChange={(e) => setComposer({ ...composer, body: e.target.value })}
                        fullWidth
                        multiline
                        rows={3}
                        size="small"
                      />
                      <TextField
                        label="Tags (comma separated)"
                        value={composer.tagsInput}
                        onChange={(e) => setComposer({ ...composer, tagsInput: e.target.value })}
                        fullWidth
                        placeholder="ai, study, habits"
                        size="small"
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
                          <input
                            hidden
                            type="file"
                            accept="image/*,video/*"
                            onChange={(e) => handleMediaUpload(e.target.files?.[0])}
                          />
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

                {/* Posts Feed */}
                <Stack spacing={2}>
                  {filtered.map((post) => (
                    <Card key={post.id} sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e5e7eb", "&:hover": { boxShadow: "0 2px 8px rgba(0,0,0,0.12)" } }}>
                      <CardContent>
                        {/* Post Header */}
                        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2, position: 'relative' }}>
                          <Avatar sx={{ bgcolor: "#9ca3af", width: 40, height: 40 }}>
                            <PersonIcon />
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.25 }}>
                              {post.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
                              {/* Always show email and role if present, else fallback to 'Unknown' */}
                              {post.creator_email
                                ? `${post.creator_email} (${post.creator_role || "role unknown"})`
                                : post.email
                                  ? `${post.email} (${post.role || "role unknown"})`
                                  : "Unknown"}
                              {post.created_at || post.createdAt ? (
                                <> • {formatDate(post.created_at || post.createdAt)}</>
                              ) : null}
                            </Typography>
                                                  {/* Show tags if present */}
                                                  {post.tags && (
                                                    <Stack direction="row" spacing={1} sx={{ mt: 1, mb: 1 }}>
                                                      {post.tags.split(",").map((tag, idx) => (
                                                        <Chip key={idx} label={tag.trim()} size="small" />
                                                      ))}
                                                    </Stack>
                                                  )}
                                                  {/* Show media if present */}
                                                  {post.media_url && (
                                                    <Box sx={{ mt: 1, mb: 1 }}>
                                                      {post.media_url.startsWith("data:image") ? (
                                                        <img src={post.media_url} alt="uploaded" style={{ maxWidth: 300, maxHeight: 200, borderRadius: 8 }} />
                                                      ) : post.media_url.startsWith("data:video") ? (
                                                        <video src={post.media_url} controls style={{ maxWidth: 300, maxHeight: 200, borderRadius: 8 }} />
                                                      ) : null}
                                                    </Box>
                                                  )}
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                            <Chip size="small" label={post.topic} icon={topicIcon[post.topic]} />
                            {user && (post.author_id === user.id) && (
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                sx={{ minWidth: 0, px: 1, py: 0.5, fontSize: '0.75rem' }}
                                onClick={() => setDeleteDialog({ open: true, postId: post.id })}
                              >
                                Delete
                              </Button>
                            )}
                          </Stack>
                        </Stack>

                        {/* Post Body */}
                        <Typography variant="body2" sx={{ color: "#374151", mb: 1.5, lineHeight: 1.5 }}>
                          {post.body}
                        </Typography>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                            {(Array.isArray(post.tags) ? post.tags : typeof post.tags === 'string' ? post.tags.split(',') : []).map((t) => (
                              <Chip key={t} label={t} size="small" variant="outlined" />
                            ))}
                          </Stack>
                        )}

                        {/* Media */}
                        {post.media && post.media.kind === "image" && (
                          <Box sx={{ mt: 1.5, mb: 1.5, borderRadius: 2, overflow: "hidden", border: "1px solid #e5e7eb", maxHeight: 400 }}>
                            <img src={post.media.src} alt={post.media.name || "attachment"} style={{ width: "100%", display: "block" }} />
                          </Box>
                        )}

                        {post.media && post.media.kind === "video" && (
                          <Box sx={{ mt: 1.5, mb: 1.5, borderRadius: 2, overflow: "hidden" }}>
                            <video src={post.media.src} controls style={{ width: "100%", maxHeight: 400 }} />
                          </Box>
                        )}

                        {/* Interaction Bar */}
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1.5, py: 1, borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb" }}>
                          <Button
                            size="small"
                            startIcon={post.likers?.includes(user?.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            onClick={() => handleLike(post.id)}
                            sx={{ textTransform: "none", color: post.likers?.includes(user?.id) ? "#ef4444" : "#666" }}
                          >
                            {post.likes}
                          </Button>

                          <Button
                            size="small"
                            startIcon={<ChatBubbleOutlineIcon />}
                            sx={{ textTransform: "none", color: "#666" }}
                          >
                            {post.comments?.length || 0}
                          </Button>

                          <Button
                            size="small"
                            startIcon={post.savers?.includes(user?.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            onClick={() => handleSave(post.id)}
                            sx={{ textTransform: "none", color: post.savers?.includes(user?.id) ? "#2563eb" : "#666" }}
                          >
                            Save
                          </Button>

                          <Box sx={{ flexGrow: 1 }} />


                        </Stack>



                        {/* Comments Section */}

                        <Stack spacing={1.5}>
                          {(Array.isArray(post.comments) ? post.comments : []).map((c) => (
                            <Box key={c.id} sx={{ background: "#f8fafc", p: 1.5, borderRadius: 1, border: "1px solid #e5e7eb", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box>
                                <Typography variant="caption" sx={{ fontWeight: 700, color: "#111" }}>
                                  {c.author}
                                </Typography>
                                <Typography variant="caption" sx={{ display: "block", mt: 0.25, color: "#4b5563", lineHeight: 1.4 }}>
                                  {c.text}
                                </Typography>
                              </Box>
                              {user && c.author === user.email && (
                                <Button
                                  size="small"
                                  color="error"
                                  sx={{ minWidth: 0, ml: 2, fontSize: '1.1em', fontWeight: 700 }}
                                  onClick={() => handleDeleteComment(post.id, c.id)}
                                >
                                  &times;
                                </Button>
                              )}
                            </Box>
                          ))}

                          {/* Comment Input */}
                          <Stack direction="row" spacing={1} alignItems="flex-start">
                            <TextField
                              size="small"
                              fullWidth
                              placeholder="Add a comment"
                              value={commentDraft[post.id] || ""}
                              onChange={(e) => setCommentDraft((prev) => ({ ...prev, [post.id]: e.target.value }))}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: 1,
                                },
                              }}
                            />
                            <IconButton
                              onClick={() => handleComment(post.id)}
                              color="primary"
                              sx={{ mt: 0.5 }}
                            >
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}

                  {/* Empty State */}
                  {filtered.length === 0 && (
                    <Card sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                      <CardContent sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="body2" sx={{ color: "#6b7280" }}>
                          No posts found. Try adjusting your filters or be the first to share!
                        </Typography>
                      </CardContent>
                    </Card>
                  )}
                </Stack>
                {/* Single Delete Confirmation Dialog rendered once, outside the map */}
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

              {/* RIGHT SIDEBAR - TRENDING & INFO (Sticky) */}
              <Box sx={{ display: { xs: "none", md: "block" } }}>
                <Box
                  sx={{
                    position: "sticky",
                    top: 20,
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                  }}
                >
                  {/* Trending Topics */}
                  <Card sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: "0.9rem" }}>
                        TRENDING
                      </Typography>
                      <Stack spacing={1.5}>
                        {trendingTopics.length === 0 ? (
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                            No trending topics yet
                          </Typography>
                        ) : (
                          trendingTopics.map(([t, count]) => (
                            <Stack
                              key={t}
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{
                                p: 1,
                                borderRadius: 1,
                                cursor: "pointer",
                                backgroundColor: filterTopic === t ? "#f0f4f8" : "#f8fafc",
                                "&:hover": { backgroundColor: "#f0f4f8" },
                                transition: "background-color 0.2s",
                              }}
                              onClick={() => setFilterTopic(t)}
                            >
                              <Stack direction="row" spacing={1} alignItems="center">
                                {topicIcon[t]}
                                <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
                                  {t}
                                </Typography>
                              </Stack>
                              <Chip size="small" label={`${count}`} variant="outlined" />
                            </Stack>
                          ))
                        )}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Following */}
                  <Card sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: "0.9rem" }}>
                        FOLLOWING
                      </Typography>

                      <Typography variant="caption" sx={{ color: "#6b7280", fontWeight: 600, display: "block", mb: 1 }}>
                        Topics
                      </Typography>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1.5 }}>
                        {followingTopics.length === 0 ? (
                          <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                            None yet
                          </Typography>
                        ) : (
                          followingTopics.map((t) => (
                            <Chip
                              key={t}
                              label={t}
                              size="small"
                              onClick={() => setFilterTopic(t)}
                              sx={{ cursor: "pointer" }}
                            />
                          ))
                        )}
                      </Stack>

                    </CardContent>
                  </Card>

                  {/* My Library (Saved Posts) */}
                  <Card sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: "0.9rem" }}>
                        MY LIBRARY
                      </Typography>
                      {(() => {
                        if (!user) return <Typography variant="caption" sx={{ color: "#94a3b8" }}>Login to save posts</Typography>;
                        const savedPosts = posts.filter((p) => Array.isArray(p.savers) && p.savers.includes(user.id));
                        if (savedPosts.length === 0) {
                          return <Typography variant="caption" sx={{ color: "#94a3b8" }}>Save posts to revisit later</Typography>;
                        }
                        return (
                          <Stack spacing={1}>
                            {savedPosts.slice(0, 5).map((p) => (
                              <Stack
                                key={p.id}
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                sx={{
                                  p: 0.75,
                                  borderRadius: 1,
                                  backgroundColor: "#f8fafc",
                                  cursor: "pointer",
                                  "&:hover": { backgroundColor: "#f0f4f8" },
                                }}
                              >
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: "0.8rem",
                                    color: "#374151",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    flex: 1,
                                  }}
                                >
                                  {p.title}
                                </Typography>
                                <Chip label={p.topic} size="small" />
                              </Stack>
                            ))}
                            {savedPosts.length > 5 && (
                              <Typography variant="caption" sx={{ color: "#6b7280", mt: 1 }}>
                                +{savedPosts.length - 5} more
                              </Typography>
                            )}
                          </Stack>
                        );
                      })()}
                    </CardContent>
                  </Card>

                  {/* My Library */}



                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
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
import ImageIcon from "@mui/icons-material/Image";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const DEFAULT_POSTS = [
  {
    id: "post-1",
    title: "AI prompt: turn requirements into UI wireframes in minutes",
    body: "I pair Figma+GPT. Paste the problem, ask for flow, refine prompts, export components.",
    topic: "Tech",
    type: "post",
    creator: "Anonymous",
    creatorRole: "User",
    likes: 42,
    comments: [
      { id: "c1", author: "Anonymous", text: "Tried this for a hackathon. Massive time saver." },
      { id: "c2", author: "Anonymous", text: "Share your prompt template?" },
    ],
    saves: 12,
    createdAt: "2025-01-05T10:00:00Z",
    tags: ["AI", "UI", "productivity"],
  },
  {
    id: "post-2",
    title: "60s micro-tutorial: Flexbox mental model",
    body: "Think rows/columns as axes. justify-content aligns on main axis, align-items on cross axis. Gap beats margins.",
    topic: "Tech",
    type: "video",
    media: "shorts://flexbox",
    creator: "Anonymous",
    creatorRole: "User",
    likes: 31,
    comments: [],
    saves: 9,
    createdAt: "2025-01-06T08:00:00Z",
    tags: ["CSS", "layout", "quick-tip"],
  },
  {
    id: "post-3",
    title: "Daily study hack: 25/5 rule",
    body: "25 minutes deep work + 5 minute reset. Stack 3 rounds, then a longer break.",
    topic: "Daily learning tips",
    type: "note",
    creator: "Anonymous",
    creatorRole: "User",
    likes: 18,
    comments: [],
    saves: 6,
    createdAt: "2025-01-04T12:00:00Z",
    tags: ["productivity", "habits"],
  },
  {
    id: "post-4",
    title: "Soft-skills quick tip: disagreeing with care",
    body: "Lead with agreement, offer a why, invite them in: 'I like X. I wonder if Y helps because Z. What do you think?'",
    topic: "Soft skills",
    type: "post",
    creator: "Anonymous",
    creatorRole: "User",
    likes: 22,
    comments: [],
    saves: 7,
    createdAt: "2025-01-03T17:00:00Z",
    tags: ["communication", "teams"],
  },
  {
    id: "post-5",
    title: "Beginner Python: list vs tuple cheat",
    body: "If you need mutate: list. Need hashable/keys: tuple. Memory-light & safe: tuple.",
    topic: "Tech",
    type: "code",
    creator: "Anonymous",
    creatorRole: "User",
    likes: 54,
    comments: [{ id: "c5", author: "Anonymous", text: "Great mnemonic." }],
    saves: 20,
    createdAt: "2025-01-02T09:00:00Z",
    tags: ["python", "basics", "cheatsheet"],
  },
];

const TOPICS = ["All", "Tech", "Arts", "Science", "Soft skills", "Daily learning tips"];
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
  const { isOpen } = useSidebar();
  const { user } = useAuth();

  const [posts, setPosts] = useState(() => {
    const stored = localStorage.getItem("informalPosts");
    return stored ? JSON.parse(stored) : DEFAULT_POSTS;
  });
  const [saved, setSaved] = useState(() => {
    const stored = localStorage.getItem("informalSaved");
    return stored ? JSON.parse(stored) : [];
  });
  const [followingTopics, setFollowingTopics] = useState(() => {
    const stored = localStorage.getItem("informalFollowTopics");
    return stored ? JSON.parse(stored) : ["Tech", "Daily learning tips"];
  });
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

  useEffect(() => {
    localStorage.setItem("informalSaved", JSON.stringify(saved));
  }, [saved]);

  useEffect(() => {
    localStorage.setItem("informalFollowTopics", JSON.stringify(followingTopics));
  }, [followingTopics]);

  useEffect(() => {
    localStorage.setItem("informalFollowCreators", JSON.stringify(followingCreators));
  }, [followingCreators]);

  const filtered = useMemo(() => {
    let data = [...posts];
    if (filterTopic !== "All") data = data.filter((p) => p.topic === filterTopic);
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter((p) => p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q) || p.tags?.some((t) => t.toLowerCase().includes(q)));
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

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) => {
        const liked = p.likers?.includes(user?.id);
        const likers = liked ? p.likers.filter((x) => x !== user?.id) : [...(p.likers || []), user?.id];
        return p.id === id ? { ...p, likes: liked ? p.likes - 1 : p.likes + 1, likers } : p;
      })
    );
  };

  const handleSave = (id) => {
    setSaved((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleComment = (id) => {
    const text = (commentDraft[id] || "").trim();
    if (!text) return;
    const newComment = {
      id: `c-${Date.now()}`,
      author: "Anonymous",
      text,
    };
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, comments: [...(p.comments || []), newComment] } : p)));
    setCommentDraft((prev) => ({ ...prev, [id]: "" }));
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
      const storedSaved = JSON.parse(localStorage.getItem("informalSaved") || "null");
      const storedFollowingTopics = JSON.parse(localStorage.getItem("informalFollowingTopics") || "null");
      const storedFollowingCreators = JSON.parse(localStorage.getItem("informalFollowingCreators") || "null");
      const storedBadges = JSON.parse(localStorage.getItem("informalBadges") || "null");

      if (storedPosts) setPosts(storedPosts);
      if (storedSaved) setSaved(storedSaved);
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
      localStorage.setItem("informalSaved", JSON.stringify(saved));
    } catch {}
  }, [saved]);

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
      .filter(Boolean);
    const newPost = {
      id: `post-${Date.now()}`,
      title: composer.title,
      body: composer.body,
      topic: composer.topic,
      type: composer.type,
      creator: "Anonymous",
      creatorRole: "User",
      likes: 0,
      comments: [],
      saves: 0,
      createdAt: new Date().toISOString(),
      tags,
      authorId: user?.id,
      media: composer.media,
    };
    setPosts((prev) => [newPost, ...prev]);
    setComposer({ title: "", body: "", topic: composer.topic, type: "post", tagsInput: "", media: null });
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

  const handleFollowTopic = (topic) => {
    if (topic === "All") return; // Can't follow "All"
    if (followingTopics.includes(topic)) {
      setFollowingTopics((prev) => prev.filter((t) => t !== topic));
    } else {
      setFollowingTopics((prev) => [...prev, topic]);
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
                        {TOPICS.map((t) => (
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
                            {t !== "All" && (
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
                        {TOPICS.map((t) => (
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
                            {TOPICS.filter((t) => t !== "All").map((t) => (
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
                        <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
                          <Avatar sx={{ bgcolor: "#9ca3af", width: 40, height: 40 }}>
                            ?
                          </Avatar>
                          <Box sx={{ flexGrow: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: "1rem", mb: 0.25 }}>
                              {post.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: "#6b7280", fontSize: "0.8rem" }}>
                              Anonymous • {formatDate(post.createdAt)}
                            </Typography>
                          </Box>
                          <Chip size="small" label={post.topic} icon={topicIcon[post.topic]} />
                        </Stack>

                        {/* Post Body */}
                        <Typography variant="body2" sx={{ color: "#374151", mb: 1.5, lineHeight: 1.5 }}>
                          {post.body}
                        </Typography>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 1.5 }}>
                            {post.tags.map((t) => (
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
                            startIcon={saved.includes(post.id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                            onClick={() => handleSave(post.id)}
                            sx={{ textTransform: "none", color: saved.includes(post.id) ? "#2563eb" : "#666" }}
                          >
                            Save
                          </Button>

                          <Box sx={{ flexGrow: 1 }} />


                        </Stack>



                        {/* Comments Section */}
                        <Stack spacing={1.5}>
                          {(post.comments || []).map((c) => (
                            <Box key={c.id} sx={{ background: "#f8fafc", p: 1.5, borderRadius: 1, border: "1px solid #e5e7eb" }}>
                              <Typography variant="caption" sx={{ fontWeight: 700, color: "#111" }}>
                                {c.author}
                              </Typography>
                              <Typography variant="caption" sx={{ display: "block", mt: 0.25, color: "#4b5563", lineHeight: 1.4 }}>
                                {c.text}
                              </Typography>
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

                  {/* My Library */}
                  <Card sx={{ boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    <CardContent>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, fontSize: "0.9rem" }}>
                        MY LIBRARY
                      </Typography>
                      {saved.length === 0 ? (
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                          Save posts to revisit later
                        </Typography>
                      ) : (
                        <Stack spacing={1}>
                          {saved.slice(0, 5).map((id) => {
                            const p = posts.find((x) => x.id === id);
                            if (!p) return null;
                            return (
                              <Stack
                                key={id}
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
                            );
                          })}
                          {saved.length > 5 && (
                            <Typography variant="caption" sx={{ color: "#6b7280", mt: 1 }}>
                              +{saved.length - 5} more
                            </Typography>
                          )}
                        </Stack>
                      )}
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
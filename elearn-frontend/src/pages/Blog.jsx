import { Box, Container, Typography, Card, CardContent, CardMedia, Chip } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import BackgroundVideo from "../components/BackgroundVideo";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function Blog() {
  const blogPosts = [
    {
      title: "The Future of Online Learning: Trends to Watch in 2025",
      excerpt: "Discover the emerging trends shaping the future of education, from AI-powered personalization to immersive virtual classrooms.",
      date: "December 15, 2024",
      category: "Education Technology",
      image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&auto=format&fit=crop",
    },
    {
      title: "How to Stay Motivated While Learning Online",
      excerpt: "Practical tips and strategies to maintain focus, build habits, and achieve your learning goals in a self-paced environment.",
      date: "December 10, 2024",
      category: "Study Tips",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop",
    },
    {
      title: "The Power of Community Learning",
      excerpt: "Explore how peer collaboration and community support can enhance your educational journey and accelerate skill development.",
      date: "December 5, 2024",
      category: "Community",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop",
    },
    {
      title: "AI Tutors: Your 24/7 Learning Companion",
      excerpt: "Learn how artificial intelligence is revolutionizing personalized education with instant feedback and adaptive learning paths.",
      date: "November 30, 2024",
      category: "AI & Innovation",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop",
    },
  ];

  return (
    <Box sx={{ position: "relative", width: "100%", minHeight: "100vh" }}>
      {/* Background Video - Optimized for fast loading */}
      <BackgroundVideo src="/videos/bg-video.mp4" blur="2px" overlay={0.08} />

      {/* All Content - On Top */}
      <Box sx={{ position: "relative", zIndex: 1 }}>
      <Navbar />
      
      {/* Hero Section */}
      <HeroSection
        title="EduSphere Blog"
        subtitle="Insights, tips, and stories from the world of online learning"
      />

      {/* Blog Posts */}
      <Container maxWidth="lg" sx={{ py: 8, flex: 1 }}>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 4 }}>
          {blogPosts.map((post, index) => (
            <MotionCard
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              sx={{
                cursor: "pointer",
                background: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
              />
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Chip label={post.category} size="small" sx={{ background: "#667eea", color: "white" }} />
                  <Typography variant="caption" sx={{ ml: 2, color: "#ffffff" }}>
                    {post.date}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: "#ffffff" }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ffffff", lineHeight: 1.7 }}>
                  {post.excerpt}
                </Typography>
              </CardContent>
            </MotionCard>
          ))}
        </Box>
      </Container>

      <Footer sticky={false} />
      </Box>
    </Box>
  );
}

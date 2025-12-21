import { Box, Container, Typography, Card, CardContent, CardMedia, Chip } from "@mui/material";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
    <Box sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      
      {/* Hero Section */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          py: 8,
          mt: 8,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, textAlign: "center" }}>
              EduSphere Blog
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center", opacity: 0.9 }}>
              Insights, tips, and stories from the world of online learning
            </Typography>
          </motion.div>
        </Container>
      </Box>

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
                  <Typography variant="caption" sx={{ ml: 2, color: "#999" }}>
                    {post.date}
                  </Typography>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                  {post.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#666", lineHeight: 1.7 }}>
                  {post.excerpt}
                </Typography>
              </CardContent>
            </MotionCard>
          ))}
        </Box>
      </Container>

      <Footer />
    </Box>
  );
}

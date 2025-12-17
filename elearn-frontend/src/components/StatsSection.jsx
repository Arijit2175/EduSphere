import { Box, Grid, Typography, Container } from "@mui/material";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const MotionBox = motion(Box);

export default function StatsSection() {
  const stats = [
    { label: "Active Learners", value: 15000, icon: "👥" },
    { label: "Courses Available", value: 500, icon: "📚" },
    { label: "Instructors", value: 250, icon: "👨‍🏫" },
    { label: "Learning Hours", value: 100000, icon: "⏱️" },
  ];

  const [displayValues, setDisplayValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const timers = stats.map((stat, index) => {
      const increment = stat.value / 50;
      let current = 0;
      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timers[index]);
        }
        setDisplayValues((prev) => {
          const newValues = [...prev];
          newValues[index] = Math.floor(current);
          return newValues;
        });
      }, 30);
    });

    return () => timers.forEach((timer) => clearInterval(timer));
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box sx={{ py: 6, background: "white", borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            textAlign: "center",
            mb: 1,
            color: "#2c3e50",
            fontSize: { xs: "1.5rem", md: "2rem" },
          }}
        >
          Our Impact
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: "center",
            color: "#666",
            mb: 4,
            fontSize: { xs: "0.9rem", md: "1rem" },
          }}
        >
          Trusted by thousands of learners worldwide
        </Typography>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={3} justifyContent="center" alignItems="stretch">
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div variants={itemVariants}>
                  <MotionBox
                    whileHover={{ scale: 1.05 }}
                    sx={{
                      textAlign: "center",
                      p: 3,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 2,
                      color: "white",
                      transition: "all 0.3s ease",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Box sx={{ fontSize: "2.5rem", mb: 1 }}>{stat.icon}</Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        fontSize: "2rem",
                        mb: 1,
                      }}
                    >
                      {displayValues[index].toLocaleString()}+
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#ffffff",
                        opacity: 0.98,
                        fontWeight: 600,
                        textShadow: "0 1px 2px rgba(0,0,0,0.25)",
                      }}
                    >
                      {stat.label}
                    </Typography>
                  </MotionBox>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
}

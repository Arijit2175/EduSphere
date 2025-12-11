import { Grid, Box, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

export default function FeaturesGrid({ features = [] }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <Grid container spacing={3}>
        {features.map((feature, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <motion.div variants={itemVariants}>
              <MotionPaper
                whileHover={{ y: -8, boxShadow: "0 12px 32px rgba(0,0,0,0.15)" }}
                sx={{
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  background: "white",
                  border: "1px solid rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box sx={{ fontSize: "2.5rem" }}>{feature.icon}</Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#2c3e50" }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#7f8c8d", lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </MotionPaper>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );
}

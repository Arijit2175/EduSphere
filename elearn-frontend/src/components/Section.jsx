import { Box, Container, Typography } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Section({
  children,
  title,
  delay = 0,
  className = "",
  background = "transparent",
  minHeight = "auto",
  py = { xs: 4, md: 6 },
  pb = py,
  pt = py,
  noContainer = false,
  id = null,
  animated = true,
}) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay, ease: "easeOut" },
    },
  };

  const sectionContent = (
    <>
      {title && (
        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
            mb: 2.5,
            color: "#0f172a",
            letterSpacing: "-0.01em",
            fontFamily: '"Space Grotesk", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
          }}
        >
          {title}
        </Typography>
      )}
      {children}
    </>
  );

  const content = noContainer ? sectionContent : <Container maxWidth="lg">{sectionContent}</Container>;

  if (!animated) {
    return (
      <Box
        component="section"
        id={id}
        className={className}
        sx={{
          background,
          minHeight,
          py: pt,
          pb: pb,
        }}
      >
        {content}
      </Box>
    );
  }

  return (
    <MotionBox
      component="section"
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={sectionVariants}
      sx={{
        background,
        minHeight,
        py: pt,
        pb: pb,
      }}
    >
      {content}
    </MotionBox>
  );
}

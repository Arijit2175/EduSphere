import { Box, Container } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function Section({
  children,
  background = "transparent",
  minHeight = "auto",
  py = { xs: 4, md: 6 },
  pb = py,
  pt = py,
  noContainer = false,
  id = null,
  animated = true,
  delay = 0,
}) {
  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay },
    },
  };

  const content = noContainer ? children : <Container maxWidth="lg">{children}</Container>;

  if (!animated) {
    return (
      <Box
        id={id}
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
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
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

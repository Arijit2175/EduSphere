import { Button } from "@mui/material";
import { motion } from "framer-motion";

export default function AnimatedButton({ text, href, sx, onClick }) {
  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="contained"
        color="primary"
        href={href}
        onClick={onClick}
        sx={{
          borderRadius: 3,
          boxShadow: 3,
          height: 100,
          fontSize: "1.1rem",
          ...sx,
        }}
      >
        {text}
      </Button>
    </motion.div>
  );
}

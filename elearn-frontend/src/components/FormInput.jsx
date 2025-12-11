import { TextField, Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionTextField = motion(TextField);

export default function FormInput({ label, type = "text", placeholder, fullWidth = true, required = false, error = false, helperText = "", ...props }) {
  return (
    <MotionTextField
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      label={label}
      type={type}
      placeholder={placeholder}
      fullWidth={fullWidth}
      required={required}
      error={error}
      helperText={helperText}
      variant="outlined"
      sx={{
        mb: 2,
        "& .MuiOutlinedInput-root": {
          borderRadius: 2,
          transition: "all 0.3s ease",
          "&:hover fieldset": {
            borderColor: "#667eea",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#667eea",
            boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
          },
        },
        "& .MuiInputBase-input": {
          py: 1.5,
        },
      }}
      {...props}
    />
  );
}

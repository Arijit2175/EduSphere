import { Box, Container, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const MotionBox = motion(Box);
const MotionTypography = motion(Typography);
const MotionAvatar = motion(Avatar);

export default function PageHeader({ title, subtitle, backgroundGradient, showAvatar, avatarSrc, userName, onAvatarChange, disableAnimation }) {
  const [scrollY, setScrollY] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (onAvatarChange) {
          onAvatarChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleClearAvatar = (e) => {
    e.stopPropagation();
    if (onAvatarChange) {
      onAvatarChange(null);
    }
  };

  useEffect(() => {
    if (disableAnimation) return;
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disableAnimation]);

  // Calculate scroll-based transformations
  const scrollProgress = disableAnimation ? 0 : Math.min(scrollY / 200, 1);
  const headerHeight = disableAnimation ? 1 : 1 - (scrollProgress * 0.5);
  const headerOpacity = disableAnimation ? 1 : 1 - (scrollProgress * 0.3);
  const translateY = disableAnimation ? 0 : -(scrollProgress * 30);

  return (
    <MotionBox
      initial={disableAnimation ? false : { opacity: 0, y: -20 }}
      animate={disableAnimation ? {} : { 
        opacity: headerOpacity, 
        y: translateY,
        scaleY: headerHeight,
      }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      sx={{
        position: disableAnimation ? "relative" : "sticky",
        top: disableAnimation ? 0 : 80,
        zIndex: 9,
        background: backgroundGradient || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "#ffffff",
        py: { xs: 6, md: 8 },
        mb: 4,
        borderRadius: "20px",
        overflow: "hidden",
        boxShadow: "0 10px 40px rgba(102, 126, 234, 0.3)",
        transformOrigin: "top center",
        mt: 0,
        textAlign: "center",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)",
          pointerEvents: "none",
        },
        "&::after": {
          content: '""',
          position: "absolute",
          top: "-50%",
          right: "-10%",
          width: "40%",
          height: "200%",
          background: "radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ flex: 1 }}>
            <MotionTypography
              variant="h3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              sx={{
                fontWeight: 800,
                mb: 1.5,
                fontSize: { xs: "2rem", md: "3rem" },
                background: "linear-gradient(to right, #ffffff 0%, #e0e7ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            >
              {title}
            </MotionTypography>
            {subtitle && (
              <MotionTypography
                variant="h6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                sx={{
                  fontWeight: 500,
                  opacity: 0.95,
                  fontSize: { xs: "1rem", md: "1.2rem" },
                  color: "#e0e7ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                  width: "100%",
                  "&::before": {
                    content: '"✨"',
                    fontSize: "1.2rem",
                  },
                }}
              >
                {subtitle}
              </MotionTypography>
            )}
          </Box>

          {/* Profile Avatar */}
          {showAvatar && (
            <Box sx={{ position: "relative", mr: { xs: 6, md: 12 } }}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: "none" }}
              />
              <Tooltip title={avatarSrc ? "Change profile picture" : "Add profile picture"}>
                <MotionAvatar
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  src={avatarSrc || ""}
                  alt={userName || "User"}
                  onClick={handleAvatarClick}
                  sx={{
                    width: { xs: 80, md: 120 },
                    height: { xs: 80, md: 120 },
                    border: "4px solid rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
                    fontSize: { xs: "2rem", md: "3rem" },
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
                    color: "#667eea",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "scale(1.05)",
                      transition: "transform 0.2s ease",
                    },
                  }}
                >
                  {!avatarSrc && userName ? userName.charAt(0).toUpperCase() : "U"}
                </MotionAvatar>
              </Tooltip>
              <Box sx={{ display: "flex", gap: 0.5, position: "absolute", bottom: 0, right: 0 }}>
                {avatarSrc && (
                  <IconButton
                    onClick={handleClearAvatar}
                    sx={{
                      backgroundColor: "#e74c3c",
                      color: "white",
                      width: { xs: 28, md: 36 },
                      height: { xs: 28, md: 36 },
                      "&:hover": {
                        backgroundColor: "#c0392b",
                      },
                      boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      fontSize: { xs: "0.8rem", md: "1rem" },
                    }}
                    title="Remove picture"
                  >
                    ✕
                  </IconButton>
                )}
                <IconButton
                  onClick={handleAvatarClick}
                  sx={{
                    backgroundColor: "#667eea",
                    color: "white",
                    width: { xs: 28, md: 36 },
                    height: { xs: 28, md: 36 },
                    "&:hover": {
                      backgroundColor: "#764ba2",
                    },
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                >
                  <PhotoCameraIcon sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }} />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Container>
    </MotionBox>
  );
}


import { useRef } from "react";
import { Box, Container, Typography, Avatar, IconButton, Tooltip } from "@mui/material";
import { motion } from "framer-motion";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SplitText from "./SplitText";

const MotionBox = motion(Box);

export default function PageHeader({
  title,
  subtitle,
  backgroundGradient,
  showAvatar,
  avatarSrc,
  userName,
  onAvatarChange,
  disableAnimation = false,
  useSplitTextTitle = false,
  children,
}) {
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

  const motionProps = disableAnimation
    ? {}
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.6, ease: "easeOut" },
      };

  const titleMotion = disableAnimation
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.2 },
      };

  const subtitleMotion = disableAnimation
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.35 },
      };

  const childrenMotion = disableAnimation
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5, delay: 0.45 },
      };

  return (
    <MotionBox
      component="header"
      {...motionProps}
      sx={{
        position: "relative",
        zIndex: 9,
        background:
          backgroundGradient ||
          "linear-gradient(120deg, rgba(14,165,233,0.95), rgba(45,212,191,0.95), rgba(34,197,94,0.95), rgba(59,130,246,0.95))",
        backgroundSize: "240% 240%",
        animation: "gradientShift 10s ease infinite",
        color: "#ffffff",
        py: { xs: 5, md: 7 },
        mb: 4,
        borderRadius: { xs: 3, md: 4 },
        overflow: "hidden",
        boxShadow: "0 18px 48px rgba(14, 116, 144, 0.25)",
        textAlign: showAvatar ? "left" : "center",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18) 0%, transparent 45%)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          filter: "blur(60px)",
          top: -120,
          left: -80,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          filter: "blur(70px)",
          bottom: -180,
          right: -120,
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: { xs: 220, md: 300 },
          height: { xs: 220, md: 300 },
          borderRadius: "50%",
          right: { xs: -60, md: -80 },
          top: { xs: 30, md: 40 },
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.18)",
          boxShadow: "0 24px 60px rgba(15, 23, 42, 0.12)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          width: { xs: 140, md: 200 },
          height: { xs: 140, md: 200 },
          borderRadius: "50%",
          right: { xs: 20, md: 60 },
          bottom: { xs: 18, md: 28 },
          background: "rgba(255,255,255,0.14)",
          border: "1px solid rgba(255,255,255,0.2)",
          boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
          pointerEvents: "none",
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "center" },
            justifyContent: "space-between",
            gap: { xs: 3, md: 4 },
            textAlign: showAvatar ? { xs: "center", md: "left" } : "center",
          }}
        >
          <Box sx={{ flex: 1 }}>
            {useSplitTextTitle && !disableAnimation ? (
              <SplitText
                text={title}
                delay={50}
                duration={1.1}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign={showAvatar ? "left" : "center"}
                tag="h1"
                className="page-header-title"
                style={{
                  fontWeight: 800,
                  marginBottom: "12px",
                  fontSize: "clamp(2rem, 3.4vw, 3.1rem)",
                  letterSpacing: "-0.03em",
                  textShadow: "0 6px 24px rgba(0,0,0,0.15)",
                  color: "#ffffff",
                  fontFamily: '"Space Grotesk", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
                }}
              />
            ) : (
              <Typography
                component={motion.h1}
                {...titleMotion}
                sx={{
                  fontWeight: 800,
                  mb: 1.5,
                  fontSize: { xs: "2rem", md: "3.1rem" },
                  letterSpacing: "-0.03em",
                  textShadow: "0 6px 24px rgba(0,0,0,0.15)",
                  color: "#ffffff",
                  fontFamily: '"Space Grotesk", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                component={motion.p}
                {...subtitleMotion}
                sx={{
                  fontWeight: 600,
                  opacity: 0.92,
                  fontSize: { xs: "0.95rem", md: "1.15rem" },
                  color: "rgba(255,255,255,0.9)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: showAvatar ? { xs: "center", md: "flex-start" } : "center",
                  gap: 1,
                  width: "100%",
                }}
              >
                <span>✨</span>
                {subtitle}
              </Typography>
            )}
            {children && (
              <Box component={motion.div} {...childrenMotion} sx={{ mt: 4 }}>
                {children}
              </Box>
            )}
          </Box>

          {showAvatar && (
            <Box sx={{ position: "relative" }}>
              {onAvatarChange ? (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <Tooltip title={avatarSrc ? "Change profile picture" : "Add profile picture"}>
                    <Avatar
                      src={avatarSrc || ""}
                      alt={userName || "User"}
                      onClick={handleAvatarClick}
                      sx={{
                        width: { xs: 84, md: 122 },
                        height: { xs: 84, md: 122 },
                        border: "4px solid rgba(255, 255, 255, 0.35)",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                        fontSize: { xs: "2rem", md: "3rem" },
                        fontWeight: 800,
                        background: "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)",
                        color: "#0f172a",
                        cursor: "pointer",
                        "&:hover": {
                          transform: "scale(1.04)",
                          transition: "transform 0.2s ease",
                        },
                      }}
                    >
                      {!avatarSrc && userName ? userName.charAt(0).toUpperCase() : "U"}
                    </Avatar>
                  </Tooltip>
                  <Box sx={{ display: "flex", gap: 0.5, position: "absolute", bottom: 0, right: 0 }}>
                    {avatarSrc && (
                      <IconButton
                        onClick={handleClearAvatar}
                        sx={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          width: { xs: 28, md: 36 },
                          height: { xs: 28, md: 36 },
                          "&:hover": {
                            backgroundColor: "#dc2626",
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
                        backgroundColor: "rgba(15, 23, 42, 0.85)",
                        color: "white",
                        width: { xs: 28, md: 36 },
                        height: { xs: 28, md: 36 },
                        "&:hover": {
                          backgroundColor: "rgba(15, 23, 42, 1)",
                        },
                        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                      }}
                    >
                      <PhotoCameraIcon sx={{ fontSize: { xs: "1rem", md: "1.2rem" } }} />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Avatar
                  src={avatarSrc || ""}
                  alt={userName || "User"}
                  sx={{
                    width: { xs: 84, md: 122 },
                    height: { xs: 84, md: 122 },
                    border: "4px solid rgba(255, 255, 255, 0.35)",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)",
                    fontSize: { xs: "2rem", md: "3rem" },
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)",
                    color: "#0f172a",
                  }}
                >
                  {!avatarSrc && userName ? userName.charAt(0).toUpperCase() : "U"}
                </Avatar>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </MotionBox>
  );
}

import { Box, Grid, Container, Typography } from "@mui/material";
import CourseCard from "./CourseCard";

export default function CourseGrid({ courses, title, subtitle }) {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {title && (
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 1,
              color: "#2c3e50",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ color: "#666" }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      <Grid container spacing={3}>
        {courses.map((course, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <CourseCard
              title={course.title}
              description={course.description}
              icon={course.icon}
              sx={{
                cursor: "pointer",
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  color: "#667eea",
                  fontWeight: 600,
                  display: "block",
                  mt: 1,
                }}
              >
                {course.level} • {course.duration}
              </Typography>
            </CourseCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

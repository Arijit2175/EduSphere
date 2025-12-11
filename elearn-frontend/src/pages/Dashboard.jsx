import { Box } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Section from "../components/Section";
import SectionTitle from "../components/SectionTitle";
import StatsGrid from "../components/StatsGrid";
import EnrolledCoursesList from "../components/EnrolledCoursesList";
import PageHeader from "../components/PageHeader";

export default function Dashboard() {
  // Stats data
  const statsData = [
    {
      icon: "📚",
      value: "5",
      label: "Courses Enrolled",
      color: "#667eea",
      actionText: "Browse More",
    },
    {
      icon: "⏱️",
      value: "124h",
      label: "Learning Hours",
      color: "#f093fb",
      actionText: "View Stats",
    },
    {
      icon: "🏆",
      value: "2",
      label: "Certificates Earned",
      color: "#4facfe",
      actionText: "Share",
    },
  ];

  // Enrolled courses data
  const enrolledCourses = [
    {
      title: "Advanced Python",
      instructor: "John Doe",
      duration: "12 weeks",
      progress: 65,
    },
    {
      title: "Web Development Bootcamp",
      instructor: "Jane Smith",
      duration: "10 weeks",
      progress: 45,
    },
    {
      title: "Data Science Fundamentals",
      instructor: "Mike Johnson",
      duration: "8 weeks",
      progress: 82,
    },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: 25 },
          mt: { xs: 6, md: 8 },
          background: "linear-gradient(135deg, #f8f9fa 0%, #f0f2f5 100%)",
          minHeight: "100vh",
        }}
      >
        <Navbar />

        {/* Page Header Section */}
        <Section background="transparent" pt={4} pb={2} animated={false}>
          <PageHeader
            title="Your Dashboard"
            subtitle="Track your learning progress and achievements"
            backgroundGradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          />
        </Section>

        {/* Stats Section */}
        <Section background="transparent" py={{ xs: 4, md: 5 }}>
          <SectionTitle
            title="Your Progress"
            subtitle="Keep track of your learning journey"
            centered
          />
          <StatsGrid stats={statsData} />
        </Section>

        {/* Enrolled Courses Section */}
        <Section background="white" py={{ xs: 4, md: 5 }}>
          <SectionTitle
            title="My Courses"
            subtitle="Continue learning from where you left off"
            centered
          />
          <EnrolledCoursesList courses={enrolledCourses} />
        </Section>
      </Box>
    </Box>
  );
}
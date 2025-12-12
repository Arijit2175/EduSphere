import { createContext, useContext, useState, useEffect } from "react";

const NonFormalContext = createContext();

export const useNonFormal = () => {
  const context = useContext(NonFormalContext);
  if (!context) {
    throw new Error("useNonFormal must be used within NonFormalProvider");
  }
  return context;
};

const DEFAULT_COURSES = [
  {
    id: "nf-1",
    title: "Python Basics for Beginners",
    category: "Tech Skills",
    instructor: "Tech Academy",
    rating: 4.8,
    reviews: 342,
    duration: "4 weeks",
    level: "Beginner",
    paid: false,
    thumbnail: "🐍",
    description: "Learn Python fundamentals from scratch",
    outcomes: ["Variables & Data Types", "Loops & Conditionals", "Functions & Modules"],
    lessons: [
      { id: "l1", title: "Introduction to Python", duration: "12 min", videoUrl: "https://www.youtube.com/embed/rfscVS0vtik" },
      { id: "l2", title: "Variables & Data Types", duration: "15 min", videoUrl: "https://www.youtube.com/embed/bY6m6KLSFFg" },
      { id: "l3", title: "Control Flow", duration: "18 min", videoUrl: "https://www.youtube.com/embed/P_8ZFw_xvs8" },
    ],
    attachments: [{ name: "Python_Cheatsheet.pdf", url: "#" }],
    certificate: true,
  },
  {
    id: "nf-2",
    title: "Digital Marketing 101",
    category: "Career Skills",
    instructor: "Marketing Masters",
    rating: 4.6,
    reviews: 215,
    duration: "3 weeks",
    level: "Beginner",
    paid: false,
    thumbnail: "📢",
    description: "Master the basics of digital marketing",
    outcomes: ["SEO Basics", "Social Media Strategy", "Content Marketing"],
    lessons: [
      { id: "l1", title: "What is Digital Marketing?", duration: "10 min", videoUrl: "https://www.youtube.com/embed/dGQSYxgqCEQ" },
      { id: "l2", title: "SEO Fundamentals", duration: "14 min", videoUrl: "https://www.youtube.com/embed/yTQmZy1DQRo" },
      { id: "l3", title: "Social Media Strategy", duration: "12 min", videoUrl: "https://www.youtube.com/embed/fpb-pWYo9FU" },
    ],
    attachments: [{ name: "Marketing_Toolkit.pdf", url: "#" }],
    certificate: true,
  },
  {
    id: "nf-3",
    title: "UI/UX Design Fundamentals",
    category: "Creative Skills",
    instructor: "Design School",
    rating: 4.7,
    reviews: 298,
    duration: "5 weeks",
    level: "Beginner",
    paid: false,
    thumbnail: "🎨",
    description: "Create stunning user interfaces and experiences",
    outcomes: ["Design Principles", "Wireframing", "Prototyping in Figma"],
    lessons: [
      { id: "l1", title: "Design Principles", duration: "16 min", videoUrl: "https://www.youtube.com/embed/UwekjBRN3Cw" },
      { id: "l2", title: "Wireframing & Prototyping", duration: "20 min", videoUrl: "https://www.youtube.com/embed/IKhqXETYAI8" },
      { id: "l3", title: "Typography & Color", duration: "14 min", videoUrl: "https://www.youtube.com/embed/Xn9CyLDpDPc" },
    ],
    attachments: [{ name: "Design_Resources.pdf", url: "#" }],
    certificate: true,
  },
  {
    id: "nf-4",
    title: "English Conversation Skills",
    category: "Language Skills",
    instructor: "English Plus",
    rating: 4.5,
    reviews: 189,
    duration: "6 weeks",
    level: "Intermediate",
    paid: false,
    thumbnail: "🗣️",
    description: "Improve your spoken English fluency",
    outcomes: ["Pronunciation", "Fluent Speaking", "Conversation Patterns"],
    lessons: [
      { id: "l1", title: "Pronunciation Basics", duration: "13 min", videoUrl: "https://www.youtube.com/embed/dCTVS0-0QU0" },
      { id: "l2", title: "Common Phrases", duration: "15 min", videoUrl: "https://www.youtube.com/embed/HXvVJzAKv5A" },
      { id: "l3", title: "Fluent Speaking", duration: "17 min", videoUrl: "https://www.youtube.com/embed/C8nVj-bIb8A" },
    ],
    attachments: [{ name: "Speaking_Guide.pdf", url: "#" }],
    certificate: true,
  },
  {
    id: "nf-5",
    title: "JavaScript Essentials",
    category: "Tech Skills",
    instructor: "Code Academy",
    rating: 4.9,
    reviews: 512,
    duration: "4 weeks",
    level: "Beginner",
    paid: false,
    thumbnail: "⚙️",
    description: "Master JavaScript from zero to hero",
    outcomes: ["DOM Manipulation", "Async & Promises", "ES6+ Features"],
    lessons: [
      { id: "l1", title: "JS Basics", duration: "14 min", videoUrl: "https://www.youtube.com/embed/W6NZfCO5tTE" },
      { id: "l2", title: "DOM Manipulation", duration: "18 min", videoUrl: "https://www.youtube.com/embed/WHZL3dAV4sU" },
      { id: "l3", title: "Async JavaScript", duration: "20 min", videoUrl: "https://www.youtube.com/embed/PoRJizFvM7s" },
    ],
    attachments: [{ name: "JS_Cheatsheet.pdf", url: "#" }],
    certificate: true,
  },
  {
    id: "nf-6",
    title: "Startup Essentials",
    category: "Entrepreneurship",
    instructor: "Startup Hub",
    rating: 4.4,
    reviews: 156,
    duration: "3 weeks",
    level: "Intermediate",
    paid: false,
    thumbnail: "🚀",
    description: "Turn your idea into a successful startup",
    outcomes: ["Business Model Canvas", "Pitching", "Fundraising Basics"],
    lessons: [
      { id: "l1", title: "Ideation & Validation", duration: "16 min", videoUrl: "https://www.youtube.com/embed/FymPtVJcW8g" },
      { id: "l2", title: "Business Model", duration: "14 min", videoUrl: "https://www.youtube.com/embed/IP0cUBWTgpY" },
      { id: "l3", title: "Pitching Your Idea", duration: "12 min", videoUrl: "https://www.youtube.com/embed/nKzlyJwzM2E" },
    ],
    attachments: [{ name: "Startup_Guide.pdf", url: "#" }],
    certificate: true,
  },
  {
    id: "nf-7",
    title: "Meditation & Mindfulness",
    category: "Personal Growth",
    instructor: "Wellness Academy",
    rating: 4.7,
    reviews: 278,
    duration: "2 weeks",
    level: "Beginner",
    paid: false,
    thumbnail: "🧘",
    description: "Reduce stress and improve mental clarity",
    outcomes: ["Meditation Techniques", "Mindfulness Practices", "Stress Management"],
    lessons: [
      { id: "l1", title: "Introduction to Meditation", duration: "10 min", videoUrl: "https://www.youtube.com/embed/SEqs7RkL1mc" },
      { id: "l2", title: "Daily Mindfulness", duration: "12 min", videoUrl: "https://www.youtube.com/embed/nS3ioFnE0d0" },
      { id: "l3", title: "Advanced Techniques", duration: "15 min", videoUrl: "https://www.youtube.com/embed/s_rFmHxj4EY" },
    ],
    attachments: [{ name: "Mindfulness_Guide.pdf", url: "#" }],
    certificate: true,
  },
];

export const NonFormalProvider = ({ children }) => {
  const [courses, setCourses] = useState(DEFAULT_COURSES);
  const [enrollments, setEnrollments] = useState(() => {
    // Demo-friendly: reset non-formal data on fresh server run
    localStorage.removeItem("nfEnrollments");
    const stored = localStorage.getItem("nfEnrollments");
    return stored ? JSON.parse(stored) : [];
  });
  const [progress, setProgress] = useState(() => {
    localStorage.removeItem("nfProgress");
    const stored = localStorage.getItem("nfProgress");
    return stored ? JSON.parse(stored) : {};
  });
  const [certificates, setCertificates] = useState(() => {
    localStorage.removeItem("nfCertificates");
    const stored = localStorage.getItem("nfCertificates");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("nfEnrollments", JSON.stringify(enrollments));
  }, [enrollments]);

  useEffect(() => {
    localStorage.setItem("nfProgress", JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    localStorage.setItem("nfCertificates", JSON.stringify(certificates));
  }, [certificates]);

  const enrollCourse = (userId, courseId) => {
    // Block enrolling if already certified
    const hasCert = certificates.some((c) => c.userId === userId && c.courseId === courseId);
    if (hasCert) return { success: false, message: "Course already completed" };
    const existing = enrollments.find((e) => e.userId === userId && e.courseId === courseId);
    if (existing) return { success: false, message: "Already enrolled" };

    const enrollment = { id: `enr-${Date.now()}`, userId, courseId, enrolledAt: new Date().toISOString() };
    setEnrollments((prev) => [...prev, enrollment]);
    setProgress((prev) => ({
      ...prev,
      [`${userId}-${courseId}`]: { currentLessonIndex: 0, completedLessons: [], score: 0, assessment: null, attemptsRemaining: 3, totalAttempts: 3 },
    }));
    return { success: true, message: "Enrolled" };
  };

  const isEnrolled = (userId, courseId) => enrollments.some((e) => e.userId === userId && e.courseId === courseId);

  const getEnrolledCourses = (userId) => {
    const courseIds = enrollments.filter((e) => e.userId === userId).map((e) => e.courseId);
    // Exclude courses that have already been certified for this user
    const certifiedIds = new Set(certificates.filter((c) => c.userId === userId).map((c) => c.courseId));
    return courses.filter((c) => courseIds.includes(c.id) && !certifiedIds.has(c.id));
  };

  const updateLessonProgress = (userId, courseId, lessonIndex) => {
    const key = `${userId}-${courseId}`;
    setProgress((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        currentLessonIndex: lessonIndex,
        completedLessons: [...new Set([...(prev[key]?.completedLessons || []), lessonIndex])],
      },
    }));
  };

  const updateAssessmentScore = (userId, courseId, score) => {
    const key = `${userId}-${courseId}`;
    setProgress((prev) => ({
      ...prev,
      [key]: { ...prev[key], score, assessment: { score, completedAt: new Date().toISOString(), attempts: (prev[key]?.assessment?.attempts || 0) + 1 } },
    }));
    if (score >= 70) {
      earnCertificate(userId, courseId);
    }
  };

  const decrementAttempts = (userId, courseId) => {
    const key = `${userId}-${courseId}`;
    setProgress((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        attemptsRemaining: Math.max(0, (prev[key]?.attemptsRemaining || 3) - 1),
      },
    }));
  };

  const resetAttempts = (userId, courseId) => {
    const key = `${userId}-${courseId}`;
    setProgress((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        attemptsRemaining: 3,
        currentLessonIndex: 0,
      },
    }));
  };

  const earnCertificate = (userId, courseId) => {
    const course = courses.find((c) => c.id === courseId);
    if (!course || certificates.some((c) => c.userId === userId && c.courseId === courseId)) return;
    const cert = {
      id: `cert-${Date.now()}`,
      userId,
      courseId,
      courseName: course.title,
      instructor: course.instructor,
      earnedAt: new Date().toISOString(),
      certificateId: `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };
    setCertificates((prev) => [...prev, cert]);
  };

  const getCourseProgress = (userId, courseId) => progress[`${userId}-${courseId}`];

  const resetCourseProgress = (userId, courseId) => {
    const key = `${userId}-${courseId}`;
    setProgress((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        currentLessonIndex: 0,
        completedLessons: [],
      },
    }));
  };

  const resetAllData = () => {
    setEnrollments([]);
    setProgress({});
    setCertificates([]);
    localStorage.removeItem("nfEnrollments");
    localStorage.removeItem("nfProgress");
    localStorage.removeItem("nfCertificates");
  };

  return (
    <NonFormalContext.Provider
      value={{
        courses,
        enrollments,
        progress,
        certificates,
        enrollCourse,
        isEnrolled,
        getEnrolledCourses,
        updateLessonProgress,
        updateAssessmentScore,
        decrementAttempts,
        resetAttempts,
        getCourseProgress,
        resetCourseProgress,
        resetAllData,
      }}
    >
      {children}
    </NonFormalContext.Provider>
  );
};

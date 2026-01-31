import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import API_URL from "../config";
import { useAuth } from "./AuthContext";

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
    id: 1,
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
      { id: "l1", title: "Introduction to Python", duration: "12 min", videoUrl: "https://www.youtube.com/embed/xkZMUX_oQX4" },
      { id: "l2", title: "Variables & Data Types", duration: "15 min", videoUrl: "https://www.youtube.com/embed/LKFrQXaoSMQ" },
      { id: "l3", title: "Control Flow", duration: "18 min", videoUrl: "https://www.youtube.com/embed/FvMPfrgGeKs" },
    ],
    attachments: [{ name: "Python_Cheatsheet.pdf", url: "https://cdn.codewithmosh.com/image/upload/v1702942822/cheat-sheets/python.pdf" }],
    certificate: true,
    assessmentQuestions: [
      {
        id: "q1",
        question: "Which keyword is used to define a function in Python?",
        options: ["func", "def", "function", "define"],
        correctAnswer: "def"
      },
      {
        id: "q2",
        question: "What data type would the value '42' (in quotes) be in Python?",
        options: ["Integer", "String", "Float", "Boolean"],
        correctAnswer: "String"
      },
      {
        id: "q3",
        question: "Which of the following is used to create a loop that executes a specific number of times?",
        options: ["while loop", "for loop", "do-while loop", "repeat loop"],
        correctAnswer: "for loop"
      }
    ],
  },
  {
    id: 2,
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
      { id: "l1", title: "What is Digital Marketing?", duration: "10 min", videoUrl: "https://www.youtube.com/embed/RNh8VHc8qkk" },
      { id: "l2", title: "SEO Fundamentals", duration: "14 min", videoUrl: "https://www.youtube.com/embed/MYE6T_gd7H0" },
      { id: "l3", title: "Social Media Strategy", duration: "12 min", videoUrl: "https://www.youtube.com/embed/VS0Sao1oHlw" },
    ],
    attachments: [{ name: "Marketing_Toolkit.pdf", url: "https://www.riba.org/media/d2hddxio/riba-marketing-toolkitpdf.pdf" }],
    certificate: true,
    assessmentQuestions: [
      {
        id: "q1",
        question: "What does SEO stand for in digital marketing?",
        options: ["Social Engine Optimization", "Search Engine Optimization", "Site Enhancement Operations", "Simple Email Outreach"],
        correctAnswer: "Search Engine Optimization"
      },
      {
        id: "q2",
        question: "Which metric measures how many people clicked on your content compared to how many saw it?",
        options: ["Conversion Rate", "Bounce Rate", "Click-Through Rate", "Impression Rate"],
        correctAnswer: "Click-Through Rate"
      },
      {
        id: "q3",
        question: "What is the primary goal of content marketing?",
        options: ["Selling products directly", "Creating viral videos", "Providing valuable information to attract and engage audience", "Spamming social media"],
        correctAnswer: "Providing valuable information to attract and engage audience"
      }
    ],
  },
  {
    id: 3,
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
      { id: "l1", title: "Design Principles", duration: "16 min", videoUrl: "https://www.youtube.com/embed/9EPTM91TBDU" },
      { id: "l2", title: "Wireframing & Prototyping", duration: "20 min", videoUrl: "https://www.youtube.com/embed/qpH7-KFWZRI" },
      { id: "l3", title: "Typography & Color", duration: "14 min", videoUrl: "https://www.youtube.com/embed/9-oefwZ6Z74" },
    ],
    attachments: [{ name: "Design_Resources.pdf", url: "https://www.share4rare.org/sites/default/files/imce/S4R_Template_Branding%20%26%20Graphic%20Design.pdf" }],
    certificate: true,
    assessmentQuestions: [
      {
        id: "q1",
        question: "What does UX stand for in design?",
        options: ["User Experience", "Universal Extension", "Unified Execution", "User Exchange"],
        correctAnswer: "User Experience"
      },
      {
        id: "q2",
        question: "Which tool is commonly used for creating wireframes and prototypes?",
        options: ["Microsoft Word", "Figma", "Excel", "PowerPoint"],
        correctAnswer: "Figma"
      },
      {
        id: "q3",
        question: "What is the purpose of whitespace in UI design?",
        options: ["To save ink when printing", "To make the page longer", "To improve readability and focus attention", "To fill empty areas"],
        correctAnswer: "To improve readability and focus attention"
      }
    ],
  },
  {
    id: 4,
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
      { id: "l1", title: "Pronunciation Basics", duration: "13 min", videoUrl: "https://www.youtube.com/embed/ugppjNn8uIE" },
      { id: "l2", title: "Common Phrases", duration: "15 min", videoUrl: "https://www.youtube.com/embed/bj5btO2nvt8" },
      { id: "l3", title: "Fluent Speaking", duration: "17 min", videoUrl: "https://www.youtube.com/embed/dWmUsWorYh0" },
    ],
    attachments: [{ name: "Speaking_Guide.pdf", url: "https://ati.dae.gov.in/ati12052021_2.pdf" }],
    certificate: true,
    assessmentQuestions: [
      {
        id: "q1",
        question: "Which phrase is most appropriate for introducing yourself in a professional setting?",
        options: ["Hey, what's up?", "Nice to meet you, I'm [name]", "Yo, I'm [name]", "What's happening?"],
        correctAnswer: "Nice to meet you, I'm [name]"
      },
      {
        id: "q2",
        question: "What is the correct pronunciation emphasis in the word 'important'?",
        options: ["IM-portant", "im-POR-tant", "im-por-TANT", "All syllables equal"],
        correctAnswer: "im-POR-tant"
      },
      {
        id: "q3",
        question: "Which technique helps improve speaking fluency?",
        options: ["Speaking as fast as possible", "Memorizing entire scripts", "Practicing with native speakers regularly", "Only reading textbooks"],
        correctAnswer: "Practicing with native speakers regularly"
      }
    ],
  },
  {
    id: 5,
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
      { id: "l1", title: "JS Basics", duration: "14 min", videoUrl: "https://www.youtube.com/embed/VoKFyB1q4fc" },
      { id: "l2", title: "DOM Manipulation", duration: "18 min", videoUrl: "https://www.youtube.com/embed/y17RuWkWdn8" },
      { id: "l3", title: "Async JavaScript", duration: "20 min", videoUrl: "https://www.youtube.com/embed/9j1dZwFEJ-c" },
    ],
    attachments: [{ name: "JS_Cheatsheet.pdf", url: "https://websitesetup.org/wp-content/uploads/2020/09/Javascript-Cheat-Sheet.pdf" }],
    certificate: true,
    assessmentQuestions: [
      {
        id: "q1",
        question: "What does DOM stand for in JavaScript?",
        options: ["Data Object Model", "Document Object Model", "Digital Output Method", "Direct Object Manipulation"],
        correctAnswer: "Document Object Model"
      },
      {
        id: "q2",
        question: "Which of the following is used to handle asynchronous operations in JavaScript?",
        options: ["Callbacks only", "Promises and async/await", "Loops", "Variables"],
        correctAnswer: "Promises and async/await"
      },
      {
        id: "q3",
        question: "What is an arrow function in ES6?",
        options: ["A function that points upward", "A shorter syntax for writing functions", "A function for drawing arrows", "A deprecated feature"],
        correctAnswer: "A shorter syntax for writing functions"
      }
    ],
  },
  {
    id: 6,
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
      { id: "l1", title: "Ideation & Validation", duration: "16 min", videoUrl: "https://www.youtube.com/embed/Th8JoIan4dg" },
      { id: "l2", title: "Business Model", duration: "14 min", videoUrl: "https://www.youtube.com/embed/IP0cUBWTgpY" },
      { id: "l3", title: "Pitching Your Idea", duration: "12 min", videoUrl: "https://www.youtube.com/embed/l0hVIH3EnlQ" },
    ],
    attachments: [{ name: "Startup_Guide.pdf", url: "https://otd.harvard.edu/uploads/Files/OTD_Startup_Guide.pdf" }],
    certificate: true,
    assessmentQuestions: [
      {
        id: "q1",
        question: "What is the primary purpose of a Business Model Canvas?",
        options: ["To create a company logo", "To visualize and develop business strategy", "To design websites", "To calculate taxes"],
        correctAnswer: "To visualize and develop business strategy"
      },
      {
        id: "q2",
        question: "What should be the focus of a startup pitch to investors?",
        options: ["Technical jargon and complexity", "The problem you're solving and your solution", "Your personal story only", "Competitor weaknesses"],
        correctAnswer: "The problem you're solving and your solution"
      },
      {
        id: "q3",
        question: "What is MVP in the context of startups?",
        options: ["Most Valuable Player", "Minimum Viable Product", "Maximum Value Proposition", "Main Vision Plan"],
        correctAnswer: "Minimum Viable Product"
      }
    ],
  },
  {
    id: 7,
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
      { id: "l1", title: "Introduction to Meditation", duration: "10 min", videoUrl: "https://www.youtube.com/embed/o-kMJBWk9E0" },
      { id: "l2", title: "Daily Mindfulness", duration: "12 min", videoUrl: "https://www.youtube.com/embed/7CBfCW67xT8" },
      { id: "l3", title: "Advanced Techniques", duration: "15 min", videoUrl: "https://www.youtube.com/embed/5yfIOtOBMBo" },
    ],
    attachments: [{ name: "Mindfulness_Guide.pdf", url: "https://www.dcu.ie/sites/default/files/students/mindfulness_based_stress_reduction_handbook.pdf" }],
    certificate: true,
    assessmentQuestions: [
      {
        id: "q1",
        question: "What is the primary goal of mindfulness meditation?",
        options: ["To fall asleep quickly", "To be fully present in the moment", "To forget about problems", "To increase physical strength"],
        correctAnswer: "To be fully present in the moment"
      },
      {
        id: "q2",
        question: "Which breathing technique is commonly used in meditation?",
        options: ["Rapid shallow breaths", "Deep diaphragmatic breathing", "Holding breath for long periods", "Irregular breathing patterns"],
        correctAnswer: "Deep diaphragmatic breathing"
      },
      {
        id: "q3",
        question: "How does regular meditation help with stress management?",
        options: ["By avoiding all stressful situations", "By reducing cortisol levels and promoting relaxation", "By making you forget stress exists", "By increasing adrenaline"],
        correctAnswer: "By reducing cortisol levels and promoting relaxation"
      }
    ],
  },
];

export const NonFormalProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [progress, setProgress] = useState({});
  const [certificates, setCertificates] = useState([]);
  const { user } = useAuth();

  // Fetch all non-formal data from backend when user/token changes
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.access_token) {
        setCourses(DEFAULT_COURSES);
        setEnrollments([]);
        setProgress({});
        setCertificates([]);
        return;
      }
      try {
        const token = user.access_token;
        const authHeader = { Authorization: `Bearer ${token}` };
        const coursesRes = await fetch(`${API_URL}/nonformal/courses/`, { headers: authHeader });
        if (coursesRes.ok) {
          const fetchedCourses = await coursesRes.json();
          if (Array.isArray(fetchedCourses) && fetchedCourses.length > 0) {
            // Merge lessons and attachments from DEFAULT_COURSES by ID
            const courseMap = Object.fromEntries(DEFAULT_COURSES.map(c => [String(c.id), c]));
            const mergedCourses = fetchedCourses.map(c => {
              // Try to match by id or by title if id not found
              let extra = courseMap[String(c.id)];
              if (!extra) {
                // Fallback: match by title (case-insensitive)
                extra = DEFAULT_COURSES.find(dc => dc.title.toLowerCase() === (c.title || '').toLowerCase());
              }
              let merged = { ...c, lessons: extra?.lessons || [], attachments: extra?.attachments || [], outcomes: extra?.outcomes || [], assessmentQuestions: extra?.assessmentQuestions || [] };
              // Final fallback: if no lessons, try to get from DEFAULT_COURSES by title
              if ((!merged.lessons || merged.lessons.length === 0) && c.title) {
                const fallback = DEFAULT_COURSES.find(dc => dc.title.toLowerCase() === c.title.toLowerCase());
                if (fallback) {
                  merged.lessons = fallback.lessons || [];
                  merged.attachments = fallback.attachments || [];
                  merged.outcomes = fallback.outcomes || [];
                  merged.assessmentQuestions = fallback.assessmentQuestions || [];
                }
              }
              return merged;
            });
            setCourses(mergedCourses);
          } else {
            setCourses(DEFAULT_COURSES);
          }
        } else {
          setCourses(DEFAULT_COURSES);
        }
        const enrollmentsRes = await fetch(`${API_URL}/nonformal/enrollments/`, { headers: authHeader });
        if (enrollmentsRes.ok) {
          setEnrollments(await enrollmentsRes.json());
        }
        const progressRes = await fetch(`${API_URL}/nonformal/progress/`, { headers: authHeader });
        if (progressRes.ok) {
          const progressArr = await progressRes.json();
          // Convert array to object keyed by userId-courseId
          const progressObj = {};
          for (const p of progressArr) {
            progressObj[`${p.user_id || user.id}-${p.course_id}`] = {
              ...p,
              currentLessonIndex: p.progress || 0,
              completedLessons: Array.from({ length: p.progress || 0 }, (_, i) => i),
            };
          }
          setProgress(progressObj);
        }
        const certsRes = await fetch(`${API_URL}/nonformal/certificates/`, { headers: authHeader });
        if (certsRes.ok) {
          setCertificates(await certsRes.json());
        }
      } catch (err) {
        setCourses(DEFAULT_COURSES);
      }
    };
    fetchData();
  }, [user?.id, user?.access_token]);

  const enrollCourse = async (userId, courseId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.access_token;
      const res = await fetch(`${API_URL}/nonformal/enrollments/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      const enrollment = await res.json();
      setEnrollments((prev) => [...prev, enrollment]);
      // Refresh all non-formal data after enrollment
      if (token) {
        const authHeader = { Authorization: `Bearer ${token}` };
        // Fetch courses
        const coursesRes = await fetch(`${API_URL}/nonformal/courses/`, { headers: authHeader });
        if (coursesRes.ok) {
          const fetchedCourses = await coursesRes.json();
          if (Array.isArray(fetchedCourses) && fetchedCourses.length > 0) {
            const courseMap = Object.fromEntries(DEFAULT_COURSES.map(c => [String(c.id), c]));
            const mergedCourses = fetchedCourses.map(c => {
              let extra = courseMap[String(c.id)];
              if (!extra) {
                extra = DEFAULT_COURSES.find(dc => dc.title.toLowerCase() === (c.title || '').toLowerCase());
              }
              let merged = { ...c, lessons: extra?.lessons || [], attachments: extra?.attachments || [], outcomes: extra?.outcomes || [], assessmentQuestions: extra?.assessmentQuestions || [] };
              if ((!merged.lessons || merged.lessons.length === 0) && c.title) {
                const fallback = DEFAULT_COURSES.find(dc => dc.title.toLowerCase() === c.title.toLowerCase());
                if (fallback) {
                  merged.lessons = fallback.lessons || [];
                  merged.attachments = fallback.attachments || [];
                  merged.outcomes = fallback.outcomes || [];
                  merged.assessmentQuestions = fallback.assessmentQuestions || [];
                }
              }
              return merged;
            });
            setCourses(mergedCourses);
          } else {
            setCourses(DEFAULT_COURSES);
          }
        } else {
          setCourses(DEFAULT_COURSES);
        }
        // Fetch enrollments
        const enrollmentsRes = await fetch(`${API_URL}/nonformal/enrollments/`, { headers: authHeader });
        if (enrollmentsRes.ok) {
          setEnrollments(await enrollmentsRes.json());
        }
        // Fetch progress
        const progressRes = await fetch(`${API_URL}/nonformal/progress/`, { headers: authHeader });
        if (progressRes.ok) {
          const progressArr = await progressRes.json();
          const progressObj = {};
          for (const p of progressArr) {
            progressObj[`${p.user_id || userId}-${p.course_id}`] = {
              ...p,
              currentLessonIndex: p.progress || 0,
              completedLessons: Array.from({ length: p.progress || 0 }, (_, i) => i),
            };
          }
          setProgress(progressObj);
        }
        // Fetch certificates
        const certsRes = await fetch(`${API_URL}/nonformal/certificates/`, { headers: authHeader });
        if (certsRes.ok) {
          setCertificates(await certsRes.json());
        }
      }
      return { success: true, message: "Enrolled" };
    } catch (err) {
      return { success: false, message: "Enrollment failed" };
    }
  };

  const isEnrolled = (userId, courseId) => enrollments.some((e) => e.user_id === userId && e.course_id === courseId);

  const getEnrolledCourses = (userId) => {
    const courseIds = enrollments.filter((e) => e.user_id === userId).map((e) => e.course_id);
    // Exclude courses that have already been certified for this user
    const certifiedIds = new Set(certificates.filter((c) => c.user_id === userId).map((c) => c.course_id));
    return courses.filter((c) => courseIds.includes(c.id) && !certifiedIds.has(c.id));
  };

  const updateLessonProgress = async (userId, courseId, lessonIndex) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.access_token;
      const res = await fetch(`${API_URL}/nonformal/progress/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ course_id: courseId, lesson_index: lessonIndex }),
      });
      if (res.ok) {
        setProgress((prev) => ({
          ...prev,
          [`${userId}-${courseId}`]: {
            ...(prev[`${userId}-${courseId}`] || {}),
            currentLessonIndex: lessonIndex,
            completedLessons: [...new Set([...(prev[`${userId}-${courseId}`]?.completedLessons || []), lessonIndex])],
          },
        }));
      }
    } catch (err) {}
  };

  const updateAssessmentScore = async (userId, courseId, score) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.access_token;
      const res = await fetch(`${API_URL}/nonformal/progress/score`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ course_id: courseId, score }),
      });
      if (res.ok) {
        setProgress((prev) => ({
          ...prev,
          [`${userId}-${courseId}`]: {
            ...(prev[`${userId}-${courseId}`] || {}),
            score,
            assessment: { score, completedAt: new Date().toISOString(), attempts: ((prev[`${userId}-${courseId}`]?.assessment?.attempts || 0) + 1) },
          },
        }));
        if (score >= 70) {
          earnCertificate(userId, courseId);
        }
      }
    } catch (err) {}
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

  // Only one earnCertificate function should exist
  const earnCertificate = async (userId, courseId) => {
    try {
      const token = JSON.parse(localStorage.getItem("user"))?.access_token;
      const res = await fetch(`${API_URL}/nonformal/certificates/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ course_id: courseId }),
      });
      if (res.ok) {
        // After claiming, re-fetch all certificates to ensure state is up to date
        const certsRes = await fetch(`${API_URL}/nonformal/certificates/`, {
          headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        });
        if (certsRes.ok) {
          setCertificates(await certsRes.json());
        }
      }
    } catch (err) {}
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

  const resetAllData = async () => {
    setEnrollments([]);
    setProgress({});
    setCertificates([]);
    // Optionally, call backend endpoint to reset all data for the user
    // await fetch(`${API_URL}/nonformal/reset`, { method: "POST" });
  };

  const value = useMemo(() => ({
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
    earnCertificate,
  }), [courses, enrollments, progress, certificates]);

  return (
    <NonFormalContext.Provider value={value}>
      {children}
    </NonFormalContext.Provider>
  );
  }
  export default NonFormalProvider;

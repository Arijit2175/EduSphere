import { createContext, useContext, useState, useEffect } from "react";

const FormalEducationContext = createContext();

export const useFormalEducation = () => {
  const context = useContext(FormalEducationContext);
  if (!context) {
    throw new Error("useFormalEducation must be used within FormalEducationProvider");
  }
  return context;
};

export const FormalEducationProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Load data from localStorage
  useEffect(() => {
    // Demo-friendly: reset formal data on fresh server run
    localStorage.removeItem("formalCourses");
    localStorage.removeItem("formalEnrollments");
    localStorage.removeItem("formalSubmissions");
    const storedCourses = localStorage.getItem("formalCourses");
    const storedEnrollments = localStorage.getItem("formalEnrollments");
    const storedSubmissions = localStorage.getItem("formalSubmissions");

    if (storedCourses) setCourses(JSON.parse(storedCourses));
    if (storedEnrollments) setEnrollments(JSON.parse(storedEnrollments));
    if (storedSubmissions) setSubmissions(JSON.parse(storedSubmissions));
  }, []);

  // Save courses
  useEffect(() => {
    localStorage.setItem("formalCourses", JSON.stringify(courses));
  }, [courses]);

  // Save enrollments
  useEffect(() => {
    localStorage.setItem("formalEnrollments", JSON.stringify(enrollments));
  }, [enrollments]);

  // Save submissions
  useEffect(() => {
    localStorage.setItem("formalSubmissions", JSON.stringify(submissions));
  }, [submissions]);

  // Teacher: Create course
  const createCourse = (courseData) => {
    const newCourse = {
      id: `course-${Date.now()}`,
      ...courseData,
      createdAt: new Date().toISOString(),
      students: [],
      materials: [],
      assignments: [],
      quizzes: [],
      schedules: [],
    };
    setCourses([...courses, newCourse]);
    return newCourse;
  };

  // Student: Enroll in course
  const enrollStudent = (studentId, courseId, studentName) => {
    const existing = enrollments.find(e => e.studentId === studentId && e.courseId === courseId);
    if (existing) return { success: false, message: "Already enrolled" };

    const enrollment = {
      id: `enrollment-${Date.now()}`,
      studentId,
      courseId,
      studentName,
      enrolledDate: new Date().toISOString(),
      attendance: 0,
      progress: 0,
      completedAssignments: [],
      quizScores: [],
    };

    setEnrollments([...enrollments, enrollment]);
    setCourses(courses.map(c => c.id === courseId 
      ? { ...c, students: [...c.students, studentId] }
      : c
    ));

    return { success: true, message: "Successfully enrolled", enrollment };
  };

  // Teacher: Upload material
  const uploadMaterial = (courseId, material) => {
    const newMaterial = {
      id: `material-${Date.now()}`,
      ...material,
      uploadedAt: new Date().toISOString(),
    };

    setCourses(courses.map(c => c.id === courseId
      ? { ...c, materials: [...c.materials, newMaterial] }
      : c
    ));

    return newMaterial;
  };

  // Teacher: Create assignment
  const createAssignment = (courseId, assignment) => {
    const newAssignment = {
      id: `assignment-${Date.now()}`,
      ...assignment,
      createdAt: new Date().toISOString(),
      submissions: [],
    };

    setCourses(courses.map(c => c.id === courseId
      ? { ...c, assignments: [...c.assignments, newAssignment] }
      : c
    ));

    return newAssignment;
  };

  // Student: Submit assignment
  const submitAssignment = (enrollmentId, assignmentId, submission) => {
    const newSubmission = {
      id: `submission-${Date.now()}`,
      enrollmentId,
      assignmentId,
      ...submission,
      submittedAt: new Date().toISOString(),
      status: "submitted",
      grade: null,
      feedback: "",
    };

    setSubmissions([...submissions, newSubmission]);

    // Update enrollment
    setEnrollments(enrollments.map(e => e.id === enrollmentId
      ? { ...e, completedAssignments: [...e.completedAssignments, assignmentId] }
      : e
    ));

    return newSubmission;
  };

  // Teacher: Create quiz
  const createQuiz = (courseId, quiz) => {
    const newQuiz = {
      id: `quiz-${Date.now()}`,
      ...quiz,
      createdAt: new Date().toISOString(),
      questions: [],
      submissions: [],
    };

    setCourses(courses.map(c => c.id === courseId
      ? { ...c, quizzes: [...c.quizzes, newQuiz] }
      : c
    ));

    return newQuiz;
  };

  // Student: Submit quiz
  const submitQuiz = (enrollmentId, quizId, answers, score) => {
    const quizSubmission = {
      id: `quiz-submission-${Date.now()}`,
      enrollmentId,
      quizId,
      answers,
      score,
      submittedAt: new Date().toISOString(),
    };

    // Update enrollment
    setEnrollments(enrollments.map(e => e.id === enrollmentId
      ? { ...e, quizScores: [...e.quizScores, { quizId, score }] }
      : e
    ));

    return quizSubmission;
  };

  // Teacher: Schedule class
  const scheduleClass = (courseId, schedule) => {
    const newSchedule = {
      id: `schedule-${Date.now()}`,
      title: schedule.title || "Live Class",
      startTime: schedule.startTime,
      duration: schedule.duration || 60,
      meetLink: schedule.meetLink || "",
      createdAt: new Date().toISOString(),
      attendees: [],
    };

    setCourses(courses.map(c => c.id === courseId
      ? { ...c, schedules: [...c.schedules, newSchedule] }
      : c
    ));

    return newSchedule;
  };

  const markAttendanceForClass = (courseId, scheduleId, studentId) => {
    // Update schedule attendee list and enrollment attendance count
    setCourses(courses.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        schedules: c.schedules.map(s =>
          s.id === scheduleId
            ? { ...s, attendees: s.attendees?.includes(studentId) ? s.attendees : [...(s.attendees || []), studentId] }
            : s
        ),
      };
    }));

    setEnrollments(enrollments.map(e =>
      e.courseId === courseId && e.studentId === studentId
        ? { ...e, attendance: e.attendance + 1 }
        : e
    ));
  };

  const getCourseSchedules = (courseId) => {
    return courses.find(c => c.id === courseId)?.schedules || [];
  };

  // Mark attendance
  const markAttendance = (enrollmentId) => {
    setEnrollments(enrollments.map(e => e.id === enrollmentId
      ? { ...e, attendance: e.attendance + 1 }
      : e
    ));
  };

  // Update progress
  const updateProgress = (enrollmentId, progress) => {
    setEnrollments(enrollments.map(e => e.id === enrollmentId
      ? { ...e, progress }
      : e
    ));
  };

  // Generate certificate (when progress = 100)
  const generateCertificate = (enrollmentId) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment || enrollment.progress < 100) {
      return { success: false, message: "Course not completed" };
    }

    const certificate = {
      id: `cert-${Date.now()}`,
      enrollmentId,
      issuedAt: new Date().toISOString(),
      certificateNumber: `CERT-${Date.now().toString().slice(-8)}`,
    };

    return { success: true, message: "Certificate issued", certificate };
  };

  // Get student's enrollments
  const getStudentEnrollments = (studentId) => {
    return enrollments.filter(e => e.studentId === studentId);
  };

  // Get course students
  const getCourseStudents = (courseId) => {
    return enrollments.filter(e => e.courseId === courseId);
  };

  // Get course by ID
  const getCourseById = (courseId) => {
    return courses.find(c => c.id === courseId);
  };

  // Get teacher's courses
  const getTeacherCourses = (teacherId) => {
    return courses.filter(c => c.teacherId === teacherId);
  };

  // Review submission
  const reviewSubmission = (submissionId, grade, feedback) => {
    setSubmissions(submissions.map(s => s.id === submissionId
      ? { ...s, grade, feedback, status: "graded" }
      : s
    ));
  };

  // Get submissions for an assignment
  const getAssignmentSubmissions = (assignmentId) => {
    return submissions.filter(s => s.assignmentId === assignmentId);
  };

  // Get submission by enrollment and assignment
  const getSubmission = (enrollmentId, assignmentId) => {
    return submissions.find(s => s.enrollmentId === enrollmentId && s.assignmentId === assignmentId);
  };

  // Delete material
  const deleteMaterial = (courseId, materialId) => {
    setCourses(courses.map(c => c.id === courseId
      ? { ...c, materials: c.materials.filter(m => m.id !== materialId) }
      : c
    ));
  };

  const value = {
    courses,
    enrollments,
    submissions,
    createCourse,
    enrollStudent,
    uploadMaterial,
    createAssignment,
    submitAssignment,
    createQuiz,
    submitQuiz,
    scheduleClass,
    markAttendance,
    markAttendanceForClass,
    getCourseSchedules,
    updateProgress,
    generateCertificate,
    getStudentEnrollments,
    getCourseStudents,
    getCourseById,
    getTeacherCourses,
    reviewSubmission,
    getAssignmentSubmissions,
    getSubmission,
    deleteMaterial,
  };

  return (
    <FormalEducationContext.Provider value={value}>
      {children}
    </FormalEducationContext.Provider>
  );
};

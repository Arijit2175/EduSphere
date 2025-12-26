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

  // Fetch courses and enrollments from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await fetch("http://127.0.0.1:8000/courses/");
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData);
        }
        const enrollmentsRes = await fetch("http://127.0.0.1:8000/enrollments/");
        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json();
          setEnrollments(enrollmentsData);
        }
      } catch (err) {
        // handle error
      }
    };
    fetchData();
  }, []);

  // Teacher: Create course
  const createCourse = async (courseData) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/courses/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseData),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Course creation failed" };
      }
      const newCourse = await res.json();
      setCourses((prev) => [...prev, newCourse]);
      return { success: true, course: newCourse };
    } catch (err) {
      return { success: false, message: "Course creation failed" };
    }
  };

  // Student: Enroll in course
  const enrollStudent = async (studentId, courseId, studentName) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/enrollments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: studentId, course_id: courseId, student_name: studentName }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Enrollment failed" };
      }
      const enrollment = await res.json();
      setEnrollments((prev) => [...prev, enrollment]);
      return { success: true, message: "Successfully enrolled", enrollment };
    } catch (err) {
      return { success: false, message: "Enrollment failed" };
    }
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
  const createAssignment = async (courseId, assignment) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/assignments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...assignment, course_id: courseId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Assignment creation failed" };
      }
      const newAssignment = await res.json();
      setCourses((prev) => prev.map(c => c.id === courseId ? { ...c, assignments: [...(c.assignments || []), newAssignment] } : c));
      return { success: true, assignment: newAssignment };
    } catch (err) {
      return { success: false, message: "Assignment creation failed" };
    }
  };

  // Student: Submit assignment
  const submitAssignment = async (enrollmentId, assignmentId, submission) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/assignment_submissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_id: enrollmentId, assignment_id: assignmentId, ...submission }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Assignment submission failed" };
      }
      const newSubmission = await res.json();
      setSubmissions((prev) => [...prev, newSubmission]);
      return { success: true, submission: newSubmission };
    } catch (err) {
      return { success: false, message: "Assignment submission failed" };
    }
  };

  // Teacher: Create quiz
  const createQuiz = async (courseId, quiz) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/quizzes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quiz, course_id: courseId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Quiz creation failed" };
      }
      const newQuiz = await res.json();
      setCourses((prev) => prev.map(c => c.id === courseId ? { ...c, quizzes: [...(c.quizzes || []), newQuiz] } : c));
      return { success: true, quiz: newQuiz };
    } catch (err) {
      return { success: false, message: "Quiz creation failed" };
    }
  };

  // Student: Submit quiz
  const submitQuiz = async (enrollmentId, quizId, answers, score) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/quiz_submissions/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_id: enrollmentId, quiz_id: quizId, answers, score }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Quiz submission failed" };
      }
      const quizSubmission = await res.json();
      setEnrollments((prev) => prev.map(e => e.id === enrollmentId ? { ...e, quizScores: [...(e.quizScores || []), { quizId, score }] } : e));
      return { success: true, submission: quizSubmission };
    } catch (err) {
      return { success: false, message: "Quiz submission failed" };
    }
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
  const markAttendance = async (enrollmentId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/attendance/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_id: enrollmentId }),
      });
      if (res.ok) {
        setEnrollments((prev) => prev.map(e => e.id === enrollmentId ? { ...e, attendance: (e.attendance || 0) + 1 } : e));
      }
    } catch (err) {}
  };

  // Update progress
  const updateProgress = (enrollmentId, progress) => {
    setEnrollments(enrollments.map(e => e.id === enrollmentId
      ? { ...e, progress }
      : e
    ));
  };

  // Generate certificate (when progress = 100)
  const generateCertificate = async (enrollmentId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/certificates/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_id: enrollmentId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Certificate generation failed" };
      }
      const certificate = await res.json();
      return { success: true, message: "Certificate issued", certificate };
    } catch (err) {
      return { success: false, message: "Certificate generation failed" };
    }
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

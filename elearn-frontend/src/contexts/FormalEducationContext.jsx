import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import API_URL from "../config";
import { useAuth } from "./AuthContext";

const FormalEducationContext = createContext();

export const useFormalEducation = () => {
  const context = useContext(FormalEducationContext);
  if (!context) {
    throw new Error("useFormalEducation must be used within FormalEducationProvider");
  }
  return context;
};

export const FormalEducationProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Fetch courses and enrollments from backend on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user || !user.access_token) {
          return; // Wait until we have an authenticated user
        }
        const coursesRes = await fetch("${API_URL}/courses/");
        let coursesData = [];
        if (coursesRes.ok) {
          coursesData = await coursesRes.json();
          // For each course, fetch its materials, assignments, and schedules
          const coursesWithDetails = await Promise.all(
            coursesData.map(async (course) => {
              let materials = [];
              let assignments = [];
              let schedules = [];
              try {
                const matRes = await fetch(`${API_URL}/resources/?course_id=${course.id}`);
                if (matRes.ok) {
                  materials = await matRes.json();
                }
              } catch {}
              try {
                const assignRes = await fetch(`${API_URL}/assignments/?course_id=${course.id}`);
                if (assignRes.ok) {
                  assignments = await assignRes.json();
                }
              } catch {}
              try {
                const schedRes = await fetch(`${API_URL}/class-schedules/?course_id=${course.id}`);
                if (schedRes.ok) {
                  schedules = await schedRes.json();
                }
              } catch {}
              return { ...course, materials, assignments, schedules };
            })
          );
          setCourses(coursesWithDetails);
        }
        const enrollmentsRes = await fetch("${API_URL}/enrollments/");
        let mapped = [];
        if (enrollmentsRes.ok) {
          const enrollmentsData = await enrollmentsRes.json();
          mapped = enrollmentsData.map(e => ({
            id: e.id,
            studentId: e.user_id,
            courseId: e.course_id,
            enrolledAt: e.enrolled_at,
            progress: e.progress,
            status: e.status,
            ...e
          }));
        }
        // Fetch assignment submissions with auth; students receive their own
        const submissionsRes = await fetch("${API_URL}/assignments/assignment_submissions/", {
          headers: user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}
        });
        let mappedSubmissions = [];
        if (submissionsRes.ok) {
          const allSubmissions = await submissionsRes.json();
          mappedSubmissions = allSubmissions.map(s => ({
            ...s,
            submittedAt: s.submitted_at || s.submittedAt
          }));
          setSubmissions(mappedSubmissions);
        } else {
          setSubmissions([]);
        }
        // For each enrollment, set completedAssignments based on submissions
        mapped = mapped.map(e => {
          const completed = mappedSubmissions
            .filter(s => s.enrollment_id === e.id)
            .map(s => s.assignment_id);
          return { ...e, completedAssignments: completed };
        });
        setEnrollments(mapped);
      } catch (err) {
        // handle error
      }
    };
    fetchData();
  }, [user]);
  // Get all assignments for an enrollment (helper)
  const getAssignmentsForEnrollment = (enrollmentId) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    if (!enrollment) return [];
    const course = courses.find(c => c.id === enrollment.courseId);
    return course?.assignments || [];
  };

  // Teacher: Create course
  const createCourse = async (courseData) => {
    try {
      const res = await fetch("${API_URL}/courses/", {
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
  const enrollStudent = useCallback(async (userId, courseId) => {
    try {
      const res = await fetch("${API_URL}/enrollments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ student_id: userId, course_id: courseId }),
      });
      const data = await res.json();
      console.log("Enrollment response:", res.status, data);
      
      // Check if we got enrollment data back (success case)
      if (data && (data.id || data.user_id || data.course_id)) {
        // Map backend fields to camelCase for consistency
        const mappedEnrollment = {
          id: data.id,
          studentId: data.user_id,
          courseId: data.course_id,
          enrolledAt: data.enrolled_at,
          progress: data.progress,
          status: data.status,
          ...data
        };
        setEnrollments((prev) => [...prev, mappedEnrollment]);
        // Refresh enrollments from backend so UI updates
        try {
          const enrollmentsRes = await fetch("${API_URL}/enrollments/");
          if (enrollmentsRes.ok) {
            const enrollmentsData = await enrollmentsRes.json();
            const mapped = enrollmentsData.map(e => ({
              id: e.id,
              studentId: e.user_id,
              courseId: e.course_id,
              enrolledAt: e.enrolled_at,
              progress: e.progress,
              status: e.status,
              ...e
            }));
            setEnrollments(mapped);
          }
        } catch (refreshErr) {}
        return { success: true, message: "Successfully enrolled", enrollment: mappedEnrollment };
      }
      
      // No enrollment data - error case
      return { success: false, message: data.detail || "Enrollment failed" };
    } catch (err) {
      console.error("Enrollment error:", err);
      return { success: false, message: "Enrollment failed" };
    }
  }, []);


  // Teacher: Add material (save to backend)
  const addMaterial = async (courseId, material) => {
    // For now, only support PDFs and simple uploads as base64 or links
    // If material.file is present, convert to base64 and send as url
    let url = material.url || "";
    let type = material.type || "pdf";
    if (material.file) {
      // Convert file to base64 string
      url = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(material.file);
      });
    }
    const res = await fetch("${API_URL}/resources/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course_id: courseId, name: material.name, url, type }),
    });
    if (!res.ok) {
      const errorData = await res.json();
      return { success: false, message: errorData.detail || "Material upload failed" };
    }
    const newMaterial = await res.json();
    setCourses((prev) => prev.map(c => c.id === courseId
      ? { ...c, materials: [...(c.materials || []), newMaterial] }
      : c
    ));
    return { success: true, material: newMaterial };
  };

  // Teacher: Create assignment
  const createAssignment = async (courseId, assignment) => {
    try {
      // Map dueDate (camelCase) to due_date (snake_case) for backend
      const assignmentData = { ...assignment, course_id: courseId };
      if (assignment.dueDate) {
        assignmentData.due_date = assignment.dueDate;
        delete assignmentData.dueDate;
      }
      const res = await fetch(`${API_URL}/assignments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(assignmentData),
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
      const user = JSON.parse(localStorage.getItem("user"));
      const studentId = user?.id;
      const res = await fetch(`${API_URL}/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollment_id: enrollmentId,
          student_id: studentId,
          content: submission.content
        }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Assignment submission failed" };
      }
      const newSubmission = await res.json();
      // Map submitted_at to submittedAt for frontend consistency
      const mappedSubmission = { ...newSubmission, submittedAt: newSubmission.submitted_at || newSubmission.submittedAt };
      setSubmissions((prev) => [...prev, mappedSubmission]);
      // Update completedAssignments for the relevant enrollment
      setEnrollments((prev) => prev.map(e => {
        if (e.id === enrollmentId) {
          const completed = Array.isArray(e.completedAssignments) ? [...e.completedAssignments] : [];
          if (!completed.includes(assignmentId)) completed.push(assignmentId);
          return { ...e, completedAssignments: completed };
        }
        return e;
      }));
      return { success: true, submission: newSubmission };
    } catch (err) {
      return { success: false, message: "Assignment submission failed" };
    }
  };

  // Teacher: Create quiz
  const createQuiz = async (courseId, quiz) => {
    try {
      const res = await fetch(`${API_URL}/quizzes/`, {
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
      const res = await fetch(`${API_URL}/quiz_submissions/`, {
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
  const scheduleClass = async (courseId, schedule) => {
    // POST to backend
    try {
      const res = await fetch("${API_URL}/class-schedules/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseId,
          title: schedule.title || "Live Class",
          start_time: schedule.startTime,
          duration: schedule.duration || 60,
          meet_link: schedule.meetLink || ""
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Schedule creation failed" };
      }
      const newSchedule = await res.json();
      setCourses(prev => prev.map(c => c.id === courseId
        ? { ...c, schedules: [...(c.schedules || []), newSchedule] }
        : c
      ));
      return { success: true, schedule: newSchedule };
    } catch (err) {
      return { success: false, message: "Schedule creation failed" };
    }
  };

  // Mark attendance for a class session and student
  const markAttendanceForClass = async (courseId, scheduleId, studentId, status = "present") => {
    try {
      const res = await fetch("${API_URL}/attendance/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {})
        },
        body: JSON.stringify({ schedule_id: scheduleId, student_id: studentId, status }),
      });
      if (res.ok) {
        // After marking, fetch all attendance for this student in this course
        const attendanceRes = await fetch(`${API_URL}/attendance/?student_id=${studentId}`, {
          headers: user?.access_token ? { Authorization: `Bearer ${user.access_token}` } : {}
        });
        let presentCount = 0;
        if (attendanceRes.ok) {
          const attendanceRecords = await attendanceRes.json();
          // Only count 'present' for this course's schedules
          const courseScheduleIds = (courses.find(c => c.id === courseId)?.schedules || []).map(s => s.id);
          presentCount = attendanceRecords.filter(
            a => a.status === "present" && courseScheduleIds.includes(a.schedule_id)
          ).length;
        }
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
            ? { ...e, attendance: presentCount }
            : e
        ));
      } else {
        // Handle error (optional)
        console.error("Failed to mark attendance");
      }
    } catch (err) {
      console.error("Error marking attendance:", err);
    }
  };

  const getCourseSchedules = (courseId) => {
    return courses.find(c => c.id === courseId)?.schedules || [];
  };

  // Mark attendance
  const markAttendance = async (enrollmentId) => {
    try {
      const res = await fetch(`${API_URL}/attendance/`, {
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
      const res = await fetch(`${API_URL}/certificates/`, {
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
    return courses.filter(c => c.instructor_id === teacherId);
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
    return submissions.filter(s => s.assignment_id === assignmentId);
  };

  // Get submission by enrollment and assignment
  const getSubmission = (enrollmentId, assignmentId) => {
    return submissions.find(s => s.enrollmentId === enrollmentId && s.assignmentId === assignmentId);
  };

  // Delete material
  const deleteMaterial = async (courseId, materialId) => {
    try {
      const res = await fetch(`${API_URL}/resources/${materialId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setCourses(courses => courses.map(c => c.id === courseId
          ? { ...c, materials: c.materials.filter(m => m.id !== materialId) }
          : c
        ));
        return { success: true };
      } else {
        return { success: false, message: "Failed to delete material from backend." };
      }
    } catch (err) {
      return { success: false, message: "Network error while deleting material." };
    }
  };

  const value = useMemo(() => ({
    courses,
    enrollments,
    submissions,
    createCourse,
    enrollStudent,
    addMaterial,
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
    getAssignmentsForEnrollment,
    deleteMaterial,
  }), [courses, enrollments, submissions, enrollStudent]);

  return (
    <FormalEducationContext.Provider value={value}>
      {children}
    </FormalEducationContext.Provider>
  );
};
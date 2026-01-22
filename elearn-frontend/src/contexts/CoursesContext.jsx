import { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthContext";

const CoursesContext = createContext();

export const useCourses = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error("useCourses must be used within a CoursesProvider");
  }
  return context;
};

export const CoursesProvider = ({ children }) => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const { user } = useAuth();
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      if (!user || !user.access_token) {
        setEnrolledCourses([]);
        return;
      }
      try {
        const token = user.access_token;
        const res = await fetch("http://127.0.0.1:8000/enrollments/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setEnrolledCourses(data);
        }
      } catch (err) {
        // handle error
      }
    };
    fetchEnrolledCourses();
  }, [user?.id, user?.access_token]);

  const enrollCourse = async (courseId) => {
    console.log("ENROLL POST BODY", { student_id: user?.id, course_id: courseId });
    try {
      const token = user?.access_token;
      const res = await fetch("http://127.0.0.1:8000/enrollments/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ student_id: user?.id, course_id: courseId }),
      });
      const data = await res.json();
      // If we got enrollment data back, treat it as success even if status isn't 2xx
      if (data.id || data.user_id || data.course_id) {
        setEnrolledCourses((prev) => [...prev, data]);
        return { success: true, message: "Successfully enrolled!" };
      }
      // If no enrollment data but got a response, check for error detail
      if (!res.ok) {
        return { success: false, message: data.detail || "Enrollment failed" };
      }
      return { success: false, message: "Enrollment failed" };
    } catch (err) {
      console.error("Enrollment error:", err);
      return { success: false, message: "Enrollment failed" };
    }
  };

  const unenrollCourse = async (courseId) => {
    try {
      const token = user?.access_token;
      const res = await fetch(`http://127.0.0.1:8000/enrollments/${courseId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setEnrolledCourses((prev) => prev.filter((c) => c.course_id !== courseId && c.id !== courseId));
      }
    } catch (err) {}
  };

  const updateProgress = async (courseId, progress) => {
    try {
      const token = user?.access_token;
      const res = await fetch(`http://127.0.0.1:8000/enrollments/${courseId}/progress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ progress }),
      });
      if (res.ok) {
        setEnrolledCourses((prev) =>
          prev.map((course) =>
            course.id === courseId ? { ...course, progress } : course
          )
        );
      }
    } catch (err) {}
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some((c) => c.course_id === courseId || c.id === courseId);
  };

  const value = useMemo(() => ({
    enrolledCourses,
    enrollCourse,
    unenrollCourse,
    updateProgress,
    isEnrolled,
  }), [enrolledCourses]);

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};

import { createContext, useContext, useState, useEffect } from "react";

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
  // Fetch enrolled courses from backend on mount
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/enrollments/me"); // Adjust endpoint as needed
        if (res.ok) {
          const data = await res.json();
          setEnrolledCourses(data);
        }
      } catch (err) {
        // handle error
      }
    };
    fetchEnrolledCourses();
  }, []);

  const enrollCourse = async (courseId) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/enrollments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: courseId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        return { success: false, message: errorData.detail || "Enrollment failed" };
      }
      const data = await res.json();
      setEnrolledCourses((prev) => [...prev, data]);
      return { success: true, message: "Successfully enrolled!" };
    } catch (err) {
      return { success: false, message: "Enrollment failed" };
    }
  };

  const unenrollCourse = async (courseId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/enrollments/${courseId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEnrolledCourses((prev) => prev.filter((c) => c.course_id !== courseId && c.id !== courseId));
      }
    } catch (err) {}
  };

  const updateProgress = async (courseId, progress) => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/enrollments/${courseId}/progress`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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

  const value = {
    enrolledCourses,
    enrollCourse,
    unenrollCourse,
    updateProgress,
    isEnrolled,
  };

  return <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>;
};

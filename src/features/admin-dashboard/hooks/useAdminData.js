import { useState, useEffect, useCallback } from "react";
import { api } from "../../../services/api";

/**
 * Fetches and manages all admin dashboard data:
 * users, courses, enrollment requests, and course views.
 *
 * Returns { users, courses, requests, views, loading, error,
 *           handleRoleChange, handleDeleteUser,
 *           handleDeleteCourse, handleRequestStatus }.
 */
export function useAdminData(currentUserId) {
  const [users, setUsers]       = useState([]);
  const [courses, setCourses]   = useState([]);
  const [requests, setRequests] = useState([]);
  const [views, setViews]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    Promise.all([
      api.getAllUsers(),
      api.getAllCourses(),
      api.getAllRequests(),
      api.getAllCourseViews(),
    ])
      .then(([u, c, r, v]) => {
        setUsers(u || []);
        setCourses(c || []);
        setRequests(r || []);
        setViews(v || []);
      })
      .catch(() => setError("Failed to load data. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = useCallback(async (userId, newRole) => {
    await api.updateUser(userId, { role: newRole });
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  }, []);

  const handleDeleteUser = useCallback(async (userId) => {
    if (String(userId) === String(currentUserId)) {
      throw new Error("Cannot delete your own account.");
    }
    await api.deleteUser(userId);
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, [currentUserId]);

  const handleDeleteCourse = useCallback(async (courseId) => {
    await api.deleteCourse(courseId);
    setCourses(prev => prev.filter(c => c.id !== courseId));
  }, []);

  const handleRequestStatus = useCallback(async (reqId, status) => {
    await api.updateRequest(reqId, { status });
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status } : r));
  }, []);

  return {
    users,
    courses,
    requests,
    views,
    loading,
    error,
    handleRoleChange,
    handleDeleteUser,
    handleDeleteCourse,
    handleRequestStatus,
  };
}

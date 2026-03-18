import { useState, useEffect } from "react";
import { supabase } from "../../../services/supabase";

/**
 * Fetches publicly visible courses from the database.
 * Returns { data, isLoading, error, refetch }.
 */
export function usePublicCourses() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    const { data: rows, error: err } = await supabase
      .from("instructor_courses")
      .select("*")
      .order("created_at", { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setData(rows ?? []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { data, isLoading, error, refetch: fetchCourses };
}

/**
 * Fetches all public instructors (profiles with role = 'instructor').
 * Returns { data, isLoading, error, refetch }.
 */
export function usePublicInstructors() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInstructors = async () => {
    setIsLoading(true);
    setError(null);
    const { data: rows, error: err } = await supabase
      .from("profiles")
      .select("*")
      .eq("role", "instructor");
    if (err) {
      setError(err.message);
    } else {
      setData(rows ?? []);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  return { data, isLoading, error, refetch: fetchInstructors };
}

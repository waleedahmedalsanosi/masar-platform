import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../services/supabase";

async function fetchPublicCourses() {
  const { data, error } = await supabase
    .from("instructor_courses")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

async function fetchPublicInstructors() {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "instructor");
  if (error) throw new Error(error.message);
  return data ?? [];
}

/**
 * Fetches publicly visible courses.
 * Returns { data, isLoading, error, refetch }.
 */
export function usePublicCourses() {
  return useQuery({
    queryKey: ["public-courses"],
    queryFn: fetchPublicCourses,
  });
}

/**
 * Fetches all public instructors (role = 'instructor').
 * Returns { data, isLoading, error, refetch }.
 */
export function usePublicInstructors() {
  return useQuery({
    queryKey: ["public-instructors"],
    queryFn: fetchPublicInstructors,
  });
}

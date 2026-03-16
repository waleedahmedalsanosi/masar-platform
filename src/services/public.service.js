/**
 * Public data service — centers, instructors, public courses
 * Fetches from Supabase with fallback to static data
 */
import { supabase, check } from "./_utils";
import { CENTERS } from "../data/centers";
import { INSTRUCTORS, INSTRUCTOR_DETAILS } from "../data/instructors";
import { COURSES, COURSE_DETAILS } from "../data/courses";

export const getCenters = async () => {
  const { data, error } = await supabase.from("centers").select("*").order("id");
  if (error || !data?.length) return CENTERS;
  return check({ data, error: null });
};

export const getInstructors = async () => {
  const { data, error } = await supabase.from("instructors").select("*").order("id");
  if (error || !data?.length) return INSTRUCTORS;
  return check({ data, error: null });
};

export const getInstructorDetails = async (id) => {
  const { data, error } = await supabase
    .from("instructor_details")
    .select("*")
    .eq("instructor_id", id)
    .single();
  if (error || !data) return INSTRUCTOR_DETAILS[id] || null;
  return check({ data, error: null });
};

export const getPublicCourses = async () => {
  const { data, error } = await supabase.from("public_courses").select("*").order("id");
  if (error || !data?.length) return COURSES;
  return check({ data, error: null });
};

export const getPublicCourseDetails = async (id) => {
  const { data, error } = await supabase
    .from("public_course_details")
    .select("*")
    .eq("course_id", id)
    .single();
  if (error || !data) return COURSE_DETAILS[id] || null;
  return check({ data, error: null });
};

import { supabase, toSnake, check } from "./_utils";

export const getCourseViews = (courseId) =>
  supabase
    .from("course_views")
    .select("*")
    .eq("course_id", courseId)
    .then(check);

export const getAllCourseViews = () =>
  supabase
    .from("course_views")
    .select("*")
    .then(check);

export const createView = (data) =>
  supabase
    .from("course_views")
    .insert(toSnake(data))
    .then(({ error }) => { if (error) throw new Error(error.message); });

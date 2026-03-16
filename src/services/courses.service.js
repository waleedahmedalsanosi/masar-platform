import { supabase, toSnake, check } from "./_utils";

export const getCourses = (instructorId) =>
  supabase
    .from("instructor_courses")
    .select("*")
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: false })
    .then(check);

export const getAllCourses = () =>
  supabase
    .from("instructor_courses")
    .select("*")
    .order("created_at", { ascending: false })
    .then(check);

export const createCourse = (course) =>
  supabase
    .from("instructor_courses")
    .insert(toSnake(course))
    .select()
    .single()
    .then(check);

export const updateCourse = (id, updates) =>
  supabase
    .from("instructor_courses")
    .update(toSnake(updates))
    .eq("id", id)
    .select()
    .single()
    .then(check);

export const deleteCourse = (id) =>
  supabase
    .from("instructor_courses")
    .delete()
    .eq("id", id)
    .then(({ error }) => { if (error) throw new Error(error.message); });

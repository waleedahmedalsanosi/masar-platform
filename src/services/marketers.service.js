import { supabase, toSnake, check } from "./_utils";

export const getMarketers = () =>
  supabase
    .from("profiles")
    .select("*")
    .eq("role", "marketer")
    .then(check);

export const getMarketerAssignments = (instructorId) =>
  supabase
    .from("marketer_assignments")
    .select("*")
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: false })
    .then(check);

export const getMyAssignments = (marketerId) =>
  supabase
    .from("marketer_assignments")
    .select("*")
    .eq("marketer_id", marketerId)
    .then(check);

export const createAssignment = (data) =>
  supabase
    .from("marketer_assignments")
    .insert(toSnake(data))
    .select()
    .single()
    .then(check);

export const deleteAssignment = (id) =>
  supabase
    .from("marketer_assignments")
    .delete()
    .eq("id", id)
    .then(({ error }) => { if (error) throw new Error(error.message); });

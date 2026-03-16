import { supabase, toSnake, check } from "./_utils";

export const getRequests = (instructorId) =>
  supabase
    .from("enrollment_requests")
    .select("*")
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: false })
    .then(check);

export const getAllRequests = () =>
  supabase
    .from("enrollment_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .then(check);

export const getMarketerRequests = (marketerId) =>
  supabase
    .from("enrollment_requests")
    .select("*")
    .eq("marketer_id", marketerId)
    .order("created_at", { ascending: false })
    .then(check);

export const createRequest = (req) =>
  supabase
    .from("enrollment_requests")
    .insert(toSnake(req))
    .select()
    .single()
    .then(check);

export const updateRequest = (id, updates) =>
  supabase
    .from("enrollment_requests")
    .update(toSnake(updates))
    .eq("id", id)
    .select()
    .single()
    .then(check);

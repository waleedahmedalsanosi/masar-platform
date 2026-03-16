import { supabase, check } from "./_utils";

export const getQA = (instructorId) =>
  supabase
    .from("qa_items")
    .select("*")
    .eq("instructor_id", instructorId)
    .order("created_at", { ascending: true })
    .then(check);

export const replyQA = (id, answer) =>
  supabase
    .from("qa_items")
    .update({ answer })
    .eq("id", id)
    .select()
    .single()
    .then(check);

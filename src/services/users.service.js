import { supabase, toSnake, check } from "./_utils";

export const getAllUsers = () =>
  supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true })
    .then(check);

export const updateUser = (id, updates) =>
  supabase
    .from("profiles")
    .update(toSnake(updates))
    .eq("id", id)
    .select()
    .single()
    .then(check);

export const deleteUser = (id) =>
  supabase
    .from("profiles")
    .delete()
    .eq("id", id)
    .then(({ error }) => { if (error) throw new Error(error.message); });

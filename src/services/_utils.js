import { supabase } from "./supabase";
export { supabase };

export const toCamel = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamel);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      v && typeof v === "object" && !Array.isArray(v) ? toCamel(v) : v,
    ])
  );
};

export const toSnake = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toSnake);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/([A-Z])/g, "_$1").toLowerCase(),
      v,
    ])
  );
};

export const check = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return toCamel(data);
};

/**
 * @file api.js
 * @description طبقة البيانات — تستخدم Supabase بدلاً من json-server
 *
 * جميع أسماء الدوال هي نفسها كما كانت، لذلك لا حاجة لتغيير أي مكوّن.
 * يتم تحويل أسماء الحقول تلقائياً: snake_case (قاعدة البيانات) ↔ camelCase (المكوّنات)
 */

import { supabase } from "./supabase";

// ── Case converters ──────────────────────────────────────────────────────────

/** snake_case → camelCase (for rows coming FROM the database) */
const toCamel = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toCamel);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/_([a-z])/g, (_, c) => c.toUpperCase()),
      v && typeof v === "object" && !Array.isArray(v) ? toCamel(v) : v,
    ])
  );
};

/** camelCase → snake_case (for data going TO the database) */
const toSnake = (obj) => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(toSnake);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [
      k.replace(/([A-Z])/g, "_$1").toLowerCase(),
      v,
    ])
  );
};

/** Throw on Supabase error */
const check = ({ data, error }) => {
  if (error) throw new Error(error.message);
  return toCamel(data);
};

// ── API ──────────────────────────────────────────────────────────────────────

export const api = {

  // ── Instructor Courses ──────────────────────────────────────────────────
  /** جلب كورسات مدرب معين */
  getCourses: (instructorId) =>
    supabase
      .from("instructor_courses")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false })
      .then(check),

  /** إضافة كورس جديد */
  createCourse: (course) =>
    supabase
      .from("instructor_courses")
      .insert(toSnake(course))
      .select()
      .single()
      .then(check),

  /** تعديل كورس */
  updateCourse: (id, updates) =>
    supabase
      .from("instructor_courses")
      .update(toSnake(updates))
      .eq("id", id)
      .select()
      .single()
      .then(check),

  /** حذف كورس */
  deleteCourse: (id) =>
    supabase
      .from("instructor_courses")
      .delete()
      .eq("id", id)
      .then(({ error }) => { if (error) throw new Error(error.message); }),

  // ── Enrollment Requests ─────────────────────────────────────────────────
  /** جلب طلبات التسجيل لمدرب معين */
  getRequests: (instructorId) =>
    supabase
      .from("enrollment_requests")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false })
      .then(check),

  /** إضافة طلب تسجيل جديد */
  createRequest: (req) =>
    supabase
      .from("enrollment_requests")
      .insert(toSnake(req))
      .select()
      .single()
      .then(check),

  /** تحديث حالة طلب */
  updateRequest: (id, updates) =>
    supabase
      .from("enrollment_requests")
      .update(toSnake(updates))
      .eq("id", id)
      .select()
      .single()
      .then(check),

  // ── Q&A Items ───────────────────────────────────────────────────────────
  /** جلب أسئلة مدرب معين */
  getQA: (instructorId) =>
    supabase
      .from("qa_items")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: true })
      .then(check),

  /** الرد على سؤال */
  replyQA: (id, answer) =>
    supabase
      .from("qa_items")
      .update({ answer })
      .eq("id", id)
      .select()
      .single()
      .then(check),

  // ── Course Views ─────────────────────────────────────────────────────────
  /** جلب مشاهدات كورس معين */
  getCourseViews: (courseId) =>
    supabase
      .from("course_views")
      .select("*")
      .eq("course_id", courseId)
      .then(check),

  /** جلب كل المشاهدات */
  getAllCourseViews: () =>
    supabase
      .from("course_views")
      .select("*")
      .then(check),

  /** تسجيل مشاهدة جديدة */
  createView: (data) =>
    supabase
      .from("course_views")
      .insert(toSnake(data))
      .then(({ error }) => { if (error) throw new Error(error.message); }),

  // ── Marketers ────────────────────────────────────────────────────────────
  /** جلب كل المسوقين المسجلين */
  getMarketers: () =>
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "marketer")
      .then(check),

  /** جلب تعيينات المسوقين لمدرب معين */
  getMarketerAssignments: (instructorId) =>
    supabase
      .from("marketer_assignments")
      .select("*")
      .eq("instructor_id", instructorId)
      .order("created_at", { ascending: false })
      .then(check),

  /** جلب تعيينات مسوق معين */
  getMyAssignments: (marketerId) =>
    supabase
      .from("marketer_assignments")
      .select("*")
      .eq("marketer_id", marketerId)
      .then(check),

  /** تعيين مسوق لكورس */
  createAssignment: (data) =>
    supabase
      .from("marketer_assignments")
      .insert(toSnake(data))
      .select()
      .single()
      .then(check),

  /** حذف تعيين مسوق */
  deleteAssignment: (id) =>
    supabase
      .from("marketer_assignments")
      .delete()
      .eq("id", id)
      .then(({ error }) => { if (error) throw new Error(error.message); }),

  /** جلب طلبات التسجيل المرتبطة بمسوق معين */
  getMarketerRequests: (marketerId) =>
    supabase
      .from("enrollment_requests")
      .select("*")
      .eq("marketer_id", marketerId)
      .order("created_at", { ascending: false })
      .then(check),

  // ── Admin — Full Data Access ─────────────────────────────────────────────
  /** جلب كل المستخدمين */
  getAllUsers: () =>
    supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: true })
      .then(check),

  /** تحديث بيانات مستخدم */
  updateUser: (id, upd) =>
    supabase
      .from("profiles")
      .update(toSnake(upd))
      .eq("id", id)
      .select()
      .single()
      .then(check),

  /** حذف مستخدم (يحذف الـ profile فقط — لا يستطيع تسجيل الدخول بعدها) */
  deleteUser: (id) =>
    supabase
      .from("profiles")
      .delete()
      .eq("id", id)
      .then(({ error }) => { if (error) throw new Error(error.message); }),

  /** جلب كل الكورسات من كل المدربين */
  getAllCourses: () =>
    supabase
      .from("instructor_courses")
      .select("*")
      .order("created_at", { ascending: false })
      .then(check),

  /** جلب كل طلبات التسجيل */
  getAllRequests: () =>
    supabase
      .from("enrollment_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .then(check),
};

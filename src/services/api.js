/**
 * @file api.js
 * @description طبقة الـ API للتواصل مع json-server
 *
 * كل الطلبات تذهب إلى /api/* والـ Vite proxy يحوّلها إلى http://localhost:3001/*
 */

const BASE = "/api";

const request = async (method, path, data) => {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  if (res.status === 204) return null;
  return res.json();
};

const get   = (path)       => request("GET",    path);
const post  = (path, data) => request("POST",   path, data);
const patch = (path, data) => request("PATCH",  path, data);
const del   = (path)       => request("DELETE", path);

export const api = {
  // ── Users / Auth ────────────────────────────────────────
  /** العثور على مستخدم بالإيميل */
  findByEmail: (email) => get(`/users?email=${encodeURIComponent(email)}`),
  /** إنشاء حساب جديد */
  createUser: (userData) => post("/users", userData),

  // ── Instructor Courses ──────────────────────────────────
  /** جلب كورسات مدرب معين */
  getCourses: (instructorId) => get(`/instructorCourses?instructorId=${instructorId}`),
  /** إضافة كورس جديد */
  createCourse: (course) => post("/instructorCourses", course),
  /** تعديل كورس */
  updateCourse: (id, updates) => patch(`/instructorCourses/${id}`, updates),
  /** حذف كورس */
  deleteCourse: (id) => del(`/instructorCourses/${id}`),

  // ── Enrollment Requests ─────────────────────────────────
  /** جلب طلبات التسجيل لمدرب معين */
  getRequests: (instructorId) => get(`/enrollmentRequests?instructorId=${instructorId}`),
  /** إضافة طلب تسجيل جديد */
  createRequest: (req) => post("/enrollmentRequests", req),
  /** تحديث حالة طلب (قبول / رفض) */
  updateRequest: (id, updates) => patch(`/enrollmentRequests/${id}`, updates),

  // ── Q&A Items ───────────────────────────────────────────
  /** جلب أسئلة مدرب معين */
  getQA: (instructorId) => get(`/qaItems?instructorId=${instructorId}`),
  /** الرد على سؤال */
  replyQA: (id, answer) => patch(`/qaItems/${id}`, { answer }),

  // ── Course Views ─────────────────────────────────────────
  /** جلب مشاهدات كورس معين */
  getCourseViews: (courseId) => get(`/courseViews?courseId=${courseId}`),
  /** جلب كل المشاهدات */
  getAllCourseViews: () => get("/courseViews"),
  /** تسجيل مشاهدة جديدة */
  createView: (data) => post("/courseViews", data),

  // ── Marketers ────────────────────────────────────────────
  /** جلب كل المسوقين المسجلين */
  getMarketers: () => get("/users?role=marketer"),
  /** جلب تعيينات المسوقين لمدرب معين */
  getMarketerAssignments: (instructorId) => get(`/marketerAssignments?instructorId=${instructorId}`),
  /** جلب تعيينات مسوق معين */
  getMyAssignments: (marketerId) => get(`/marketerAssignments?marketerId=${marketerId}`),
  /** تعيين مسوق لكورس */
  createAssignment: (data) => post("/marketerAssignments", data),
  /** حذف تعيين مسوق */
  deleteAssignment: (id) => del(`/marketerAssignments/${id}`),
  /** جلب طلبات التسجيل المرتبطة بمسوق معين */
  getMarketerRequests: (marketerId) => get(`/enrollmentRequests?marketerId=${marketerId}`),

  // ── Admin — Full Data Access ─────────────────────────────────────────────
  /** جلب كل المستخدمين */
  getAllUsers:    ()        => get("/users"),
  /** تحديث بيانات مستخدم */
  updateUser:    (id, upd) => patch(`/users/${id}`, upd),
  /** حذف مستخدم */
  deleteUser:    (id)      => del(`/users/${id}`),
  /** جلب كل الكورسات من كل المدربين */
  getAllCourses:  ()        => get("/instructorCourses"),
  /** جلب كل طلبات التسجيل */
  getAllRequests: ()        => get("/enrollmentRequests"),
};

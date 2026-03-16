/**
 * @file instructors.js
 * @description بيانات المدربين على منصة مسار
 *
 * يحتوي هذا الملف على:
 * - INSTRUCTORS: قائمة المدربين مع ملفاتهم الشخصية المختصرة
 * - INSTRUCTOR_DETAILS: التفاصيل الكاملة لكل مدرب
 */

/**
 * @typedef {Object} Instructor
 * @property {number} id - المعرف الفريد للمدرب
 * @property {string} name - الاسم الكامل
 * @property {string} title - المسمى الوظيفي
 * @property {string|null} center - المركز المنتسب إليه
 * @property {number} courses - عدد الكورسات
 * @property {number} students - إجمالي الطلاب
 * @property {number} rating - التقييم من 5
 * @property {string} bio - نبذة مختصرة
 * @property {string[]} specialties - مجالات التخصص
 * @property {string} avatar - الأحرف الأولى للاسم
 */

/** @type {Instructor[]} قائمة المدربين */
export const INSTRUCTORS = [];

/**
 * @typedef {Object} InstructorDetail
 * @property {string} fullBio - السيرة الذاتية الكاملة
 * @property {string} linkedin - رابط LinkedIn
 * @property {string|null} github - رابط GitHub
 * @property {string[]} achievements - الإنجازات البارزة
 */

/**
 * @type {Object.<number, InstructorDetail>}
 * @description التفاصيل الكاملة لكل مدرب مرتبة بمعرّفه
 */
export const INSTRUCTOR_DETAILS = {};

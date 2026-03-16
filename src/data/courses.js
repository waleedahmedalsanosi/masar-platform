/**
 * @file courses.js
 * @description بيانات الكورسات المتاحة على منصة مسار
 *
 * يحتوي هذا الملف على:
 * - COURSES: قائمة الكورسات الأساسية مع بياناتها المختصرة
 * - COURSE_DETAILS: التفاصيل الكاملة لكل كورس (جدول، منهج، مراجعات)
 */

/**
 * @typedef {Object} Course
 * @property {number} id - المعرف الفريد للكورس
 * @property {string} title - عنوان الكورس
 * @property {string} instructor - اسم المدرب
 * @property {string|null} center - اسم المركز التدريبي (أو null إذا كان مستقلاً)
 * @property {string} category - تصنيف الكورس
 * @property {string} level - المستوى (Beginner / Intermediate / Advanced)
 * @property {number} price - السعر بالدولار
 * @property {number} rating - التقييم من 5
 * @property {number} students - عدد الطلاب المسجلين
 * @property {string} duration - مدة الكورس
 * @property {string} image - إيموجي يمثل الكورس
 * @property {string[]} tags - وسوم الكورس
 * @property {'online'|'in-person'|'hybrid'} mode - طريقة التدريس
 */

/** @type {Course[]} قائمة الكورسات المتاحة */
export const COURSES = [];

/**
 * @typedef {Object} CourseDetail
 * @property {string} startDate - تاريخ بدء الكورس
 * @property {string} enrollDeadline - آخر موعد للتسجيل
 * @property {Array<{day: string, time: string, type: string}>} schedule - جدول المحاضرات
 * @property {string} videoId - معرف فيديو اليوتيوب التعريفي
 * @property {string} about - وصف تفصيلي للكورس
 * @property {Array<{week: number, title: string, topics: string[]}>} curriculum - منهج الكورس الأسبوعي
 * @property {Array<{name: string, avatar: string, rating: number, date: string, text: string}>} reviews - مراجعات الطلاب
 */

/**
 * @type {Object.<number, CourseDetail>}
 * @description تفاصيل كل كورس مرتبة بمعرّفه
 */
export const COURSE_DETAILS = {};

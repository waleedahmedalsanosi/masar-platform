/**
 * @file centers.js
 * @description بيانات المراكز التدريبية المعتمدة على منصة مسار
 */

/**
 * @typedef {Object} Center
 * @property {number} id - المعرف الفريد
 * @property {string} name - اسم المركز
 * @property {string} slug - المعرف النصي للروابط
 * @property {string} tagline - الشعار
 * @property {number} courses - عدد الكورسات
 * @property {number} instructors - عدد المدربين
 * @property {number} students - إجمالي الطلاب
 * @property {number} rating - التقييم من 5
 * @property {number} founded - سنة التأسيس
 * @property {string} location - الموقع الجغرافي
 * @property {string[]} specialties - مجالات التخصص
 * @property {string} logo - اختصار الشعار
 * @property {string} color - اللون الرئيسي للعلامة التجارية
 */

/** @type {Center[]} قائمة المراكز التدريبية */
export const CENTERS = [];

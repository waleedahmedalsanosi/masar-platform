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
export const CENTERS = [
  { id: 1, name: "Code Academy Sudan", slug: "code-academy", tagline: "Where Sudanese Developers Begin", courses: 12, instructors: 8, students: 2400, rating: 4.8, founded: 2018, location: "Khartoum", specialties: ["Data Science", "Programming", "AI"], logo: "CA", color: "#6366f1" },
  { id: 2, name: "TechHub Khartoum", slug: "techhub", tagline: "Building Tomorrow's Tech Leaders", courses: 9, instructors: 6, students: 1800, rating: 4.9, founded: 2019, location: "Omdurman", specialties: ["Web Dev", "Mobile", "Cloud"], logo: "TH", color: "#06b6d4" },
  { id: 3, name: "DataMinds Institute", slug: "dataminds", tagline: "Turning Data into Decisions", courses: 7, instructors: 5, students: 1200, rating: 4.7, founded: 2020, location: "Khartoum North", specialties: ["Data Analysis", "BI", "SQL"], logo: "DM", color: "#8b5cf6" },
];

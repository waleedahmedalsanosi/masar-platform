/**
 * @file index.js
 * @description نقطة الدخول الموحدة لطبقة البيانات
 *
 * يُعيد تصدير جميع البيانات والثوابت من ملفاتها المستقلة
 * لتسهيل الاستيراد في باقي أجزاء التطبيق.
 *
 * @example
 * import { COURSES, INSTRUCTORS, CENTERS } from '../data';
 */

export { COURSES, COURSE_DETAILS } from './courses';
export { INSTRUCTORS, INSTRUCTOR_DETAILS } from './instructors';
export { CENTERS } from './centers';
export { STATS, FEATURES } from './constants';

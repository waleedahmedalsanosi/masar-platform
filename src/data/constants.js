/**
 * @file constants.js
 * @description الثوابت والبيانات الإحصائية لمنصة مسار
 */

/**
 * @typedef {Object} Stat
 * @property {string} label - وصف الإحصائية
 * @property {string} value - القيمة
 * @property {string} icon - الأيقونة
 */

/** @type {Stat[]} الإحصائيات الرئيسية للمنصة */
export const STATS = [
  { label: "Active Students", value: "12,000+", icon: "👨‍💻" },
  { label: "Courses Available", value: "150+", icon: "📚" },
  { label: "Training Centers", value: "25+", icon: "🏢" },
  { label: "Expert Instructors", value: "80+", icon: "🎓" },
];

/**
 * @typedef {Object} Feature
 * @property {string} icon - أيقونة الميزة
 * @property {string} title - عنوان الميزة
 * @property {string} desc - وصف الميزة
 */

/**
 * @typedef {Object} EnrollmentField
 * @property {string} id        - معرف الحقل الفريد
 * @property {string} label     - اسم الحقل بالإنجليزية
 * @property {string} icon      - أيقونة الحقل
 * @property {string} type      - نوع الحقل: text | tel | email | url | date | select | textarea
 * @property {boolean} locked   - إذا كان true لا يمكن حذفه (إلزامي دائماً)
 * @property {string} [placeholder] - نص placeholder
 * @property {string[]} [options]   - خيارات القائمة المنسدلة (للنوع select)
 */

/** @type {EnrollmentField[]} قائمة حقول التسجيل المتاحة */
export const ENROLLMENT_FIELDS = [
  { id: "fullName",       label: "Full Name",                   icon: "👤", type: "text",     locked: true,  placeholder: "e.g. Mohammed Ahmed Abdallah" },
  { id: "phone",          label: "Phone Number",                icon: "📱", type: "tel",      locked: true,  placeholder: "09xxxxxxxxx" },
  { id: "email",          label: "Email Address",               icon: "📧", type: "email",    locked: false, placeholder: "you@example.com" },
  { id: "nationalId",     label: "National ID",                 icon: "🪪", type: "text",     locked: false, placeholder: "Enter your national ID number" },
  { id: "dateOfBirth",    label: "Date of Birth",               icon: "🎂", type: "date",     locked: false },
  { id: "gender",         label: "Gender",                      icon: "👥", type: "select",   locked: false, options: ["Male", "Female", "Prefer not to say"] },
  { id: "city",           label: "City / Location",             icon: "📍", type: "text",     locked: false, placeholder: "e.g. Khartoum, Omdurman" },
  { id: "university",     label: "University / School",         icon: "🏫", type: "text",     locked: false, placeholder: "e.g. University of Khartoum" },
  { id: "specialization", label: "Specialization / Major",      icon: "🎓", type: "text",     locked: false, placeholder: "e.g. Computer Science, Engineering" },
  { id: "educationLevel", label: "Education Level",             icon: "📜", type: "select",   locked: false, options: ["High School", "Diploma", "Bachelor's", "Master's", "PhD", "Other"] },
  { id: "occupation",     label: "Occupation / Job Title",      icon: "💼", type: "text",     locked: false, placeholder: "e.g. Software Engineer, Student" },
  { id: "experience",     label: "Years of Experience",         icon: "⏳", type: "select",   locked: false, options: ["No experience", "Less than 1 year", "1–2 years", "3–5 years", "5+ years"] },
  { id: "linkedin",       label: "LinkedIn Profile",            icon: "🔗", type: "url",      locked: false, placeholder: "https://linkedin.com/in/yourprofile" },
  { id: "motivation",     label: "Why do you want to join?",    icon: "💬", type: "textarea", locked: false, placeholder: "Tell us why you're interested in this course..." },
  { id: "referral",       label: "How did you hear about us?",  icon: "📣", type: "text",     locked: false, placeholder: "e.g. Friend, social media, Google" },
  { id: "note",           label: "Additional Notes",            icon: "📝", type: "textarea", locked: false, placeholder: "Any questions or special requests..." },
];

/** @type {Feature[]} مميزات منصة مسار */
export const FEATURES = [
  { icon: "🎯", title: "Personalized Learning", desc: "Your dashboard adapts to your specialization and interests — get course recommendations tailored just for you." },
  { icon: "🏫", title: "Verified Training Centers", desc: "Every center on Masar is verified with full profiles, so you know exactly who you're learning from." },
  { icon: "🌍", title: "Your Own Space", desc: "Centers and instructors get a dedicated page with custom domain — build your brand, not just a listing." },
  { icon: "📈", title: "Career-Focused Tracks", desc: "Courses designed around real job market needs in Sudan: CS, Data Science, Programming, and more." },
  { icon: "🔍", title: "Total Transparency", desc: "Full course details, real student reviews, instructor credentials — no surprises." },
  { icon: "🤝", title: "Community & Network", desc: "Connect with peers, instructors, and industry professionals across Sudan's growing tech ecosystem." },
];

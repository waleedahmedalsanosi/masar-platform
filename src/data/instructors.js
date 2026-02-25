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
export const INSTRUCTORS = [
  { id: 1, name: "Ahmed Hassan", title: "Data Scientist", center: "Code Academy Sudan", courses: 4, students: 850, rating: 4.8, bio: "5+ years in data science, ex-Google", specialties: ["Python", "Machine Learning", "Statistics"], avatar: "AH" },
  { id: 2, name: "Sara Mohamed", title: "Full Stack Developer", center: "TechHub Khartoum", courses: 3, students: 620, rating: 4.9, bio: "Senior dev, built 30+ production apps", specialties: ["React", "Node.js", "Cloud"], avatar: "SM" },
  { id: 3, name: "Khalid Ibrahim", title: "ML Engineer", center: "Code Academy Sudan", courses: 2, students: 400, rating: 4.7, bio: "PhD candidate, AI research at U of K", specialties: ["TensorFlow", "Deep Learning", "NLP"], avatar: "KI" },
  { id: 4, name: "Amira Osman", title: "UX Designer", center: null, courses: 2, students: 510, rating: 4.6, bio: "Freelance designer with international clients", specialties: ["Figma", "UX Research", "Prototyping"], avatar: "AO" },
  { id: 5, name: "Omar Salih", title: "Database Architect", center: "DataMinds Institute", courses: 3, students: 780, rating: 4.5, bio: "10 years in enterprise database systems", specialties: ["SQL", "PostgreSQL", "Redis"], avatar: "OS" },
  { id: 6, name: "Fatima Al-Rashid", title: "Business Intelligence Analyst", center: "DataMinds Institute", courses: 2, students: 320, rating: 4.8, bio: "BI consultant for top Sudanese companies", specialties: ["Power BI", "Tableau", "DAX"], avatar: "FA" },
];

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
export const INSTRUCTOR_DETAILS = {
  1: { fullBio: "Ahmed Hassan is a data scientist with 5+ years of professional experience, previously at Google and currently leading the data team at a Khartoum-based fintech. He holds an MSc in Computer Science from University of Khartoum and has trained 850+ students.", linkedin: "linkedin.com/in/ahmed-hassan-ds", github: "github.com/ahmedhassan-ds", achievements: ["Ex-Google Data Scientist", "MSc CS — University of Khartoum", "850+ students trained", "4 courses on Masar"] },
  2: { fullBio: "Sara Mohamed is a senior full stack developer with 7 years of experience building production applications for clients in Sudan, UAE, and Germany. She runs Khartoum's largest developer meetup.", linkedin: "linkedin.com/in/sara-dev", github: "github.com/saramohamed-dev", achievements: ["7 years industry experience", "30+ production apps shipped", "Khartoum Dev Meetup founder", "3 courses on Masar"] },
  3: { fullBio: "Khalid Ibrahim is a PhD candidate in AI at the University of Khartoum, researching NLP for Arabic dialects. He has published 3 papers and collaborated with international research teams.", linkedin: "linkedin.com/in/khalid-ml", github: "github.com/khalid-ibrahim-ml", achievements: ["PhD candidate in AI — U of K", "3 published research papers", "NLP for Sudanese Arabic researcher", "2 courses on Masar"] },
  4: { fullBio: "Amira Osman is a freelance UX designer with 6 years of experience creating user-centered digital products for startups and NGOs across Sudan and East Africa.", linkedin: "linkedin.com/in/amira-ux", github: null, achievements: ["Google UX Design Certified", "6 years freelance experience", "Clients in Sudan & East Africa", "2 courses on Masar"] },
  5: { fullBio: "Omar Salih is a database architect with a decade of experience designing enterprise data systems for Sudanese banks, telecoms, and government institutions. Oracle and Microsoft certified.", linkedin: "linkedin.com/in/omar-db", github: "github.com/omar-salih", achievements: ["Oracle DB Certified", "Microsoft SQL Server Expert", "10 years enterprise experience", "3 courses on Masar"] },
  6: { fullBio: "Fatima Al-Rashid is a BI consultant who has delivered data transformation projects for Sudan's top corporations. She specializes in Power BI strategy and DAX.", linkedin: "linkedin.com/in/fatima-bi", github: null, achievements: ["BI Consultant — top Sudanese firms", "Microsoft Power BI Certified", "DAX expert & trainer", "2 courses on Masar"] },
};

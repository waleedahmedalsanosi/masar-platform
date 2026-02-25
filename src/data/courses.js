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
export const COURSES = [
  { id: 1, title: "Python for Data Science", instructor: "Ahmed Hassan", center: "Code Academy Sudan", category: "Data Science", level: "Beginner", price: 150, rating: 4.8, students: 320, duration: "8 weeks", image: "🐍", tags: ["Python", "Pandas", "NumPy"], mode: "online", meetLink: "https://zoom.us/j/123456789", groupLink: "https://chat.whatsapp.com/masar-python-ds" },
  { id: 2, title: "Full Stack Web Development", instructor: "Sara Mohamed", center: "TechHub Khartoum", category: "Programming", level: "Intermediate", price: 250, rating: 4.9, students: 210, duration: "12 weeks", image: "🌐", tags: ["React", "Node.js", "MongoDB"], mode: "online", meetLink: "https://meet.google.com/techhub-fullstack", groupLink: "https://t.me/masar_fullstack" },
  { id: 3, title: "Machine Learning Fundamentals", instructor: "Khalid Ibrahim", center: "Code Academy Sudan", category: "Data Science", level: "Advanced", price: 300, rating: 4.7, students: 180, duration: "10 weeks", image: "🤖", tags: ["ML", "TensorFlow", "Scikit-learn"], mode: "online", meetLink: "https://zoom.us/j/987654321", groupLink: "https://chat.whatsapp.com/masar-ml-course" },
  { id: 4, title: "UI/UX Design Principles", instructor: "Amira Osman", center: null, category: "Design", level: "Beginner", price: 120, rating: 4.6, students: 290, duration: "6 weeks", image: "🎨", tags: ["Figma", "Prototyping", "Design"], mode: "online", meetLink: "https://zoom.us/j/uxdesign456", groupLink: "https://t.me/masar_uxdesign" },
  { id: 5, title: "Database Design & SQL", instructor: "Omar Salih", center: "DataMinds Institute", category: "Computer Science", level: "Beginner", price: 100, rating: 4.5, students: 410, duration: "5 weeks", image: "🗄️", tags: ["SQL", "PostgreSQL", "Database"], mode: "in-person", location: { address: "DataMinds Institute, Street 15, Khartoum North", lat: 15.6031, lng: 32.5265, mapUrl: "https://maps.google.com/?q=15.6031,32.5265" } },
  { id: 6, title: "Data Visualization with Power BI", instructor: "Fatima Al-Rashid", center: "DataMinds Institute", category: "Data Science", level: "Intermediate", price: 180, rating: 4.8, students: 155, duration: "7 weeks", image: "📊", tags: ["Power BI", "DAX", "Analytics"], mode: "hybrid", meetLink: "https://zoom.us/j/powerbi789", groupLink: "https://chat.whatsapp.com/masar-powerbi", location: { address: "DataMinds Institute, Street 15, Khartoum North", lat: 15.6031, lng: 32.5265, mapUrl: "https://maps.google.com/?q=15.6031,32.5265" } },
  { id: 7, title: "Algorithms & Data Structures", instructor: "Yousif Abdalla", center: null, category: "Computer Science", level: "Advanced", price: 200, rating: 4.9, students: 140, duration: "9 weeks", image: "⚡", tags: ["Algorithms", "C++", "Problem Solving"], mode: "online", meetLink: "https://zoom.us/j/algo2025", groupLink: "https://t.me/masar_algorithms" },
  { id: 8, title: "Mobile App Development", instructor: "Nada Gamar", center: "TechHub Khartoum", category: "Programming", level: "Intermediate", price: 220, rating: 4.7, students: 175, duration: "10 weeks", image: "📱", tags: ["Flutter", "Dart", "Mobile"], mode: "in-person", location: { address: "TechHub Khartoum, Omdurman, Al-Morada St.", lat: 15.6445, lng: 32.4777, mapUrl: "https://maps.google.com/?q=15.6445,32.4777" } },
];

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
export const COURSE_DETAILS = {
  1: {
    startDate: "March 10, 2025", enrollDeadline: "March 7, 2025",
    schedule: [{ day: "Saturday", time: "10:00 AM – 12:00 PM", type: "Live Lecture" }, { day: "Tuesday", time: "06:00 PM – 07:30 PM", type: "Lab / Practice" }],
    videoId: "rfscVS0vtbw",
    about: "This course takes you from zero Python knowledge to building real data pipelines and analysis reports. Perfect for Sudanese students looking to enter the data industry, covering everything from syntax basics to advanced Pandas operations and data storytelling.",
    curriculum: [
      { week: 1, title: "Python Foundations", topics: ["Variables & types", "Control flow", "Functions"] },
      { week: 2, title: "Data Structures", topics: ["Lists, dicts, sets", "Comprehensions", "File I/O"] },
      { week: 3, title: "NumPy Essentials", topics: ["Arrays & math ops", "Broadcasting", "Random module"] },
      { week: 4, title: "Pandas Deep Dive", topics: ["DataFrames", "Groupby & pivot", "Merge & join"] },
      { week: 5, title: "Data Cleaning", topics: ["Missing values", "Outlier detection", "Type conversion"] },
      { week: 6, title: "Visualization", topics: ["Matplotlib", "Seaborn", "Plotly basics"] },
      { week: 7, title: "Exploratory Analysis", topics: ["EDA workflow", "Correlation", "Feature insights"] },
      { week: 8, title: "Capstone Project", topics: ["Real dataset", "Full report", "Presentation"] },
    ],
    reviews: [
      { name: "Reem Saad", avatar: "RS", rating: 5, date: "Jan 2025", text: "Best Python course I've ever taken. Ahmed explains everything clearly and the labs are super practical. Got a data analyst internship right after!" },
      { name: "Tariq Hassan", avatar: "TH", rating: 5, date: "Dec 2024", text: "The curriculum is very well structured. I had zero coding experience and now I can build full data reports. Highly recommended." },
      { name: "Lina Omar", avatar: "LO", rating: 4, date: "Dec 2024", text: "Great content and instructor. The only thing I'd improve is adding more real-world Sudanese datasets for practice." },
      { name: "Mustafa Ali", avatar: "MA", rating: 5, date: "Nov 2024", text: "Ahmed is incredibly patient and responsive. The WhatsApp group support was also a huge bonus." },
    ],
  },
  2: {
    startDate: "April 1, 2025", enrollDeadline: "March 28, 2025",
    schedule: [{ day: "Friday", time: "09:00 AM – 11:30 AM", type: "Live Lecture" }, { day: "Wednesday", time: "07:00 PM – 09:00 PM", type: "Project Review" }],
    videoId: "nu_pCVPKzTk",
    about: "A comprehensive full-stack bootcamp covering React on the frontend and Node.js/MongoDB on the backend. By the end you'll have deployed three production-grade applications and be ready for junior developer roles.",
    curriculum: [
      { week: 1, title: "HTML & CSS Mastery", topics: ["Semantic HTML", "Flexbox & Grid", "Responsive design"] },
      { week: 2, title: "JavaScript ES6+", topics: ["Arrow fns", "Promises", "Destructuring"] },
      { week: 3, title: "React Fundamentals", topics: ["Components", "State & props", "Hooks"] },
      { week: 4, title: "React Advanced", topics: ["Context API", "React Router", "Performance"] },
      { week: 5, title: "Node.js & Express", topics: ["REST APIs", "Middleware", "Auth with JWT"] },
      { week: 6, title: "MongoDB & Mongoose", topics: ["Schema design", "CRUD ops", "Aggregation"] },
      { week: 7, title: "Deployment", topics: ["Vercel/Railway", "CI/CD basics", "Docker intro"] },
      { week: 8, title: "Project 1: Blog Platform", topics: ["Full CRUD", "Auth flow", "Deployment"] },
      { week: 9, title: "Project 2: E-Commerce", topics: ["Cart system", "Payment mock", "Admin panel"] },
      { week: 10, title: "Project 3: Social App", topics: ["Real-time", "File uploads", "Final review"] },
      { week: 11, title: "Career Preparation", topics: ["Portfolio polish", "GitHub profile", "Interview prep"] },
      { week: 12, title: "Graduation & Demo Day", topics: ["Live presentations", "Feedback session", "Certificates"] },
    ],
    reviews: [
      { name: "Adam Khalil", avatar: "AK", rating: 5, date: "Feb 2025", text: "Sara is an exceptional teacher. The course structure is perfect — theory + immediate practice. I landed a job before the course even ended!" },
      { name: "Hiba Musa", avatar: "HM", rating: 5, date: "Jan 2025", text: "The projects are real and challenging. By week 6 I was already building things I'm proud to show employers." },
      { name: "Omar Fadl", avatar: "OF", rating: 4, date: "Dec 2024", text: "Very comprehensive. Some weeks are intense but that's what it takes. Sara and the TAs are always available to help." },
    ],
  },
  3: {
    startDate: "March 20, 2025", enrollDeadline: "March 17, 2025",
    schedule: [{ day: "Sunday", time: "05:00 PM – 07:30 PM", type: "Live Lecture" }, { day: "Thursday", time: "06:00 PM – 07:30 PM", type: "Lab / Coding" }],
    videoId: "GwIo3gDZCVQ",
    about: "A rigorous introduction to machine learning theory and practice. Covers supervised and unsupervised learning, model evaluation, and deployment basics using Python's top ML libraries.",
    curriculum: [
      { week: 1, title: "ML Foundations", topics: ["What is ML?", "Types of learning", "Math review"] },
      { week: 2, title: "Linear Models", topics: ["Linear regression", "Logistic regression", "Cost functions"] },
      { week: 3, title: "Decision Trees & Ensembles", topics: ["Decision trees", "Random Forest", "XGBoost"] },
      { week: 4, title: "Support Vector Machines", topics: ["SVM theory", "Kernels", "Hyperparameter tuning"] },
      { week: 5, title: "Unsupervised Learning", topics: ["K-Means", "DBSCAN", "PCA"] },
      { week: 6, title: "Neural Networks Intro", topics: ["Perceptrons", "Backprop", "Activation fns"] },
      { week: 7, title: "Deep Learning Basics", topics: ["CNN overview", "RNN overview", "Transfer learning"] },
      { week: 8, title: "Model Evaluation", topics: ["Cross-validation", "Metrics", "Bias-variance"] },
      { week: 9, title: "Feature Engineering", topics: ["Encoding", "Scaling", "Selection"] },
      { week: 10, title: "Capstone Project", topics: ["End-to-end pipeline", "Model deployment", "Presentation"] },
    ],
    reviews: [
      { name: "Salma Idris", avatar: "SI", rating: 5, date: "Feb 2025", text: "Khalid explains the math in a way that actually makes sense. I've tried other ML courses but this one clicked for me." },
      { name: "Yassir Nour", avatar: "YN", rating: 4, date: "Jan 2025", text: "Very thorough. The capstone project was a real confidence booster — I built a sentiment analysis model for Sudanese dialect!" },
    ],
  },
  4: { startDate: "March 15, 2025", enrollDeadline: "March 12, 2025", schedule: [{ day: "Saturday", time: "02:00 PM – 04:00 PM", type: "Live Lecture" }], videoId: "c9Wg6Cb_YlU", about: "Learn the full UX design process from research to high-fidelity prototypes. Hands-on with Figma throughout.", curriculum: [{ week: 1, title: "UX Fundamentals", topics: ["Design thinking", "User research", "Personas"] }, { week: 2, title: "Wireframing", topics: ["Sketching", "Lo-fi wireframes", "User flows"] }, { week: 3, title: "Figma Basics", topics: ["Components", "Auto-layout", "Styles"] }, { week: 4, title: "Hi-Fi Prototyping", topics: ["Visual design", "Interactions", "Animations"] }, { week: 5, title: "Usability Testing", topics: ["Test planning", "Conducting sessions", "Iteration"] }, { week: 6, title: "Portfolio Project", topics: ["Full case study", "Presentation", "Feedback"] }], reviews: [{ name: "Nour Babiker", avatar: "NB", rating: 5, date: "Jan 2025", text: "Amira's teaching style is incredible. My portfolio improved dramatically after this course." }, { name: "Ayman Osman", avatar: "AO2", rating: 4, date: "Dec 2024", text: "Great course for anyone wanting to break into tech without coding. Practical and industry-relevant." }] },
  5: { startDate: "April 5, 2025", enrollDeadline: "April 2, 2025", schedule: [{ day: "Monday", time: "07:00 PM – 09:00 PM", type: "Live Lecture" }, { day: "Thursday", time: "07:00 PM – 08:30 PM", type: "Lab" }], videoId: "HXV3zeQKqGY", about: "Master relational database design and SQL from ground up. Covers everything from basic queries to complex joins, stored procedures, and performance optimization.", curriculum: [{ week: 1, title: "Database Concepts", topics: ["Relational model", "ER diagrams", "Normalization"] }, { week: 2, title: "SQL Basics", topics: ["SELECT", "WHERE", "ORDER BY"] }, { week: 3, title: "Joins & Subqueries", topics: ["INNER/OUTER joins", "Subqueries", "CTEs"] }, { week: 4, title: "Data Manipulation", topics: ["INSERT/UPDATE/DELETE", "Transactions", "Constraints"] }, { week: 5, title: "Performance & Indexing", topics: ["Query optimization", "Indexes", "Execution plans"] }], reviews: [{ name: "Ibrahim Salih", avatar: "IS", rating: 5, date: "Feb 2025", text: "Omar knows databases deeply. The real-world examples made everything stick. Now I can write complex queries confidently." }, { name: "Duaa Mahdi", avatar: "DM2", rating: 4, date: "Jan 2025", text: "Very structured course. Perfect pacing for beginners. The lab exercises really reinforce the theory." }] },
  6: { startDate: "March 25, 2025", enrollDeadline: "March 22, 2025", schedule: [{ day: "Sunday", time: "10:00 AM – 12:00 PM", type: "Live Workshop" }], videoId: "yuwKcZ2jjhE", about: "Transform raw data into powerful dashboards and business insights using Power BI. Covers DAX, data modeling, and storytelling for business stakeholders.", curriculum: [{ week: 1, title: "Power BI Interface", topics: ["Data import", "Navigation", "Report canvas"] }, { week: 2, title: "Data Modeling", topics: ["Relationships", "Star schema", "Calculated columns"] }, { week: 3, title: "DAX Fundamentals", topics: ["Measures", "CALCULATE", "Time intelligence"] }, { week: 4, title: "Visualizations", topics: ["Chart types", "Slicers", "Drill-through"] }, { week: 5, title: "Advanced DAX", topics: ["RANKX", "TOPN", "Dynamic titles"] }, { week: 6, title: "Publishing & Sharing", topics: ["Power BI Service", "Row-level security", "Dashboards"] }, { week: 7, title: "Capstone Project", topics: ["Business dataset", "Full dashboard", "Presentation"] }], reviews: [{ name: "Widad Ahmad", avatar: "WA", rating: 5, date: "Jan 2025", text: "Fatima makes Power BI feel easy. I went from zero to building executive dashboards in 7 weeks!" }, { name: "Kareem Bakri", avatar: "KB", rating: 5, date: "Dec 2024", text: "The DAX sessions are gold. Fatima explains the logic behind every formula — not just how to write it." }] },
  7: { startDate: "April 10, 2025", enrollDeadline: "April 7, 2025", schedule: [{ day: "Friday", time: "04:00 PM – 06:30 PM", type: "Live Lecture" }, { day: "Tuesday", time: "05:00 PM – 06:30 PM", type: "Problem Solving" }], videoId: "8hly31xKli0", about: "A serious algorithms course for competitive programmers and software engineering interview prep. Covers all major data structures and algorithm design paradigms.", curriculum: [{ week: 1, title: "Complexity Analysis", topics: ["Big-O", "Space complexity", "Amortized"] }, { week: 2, title: "Arrays & Strings", topics: ["Two pointers", "Sliding window", "String manipulation"] }, { week: 3, title: "Linked Lists & Stacks", topics: ["Singly/doubly linked", "Stack applications", "Queue with stacks"] }, { week: 4, title: "Trees & Recursion", topics: ["Binary trees", "BST", "DFS/BFS"] }, { week: 5, title: "Heaps", topics: ["Min/max heap", "Heap sort", "k-th element"] }, { week: 6, title: "Graphs", topics: ["Representation", "Dijkstra", "Topological sort"] }, { week: 7, title: "Dynamic Programming", topics: ["Memoization", "Tabulation", "Classic DP"] }, { week: 8, title: "Greedy & Backtracking", topics: ["Greedy patterns", "Backtracking", "N-Queens"] }, { week: 9, title: "Mock Interviews", topics: ["Live sessions", "Code review", "Feedback"] }], reviews: [{ name: "Faris Elamin", avatar: "FE", rating: 5, date: "Feb 2025", text: "Yousif is brilliant. I passed my Amazon OA after this course." }, { name: "Sana Babiker", avatar: "SB", rating: 5, date: "Jan 2025", text: "Hardest but most rewarding course I've taken. The problem-solving sessions are where the real learning happens." }] },
  8: { startDate: "April 15, 2025", enrollDeadline: "April 12, 2025", schedule: [{ day: "Saturday", time: "11:00 AM – 01:00 PM", type: "Live Lecture" }, { day: "Wednesday", time: "06:00 PM – 07:30 PM", type: "Code Review" }], videoId: "VPvVD8t02U8", about: "Build beautiful cross-platform mobile apps for iOS and Android using Flutter and Dart. From widgets to state management to app store deployment.", curriculum: [{ week: 1, title: "Dart Language", topics: ["Syntax", "OOP in Dart", "Async/await"] }, { week: 2, title: "Flutter Basics", topics: ["Widgets", "Layout", "Hot reload"] }, { week: 3, title: "Navigation", topics: ["Push/pop", "Named routes", "Deep linking"] }, { week: 4, title: "State Management", topics: ["setState", "Provider", "Riverpod"] }, { week: 5, title: "Firebase", topics: ["Auth", "Firestore", "Storage"] }, { week: 6, title: "APIs & Networking", topics: ["HTTP package", "JSON parsing", "Error handling"] }, { week: 7, title: "Publishing", topics: ["Play Store", "App Store", "Signing"] }, { week: 8, title: "App 1: Task Manager", topics: ["CRUD", "Local storage", "Polish"] }, { week: 9, title: "App 2: Chat App", topics: ["Real-time", "Firebase", "Final demo"] }, { week: 10, title: "Demo Day", topics: ["Live presentation", "Peer review", "Certificates"] }], reviews: [{ name: "Zeinab Musa", avatar: "ZM", rating: 5, date: "Feb 2025", text: "Nada is a fantastic teacher. I published my first app to the Play Store during week 8!" }, { name: "Haitham Samir", avatar: "HS", rating: 4, date: "Jan 2025", text: "The Flutter content is excellent. Great course overall." }] },
};

/**
 * Production server — يخدم React build + json-server على نفس البورت
 * يعمل مثل بيئة الـ dev تماماً:
 *   - GET /api/users      → json-server
 *   - GET /               → React SPA
 */

const jsonServer = require("json-server");
const path       = require("path");

const app        = jsonServer.create();
const router     = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults({
  static: path.join(__dirname, "dist"),   // تقديم ملفات React المبنية
  noCors: false,
});

// Middlewares عامة (cors, body-parser, etc.)
app.use(middlewares);

// كل طلبات /api/* تذهب إلى json-server (نفس سلوك Vite proxy في dev)
app.use("/api", (req, _res, next) => {
  // أزل بادئة /api قبل تمريرها للـ router
  req.url = req.url.replace(/^\/api/, "") || "/";
  next();
}, router);

// أي مسار آخر → أرجع index.html عشان React Router يشتغل
app.use((_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Masar Platform running → http://localhost:${PORT}`);
});

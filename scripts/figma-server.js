/**
 * figma-server.js
 * سيرفر محلي يخدم الصور للـ Figma Plugin
 * يعمل على http://localhost:3333
 */

const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3333;
const SCREENSHOTS_DIR = path.join(__dirname, "..", "figma-exports");

const server = http.createServer((req, res) => {
  // CORS - لازم عشان Figma Plugin يقدر يطلب
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // ── GET /screenshots → قائمة بكل الصور كـ base64 ──
  if (req.url === "/screenshots") {
    try {
      const files = fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith(".png"));

      if (files.length === 0) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "لا توجد صور. شغّل take-screenshots.js أولاً" }));
        return;
      }

      const screenshots = files.map((filename) => {
        const filepath = path.join(SCREENSHOTS_DIR, filename);
        const buffer = fs.readFileSync(filepath);
        return {
          name: filename.replace(".png", ""),
          imageData: Array.from(buffer), // Uint8Array-compatible
          width: 1440,
          height: 900,
        };
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(screenshots));

      console.log(`📤 تم إرسال ${screenshots.length} صورة للـ Figma Plugin`);
    } catch (err) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // ── GET /status → حالة السيرفر ──
  if (req.url === "/status") {
    const files = fs.existsSync(SCREENSHOTS_DIR)
      ? fs.readdirSync(SCREENSHOTS_DIR).filter((f) => f.endsWith(".png"))
      : [];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", screenshots: files.length }));
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

server.listen(PORT, () => {
  console.log(`✅ السيرفر يعمل على http://localhost:${PORT}`);
  console.log(`📂 يخدم الصور من: figma-exports/`);
  console.log(`\n⏳ في انتظار الـ Figma Plugin...`);
  console.log(`   (افتح Figma وشغّل الـ Plugin)`);
});

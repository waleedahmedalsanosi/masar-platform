/**
 * take-screenshots.js
 * يصور كل صفحات منصة مسار باستخدام Puppeteer
 */

const puppeteer = require("puppeteer-core");
const fs = require("fs");
const path = require("path");

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const BASE_URL = "http://localhost:5173";
const OUTPUT_DIR = path.join(__dirname, "..", "figma-exports");

// ── مستخدمون وهميون لكل دور ──────────────────────────────────────────────────
const MOCK_USERS = {
  student:    { id: "mock-s", email: "sara@masar.com",    name: "سارة عبدالله", role: "student"    },
  instructor: { id: "mock-i", email: "ahmed@masar.com",   name: "أحمد محمد",    role: "instructor" },
  marketer:   { id: "mock-m", email: "osama@masar.com",   name: "أسامة خالد",   role: "marketer"   },
  admin:      { id: "mock-a", email: "admin@masar.com",   name: "المدير العام",  role: "admin"      },
  center:     { id: "mock-c", email: "center@masar.com",  name: "مدير المركز",  role: "center"     },
};

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// ── تحضير الصفحة بالمستخدم الصح وإعادة التحميل ──────────────────────────────
async function preparePage(page, userKey) {
  // أحدّث localStorage
  await page.goto(BASE_URL, { waitUntil: "domcontentloaded" });
  await page.evaluate((user) => {
    localStorage.clear();
    if (user) localStorage.setItem("masar_user", JSON.stringify(user));
  }, userKey ? MOCK_USERS[userKey] : null);

  // أعد التحميل وانتظر حتى يكتمل React render
  await page.goto(BASE_URL, { waitUntil: "networkidle0", timeout: 30000 });
  await wait(2000); // وقت إضافي لـ React
}

// ── تنقل باستخدام Puppeteer click ──────────────────────────────────────────
async function goToPage(page, pageName) {
  await page.evaluate((target) => {
    // استخدم React state مباشرةً من window إذا كان متاحاً
    if (window.__masar_setPage) {
      window.__masar_setPage(target);
      return;
    }

    // نقر nav links
    const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
    const dashTargets = ["dashboard","inst-dashboard","center-dashboard","marketer-dashboard","admin-dashboard"];

    if (target === "home") {
      const logo = document.querySelector(".nav-logo");
      if (logo) { logo.click(); return; }
    }

    if (target === "courses")     { navLinks[1]?.click(); return; }
    if (target === "instructors") { navLinks[2]?.click(); return; }
    if (target === "centers")     { navLinks[3]?.click(); return; }

    if (dashTargets.includes(target)) {
      // آخر رابط في nav-links هو الداشبورد
      navLinks[navLinks.length - 1]?.click();
      return;
    }

    if (target === "login") {
      // زر تسجيل الدخول
      const btns = Array.from(document.querySelectorAll(".nav-actions button"));
      btns.find(b => b.textContent.match(/sign.?in|دخول|login/i))?.click();
      return;
    }

    if (target === "register") {
      const btns = Array.from(document.querySelectorAll(".nav-actions button"));
      // زر الانضمام (الثاني)
      btns[btns.length - 1]?.click();
      return;
    }
  }, pageName);

  await wait(2500);
}

// ── الدالة الرئيسية ────────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log("🚀 بدء تصوير الشاشات...\n");

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: CHROME,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-web-security",
           "--disable-features=VizDisplayCompositor"],
    defaultViewport: { width: 1440, height: 900 },
  });

  const page = await browser.newPage();

  // ── الصفحات العامة (بدون مستخدم) ─────────────────────────────────────────
  await preparePage(page, null);

  const publicScreens = [
    { name: "01 - الصفحة الرئيسية", page: "home"        },
    { name: "02 - الكورسات",         page: "courses"     },
    { name: "03 - المدربون",          page: "instructors" },
    { name: "04 - المراكز",           page: "centers"     },
    { name: "05 - تسجيل الدخول",      page: "login"       },
    { name: "06 - إنشاء حساب",        page: "register"    },
  ];

  for (const screen of publicScreens) {
    if (screen.page !== "home") {
      await goToPage(page, screen.page);
    }
    const filepath = path.join(OUTPUT_DIR, `${screen.name}.png`);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`  ✓ ${screen.name}`);
  }

  // ── لوحات التحكم (بمستخدمين مختلفين) ─────────────────────────────────────
  const dashboardScreens = [
    { name: "07 - داشبورد الطالب",  user: "student",    page: "dashboard"          },
    { name: "08 - داشبورد المدرب",  user: "instructor", page: "inst-dashboard"     },
    { name: "09 - داشبورد الأدمن",  user: "admin",      page: "admin-dashboard"    },
    { name: "10 - داشبورد المسوّق", user: "marketer",   page: "marketer-dashboard" },
    { name: "11 - داشبورد المركز",  user: "center",     page: "center-dashboard"   },
  ];

  for (const screen of dashboardScreens) {
    await preparePage(page, screen.user);
    await goToPage(page, screen.page);
    const filepath = path.join(OUTPUT_DIR, `${screen.name}.png`);
    await page.screenshot({ path: filepath, fullPage: false });
    console.log(`  ✓ ${screen.name}`);
  }

  await browser.close();

  // طباعة أحجام الملفات
  console.log("\n📏 أحجام الصور:");
  fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith(".png")).forEach(f => {
    const size = Math.round(fs.statSync(path.join(OUTPUT_DIR, f)).size / 1024);
    console.log(`   ${size}KB — ${f}`);
  });

  console.log(`\n✅ تم! ${fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith(".png")).length} شاشة محفوظة`);
  console.log(`🔜 الخطوة التالية: node scripts/figma-server.js`);
}

main().catch((err) => {
  console.error("❌ خطأ:", err.message);
  process.exit(1);
});

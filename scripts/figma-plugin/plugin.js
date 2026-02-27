/**
 * plugin.js — Masar Platform Importer
 * يعمل داخل Figma ويستورد شاشات المنصة
 */

figma.showUI(__html__, { width: 360, height: 240, title: "Masar Platform Importer" });

// ── إعدادات التخطيط ──────────────────────────────────────────────────────────
const FRAME_WIDTH   = 1440;
const FRAME_HEIGHT  = 900;
const GAP           = 80;   // مسافة بين الـ frames
const FRAMES_PER_ROW = 3;   // عدد الـ frames في الصف

figma.ui.onmessage = async (msg) => {
  if (msg.type !== "import-screens") return;

  const { screenshots } = msg;
  const total = screenshots.length;

  // ── أنشئ صفحة جديدة ──────────────────────────────────────────────────────
  const newPage = figma.createPage();
  newPage.name = "Masar Platform UI";
  await figma.setCurrentPageAsync(newPage);

  // ── أنشئ section للتنظيم ─────────────────────────────────────────────────
  const section = figma.createSection();
  section.name = "🎨 Masar Platform — All Screens";
  section.resizeWithoutConstraints(
    FRAMES_PER_ROW * (FRAME_WIDTH + GAP) - GAP + 80,
    Math.ceil(total / FRAMES_PER_ROW) * (FRAME_HEIGHT + GAP) - GAP + 80
  );
  section.x = 0;
  section.y = 0;
  newPage.appendChild(section);

  // ── استورد كل صورة كـ frame ──────────────────────────────────────────────
  for (let i = 0; i < total; i++) {
    const { name, imageData } = screenshots[i];

    figma.ui.postMessage({ type: "progress", current: i + 1, total, name });

    try {
      // أنشئ الصورة
      const uint8arr = new Uint8Array(imageData);
      const imageHash = figma.createImage(uint8arr).hash;

      // أنشئ الـ frame
      const frame = figma.createFrame();
      frame.name = name;
      frame.resize(FRAME_WIDTH, FRAME_HEIGHT);

      // تحديد الموضع في الشبكة
      const col = i % FRAMES_PER_ROW;
      const row = Math.floor(i / FRAMES_PER_ROW);
      frame.x = 40 + col * (FRAME_WIDTH + GAP);
      frame.y = 40 + row * (FRAME_HEIGHT + GAP);

      // ضع الصورة كـ background fill
      frame.fills = [
        {
          type: "IMAGE",
          imageHash,
          scaleMode: "FILL",
          opacity: 1,
        },
      ];

      // أضف label نصي فوق الـ frame
      const label = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      label.fontName = { family: "Inter", style: "Bold" };
      label.characters = name;
      label.fontSize = 24;
      label.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.1, b: 0.1 } }];
      label.x = frame.x;
      label.y = frame.y - 36;
      newPage.appendChild(label);

      section.appendChild(frame);
    } catch (err) {
      console.error(`خطأ في استيراد "${name}":`, err);
    }
  }

  // ── تكبير الـ viewport لعرض كل الـ frames ────────────────────────────────
  figma.viewport.scrollAndZoomIntoView(newPage.children);

  figma.ui.postMessage({ type: "done", total });
};

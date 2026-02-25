/**
 * @file InstructorDashboard.jsx
 * @description لوحة تحكم المدرب
 *
 * لوحة تحكم شاملة للمدربين تتضمن:
 * - إحصائيات عامة (الطلاب، الإيرادات، التقييم، الكورسات)
 * - إدارة الكورسات: عرض، تعديل، مراجعة طلبات التسجيل
 * - إدارة طلبات الطلاب (قبول / رفض)
 * - قسم الأسئلة والأجوبة (Q&A inbox)
 * - إضافة الكورس جديد عبر AddCourseModal
 * - تعديل الكورس موجود عبر EditCourseModal
 *
 * البيانات محفوظة في db.json عبر json-server.
 */

import { useState, useEffect } from "react";
import { api } from "../services/api";
import AddCourseModal from "../modals/AddCourseModal";
import EditCourseModal from "../modals/EditCourseModal";
import CourseReviewModal from "../modals/CourseReviewModal";
import AssignMarketerModal from "../modals/AssignMarketerModal";

function InstructorDashboard({ user, setPage }) {
  const instructorId = user?.id || 1;

  const [activeTab, setActiveTab]     = useState("overview");
  const [courses, setCourses]         = useState([]);
  const [requests, setRequests]       = useState([]);
  const [qaItems, setQaItems]         = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [replyInputs, setReplyInputs] = useState({});
  const [reqFilter, setReqFilter]     = useState("all");
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editCourse, setEditCourse]   = useState(null);
  const [showAssignMarketer, setShowAssignMarketer] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const [copiedLink, setCopiedLink]   = useState("");

  // ── تحميل البيانات عند الفتح ──────────────────────────
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [c, r, q, a] = await Promise.all([
          api.getCourses(instructorId),
          api.getRequests(instructorId),
          api.getQA(instructorId),
          api.getMarketerAssignments(instructorId),
        ]);
        setCourses(c);
        setRequests(r);
        setQaItems(q);
        setAssignments(a);
      } catch {
        // json-server غير مشغّل — اعرض رسالة
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [instructorId]);

  const name          = user?.name || "Ahmed Hassan";
  const initials      = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const pendingCount  = requests.filter(r => r.status === "pending").length;
  const unansweredCount = qaItems.filter(q => !q.answer).length;
  const totalStudents = courses.filter(c => c.status === "active").reduce((s, c) => s + (c.students || 0), 0);
  const totalRevenue  = courses.reduce((s, c) => s + (c.revenue || 0), 0);

  // ── إجراءات الطلبات ──────────────────────────────────
  const handleRequestAction = async (id, action) => {
    await api.updateRequest(id, { status: action });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  // ── إجراءات Q&A ──────────────────────────────────────
  const handleReply = async (id) => {
    const text = replyInputs[id];
    if (!text?.trim()) return;
    await api.replyQA(id, text);
    setQaItems(prev => prev.map(q => q.id === id ? { ...q, answer: text } : q));
    setReplyInputs(prev => ({ ...prev, [id]: "" }));
  };

  // ── إضافة كورس جديد ──────────────────────────────────
  const handleAddCourse = async (formData) => {
    const newCourse = await api.createCourse({
      instructorId,
      title:            formData.title,
      image:            formData.image,
      category:         formData.category,
      level:            formData.level,
      mode:             formData.mode,
      price:            Number(formData.price),
      status:           "draft",
      students:         0,
      rating:           0,
      revenue:          0,
      startDate:        formData.startDate || "TBD",
      duration:         formData.duration  || "",
      description:      formData.description,
      tags:             formData.tags,
      enrollmentFields: formData.enrollmentFields,
      meetLink:         formData.meetLink  || "",
      groupLink:        formData.groupLink || "",
      location:         formData.location  || "",
      scheduleDays:     formData.scheduleDays,
      weeks:            formData.weeks,
    });
    setCourses(prev => [...prev, newCourse]);
    setShowAddCourse(false);
    setActiveTab("courses");
  };

  // ── تعديل كورس ───────────────────────────────────────
  const handleEditCourse = async (updated) => {
    await api.updateCourse(updated.id, updated);
    setCourses(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
    setEditCourse(null);
  };

  // ── نشر كورس ─────────────────────────────────────────
  const handlePublish = async (courseId) => {
    await api.updateCourse(courseId, { status: "active" });
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: "active" } : c));
  };

  // ── إجراءات المسوقين ──────────────────────────────────
  const handleAssignMarketer = (newAssignment) => {
    setAssignments(prev => [...prev, newAssignment]);
    setShowAssignMarketer(false);
  };

  const handleRemoveAssignment = async (id) => {
    await api.deleteAssignment(id);
    setAssignments(prev => prev.filter(a => a.id !== id));
  };

  const copyMarketerLink = (text, key) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedLink(key);
    setTimeout(() => setCopiedLink(""), 2000);
  };

  const tabs = [
    { key: "overview",   label: "Overview",   icon: "📊" },
    { key: "courses",    label: "My Courses", icon: "📚" },
    { key: "requests",   label: "Requests",   icon: "📥", badge: pendingCount    || null },
    { key: "qa",         label: "Q&A Inbox",  icon: "💬", badge: unansweredCount || null },
    { key: "marketers",  label: "Marketers",  icon: "📢", badge: assignments.length || null },
    { key: "profile",    label: "My Profile", icon: "👤" },
  ];

  // ── Loading state ─────────────────────────────────────
  if (loading) return (
    <div className="inst-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem", animation: "spin 1s linear infinite" }}>⏳</div>
        <div>Loading dashboard...</div>
        <div style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}>Make sure the server is running: <code>npm run start</code></div>
      </div>
    </div>
  );

  return (
    <div className="inst-dash">
      {showAddCourse      && <AddCourseModal onClose={() => setShowAddCourse(false)} onSave={handleAddCourse} />}
      {editCourse         && <EditCourseModal course={editCourse} onClose={() => setEditCourse(null)} onSave={handleEditCourse} />}
      {showAssignMarketer && <AssignMarketerModal courses={courses} onClose={() => setShowAssignMarketer(false)} onSave={handleAssignMarketer} />}

      {/* Tab bar */}
      <div className="inst-topbar">
        {tabs.map(t => (
          <div key={t.key} className={`inst-tab ${activeTab === t.key ? "active" : ""}`} onClick={() => setActiveTab(t.key)}>
            <span>{t.icon}</span> {t.label}
            {t.badge && <span className="tab-badge">{t.badge}</span>}
          </div>
        ))}
      </div>

      <div className="inst-content">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">Welcome back, {name.split(" ")[0]} 👋</div>
                <div className="inst-page-sub">Here's what's happening with your courses today</div>
              </div>
              <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={() => setShowAddCourse(true)}>
                + Add New Course
              </button>
            </div>

            <div className="ov-stats">
              {[
                { icon: "👥", val: totalStudents.toLocaleString(), lbl: "Total Students",  trend: "↑ 12 this week",    color: "#6366f1" },
                { icon: "📚", val: courses.length,                 lbl: "Courses",         trend: `${courses.filter(c => c.status === "active").length} active · ${courses.filter(c => c.status === "draft").length} draft`, color: "#06b6d4" },
                { icon: "⭐", val: "4.75",                         lbl: "Avg Rating",      trend: "Based on 42 reviews", color: "#fbbf24" },
                { icon: "💰", val: `SDG ${totalRevenue.toLocaleString()}`, lbl: "Total Revenue", trend: "↑ 8% this month", color: "#22c55e" },
              ].map(s => (
                <div key={s.lbl} className="ov-stat-card">
                  <div className="ov-stat-glow" style={{ background: s.color }} />
                  <div className="ov-stat-icon">{s.icon}</div>
                  <div className="ov-stat-val" style={{ background: `linear-gradient(135deg,${s.color},white)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.val}</div>
                  <div className="ov-stat-lbl">{s.lbl}</div>
                  <div className="ov-stat-trend">{s.trend}</div>
                </div>
              ))}
            </div>

            <div className="ov-grid">
              <div className="ov-card">
                <div className="ov-card-hd">
                  📚 Your Courses
                  <span className="ov-see-all" onClick={() => setActiveTab("courses")}>Manage all →</span>
                </div>
                <div className="ov-card-bd">
                  {courses.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>No courses yet. Add your first course!</div>}
                  {courses.map(c => (
                    <div key={c.id} className="ov-course-row">
                      <span className="ov-course-icon">{c.image}</span>
                      <div style={{ flex: 1 }}>
                        <div className="ov-course-name">{c.title}</div>
                        <div className="ov-course-students">{c.students} students · {c.rating > 0 ? `⭐ ${c.rating}` : "No ratings yet"}</div>
                      </div>
                      <span className={`ov-course-status status-${c.status}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ov-card">
                <div className="ov-card-hd">
                  📥 Recent Requests
                  {pendingCount > 0 && <span className="ov-see-all" onClick={() => setActiveTab("requests")}>{pendingCount} pending →</span>}
                </div>
                <div className="ov-card-bd">
                  {requests.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>No enrollment requests yet.</div>}
                  {requests.slice(0, 4).map(r => (
                    <div key={r.id} className="ov-req-row">
                      {r.status === "pending" && <div className="ov-req-dot" />}
                      <div className="ov-req-avatar">{r.avatar || r.name?.slice(0, 2).toUpperCase()}</div>
                      <div style={{ flex: 1 }}>
                        <div className="ov-req-name">{r.name}</div>
                        <div className="ov-req-course">{r.course}</div>
                      </div>
                      <div>
                        <div className="ov-req-time">{r.time}</div>
                        <div style={{ textAlign: "right", marginTop: "0.2rem" }}>
                          <span className={`req-status ${r.status}`}>{r.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MY COURSES ── */}
        {activeTab === "courses" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">My Courses</div>
                <div className="inst-page-sub">{courses.length} courses · {courses.filter(c => c.status === "active").length} active</div>
              </div>
              <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={() => setShowAddCourse(true)}>
                + Add New Course
              </button>
            </div>
            <div className="courses-mgmt">
              {courses.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📚</div>
                  <div>No courses yet. Add your first course to get started!</div>
                </div>
              )}
              {courses.map(c => (
                <div key={c.id} className="mgmt-course-card">
                  <span className="mgmt-course-emoji">{c.image}</span>
                  <div className="mgmt-course-info">
                    <div className="mgmt-course-name">{c.title}</div>
                    <div className="mgmt-course-meta">
                      <span>📅 {c.startDate}</span>
                      <span>💰 SDG {((c.price || 0) * 350).toLocaleString()} / student</span>
                      <span className={`ov-course-status status-${c.status}`}>{c.status}</span>
                    </div>
                    {c.enrollmentFields && (
                      <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "0.25rem" }}>
                        📋 {c.enrollmentFields.length} enrollment fields · {c.enrollmentFields.filter(f => f.required).length} required
                      </div>
                    )}
                    <div className="mgmt-course-stats">
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{c.students}</div><div className="mgmt-stat-lbl">Students</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{c.rating > 0 ? c.rating : "—"}</div><div className="mgmt-stat-lbl">Rating</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val" style={{ color: "var(--cyan)" }}>{c.revenue > 0 ? `SDG ${c.revenue.toLocaleString()}` : "—"}</div><div className="mgmt-stat-lbl">Revenue</div></div>
                    </div>
                  </div>
                  <div className="mgmt-actions">
                    <button className="mgmt-btn mgmt-btn-edit" onClick={() => setEditCourse(c)}>✏ Edit</button>
                    {c.id <= 8 && <button className="mgmt-btn mgmt-btn-view" onClick={() => setPage("course-" + c.id)}>👁 View</button>}
                    {c.status === "draft" && (
                      <button className="mgmt-btn" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", color: "#22c55e" }}
                        onClick={() => handlePublish(c.id)}>
                        🚀 Publish
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── REQUESTS ── */}
        {activeTab === "requests" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">Enrollment Requests</div>
                <div className="inst-page-sub">
                  {pendingCount} pending · {requests.filter(r => r.status === "accepted").length} accepted · {requests.filter(r => r.status === "rejected").length} rejected
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["all", "pending", "accepted", "rejected"].map(f => (
                  <button key={f} className={`filter-btn ${reqFilter === f ? "active" : ""}`} style={{ fontSize: "0.78rem", padding: "0.35rem 0.875rem" }} onClick={() => setReqFilter(f)}>
                    {f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="requests-list">
              {requests.filter(r => reqFilter === "all" || r.status === reqFilter).length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📥</div>
                  <div>No {reqFilter === "all" ? "" : reqFilter} requests yet.</div>
                </div>
              )}
              {requests.filter(r => reqFilter === "all" || r.status === reqFilter).map(r => (
                <div key={r.id} className="req-card">
                  <div className="req-avatar">{r.avatar || r.name?.slice(0, 2).toUpperCase()}</div>
                  <div className="req-info">
                    <div className="req-name">{r.name}</div>
                    <div className="req-course-name">{r.course}</div>
                    <div className="req-details">
                      📞 {r.phone} &nbsp;·&nbsp; 📧 {r.email} &nbsp;·&nbsp;
                      <span className="req-payment-badge">
                        {r.payment === "bank" ? "🏦 Bank Transfer" : "📱 Mobile Money"} · SDG {((r.amount || 0) * 350).toLocaleString()}
                      </span>
                    </div>
                    {/* إظهار البيانات الإضافية المحفوظة */}
                    {r.fields && Object.keys(r.fields).filter(k => !["fullName","phone","email"].includes(k) && r.fields[k]).length > 0 && (
                      <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {Object.entries(r.fields).filter(([k, v]) => !["fullName","phone","email"].includes(k) && v).map(([k, v]) => (
                          <span key={k} style={{ fontSize: "0.72rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 5, padding: "0.15rem 0.5rem", color: "var(--text2)" }}>
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="req-time">{r.time}</div>
                    {r.status === "pending"
                      ? <div className="req-actions" style={{ marginTop: "0.5rem" }}>
                          <button className="req-btn-accept" onClick={() => handleRequestAction(r.id, "accepted")}>✓ Accept</button>
                          <button className="req-btn-reject" onClick={() => handleRequestAction(r.id, "rejected")}>✕ Reject</button>
                        </div>
                      : <span className={`req-status ${r.status}`} style={{ display: "inline-block", marginTop: "0.5rem" }}>
                          {r.status === "accepted" ? "✓ Accepted" : "✕ Rejected"}
                        </span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Q&A INBOX ── */}
        {activeTab === "qa" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">Q&A Inbox</div>
                <div className="inst-page-sub">{unansweredCount} unanswered · {qaItems.filter(q => q.answer).length} answered</div>
              </div>
            </div>
            <div className="iqa-list">
              {qaItems.map(q => (
                <div key={q.id} className={`iqa-card ${q.answer ? "answered" : ""}`}>
                  <div className="iqa-header">
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "0.7rem", color: "white", flexShrink: 0 }}>
                      {q.anon ? "?" : q.sender[0] + (q.sender.split(" ")[1]?.[0] || "")}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{q.anon ? "Anonymous" : q.sender}</div>
                      <div className="iqa-from">re: <span className="iqa-course-tag">{q.course}</span></div>
                    </div>
                    <div className="iqa-time">{q.time}</div>
                  </div>
                  <div className="iqa-question">"{q.question}"</div>

                  {q.answer ? (
                    <div className="iqa-reply-area">
                      <div className="iqa-reply-label">✓ Your reply:</div>
                      <div className="iqa-answer-text">{q.answer}</div>
                    </div>
                  ) : (
                    <div className="iqa-reply-area">
                      <div className="iqa-reply-label">Reply to this question:</div>
                      <textarea
                        className="iqa-reply-input"
                        rows={2}
                        placeholder="Write your answer here..."
                        value={replyInputs[q.id] || ""}
                        onChange={e => setReplyInputs(prev => ({ ...prev, [q.id]: e.target.value }))}
                      />
                      <div className="iqa-reply-footer">
                        <button className="btn btn-primary" style={{ padding: "0.45rem 1.1rem", borderRadius: 8, fontSize: "0.82rem" }}
                          disabled={!replyInputs[q.id]?.trim()}
                          onClick={() => handleReply(q.id)}>
                          Send Reply →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── MARKETERS ── */}
        {activeTab === "marketers" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">Marketers</div>
                <div className="inst-page-sub">{assignments.length} marketer assignments · share referral links to grow enrollments</div>
              </div>
              <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={() => setShowAssignMarketer(true)}>
                + Assign Marketer
              </button>
            </div>

            {assignments.length === 0 && (
              <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📢</div>
                <div style={{ marginBottom: "0.5rem" }}>No marketers assigned yet.</div>
                <div style={{ fontSize: "0.82rem" }}>Assign a marketer to a course and they'll get a unique referral link to share with students.</div>
              </div>
            )}

            <div className="courses-mgmt">
              {assignments.map(a => {
                const link = `${window.location.origin}/?ref=${a.marketerId}&course=${a.courseId}`;
                const courseReferrals = requests.filter(r => String(r.marketerId) === String(a.marketerId) && String(r.courseId) === String(a.courseId));
                const accepted        = courseReferrals.filter(r => r.status === "accepted");
                const commissionTotal = accepted.reduce((s, r) => s + Math.round((r.amount || 0) * 350 * a.commissionRate / 100), 0);
                const avatarInitials  = a.marketerName.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <div key={a.id} className="mgmt-course-card">
                    <div style={{ width: 44, height: 44, borderRadius: "50%", background: "var(--gradient)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Syne,sans-serif", fontWeight: 700, color: "white", fontSize: "0.82rem", flexShrink: 0 }}>
                      {avatarInitials}
                    </div>
                    <div className="mgmt-course-info">
                      <div className="mgmt-course-name">{a.marketerName}</div>
                      <div className="mgmt-course-meta">
                        <span>📧 {a.marketerEmail}</span>
                        <span>📚 {a.courseName}</span>
                        <span style={{ color: "var(--cyan)", fontWeight: 600 }}>💰 {a.commissionRate}% commission</span>
                      </div>
                      {/* Referral link */}
                      <div style={{ marginTop: "0.6rem", background: "var(--bg3)", border: "1px solid var(--border2)", borderRadius: 8, padding: "0.6rem 0.75rem", display: "flex", gap: "0.75rem", alignItems: "center" }}>
                        <div style={{ flex: 1, fontSize: "0.73rem", color: "var(--text3)", wordBreak: "break-all", fontFamily: "monospace" }}>{link}</div>
                        <button
                          onClick={() => copyMarketerLink(link, a.id)}
                          style={{ flexShrink: 0, padding: "0.35rem 0.75rem", borderRadius: 7, border: "1px solid var(--border2)", background: "var(--bg)", cursor: "pointer", fontSize: "0.75rem", color: "var(--text2)", whiteSpace: "nowrap" }}
                        >
                          {copiedLink === a.id ? "✓ Copied!" : "📋 Copy"}
                        </button>
                      </div>
                      <div className="mgmt-course-stats">
                        <div className="mgmt-stat"><div className="mgmt-stat-val">{courseReferrals.length}</div><div className="mgmt-stat-lbl">Referrals</div></div>
                        <div className="mgmt-stat"><div className="mgmt-stat-val">{accepted.length}</div><div className="mgmt-stat-lbl">Accepted</div></div>
                        <div className="mgmt-stat"><div className="mgmt-stat-val" style={{ color: "var(--cyan)" }}>{commissionTotal > 0 ? `SDG ${commissionTotal.toLocaleString()}` : "—"}</div><div className="mgmt-stat-lbl">Commission Due</div></div>
                      </div>
                    </div>
                    <div className="mgmt-actions">
                      <button
                        className="mgmt-btn"
                        style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)", color: "#f87171" }}
                        onClick={() => handleRemoveAssignment(a.id)}
                      >
                        🗑 Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">My Profile</div>
                <div className="inst-page-sub">This is how students see you on Masar</div>
              </div>
              <button className="btn btn-ghost" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={() => setPage("instructor-1")}>
                👁 View Public Profile
              </button>
            </div>
            <div className="inst-profile-grid">
              <div className="inst-profile-card">
                <div className="inst-profile-avatar-wrap">
                  <div className="inst-profile-avatar-large">{initials}</div>
                </div>
                <div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700, fontSize: "1rem", margin: "0.5rem 0 0.2rem" }}>{name}</div>
                <div style={{ fontSize: "0.82rem", color: "var(--indigo-light)" }}>Instructor</div>
                <div style={{ fontSize: "0.78rem", color: "var(--text3)", marginTop: "0.5rem" }}>{user?.email}</div>
                <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border2)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                  <div><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>{totalStudents}</div><div style={{ fontSize: "0.7rem", color: "var(--text3)" }}>Students</div></div>
                  <div><div style={{ fontFamily: "Syne,sans-serif", fontWeight: 700 }}>{courses.length}</div><div style={{ fontSize: "0.7rem", color: "var(--text3)" }}>Courses</div></div>
                </div>
              </div>

              <div className="inst-profile-form">
                <div className="form-section-title">Basic Information</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                  <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" defaultValue={name} /></div>
                  <div className="form-group"><label className="form-label">Title / Role</label><input className="form-input" defaultValue="Data Scientist" /></div>
                </div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue={user?.email} /></div>
                <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="09xxxxxxxxx" /></div>

                <div className="form-section-title">About You</div>
                <div className="form-group">
                  <label className="form-label">Bio <span style={{ color: "var(--text3)", fontWeight: 400 }}>(shown on your profile)</span></label>
                  <textarea className="form-input" rows={3} style={{ resize: "none", lineHeight: 1.6 }} defaultValue="5+ years in data science, ex-Google and currently leading the data team at a Khartoum-based fintech." />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.875rem" }}>
                  <div className="form-group"><label className="form-label">LinkedIn</label><input className="form-input" placeholder="linkedin.com/in/..." /></div>
                  <div className="form-group"><label className="form-label">GitHub</label><input className="form-input" placeholder="github.com/..." /></div>
                </div>

                <div className="form-section-title">Specializations</div>
                <div className="form-group">
                  <label className="form-label">Skills & Topics <span style={{ color: "var(--text3)", fontWeight: 400 }}>(comma-separated)</span></label>
                  <input className="form-input" defaultValue="Python, Machine Learning, Data Science, Statistics" />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button className="btn btn-ghost" style={{ padding: "0.6rem 1.25rem", borderRadius: 9, fontSize: "0.875rem" }} onClick={() => setProfileSaved(false)}>Discard</button>
                  <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", borderRadius: 9, fontSize: "0.875rem" }} onClick={() => setProfileSaved(true)}>
                    {profileSaved ? "✓ Saved!" : "Save Changes"}
                  </button>
                </div>
                {profileSaved && <div style={{ textAlign: "right", fontSize: "0.78rem", color: "#22c55e", marginTop: "0.4rem" }}>✓ Profile updated successfully</div>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default InstructorDashboard;

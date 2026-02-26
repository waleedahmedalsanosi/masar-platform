import { useState, useEffect } from "react";
import { api } from "../services/api";
import AddCourseModal from "../modals/AddCourseModal";
import EditCourseModal from "../modals/EditCourseModal";
import CourseReviewModal from "../modals/CourseReviewModal";
import AssignMarketerModal from "../modals/AssignMarketerModal";
import { useSettings } from "../contexts/SettingsContext";

function InstructorDashboard({ user, setPage }) {
  const { t } = useSettings();
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
        setCourses(c); setRequests(r); setQaItems(q); setAssignments(a);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [instructorId]);

  const name           = user?.name || "Ahmed Hassan";
  const initials       = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const pendingCount   = requests.filter(r => r.status === "pending").length;
  const unansweredCount = qaItems.filter(q => !q.answer).length;
  const totalStudents  = courses.filter(c => c.status === "active").reduce((s, c) => s + (c.students || 0), 0);
  const totalRevenue   = courses.reduce((s, c) => s + (c.revenue || 0), 0);

  const handleRequestAction = async (id, action) => {
    await api.updateRequest(id, { status: action });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const handleReply = async (id) => {
    const text = replyInputs[id];
    if (!text?.trim()) return;
    await api.replyQA(id, text);
    setQaItems(prev => prev.map(q => q.id === id ? { ...q, answer: text } : q));
    setReplyInputs(prev => ({ ...prev, [id]: "" }));
  };

  const handleAddCourse = async (formData) => {
    const newCourse = await api.createCourse({
      instructorId, title: formData.title, image: formData.image, category: formData.category,
      level: formData.level, mode: formData.mode, price: Number(formData.price), status: "draft",
      students: 0, rating: 0, revenue: 0, startDate: formData.startDate || "TBD",
      duration: formData.duration || "", description: formData.description, tags: formData.tags,
      enrollmentFields: formData.enrollmentFields, meetLink: formData.meetLink || "",
      groupLink: formData.groupLink || "", location: formData.location || "",
      scheduleDays: formData.scheduleDays, weeks: formData.weeks,
    });
    setCourses(prev => [...prev, newCourse]);
    setShowAddCourse(false);
    setActiveTab("courses");
  };

  const handleEditCourse = async (updated) => {
    await api.updateCourse(updated.id, updated);
    setCourses(prev => prev.map(c => c.id === updated.id ? { ...c, ...updated } : c));
    setEditCourse(null);
  };

  const handlePublish = async (courseId) => {
    await api.updateCourse(courseId, { status: "active" });
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: "active" } : c));
  };

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
    { key: "overview",  label: t("inst.tab.overview"),  icon: "📊" },
    { key: "courses",   label: t("inst.tab.courses"),   icon: "📚" },
    { key: "requests",  label: t("inst.tab.requests"),  icon: "📥", badge: pendingCount || null },
    { key: "qa",        label: t("inst.tab.qa"),        icon: "💬", badge: unansweredCount || null },
    { key: "marketers", label: t("inst.tab.marketers"), icon: "📢", badge: assignments.length || null },
    { key: "profile",   label: t("inst.tab.profile"),   icon: "👤" },
  ];

  if (loading) return (
    <div className="inst-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem", animation: "spin 1s linear infinite" }}>⏳</div>
        <div>{t("inst.loading")}</div>
        <div style={{ fontSize: "0.78rem", marginTop: "0.5rem" }}><code>{t("inst.serverHint")}</code></div>
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
        {tabs.map(tab => (
          <div key={tab.key} className={`inst-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            <span>{tab.icon}</span> {tab.label}
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </div>
        ))}
      </div>

      <div className="inst-content">

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">{t("inst.welcome", { name: name.split(" ")[0] })}</div>
                <div className="inst-page-sub">{t("inst.subtitle")}</div>
              </div>
              <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={() => setShowAddCourse(true)}>
                {t("inst.addCourse")}
              </button>
            </div>

            <div className="ov-stats">
              {[
                { icon: "👥", val: totalStudents.toLocaleString(), lbl: t("inst.totalStudents"), trend: t("inst.weekTrend"), color: "#6366f1" },
                { icon: "📚", val: courses.length, lbl: t("inst.courses"), trend: t("inst.activeDraft", { active: courses.filter(c=>c.status==="active").length, draft: courses.filter(c=>c.status==="draft").length }), color: "#06b6d4" },
                { icon: "⭐", val: "4.75", lbl: t("inst.avgRating"), trend: t("inst.basedOn"), color: "#fbbf24" },
                { icon: "💰", val: `SDG ${totalRevenue.toLocaleString()}`, lbl: t("inst.totalRevenue"), trend: t("inst.monthTrend"), color: "#22c55e" },
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
                  {t("inst.yourCourses")}
                  <span className="ov-see-all" onClick={() => setActiveTab("courses")}>{t("inst.manageAll")}</span>
                </div>
                <div className="ov-card-bd">
                  {courses.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>{t("inst.noCourses")}</div>}
                  {courses.map(c => (
                    <div key={c.id} className="ov-course-row">
                      <span className="ov-course-icon">{c.image}</span>
                      <div style={{ flex: 1 }}>
                        <div className="ov-course-name">{c.title}</div>
                        <div className="ov-course-students">{c.students} {t("inst.studentsMeta", { rating: c.rating }).replace("{c.students} ", "")}{c.rating > 0 ? `⭐ ${c.rating}` : t("inst.noRatings")}</div>
                      </div>
                      <span className={`ov-course-status status-${c.status}`}>{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ov-card">
                <div className="ov-card-hd">
                  {t("inst.recentRequests")}
                  {pendingCount > 0 && <span className="ov-see-all" onClick={() => setActiveTab("requests")}>{t("inst.pendingArrow", { count: pendingCount })}</span>}
                </div>
                <div className="ov-card-bd">
                  {requests.length === 0 && <div style={{ color: "var(--text3)", fontSize: "0.82rem", padding: "0.5rem 0" }}>{t("inst.noRequests")}</div>}
                  {requests.slice(0, 4).map(r => (
                    <div key={r.id} className="ov-req-row">
                      {r.status === "pending" && <div className="ov-req-dot" />}
                      <div className="ov-req-avatar">{r.avatar || r.name?.slice(0,2).toUpperCase()}</div>
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
                <div className="inst-page-title">{t("inst.coursesTitle")}</div>
                <div className="inst-page-sub">{t("inst.coursesSubtitle", { count: courses.length, active: courses.filter(c=>c.status==="active").length })}</div>
              </div>
              <button className="btn btn-primary" style={{ padding: "0.6rem 1.25rem", fontSize: "0.875rem", borderRadius: 9 }} onClick={() => setShowAddCourse(true)}>
                {t("inst.addCourse")}
              </button>
            </div>
            <div className="courses-mgmt">
              {courses.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                  <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>📚</div>
                  <div>{t("inst.noCoursesLong")}</div>
                </div>
              )}
              {courses.map(c => (
                <div key={c.id} className="mgmt-course-card">
                  <span className="mgmt-course-emoji">{c.image}</span>
                  <div className="mgmt-course-info">
                    <div className="mgmt-course-name">{c.title}</div>
                    <div className="mgmt-course-meta">
                      <span>{t("inst.startDate", { date: c.startDate })}</span>
                      <span>{t("inst.price", { price: ((c.price||0)*350).toLocaleString() })}</span>
                      <span className={`ov-course-status status-${c.status}`}>{c.status}</span>
                    </div>
                    {c.enrollmentFields && (
                      <div style={{ fontSize: "0.72rem", color: "var(--text3)", marginTop: "0.25rem" }}>
                        {t("inst.fieldsMeta", { count: c.enrollmentFields.length, required: c.enrollmentFields.filter(f=>f.required).length })}
                      </div>
                    )}
                    <div className="mgmt-course-stats">
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{c.students}</div><div className="mgmt-stat-lbl">{t("inst.students")}</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{c.rating > 0 ? c.rating : "—"}</div><div className="mgmt-stat-lbl">{t("inst.rating")}</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val" style={{ color: "var(--cyan)" }}>{c.revenue > 0 ? `SDG ${c.revenue.toLocaleString()}` : "—"}</div><div className="mgmt-stat-lbl">{t("inst.revenue")}</div></div>
                    </div>
                  </div>
                  <div className="mgmt-actions">
                    <button className="mgmt-btn mgmt-btn-edit" onClick={() => setEditCourse(c)}>{t("inst.editBtn")}</button>
                    {c.id <= 8 && <button className="mgmt-btn mgmt-btn-view" onClick={() => setPage("course-"+c.id)}>{t("inst.viewBtn")}</button>}
                    {c.status === "draft" && (
                      <button className="mgmt-btn" style={{ background: "rgba(34,197,94,0.1)", borderColor: "rgba(34,197,94,0.3)", color: "#22c55e" }}
                        onClick={() => handlePublish(c.id)}>
                        {t("inst.publishBtn")}
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
                <div className="inst-page-title">{t("inst.requestsTitle")}</div>
                <div className="inst-page-sub">
                  {t("inst.requestsSubtitle", { pending: pendingCount, accepted: requests.filter(r=>r.status==="accepted").length, rejected: requests.filter(r=>r.status==="rejected").length })}
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {["all","pending","accepted","rejected"].map(f => (
                  <button key={f} className={`filter-btn ${reqFilter===f?"active":""}`} style={{ fontSize: "0.78rem", padding: "0.35rem 0.875rem" }} onClick={() => setReqFilter(f)}>
                    {t(`inst.filter${f.charAt(0).toUpperCase()+f.slice(1)}`)}
                  </button>
                ))}
              </div>
            </div>
            <div className="requests-list">
              {requests.filter(r => reqFilter==="all" || r.status===reqFilter).length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text3)" }}>
                  <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📥</div>
                  <div>{t("inst.noFilterRequests", { filter: reqFilter==="all" ? "" : t(`inst.filter${reqFilter.charAt(0).toUpperCase()+reqFilter.slice(1)}`) })}</div>
                </div>
              )}
              {requests.filter(r => reqFilter==="all" || r.status===reqFilter).map(r => (
                <div key={r.id} className="req-card">
                  <div className="req-avatar">{r.avatar || r.name?.slice(0,2).toUpperCase()}</div>
                  <div className="req-info">
                    <div className="req-name">{r.name}</div>
                    <div className="req-course-name">{r.course}</div>
                    <div className="req-details">
                      📞 {r.phone} &nbsp;·&nbsp; 📧 {r.email} &nbsp;·&nbsp;
                      <span className="req-payment-badge">
                        {r.payment==="bank" ? t("inst.bankTransfer") : t("inst.mobileMoney")} · SDG {((r.amount||0)*350).toLocaleString()}
                      </span>
                    </div>
                    {r.fields && Object.keys(r.fields).filter(k => !["fullName","phone","email"].includes(k) && r.fields[k]).length > 0 && (
                      <div style={{ marginTop: "0.4rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {Object.entries(r.fields).filter(([k,v]) => !["fullName","phone","email"].includes(k) && v).map(([k,v]) => (
                          <span key={k} style={{ fontSize: "0.72rem", background: "rgba(99,102,241,0.08)", border: "1px solid rgba(99,102,241,0.15)", borderRadius: 5, padding: "0.15rem 0.5rem", color: "var(--text2)" }}>
                            {k}: {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="req-time">{r.time}</div>
                    {r.status==="pending"
                      ? <div className="req-actions" style={{ marginTop: "0.5rem" }}>
                          <button className="req-btn-accept" onClick={() => handleRequestAction(r.id,"accepted")}>{t("inst.acceptBtn")}</button>
                          <button className="req-btn-reject" onClick={() => handleRequestAction(r.id,"rejected")}>{t("inst.rejectBtn")}</button>
                        </div>
                      : <span className={`req-status ${r.status}`} style={{ display: "inline-block", marginTop: "0.5rem" }}>
                          {r.status==="accepted" ? t("inst.acceptedStatus") : t("inst.rejectedStatus")}
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
                <div className="inst-page-title">{t("inst.qaTitle")}</div>
                <div className="inst-page-sub">{t("inst.qaSubtitle", { unanswered: unansweredCount, answered: qaItems.filter(q=>q.answer).length })}</div>
              </div>
            </div>
            <div className="iqa-list">
              {qaItems.map(q => (
                <div key={q.id} className={`iqa-card ${q.answer ? "answered" : ""}`}>
                  <div className="iqa-header">
                    <div style={{ width:32, height:32, borderRadius:"50%", background:"var(--gradient)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"0.7rem", color:"white", flexShrink:0 }}>
                      {q.anon ? "?" : q.sender[0]+(q.sender.split(" ")[1]?.[0]||"")}
                    </div>
                    <div>
                      <div style={{ fontWeight:600, fontSize:"0.85rem" }}>{q.anon ? t("inst.anonymous") : q.sender}</div>
                      <div className="iqa-from">re: <span className="iqa-course-tag">{q.course}</span></div>
                    </div>
                    <div className="iqa-time">{q.time}</div>
                  </div>
                  <div className="iqa-question">"{q.question}"</div>
                  {q.answer ? (
                    <div className="iqa-reply-area">
                      <div className="iqa-reply-label">{t("inst.replyLabel")}</div>
                      <div className="iqa-answer-text">{q.answer}</div>
                    </div>
                  ) : (
                    <div className="iqa-reply-area">
                      <div className="iqa-reply-label">{t("inst.qaTitle")}:</div>
                      <textarea className="iqa-reply-input" rows={2} placeholder={t("inst.replyPlaceholder")}
                        value={replyInputs[q.id]||""} onChange={e => setReplyInputs(prev=>({...prev,[q.id]:e.target.value}))} />
                      <div className="iqa-reply-footer">
                        <button className="btn btn-primary" style={{ padding:"0.45rem 1.1rem", borderRadius:8, fontSize:"0.82rem" }}
                          disabled={!replyInputs[q.id]?.trim()} onClick={() => handleReply(q.id)}>
                          {t("inst.replyBtn")}
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
                <div className="inst-page-title">{t("inst.marketersTitle")}</div>
                <div className="inst-page-sub">{t("inst.marketersSubtitle", { count: assignments.length })}</div>
              </div>
              <button className="btn btn-primary" style={{ padding:"0.6rem 1.25rem", fontSize:"0.875rem", borderRadius:9 }} onClick={() => setShowAssignMarketer(true)}>
                {t("inst.assignMarketer")}
              </button>
            </div>
            {assignments.length === 0 && (
              <div style={{ textAlign:"center", padding:"3rem 1rem", color:"var(--text3)" }}>
                <div style={{ fontSize:"2.5rem", marginBottom:"0.75rem" }}>📢</div>
                <div style={{ marginBottom:"0.5rem" }}>{t("inst.noMarketers")}</div>
                <div style={{ fontSize:"0.82rem" }}>{t("inst.marketerHelp")}</div>
              </div>
            )}
            <div className="courses-mgmt">
              {assignments.map(a => {
                const link = `${window.location.origin}/?ref=${a.marketerId}&course=${a.courseId}`;
                const courseReferrals = requests.filter(r => String(r.marketerId)===String(a.marketerId) && String(r.courseId)===String(a.courseId));
                const accepted = courseReferrals.filter(r => r.status==="accepted");
                const commissionTotal = accepted.reduce((s,r) => s+Math.round((r.amount||0)*350*a.commissionRate/100), 0);
                const avatarInitials = a.marketerName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
                return (
                  <div key={a.id} className="mgmt-course-card">
                    <div style={{ width:44, height:44, borderRadius:"50%", background:"var(--gradient)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"Syne,sans-serif", fontWeight:700, color:"white", fontSize:"0.82rem", flexShrink:0 }}>
                      {avatarInitials}
                    </div>
                    <div className="mgmt-course-info">
                      <div className="mgmt-course-name">{a.marketerName}</div>
                      <div className="mgmt-course-meta">
                        <span>📧 {a.marketerEmail}</span>
                        <span>📚 {a.courseName}</span>
                        <span style={{ color:"var(--cyan)", fontWeight:600 }}>{t("inst.commission", { rate: a.commissionRate })}</span>
                      </div>
                      <div style={{ marginTop:"0.6rem", background:"var(--bg3)", border:"1px solid var(--border2)", borderRadius:8, padding:"0.6rem 0.75rem", display:"flex", gap:"0.75rem", alignItems:"center" }}>
                        <div style={{ flex:1, fontSize:"0.73rem", color:"var(--text3)", wordBreak:"break-all", fontFamily:"monospace" }}>{link}</div>
                        <button onClick={() => copyMarketerLink(link, a.id)}
                          style={{ flexShrink:0, padding:"0.35rem 0.75rem", borderRadius:7, border:"1px solid var(--border2)", background:"var(--bg)", cursor:"pointer", fontSize:"0.75rem", color:"var(--text2)", whiteSpace:"nowrap" }}>
                          {copiedLink===a.id ? t("inst.copiedBtn") : t("inst.copyBtn")}
                        </button>
                      </div>
                      <div className="mgmt-course-stats">
                        <div className="mgmt-stat"><div className="mgmt-stat-val">{courseReferrals.length}</div><div className="mgmt-stat-lbl">{t("inst.referrals")}</div></div>
                        <div className="mgmt-stat"><div className="mgmt-stat-val">{accepted.length}</div><div className="mgmt-stat-lbl">{t("inst.accepted")}</div></div>
                        <div className="mgmt-stat"><div className="mgmt-stat-val" style={{ color:"var(--cyan)" }}>{commissionTotal>0 ? `SDG ${commissionTotal.toLocaleString()}` : "—"}</div><div className="mgmt-stat-lbl">{t("inst.commissionDue")}</div></div>
                      </div>
                    </div>
                    <div className="mgmt-actions">
                      <button className="mgmt-btn" style={{ background:"rgba(239,68,68,0.08)", borderColor:"rgba(239,68,68,0.2)", color:"#f87171" }}
                        onClick={() => handleRemoveAssignment(a.id)}>
                        {t("inst.removeBtn")}
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
                <div className="inst-page-title">{t("inst.profileTitle")}</div>
                <div className="inst-page-sub">{t("inst.profileSubtitle")}</div>
              </div>
              <button className="btn btn-ghost" style={{ padding:"0.6rem 1.25rem", fontSize:"0.875rem", borderRadius:9 }} onClick={() => setPage("instructor-1")}>
                {t("inst.viewPublic")}
              </button>
            </div>
            <div className="inst-profile-grid">
              <div className="inst-profile-card">
                <div className="inst-profile-avatar-wrap">
                  <div className="inst-profile-avatar-large">{initials}</div>
                </div>
                <div style={{ fontFamily:"Syne,sans-serif", fontWeight:700, fontSize:"1rem", margin:"0.5rem 0 0.2rem" }}>{name}</div>
                <div style={{ fontSize:"0.82rem", color:"var(--indigo-light)" }}>{t("inst.instructorRole")}</div>
                <div style={{ fontSize:"0.78rem", color:"var(--text3)", marginTop:"0.5rem" }}>{user?.email}</div>
                <div style={{ marginTop:"1rem", paddingTop:"1rem", borderTop:"1px solid var(--border2)", display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.75rem" }}>
                  <div><div style={{ fontFamily:"Syne,sans-serif", fontWeight:700 }}>{totalStudents}</div><div style={{ fontSize:"0.7rem", color:"var(--text3)" }}>{t("inst.students")}</div></div>
                  <div><div style={{ fontFamily:"Syne,sans-serif", fontWeight:700 }}>{courses.length}</div><div style={{ fontSize:"0.7rem", color:"var(--text3)" }}>{t("inst.courses")}</div></div>
                </div>
              </div>

              <div className="inst-profile-form">
                <div className="form-section-title">{t("inst.basicInfo")}</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem" }}>
                  <div className="form-group"><label className="form-label">{t("inst.fullName")}</label><input className="form-input" defaultValue={name} /></div>
                  <div className="form-group"><label className="form-label">{t("inst.titleRole")}</label><input className="form-input" defaultValue="Data Scientist" /></div>
                </div>
                <div className="form-group"><label className="form-label">{t("inst.email")}</label><input className="form-input" defaultValue={user?.email} /></div>
                <div className="form-group"><label className="form-label">{t("inst.phone2")}</label><input className="form-input" placeholder={t("inst.phonePlaceholder")} /></div>

                <div className="form-section-title">{t("inst.aboutYou")}</div>
                <div className="form-group">
                  <label className="form-label">{t("inst.bio")} <span style={{ color:"var(--text3)", fontWeight:400 }}>{t("inst.bioNote")}</span></label>
                  <textarea className="form-input" rows={3} style={{ resize:"none", lineHeight:1.6 }} defaultValue="5+ years in data science, ex-Google and currently leading the data team at a Khartoum-based fintech." />
                </div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.875rem" }}>
                  <div className="form-group"><label className="form-label">{t("inst.linkedin")}</label><input className="form-input" placeholder={t("inst.linkedinPlaceholder")} /></div>
                  <div className="form-group"><label className="form-label">{t("inst.github")}</label><input className="form-input" placeholder={t("inst.githubPlaceholder")} /></div>
                </div>

                <div className="form-section-title">{t("inst.specializations")}</div>
                <div className="form-group">
                  <label className="form-label">{t("inst.skills")} <span style={{ color:"var(--text3)", fontWeight:400 }}>{t("inst.skillsNote")}</span></label>
                  <input className="form-input" defaultValue="Python, Machine Learning, Data Science, Statistics" />
                </div>

                <div style={{ display:"flex", justifyContent:"flex-end", gap:"0.75rem", marginTop:"0.5rem" }}>
                  <button className="btn btn-ghost" style={{ padding:"0.6rem 1.25rem", borderRadius:9, fontSize:"0.875rem" }} onClick={() => setProfileSaved(false)}>{t("inst.discard")}</button>
                  <button className="btn btn-primary" style={{ padding:"0.6rem 1.25rem", borderRadius:9, fontSize:"0.875rem" }} onClick={() => setProfileSaved(true)}>
                    {profileSaved ? t("inst.saved") : t("inst.saveChanges")}
                  </button>
                </div>
                {profileSaved && <div style={{ textAlign:"right", fontSize:"0.78rem", color:"#22c55e", marginTop:"0.4rem" }}>{t("inst.profileUpdated")}</div>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default InstructorDashboard;

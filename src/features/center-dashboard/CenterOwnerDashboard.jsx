/**
 * @file CenterOwnerDashboard.jsx
 * @description لوحة تحكم مالك المركز التدريبي
 *
 * لوحة تحكم شاملة لأصحاب المراكز التدريبي تتضمن:
 * - إحصائيات المركز (الإيرادات، الطلاب، الكورسات، المدربون)
 * - تبويبات: نظرة عامة، الكورسات، المدربون، الطلاب، الشؤون المالية
 * - إدارة الكورسات (مراجعة، تعديل)
 * - إدارة المدربين (إضافة، عرض)
 * - عرض قائمة طلبات التسجيل
 * - تقارير الإيرادات الشهرية
 * - إضافة مدرب جديد عبر AddInstructorModal
 * - مراجعة الكورسات عبر CourseReviewModal
 *
 * @note يستخدم بيانات تجريبية (CENTER_MOCK_*) كـ mock للبيانات الفعلية
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddInstructorModal from "../../modals/AddInstructorModal";
import CourseReviewModal from "../../modals/CourseReviewModal";
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from "../../contexts/AuthContext";

const FEE_PER_STUDENT = 50; // SDG flat fee per enrolled student

function CenterOwnerDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useSettings();
  const [activeTab, setActiveTab]   = useState("overview");
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses]       = useState([]);
  const [requests, setRequests]     = useState([]);
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [editSplitInstructor, setEditSplitInstructor] = useState(null);
  const [reviewCourse, setReviewCourse] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [paidInstructors, setPaidInstructors] = useState([]);
  const [centerProfileSaved, setCenterProfileSaved] = useState(false);

  const centerName = user?.centerName || user?.name || "My Center";
  const center = {
    name: centerName,
    logo: centerName.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase(),
    color: "#6366f1",
    tagline: "",
  };
  const name   = user?.name || centerName;
  const initials = name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();

  const pendingRequests  = requests.filter(r=>r.status==="pending").length;
  const pendingCourses   = 0; // Center views only — instructors publish freely
  const totalBadge       = pendingRequests + pendingCourses;
  const activeInstructors = instructors.filter(i=>i.status==="active").length;
  const totalStudents    = instructors.filter(i=>i.status==="active").reduce((s,i)=>s+i.students,0);

  const handleRequestAction = (id, action) =>
    setRequests(prev=>prev.map(r=>r.id===id?{...r,status:action}:r));

  const handleCourseAction = (id, action) =>
    setCourses(prev=>prev.map(c=>c.id===id?{...c,status:action==="approve"?"published":action==="reject"?"rejected":"draft"}:c));

  const handleInstructorAction = (id, action) =>
    setInstructors(prev=>prev.map(i=>i.id===id?{...i,status:action}:i));

  const totalCenterViews   = courses.reduce((s,c)=>s+(c.views||0),0);
  const centerReserved     = requests.filter(r=>r.status==="reserved").length;
  const centerAccepted     = requests.filter(r=>r.status==="accepted").length;
  const centerConvRate     = totalCenterViews > 0 ? Math.round((centerAccepted / totalCenterViews) * 100) : 0;

  const tabs = [
    { key:"overview",     label: t("center.tab.overview"),     icon:"📊" },
    { key:"instructors",  label: t("center.tab.instructors"),  icon:"👨‍🏫", badge: instructors.filter(i=>i.status==="pending").length || null },
    { key:"courses",      label: t("center.tab.courses"),      icon:"📚",  badge: pendingCourses || null },
    { key:"analytics",    label: t("analytics.tab"),           icon:"📈" },
    { key:"requests",     label: t("inst.tab.requests"),       icon:"📥",  badge: pendingRequests || null },
    { key:"finances",     label: "Finances",                   icon:"💰" },
    { key:"profile",      label: t("center.tab.profile"),      icon:"🏢" },
  ];

  const StatCard = ({icon,val,lbl,trend,color,onClick}) => (
    <div className="ov-stat-card" style={onClick?{cursor:"pointer"}:{}} onClick={onClick}>
      <div className="ov-stat-glow" style={{background:color}}/>
      <div className="ov-stat-icon">{icon}</div>
      <div className="ov-stat-val" style={{background:`linear-gradient(135deg,${color},white)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{val}</div>
      <div className="ov-stat-lbl">{lbl}</div>
      <div className="ov-stat-trend">{trend}</div>
    </div>
  );

  return (
    <div className="inst-dash">
      {/* Course review modal */}
      {reviewCourse && (
        <CourseReviewModal
          course={reviewCourse}
          onClose={()=>setReviewCourse(null)}
          onApprove={()=>{handleCourseAction(reviewCourse.id,"approve");setReviewCourse(null);}}
          onReject={()=>{handleCourseAction(reviewCourse.id,"reject");setReviewCourse(null);}}
        />
      )}
      {/* Edit fee modal */}
      {editSplitInstructor && (
        <div className="add-course-overlay" onClick={e=>e.target===e.currentTarget&&setEditSplitInstructor(null)}>
          <div className="add-course-modal" style={{maxWidth:400}}>
            <div className="acm-header">
              <div><div className="acm-title">Edit Center Fee</div><div className="acm-sub">{editSplitInstructor.name}</div></div>
              <button className="em-close" onClick={()=>setEditSplitInstructor(null)}>✕</button>
            </div>
            <div className="acm-body">
              <div className="form-group">
                <label className="form-label">Center fee per student (SDG)</label>
                <input className="form-input" type="number" min="0"
                  defaultValue={editSplitInstructor.feePerStudent}
                  id="feeInput"
                  onChange={e=>setEditSplitInstructor(prev=>({...prev,feePerStudent:+e.target.value}))}
                />
                <div style={{fontSize:"0.75rem",color:"var(--text3)",marginTop:"0.35rem"}}>
                  Current: SDG {editSplitInstructor.feePerStudent} × {editSplitInstructor.students} students = SDG {editSplitInstructor.feePerStudent*editSplitInstructor.students}
                </div>
              </div>
            </div>
            <div className="acm-footer">
              <button className="btn btn-ghost" style={{padding:"0.6rem 1.1rem",borderRadius:9,fontSize:"0.875rem"}} onClick={()=>setEditSplitInstructor(null)}>Cancel</button>
              <button className="btn btn-primary" style={{padding:"0.6rem 1.25rem",borderRadius:9,fontSize:"0.875rem"}} onClick={()=>{
                setInstructors(prev=>prev.map(i=>i.id===editSplitInstructor.id?{...i,feePerStudent:editSplitInstructor.feePerStudent}:i));
                setEditSplitInstructor(null);
              }}>Save →</button>
            </div>
          </div>
        </div>
      )}
      {/* Add instructor modal */}
      {showAddInstructor && (
        <AddInstructorModal
          onClose={()=>setShowAddInstructor(false)}
          onAdd={(inst)=>setInstructors(prev=>[...prev,{...inst,id:Date.now(),courses:0,students:0,rating:0,revenue:0,status:"pending",joinDate:"Just now"}])}
        />
      )}

      {/* Tab bar */}
      <div className="inst-topbar">
        {tabs.map(t=>(
          <div key={t.key} className={`inst-tab ${activeTab===t.key?"active":""}`} onClick={()=>setActiveTab(t.key)}>
            <span>{t.icon}</span> {t.label}
            {t.badge>0 && <span className="tab-badge">{t.badge}</span>}
          </div>
        ))}
      </div>

      <div className="inst-content">

        {/* ── OVERVIEW ── */}
        {activeTab==="overview" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div style={{display:"flex",alignItems:"center",gap:"0.75rem",marginBottom:"0.25rem"}}>
                  <div style={{width:42,height:42,borderRadius:10,background:center.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,color:"white",fontSize:"1rem"}}>{center.logo}</div>
                  <div>
                    <div className="inst-page-title" style={{marginBottom:0}}>{center.name}</div>
                    <div className="inst-page-sub">{center.tagline}</div>
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:"0.5rem"}}>
                {totalBadge>0 && (
                  <div style={{background:"rgba(251,191,36,0.12)",border:"1px solid rgba(251,191,36,0.3)",borderRadius:9,padding:"0.5rem 1rem",fontSize:"0.82rem",color:"#fbbf24",fontWeight:600,cursor:"pointer"}}
                    onClick={()=>setActiveTab(pendingCourses>0?"courses":"requests")}>
                    ⚠ {totalBadge} items need attention
                  </div>
                )}
                <button className="btn btn-primary" style={{padding:"0.6rem 1.25rem",fontSize:"0.875rem",borderRadius:9}} onClick={()=>setShowAddInstructor(true)}>
                  {t("center.addInstructor")}
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="ov-stats">
              <StatCard icon="👥" val={totalStudents.toLocaleString()} lbl="Total Students" trend={`across ${activeInstructors} instructors`} color="#6366f1" />
              <StatCard icon="📚" val={courses.filter(c=>c.status==="published").length} lbl="Active Courses" trend={"Instructors publish freely"} color="#06b6d4" onClick={pendingCourses?()=>setActiveTab("courses"):null} />
              <StatCard icon="⭐" val="4.8" lbl="Center Rating" trend="Top 5% on Masar" color="#fbbf24" />
              <StatCard icon="💰" val={`SDG ${((totalStudents*FEE_PER_STUDENT)/1000).toFixed(1)}K`} lbl="Fee Revenue" trend={`SDG ${FEE_PER_STUDENT}/student · ${totalStudents} enrolled`} color="#22c55e" onClick={()=>setActiveTab("finances")} />
            </div>

            <div className="ov-grid">
              {/* Instructors snapshot */}
              <div className="ov-card">
                <div className="ov-card-hd">
                  👨‍🏫 Instructors
                  <span className="ov-see-all" onClick={()=>setActiveTab("instructors")}>Manage →</span>
                </div>
                <div className="ov-card-bd">
                  {instructors.map(i=>(
                    <div key={i.id} className="ov-course-row">
                      <div style={{width:32,height:32,borderRadius:"50%",background:"var(--gradient)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.68rem",fontWeight:700,color:"white",fontFamily:"Syne,sans-serif",flexShrink:0}}>{i.avatar}</div>
                      <div style={{flex:1}}>
                        <div className="ov-course-name">{i.name}</div>
                        <div className="ov-course-students">{i.students} students · {i.courses} course(s)</div>
                      </div>
                      <span className={`ov-course-status status-${i.status==="active"?"active":"draft"}`}>{i.status}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent requests */}
              <div className="ov-card">
                <div className="ov-card-hd">
                  📥 Recent Requests
                  {pendingRequests>0 && <span className="ov-see-all" onClick={()=>setActiveTab("requests")}>{pendingRequests} pending →</span>}
                </div>
                <div className="ov-card-bd">
                  {requests.slice(0,4).map(r=>(
                    <div key={r.id} className="ov-req-row">
                      {r.status==="pending" && <div className="ov-req-dot"/>}
                      <div className="ov-req-avatar">{r.avatar}</div>
                      <div style={{flex:1}}>
                        <div className="ov-req-name">{r.name}</div>
                        <div className="ov-req-course">{r.course} · {r.instructor}</div>
                      </div>
                      <div>
                        <div className="ov-req-time">{r.time}</div>
                        <div style={{textAlign:"right",marginTop:"0.2rem"}}>
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

        {/* ── INSTRUCTORS ── */}
        {activeTab==="instructors" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">{t("center.instructorsTitle")}</div>
                <div className="inst-page-sub">{activeInstructors} active · {instructors.filter(i=>i.status==="pending").length} pending approval</div>
              </div>
              <button className="btn btn-primary" style={{padding:"0.6rem 1.25rem",fontSize:"0.875rem",borderRadius:9}} onClick={()=>setShowAddInstructor(true)}>
                {t("center.addInstructor")}
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:"0.875rem"}}>
              {instructors.map(i=>(
                <div key={i.id} className="mgmt-course-card" style={{alignItems:"flex-start"}}>
                  <div style={{width:50,height:50,borderRadius:"50%",background:"var(--gradient)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.95rem",fontWeight:800,color:"white",fontFamily:"Syne,sans-serif",flexShrink:0}}>{i.avatar}</div>
                  <div className="mgmt-course-info">
                    <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.25rem"}}>
                      <div className="mgmt-course-name" style={{marginBottom:0}}>{i.name}</div>
                      <span className={`ov-course-status status-${i.status==="active"?"active":"draft"}`}>{i.status}</span>
                    </div>
                    <div className="mgmt-course-meta">
                      <span>🎓 {i.title}</span>
                      <span>📅 Joined {i.joinDate}</span>
                      <span>💸 SDG {i.feePerStudent} flat fee / student</span>
                    </div>
                    <div className="mgmt-course-stats">
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{i.courses}</div><div className="mgmt-stat-lbl">Courses</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{i.students}</div><div className="mgmt-stat-lbl">Students</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{i.rating>0?i.rating:"—"}</div><div className="mgmt-stat-lbl">Rating</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val" style={{color:"var(--cyan)"}}>{i.revenue>0?`SDG ${(i.revenue/1000).toFixed(0)}K`:"—"}</div><div className="mgmt-stat-lbl">Revenue</div></div>
                    </div>
                  </div>
                  <div className="mgmt-actions" style={{flexDirection:"column",alignItems:"flex-end",gap:"0.4rem"}}>
                    {i.status==="pending"
                      ? <><button className="req-btn-accept" onClick={()=>handleInstructorAction(i.id,"active")}>✓ Approve</button>
                           <button className="req-btn-reject" onClick={()=>handleInstructorAction(i.id,"rejected")}>✕ Reject</button></>
                      : <><button className="mgmt-btn mgmt-btn-edit" onClick={()=>setEditSplitInstructor(i)}>✏ Edit Fee</button>
                           <button className="mgmt-btn" style={i.status==="active"?{background:"rgba(248,113,113,0.1)",borderColor:"rgba(248,113,113,0.25)",color:"#f87171"}:{background:"rgba(34,197,94,0.1)",borderColor:"rgba(34,197,94,0.3)",color:"#22c55e"}}
                             onClick={()=>handleInstructorAction(i.id,i.status==="active"?"suspended":"active")}>
                             {i.status==="active"?"⏸ Suspend":"▶ Reactivate"}
                           </button></>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COURSES ── */}
        {activeTab==="courses" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">All Courses</div>
                <div className="inst-page-sub">{courses.filter(c=>c.status==="published").length} published · {pendingCourses} pending review · {courses.filter(c=>c.status==="draft").length} drafts</div>
              </div>
            </div>
            <div style={{background:"rgba(6,182,212,0.06)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:10,padding:"0.75rem 1.1rem",marginBottom:"1.25rem",fontSize:"0.82rem",color:"var(--text2)",display:"flex",alignItems:"center",gap:"0.75rem"}}>
              <span>ℹ️</span>
              <span>Instructors publish courses freely. Each enrollment generates a <strong style={{color:"var(--cyan)"}}>SDG {FEE_PER_STUDENT} flat fee</strong> for the center.</span>
            </div>
            <div className="courses-mgmt">
              {courses.map(c=>(
                <div key={c.id} className="mgmt-course-card" style={c.status==="pending"?{borderColor:"rgba(251,191,36,0.4)",background:"rgba(251,191,36,0.03)"}:{}}>
                  <span className="mgmt-course-emoji">{c.image}</span>
                  <div className="mgmt-course-info">
                    <div style={{display:"flex",alignItems:"center",gap:"0.6rem",marginBottom:"0.3rem"}}>
                      <div className="mgmt-course-name" style={{marginBottom:0}}>{c.title}</div>
                      <span className={`ov-course-status`} style={
                        c.status==="published"?{background:"rgba(34,197,94,0.1)",color:"#22c55e"}:
                        c.status==="pending"?{background:"rgba(251,191,36,0.1)",color:"#fbbf24"}:
                        {background:"rgba(148,163,184,0.1)",color:"var(--text3)"}
                      }>{c.status}</span>
                    </div>
                    <div className="mgmt-course-meta">
                      <span>👨‍🏫 {c.instructor}</span>
                      <span>💰 ${c.price} / student</span>
                      <span>🏢 SDG {c.centerFee} center fee</span>
                      <span>📅 Published {c.publishDate}</span>
                    </div>
                    <div className="mgmt-course-stats">
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{c.students}</div><div className="mgmt-stat-lbl">Students</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val">{c.rating>0?c.rating:"—"}</div><div className="mgmt-stat-lbl">Rating</div></div>
                      <div className="mgmt-stat"><div className="mgmt-stat-val" style={{color:"var(--cyan)"}}>{c.revenue>0?`SDG ${c.revenue.toLocaleString()}`:"—"}</div><div className="mgmt-stat-lbl">Revenue</div></div>
                    </div>
                  </div>
                  <div className="mgmt-actions" style={{flexDirection:"column",alignItems:"flex-end",gap:"0.4rem"}}>
                    <>
                      {c.id<=8 && <button className="mgmt-btn mgmt-btn-view" onClick={() => navigate(`/courses/${c.id}`)}>👁 View</button>}
                    </>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {activeTab==="analytics" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">{t("analytics.centerTitle")}</div>
                <div className="inst-page-sub">{t("analytics.centerSubtitle")}</div>
              </div>
            </div>

            {/* Summary stats */}
            <div className="ov-stats">
              {[
                { icon:"👁",  val: totalCenterViews,  lbl: t("analytics.totalCourseViews"), color:"#6366f1" },
                { icon:"📝",  val: requests.length,   lbl: t("analytics.totalSubmissions"), color:"#06b6d4" },
                { icon:"🔖",  val: centerReserved,    lbl: t("analytics.reserved"),         color:"#f59e0b" },
                { icon:"✅",  val: centerAccepted,    lbl: t("analytics.accepted"),         color:"#22c55e" },
              ].map(s=>(
                <div key={s.lbl} className="ov-stat-card">
                  <div className="ov-stat-glow" style={{background:s.color}}/>
                  <div className="ov-stat-icon">{s.icon}</div>
                  <div className="ov-stat-val" style={{background:`linear-gradient(135deg,${s.color},white)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{s.val}</div>
                  <div className="ov-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>

            {/* Enrollment funnel */}
            <div style={{marginTop:"1.5rem",display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.25rem"}}>
              {/* Funnel chart */}
              <div className="ov-card">
                <div className="ov-card-hd">🔄 {t("analytics.enrollmentFunnel")}</div>
                <div className="ov-card-bd" style={{paddingTop:"0.5rem"}}>
                  {[
                    { label: t("analytics.totalViews"),       val: totalCenterViews, color:"#6366f1", pct: 100 },
                    { label: t("analytics.totalSubmissions"), val: requests.length,  color:"#06b6d4", pct: totalCenterViews>0?Math.round(requests.length/totalCenterViews*100):0 },
                    { label: t("analytics.reserved"),         val: centerReserved,   color:"#f59e0b", pct: totalCenterViews>0?Math.round(centerReserved/totalCenterViews*100):0 },
                    { label: t("analytics.accepted"),         val: centerAccepted,   color:"#22c55e", pct: totalCenterViews>0?Math.round(centerAccepted/totalCenterViews*100):0 },
                  ].map(f=>(
                    <div key={f.label} style={{marginBottom:"0.875rem"}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:"0.78rem",marginBottom:"0.3rem"}}>
                        <span style={{color:"var(--text2)"}}>{f.label}</span>
                        <span style={{fontFamily:"Syne,sans-serif",fontWeight:700,color:f.color}}>{f.val} <span style={{color:"var(--text3)",fontWeight:400}}>({f.pct}%)</span></span>
                      </div>
                      <div style={{height:7,background:"var(--border2)",borderRadius:100}}>
                        <div style={{height:"100%",width:`${f.pct}%`,background:f.color,borderRadius:100,transition:"width 0.5s ease"}}/>
                      </div>
                    </div>
                  ))}
                  <div style={{marginTop:"1rem",paddingTop:"0.875rem",borderTop:"1px solid var(--border2)",display:"flex",justifyContent:"space-between",fontSize:"0.78rem"}}>
                    <span style={{color:"var(--text3)"}}>{t("analytics.convRate")}</span>
                    <span style={{fontFamily:"Syne,sans-serif",fontWeight:700,color:centerConvRate>5?"#22c55e":"#f59e0b"}}>{centerConvRate}%</span>
                  </div>
                </div>
              </div>

              {/* Top courses by views */}
              <div className="ov-card">
                <div className="ov-card-hd">🏆 {t("analytics.topCourse")}</div>
                <div className="ov-card-bd">
                  {[...CENTER_MOCK_COURSES].sort((a,b)=>(b.views||0)-(a.views||0)).map((c,i)=>(
                    <div key={c.id} className="ov-course-row">
                      <div style={{width:22,height:22,borderRadius:6,background:"var(--gradient)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.65rem",fontWeight:700,color:"white",fontFamily:"Syne,sans-serif",flexShrink:0}}>#{i+1}</div>
                      <span style={{fontSize:"1.1rem"}}>{c.image}</span>
                      <div style={{flex:1}}>
                        <div className="ov-course-name" style={{fontSize:"0.8rem"}}>{c.title}</div>
                        <div className="ov-course-students">{c.instructor}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,color:"#6366f1",fontSize:"0.9rem"}}>{c.views||0}</div>
                        <div style={{fontSize:"0.65rem",color:"var(--text3)"}}>{t("analytics.views")}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Per-course breakdown */}
            <div style={{marginTop:"1.5rem"}}>
              <div style={{fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"0.92rem",marginBottom:"1rem",color:"var(--text)"}}>
                📊 {t("analytics.perCourseBreakdown")}
              </div>
              <div className="ov-card">
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.82rem"}}>
                    <thead>
                      <tr style={{borderBottom:"1px solid var(--border2)"}}>
                        {[t("inst.coursesTitle"), t("analytics.views"), t("analytics.totalSubmissions"), t("analytics.reserved"), t("analytics.accepted"), t("analytics.rejected"), t("analytics.convRate")].map(h=>(
                          <th key={h} style={{padding:"0.6rem 0.875rem",textAlign:"left",fontSize:"0.7rem",color:"var(--text3)",fontWeight:600,whiteSpace:"nowrap"}}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CENTER_MOCK_COURSES.map(c=>{
                        const cReqs     = requests.filter(r=>r.course===c.title);
                        const cAccepted = cReqs.filter(r=>r.status==="accepted").length;
                        const cRejected = cReqs.filter(r=>r.status==="rejected").length;
                        const cReserved = cReqs.filter(r=>r.status==="reserved").length;
                        const cPending  = cReqs.filter(r=>r.status==="pending").length;
                        const cConv     = (c.views||0)>0?Math.round(cAccepted/(c.views||1)*100):0;
                        return (
                          <tr key={c.id} style={{borderBottom:"1px solid var(--border2)"}}>
                            <td style={{padding:"0.7rem 0.875rem"}}>
                              <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                                <span>{c.image}</span>
                                <div>
                                  <div style={{fontWeight:600,fontSize:"0.82rem"}}>{c.title}</div>
                                  <div style={{fontSize:"0.7rem",color:"var(--text3)"}}>{c.instructor}</div>
                                </div>
                              </div>
                            </td>
                            <td style={{padding:"0.7rem 0.875rem",fontFamily:"Syne,sans-serif",fontWeight:700,color:"#6366f1"}}>{c.views||0}</td>
                            <td style={{padding:"0.7rem 0.875rem"}}>{cReqs.length}</td>
                            <td style={{padding:"0.7rem 0.875rem",color:"#f59e0b",fontWeight:600}}>{cReserved}</td>
                            <td style={{padding:"0.7rem 0.875rem",color:"#22c55e",fontWeight:600}}>{cAccepted}</td>
                            <td style={{padding:"0.7rem 0.875rem",color:"#f87171"}}>{cRejected}</td>
                            <td style={{padding:"0.7rem 0.875rem"}}>
                              <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                                <div style={{flex:1,height:5,background:"var(--border2)",borderRadius:100}}>
                                  <div style={{height:"100%",width:`${Math.min(cConv,100)}%`,background:"linear-gradient(90deg,#6366f1,#22c55e)",borderRadius:100}}/>
                                </div>
                                <span style={{fontSize:"0.75rem",fontWeight:600,color:cConv>5?"#22c55e":"var(--text3)",minWidth:32}}>{cConv}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── REQUESTS ── */}
        {activeTab==="requests" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">Enrollment Requests</div>
                <div className="inst-page-sub">{pendingRequests} pending · {requests.filter(r=>r.status==="accepted").length} accepted · {requests.filter(r=>r.status==="rejected").length} rejected</div>
              </div>
            </div>
            <div className="requests-list">
              {requests.map(r=>(
                <div key={r.id} className="req-card">
                  <div className="req-avatar">{r.avatar}</div>
                  <div className="req-info">
                    <div className="req-name">{r.name}</div>
                    <div className="req-course-name">{r.course}</div>
                    <div className="req-details">
                      👨‍🏫 {r.instructor} &nbsp;·&nbsp;
                      <span className="req-payment-badge">
                        {r.status==="reserved"
                          ? `🔖 Reserved · SDG ${(r.amount*350).toLocaleString()}`
                          : `${r.payment==="bank"?"🏦 Bank":"📱 Mobile Money"} · SDG ${(r.amount*350).toLocaleString()}`
                        }
                      </span>
                    </div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div className="req-time">{r.time}</div>
                    {r.status==="pending"
                      ? <div className="req-actions" style={{marginTop:"0.5rem"}}>
                          <button className="req-btn-accept" onClick={()=>handleRequestAction(r.id,"accepted")}>✓ Accept</button>
                          <button className="req-btn-reject" onClick={()=>handleRequestAction(r.id,"rejected")}>✕ Reject</button>
                        </div>
                      : <span className={`req-status ${r.status}`} style={{display:"inline-block",marginTop:"0.5rem"}}>
                          {r.status==="accepted"?"✓ Accepted":"✕ Rejected"}
                        </span>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── FINANCES ── */}
        {activeTab==="finances" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">Finances</div>
                <div className="inst-page-sub">Revenue overview & instructor payouts</div>
              </div>
            </div>

            {/* Summary cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:"1rem",marginBottom:"1.5rem"}}>
              {[
                { icon:"💰", label:"Fee Revenue",      val:`SDG ${(totalStudents*FEE_PER_STUDENT).toLocaleString()}`, sub:`SDG ${FEE_PER_STUDENT} × ${totalStudents} students`, color:"#06b6d4" },
                { icon:"📅", label:"This Month",       val:"SDG 0",   sub:"No enrollments yet",   color:"#22c55e" },
                { icon:"⏳", label:"Pending Payments", val:"SDG 0",   sub:"Awaiting receipts",    color:"#fbbf24" },
              ].map(s=>(
                <div key={s.label} className="ov-stat-card">
                  <div className="ov-stat-glow" style={{background:s.color}}/>
                  <div className="ov-stat-icon">{s.icon}</div>
                  <div className="ov-stat-val" style={{background:`linear-gradient(135deg,${s.color},white)`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",fontSize:"1.4rem"}}>{s.val}</div>
                  <div className="ov-stat-lbl">{s.label}</div>
                  <div className="ov-stat-trend">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* Instructor payouts table */}
  <div style={{marginBottom:"0.75rem",background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.15)",borderRadius:10,padding:"0.875rem 1rem",fontSize:"0.82rem",color:"var(--text2)"}}>
              💡 Revenue model: Instructors set their own prices. The center earns a flat <strong style={{color:"var(--cyan)"}}>SDG {FEE_PER_STUDENT}</strong> per enrolled student — regardless of course price.
            </div>
            <div className="ov-card">
              <div className="ov-card-hd">Instructor Earnings & Center Fees</div>
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"0.85rem"}}>
                  <thead>
                    <tr style={{borderBottom:"1px solid var(--border2)"}}>
                      {["Instructor","Students","Price/Student","Gross Revenue","Center Fee (SDG 50×n)","Net to Instructor","Due"].map(h=>(
                        <th key={h} style={{padding:"0.65rem 1rem",textAlign:"left",fontSize:"0.72rem",color:"var(--text3)",fontWeight:600,fontFamily:"DM Sans,sans-serif",whiteSpace:"nowrap"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {instructors.filter(i=>i.status==="active").map(p=>(
                      <tr key={p.name} style={{borderBottom:"1px solid var(--border2)"}}>
                        <td style={{padding:"0.75rem 1rem"}}>
                          <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                            <div style={{width:28,height:28,borderRadius:"50%",background:"var(--gradient)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"0.62rem",fontWeight:700,color:"white",fontFamily:"Syne,sans-serif",flexShrink:0}}>{p.avatar}</div>
                            <span style={{fontWeight:600,fontSize:"0.82rem"}}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{padding:"0.75rem 1rem",color:"var(--text2)",fontSize:"0.82rem"}}>{p.students}</td>
                        <td style={{padding:"0.75rem 1rem",fontSize:"0.82rem"}}>${p.price}</td>
                        <td style={{padding:"0.75rem 1rem",fontSize:"0.82rem"}}>SDG {p.grossSDG.toLocaleString()}</td>
                        <td style={{padding:"0.75rem 1rem"}}>
                          <span style={{background:"rgba(99,102,241,0.1)",color:"var(--indigo-light)",padding:"0.2rem 0.6rem",borderRadius:100,fontSize:"0.75rem",fontWeight:600}}>SDG {p.centerFee.toLocaleString()}</span>
                        </td>
                        <td style={{padding:"0.75rem 1rem",fontWeight:600,color:"#22c55e",fontSize:"0.82rem"}}>SDG {p.netSDG.toLocaleString()}</td>
                        <td style={{padding:"0.75rem 1rem"}}>
                          {p.due>0 && !paidInstructors.includes(p.name)
                            ? <div style={{display:"flex",alignItems:"center",gap:"0.5rem"}}>
                                <span style={{color:"#fbbf24",fontWeight:600,fontSize:"0.82rem"}}>SDG {p.due.toLocaleString()}</span>
                                <button className="copy-btn" style={{background:"rgba(34,197,94,0.1)",color:"#22c55e",borderRadius:6}} onClick={()=>setPaidInstructors(prev=>[...prev,p.name])}>Mark Paid</button>
                              </div>
                            : <span style={{color:"#22c55e",fontSize:"0.78rem"}}>✓ Settled</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr style={{background:"var(--bg3)"}}>
                      <td colSpan={4} style={{padding:"0.875rem 1rem",fontWeight:700,fontSize:"0.82rem"}}>Total Center Revenue (flat fees)</td>
                      <td colSpan={3} style={{padding:"0.875rem 1rem",fontFamily:"Syne,sans-serif",fontWeight:800,color:"var(--cyan)",fontSize:"1rem"}}>
                        SDG {(totalStudents * FEE_PER_STUDENT).toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── CENTER PROFILE ── */}
        {activeTab==="profile" && (
          <div>
            <div className="inst-page-header">
              <div>
                <div className="inst-page-title">{t("center.tab.profile")}</div>
                <div className="inst-page-sub">{t("center.profileSubtitle")}</div>
              </div>
              <button className="btn btn-ghost" style={{padding:"0.6rem 1.25rem",fontSize:"0.875rem",borderRadius:9}} onClick={() => navigate(`/centers/${center.slug}`)}>
                {t("center.viewPublic")}
              </button>
            </div>

            <div className="inst-profile-grid">
              {/* Preview card */}
              <div className="inst-profile-card">
                <div style={{width:64,height:64,borderRadius:14,background:center.color,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Syne,sans-serif",fontWeight:800,color:"white",fontSize:"1.4rem",margin:"0 auto 1rem"}}>
                  {center.logo}
                </div>
                <div style={{fontFamily:"Syne,sans-serif",fontWeight:800,fontSize:"1rem",marginBottom:"0.2rem"}}>{center.name}</div>
                <div style={{fontSize:"0.8rem",color:"var(--text3)",marginBottom:"1rem"}}>{center.tagline}</div>
                <div style={{display:"flex",justifyContent:"space-around",paddingTop:"0.875rem",borderTop:"1px solid var(--border2)"}}>
                  <div style={{textAlign:"center"}}><div style={{fontFamily:"Syne,sans-serif",fontWeight:700}}>{center.courses}</div><div style={{fontSize:"0.68rem",color:"var(--text3)"}}>Courses</div></div>
                  <div style={{textAlign:"center"}}><div style={{fontFamily:"Syne,sans-serif",fontWeight:700}}>{center.instructors}</div><div style={{fontSize:"0.68rem",color:"var(--text3)"}}>Instructors</div></div>
                  <div style={{textAlign:"center"}}><div style={{fontFamily:"Syne,sans-serif",fontWeight:700}}>{center.rating}★</div><div style={{fontSize:"0.68rem",color:"var(--text3)"}}>Rating</div></div>
                </div>
                <div style={{marginTop:"1rem",fontSize:"0.78rem",color:"var(--text3)"}}>
                  📍 {center.location} · Est. {center.founded}
                </div>
              </div>

              {/* Edit form */}
              <div className="inst-profile-form">
                <div className="form-section-title">Center Identity</div>
                <div className="form-group"><label className="form-label">Center Name</label><input className="form-input" defaultValue={center.name}/></div>
                <div className="form-group"><label className="form-label">Tagline</label><input className="form-input" defaultValue={center.tagline}/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem"}}>
                  <div className="form-group"><label className="form-label">Location / City</label><input className="form-input" defaultValue={center.location}/></div>
                  <div className="form-group"><label className="form-label">Founded Year</label><input className="form-input" type="number" defaultValue={center.founded}/></div>
                </div>

                <div className="form-section-title">About & Specialties</div>
                <div className="form-group">
                  <label className="form-label">About the Center</label>
                  <textarea className="form-input" rows={3} style={{resize:"none",lineHeight:1.6}} defaultValue="Sudan's first data science and programming academy, training 2,400+ students since 2018. We focus on practical, job-ready skills for Sudan's growing tech industry."/>
                </div>
                <div className="form-group">
                  <label className="form-label">Specialties <span style={{fontWeight:400,color:"var(--text3)"}}>(comma-separated)</span></label>
                  <input className="form-input" defaultValue={center.specialties.join(", ")}/>
                </div>

                <div className="form-section-title">Contact & Location</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem"}}>
                  <div className="form-group"><label className="form-label">Phone</label><input className="form-input" placeholder="09xxxxxxxxx"/></div>
                  <div className="form-group"><label className="form-label">Email</label><input className="form-input" placeholder="info@center.sd"/></div>
                </div>
                <div className="form-group"><label className="form-label">Full Address</label><input className="form-input" placeholder="Street, area, city"/></div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.875rem"}}>
                  <div className="form-group"><label className="form-label">WhatsApp / Phone</label><input className="form-input" placeholder="0900-000-000"/></div>
                  <div className="form-group"><label className="form-label">Website</label><input className="form-input" placeholder="https://..."/></div>
                </div>

                <div style={{display:"flex",justifyContent:"flex-end",gap:"0.75rem",marginTop:"0.5rem"}}>
                  <button className="btn btn-ghost" style={{padding:"0.6rem 1.25rem",borderRadius:9,fontSize:"0.875rem"}} onClick={()=>setCenterProfileSaved(false)}>{t("center.discard")}</button>
                  <button className="btn btn-primary" style={{padding:"0.6rem 1.25rem",borderRadius:9,fontSize:"0.875rem"}} onClick={()=>setCenterProfileSaved(true)}>
                    {centerProfileSaved ? t("center.saved") : t("center.saveChanges")}
                  </button>
                </div>
                {centerProfileSaved && <div style={{textAlign:"right",fontSize:"0.78rem",color:"#22c55e",marginTop:"0.4rem"}}>{t("center.profileUpdated")}</div>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CenterOwnerDashboard;

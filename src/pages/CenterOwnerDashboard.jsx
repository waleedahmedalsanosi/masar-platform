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
import AddInstructorModal from "../modals/AddInstructorModal";
import CourseReviewModal from "../modals/CourseReviewModal";

const CENTER_MOCK_INSTRUCTORS = [
  { id:1, name:"Ahmed Hassan",    avatar:"AH", title:"Data Scientist",      courses:2, students:320, rating:4.8, revenue:168000, feePerStudent:50, status:"active",  joinDate:"Jan 2024" },
  { id:2, name:"Sara Mohamed",    avatar:"SM", title:"Full Stack Dev",       courses:1, students:210, rating:4.9, revenue:87500,  feePerStudent:50, status:"active",  joinDate:"Mar 2024" },
  { id:3, name:"Khalid Ibrahim",  avatar:"KI", title:"ML Engineer",          courses:1, students:180, rating:4.7, revenue:94500,  feePerStudent:50, status:"active",  joinDate:"Feb 2024" },
  { id:4, name:"Amira Osman",     avatar:"AO", title:"UI/UX Designer",       courses:1, students:0,   rating:0,   revenue:0,      feePerStudent:50, status:"pending", joinDate:"This week" },
];

const CENTER_MOCK_COURSES = [
  { id:1, image:"🐍", title:"Python for Data Science",       instructor:"Ahmed Hassan",  students:320, price:150, centerFee:50, status:"published", rating:4.8, publishDate:"Jan 10, 2024" },
  { id:3, image:"🤖", title:"Machine Learning Fundamentals", instructor:"Khalid Ibrahim",students:180, price:300, centerFee:50, status:"published", rating:4.7, publishDate:"Feb 5, 2024"  },
  { id:2, image:"🌐", title:"Full Stack Web Development",    instructor:"Sara Mohamed",  students:210, price:250, centerFee:50, status:"published", rating:4.9, publishDate:"Mar 1, 2024"  },
  { id:9, image:"🔧", title:"Data Engineering Bootcamp",     instructor:"Ahmed Hassan",  students:0,   price:280, centerFee:50, status:"active",    rating:0,   publishDate:"This week"     },
  { id:10,image:"🎨", title:"UI/UX Fundamentals",            instructor:"Amira Osman",   students:0,   price:120, centerFee:50, status:"draft",     rating:0,   publishDate:"—"             },
];

const CENTER_MOCK_REQUESTS = [
  { id:1, name:"Rania Hassan",  avatar:"RH", course:"Python for Data Science",       instructor:"Ahmed Hassan",  payment:"bank", amount:150, time:"2h ago",  status:"pending"  },
  { id:2, name:"Kamal Ibrahim", avatar:"KI", course:"Machine Learning Fundamentals", instructor:"Khalid Ibrahim",payment:"momo", amount:300, time:"4h ago",  status:"pending"  },
  { id:3, name:"Nour Abdallah", avatar:"NA", course:"Full Stack Web Development",    instructor:"Sara Mohamed",  payment:"bank", amount:250, time:"1d ago",  status:"accepted" },
  { id:4, name:"Yassir Musa",   avatar:"YM", course:"Python for Data Science",       instructor:"Ahmed Hassan",  payment:"momo", amount:150, time:"2d ago",  status:"rejected" },
  { id:5, name:"Salma Elzain",  avatar:"SE", course:"Machine Learning Fundamentals", instructor:"Khalid Ibrahim",payment:"bank", amount:300, time:"3d ago",  status:"accepted" },
];

const CENTER_FINANCES = {
  // Flat fee model: center earns SDG 50 per enrolled student (instructors keep the rest)
  feePerStudent: 50,
  totalStudents: 710,
  totalFeeRevenue: 35500,   // 710 students × SDG 50
  thisMonth: 6000,          // ~120 new students × SDG 50
  pending: 2500,            // fees not yet collected
  instructorEarnings: [
    { name:"Ahmed Hassan",   avatar:"AH", students:320, price:150, grossSDG:168000, centerFee:16000, netSDG:152000, paid:140000, due:12000 },
    { name:"Sara Mohamed",   avatar:"SM", students:210, price:250, grossSDG:87500,  centerFee:10500, netSDG:77000,  paid:77000,  due:0     },
    { name:"Khalid Ibrahim", avatar:"KI", students:180, price:300, grossSDG:94500,  centerFee:9000,  netSDG:85500,  paid:75000,  due:10500 },
  ],
};

function CenterOwnerDashboard({ user, setPage }) {
  const [activeTab, setActiveTab]   = useState("overview");
  const [instructors, setInstructors] = useState(CENTER_MOCK_INSTRUCTORS);
  const [courses, setCourses]       = useState(CENTER_MOCK_COURSES);
  const [requests, setRequests]     = useState(CENTER_MOCK_REQUESTS);
  const [showAddInstructor, setShowAddInstructor] = useState(false);
  const [editSplitInstructor, setEditSplitInstructor] = useState(null);
  const [reviewCourse, setReviewCourse] = useState(null);
  const [editProfile, setEditProfile] = useState(false);
  const [paidInstructors, setPaidInstructors] = useState([]);
  const [centerProfileSaved, setCenterProfileSaved] = useState(false);

  const center = CENTERS[0]; // Code Academy Sudan as default
  const name   = user?.name || "Omar Salih";
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

  const tabs = [
    { key:"overview",     label:"Overview",     icon:"📊" },
    { key:"instructors",  label:"Instructors",  icon:"👨‍🏫", badge: instructors.filter(i=>i.status==="pending").length || null },
    { key:"courses",      label:"Courses",      icon:"📚",  badge: pendingCourses || null },
    { key:"requests",     label:"Requests",     icon:"📥",  badge: pendingRequests || null },
    { key:"finances",     label:"Finances",     icon:"💰" },
    { key:"profile",      label:"Center Profile",icon:"🏢" },
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
                  + Add Instructor
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="ov-stats">
              <StatCard icon="👥" val={totalStudents.toLocaleString()} lbl="Total Students" trend={`across ${activeInstructors} instructors`} color="#6366f1" />
              <StatCard icon="📚" val={courses.filter(c=>c.status==="published").length} lbl="Active Courses" trend={"Instructors publish freely"} color="#06b6d4" onClick={pendingCourses?()=>setActiveTab("courses"):null} />
              <StatCard icon="⭐" val="4.8" lbl="Center Rating" trend="Top 5% on Masar" color="#fbbf24" />
              <StatCard icon="💰" val={`SDG ${(CENTER_FINANCES.totalFeeRevenue/1000).toFixed(1)}K`} lbl="Fee Revenue" trend={`SDG ${CENTER_FINANCES.feePerStudent}/student · ${CENTER_FINANCES.totalStudents} enrolled`} color="#22c55e" onClick={()=>setActiveTab("finances")} />
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
                <div className="inst-page-title">Instructors</div>
                <div className="inst-page-sub">{activeInstructors} active · {instructors.filter(i=>i.status==="pending").length} pending approval</div>
              </div>
              <button className="btn btn-primary" style={{padding:"0.6rem 1.25rem",fontSize:"0.875rem",borderRadius:9}} onClick={()=>setShowAddInstructor(true)}>
                + Add Instructor
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
              <span>Instructors publish courses freely. Each enrollment generates a <strong style={{color:"var(--cyan)"}}>SDG {CENTER_FINANCES.feePerStudent} flat fee</strong> for the center.</span>
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
                      {c.id<=8 && <button className="mgmt-btn mgmt-btn-view" onClick={()=>setPage("course-"+c.id)}>👁 View</button>}
                    </>
                  </div>
                </div>
              ))}
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
                      <span className="req-payment-badge">{r.payment==="bank"?"🏦 Bank":"📱 Mobile Money"} · SDG {(r.amount*350).toLocaleString()}</span>
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
                { icon:"💰", label:"Fee Revenue",      val:`SDG ${CENTER_FINANCES.totalFeeRevenue.toLocaleString()}`, sub:`SDG ${CENTER_FINANCES.feePerStudent} × ${CENTER_FINANCES.totalStudents} students`, color:"#06b6d4" },
                { icon:"📅", label:"This Month",       val:`SDG ${CENTER_FINANCES.thisMonth.toLocaleString()}`,   sub:"March 2025",       color:"#22c55e" },
                { icon:"⏳", label:"Pending Payments", val:`SDG ${CENTER_FINANCES.pending.toLocaleString()}`,     sub:"Awaiting receipts", color:"#fbbf24" },
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
              💡 Revenue model: Instructors set their own prices. The center earns a flat <strong style={{color:"var(--cyan)"}}>SDG {CENTER_FINANCES.feePerStudent}</strong> per enrolled student — regardless of course price.
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
                    {CENTER_FINANCES.instructorEarnings.map(p=>(
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
                        SDG {CENTER_FINANCES.totalFeeRevenue.toLocaleString()}
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
                <div className="inst-page-title">Center Profile</div>
                <div className="inst-page-sub">This is how students and instructors see your center on Masar</div>
              </div>
              <button className="btn btn-ghost" style={{padding:"0.6rem 1.25rem",fontSize:"0.875rem",borderRadius:9}} onClick={()=>setPage("center-"+center.slug)}>
                👁 View Public Page
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
                  <button className="btn btn-ghost" style={{padding:"0.6rem 1.25rem",borderRadius:9,fontSize:"0.875rem"}} onClick={()=>setCenterProfileSaved(false)}>Discard</button>
                  <button className="btn btn-primary" style={{padding:"0.6rem 1.25rem",borderRadius:9,fontSize:"0.875rem"}} onClick={()=>setCenterProfileSaved(true)}>
                    {centerProfileSaved?"✓ Saved!":"Save Changes"}
                  </button>
                </div>
                {centerProfileSaved && <div style={{textAlign:"right",fontSize:"0.78rem",color:"#22c55e",marginTop:"0.4rem"}}>✓ Center profile updated successfully</div>}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default CenterOwnerDashboard;

import { useState, useEffect } from "react";
import { api } from "../../services/api";
import AddCourseModal from "../../modals/AddCourseModal";
import EditCourseModal from "../../modals/EditCourseModal";
import AssignMarketerModal from "../../modals/AssignMarketerModal";
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from "../../contexts/AuthContext";

import Overview       from "./tabs/Overview";
import CoursesList    from "./tabs/CoursesList";
import AnalyticsTab   from "./tabs/AnalyticsTab";
import EnrollmentsList from "./tabs/EnrollmentsList";
import QAManager      from "./tabs/QAManager";
import MarketersList  from "./tabs/MarketersList";
import ProfileTab     from "./tabs/ProfileTab";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const { t } = useSettings();
  const instructorId = user?.id || 1;

  const [activeTab, setActiveTab]     = useState("overview");
  const [courses, setCourses]         = useState([]);
  const [requests, setRequests]       = useState([]);
  const [qaItems, setQaItems]         = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [views, setViews]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editCourse, setEditCourse]   = useState(null);
  const [showAssignMarketer, setShowAssignMarketer] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [c, r, q, a, v] = await Promise.all([
          api.getCourses(instructorId),
          api.getRequests(instructorId),
          api.getQA(instructorId),
          api.getMarketerAssignments(instructorId),
          api.getAllCourseViews(),
        ]);
        setCourses(c); setRequests(r); setQaItems(q); setAssignments(a); setViews(v);
      } catch { } finally { setLoading(false); }
    };
    load();
  }, [instructorId]);

  const pendingCount    = requests.filter(r => r.status === "pending").length;
  const unansweredCount = qaItems.filter(q => !q.answer).length;

  const handleRequestAction = async (id, action) => {
    await api.updateRequest(id, { status: action });
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
  };

  const handleReply = async (id, text) => {
    await api.replyQA(id, text);
    setQaItems(prev => prev.map(q => q.id === id ? { ...q, answer: text } : q));
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

  const tabs = [
    { key: "overview",   label: t("inst.tab.overview"),   icon: "📊" },
    { key: "courses",    label: t("inst.tab.courses"),     icon: "📚" },
    { key: "analytics",  label: t("analytics.tab"),        icon: "📈" },
    { key: "requests",   label: t("inst.tab.requests"),    icon: "📥", badge: pendingCount || null },
    { key: "qa",         label: t("inst.tab.qa"),          icon: "💬", badge: unansweredCount || null },
    { key: "marketers",  label: t("inst.tab.marketers"),   icon: "📢", badge: assignments.length || null },
    { key: "profile",    label: t("inst.tab.profile"),     icon: "👤" },
  ];

  if (loading) return (
    <div className="inst-dash" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text3)" }}>
        <div style={{ fontSize: "2rem", marginBottom: "0.75rem", animation: "spin 1s linear infinite" }}>⏳</div>
        <div>{t("inst.loading")}</div>
      </div>
    </div>
  );

  return (
    <div className="inst-dash">
      {showAddCourse      && <AddCourseModal onClose={() => setShowAddCourse(false)} onSave={handleAddCourse} />}
      {editCourse         && <EditCourseModal course={editCourse} onClose={() => setEditCourse(null)} onSave={handleEditCourse} />}
      {showAssignMarketer && <AssignMarketerModal courses={courses} onClose={() => setShowAssignMarketer(false)} onSave={handleAssignMarketer} />}

      <div className="inst-topbar">
        {tabs.map(tab => (
          <div key={tab.key} className={`inst-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            <span>{tab.icon}</span> {tab.label}
            {tab.badge && <span className="tab-badge">{tab.badge}</span>}
          </div>
        ))}
      </div>

      <div className="inst-content">
        {activeTab === "overview"  && <Overview courses={courses} requests={requests} pendingCount={pendingCount} setActiveTab={setActiveTab} onAddCourse={() => setShowAddCourse(true)} />}
        {activeTab === "courses"   && <CoursesList courses={courses} onAddCourse={() => setShowAddCourse(true)} onEditCourse={setEditCourse} onPublish={handlePublish} />}
        {activeTab === "analytics" && <AnalyticsTab courses={courses} requests={requests} views={views} />}
        {activeTab === "requests"  && <EnrollmentsList requests={requests} onAction={handleRequestAction} />}
        {activeTab === "qa"        && <QAManager qaItems={qaItems} onReply={handleReply} />}
        {activeTab === "marketers" && <MarketersList assignments={assignments} requests={requests} courses={courses} onAssign={() => setShowAssignMarketer(true)} onRemove={handleRemoveAssignment} />}
        {activeTab === "profile"   && <ProfileTab courses={courses} />}
      </div>
    </div>
  );
}

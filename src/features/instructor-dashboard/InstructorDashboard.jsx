import { useState } from "react";
import AddCourseModal from "../../modals/AddCourseModal";
import EditCourseModal from "../../modals/EditCourseModal";
import AssignMarketerModal from "../../modals/AssignMarketerModal";
import { useSettings } from "../../contexts/SettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import {
  useInstructorCourses,
  useInstructorRequests,
  useInstructorQA,
  useMarketerAssignments,
  useAllCourseViews,
  useCreateCourse,
  useUpdateCourse,
  useUpdateRequest,
  useReplyQA,
  useCreateAssignment,
  useDeleteAssignment,
} from "./hooks/useInstructorData";

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
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [editCourse, setEditCourse]   = useState(null);
  const [showAssignMarketer, setShowAssignMarketer] = useState(false);

  // ── Data queries ──────────────────────────────────────────────
  const { data: courses     = [], isLoading: lCourses  } = useInstructorCourses(instructorId);
  const { data: requests    = [], isLoading: lRequests } = useInstructorRequests(instructorId);
  const { data: qaItems     = [], isLoading: lQA       } = useInstructorQA(instructorId);
  const { data: assignments = [], isLoading: lAssign   } = useMarketerAssignments(instructorId);
  const { data: views       = []                       } = useAllCourseViews();

  const loading = lCourses || lRequests || lQA || lAssign;

  // ── Mutations ─────────────────────────────────────────────────
  const createCourse      = useCreateCourse(instructorId);
  const updateCourse      = useUpdateCourse(instructorId);
  const updateRequest     = useUpdateRequest(instructorId);
  const replyQA           = useReplyQA(instructorId);
  const createAssignment  = useCreateAssignment(instructorId);
  const deleteAssignment  = useDeleteAssignment(instructorId);

  const pendingCount    = requests.filter(r => r.status === "pending").length;
  const unansweredCount = qaItems.filter(q => !q.answer).length;

  const handleRequestAction = (id, action) =>
    updateRequest.mutate({ id, updates: { status: action } });

  const handleReply = (id, text) =>
    replyQA.mutate({ id, answer: text });

  const handleAddCourse = (formData) => {
    createCourse.mutate({
      instructorId, title: formData.title, image: formData.image, category: formData.category,
      level: formData.level, mode: formData.mode, price: Number(formData.price), status: "draft",
      students: 0, rating: 0, revenue: 0, startDate: formData.startDate || "TBD",
      duration: formData.duration || "", description: formData.description, tags: formData.tags,
      enrollmentFields: formData.enrollmentFields, meetLink: formData.meetLink || "",
      groupLink: formData.groupLink || "", location: formData.location || "",
      scheduleDays: formData.scheduleDays, weeks: formData.weeks,
    }, {
      onSuccess: () => { setShowAddCourse(false); setActiveTab("courses"); },
    });
  };

  const handleEditCourse = (updated) =>
    updateCourse.mutate({ id: updated.id, updates: updated }, {
      onSuccess: () => setEditCourse(null),
    });

  const handlePublish = (courseId) =>
    updateCourse.mutate({ id: courseId, updates: { status: "active" } });

  const handleAssignMarketer = (data) =>
    createAssignment.mutate(data, {
      onSuccess: () => setShowAssignMarketer(false),
    });

  const handleRemoveAssignment = (id) =>
    deleteAssignment.mutate(id);

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

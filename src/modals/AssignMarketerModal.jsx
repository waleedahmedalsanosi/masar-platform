/**
 * @file AssignMarketerModal.jsx
 * @description نافذة تعيين مسوق لكورس
 *
 * تتيح للمدرب اختيار كورس، تحديد مسوق من القائمة، وتعيين نسبة العمولة.
 */

import { useState, useEffect } from "react";
import { api } from "../services/api";

function AssignMarketerModal({ courses, onClose, onSave }) {
  const [courseId,          setCourseId]          = useState("");
  const [selectedMarketer,  setSelectedMarketer]  = useState(null);
  const [commissionRate,    setCommissionRate]     = useState(10);
  const [marketers,         setMarketers]          = useState([]);
  const [search,            setSearch]             = useState("");
  const [loading,           setLoading]            = useState(false);
  const [loadingMarketers,  setLoadingMarketers]   = useState(true);

  useEffect(() => {
    api.getMarketers()
      .then(setMarketers)
      .catch(() => {})
      .finally(() => setLoadingMarketers(false));
  }, []);

  const filtered = marketers.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  const selectedCourse = courses.find(c => String(c.id) === String(courseId));
  const commissionPerStudent = selectedCourse
    ? Math.round(selectedCourse.price * 350 * commissionRate / 100)
    : 0;

  const handleSave = async () => {
    if (!courseId || !selectedMarketer) return;
    setLoading(true);
    try {
      const assignment = await api.createAssignment({
        courseId:      String(courseId),
        instructorId:  String(selectedCourse.instructorId),
        marketerId:    String(selectedMarketer.id),
        marketerName:  selectedMarketer.name,
        marketerEmail: selectedMarketer.email,
        courseName:    selectedCourse.title,
        commissionRate: Number(commissionRate),
        createdAt:     new Date().toISOString(),
      });
      onSave(assignment);
    } catch {
      setLoading(false);
    }
  };

  return (
    <div
      style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.6)",backdropFilter:"blur(4px)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:"1rem" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div style={{ background:"var(--bg2)",border:"1px solid var(--border2)",borderRadius:16,width:"100%",maxWidth:500,maxHeight:"90vh",overflowY:"auto",boxShadow:"0 24px 64px rgba(0,0,0,0.5)" }}>

        {/* Header */}
        <div style={{ padding:"1.25rem 1.5rem",borderBottom:"1px solid var(--border2)",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"Syne,sans-serif",fontWeight:700,fontSize:"1.1rem" }}>📢 Assign Marketer</div>
            <div style={{ fontSize:"0.78rem",color:"var(--text3)",marginTop:"0.2rem" }}>Select a marketer and set their commission</div>
          </div>
          <button onClick={onClose} style={{ background:"var(--bg3)",border:"1px solid var(--border2)",borderRadius:8,width:32,height:32,cursor:"pointer",color:"var(--text2)",fontSize:"1rem",display:"flex",alignItems:"center",justifyContent:"center" }}>✕</button>
        </div>

        <div style={{ padding:"1.5rem" }}>

          {/* Course select */}
          <div className="form-group">
            <label className="form-label">Course</label>
            <select
              className="acm-select"
              value={courseId}
              onChange={e => setCourseId(e.target.value)}
              style={{ width:"100%" }}
            >
              <option value="">— Select a course —</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.image} {c.title}</option>
              ))}
            </select>
          </div>

          {/* Commission rate */}
          <div className="form-group">
            <label className="form-label">Commission Rate (%)</label>
            <input
              className="form-input"
              type="number"
              min="1"
              max="50"
              value={commissionRate}
              onChange={e => setCommissionRate(e.target.value)}
            />
            {selectedCourse && (
              <div style={{ fontSize:"0.75rem",color:"var(--text3)",marginTop:"0.3rem" }}>
                = SDG {commissionPerStudent.toLocaleString()} per accepted student
              </div>
            )}
          </div>

          {/* Marketer search */}
          <div className="form-group">
            <label className="form-label">Select Marketer</label>
            <input
              className="form-input"
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Marketer list */}
          <div style={{ border:"1px solid var(--border2)",borderRadius:10,marginBottom:"1.25rem",maxHeight:220,overflowY:"auto" }}>
            {loadingMarketers && (
              <div style={{ textAlign:"center",padding:"1.5rem",color:"var(--text3)",fontSize:"0.82rem" }}>Loading marketers...</div>
            )}
            {!loadingMarketers && filtered.length === 0 && (
              <div style={{ textAlign:"center",padding:"2rem",color:"var(--text3)",fontSize:"0.82rem" }}>
                {marketers.length === 0
                  ? "No marketers registered yet. Ask marketers to create an account."
                  : "No results found."}
              </div>
            )}
            {filtered.map(m => {
              const initials = m.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
              const isSelected = selectedMarketer?.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => setSelectedMarketer(m)}
                  style={{ padding:"0.75rem 1rem",borderBottom:"1px solid var(--border2)",cursor:"pointer",background:isSelected?"rgba(99,102,241,0.08)":"transparent",display:"flex",gap:"0.75rem",alignItems:"center",transition:"background 0.15s" }}
                >
                  <div style={{ width:36,height:36,borderRadius:"50%",background:"var(--gradient)",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,color:"white",fontSize:"0.75rem",flexShrink:0 }}>
                    {initials}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600,fontSize:"0.875rem" }}>{m.name}</div>
                    <div style={{ fontSize:"0.75rem",color:"var(--text3)" }}>{m.email}</div>
                  </div>
                  {isSelected && <div style={{ color:"var(--indigo)",fontWeight:700 }}>✓</div>}
                </div>
              );
            })}
          </div>

          {/* Preview */}
          {selectedMarketer && selectedCourse && (
            <div style={{ background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:10,padding:"0.875rem",marginBottom:"1.25rem",fontSize:"0.82rem",lineHeight:1.8 }}>
              <strong style={{ color:"var(--text)" }}>📋 Assignment Preview</strong><br />
              <span style={{ color:"var(--text2)" }}>
                <strong>{selectedMarketer.name}</strong> will market <strong>{selectedCourse.image} {selectedCourse.title}</strong><br />
                Commission: <strong style={{ color:"var(--cyan)" }}>{commissionRate}%</strong> = SDG {commissionPerStudent.toLocaleString()} per student
              </span>
            </div>
          )}

          {/* Actions */}
          <div style={{ display:"flex",gap:"0.75rem" }}>
            <button
              className="btn btn-ghost"
              style={{ flex:1,padding:"0.875rem",borderRadius:10 }}
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              style={{ flex:2,padding:"0.875rem",borderRadius:10,opacity:(!courseId||!selectedMarketer||loading)?0.5:1 }}
              disabled={!courseId || !selectedMarketer || loading}
              onClick={handleSave}
            >
              {loading ? "Saving..." : "Assign Marketer →"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AssignMarketerModal;

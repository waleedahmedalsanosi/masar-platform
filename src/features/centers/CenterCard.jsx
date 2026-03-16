import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../../shared/components/StarRating";

export default function CenterCard({ center }) {
  const navigate = useNavigate();

  return (
    <div className="center-card" onClick={() => navigate(`/centers/${center.slug}`)} style={{ cursor: "pointer" }}>
      <div className="center-header">
        <div className="center-glow" style={{ background: center.color }} />
        <div className="center-logo" style={{ background: center.color }}>{center.logo}</div>
        <div className="center-name">{center.name}</div>
        <div className="center-tagline">{center.tagline}</div>
      </div>
      <div className="center-body">
        <div className="center-stats">
          <div className="c-stat"><div className="c-stat-val">{center.courses}</div><div className="c-stat-lbl">Courses</div></div>
          <div className="c-stat"><div className="c-stat-val">{center.instructors}</div><div className="c-stat-lbl">Instructors</div></div>
          <div className="c-stat"><div className="c-stat-val">{center.students.toLocaleString()}</div><div className="c-stat-lbl">Students</div></div>
        </div>
        <div className="center-specs">
          {center.specialties.map(s => <span key={s} className="spec-tag">{s}</span>)}
        </div>
        <div className="center-meta">
          <span className="center-location">📍 {center.location} · Est. {center.founded}</span>
          <div className="center-rating"><StarRating rating={center.rating} /> {center.rating}</div>
        </div>
      </div>
    </div>
  );
}

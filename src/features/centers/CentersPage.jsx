import CenterCard from "./CenterCard";
import Footer from "../../shared/components/Footer";
import { usePublicCenters } from "../courses/hooks/usePublicData";

export default function CentersPage() {
  const { data: centers = [], isLoading } = usePublicCenters();

  return (
    <>
      <div style={{ paddingTop: 100 }}>
        <section className="section">
          <div className="section-header">
            <div className="section-tag">Training Centers</div>
            <h2 className="section-title">25+ Partner Centers</h2>
            <p className="section-sub">Every center is verified, transparent, and ready to help you grow.</p>
          </div>
          <div className="centers-grid">
            {centers.map(c => <CenterCard key={c.id} center={c} />)}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

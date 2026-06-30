// src/pages/MaintenancePage.jsx
export default function MaintenancePage() {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "24px",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "32px", color: "#534AB7", marginBottom: "12px" }}>
        Diocèse de Kabgayi
      </h1>
      <p style={{ fontSize: "18px", color: "#333", marginBottom: "8px" }}>
        Le site est actuellement en maintenance.
      </p>
      <p style={{ fontSize: "14px", color: "#777" }}>
        Nous serons de retour très bientôt. Merci de votre patience.
      </p>
    </div>
  );
}
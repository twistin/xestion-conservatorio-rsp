import React from "react";
import { useNavigate } from "react-router-dom";
import cmusLogo from "../public/cmus.png";
import Button from "../components/ui/Button";

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
      <img src={cmusLogo} alt="Logo Conservatorio" style={{ width: 160, marginBottom: 32 }} />
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, color: "#1e293b" }}>Benvido/a ao Sistema de Xestión do Conservatorio</h1>
      <p style={{ fontSize: 18, color: "#475569", marginBottom: 32, textAlign: "center", maxWidth: 400 }}>
        Xestione alumnado, profesorado, cursos e informes de forma sinxela e eficiente.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => navigate("/login")}
        style={{ fontSize: 18, padding: "12px 32px" }}
      >
        Entrar
      </Button>
    </div>
  );
};

export default WelcomePage;

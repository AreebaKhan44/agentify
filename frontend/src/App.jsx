import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./index.css";
import { useBot } from "./hooks/useBot";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ConnectPage from "./pages/ConnectPage";
import Leads from "./pages/Leads";
import KnowledgeBase from "./pages/KnowledgeBase";
import Analytics from "./pages/Analytics";

function AppShell() {
  const location = useLocation();
  const isLanding = location.pathname === "/";
  const { status, qrImage, isReady, stats, leads, refresh } = useBot();

  return (
    <div style={{ display: "flex" }}>
      {!isLanding && <Sidebar isReady={isReady} />}
      <div style={{ marginLeft: isLanding ? 0 : 240, flex: 1, minHeight: "100vh" }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard stats={stats} leads={leads} isReady={isReady} />} />
          <Route path="/connect" element={<ConnectPage qrImage={qrImage} status={status} isReady={isReady} onRefresh={refresh} />} />
          <Route path="/leads" element={<Leads leads={leads} />} />
          <Route path="/kb" element={<KnowledgeBase />} />
          <Route path="/analytics" element={<Analytics leads={leads} stats={stats} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}

import { useState, useEffect, useCallback } from "react";
import { api } from "../utils/api";

export function useBot() {
  const [status, setStatus] = useState("starting");
  const [qrImage, setQrImage] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [stats, setStats] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const data = await api.getQR();
      console.log("📡 Backend response:", data);

      const s = data.status || "starting";
      setStatus(s);
      setIsReady(data.ready || false);

      if (s === "qr" && data.qr) {
        setQrImage(data.qr);
      } else {
        setQrImage(null);
      }
    } catch (err) {
      console.error("❌ Cannot reach backend:", err.message);
      setStatus("error");
      setQrImage(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await api.getStats();
      setStats(data);
    } catch (err) {
      console.warn("Stats fetch failed:", err.message);
    }
  }, []);

  const fetchLeads = useCallback(async () => {
    try {
      const data = await api.getLeads();
      setLeads(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn("Leads fetch failed:", err.message);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchStats();
    fetchLeads();

    const interval = setInterval(() => {
      fetchStatus();
      fetchStats();
    }, 3000);

    const leadsInterval = setInterval(fetchLeads, 15000);

    return () => {
      clearInterval(interval);
      clearInterval(leadsInterval);
    };
  }, [fetchStatus, fetchStats, fetchLeads]);

  return { status, qrImage, isReady, stats, leads, loading, refresh: fetchStatus };
}

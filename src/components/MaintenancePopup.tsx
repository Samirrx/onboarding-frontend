import { useState, useEffect } from "react";
import {
  Wrench,
  X,
  CalendarClock,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";

interface Maintenance {
  id: number;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  impact: string;
}

export default function MaintenancePopup({ tenantId }: { tenantId: string }) {
  const [maintenance, setMaintenance] = useState<Maintenance | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    fetchMaintenance();
  }, []);

  const fetchMaintenance = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/onboarding/maintenance/active/${tenantId}`,
      );
      const list = res.data.data;
      if (list && list.length > 0) {
        const dismissed = sessionStorage.getItem(
          `maintenance_dismissed_${list[0].id}`,
        );
        if (!dismissed) {
          setMaintenance(list[0]);
          setShow(true);
        }
      }
    } catch (e) {}
  };

  const handleDontShow = () => {
    if (maintenance) {
      sessionStorage.setItem(`maintenance_dismissed_${maintenance.id}`, "true");
    }
    setShow(false);
  };

  const handleAcknowledge = () => setShow(false); // shows again on revisit
  const handleClose = () => setShow(false); // shows again on revisit

  if (!show || !maintenance) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-[760px] bg-white rounded-[28px] shadow-xl ring-1 ring-slate-900/5 p-6 sm:px-8 sm:py-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-500 via-amber-400 to-orange-400"></div>

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-4 mb-4 pr-8">
          <div className="relative flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100">
            <Wrench className="w-6 h-6 text-orange-600" />
            <div className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500 border-2 border-white"></span>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <h2 className="text-2xl font-extrabold text-slate-900">
              {maintenance.title}
            </h2>
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase bg-orange-100 text-orange-800">
              Scheduled Update
            </span>
          </div>
        </div>

        <p className="text-[14.5px] text-slate-600 leading-relaxed mb-4">
          {maintenance.description}
        </p>

        <div className="flex flex-wrap gap-4 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl mb-5">
          <div className="flex items-center gap-2">
            <CalendarClock size={16} className="text-slate-400" />
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Schedule:
            </span>
            <span className="text-[13px] font-bold text-slate-800 ml-1">
              {new Date(maintenance.startDatetime).toLocaleString()}
              <span className="font-medium text-slate-500 ml-1">
                • to {new Date(maintenance.endDatetime).toLocaleString()}
              </span>
            </span>
          </div>
          <div className="w-px h-5 bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            <span className="text-[10px] font-bold uppercase text-orange-600/70">
              Impact:
            </span>
            <span className="text-[13px] font-bold text-orange-900 ml-1">
              {maintenance.impact}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center w-5 h-5">
              <input
                type="checkbox"
                onChange={handleDontShow}
                className="peer w-5 h-5 appearance-none border-2 border-slate-300 rounded-md checked:bg-orange-500 checked:border-orange-500 transition-all cursor-pointer"
              />
              <CheckCircle2
                size={14}
                className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none"
                strokeWidth={3}
              />
            </div>
            <span className="text-[13.5px] font-medium text-slate-500 group-hover:text-slate-800">
              Don't show this again
            </span>
          </label>

          <button
            onClick={handleAcknowledge}
            className="w-full sm:w-auto px-8 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[14px] font-semibold rounded-full shadow-md"
          >
            Acknowledge
          </button>
        </div>
      </div>
    </div>
  );
}

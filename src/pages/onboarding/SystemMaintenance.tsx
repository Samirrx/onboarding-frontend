"use client";

import { useState, useEffect, useRef } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  Loader2,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  fetchAllMaintenance,
  createMaintenance,
  updateMaintenance,
  deleteMaintenance,
} from "@/services/controllers/maintenanceApi";
import { fetchTenantList } from "@/services/controllers/onboarding";

interface Tenant {
  tenantId: string;
  companyName: string;
}

interface Maintenance {
  id?: number;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  downtimeMinutes?: number;
  impact?: string;
  impactLevel?: string;
  status: string;
  tenantIds: string;
  environment: string;
}

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: "bg-green-50 text-green-700 border-green-200",
  SCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
  INACTIVE: "bg-slate-100 text-slate-500 border-slate-200",
};

const IMPACT_COLOR: Record<string, string> = {
  High: "text-red-600",
  Medium: "text-orange-500",
  Low: "text-yellow-600",
};

const toLocalDateTimeInput = (isoString: string): string => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60 * 1000);
  return localDate.toISOString().slice(0, 16);
};

// Triple dot dropdown component
function ActionMenu({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={() => setOpen((prev) => !prev)}
      >
        <MoreVertical className="h-4 w-4" />
      </Button>
      {open && (
        <div className="absolute right-0 z-50 mt-1 w-36 rounded-md border bg-white shadow-md dark:bg-slate-900 dark:border-slate-700">
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function SystemMaintenancePage() {
  const [maintenanceList, setMaintenanceList] = useState<Maintenance[]>([]);
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [tenantsLoading, setTenantsLoading] = useState(false);

  // Delete modal states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Maintenance | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const emptyForm: Maintenance = {
    title: "",
    description: "",
    startDatetime: "",
    endDatetime: "",
    status: "SCHEDULED",
    tenantIds: "",
    environment: "",
    impactLevel: "",
  };
  const [form, setForm] = useState<Maintenance>(emptyForm);

  useEffect(() => {
    loadMaintenance();
  }, []);

  const loadMaintenance = async () => {
    setListLoading(true);
    try {
      const res = await fetchAllMaintenance();
      setMaintenanceList(res?.result || res?.data || []);
    } catch (e) {
      console.error("Error fetching maintenance:", e);
    } finally {
      setListLoading(false);
    }
  };

  const loadTenants = async (env: string) => {
    if (!env) {
      setTenants([]);
      return;
    }
    setTenantsLoading(true);
    try {
      const res = await fetchTenantList(env);
      setTenants(res?.data?.result || res?.result || []);
    } catch (e) {
      console.error("Error fetching tenants:", e);
      setTenants([]);
    } finally {
      setTenantsLoading(false);
    }
  };

  const calcDowntime = (start: string, end: string) => {
    if (!start || !end) return "";
    const diff = new Date(end).getTime() - new Date(start).getTime();
    if (diff <= 0) return "";
    const mins = Math.floor(diff / (1000 * 60));
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return `~${hrs > 0 ? hrs + "h " : ""}${rem > 0 ? rem + "m" : ""} downtime`;
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (editItem?.id) {
        await updateMaintenance(editItem.id, { ...form });
      } else {
        await createMaintenance({ ...form });
      }
      closeForm();
      await loadMaintenance();
    } catch (e) {
      console.error("Error saving maintenance:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Maintenance) => {
    setEditItem(item);
    setForm({
      ...item,
      startDatetime: toLocalDateTimeInput(item.startDatetime),
      endDatetime: toLocalDateTimeInput(item.endDatetime),
      impactLevel: item.impactLevel || "",
    });
    if (item.environment) loadTenants(item.environment);
    setShowForm(true);
  };

  const handleDeleteClick = (item: Maintenance) => {
    setDeleteItem(item);
    setDeleteConfirmText("");
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== "DELETE" || !deleteItem?.id) return;
    setIsDeleting(true);
    try {
      await deleteMaintenance(deleteItem.id);
      setMaintenanceList((prev) => prev.filter((m) => m.id !== deleteItem.id));
      setIsDeleteDialogOpen(false);
      setDeleteItem(null);
    } catch (e) {
      console.error("Error deleting maintenance:", e);
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleTenant = (tenantId: string) => {
    const ids = form.tenantIds ? form.tenantIds.split(",").filter(Boolean) : [];
    const idx = ids.indexOf(tenantId);
    if (idx >= 0) ids.splice(idx, 1);
    else ids.push(tenantId);
    setForm({ ...form, tenantIds: ids.join(",") });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditItem(null);
    setForm(emptyForm);
    setTenants([]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* ── Header ── */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col items-start">
          <h1 className="text-3xl font-bold tracking-tight">
            System Maintenance
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure maintenance popups for tenants
          </p>
        </div>
        <Button
          className="gap-2"
          onClick={() => {
            setShowForm(true);
            setEditItem(null);
            setForm(emptyForm);
            setTenants([]);
          }}
        >
          <Plus className="h-5 w-5" />
          New Maintenance
        </Button>
      </div>

      {/* ── Table ── */}
      <div className="rounded-md border">
        {/* Table header */}
        <div className="bg-slate-50 dark:bg-slate-900/50 p-4 grid grid-cols-12 font-medium text-sm border-b">
          <div className="col-span-3 text-left">Title</div>
          <div className="col-span-3 text-left">Schedule</div>
          <div className="col-span-1 text-left">Impact</div>
          <div className="col-span-2 text-left">Status</div>
          <div className="col-span-1 text-left">Tenants</div>
          <div className="col-span-1 text-left">Environment</div>
          <div className="col-span-1 text-right pr-2">Actions</div>
        </div>

        {/* Empty / Loading states */}
        {listLoading && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            Loading...
          </div>
        )}
        {!listLoading && maintenanceList.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No maintenance records found.
          </div>
        )}

        {/* Rows */}
        <div className="h-[calc(100vh-16rem)] overflow-y-auto">
          {maintenanceList.map((item) => (
            <div
              key={item.id}
              className="p-4 grid grid-cols-12 gap-4 items-center border-b last:border-b-0 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors"
            >
              {/* Title + Description */}
              <div className="col-span-3">
                <div className="flex flex-col items-start">
                  <span className="font-medium">{item.title}</span>
                  {item.description && (
                    <span
                      className="text-sm text-muted-foreground mt-1 truncate max-w-56"
                      title={item.description}
                    >
                      {item.description}
                    </span>
                  )}
                </div>
              </div>

              {/* Schedule */}
              <div className="col-span-3">
                <div className="flex flex-col items-start">
                  <div className="text-sm">
                    {new Date(item.startDatetime).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    {calcDowntime(item.startDatetime, item.endDatetime) ||
                      "to " +
                        new Date(item.endDatetime).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                  </div>
                </div>
              </div>

              {/* Impact Level */}
              <div className="col-span-1">
                <span
                  className={`text-sm font-medium ${IMPACT_COLOR[item.impactLevel || ""] || "text-muted-foreground"}`}
                >
                  {item.impactLevel || "—"}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <Badge
                  variant="outline"
                  className={STATUS_BADGE[item.status] || STATUS_BADGE.INACTIVE}
                >
                  {item.status}
                </Badge>
              </div>

              {/* Tenants count */}
              <div className="col-span-1 text-sm text-muted-foreground">
                {item.tenantIds
                  ? `${item.tenantIds.split(",").filter(Boolean).length} tenant(s)`
                  : "—"}
              </div>

              {/* Environment */}
              <div className="col-span-1">
                <Badge
                  variant="outline"
                  className="text-xs uppercase tracking-wide"
                >
                  {item.environment || "—"}
                </Badge>
              </div>

              {/* Actions — triple dot */}
              <div className="col-span-1 flex justify-end">
                <ActionMenu
                  onEdit={() => handleEdit(item)}
                  onDelete={() => handleDeleteClick(item)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Create / Edit Form Dialog ── */}
      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
      >
        <DialogContent
          className="sm:max-w-3xl"
          style={{ width: "90vw", maxWidth: "900px" }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">
              {editItem ? "Edit Maintenance" : "New Maintenance"}
            </DialogTitle>
            <DialogDescription>
              {editItem
                ? "Update the maintenance details below."
                : "Fill in the details to schedule a new maintenance window."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 max-h-[70vh] overflow-y-auto pr-1">
            {/* Environment + Impact */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Environment <span className="text-red-500">*</span>
                </label>
                <select
                  className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  value={form.environment}
                  onChange={(e) => {
                    const env = e.target.value;
                    setForm({ ...form, environment: env, tenantIds: "" });
                    loadTenants(env);
                  }}
                >
                  <option value="">Select Environment</option>
                  <option value="dev">Dev</option>
                  <option value="demo">Demo</option>
                  <option value="preprod">Preprod</option>
                  <option value="app">App (Production)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Impact Level
                </label>
                <select
                  className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  value={form.impactLevel || ""}
                  onChange={(e) =>
                    setForm({ ...form, impactLevel: e.target.value })
                  }
                >
                  <option value="">None</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                placeholder="e.g. Database Upgrade"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Description
              </label>
              <textarea
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none h-20"
                placeholder="Describe what will happen during maintenance..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            {/* Start & End */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  value={form.startDatetime}
                  onChange={(e) =>
                    setForm({ ...form, startDatetime: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  End Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                  value={form.endDatetime}
                  onChange={(e) =>
                    setForm({ ...form, endDatetime: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Downtime estimate */}
            {form.startDatetime &&
              form.endDatetime &&
              calcDowntime(form.startDatetime, form.endDatetime) && (
                <div className="px-3 py-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 rounded-md text-sm text-orange-700 dark:text-orange-400 font-medium">
                  ⏱ Auto-calculated downtime:{" "}
                  {calcDowntime(form.startDatetime, form.endDatetime)}
                </div>
              )}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select
                className="w-full border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="SCHEDULED">Scheduled</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>

            {/* Tenant Selection */}
            <div>
              <label className="block text-sm font-medium mb-1.5">
                Affected Tenants <span className="text-red-500">*</span>
              </label>

              {!form.environment ? (
                <div className="border border-dashed border-input rounded-md px-4 py-8 text-center text-sm text-muted-foreground">
                  Select an environment above to load tenants
                </div>
              ) : tenantsLoading ? (
                <div className="border border-input rounded-md px-4 py-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading
                  tenants...
                </div>
              ) : tenants.length === 0 ? (
                <div className="border border-input rounded-md px-4 py-8 text-center text-sm text-muted-foreground">
                  No tenants found for{" "}
                  <span className="font-semibold">{form.environment}</span>
                </div>
              ) : (
                <div className="border border-input rounded-md max-h-48 overflow-y-auto divide-y divide-border">
                  {tenants.map((t) => {
                    const selected = form.tenantIds
                      ?.split(",")
                      .filter(Boolean)
                      .includes(t.tenantId);
                    return (
                      <div
                        key={t.tenantId}
                        className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/20 ${selected ? "bg-slate-900 dark:bg-slate-100 hover:bg-slate-900" : ""}`}
                        onClick={() => toggleTenant(t.tenantId)}
                      >
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selected ? "bg-white border-white" : "border-slate-300 dark:border-slate-600"}`}
                        >
                          {selected && (
                            <CheckCircle2
                              size={12}
                              className="text-slate-900"
                            />
                          )}
                        </div>
                        <span
                          className={`text-sm font-medium flex-1 ${selected ? "text-white dark:text-slate-900" : ""}`}
                        >
                          {t.companyName}
                        </span>
                        <span
                          className={`text-xs ${selected ? "text-slate-400" : "text-muted-foreground"}`}
                        >
                          {t.tenantId.substring(0, 8)}...
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={closeForm} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                loading ||
                !form.title ||
                !form.startDatetime ||
                !form.endDatetime ||
                !form.tenantIds ||
                !form.environment
              }
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Saving..." : editItem ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirmation Dialog ── */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Maintenance
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              maintenance record{" "}
              <span className="font-medium">{deleteItem?.title}</span>.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Type <span className="font-bold">DELETE</span> to confirm:
            </p>
            <Input
              type="text"
              placeholder="Type 'DELETE' to confirm"
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              className="mb-4"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setDeleteItem(null);
                setDeleteConfirmText("");
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteConfirmText !== "DELETE" || isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

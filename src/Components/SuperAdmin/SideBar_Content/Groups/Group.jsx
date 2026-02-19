import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Loader2, RefreshCw, Search } from "lucide-react";
import toast from "react-hot-toast";
import {backendApi} from "../../../../utils/apiClients";

const cx = (...c) => c.filter(Boolean).join(" ");

export default function Group({ refresh }) {
  const [customGroups, setCustomGroups] = useState([]);  
  const [isLoading, setIsLoading] = useState(false);
  const [q, setQ] = useState("");

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await backendApi.get(`/s-admin/get-custom-groups`);
      setCustomGroups(res.data.data || []);
    } catch (error) {
      console.log("Error in custom list group", error);
      toast.error("Failed to fetch groups");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteHandler = async (id, groupName) => {
    const confirmed = window.confirm(
      `Delete "${groupName}"? This action cannot be undone.`
    );
    if (!confirmed) return;
                         
    setIsLoading(true);
    try {
      await backendApi.delete(`/s-admin/delete-custom-group?id=${id}`);
      toast.success("Group deleted successfully");
      fetchData();
    } catch (error) {
      console.log("Error in delete group", error);
      toast.error("Failed to delete group");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return customGroups;
    return customGroups.filter((x) => {
      const a = (x?.apiGroup || "").toLowerCase();
      const c = (x?.customGroup || "").toLowerCase();
      return a.includes(term) || c.includes(term);
    });
  }, [customGroups, q]);

  return (
    <div className="w-full">
      {/* New layout: title bar with search + stats */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-emerald-400 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(34,197,94,0.35)]">
              Group Registry
            </span>
          </h1>
          <p className="text-sm text-emerald-200/60 mt-1">
            View, search, and remove custom group mappings.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/15 bg-black/40 px-3 py-2">
            <Search className="h-4 w-4 text-emerald-200/50" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search api/custom..."
              className="w-64 max-w-full bg-transparent text-sm text-emerald-100 placeholder:text-emerald-200/30 focus:outline-none"
            />
            <span className="text-[11px] text-emerald-200/40">
              {filtered.length}/{customGroups.length}
            </span>
          </div>

          <motion.button
            onClick={fetchData}
            disabled={isLoading}
            whileHover={{ y: -2, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className={cx(
              "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5",
              "bg-emerald-500/10 text-emerald-100 border border-emerald-500/20",
              "hover:bg-emerald-500/15",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <RefreshCw className="h-5 w-5" />
            )}
            <span className="text-sm font-black tracking-wide">Refresh</span>
          </motion.button>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-3xl p-[1px] bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-500/10">
        <div className="rounded-3xl border border-emerald-500/15 bg-black/35 backdrop-blur-xl p-4 sm:p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Loader2 className="h-10 w-10 text-emerald-300 animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-emerald-200/60 text-sm">
                No groups found for your search.
              </div>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-hidden rounded-2xl border border-emerald-500/10">
                <table className="min-w-full">
                  <thead className="bg-gradient-to-r from-emerald-950/80 via-black/70 to-emerald-950/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-black tracking-wider text-emerald-100/80">
                        #
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black tracking-wider text-emerald-100/80">
                        API Group
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-black tracking-wider text-emerald-100/80">
                        Custom Group
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-black tracking-wider text-emerald-100/80">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-emerald-500/10">
                    {filtered.map((value, idx) => (
                      <tr
                        key={value?._id || idx}
                        className="hover:bg-emerald-500/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-emerald-100/80 font-semibold">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-100">
                          {value?.apiGroup}
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-100">
                          {value?.customGroup}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() => deleteHandler(value._id, value.customGroup)}
                            disabled={isLoading}
                            className={cx(
                              "inline-flex items-center justify-center rounded-xl p-2.5",
                              "bg-rose-500/10 border border-rose-500/20 text-rose-100",
                              "hover:bg-rose-500/15",
                              "disabled:opacity-50 disabled:cursor-not-allowed"
                            )}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile / Tablet cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {filtered.map((value, idx) => (
                  <motion.div
                    key={value?._id || idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 240, damping: 22, delay: idx * 0.03 }}
                    className="rounded-3xl border border-emerald-500/12 bg-black/40 backdrop-blur-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs text-emerald-200/60 font-semibold">
                          API GROUP
                        </div>
                        <div className="text-sm font-black text-emerald-100 break-words">
                          {value?.apiGroup}
                        </div>

                        <div className="mt-3 text-xs text-emerald-200/60 font-semibold">
                          CUSTOM GROUP
                        </div>
                        <div className="text-sm font-black text-emerald-100 break-words">
                          {value?.customGroup}
                        </div>
                      </div>

                      <button
                        onClick={() => deleteHandler(value._id, value.customGroup)}
                        className="rounded-2xl p-3 bg-rose-500/10 border border-rose-500/20 text-rose-100 hover:bg-rose-500/15"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="mt-4 text-[11px] text-emerald-200/40">
                      Record #{idx + 1}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

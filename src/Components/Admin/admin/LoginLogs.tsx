import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { backendApi } from "../../../utils/apiClients";
import { Search, ArrowLeft, RefreshCw } from "lucide-react";

// ✨ ambient visuals (same as other themed pages)
import { FloatingParticles } from "../../../utils/FloatingParticles";
import { AnimatedGrid } from "../../../utils/AnimatedGrid";

const LoginLogs = () => {
  const [challengesData, setChallengesData] = useState<any[]>([]);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchChallengesData = async () => {
    setLoader(true);
    try {
      const res = await backendApi.get(`/logs`);
      setChallengesData((res.data.data || []).reverse());
    } catch (error) {
      console.log("error in fetch user challenges", error);
      toast.error("Data fetching failed!");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchChallengesData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredData = challengesData?.filter((item: any) => {
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase().trim();
    const searchableFields = [
      item?.userId?.firstName,
      item?.userId?.email,
      item?.ip,
      item?.browser,
      item?.os,
      item?.userId?.phone,
      item?.country,
    ];

    return searchableFields.some((field) =>
      field?.toLowerCase()?.includes(searchLower)
    );
  });

  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1, "...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          pageNumbers.push(i);
        pageNumbers.push("...", totalPages);
      }
    }
    return pageNumbers;
  };

  const handleSearchChange = (e: any) => setSearchQuery(e.target.value);

  // format date ---------------------
  function formatDate(isoDateString?: string) {
    if (!isoDateString) return "--";
    const date = new Date(isoDateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return `${formattedDate}, ${formattedTime}`;
  }

  // since joined ---------------
  function calculateTimeSinceJoined(isoDateString?: string) {
    if (!isoDateString) return "--";
    const joinDate = new Date(isoDateString);
    const today = new Date();

    const timeDifference = today.getTime() - joinDate.getTime();
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    const parts: string[] = [];
    if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    return parts.length ? `${parts.join(", ")} ago` : "less than a minute ago";
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* ambient theme */}
      <AnimatedGrid />
      <FloatingParticles />

      <div className="max-w-7xl mx-auto pt-6 pb-16 px-4 sm:px-6 lg:px-8">
        {/* Sticky controls */}
        <div className="sticky top-0 z-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 pt-4 pb-3 backdrop-blur-md bg-gradient-to-b from-gray-900/80 to-transparent border-b border-slate-700/40">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.history.back()}
                className="flex items-center gap-2 rounded-full px-4 py-2 border border-slate-600/50 text-slate-300 hover:bg-slate-800/50 transition-all"
              >
                <ArrowLeft size={18} />
                Back
              </button>

              <h2 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 drop-shadow">
                Login Logs
              </h2>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-96">
                <input
                  type="text"
                  placeholder="Search by any field"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-900/50 border border-slate-700/60 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 backdrop-blur"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                onClick={fetchChallengesData}
                disabled={loader}
                className="px-4 py-2.5 rounded-2xl border border-slate-600/50 text-slate-200 hover:bg-slate-800/50 transition-all flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${loader ? "animate-spin" : ""}`} />
                {loader ? "Refreshing…" : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        {/* Table Card */}
        <div className="mt-6 bg-gradient-to-br from-slate-950 via-slate-800 to-slate-950 border border-slate-700/50 rounded-3xl shadow-2xl overflow-hidden">
          <div className="overflow-x-auto relative max-h-[70vh] overflow-y-auto custom-scrollbar">
            <table className="w-full min-w-[880px] whitespace-nowrap">
              {/* sticky header w/ glass effect */}
              <thead className="sticky top-0 z-10">
                <tr className="bg-slate-800/60 backdrop-blur border-b border-slate-700/60">
                  <th className="p-3 text-left font-medium text-slate-200">Name / Email</th>
                  <th className="p-3 text-center font-medium text-slate-200">Phone</th>
                  <th className="p-3 text-center font-medium text-slate-200">IP</th>
                  <th className="p-3 text-center font-medium text-slate-200">Browser</th>
                  <th className="p-3 text-center font-medium text-slate-200">OS</th>
                  <th className="p-3 text-center font-medium text-slate-200">Country</th>
                  <th className="p-3 text-center font-medium text-slate-200">Timestamp</th>
                </tr>
              </thead>

              <tbody>
                {loader ? (
                  <tr>
                    <td colSpan={7} className="py-10">
                      <div className="flex justify-center items-center gap-3 text-slate-300">
                        <span>Loading...</span>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-300" />
                      </div>
                    </td>
                  </tr>
                ) : paginatedData?.length ? (
                  paginatedData.map((value: any, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-slate-700/50 bg-slate-900/20 hover:bg-slate-900/40 transition-colors"
                    >
                      <td className="p-3 align-top">
                        <div className="text-slate-100">{value?.userId?.firstName || "--"}</div>
                        <div className="text-slate-400 text-sm">{value?.userId?.email || "--"}</div>
                      </td>

                      <td className="p-3 text-center text-slate-200">{value?.userId?.phone || "--"}</td>
                      <td className="p-3 text-center text-slate-200">{value?.ip || "--"}</td>

                      <td className="p-3 text-center">
                        {value?.browser ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-sm bg-blue-500/10 text-blue-300 border border-blue-500/30">
                            {value?.browser}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        {value?.os ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-sm bg-purple-500/10 text-purple-300 border border-purple-500/30">
                            {value?.os}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        {value?.country ? (
                          <span className="inline-flex px-3 py-1 rounded-full text-sm bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                            {value?.country}
                          </span>
                        ) : (
                          <span className="text-slate-400">--</span>
                        )}
                      </td>

                      <td className="py-3 text-center whitespace-nowrap px-4">
                        <div className="text-slate-200">{formatDate(value?.updatedAt)}</div>
                        <div className="text-xs text-slate-400">
                          {calculateTimeSinceJoined(value?.updatedAt)}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12">
                      <div className="text-center text-slate-400">
                        No results found for “{searchQuery}”
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* footer hint */}
          {!loader && filteredData?.length > 0 && (
            <div className="flex flex-wrap items-center justify-between px-4 sm:px-6 py-3 border-t border-slate-700/50 bg-slate-900/30">
              <div className="text-xs sm:text-sm text-slate-400">
                Showing {startIndex + 1} to{" "}
                {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="text-xs sm:text-sm text-slate-400">
                Total: <span className="text-slate-200">{filteredData.length}</span>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loader && filteredData?.length > 0 && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-xl transition-all border ${
                currentPage === 1
                  ? "bg-slate-800/40 text-slate-500 border-slate-700/60 cursor-not-allowed"
                  : "bg-slate-900/60 text-slate-100 border-slate-700/60 hover:bg-slate-800/70 hover:shadow-[0_0_20px_rgba(56,189,248,0.25)]"
              }`}
            >
              Previous
            </button>

            {getPageNumbers().map((pageNum, idx) => (
              <button
                key={idx}
                onClick={() => pageNum !== "..." && setCurrentPage(pageNum as number)}
                className={`px-3 py-2 rounded-xl transition-all border ${
                  pageNum === currentPage
                    ? "bg-cyan-500/20 text-cyan-200 border-cyan-500/40"
                    : pageNum === "..."
                    ? "bg-transparent text-slate-500 border-transparent cursor-default"
                    : "bg-slate-900/60 text-slate-100 border-slate-700/60 hover:bg-slate-800/70"
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-xl transition-all border ${
                currentPage === totalPages
                  ? "bg-slate-800/40 text-slate-500 border-slate-700/60 cursor-not-allowed"
                  : "bg-slate-900/60 text-slate-100 border-slate-700/60 hover:bg-slate-800/70 hover:shadow-[0_0_20px_rgba(147,51,234,0.25)]"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginLogs;

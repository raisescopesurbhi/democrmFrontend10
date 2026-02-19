import { useEffect, useState } from "react";
import {
  BadgeCheck,
  LoaderIcon,
  OctagonAlert,
  OctagonX,
  Search,
  RefreshCw,
  ShieldCheck,
  MailCheck,
  MailX,
  IdCard,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@headlessui/react";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "../../../redux/user/userSlice";
import UseUserHook from "../../../hooks/user/UseUserHook";
import toast from "react-hot-toast";
import { RiUserSharedFill } from "react-icons/ri";
import { FaUserEdit } from "react-icons/fa";
import { backendApi } from "../../../utils/apiClients";
import { CFcalculateTimeSinceJoined, CFformatDate } from "../../../utils/CustomFunctions";

const cx = (...c: Array<string | false | undefined | null>) => c.filter(Boolean).join(" ");

/** ✅ Exact theme */
const THEME = {
  bg0: "#0a0118",
  bg1: "#1a0b2e",
  bg2: "#16213e",
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.65)",
  borderSoft: "rgba(255,255,255,0.15)",
  gold: "#ffd700",
  purple: "#a855f7",
  pink: "#ec4899",
  blue: "#3b82f6",
  green: "#10b981",
  orange: "#f97316",
  red: "#ef4444",
  teal: "#14b8a6",
};

const AuroraBackdrop = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
    <div
      className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "1s" }}
    />
    <div
      className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse"
      style={{ animationDelay: "2s" }}
    />
  </div>
);

const StatusPill = ({ ok, okText, badText }: any) => {
  if (ok) {
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-emerald-500/15 text-emerald-200 border border-emerald-300/30 font-semibold">
        <BadgeCheck className="w-4 h-4" /> {okText}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm bg-red-500/15 text-red-200 border border-red-300/30 font-semibold">
      <OctagonX className="w-4 h-4" /> {badText}
    </span>
  );
};

type CircleFilterProps = {
  to?: string;
  onClick?: () => void;
  active?: boolean;
  label: string;
  Icon: any;
  accent: string;
  disabled?: boolean;
};

/** ✅ BIG circles like DashboardBase (desktop unchanged) */
const CircleFilter = ({ to, onClick, active, label, Icon, accent, disabled }: CircleFilterProps) => {
  const inner = (
    <div className="flex flex-col items-center gap-3 select-none">
      <div
        className={cx(
          "relative grid place-items-center rounded-full transition-transform duration-200",
          disabled ? "opacity-60 cursor-not-allowed" : "hover:scale-[1.05]"
        )}
        style={{
          width: 140,
          height: 140,
          background: active
            ? `radial-gradient(120% 120% at 30% 20%, ${accent}35, rgba(0,0,0,0.18) 62%)`
            : "rgba(255,255,255,0.07)",
          border: active ? `2px solid ${accent}85` : `2px solid rgba(255,255,255,0.18)`,
          boxShadow: active
            ? `0 0 40px ${accent}33, inset 0 0 26px ${accent}1a`
            : "inset 0 0 18px rgba(255,255,255,0.10)",
        }}
      >
        <div
          className="absolute inset-[-5px] rounded-full opacity-90"
          style={{
            background: `conic-gradient(from 180deg, ${THEME.gold}90, ${accent}, ${THEME.gold}25, ${accent})`,
            maskImage: "radial-gradient(circle, transparent 62%, black 63%)",
            WebkitMaskImage: "radial-gradient(circle, transparent 62%, black 63%)",
          }}
        />
        <div
          className="relative rounded-full border"
          style={{
            padding: 16,
            borderColor: `${accent}55`,
            background: `linear-gradient(135deg, ${accent}28, rgba(0,0,0,0))`,
            boxShadow: `inset 0 0 18px ${accent}18`,
          }}
        >
          <Icon className="w-8 h-8" style={{ color: active ? accent : THEME.gold }} />
        </div>
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ boxShadow: `0 0 34px ${accent}18` }} />
      </div>

      <div
        className={cx(
          "text-sm font-extrabold tracking-wide text-center leading-tight max-w-[160px]",
          active ? "text-white" : "text-white/75"
        )}
      >
        {label}
      </div>
    </div>
  );

  if (to) {
    return (
      <Link to={to} className={cx("inline-flex", disabled && "pointer-events-none")}>
        {inner}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx("inline-flex", disabled && "pointer-events-none")}
      type="button"
    >
      {inner}
    </button>
  );
};

const ManageUsers = () => {
  const PAGE_SIZE = 10;
  const { subList } = useParams();

  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchTerm);

  const dispatch = useDispatch();
  const { getReset } = UseUserHook();

  const totalPages = Math.max(1, Math.ceil((pagination?.totalUsers || 0) / PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const userRedirectHandler = (user: any) => {
    getReset();
    dispatch(setLoggedUser(user));
    window.open("/user/dashboard", "_blank");
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchTerm), 450);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const fetchUsersData = async () => {
    setLoading(true);
    try {
      let finalRes: any;
      const base = `/admin/get-users?page=${currentPage}&limit=${PAGE_SIZE}&search=${encodeURIComponent(
        debouncedSearch
      )}`;

      if (subList === "all-users") {
        finalRes = (await backendApi.get(base)).data;
      } else if (subList === "email-verified") {
        finalRes = (await backendApi.get(`${base}&emailVerified=true`)).data;
      } else if (subList === "email-unverified") {
        finalRes = (await backendApi.get(`${base}&emailVerified=false`)).data;
      } else if (subList === "kyc-verified") {
        finalRes = (await backendApi.get(`${base}&kycVerified=true`)).data;
      } else if (subList === "kyc-unverified") {
        finalRes = (await backendApi.get(`${base}&kycVerified=false`)).data;
      } else {
        finalRes = (await backendApi.get(base)).data;
      }

      setUsers(finalRes.data || []);
      setPagination(finalRes.pagination || {});
    } catch (error) {
      toast.error("Something went wrong");
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subList, currentPage, debouncedSearch]);

  useEffect(() => setCurrentPage(1), [subList]);

  const getPageWindow = (current: number, total: number, size = 10) => {
    const half = Math.floor(size / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, start + size - 1);
    start = Math.max(1, end - size + 1);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ color: THEME.text, background: THEME.bg0 }}>
      <AuroraBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Top Card */}
        <div
          className="rounded-3xl p-4 sm:p-6 border backdrop-blur-xl mb-6"
          style={{
            background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
            borderColor: THEME.borderSoft,
            boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
          }}
        >
          {/* ✅ Mobile: horizontal scroll, Desktop: same wrap layout */}
          {/* <div className="sm:hidden">
            <div className="flex gap-6 overflow-x-auto pb-3 -mx-2 px-2">
              <CircleFilter
                to="/admin/manage-users/email-verified"
                active={subList === "email-verified"}
                label="Email Verified"
                Icon={MailCheck}
                accent={THEME.green}
              />
              <CircleFilter
                to="/admin/manage-users/email-unverified"
                active={subList === "email-unverified"}
                label="Email Unverified"
                Icon={MailX}
                accent={THEME.blue}
              />
              <CircleFilter
                to="/admin/manage-users/kyc-verified"
                active={subList === "kyc-verified"}
                label="KYC Verified"
                Icon={ShieldCheck}
                accent={THEME.purple}
              />
              <CircleFilter
                to="/admin/manage-users/kyc-unverified"
                active={subList === "kyc-unverified"}
                label="KYC Unverified"
                Icon={IdCard}
                accent={THEME.pink}
              />
              <CircleFilter
                onClick={fetchUsersData}
                disabled={loading}
                active={false}
                label={loading ? "Refreshing" : "Refresh"}
                Icon={RefreshCw}
                accent={THEME.orange}
              />
            </div>
          </div> */}

          {/* ✅ Desktop original layout stays */}
          {/* <div className="hidden sm:flex flex-wrap items-start justify-center gap-10">
            <CircleFilter
              to="/admin/manage-users/email-verified"
              active={subList === "email-verified"}
              label="Email Verified"
              Icon={MailCheck}
              accent={THEME.green}
            />
            <CircleFilter
              to="/admin/manage-users/email-unverified"
              active={subList === "email-unverified"}
              label="Email Unverified"
              Icon={MailX}
              accent={THEME.blue}
            />
            <CircleFilter
              to="/admin/manage-users/kyc-verified"
              active={subList === "kyc-verified"}
              label="KYC Verified"
              Icon={ShieldCheck}
              accent={THEME.purple}
            />
            <CircleFilter
              to="/admin/manage-users/kyc-unverified"
              active={subList === "kyc-unverified"}
              label="KYC Unverified"
              Icon={IdCard}
              accent={THEME.pink}
            />
            <CircleFilter
              onClick={fetchUsersData}
              disabled={loading}
              active={false}
              label={loading ? "Refreshing" : "Refresh"}
              Icon={RefreshCw}
              accent={THEME.orange}
            />
          </div> */}
          {/* ✅ Mobile: circles vertically (desktop unchanged) */}
<div className="md:hidden">
  <div className="flex flex-col items-center gap-8">
    <CircleFilter
      to="/admin/manage-users/email-verified"
      active={subList === "email-verified"}
      label="Email Verified"
      Icon={MailCheck}
      accent={THEME.green}
    />
    <CircleFilter
      to="/admin/manage-users/email-unverified"
      active={subList === "email-unverified"}
      label="Email Unverified"
      Icon={MailX}
      accent={THEME.blue}
    />
    <CircleFilter
      to="/admin/manage-users/kyc-verified"
      active={subList === "kyc-verified"}
      label="KYC Verified"
      Icon={ShieldCheck}
      accent={THEME.purple}
    />
    <CircleFilter
      to="/admin/manage-users/kyc-unverified"
      active={subList === "kyc-unverified"}
      label="KYC Unverified"
      Icon={IdCard}
      accent={THEME.pink}
    />
    <CircleFilter
      onClick={fetchUsersData}
      disabled={loading}
      active={false}
      label={loading ? "Refreshing" : "Refresh"}
      Icon={RefreshCw}
      accent={THEME.orange}
    />
  </div>
</div>
<div className="hidden md:flex flex-wrap items-start justify-center gap-10">
  <CircleFilter
    to="/admin/manage-users/email-verified"
    active={subList === "email-verified"}
    label="Email Verified"
    Icon={MailCheck}
    accent={THEME.green}
  />
  <CircleFilter
    to="/admin/manage-users/email-unverified"
    active={subList === "email-unverified"}
    label="Email Unverified"
    Icon={MailX}
    accent={THEME.blue}
  />
  <CircleFilter
    to="/admin/manage-users/kyc-verified"
    active={subList === "kyc-verified"}
    label="KYC Verified"
    Icon={ShieldCheck}
    accent={THEME.purple}
  />
  <CircleFilter
    to="/admin/manage-users/kyc-unverified"
    active={subList === "kyc-unverified"}
    label="KYC Unverified"
    Icon={IdCard}
    accent={THEME.pink}
  />
  <CircleFilter
    onClick={fetchUsersData}
    disabled={loading}
    active={false}
    label={loading ? "Refreshing" : "Refresh"}
    Icon={RefreshCw}
    accent={THEME.orange}
  />
</div>

          {/* Search BELOW circles */}
          <div className="mt-6 sm:mt-10 flex justify-center">
            <div className="w-full max-w-3xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  className="w-full pl-11 pr-4 py-3 sm:py-4 rounded-full bg-black/40 border text-white placeholder:text-white/40 focus:outline-none focus:ring-2"
                  style={{
                    borderColor: THEME.borderSoft,
                    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Mobile: Cards list */}
        <div className="sm:hidden space-y-3">
          {loading ? (
            <div
              className="rounded-3xl border backdrop-blur-xl p-6 text-center"
              style={{
                background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
                borderColor: THEME.borderSoft,
                boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
              }}
            >
              <LoaderIcon className="inline animate-spin w-6 h-6 text-white/70" />
              <span className="ml-2 text-white/70">Loading...</span>
            </div>
          ) : users.length === 0 ? (
            <div
              className="rounded-3xl border backdrop-blur-xl p-6 text-center text-white/60"
              style={{
                background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
                borderColor: THEME.borderSoft,
                boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
              }}
            >
              No users found.
            </div>
          ) : (
            users.map((user: any) => (
              <div
                key={user?._id}
                className="rounded-3xl border backdrop-blur-xl p-4"
                style={{
                  background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
                  borderColor: THEME.borderSoft,
                  boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
                }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-extrabold text-white truncate">
                      {(user?.firstName || "") + " " + (user?.lastName || "")}
                    </div>
                    <div className="text-sm text-white/55 truncate">{user?.email}</div>
                  </div>

                  {subList === "all-users" ? (
                    <Button
                      onClick={() => userRedirectHandler(user)}
                      className="shrink-0 inline-flex items-center justify-center rounded-full border bg-white/10 hover:bg-white/20 transition px-3 py-2"
                      style={{ borderColor: THEME.borderSoft }}
                    >
                      <RiUserSharedFill size={18} className="text-emerald-200/90" />
                    </Button>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="text-xs text-white/60">Country</div>
                  <div className="text-right">
                    {user?.country ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs bg-blue-500/15 text-blue-200 border border-blue-300/30 font-semibold">
                        {user.country}
                      </span>
                    ) : (
                      <OctagonAlert className="w-5 h-5 ml-auto text-amber-300" />
                    )}
                  </div>

                  <div className="text-xs text-white/60">Email</div>
                  <div className="text-right">
                    <StatusPill ok={!!user?.emailVerified} okText="Verified" badText="Unverified" />
                  </div>

                  <div className="text-xs text-white/60">KYC</div>
                  <div className="text-right">
                    <StatusPill ok={!!user?.kycVerified} okText="Verified" badText="Unverified" />
                  </div>

                  <div className="text-xs text-white/60">Total AC</div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-emerald-500/15 text-emerald-200 border border-emerald-300/30 font-semibold">
                      {user?.accounts?.length || 0}
                    </span>
                  </div>

                  <div className="text-xs text-white/60">Joined</div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-white/85">{CFformatDate(user?.createdAt)}</div>
                    <div className="text-[11px] text-white/50">{CFcalculateTimeSinceJoined(user?.createdAt)}</div>
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/admin/user-detail/${user?._id}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full border bg-white/10 text-white hover:bg-white/20 transition font-extrabold"
                    style={{ borderColor: THEME.borderSoft }}
                  >
                    <FaUserEdit size={16} />
                    Details
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ✅ Desktop: original table (unchanged) */}
        <div
          className="hidden sm:block rounded-3xl border backdrop-blur-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,  
            borderColor: THEME.borderSoft,
            boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black/30 border-b" style={{ borderColor: THEME.borderSoft }}>
                  <th className="py-3 px-6 text-left text-white/80 font-bold">User / Email</th>
                  <th className="py-3 px-6 text-center text-white/80 font-bold">Country</th>
                  <th className="py-3 px-6 text-center text-white/80 font-bold">Email</th>
                  <th className="py-3 px-6 text-center text-white/80 font-bold">KYC</th>
                  <th className="py-3 px-6 text-center text-white/80 font-bold">Total AC</th>
                  <th className="py-3 px-6 text-left text-white/80 font-bold">Joined At</th>
                  <th className="py-3 px-6 text-center text-white/80 font-bold">Action</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <LoaderIcon className="inline animate-spin w-6 h-6 text-white/70" />
                      <span className="ml-2 text-white/70">Loading...</span>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-white/60">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr
                      key={user?._id}
                      className="border-b hover:bg-white/5 transition"
                      style={{ borderColor: THEME.borderSoft }}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {subList === "all-users" && (
                            <Button
                              onClick={() => userRedirectHandler(user)}
                              className="text-emerald-200/80 hover:text-emerald-200 transition"
                            >
                              <RiUserSharedFill size={20} />
                            </Button>
                          )}
                          <div>
                            <div className="font-bold text-white">
                              {(user?.firstName || "") + " " + (user?.lastName || "")}
                            </div>
                            <div className="text-sm text-white/50">{user?.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        {user?.country ? (
                          <span className="inline-block px-3 py-1 rounded-full text-sm bg-blue-500/15 text-blue-200 border border-blue-300/30 font-semibold">
                            {user.country}
                          </span>
                        ) : (
                          <OctagonAlert className="w-5 h-5 mx-auto text-amber-300" />
                        )}
                      </td>

                      <td className="py-4 px-6 text-center">
                        <StatusPill ok={!!user?.emailVerified} okText="Verified" badText="Unverified" />
                      </td>

                      <td className="py-4 px-6 text-center">
                        <StatusPill ok={!!user?.kycVerified} okText="Verified" badText="Unverified" />
                      </td>

                      <td className="py-4 px-6 text-center">
                        <span className="inline-block px-3 py-1 rounded-full text-sm bg-emerald-500/15 text-emerald-200 border border-emerald-300/30 font-semibold">
                          {user?.accounts?.length || 0}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-white/85 font-semibold">{CFformatDate(user?.createdAt)}</div>
                        <div className="text-xs text-white/50">{CFcalculateTimeSinceJoined(user?.createdAt)}</div>
                      </td>

                      <td className="py-4 px-6 text-center">
                        <Link
                          to={`/admin/user-detail/${user?._id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-white/10 text-white hover:bg-white/20 transition font-bold"
                          style={{ borderColor: THEME.borderSoft }}
                        >
                          <FaUserEdit size={16} />
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="px-4 sm:px-6 py-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
            style={{ borderColor: THEME.borderSoft }}
          >
            <div className="text-sm" style={{ color: THEME.textMuted }}>
              Showing {users.length} of {pagination?.totalUsers || 0} users
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cx(
                  "px-4 py-2 rounded-full border font-bold transition",
                  currentPage === 1
                    ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                ← Back
              </button>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                {getPageWindow(currentPage, totalPages, 10).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={cx(
                      "w-9 h-9 sm:w-10 sm:h-10 rounded-full border font-bold transition",
                      currentPage === page
                        ? "text-white"
                        : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                    )}
                    style={
                      currentPage === page
                        ? {
                            background: `linear-gradient(135deg, ${THEME.purple}, ${THEME.pink})`,
                            borderColor: "rgba(255,255,255,0.22)",
                          }
                        : undefined
                    }
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cx(
                  "px-4 py-2 rounded-full border font-bold transition",
                  currentPage === totalPages
                    ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                    : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                )}
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* ✅ Mobile pagination (separate, better UX) */}
        <div
          className="sm:hidden mt-4 rounded-3xl border backdrop-blur-xl p-4"
          style={{
            background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
            borderColor: THEME.borderSoft,
            boxShadow: "0 10px 35px rgba(0,0,0,0.35)",
          }}
        >
          <div className="text-xs mb-3 text-center" style={{ color: THEME.textMuted }}>
            Showing {users.length} of {pagination?.totalUsers || 0} users
          </div>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={cx(
                "px-4 py-2 rounded-full border font-extrabold transition w-1/2",
                currentPage === 1
                  ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              )}
            >
              ← Back
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={cx(
                "px-4 py-2 rounded-full border font-extrabold transition w-1/2",
                currentPage === totalPages
                  ? "bg-white/5 text-white/30 border-white/10 cursor-not-allowed"
                  : "bg-white/10 text-white border-white/20 hover:bg-white/20"
              )}
            >
              Next →
            </button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1 flex-wrap">
            {getPageWindow(currentPage, totalPages, 7).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cx(
                  "w-9 h-9 rounded-full border font-extrabold transition",
                  currentPage === page
                    ? "text-white"
                    : "bg-white/10 text-white/70 border-white/20 hover:bg-white/20"
                )}
                style={
                  currentPage === page
                    ? {
                        background: `linear-gradient(135deg, ${THEME.purple}, ${THEME.pink})`,
                        borderColor: "rgba(255,255,255,0.22)",
                      }
                    : undefined
                }
              >
                {page}
              </button>
            ))}
          </div>
        </div>

        <div className="h-8" />
      </div>
    </div>
  );
};

export default ManageUsers;

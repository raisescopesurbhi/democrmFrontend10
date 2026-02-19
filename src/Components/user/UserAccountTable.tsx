// UserAccountsTable.tsx
import { useEffect, useState } from "react";
import { Copy, Eye, KeyRound, Shield } from "lucide-react";
import toast from "react-hot-toast";
import { CFformatDate } from "../../utils/CustomFunctions";

/* ===================== EXACT DASHBOARDBASE THEME (same as UserDetailDashboard) ===================== */
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

const cx = (...c: Array<string | false | undefined | null>) => c.filter(Boolean).join(" ");

type Tone = "green" | "blue" | "pink" | "orange" | "teal" | "purple" | "red";

const Chip = ({
  children,
  tone = "blue",
}: {
  children: any;
  tone?: Tone;
}) => {
  const map: Record<Tone, string> = {
    green: THEME.green,
    blue: THEME.blue,
    pink: THEME.pink,
    orange: THEME.orange,
    teal: THEME.teal,
    purple: THEME.purple,
    red: THEME.red,
  };
  const color = map[tone] || THEME.blue;

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold border"
      style={{
        color: THEME.text,
        borderColor: `${color}55`,
        background: `${color}18`,
        boxShadow: `0 0 18px ${color}22`,
      }}
    >
      {children}
    </span>
  );
};

const CardShell = ({ className = "", children }: any) => (
  <div
    className={cx("rounded-3xl p-4", className)}
    style={{
      background: `linear-gradient(135deg, ${THEME.bg1}, ${THEME.bg2})`,
      border: `1px solid ${THEME.borderSoft}`,
      boxShadow: `0 8px 28px rgba(0,0,0,0.35)`,
    }}
  >
    {children}
  </div>
);

const TableHead = ({ children, className = "" }: { children: any; className?: string }) => (
  <th
    className={cx("px-4 py-3 text-left text-xs font-black uppercase tracking-wider whitespace-nowrap", className)}
    style={{ color: THEME.textMuted }}
  >
    {children}
  </th>
);

const TableCell = ({ children, className = "" }: { children: any; className?: string }) => (
  <td className={cx("px-4 py-3 text-sm align-middle", className)} style={{ color: THEME.text }}>
    {children}
  </td>
);

const ActionPill = ({
  label,
  tone = "purple",
  icon,
  onClick,
}: {
  label: string;
  tone?: Tone;
  icon?: React.ReactNode;
  onClick?: () => void;
}) => {
  const map: Record<Tone, string> = {
    green: THEME.green,
    blue: THEME.blue,
    pink: THEME.pink,
    orange: THEME.orange,
    teal: THEME.teal,
    purple: THEME.purple,
    red: THEME.red,
  };
  const color = map[tone] || THEME.purple;

  return (
    <button
      type="button"
      onClick={onClick} 
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-black",
        "transition-all duration-300 hover:scale-105 active:scale-95"
      )}
      style={{
        background: `linear-gradient(135deg, ${color}35, ${color}12)`,
        border: `1px solid ${color}55`,
        color: THEME.text,
        boxShadow: `0 0 18px ${color}22`,
      }}
      title={label}
    >
      {icon}
      {label}
    </button>
  );
};

const safeCopy = async (value: any, okMsg: string) => {
  try {
    await navigator.clipboard.writeText(String(value ?? ""));
    toast.success(okMsg);
  } catch {
    toast.error("Copy failed");
  }
};

export type UserAccountsTableProps = {
  accounts: any[];
  title?: string;
  subtitle?: string;
  onView?: (row: any) => void;
  className?: string;
};

export default function UserAccountsTable({
  accounts,
  title = "Accounts",
  subtitle = "acc, type, leverage, master/investor passwords, platform, timestamp, action",
  onView,
  className = "",
}: UserAccountsTableProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={cx("transition-all duration-500", mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2", className)}
    >
      <CardShell className="p-0 overflow-hidden">
        {/* header */}
        <div
          className="px-5 sm:px-6 py-4 border-b"
          style={{ borderColor: THEME.borderSoft, background: "rgba(0,0,0,0.25)" }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="font-black tracking-tight truncate" style={{ color: THEME.text }}>
                {title}
              </h3>
              <p className="text-xs mt-0.5" style={{ color: THEME.textMuted }}>
                {subtitle}
              </p>
            </div>

            <div className="shrink-0">
              <Chip tone="teal">
                <Shield className="w-4 h-4" />
                {accounts?.length || 0} Accounts
              </Chip>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.borderSoft}` }}>
                <TableHead>Acc</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Leverage</TableHead>
                <TableHead>Master Password</TableHead>
                <TableHead>Investor Password</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </tr>
            </thead>

            <tbody>
              {accounts?.length ? (
                accounts.map((acc: any, idx: number) => {
                  const accountNumber = acc?.accountNumber ?? acc?.login ?? acc?.mt5Account ?? "—";
                  const type = acc?.accountType ?? acc?.type ?? acc?.plan ?? "—";
                  const leverage = acc?.leverage ?? acc?.accountLeverage ?? "—";
                  const masterPassword = acc?.masterPassword ?? acc?.password ?? acc?.mainPassword ?? "—";
                  const investorPassword = acc?.investorPassword ?? acc?.investor ?? acc?.readOnlyPassword ?? "—";
                  const platform = acc?.platform ?? acc?.server ?? acc?.broker ?? "—";
                  const timestamp =
                    acc?.createdAt || acc?.timestamp
                      ? CFformatDate(acc?.createdAt || acc?.timestamp)
                      : "—";

                  return (
                    <tr
                      key={acc?._id || `${accountNumber}-${idx}`}
                      className={cx(
                        "transition-all duration-300 hover:scale-[1.005]"
                      )}
                      style={{
                        background: idx % 2 === 0 ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
                        borderBottom: `1px solid ${THEME.borderSoft}`,
                      }}
                    >
                      <TableCell className="font-black whitespace-nowrap">
                        <span className="inline-flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ background: THEME.blue, boxShadow: `0 0 12px ${THEME.blue}88` }}
                          />
                          {String(accountNumber)}
                        </span>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Chip tone="purple">{String(type)}</Chip>
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Chip tone="green">{String(leverage)}</Chip>
                      </TableCell>

                      <TableCell className="font-mono text-[12px] whitespace-nowrap" style={{ color: THEME.textMuted }}>
                        {String(masterPassword)}
                      </TableCell>

                      <TableCell className="font-mono text-[12px] whitespace-nowrap" style={{ color: THEME.textMuted }}>
                        {String(investorPassword)}
                      </TableCell>

                      <TableCell className="whitespace-nowrap">
                        <Chip tone="blue">{String(platform)}</Chip>
                      </TableCell>

                      <TableCell className="text-[12px] whitespace-nowrap" style={{ color: THEME.textMuted }}>
                        {timestamp}
                      </TableCell>

                      <TableCell className="text-right whitespace-nowrap">
                        <div className="flex justify-end gap-2">
                          <ActionPill
                            label="Acc"
                            tone="blue"
                            icon={<Copy className="w-4 h-4" />}
                            onClick={() => safeCopy(accountNumber, "Account copied")}
                          />
                          <ActionPill
                            label="Master"
                            tone="orange"
                            icon={<KeyRound className="w-4 h-4" />}
                            onClick={() => safeCopy(masterPassword, "Master password copied")}
                          />
                          <ActionPill
                            label="Investor"
                            tone="teal"
                            icon={<KeyRound className="w-4 h-4" />}
                            onClick={() => safeCopy(investorPassword, "Investor password copied")}
                          />
                          <ActionPill
                            label="View"
                            tone="purple"
                            icon={<Eye className="w-4 h-4" />}
                            onClick={() => onView?.(acc)}
                          />
                        </div>
                      </TableCell>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center" style={{ color: THEME.textMuted }}>
                    No accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* footer */}
        <div
          className="px-5 sm:px-6 py-4 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between"
          style={{ background: "rgba(0,0,0,0.22)", borderTop: `1px solid ${THEME.borderSoft}` }}
        >
          <div className="text-xs" style={{ color: THEME.textMuted }}>
            Hover rows for subtle lift • Use buttons to copy / view
          </div>
          <Chip tone="pink">
            <Copy className="w-4 h-4" />
            Copy actions enabled
          </Chip>
        </div>
      </CardShell>
    </div>
  );
}

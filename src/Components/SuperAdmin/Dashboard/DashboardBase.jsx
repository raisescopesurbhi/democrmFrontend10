import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

import UserStatCards from "../../Admin/Dashboard/Cards/UserStatCards";
import WithdrawalSummary from "../../Admin/Dashboard/WithdrawalSummary";
import RecentActivities from "../../Admin/Dashboard/RecentActivities";
import IBWithdrawlStatCards from "../../Admin/Dashboard/Cards/IBWithdrawlStatCards";
import DepositeStatCards from "../../Admin/Dashboard/Cards/DepositeStatCards";
import UserBarChart from "../../Admin/Dashboard/Cards/UserBarChart";

import { Card, CardContent } from "../../Admin/ui/card";

const cx = (...c) => c.filter(Boolean).join(" ");

const Panel = ({ title, children, className }) => (
  <div
    className={cx(
      "rounded-3xl p-[1px] bg-gradient-to-br from-emerald-500/25 via-transparent to-emerald-500/10",
      className
    )}
  >
    <div className="rounded-3xl border border-emerald-500/15 bg-black/40 backdrop-blur-xl">
      <div className="px-5 pt-5 pb-3 flex items-center justify-between">
        <h2 className="text-sm sm:text-base font-black tracking-wide text-emerald-100">
          {title}
        </h2>
        <div className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(34,197,94,0.65)]" />
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  </div>
);

// Sample data
const lineData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 7000 },
];

const barData = [
  { category: "Electronics", orders: 40 },
  { category: "Grocery", orders: 25 },
  { category: "Pharmacy", orders: 15 },
  { category: "Clothing", orders: 30 },
];

const pieData = [
  { name: "New Users", value: 300 },
  { name: "Returning", value: 200 },
  { name: "Guest", value: 100 },
];

// keep colors as-is (your choice)
const COLORS = ["#4f46e5", "#38bdf8", "#10b981"];

const DashboardBase = ({
  userReport,
  depositReport,
  withdrawalReport,
  ibWithdrawalReport,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* LEFT */}
      <div className="lg:col-span-1 space-y-5">
        <Panel title="User Information">
          <UserStatCards
            userReport={userReport}
            depositReport={depositReport}
            withdrawalReport={withdrawalReport}
            ibWithdrawalReport={ibWithdrawalReport}
          />
        </Panel>

        <Panel title="User Chart">
          <UserBarChart />
        </Panel>

        <Panel title="Deposit & Withdraw Report">
          <DepositeStatCards
            userReport={userReport}
            depositReport={depositReport}
            withdrawalReport={withdrawalReport}
            ibWithdrawalReport={ibWithdrawalReport}
          />
        </Panel>

        <Panel title="IB Withdrawal Report">
          <IBWithdrawlStatCards
            userReport={userReport}
            depositReport={depositReport}
            withdrawalReport={withdrawalReport}
            ibWithdrawalReport={ibWithdrawalReport}
          />
        </Panel>

        <div className="rounded-3xl overflow-hidden border border-emerald-500/15 bg-black/40 backdrop-blur-xl">
          <WithdrawalSummary report={withdrawalReport} />
        </div>

        <div className="rounded-3xl overflow-hidden border border-emerald-500/15 bg-black/40 backdrop-blur-xl">
          <RecentActivities />
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-2 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Panel title="Orders by Category">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="category" stroke="rgba(226, 232, 240, 0.7)" />
                  <YAxis stroke="rgba(226, 232, 240, 0.7)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(2, 6, 23, 0.9)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      color: "#fff",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="orders" fill="#34d399" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="User Types">
            <div className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(2, 6, 23, 0.9)",
                      border: "1px solid rgba(34,197,94,0.25)",
                      color: "#fff",
                      borderRadius: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <Panel title="Monthly Sales Trend">
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <XAxis dataKey="name" stroke="rgba(226, 232, 240, 0.7)" />
                <YAxis stroke="rgba(226, 232, 240, 0.7)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(2, 6, 23, 0.9)",
                    border: "1px solid rgba(34,197,94,0.25)",
                    color: "#fff",
                    borderRadius: 12,
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#34d399" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default DashboardBase;

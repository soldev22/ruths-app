"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ActivityLog {
  _id: string;
  userEmail: string;
  activityType: string;
  caseId?: string;
  sectionId?: string;
  timestamp: string;
  metadata?: any;
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    loadLogs();
  }, [filter, userFilter]);

  async function loadLogs() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter !== "all") {
        params.append("activityType", filter);
      }
      if (userFilter) {
        params.append("userEmail", userFilter);
      }
      params.append("limit", "200");

      const res = await fetch(`/api/admin/activity-logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        
        // Extract unique user emails
        const uniqueUsers = Array.from(new Set(data.logs.map((log: ActivityLog) => log.userEmail))).sort();
        setUsers(uniqueUsers as string[]);
      }
    } catch (err) {
      console.error("Failed to load logs:", err);
    } finally {
      setLoading(false);
    }
  }

  const activityColors: Record<string, string> = {
    login: "bg-green-100 text-green-800",
    logout: "bg-gray-100 text-gray-800",
    registration: "bg-blue-100 text-blue-800",
    screening_started: "bg-purple-100 text-purple-800",
    screening_section_completed: "bg-yellow-100 text-yellow-800",
    screening_completed: "bg-green-100 text-green-800",
  };

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-2">Monitor user activity and screening usage</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filter by Activity Type</h2>
          <div className="flex flex-wrap gap-2 mb-6">
            {["all", "login", "registration", "screening_started", "screening_section_completed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type === "all" ? "All Activities" : type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            ))}
          </div>

          <h2 className="text-lg font-semibold mb-4">Filter by User</h2>
          <div className="flex gap-3 items-center">
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {users.map((email) => (
                <option key={email} value={email}>
                  {email}
                </option>
              ))}
            </select>
            {userFilter && (
              <button
                onClick={() => setUserFilter("")}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-lg text-sm font-medium transition"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Activity Log Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-gray-500">Loading activity logs...</div>
            ) : logs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No activity logs found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(log.timestamp).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {log.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            activityColors[log.activityType] || "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {log.activityType.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {log.caseId && (
                          <div>
                            <strong>Case ID:</strong> {log.caseId}
                          </div>
                        )}
                        {log.sectionId && (
                          <div>
                            <strong>Section:</strong> {log.sectionId}
                          </div>
                        )}
                        {log.metadata?.creditsUsed && (
                          <div>
                            <strong>Credits Used:</strong> {log.metadata.creditsUsed}
                          </div>
                        )}
                        {log.metadata?.remainingCredits !== undefined && (
                          <div>
                            <strong>Remaining:</strong> {log.metadata.remainingCredits} credits
                          </div>
                        )}
                        {log.metadata?.creditsAdded && (
                          <div>
                            <strong>Credits Added:</strong> +{log.metadata.creditsAdded}
                          </div>
                        )}
                        {log.metadata?.voucherCode && (
                          <div>
                            <strong>Voucher:</strong> {log.metadata.voucherCode}
                          </div>
                        )}
                        {log.metadata?.accountType && (
                          <div>
                            <strong>Account Type:</strong> {log.metadata.accountType}
                          </div>
                        )}
                        {log.metadata?.sectionsCompleted && (
                          <div>
                            <strong>Sections:</strong> {log.metadata.sectionsCompleted}
                          </div>
                        )}
                        {log.metadata?.screeningsUsed && (
                          <div>
                            <strong>Usage:</strong> {log.metadata.screeningsUsed} screenings
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Activities</h3>
            <div className="text-3xl font-bold text-gray-900">{logs.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Logins</h3>
            <div className="text-3xl font-bold text-green-600">
              {logs.filter((l) => l.activityType === "login").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Screenings Started</h3>
            <div className="text-3xl font-bold text-purple-600">
              {logs.filter((l) => l.activityType === "screening_started").length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Sections Completed</h3>
            <div className="text-3xl font-bold text-yellow-600">
              {logs.filter((l) => l.activityType === "screening_section_completed").length}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Link href="/protected/dashboard" className="text-blue-600 hover:underline">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

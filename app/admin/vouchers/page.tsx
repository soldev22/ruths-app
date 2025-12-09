"use client";

import { useEffect, useState } from "react";

interface Voucher {
  _id: string;
  code: string;
  credits: number;
  maxRedemptions: number;
  currentRedemptions: number;
  expiryDate: string | null;
  isActive: boolean;
  accountType: string;
  description: string;
  redeemedBy: Array<{ userEmail: string; redeemedAt: string }>;
  createdAt: string;
}

export default function VouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    credits: 1,
    maxRedemptions: 1,
    expiryDate: "",
    accountType: "both",
    description: ""
  });

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const res = await fetch("/api/admin/vouchers");
      const data = await res.json();
      if (res.ok) {
        setVouchers(data.vouchers);
      }
    } catch (error) {
      console.error("Failed to load vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const createVoucher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        alert(data.message);
        setShowCreateForm(false);
        setFormData({
          code: "",
          credits: 1,
          maxRedemptions: 1,
          expiryDate: "",
          accountType: "both",
          description: ""
        });
        loadVouchers();
      } else {
        alert(data.error || "Failed to create voucher");
      }
    } catch (error) {
      console.error("Failed to create voucher:", error);
      alert("Failed to create voucher");
    }
  };

  const toggleVoucher = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, {
        method: "PATCH"
      });
      
      if (res.ok) {
        loadVouchers();
      } else {
        alert("Failed to toggle voucher");
      }
    } catch (error) {
      console.error("Failed to toggle voucher:", error);
    }
  };

  const deleteVoucher = async (id: string, code: string) => {
    if (!confirm(`Delete voucher ${code}?`)) return;
    
    try {
      const res = await fetch(`/api/admin/vouchers/${id}`, {
        method: "DELETE"
      });
      
      if (res.ok) {
        loadVouchers();
      } else {
        alert("Failed to delete voucher");
      }
    } catch (error) {
      console.error("Failed to delete voucher:", error);
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
          <p>Loading vouchers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Voucher Management</h1>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              {showCreateForm ? "Cancel" : "Create Voucher"}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Voucher</h2>
            <form onSubmit={createVoucher} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Voucher Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 uppercase"
                    placeholder="e.g., WELCOME10"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Credits *
                  </label>
                  <input
                    type="number"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Redemptions
                  </label>
                  <input
                    type="number"
                    value={formData.maxRedemptions}
                    onChange={(e) => setFormData({ ...formData, maxRedemptions: parseInt(e.target.value) })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    value={formData.accountType}
                    onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="both">Both</option>
                    <option value="individual">Individual Only</option>
                    <option value="school">School Only</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    placeholder="e.g., Welcome bonus for new users"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
              >
                Create Voucher
              </button>
            </form>
          </div>
        )}

        {/* Vouchers List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            All Vouchers ({vouchers.length})
          </h2>

          {vouchers.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No vouchers created yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Credits</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Redemptions</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Account Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Expiry</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vouchers.map((voucher) => (
                    <tr key={voucher._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-indigo-600">{voucher.code}</div>
                        {voucher.description && (
                          <div className="text-xs text-gray-500">{voucher.description}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">{voucher.credits}</td>
                      <td className="py-3 px-4">
                        {voucher.currentRedemptions} / {voucher.maxRedemptions}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {voucher.accountType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {voucher.expiryDate 
                          ? new Date(voucher.expiryDate).toLocaleDateString()
                          : "No expiry"}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded ${
                          voucher.isActive 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {voucher.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => toggleVoucher(voucher._id)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            {voucher.isActive ? "Deactivate" : "Activate"}
                          </button>
                          <button
                            onClick={() => deleteVoucher(voucher._id, voucher.code)}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

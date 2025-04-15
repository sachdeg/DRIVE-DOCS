"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "../css/admin.css";

type ServiceRecord = {
  service_id: number;
  vin: string;
  customer_name: string;
  license_plate: string;
  vehicle_model: string;
  service_date: string;
  service_type: string;
};

export default function AdminPage() {
  const [records, setRecords] = useState<ServiceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchRecords = async () => {
      const res = await fetch("http://localhost:4000/services", {
        cache: "no-store",
      });
      const data = await res.json();
      const sorted = data
        .sort((a: ServiceRecord, b: ServiceRecord) => b.service_id - a.service_id)
        .slice(0, 10);
      setRecords(sorted);
    };
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((r) =>
    r.service_id.toString().includes(searchQuery) ||
    r.vin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="p-8">
      {/* Nav */}
      <nav className="nav-bar">
        <a href="/" className="admin-link">Home</a>
      </nav>

      {/* Header */}
      <header className="site-header">
        <h1>DriveDocs Admin</h1>
        <p className="tagline">Manage All Vehicle Service Records</p>
      </header>

      {/* Actions */}
      <div className="admin-actions mb-4">
        <Link href="/admin/create" className="link-button">
          ➕ Create New Record
        </Link>
        <Link href="/admin" className="link-button">
          🚗 Add/Update Vehicle
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Service ID or VIN"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm"
        />
      </div>

      {/* Vertical Tile List */}
      <div className="flex flex-col gap-4">
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div
              key={record.service_id}
              className="bg-white border shadow rounded-lg p-4 hover:shadow-md transition"
            >
              <div className="font-semibold text-lg mb-1">
                #{record.service_id}
              </div>
              <div className="text-gray-700 mb-2">
                VIN: {record.vin}
              </div>
              <Link
                href={`/collection/edit/${record.service_id}`}
                className="text-blue-600 hover:underline font-medium"
              >
                more →
              </Link>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 p-4">
            No matching records found.
          </p>
        )}
      </div>
    </main>
  );
}
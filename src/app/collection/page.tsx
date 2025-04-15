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
      setRecords(data);
    };
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((r) =>
    r.service_id.toString().includes(searchQuery) ||
    r.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.license_plate.toLowerCase().includes(searchQuery.toLowerCase())
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
        <Link href="/admin/vehicle" className="link-button">
          🚗 Add/Update Vehicle
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Service ID, VIN, or License Plate"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm"
        />
      </div>

      {/* Table */}
      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Service ID</th>
            <th className="p-2 border">VIN</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">License Plate</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Service</th>
            <th className="p-2 border">View</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.length > 0 ? (
            filteredRecords.map((record) => (
              <tr key={record.service_id}>
                <td className="p-2 border">{record.service_id}</td>
                <td className="p-2 border">{record.vin}</td>
                <td className="p-2 border">{record.customer_name}</td>
                <td className="p-2 border">{record.license_plate}</td>
                <td className="p-2 border">{record.vehicle_model}</td>
                <td className="p-2 border">{record.service_date}</td>
                <td className="p-2 border">{record.service_type}</td>
                <td className="p-2 border">
                  <Link
                    href={`/collection/${record.service_id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center text-gray-500 p-4">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}

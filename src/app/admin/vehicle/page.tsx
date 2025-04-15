"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Vehicle = {
  id: number;
  vin: string;
  make: string;
  model: string;
  year: number;
  license_plate: string;
  customer_name: string;
  phone: string;
};

export default function VehicleAdminPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const fetchVehicles = async () => {
    const res = await fetch("http://localhost:4001/vehicles", {
      cache: "no-store",
    });
    const data = await res.json();
    setVehicles(data);
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <main className="p-8">
      {/* Nav */}
      <nav className="nav-bar">
        <a href="/" className="admin-link">Home</a>
      </nav>

      {/* Header */}
      <header className="site-header">
        <h1>DriveDocs Admin</h1>
        <p className="tagline">Manage All Vehicles</p>
      </header>

      {/* Top Action Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vehicle List</h2>
        <Link
          href="/admin/vehicle/create"
          className="link-button"
        >
          ➕ Create New Vehicle
        </Link>
      </div>

      {/* Vehicle Table */}
      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">VIN</th>
            <th className="p-2 border">Make</th>
            <th className="p-2 border">Model</th>
            <th className="p-2 border">Year</th>
            <th className="p-2 border">License Plate</th>
            <th className="p-2 border">Customer</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id}>
              <td className="p-2 border">{v.vin}</td>
              <td className="p-2 border">{v.make}</td>
              <td className="p-2 border">{v.model}</td>
              <td className="p-2 border">{v.year}</td>
              <td className="p-2 border">{v.license_plate}</td>
              <td className="p-2 border">{v.customer_name}</td>
              <td className="p-2 border">{v.phone}</td>
              <td className="p-2 border">
                <Link
                  href={`/admin/vehicle/${v.id}`}
                  className="text-blue-600 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

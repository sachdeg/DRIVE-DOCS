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
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this vehicle?");
    if (!confirmDelete) return;

    await fetch(`http://localhost:4001/vehicles/${id}`, {
      method: "DELETE",
    });

    // Refresh list after deletion
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  const filteredVehicles = vehicles.filter((v) =>
    v.vin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
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
        <p className="tagline">Manage All Vehicles</p>
      </header>

      {/* Top Action Row */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Vehicle List</h2>
        <Link href="/admin/vehicle/create" className="link-button">
          ➕ Create New Vehicle
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by VIN, License Plate, or Customer Name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border rounded shadow-sm"
        />
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
            <th className="p-2 border">View</th>
            <th className="p-2 border">Edit</th>
            <th className="p-2 border">Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map((v) => (
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
                <td className="p-2 border">
                  <Link
                    href={`/admin/vehicle/edit/${v.id}`}
                    className="text-yellow-600 hover:underline"
                  >
                    E
                  </Link>
                </td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="text-red-600 hover:underline"
                  >
                    D
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="p-4 text-center text-gray-500">
                No matching vehicles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
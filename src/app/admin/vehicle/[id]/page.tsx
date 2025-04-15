"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function VehicleDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [vehicle, setVehicle] = useState<any | null>(null);
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchVehicle = async () => {
      const res = await fetch(`http://localhost:4001/vehicles/${id}`);
      const data = await res.json();
      setVehicle(data);

      const serviceRes = await fetch(`http://localhost:4000/services?vin=${data.vin}`);
      const serviceData = await serviceRes.json();
      setServices(serviceData);
    };
    fetchVehicle();
  }, [id]);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      await fetch(`http://localhost:4001/vehicles/${id}`, {
        method: "DELETE",
      });
      router.push("/admin/vehicle");
    }
  };

  if (!vehicle) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8">
      <nav className="nav-bar mb-4">
        <a href="/admin/vehicle" className="admin-link">Back to Vehicles</a>
      </nav>

      <h1 className="text-2xl font-bold mb-4">Vehicle Details</h1>

      <div className="border rounded p-4 bg-white shadow mb-6">
        <p><strong>VIN:</strong> {vehicle.vin}</p>
        <p><strong>Make:</strong> {vehicle.make}</p>
        <p><strong>Model:</strong> {vehicle.model}</p>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>License Plate:</strong> {vehicle.license_plate}</p>
        <p><strong>Customer:</strong> {vehicle.customer_name}</p>
        <p><strong>Phone:</strong> {vehicle.phone}</p>
        <div className="mt-4 flex gap-4">
          <Link
            href={`/admin/vehicle/edit/${vehicle.id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Service Records</h2>
      {services.length > 0 ? (
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Service ID</th>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Cost</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.service_id}>
                <td className="p-2 border">{s.service_id}</td>
                <td className="p-2 border">{s.service_type}</td>
                <td className="p-2 border">{s.service_date}</td>
                <td className="p-2 border">${s.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No service records found for this vehicle.</p>
      )}
    </main>
  );
}

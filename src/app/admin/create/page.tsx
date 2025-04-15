"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateServiceRecordPage() {
  const router = useRouter();

  const [lookup, setLookup] = useState("");
  const [vehicle, setVehicle] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const [serviceData, setServiceData] = useState({
    service_type: "",
    service_date: "",
    cost: "",
    phone: "",
  });

  const handleLookupChange = async (value: string) => {
    setLookup(value);
    setNotFound(false);

    if (value.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await fetch("http://localhost:4001/vehicles");
      const allVehicles = await res.json();

      const filtered = allVehicles.filter((v: any) =>
        v.vin.toLowerCase().includes(value.toLowerCase()) ||
        v.license_plate.toLowerCase().includes(value.toLowerCase())
      );

      setSearchResults(filtered);
      if (filtered.length === 0) {
        setNotFound(true);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setNotFound(true);
    }
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServiceData({ ...serviceData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:4000/services");
    const data = await res.json();

    const maxId = data.reduce((max: number, r: any) => (r.service_id > max ? r.service_id : max), 100);
    const newServiceId = maxId + 1;

    const newRecord = {
      service_id: newServiceId,
      vin: vehicle?.vin ?? "",
      vehicle_model: vehicle?.model ?? "",
      license_plate: vehicle?.license_plate ?? "",
      customer_name: "", // optional
      phone: serviceData.phone,
      service_type: serviceData.service_type,
      cost: parseFloat(serviceData.cost),
      service_date: serviceData.service_date,
    };

    await fetch("http://localhost:4000/services", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRecord),
    });

    router.push("/collection");
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Service Record</h1>

      {/* 🔍 Search Bar (full width) */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Search VIN or License Plate</label>
        <input
          type="text"
          value={lookup}
          onChange={(e) => handleLookupChange(e.target.value)}
          placeholder="Type VIN or license plate"
          className="w-full px-3 py-2 border rounded"
        />
        {notFound && <p className="text-red-600 mt-2">No matches found.</p>}
      </div>

      {/* 🔄 Form + Results side-by-side */}
      <div className="flex gap-8">
        {/* Left: Form (70%) */}
        <div className="w-2/3">
          {/* Selected Vehicle Info */}
          {vehicle && (
            <div className="mb-6 border rounded p-4 bg-white shadow">
              <h2 className="text-lg font-semibold mb-2">Vehicle Details</h2>
              <p><strong>Make:</strong> {vehicle.make}</p>
              <p><strong>Model:</strong> {vehicle.model}</p>
              <p><strong>Year:</strong> {vehicle.year}</p>
              <p><strong>License Plate:</strong> {vehicle.license_plate}</p>
            </div>
          )}

          {/* Service Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Service Type</label>
              <input
                type="text"
                name="service_type"
                value={serviceData.service_type}
                onChange={handleServiceChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Service Date</label>
              <input
                type="date"
                name="service_date"
                value={serviceData.service_date}
                onChange={handleServiceChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Cost</label>
              <input
                type="number"
                name="cost"
                value={serviceData.cost}
                onChange={handleServiceChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input
                type="text"
                name="phone"
                value={serviceData.phone}
                onChange={handleServiceChange}
                required
                className="w-full px-3 py-2 border rounded"
              />
            </div>

            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Submit Record
            </button>
          </form>
        </div>

        {/* Right: Search Results (30%) */}
        <div className="w-1/3">
          {searchResults.length > 0 && (
            <div className="space-y-4">
              {searchResults.map((v) => (
                <div
                  key={v.vin}
                  className="border rounded bg-white shadow px-4 py-3 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() => {
                    setVehicle(v);
                    setSearchResults([]);
                    setLookup(v.vin);
                  }}
                >
                  <p><strong>VIN:</strong> {v.vin}</p>
                  <p><strong>Make:</strong> {v.make}</p>
                  <p><strong>Model:</strong> {v.model}</p>
                  <p><strong>Year:</strong> {v.year}</p>
                  <p><strong>License Plate:</strong> {v.license_plate}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
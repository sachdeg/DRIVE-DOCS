"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ServiceRecordViewPage() {
  const { service_id } = useParams();
  const router = useRouter();
  const [record, setRecord] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    service_type: "",
    service_date: "",
    cost: ""
  });

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await fetch("http://localhost:4000/services", {
          cache: "no-store"
        });
        const all = await res.json();
        const found = all.find((r: any) => r.service_id.toString() === service_id);
        if (found) {
          setRecord(found);
          setFormData({
            service_type: found.service_type,
            service_date: found.service_date,
            cost: found.cost.toString(),
          });
        }
      } catch (err) {
        console.error("Error fetching record:", err);
      }
    };
    fetchRecord();
  }, [service_id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:4000/services/${record.id || service_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...record,
        ...formData,
        cost: parseFloat(formData.cost),
      }),
    });
    setEditing(false);
    router.refresh();
  };

  if (!record) return <p className="p-8">Loading...</p>;

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Service Record Details</h1>

      <button
        className="text-blue-600 hover:underline mb-4"
        onClick={() => router.push("/collection")}
      >
        ← Back to Admin Page
      </button>

      <div className="border rounded p-4 bg-white shadow mb-6 space-y-2">
        <p><strong>Service ID:</strong> {record.service_id}</p>
        <p><strong>VIN:</strong> {record.vin}</p>
        <p><strong>Customer:</strong> {record.customer_name}</p>
        <p><strong>Phone:</strong> {record.phone}</p>
        <p><strong>License Plate:</strong> {record.license_plate}</p>
        <p><strong>Make:</strong> {record.make}</p>
        <p><strong>Model:</strong> {record.vehicle_model}</p>

        {!editing ? (
          <>
            <p><strong>Service Type:</strong> {record.service_type}</p>
            <p><strong>Service Date:</strong> {record.service_date}</p>
            <p><strong>Cost:</strong> ${record.cost.toFixed(2)}</p>
            <button
              onClick={() => setEditing(true)}
              className="bg-blue-600 text-white px-4 py-2 mt-4 rounded hover:bg-blue-700"
            >
              Edit
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div>
              <label className="block font-medium mb-1">Service Type</label>
              <input
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Service Date</label>
              <input
                type="date"
                name="service_date"
                value={formData.service_date}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Cost</label>
              <input
                type="number"
                name="cost"
                step="0.01"
                value={formData.cost}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    vin: "",
    customer_name: "",
    license_plate: "",
    vehicle_model: "",
    service_date: "",
    service_type: "",
    cost: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Step 1: Get existing records
    const res = await fetch("http://localhost:4000/services");
    const data = await res.json();

    // Step 2: Auto-increment service_id
    const maxId = data.reduce((max: number, record: any) => {
      return record.service_id > max ? record.service_id : max;
    }, 100);
    const newServiceId = maxId + 1;

    // Step 3: Submit new record
    const newRecord = {
      service_id: newServiceId,
      ...formData,
      cost: parseFloat(formData.cost),
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
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {[
          ["vin", "VIN"],
          ["customer_name", "Customer Name"],
          ["license_plate", "License Plate"],
          ["vehicle_model", "Vehicle Model"],
          ["service_date", "Service Date"],
          ["service_type", "Service Type"],
          ["cost", "Cost"],
          ["phone", "Phone"],
        ].map(([key, label]) => (
          <div key={key}>
            <label className="block font-medium mb-1" htmlFor={key}>
              {label}
            </label>
            <input
              type={key === "service_date" ? "date" : "text"}
              id={key}
              name={key}
              value={(formData as any)[key]}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>
    </main>
  );
}

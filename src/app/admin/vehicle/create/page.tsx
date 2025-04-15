"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateVehiclePage() {
  const router = useRouter();
  const [vehicle, setVehicle] = useState({
    vin: "",
    make: "",
    model: "",
    year: 2020,
    license_plate: "",
    customer_name: "",
    phone: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:4001/vehicles");
    const allVehicles = await res.json();

    const vinExists = allVehicles.some(
      (v: any) => v.vin.toLowerCase() === vehicle.vin.toLowerCase()
    );

    if (vinExists) {
      setError("A vehicle with this VIN already exists.");
      return;
    }

    await fetch("http://localhost:4001/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle)
    });
    router.push("/admin/vehicle");
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Create New Vehicle</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
        {[
          ["vin", "VIN"],
          ["make", "Make"],
          ["model", "Model"],
          ["year", "Year"],
          ["license_plate", "License Plate"],
          ["customer_name", "Customer Name"],
          ["phone", "Phone Number"]
        ].map(([field, label]) => (
          <div key={field}>
            <label className="block font-medium mb-1" htmlFor={field}>{label}</label>
            <input
              type={field === "year" ? "number" : "text"}
              id={field}
              name={field}
              value={(vehicle as any)[field]}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        ))}

        {error && (
          <p className="text-red-600 font-medium mt-2">{error}</p>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Vehicle
        </button>
      </form>
    </main>
  );
}

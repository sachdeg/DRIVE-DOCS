"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditVehiclePage() {
  const { id } = useParams();
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

  useEffect(() => {
    const fetchVehicle = async () => {
      const res = await fetch(`http://localhost:4001/vehicles/${id}`);
      const data = await res.json();
      setVehicle(data);
    };
    fetchVehicle();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`http://localhost:4001/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle)
    });
    router.push("/admin/vehicle");
  };

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Vehicle</h1>
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

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </main>
  );
}

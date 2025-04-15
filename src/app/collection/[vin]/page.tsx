// src/app/collection/[vin]/page.tsx

import Link from "next/link";

type ServiceRecord = {
  service_id: number;
  vin: string;
  vehicle_model: string;
  service_type: string;
  cost: number;
  service_date: string;
  customer_name: string;
  license_plate: string;
};

type Params = {
  params: {
    vin: string;
  };
};

export default async function ServiceDetailsPage({ params }: Params) {
  const res = await fetch(`http://localhost:4000/services?vin=${params.vin}`, {
    cache: "no-store",
  });
  const data: ServiceRecord[] = await res.json();

  if (!data || data.length === 0) {
    return (
      <main className="p-8">
        <h1 className="text-xl font-bold text-red-600 mb-4">
          No service records found for VIN: {params.vin}
        </h1>
        <Link href="/" className="text-blue-500 hover:underline">
          ← Back to home
        </Link>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-6">Service Records for VIN: {params.vin}</h1>
      <table className="w-full border border-gray-300 text-left">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Service ID</th>
            <th className="p-2 border">Customer Name</th>
            <th className="p-2 border">License Plate</th>
            <th className="p-2 border">Vehicle Model</th>
            <th className="p-2 border">Service Date</th>
            <th className="p-2 border">Service Type</th>
            <th className="p-2 border">Cost</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.service_id}>
              <td className="p-2 border">{record.service_id}</td>
              <td className="p-2 border">{record.customer_name}</td>
              <td className="p-2 border">{record.license_plate}</td>
              <td className="p-2 border">{record.vehicle_model}</td>
              <td className="p-2 border">{record.service_date}</td>
              <td className="p-2 border">{record.service_type}</td>
              <td className="p-2 border">${record.cost.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <Link href="/" className="block mt-6 text-blue-500 hover:underline">
        ← Back to home
      </Link>
    </main>
  );
}

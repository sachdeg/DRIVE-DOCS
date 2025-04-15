import Link from "next/link";
import "../css/admin.css";

type ServiceRecord = {
  service_id: number;
  vin: string;
  customer_name: string;
  license_plate: string;
  vehicle_model: string;
  service_date: string;
  service_type: string;
  cost: number;
  phone: string;
};

export default async function AdminPage() {
  const res = await fetch("http://localhost:4000/services", {
    cache: "no-store",
  });
  const records: ServiceRecord[] = await res.json();

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

      {/* Create New Button */}
      <div className="admin-actions">
  <Link
    href="/admin/create"
    className="link-button"
  >
    ➕ Create New Record
  </Link>

  <Link
    href="/admin/vehicle"
    className="link-button"
  >
    🚗 Add/Update Vehicle
  </Link>
</div>


      {/* Records Table */}
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
            <th className="p-2 border">Cost</th>
            <th className="p-2 border">Phone</th>
            <th className="p-2 border">View</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.service_id}>
              <td className="p-2 border">{record.service_id}</td>
              <td className="p-2 border">{record.vin}</td>
              <td className="p-2 border">{record.customer_name}</td>
              <td className="p-2 border">{record.license_plate}</td>
              <td className="p-2 border">{record.vehicle_model}</td>
              <td className="p-2 border">{record.service_date}</td>
              <td className="p-2 border">{record.service_type}</td>
              <td className="p-2 border">${record.cost.toFixed(2)}</td>
              <td className="p-2 border">{record.phone}</td>
              <td className="p-2 border">
                <Link
                  href={`/collection/${record.service_id}`}
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

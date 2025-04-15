"use client";

import "./css/home.css";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [vin, setVin] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    const res = await fetch(`http://localhost:4000/services?vin=${vin}&phone=${phone}`);
    const data = await res.json();
  
    if (data.length > 0) {
      router.push(`/collection/${vin}`);
    } else {
      setError("No service record found with that VIN and phone number.");
    }
  };
  

  return (
    <main className="home-container">

<nav className="nav-bar">
  <a href="/collection" className="admin-link">Collection</a>
</nav>


      <header className="site-header">
  <h1>DriveDocs</h1>
  <p className="tagline">Your Digital Vehicle Service History</p>
</header>


      <div className="home-grid">
  {/* Left: Features */}
  <section className="features">
    <div className="feature">
      <h3>📁 Track All Services</h3>
      <p>Keep a log of every oil change, inspection, and repair your vehicle receives.</p>
    </div>
    <div className="feature">
      <h3>🔍 Quick VIN Lookup</h3>
      <p>Instantly find your vehicle's history using just your VIN number.</p>
    </div>
    <div className="feature">
      <h3>🛠️ Garage Friendly</h3>
      <p>Designed for both car owners and service professionals to collaborate efficiently.</p>
    </div>
    <div className="feature">
      <h3>📅 Time-Saving</h3>
      <p>No more lost receipts. Everything is securely stored and easily accessible.</p>
    </div>
  </section>

  {/* Right: Search */}
  <section className="search-section">
    <h2>🔎 Search Vehicle History</h2>
    <p>Quickly find service records by entering your VIN below.</p>

    <form onSubmit={handleSearch}>
  <div>
    <label htmlFor="vin">Enter Your VIN</label>
    <input
      id="vin"
      type="text"
      value={vin}
      onChange={(e) => setVin(e.target.value)}
      placeholder="e.g. 1HGCM82633A123456"
      required
    />
  </div>

  <div>
    <label htmlFor="phone">Phone Number</label>
    <input
      id="phone"
      type="text"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      placeholder="e.g. 6471234567"
      required
    />
  </div>

  <button type="submit">Search</button>
</form>

    {error && <p className="error">{error}</p>}
  </section>
</div>


      <footer>© 2025 DriveDocs. All rights reserved.</footer>
      
    </main>
  );
}

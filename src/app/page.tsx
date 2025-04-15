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
    
  );
}

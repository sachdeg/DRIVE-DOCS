"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const handleSubmit = async (formData: any) => {
    // Step 1: Get all existing records
    const res = await fetch("http://localhost:4000/services");
    const data = await res.json();
    const router = useRouter();
  
    // Step 2: Find the highest service_id
    const maxId = data.reduce((max: number, record: any) => {
      return record.service_id > max ? record.service_id : max;
    }, 100); // default base is 100
  
    const newServiceId = maxId + 1;
  
    // Step 3: Send the new record with the next ID
    const newRecord = {
      service_id: newServiceId,
      vin: formData.vin,
      customer_name: formData.customer_name,
      license_plate: formData.license_plate,
      vehicle_model: formData.vehicle_model,
      service_date: formData.service_date,
      service_type: formData.service_type,
      cost: formData.cost,
      phone: formData.phone,
    };
  
    await fetch("http://localhost:4000/services", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newRecord),
    });
  
    // Redirect back to collection
    router.push("/collection");
  };
  
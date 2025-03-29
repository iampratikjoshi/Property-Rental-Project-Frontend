import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GenerateInvoice = () => {
  const [selectedTenantId, setSelectedTenantId] = useState("");
  const [savedTenants, setSavedTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setLoading(true);
      console.log("Fetching tenants...");

      const response = await axios.get(
        "http://localhost:4000/tenant/getalltenant"
      );

      console.log("API Response:", response.data); // Debugging

      if (response.data) {
        const companyNames = response.data
          .filter(
            (tenant) =>
              tenant.company_name && tenant.company_name.trim() !== ""
          )
          .map((tenant) => ({
            id: tenant.tenantId, // Ensure this matches the API response
            company_name: tenant.company_name,
            company_address: tenant.company_address || "",
            rent: tenant.rent || 0,
            agreementDate: tenant.date_of_agreement,
            annualRentIncrement: tenant.annual_rent_increment || 0,
            PropertyId: tenant.PropertyId || 1, // Ensure PropertyId is included
          }));

        console.log("Processed Tenants:", companyNames); // Debugging
        setSavedTenants(companyNames);
      }
    } catch (error) {
      console.error("Error fetching tenants:", error);
      setError("Failed to load companies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleGenerateClick = async () => {
  if (!selectedTenantId) {
    alert("Please select a company before generating the invoice.");
    return;
  }

  console.log("selected tenant id:",selectedTenantId);
  
  const selectedTenant = savedTenants.find(
    (tenant) => tenant.id === Number(selectedTenantId)
  );

  console.log("selected tenant:",selectedTenant);
  
  if (!selectedTenant) {
    alert("Selected company not found.");
    return;
  }

  try {
    // Fetch tenant data from the backend
    const tenantResponse = await axios.get(
      `http://localhost:4000/tenant/gettenant/${selectedTenant.id}`
    );

    const tenantData = tenantResponse.data;
    console.log("Tenant Data:", tenantData); // Debugging
    console.log("Tenant gst number in db:", tenantData.gst_number); // Debugging

    // Fetch property data from the backend
    // const propertyResponse = await axios.get(
    //   `http://localhost:4000/property/getproperty/${selectedTenant.PropertyId}`
    // );

    // const propertyData = propertyResponse.data;
    // console.log("Property Data:", propertyData); // Debugging

    // Create invoice data with fields from Tenant and Property tables
    const invoiceData = {
      tenantId: selectedTenant.id,
      PropertyId: selectedTenant.PropertyId,
      invoice_number:tenantData.invoice_number,
      companyName: tenantData.company_name, // Ensure this is not undefined
      companyAddress: tenantData.company_address, // Ensure this is not undefined
      landlordName: "Abhilash Kalokhe", // Ensure this is not undefined
      landlordAddress: "Ravet", // Ensure this is not undefined
      amount: tenantData.rent, // Ensure this is not undefined
      incrementPercentage: tenantData.annual_rent_increment, // Optional field
      incrementedAmount:
        tenantData.rent * (1 + tenantData.annual_rent_increment / 100), // Ensure this is not NaN
      date: new Date().toISOString(),
      GSTNo: tenantData.gst_number || "N/A", // Optional field
      companyBankDetails: tenantData.companyBankDetails || "N/A", // Optional field
    };

    console.log("Invoice Data Being Sent:", invoiceData); // Debugging

    setLoading(true);

    // Send invoice data to the backend
    const response = await axios.post(
      "http://localhost:4000/invoice/create",
      invoiceData
    );

    if (response.data) {
      alert("Invoice generated successfully!");
      navigate(`/invoices/owner?tenantId=${selectedTenantId}`);
    }
  } catch (error) {
    console.error("Error creating invoice:", error);
    alert(
      `Failed to generate invoice: ${error.response?.data?.message || "Unknown error"}`
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4 ml-12">Generate Invoice</h2>
      <div className="mb-4">
        <label className="block mb-2">Select Company:</label>
        <div className="relative">
          <select
            className="block w-full bg-white border border-gray-300 rounded px-4 py-2"
            value={selectedTenantId}
            onChange={(e) => {
              console.log("Selected Tenant ID:", e.target.value); // Debugging
              setSelectedTenantId(e.target.value);
            }}
          >
            <option value="" disabled>
              -- Select a Company --
            </option>
            {savedTenants.map((tenant) => (
              <option key={tenant.id} value={tenant.id}>
                {tenant.company_name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={handleGenerateClick}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Generating..." : "Generate Invoice"}
      </button>
    </div>
  );
};

export default GenerateInvoice;
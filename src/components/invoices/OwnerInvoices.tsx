import React, { useState, useEffect } from "react";
import axios from "axios";

const OwnerInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:4000/invoices/owner"
      );
      setInvoices(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading invoices...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Generated Invoices</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Invoice Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incremented Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.map((invoice) => (
              <tr key={invoice.InvoiceNumber}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.InvoiceNumber}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(invoice.Date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {invoice.CompanyName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{invoice.Amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  ₹{invoice.IncrementedAmount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => regeneratePDF(invoice)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OwnerInvoices;
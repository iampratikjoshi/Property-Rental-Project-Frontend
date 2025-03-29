import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const InvoiceDetail = () => {
  const { id } = useParams(); // Get the invoice ID from the URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:4000/invoice/getinvoice/${id}`
        ); // Fetch specific invoice
        setInvoice(response.data); // Set the fetched invoice data
        console.log("invoice details:", response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setError("Failed to load invoice. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice(); // Fetch the invoice when the component mounts
  }, [id]);

  // Utility function to format currency values
  const formatCurrency = (amount) => {
    if (!amount) return "₹0.00";
    const numAmount =
      typeof amount === "string"
        ? parseFloat(amount.replace(/[^\d.-]/g, ""))
        : amount;
    if (isNaN(numAmount)) return "₹0.00";
    try {
      const fixedNumber = Number(numAmount).toFixed(2);
      const [whole, decimal] = fixedNumber.split(".");
      const formattedWhole = whole.replace(
        /\B(?=(\d{2})+(?!\d))?(?=(\d{3})+(?!\d))/g,
        ","
      );
      return `₹${formattedWhole}.${decimal}`;
    } catch (error) {
      console.error("Error formatting currency:", error);
      return "₹0.00";
    }
  };

  // const calculateRent = (rent, agreementDate, annualRentIncrement) => {
  //   const startDate = new Date(agreementDate);
  //   const today = new Date();
  //   const months =
  //     (today.getFullYear() - startDate.getFullYear()) * 12 +
  //     (today.getMonth() - startDate.getMonth());
  //   const years = Math.floor(months / 12);
  //   let newRent = parseFloat(rent);

  //   for (let i = 0; i < years; i++) {
  //     newRent += newRent * (annualRentIncrement / 100);
  //   }

  //   return newRent.toFixed(2);
  // };

  // Ensure invoice is available before calculating adjusted rent
  // const adjustedRent = invoice
  //   ? calculateRent(invoice.Amount, invoice.agreementDate, invoice.annualRentIncrement)
  //   : '0.00';

  // Ensure invoice is available before calculating GST
  const rentAmount = invoice ? parseFloat(invoice.Amount) || 0 : 0;
  const cgst = (rentAmount * 9) / 100; // 9% CGST
  const sgst = (rentAmount * 9) / 100; // 9% SGST
  const finalRent = rentAmount + cgst + sgst; // Rent + GST

  const generatePDF = () => {
    if (!invoice) return;
    console.log("invoice details:", invoice);

    // const adjustedRent = calculateRent(invoice.Amount, invoice.agreementDate, invoice.annualRentIncrement);

    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    });
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // PDF generation logic (unchanged)
    // ... (same as your existing PDF generation code)

    doc.save(`invoice_${invoice.invoiceNumber}.pdf`);
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 ml-12">
        Invoice Details
      </h2>
      <div className="bg-white shadow-md rounded-lg p-4 sm:p-6">
        {/* Invoice Details Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p>
              <strong>Invoice Number:</strong> {invoice.InvoiceNumber}
            </p>
            <p>
              <strong>Date Issued:</strong> {invoice.dateIssued}
            </p>
            <p>
              <strong>Due Date:</strong> {invoice.dueDate}
            </p>
          </div>
          <div>
            <p>
              <strong>Status:</strong>
              <span
                className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  invoice.status === "Paid"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {invoice.status}
              </span>
            </p>
          </div>
        </div>

        {/* Landlord and Tenant Details Section */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Landlord</h3>
            <p>{invoice.LandlordName}</p>
            <p>{invoice.landlordPhone}</p>
            <p>{invoice.landlordEmail}</p>
          </div>
          <div>
            <h3 className="font-semibold">Tenant</h3>
            <p>{invoice.tenantName}</p>
            <p>{invoice.tenantPhone}</p>
            <p>{invoice.tenantEmail}</p>
          </div>
        </div>

        {/* Property Address Section */}
        <div className="mt-4">
          <h3 className="font-semibold">Property Address</h3>
          <p>{invoice.propertyAddress}</p>
        </div>

        {/* Charges Section */}
        <div className="mt-4">
          <h3 className="font-semibold">Charges</h3>
          <table className="w-full mt-2">
            <tbody>
              <tr>
                <td>Rent</td>
                <td className="text-right">{formatCurrency(invoice.Amount)}</td>
                {/* <td className="text-right">{formatCurrency(adjustedRent)}</td> */}
              </tr>
              <tr>
                <td>CGST (9%)</td>
                <td className="text-right">{formatCurrency(cgst)}</td>
              </tr>
              <tr>
                <td>SGST (9%)</td>
                <td className="text-right">{formatCurrency(sgst)}</td>
              </tr>
              <tr className="font-bold">
                <td>Total</td>
                <td className="text-right">
                  {formatCurrency(finalRent)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Payment Information Section */}
        <div className="mt-4">
          <p>
            <strong>Payment Instructions:</strong> {invoice.paymentInstructions}
          </p>
          <p>
            <strong>Notes:</strong> {invoice.notes}
          </p>
          <p>
            <strong>Payment Terms:</strong> {invoice.paymentTerms}
          </p>
        </div>

        {/* Download PDF Button */}
        <div className="mt-6">
          <button
            onClick={generatePDF}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetail;

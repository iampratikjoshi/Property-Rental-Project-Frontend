import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
    .format(amount)
    .replace("₹", "")
    .trim();
}

// Helper function to convert number to words (supports Indian numbering system)
function numberToWords(num) {
  const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Lakh", "Crore"];

  if (num === 0) return "Zero";

  const convertLessThanThousand = (n) => {
    if (n === 0) return "";
    if (n < 10) return units[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return `${tens[Math.floor(n / 10)]} ${units[n % 10]}`.trim();
    return `${units[Math.floor(n / 100)]} Hundred ${convertLessThanThousand(n % 100)}`.trim();
  };

  let word = "";
  let numStr = Math.floor(num).toString(); // Handle only integer part
  let i = 0;

  while (numStr.length > 0) {
    if (i === 0) { // Units, Tens, Hundreds
      let chunk = parseInt(numStr.slice(-3)) || 0;
      if (chunk > 0) word = `${convertLessThanThousand(chunk)} ${thousands[i]} ${word}`.trim();
      numStr = numStr.slice(0, -3);
    } else if (i === 1) { // Thousands
      let chunk = parseInt(numStr.slice(-2)) || 0;
      if (chunk > 0) word = `${convertLessThanThousand(chunk)} ${thousands[i]} ${word}`.trim();
      numStr = numStr.slice(0, -2);
    } else if (i === 2) { // Lakhs
      let chunk = parseInt(numStr.slice(-2)) || 0;
      if (chunk > 0) word = `${convertLessThanThousand(chunk)} ${thousands[i]} ${word}`.trim();
      numStr = numStr.slice(0, -2);
    } else if (i === 3) { // Crores
      let chunk = parseInt(numStr) || 0;
      if (chunk > 0) word = `${convertLessThanThousand(chunk)} ${thousands[i]} ${word}`.trim();
      numStr = "";
    }
    i++;
  }

  return word.trim();
}

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        setLoading(true);
        console.log("Fetching all invoices...");
        const response = await axios.get("http://localhost:4000/invoice/getallinvoices");
        console.log("API Response:", response.data);
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        setError("Failed to load invoices. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const handleView = (invoiceId) => {
    navigate(`/invoices/${invoiceId}`);
  };

  const handleDownload = async (invoiceNumber) => {
    try {
      const invoiceData = invoices.find((invoice) => invoice.InvoiceNumber === invoiceNumber);

      if (!invoiceData) {
        alert("Invoice data not found");
        return;
      }

      const doc = new jsPDF();

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Tax Invoice", 105, 10, { align: "center" });

      doc.setFontSize(8);
      doc.setFont("helvetica", "bold");
      doc.rect(10, 16, 190, 38);
      doc.text("Kalokhe Warehousing", 14, 20);
      doc.setFont("helvetica", "normal");
      doc.text("Abhilash Tukaram Kalokhe", 14, 25);
      doc.text("Plot No: 296, Sector 27,", 14, 30);
      doc.text("Nigdi Pradhikaran, Pune, Maharashtra 411044", 14, 35);
      doc.text("GSTIN/UIN: JFIPK6600E1ZG", 14, 40);
      doc.text("E-Mail: abhilashkalokhe@gmail.com", 14, 45);
      doc.text("Mobile No: 7721047777", 14, 50);

      doc.rect(110, 16, 90, 38);
      doc.setFontSize(8);
      doc.text("Invoice No. :", 115, 20);
      doc.text(invoiceData.InvoiceNumber.toString(), 170, 20, { align: "right" });
      doc.text("Date :", 115, 25);
      doc.text(new Date(invoiceData.Date).toLocaleDateString(), 170, 25, { align: "right" });
      doc.text("SAC No :", 115, 30);
      doc.text(invoiceData.SACNo || "997212", 170, 30, { align: "right" });

      doc.autoTable({
        startY: 54,
        head: [["Buyer (Bill to)"]],
        body: [
          [invoiceData.CompanyName || ""],
          [invoiceData.CompanyAddress || ""],
          [`GSTIN/UIN: ${invoiceData.GSTNo || "N/A"}`],
        ],
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 190 },
        },
        theme: "grid",
        tableWidth: 180,
        margin: { left: 10 },
      });

      // Calculate the previous month dynamically
    // Calculate the previous month dynamically
const currentDate = new Date();
const previousMonthIndex = currentDate.getMonth() - 1; // Get previous month index
const previousMonthDate = new Date(currentDate.setMonth(previousMonthIndex)); // Create a new date with previous month
const previousMonthName = previousMonthDate.toLocaleString('default', { month: 'long' }); // Get the full month name

      doc.autoTable({
        startY: doc.lastAutoTable.finalY,
        head: [["SR No.", "Particulars", "Amount"]],
        body: [["1", `Rent for ${previousMonthName}`, formatCurrency(invoiceData.Amount)]],
        styles: {
          fontSize: 8,
          cellPadding: 2,
          lineWidth: 0.2,
          lineColor: [0, 0, 0],
        },
        headStyles: {
          fillColor: [240, 240, 240],
          textColor: [0, 0, 0],
          fontStyle: "bold",
        },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 100 },
          2: { cellWidth: 50 },
        },
        theme: "grid",
        tableWidth: 180,
        margin: { left: 10 },
      });

      const cgst = invoiceData.Amount * 0.09;
      const sgst = invoiceData.Amount * 0.09;
      const totalTax = cgst + sgst;
      const grandTotal = invoiceData.Amount + totalTax;

      let finalY = doc.lastAutoTable.finalY + 5;
      doc.rect(10, finalY - 5, 190, 20);
      doc.setFontSize(8);
      doc.text("CGST @ 9% ON RENT", 120, finalY, { align: "right" });
      doc.text(formatCurrency(cgst), 190, finalY, { align: "right" });
      finalY += 5;
      doc.text("SGST @ 9% ON RENT", 120, finalY, { align: "right" });
      doc.text(formatCurrency(sgst), 190, finalY, { align: "right" });
      finalY += 5;
      // doc.text("Less: ROUND OFF", 120, finalY, { align: "right" });
      // doc.text("(0.00)", 190, finalY, { align: "right" });

      finalY += 10;
      doc.rect(10, finalY - 5, 190, 10);
      doc.setFont("helvetica", "bold");
      doc.text("TOTAL", 120, finalY, { align: "right" });
      doc.text(formatCurrency(grandTotal), 190, finalY, { align: "right" });
      doc.setFont("helvetica", "normal");

      finalY += 10;
      doc.rect(10, finalY - 5, 190, 15);
      doc.setFontSize(8);
      doc.text("Amount Chargeable (in words)", 14, finalY);
      doc.setFont("helvetica", "bold");
      doc.text(`INR ${numberToWords(Math.floor(grandTotal))} ONLY`, 14, finalY + 5);
      doc.setFont("helvetica", "normal");

      finalY += 15;
      doc.rect(10, finalY - 5, 190, 20);
      doc.setFont("helvetica", "bold");
      doc.text("for KALOKHE WAREHOUSING", 14, finalY + 10);
      doc.text("Receiver's Signature", 190, finalY + 10, { align: "right" });
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.text("This is a Computer Generated Invoice", 105, finalY + 40, { align: "center" });

      // Save the PDF with dynamic company name and invoice number
      const companyName = invoiceData.CompanyName.replace(/\s+/g, "_"); // Replace spaces with underscores
      doc.save(`${companyName}_${invoiceData.InvoiceNumber}.pdf`);
    } catch (error) {
      console.error("Error generating invoice:", error);
      alert("Failed to generate invoice. Please try again.");
    }
  };

  if (loading) return <div className="p-6">Loading invoices...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 ml-12">All Invoices</h2>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Invoice Number
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Tenant ID
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Rent
                </th>
                <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoiceData) => (
                <tr key={invoiceData.InvoiceNumber}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:text-base">
                    {invoiceData.InvoiceNumber}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:text-base">
                    {new Date(invoiceData.Date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:text-base">
                    {invoiceData.CompanyName}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:text-base">
                    {invoiceData.tenantId}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm sm:text-base">
                    ₹{invoiceData.Amount.toFixed(2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <button
                        onClick={() => handleView(invoiceData.InvoiceNumber)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye size={20} />
                      </button>
                      <button
                        onClick={() => handleDownload(invoiceData.InvoiceNumber)}
                        className="text-green-600 hover:text-green-900"
                      >
                        <FaDownload size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
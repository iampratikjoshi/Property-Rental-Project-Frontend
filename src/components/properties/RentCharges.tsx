import React, { useContext, useState } from "react";
import { PropertyContext } from "./PropertyContext";
import axios from "axios";

interface RentChargesProps {
  onSubmit: () => void;
  onBack: () => void;
  onPropertyCreated: (message: string, isSuccess: boolean) => void;
}

const RentCharges: React.FC<RentChargesProps> = ({ onSubmit, onBack, onPropertyCreated }) => {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); // To disable the submit button

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updatePropertyData(e.target.name, e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the submit button

    try {
      const response = await axios.post(
        "http://localhost:4000/property/create",
        { propertyData }
      );
      console.log("Response:", response.data);

      // Notify the parent component about successful creation
      onPropertyCreated("Property created successfully!", true);

      // Redirect to the relative path after 2 seconds
      setTimeout(() => {
        window.location.href = "/properties/all"; // Use relative path
      }, 2000);
    } catch (error) {
      console.log("Error submitting property data:", error);

      // Notify the parent component about the error
      onPropertyCreated("Failed to create property. Please try again.", false);
    } finally {
      setIsSubmitting(false); // Re-enable the submit button
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="number"
        name="General_Rent"
        placeholder="General Rent"
        className="w-full p-2 border rounded"
        value={propertyData.generalRent}
        onChange={handleChange}
        required
      />
      <input
        type="number"
        name="Security_Deposit"
        placeholder="Security Deposit"
        className="w-full p-2 border rounded"
        value={propertyData.securityDeposit}
        onChange={handleChange}
        required
      />
      <select
        name="Type_Of_Property"
        className="w-full p-2 border rounded"
        value={propertyData.propertyType}
        onChange={handleChange}
        required
      >
        <option value="">Type Of Property</option>
        <option value="own">Own</option>
        <option value="lease">Lease</option>
      </select>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Back
        </button>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isSubmitting} // Disable the button while submitting
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </div>
    </form>
  );
};

export default RentCharges;
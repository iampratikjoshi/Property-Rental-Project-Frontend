import React, { useContext } from "react";
import { PropertyContext } from "./PropertyContext";

interface PropertyLocationProps {
  onSubmit: () => void;
  onBack: () => void;
}

const PropertyLocation: React.FC<PropertyLocationProps> = ({ onSubmit, onBack }) => {
  const { propertyData, updatePropertyData } = useContext(PropertyContext);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updatePropertyData(e.target.name, e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="Country"
        placeholder="Country"
        className="w-full p-2 border rounded"
        value={propertyData.country}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="State"
        placeholder="State"
        className="w-full p-2 border rounded"
        value={propertyData.state}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="City"
        placeholder="City"
        className="w-full p-2 border rounded"
        value={propertyData.city}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="Zipcode"
        placeholder="Zipcode"
        className="w-full p-2 border rounded"
        value={propertyData.zipcode}
        onChange={handleChange}
        required
      />
      <textarea
        name="Property_Address"
        placeholder="Address"
        className="w-full p-2 border rounded"
        rows={3}
        value={propertyData.address}
        onChange={handleChange}
        required
      ></textarea>
      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="bg-gray-300 text-black px-4 py-2 rounded"
        >
          Back
        </button>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save & Next
        </button>
      </div>
    </form>
  );
};

export default PropertyLocation;
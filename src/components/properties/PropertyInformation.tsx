import React, { useContext } from "react";
import { PropertyContext } from "./PropertyContext";

interface PropertyInformationProps {
  onSubmit: () => void;
}

const PropertyInformation: React.FC<PropertyInformationProps> = ({ onSubmit }) => {
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
        name="Property_Name"
        placeholder="Property Name"
        className="w-full p-2 border rounded"
        value={propertyData.propertyName}
        onChange={handleChange}
        required
      />
      <textarea
        name="Property_Description"
        placeholder="Description"
        className="w-full p-2 border rounded"
        rows={4}
        value={propertyData.description}
        onChange={handleChange}
        required
      ></textarea>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
        Save & Next
      </button>
    </form>
  );
};

export default PropertyInformation;
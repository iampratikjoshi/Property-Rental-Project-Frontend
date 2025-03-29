import { useState, useEffect } from "react";
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const OwnProperty = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/property/getallproperty"
        );
        console.log("all properties:", response.data);
        const ownProperties = response.data.filter(
          (property) => property.Type_Of_Property === "own"
        );
        setProperties(ownProperties);
      } catch (error) {
        console.log("error while fetching all properties:", error);
      }
    };

    fetchProperties();
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Own Properties</h2>
      {/* <Link
        to="/properties/add"
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded inline-block"
      >
        Add New Property
      </Link> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white p-6 rounded-lg shadow">
             <h3 className="text-xl font-semibold mb-2">{property.Property_Name}</h3>
            <p>Description: {property.Property_Description}</p>
            <p>Location: {property.Property_Address}</p>
            <p>Type: {property.Type_Of_Property}</p>
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OwnProperty;

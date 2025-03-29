import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { Plus } from "lucide-react";
import AllProperties from "./properties/AllProperties";
import AllUnits from "./properties/AllUnits";
import OwnProperty from "./properties/OwnProperty";
import AddNewProperty from "./properties/AddNewProperty";
import { PropertyContextProvider } from "./properties/PropertyContextProvider";

const Properties = () => {
  return (
    <PropertyContextProvider>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6 ml-10">Properties</h1>
        <div className="mb-6 flex space-x-2">
          <Link
            to="/properties/all"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            All Properties
          </Link>
          {/* <Link to="/properties/units" className="bg-blue-500 text-white px-4 py-2 rounded">All Units</Link> */}
          <Link
            to="/properties/own"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Own Property
          </Link>
          <Link
            to="/properties/add"
            className="bg-green-500 text-white px-4 py-2 rounded flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add New Property
          </Link>
        </div>
        <Routes>
          <Route path="all" element={<AllProperties />} />
          <Route path="own" element={<OwnProperty />} />
          <Route path="add" element={<AddNewProperty />} />
        </Routes>
      </div>
    </PropertyContextProvider>
  );
};

export default Properties;

import React from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import AllTenants from './tenants/AllTenants';
import TenantsHistory from './tenants/TenantsHistory';

const Tenants = () => {
  return (
    <div className="p-4 sm:p-6">
      {/* Responsive Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 ml-11">Tenants</h1>

      {/* Responsive Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4 sm:mb-6">
        {/* <Link
          to="/tenants/all"
          className="bg-blue-500 text-white px-4 py-2 rounded text-center sm:text-left hover:bg-blue-600 transition-colors"
        >
          All Tenants
        </Link> */}
        {/* <Link
          to="/tenants/history"
          className="bg-blue-500 text-white px-4 py-2 rounded text-center sm:text-left hover:bg-blue-600 transition-colors"
        >
          Tenants History
        </Link> */}
      </div>

      {/* Routes */}
      <Routes>
        <Route path="all" element={<AllTenants />} />
        <Route path="history" element={<TenantsHistory />} />
      </Routes>
    </div>
  );
};

export default Tenants;
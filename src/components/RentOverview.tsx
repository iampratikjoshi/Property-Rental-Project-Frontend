import React from 'react';
import { AlertCircle, TrendingUp, IndianRupee } from 'lucide-react';

const RentOverview = ({ tenants }) => {
  // Calculate total expected rent (rent from unpaid tenants)
  const totalExpectedRent = tenants.reduce((sum, tenant) => 
    tenant.payment_status !== 'paid' ? sum + parseFloat(tenant.rent) : sum, 0
  );

  // Calculate total collected rent (rent from paid tenants)
  const totalCollectedRent = tenants.reduce((sum, tenant) => 
    tenant.payment_status === 'paid' ? sum + parseFloat(tenant.rent) : sum, 0
  );

  // Calculate pending payments
  const pendingPayments = tenants.filter(tenant => tenant.payment_status !== 'paid').length;

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Expected Rent</p>
              <p className="text-2xl font-bold">₹{totalExpectedRent.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-4 h-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Collected Rent</p>
              <p className="text-2xl font-bold">₹{totalCollectedRent.toLocaleString('en-IN')}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <div>
              <p className="text-sm font-medium">Pending Payments</p>
              <p className="text-2xl font-bold">{pendingPayments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            <div>
              <p className="text-sm font-medium">Collection Rate</p>
              <p className="text-2xl font-bold">
                {((totalCollectedRent / (totalCollectedRent + totalExpectedRent)) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Status Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Recent Payments</h2>
        </div>
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-left">Tenant</th>
                  <th className="p-2 text-left">Property</th>
                  <th className="p-2 text-left">Due Date</th>
                  <th className="p-2 text-left">Amount</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.slice(0, 5).map((tenant, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{tenant.tenant_name}</td>
                    <td className="p-2">{tenant.property_landlord}</td>
                    <td className="p-2">{new Date().toLocaleDateString()}</td>
                    <td className="p-2">₹{parseFloat(tenant.rent).toLocaleString('en-IN')}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        tenant.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {tenant.payment_status === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Collection Progress</h2>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Overall Collection</span>
              <span>{((totalCollectedRent / (totalCollectedRent + totalExpectedRent)) * 100).toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${(totalCollectedRent / (totalCollectedRent + totalExpectedRent)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-1">
              <span>Payment Status</span>
              <span>{((tenants.length - pendingPayments) / tenants.length * 100).toFixed(1)}% Paid</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-green-500 h-2.5 rounded-full" 
                style={{ width: `${((tenants.length - pendingPayments) / tenants.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RentOverview;

import React from 'react';

const TenantsHistory = () => {
  // Sample data, replace with actual data
  const pastTenants = [
    { id: 1, name: 'Alice Johnson', company: 'Tech Solutions', property: 'Sunset Apartments', endDate: '2023-01-15' },
    { id: 2, name: 'Bob Williams', company: 'Marketing Pro', property: 'Green Valley Homes', endDate: '2023-03-31' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Tenants History</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Company</th>
              <th className="p-2 text-left">Property</th>
              <th className="p-2 text-left">End Date</th>
            </tr>
          </thead>
          <tbody>
            {pastTenants.map((tenant) => (
              <tr key={tenant.id}>
                <td className="p-2">{tenant.name}</td>
                <td className="p-2">{tenant.company}</td>
                <td className="p-2">{tenant.property}</td>
                <td className="p-2">{tenant.endDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenantsHistory;
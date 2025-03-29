import React from 'react';

const AllUnits = () => {
  // Sample data, replace with actual data
  const units = [
    { id: 1, name: 'Unit A1', property: 'Sunset Apartments', status: 'Occupied' },
    { id: 2, name: 'Unit B2', property: 'Green Valley Homes', status: 'Available' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">All Units</h2>
      <button className="mb-4 bg-green-500 text-white px-4 py-2 rounded">Add Unit</button>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Unit Name</th>
              <th className="p-2 text-left">Property</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit) => (
              <tr key={unit.id}>
                <td className="p-2">{unit.name}</td>
                <td className="p-2">{unit.property}</td>
                <td className="p-2">{unit.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUnits;
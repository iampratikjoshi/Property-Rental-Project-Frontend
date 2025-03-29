// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const AllProperties = () => {
//   const [properties, setProperties] = useState([]);
//   const [selectedProperty, setSelectedProperty] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState({
//     PropertyId: '',
//     Property_Name: '',
//     Property_Address: '',
//     Property_Description: '',
//     Type_Of_Property: '',
//     Country: '',
//     State: '',
//     City: '',
//     Zipcode: '',
//     General_Rent: '',
//     Security_Deposit: '',
//   });

//   useEffect(() => {
//     const fetchProperties = async () => {
//       try {
//         const response = await axios.get('http://localhost:4000/property/getallproperty');
//         console.log('all properties:', response.data);
//         setProperties(response.data);
//       } catch (error) {
//         console.log('error while fetching all properties:', error);
//       }
//     };

//     fetchProperties();
//   }, []);

//   const handleViewDetails = (property) => {
//     setSelectedProperty(property);
//   };

//   const handleClosePopup = () => {
//     setSelectedProperty(null);
//     setIsEditing(false);
//   };

//   const handleEditProperty = (property) => {
//     setEditForm(property);
//     setIsEditing(true);
//   };

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     setEditForm({ ...editForm, [name]: value });
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put('http://localhost:4000/property/update', editForm);
//       setProperties(properties.map((prop) => (prop.PropertyId === editForm.PropertyId ? editForm : prop)));
//       setIsEditing(false);
//       setSelectedProperty(null);
//     } catch (error) {
//       console.log('Error updating property:', error);
//     }
//   };

//   const handleDeleteProperty = async () => {
//     try {
//       await axios.delete('http://localhost:4000/property/delete', {
//         data: { PropertyId: selectedProperty.PropertyId }
//       });
//       setProperties(properties.filter(prop => prop.PropertyId !== selectedProperty.PropertyId));
//       setSelectedProperty(null);
//     } catch (error) {
//       console.log('Error deleting property:', error);
//     }
//   };

//   return (
//     <div className="p-4 sm:p-6">
//       <h2 className="text-xl sm:text-2xl font-semibold mb-4">All Properties</h2>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
//         {properties.map((property) => (
//           <div key={property.PropertyId} className="bg-white p-4 sm:p-6 rounded-lg shadow">
//             <h3 className="text-lg sm:text-xl font-semibold mb-2">{property.Property_Name}</h3>
//             <p className="text-sm sm:text-base">Description: {property.Property_Description}</p>
//             <p className="text-sm sm:text-base">Location: {property.Property_Address}</p>
//             <p className="text-sm sm:text-base">Type: {property.Type_Of_Property}</p>
//             <button
//               className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base"
//               onClick={() => handleViewDetails(property)}
//             >
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>

//       {selectedProperty && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6">
//           <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl overflow-y-auto max-h-[90vh]">
//             <h3 className="text-xl sm:text-2xl font-semibold mb-4">{selectedProperty.Property_Name}</h3>
//             {isEditing ? (
//               <form onSubmit={handleFormSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm sm:text-base font-medium text-gray-700">Property Name</label>
//                   <input
//                     type="text"
//                     name="Property_Name"
//                     value={editForm.Property_Name}
//                     onChange={handleFormChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm sm:text-base font-medium text-gray-700">Property Description</label>
//                   <textarea
//                     name="Property_Description"
//                     value={editForm.Property_Description}
//                     onChange={handleFormChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                     rows="3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm sm:text-base font-medium text-gray-700">City</label>
//                     <input
//                       type="text"
//                       name="City"
//                       value={editForm.City}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm sm:text-base font-medium text-gray-700">Country</label>
//                     <input
//                       type="text"
//                       name="Country"
//                       value={editForm.Country}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm sm:text-base font-medium text-gray-700">State</label>
//                     <input
//                       type="text"
//                       name="State"
//                       value={editForm.State}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm sm:text-base font-medium text-gray-700">Zipcode</label>
//                     <input
//                       type="text"
//                       name="Zipcode"
//                       value={editForm.Zipcode}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm sm:text-base font-medium text-gray-700">Address</label>
//                   <input
//                     type="text"
//                     name="Property_Address"
//                     value={editForm.Property_Address}
//                     onChange={handleFormChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm sm:text-base font-medium text-gray-700">Type of Property</label>
//                   <input
//                     type="text"
//                     name="Type_Of_Property"
//                     value={editForm.Type_Of_Property}
//                     onChange={handleFormChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                   />
//                 </div>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm sm:text-base font-medium text-gray-700">General Rent</label>
//                     <input
//                       type="text"
//                       name="General_Rent"
//                       value={editForm.General_Rent}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm sm:text-base font-medium text-gray-700">Security Deposit</label>
//                     <input
//                       type="text"
//                       name="Security_Deposit"
//                       value={editForm.Security_Deposit}
//                       onChange={handleFormChange}
//                       className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end space-x-4 mt-4">
//                   <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base">
//                     Save
//                   </button>
//                   <button
//                     type="button"
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm sm:text-base"
//                     onClick={() => setIsEditing(false)}
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             ) : (
//               <>
//                 <p className="text-sm sm:text-base">Description: {selectedProperty.Property_Description}</p>
//                 <p className="text-sm sm:text-base">Location: {selectedProperty.Property_Address}</p>
//                 <div className="flex justify-end space-x-4 mt-4">
//                   <button
//                     className="bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base"
//                     onClick={() => handleEditProperty(selectedProperty)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-4 py-2 rounded text-sm sm:text-base"
//                     onClick={handleDeleteProperty}
//                   >
//                     Delete
//                   </button>
//                   <button
//                     className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm sm:text-base"
//                     onClick={handleClosePopup}
//                   >
//                     Close
//                   </button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllProperties;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    PropertyId: '',
    tenantId: '',
    Property_Name: '',
    Property_Address: '',
    Property_Description: '',
    Type_Of_Property: '',
    Country: '',
    State: '',
    City: '',
    Zipcode: '',
    General_Rent: '',
    Security_Deposit: '',
    modifiedBy: ''
  });

  // Fetch all properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('http://localhost:4000/property/getallproperty');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        toast.error('Failed to load properties');
      }
    };
    fetchProperties();
  }, []);

  // View property details
  const handleViewDetails = (property) => {
    setSelectedProperty(property);
    setIsEditing(false);
  };

  // Close property details popup
  const handleClosePopup = () => {
    setSelectedProperty(null);
    setIsEditing(false);
  };

  // Start editing a property
  const handleEditProperty = (property) => {
    setEditForm({
      ...property,
      modifiedBy: 'current_user_id' // Replace with actual user ID from your auth system
    });
    setIsEditing(true);
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit property edits
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:4000/property/update/${editForm.PropertyId}`,
        editForm
      );
      
      if (response.data) {
        setProperties(properties.map(prop => 
          prop.PropertyId === editForm.PropertyId ? response.data : prop
        ));
        setSelectedProperty(response.data);
        setIsEditing(false);
        toast.success('Property updated successfully!');
      }
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error(error.response?.data?.message || 'Failed to update property');
    }
  };

  // Delete a property - UPDATED TO MATCH YOUR BACKEND
// const handleDeleteProperty = async () => {
//   try {
//     const confirm = window.confirm(
//       'This will delete the property and all related invoices. Continue?'
//     );
//     if (!confirm) return;

//     await axios.delete(`http://localhost:4000/property/delete/${selectedProperty.PropertyId}`);
    
//     setProperties(properties.filter(p => p.PropertyId !== selectedProperty.PropertyId));
//     setSelectedProperty(null);
//     toast.success('Property deleted successfully');
//   } catch (error) {
//     if (error.response?.status === 409) {
//       toast.error('Cannot delete - property has related invoices');
//     } else {
//       toast.error('Failed to delete property');
//     }
//     console.error('Delete error:', error);
//   }
// };
    const handleDeleteProperty = async () => {
      try {
        const confirm = window.confirm("Are you sure you want to delete this property?");
        if (!confirm) return;

        await axios.delete(`http://localhost:4000/property/delete/${selectedProperty.PropertyId}`);

        setProperties(properties.filter(p => p.PropertyId !== selectedProperty.PropertyId));
        setSelectedProperty(null);
        toast.success("Property deleted successfully");
      } catch (error) {
        toast.error("Failed to delete property");
        console.error("Delete error:", error);
      }
    };
  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">All Properties</h2>
      
      {/* Property Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {properties.map((property) => (
          <div key={property.PropertyId} className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{property.Property_Name}</h3>
            <p className="text-sm sm:text-base">Description: {property.Property_Description}</p>
            <p className="text-sm sm:text-base">Location: {property.Property_Address}</p>
            <p className="text-sm sm:text-base">Type: {property.Type_Of_Property}</p>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded text-sm sm:text-base"
              onClick={() => handleViewDetails(property)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Property Details/Edit Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6">
          <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg md:max-w-xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
              {isEditing ? 'Edit Property' : selectedProperty.Property_Name}
            </h3>
            
            {isEditing ? (
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700">Property Name*</label>
                  <input
                    type="text"
                    name="Property_Name"
                    value={editForm.Property_Name}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700">Description</label>
                  <textarea
                    name="Property_Description"
                    value={editForm.Property_Description}
                    onChange={handleFormChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    rows="3"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700">Country*</label>
                    <input
                      type="text"
                      name="Country"
                      value={editForm.Country}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700">State*</label>
                    <input
                      type="text"
                      name="State"
                      value={editForm.State}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700">City*</label>
                    <input
                      type="text"
                      name="City"
                      value={editForm.City}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700">Zipcode</label>
                    <input
                      type="text"
                      name="Zipcode"
                      value={editForm.Zipcode}
                      onChange={handleFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700">Address*</label>
                  <input
                    type="text"
                    name="Property_Address"
                    value={editForm.Property_Address}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                  />
                </div>
                
                <div>
                  <label className="block text-sm sm:text-base font-medium text-gray-700">Property Type*</label>
                  <input
                    type="text"
                    name="Type_Of_Property"
                    value={editForm.Type_Of_Property}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700">Rent (₹)*</label>
                    <input
                      type="number"
                      name="General_Rent"
                      value={editForm.General_Rent}
                      onChange={handleFormChange}
                      required
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-medium text-gray-700">Deposit (₹)</label>
                    <input
                      type="number"
                      name="Security_Deposit"
                      value={editForm.Security_Deposit}
                      onChange={handleFormChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <input type="hidden" name="tenantId" value={editForm.tenantId} />
                <input type="hidden" name="modifiedBy" value={editForm.modifiedBy} />
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm sm:text-base"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="space-y-3">
                  <p className="text-sm sm:text-base"><span className="font-medium">Description:</span> {selectedProperty.Property_Description}</p>
                  <p className="text-sm sm:text-base"><span className="font-medium">Address:</span> {selectedProperty.Property_Address}</p>
                  <p className="text-sm sm:text-base"><span className="font-medium">Location:</span> {selectedProperty.City}, {selectedProperty.State}, {selectedProperty.Country} {selectedProperty.Zipcode}</p>
                  <p className="text-sm sm:text-base"><span className="font-medium">Type:</span> {selectedProperty.Type_Of_Property}</p>
                  <p className="text-sm sm:text-base"><span className="font-medium">Rent:</span> ₹{selectedProperty.General_Rent}</p>
                  <p className="text-sm sm:text-base"><span className="font-medium">Deposit:</span> ₹{selectedProperty.Security_Deposit}</p>
                </div>
                
                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-blue-700"
                    onClick={() => handleEditProperty(selectedProperty)}
                  >
                    Edit Property
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded text-sm sm:text-base hover:bg-red-700"
                    onClick={handleDeleteProperty}
                  >
                    Delete Property
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm sm:text-base hover:bg-gray-400"
                    onClick={handleClosePopup}
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProperties;
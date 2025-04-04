import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Add this helper function here
const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().split("T")[0];
};

const AllTenants = () => {
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [showEditTenant, setShowEditTenant] = useState(false);
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/tenant/getalltenant"
      );
      console.log("all tenants:", response.data);
      setTenants(response.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      toast.error("Failed to load tenants");
    }
  };

  const addTenant = async (newTenant) => {
    try {
      const response = await axios.post(
        "http://localhost:4000/tenant/create",
        newTenant
      );
      setTenants([...tenants, response.data]);
      toast.success("Tenant added successfully");
      setShowAddTenant(false);
    } catch (error) {
      console.error("Error adding tenant:", error);
      toast.error(error.response?.data?.message || "Failed to add tenant");
    }
  };

  const handleEditClick = (tenant) => {
    setSelectedTenant(tenant);
    setShowEditTenant(true);
  };

  const handleDelete = async (tenantId) => {
    if (window.confirm("Are you sure you want to delete this tenant?")) {
      try {
        await axios.delete(`http://localhost:4000/tenant/delete/${tenantId}`);
        setTenants(tenants.filter((tenant) => tenant.tenantId !== tenantId));
        toast.success("Tenant deleted successfully");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error(error.response?.data?.message || "Failed to delete tenant");
      }
    }
  };


  const updateTenant = async (updatedTenant) => {
    try {
      // Prepare the complete update data
      const updateData = {
        ...updatedTenant,
        // Ensure numbers are properly formatted
        rent: Number(updatedTenant.rent),
        years_of_agreement: Number(updatedTenant.years_of_agreement),
        annual_rent_increment: Number(updatedTenant.annual_rent_increment),
      };

      const response = await axios.put(
        `http://localhost:4000/tenant/update/${updatedTenant.tenantId}`,
        updateData
      );

      // Properly update state without losing the tenant
      setTenants((prevTenants) =>
        prevTenants.map((tenant) =>
          tenant.tenantId === updatedTenant.tenantId ? response.data : tenant
        )
      );

      toast.success("Tenant updated successfully");
      setShowEditTenant(false);
    } catch (error) {
      console.error("Error updating tenant:", error);
      toast.error(error.response?.data?.message || "Failed to update tenant");
    }
  };

  const calculateRent = (rent, agreementDate, annualRentIncrement) => {
    if (!agreementDate) return rent;

    const startDate = new Date(agreementDate);
    const today = new Date();
    const months =
      (today.getFullYear() - startDate.getFullYear()) * 12 +
      (today.getMonth() - startDate.getMonth());
    const years = Math.floor(months / 12);
    let newRent = parseFloat(rent);

    for (let i = 0; i < years; i++) {
      newRent += newRent * (annualRentIncrement / 100);
    }

    return newRent.toFixed(2);
  };

  const handleUpdateRent = async () => {
    try {
      const response = await axios.post("http://localhost:4000/tenant/updateRentAnnually");
      alert(response.data.message);
    } catch (error) {
      console.error('Error updating rent:', error);
      alert('Failed to update rent');
    }
  };
  

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4">All Tenants</h2>
      <button
        onClick={() => setShowAddTenant(true)}
        className="mb-4 bg-green-500 text-white px-4 py-2 rounded flex items-center"
      >
        <Plus size={20} className="mr-2" />
        Add Tenant
      </button>
      <button
        onClick={handleUpdateRent}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded flex items-center"
      >
        Update Rent Annually
      </button>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Company</th>
                <th className="p-2 text-left">Property</th>
                <th className="p-2 text-left">GST Number</th>
                <th className="p-2 text-left">Current Rent</th>
                <th className="p-2 text-left">Rent Increment %</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant) => (
                <tr key={tenant.tenantId} className="border-t">
                  <td className="p-2">{tenant.company_name}</td>
                  <td className="p-2">{tenant.property_landlord}</td>
                  <td className="p-2">{tenant.gst_number}</td>
                  <td className="p-2">
                    ₹
                    {calculateRent(
                      tenant.rent,
                      tenant.date_of_agreement,
                      tenant.annual_rent_increment
                    )}
                  </td>
                  <td className="p-2">{tenant.annual_rent_increment}%</td>
                  <td className="p-2">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditClick(tenant)}
                        className="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(tenant.tenantId)}
                        className="p-1 text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddTenant && (
        <TenantFormModal
          mode="add"
          onClose={() => setShowAddTenant(false)}
          onSave={addTenant}
        />
      )}

      {showEditTenant && (
        <TenantFormModal
          mode="edit"
          tenant={selectedTenant}
          onClose={() => setShowEditTenant(false)}
          onSave={updateTenant}
        />
      )}
    </div>
  );
};

const TenantFormModal = ({ mode, tenant, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    company_name: "",
    gst_number: "",
    company_address: "",
    property_landlord: "",
    rent: "",
    years_of_agreement: "",
    date_of_agreement: "",
    annual_rent_increment: "",
    Description: "",
  });
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/property/getallproperty"
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching properties:", error);
        toast.error("Failed to load properties");
      }
    };

    fetchProperties();

    if (mode === "edit" && tenant) {
      // Properly initialize all fields with fallbacks
      setFormData({
        company_name: tenant.company_name || "",
        gst_number: tenant.gst_number || "",
        company_address: tenant.company_address || "",
        property_landlord: tenant.property_landlord || "",
        rent: tenant.rent ? String(tenant.rent) : "",
        years_of_agreement: tenant.years_of_agreement
          ? String(tenant.years_of_agreement)
          : "",
        date_of_agreement: tenant.date_of_agreement
          ? tenant.date_of_agreement.split("T")[0]
          : "",
        annual_rent_increment: tenant.annual_rent_increment
          ? String(tenant.annual_rent_increment)
          : "",
        Description: tenant.Description || "",
        tenantId: tenant.tenantId,
      });
    } else {
      // Reset form for add mode
      setFormData({
        company_name: "",
        gst_number: "",
        company_address: "",
        property_landlord: "",
        rent: "",
        years_of_agreement: "",
        date_of_agreement: "",
        annual_rent_increment: "",
        Description: "",
      });
    }
  }, [mode, tenant]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prev => ({ ...prev, [name]: value }));
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Remove any non-numeric characters except decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    setFormData((prev) => ({
      ...prev,
      [name]: numericValue,
    }));
  };

  const handlePropertyChange = (e) => {
    const selectedPropertyName = e.target.value;
    const selectedProperty = properties.find(
      (prop) => prop.Property_Name === selectedPropertyName
    );

    setFormData((prev) => ({
      ...prev,
      property_landlord: selectedPropertyName,
      rent: selectedProperty ? selectedProperty.General_Rent : "",
    }));
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   onSave(formData);
  // };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.company_name ||
      !formData.gst_number ||
      !formData.company_address ||
      !formData.property_landlord ||
      !formData.rent ||
      !formData.years_of_agreement ||
      !formData.date_of_agreement ||
      !formData.annual_rent_increment
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md mx-4">
        <h3 className="text-xl font-semibold mb-4">
          {mode === "add" ? "Add New Tenant" : "Edit Tenant"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Name*
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              GST Number*
            </label>
            <input
              type="text"
              name="gst_number"
              value={formData.gst_number}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Company Address*
            </label>
            <input
              type="text"
              name="company_address"
              value={formData.company_address}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Property*
            </label>
            <select
              name="property_landlord"
              value={formData.property_landlord}
              onChange={handlePropertyChange}
              className="w-full p-2 border rounded mt-1"
              required
            >
              <option value="">Select Property</option>
              {properties.map((prop) => (
                <option key={prop.PropertyId} value={prop.Property_Name}>
                  {prop.Property_Name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Rent (₹)*
            </label>
            <input
              type="text" // Use text to allow proper formatting
              name="rent"
              value={formData.rent}
              onChange={handleNumberChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agreement Years*
              </label>
              <input
                type="number"
                name="years_of_agreement"
                value={formData.years_of_agreement}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Agreement Date*
              </label>
              <input
                type="date"
                name="date_of_agreement"
                value={formData.date_of_agreement}
                onChange={handleChange}
                className="w-full p-2 border rounded mt-1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Annual Rent Increment (%)*
            </label>
            <input
              type="number"
              name="annual_rent_increment"
              value={formData.annual_rent_increment}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              rows={3}
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {mode === "add" ? "Add Tenant" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AllTenants;

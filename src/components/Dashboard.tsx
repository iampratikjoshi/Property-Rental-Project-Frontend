import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, Plus, FileText, Bell } from 'lucide-react';
import axios from 'axios';
import RentOverview from './RentOverview';
import Select from 'react-select';

const Dashboard = () => {
  const [properties, setProperties] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBellShaking, setIsBellShaking] = useState(false); // State for bell animation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [propertiesResponse, tenantsResponse, remindersResponse] = await Promise.all([
          axios.get('http://localhost:4000/property/getallproperty'),
          axios.get('http://localhost:4000/tenant/getalltenant'),
          axios.get('http://localhost:4000/reminder/getallreminders'),
        ]);

        setProperties(propertiesResponse.data);
        setTenants(tenantsResponse.data.map(tenant => ({
          ...tenant,
          payment_status: tenant.payment_status || 'pending',
        })));

        // Filter reminders to show only those within 1 hour of the current time
        const currentTime = new Date();
        const fetchedReminders = remindersResponse.data.filter(reminder => {
          const reminderTime = new Date(reminder.dateTime);
          const timeDifference = reminderTime - currentTime;
          return timeDifference > 0 && timeDifference <= 60 * 60 * 1000; // 1 hour in milliseconds
        });

        setReminders(fetchedReminders);
        setUnreadCount(fetchedReminders.filter(reminder => !reminder.isRead).length);

        // Start bell shaking if there are unread reminders
        if (fetchedReminders.length > 0) {
          setIsBellShaking(true);
        }

        setLoading(false);
      } catch (error) {
        console.log('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to mark reminders as read
  const markAsRead = async () => {
    try {
      await axios.post('http://localhost:4000/reminder/mark-as-read');
      setReminders((prevReminders) =>
        prevReminders.map((reminder) => ({ ...reminder, isRead: true }))
      );
      setUnreadCount(0); // Reset unread count
      setIsBellShaking(false); // Stop bell shaking
    } catch (error) {
      console.error('Error marking reminders as read:', error);
    }
  };

  // Function to format currency in Indian Rupees
  const formatToRupees = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  // Function to calculate current rent with increment
  const calculateRent = (rent, agreementDate, annualRentIncrement) => {
    const startDate = new Date(agreementDate);
    const today = new Date();
    const months = (today.getFullYear() - startDate.getFullYear()) * 12 + (today.getMonth() - startDate.getMonth());
    const years = Math.floor(months / 12);
    let newRent = parseFloat(rent);
    for (let i = 0; i < years; i++) {
      newRent += newRent * (annualRentIncrement / 100);
    }
    return newRent.toFixed(2);
  };

  // Function to handle payment status change
  const handlePaymentStatusChange = async (tenantId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/tenant/update/${tenantId}`, {
        payment_status: newStatus,
      });
      setTenants((prevTenants) =>
        prevTenants.map((tenant) =>
          tenant.tenantId === tenantId ? { ...tenant, payment_status: newStatus } : tenant
        )
      );
    } catch (error) {
      console.error('Error updating payment status:', error);
    }
  };

  // Options for the payment status dropdown
  const paymentStatusOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'pending', label: 'Pending' },
  ];

  return (
    <div className="p-6 relative">
      {/* Title and Bell Icon */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold ml-10">Dashboard</h1>
        <div className="relative mr-10">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (unreadCount > 0) markAsRead(); // Mark as read when notifications are opened
            }}
            className="relative"
          >
            <Bell
              size={24}
              className={`text-gray-500 hover:text-blue-500 transition-colors cursor-pointer ${
                isBellShaking ? 'animate-shake' : ''
              }`}
            />
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute top-8 right-0 w-80 bg-white rounded-lg shadow-lg z-50">
              <div className="p-4">
                {reminders.length > 0 ? (
                  <ul className="space-y-2 max-h-60 overflow-y-auto">
                    {reminders.map((reminder) => (
                      <li
                        key={reminder.reminderId}
                        className={`p-2 rounded ${
                          reminder.isRead ? 'bg-gray-100' : 'bg-blue-50'
                        }`}
                      >
                        <p className="font-medium">{reminder.subject}</p>
                        <p className="text-sm text-gray-600">{reminder.about}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(reminder.dateTime).toLocaleString('en-IN')}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-center text-gray-500">No reminders found</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard 
          title="Total Properties" 
          value={properties.length} 
          icon={<Home size={24} />} 
          link="/properties/all" 
        />
        <DashboardCard 
          title="Total Tenants" 
          value={tenants.length} 
          icon={<Users size={24} />} 
          link="/tenants/all" 
        />
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link to="/properties/add" className="bg-green-500 text-white p-4 rounded-lg shadow flex items-center justify-center hover:bg-green-600 transition-colors">
          <Plus size={24} className="mr-2" />
          Add New Property
        </Link>
        <Link to="/tenants/all" className="bg-blue-500 text-white p-4 rounded-lg shadow flex items-center justify-center hover:bg-blue-600 transition-colors">
          <Plus size={24} className="mr-2" />
          Add New Tenant
        </Link>
        <Link to="/invoices/generate" className="bg-purple-500 text-white p-4 rounded-lg shadow flex items-center justify-center hover:bg-purple-600 transition-colors">
          <FileText size={24} className="mr-2" />
          Generate Invoice
        </Link>
      </div>

      {/* Rent Overview Section */}
      {!loading && (
        <RentOverview 
          properties={properties} 
          tenants={tenants.map(tenant => ({
            ...tenant,
            rent: calculateRent(
              tenant.rent,
              tenant.date_of_agreement,
              tenant.annual_rent_increment
            ),
          }))} 
        />
      )}

      {/* Recent Tenants Table */}
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <h2 className="text-xl font-semibold mb-4">Recent Tenants</h2>
        {loading ? (
          <p className="text-center py-4">Loading tenants...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  {/* <th className="p-2 text-left">Tenant Name</th> */}
                  <th className="p-2 text-left">Company</th>
                  <th className="p-2 text-left">Property</th>
                  <th className="p-2 text-left">Current Rent</th>
                  <th className="p-2 text-left">Agreement Date</th>
                  <th className="p-2 text-left">Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.slice(0, 5).map((tenant) => (
                  <tr key={tenant.tenantId} className="border-b border-gray-200 hover:bg-gray-50">
                    {/* <td className="p-2">
                      <Link 
                        to="/tenants/all" 
                        className="text-blue-500 hover:underline"
                      >
                        {tenant.tenant_name}
                      </Link>
                    </td> */}
                    <td className="p-2">{tenant.company_name}</td>
                    <td className="p-2">{tenant.property_landlord}</td>
                    <td className="p-2">
                      {formatToRupees(calculateRent(
                        tenant.rent,
                        tenant.date_of_agreement,
                        tenant.annual_rent_increment
                      ))}
                    </td>
                    <td className="p-2">
                      {new Date(tenant.date_of_agreement).toLocaleDateString('en-IN')}
                    </td>
                    <td className="p-2">
                      <Select
                        options={paymentStatusOptions}
                        value={paymentStatusOptions.find(option => option.value === tenant.payment_status)}
                        onChange={(selectedOption) => handlePaymentStatusChange(tenant.tenantId, selectedOption.value)}
                        className="w-32" // Adjust width as needed
                        menuPlacement="auto" // Ensure dropdown opens at the correct position
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            minHeight: '32px', // Adjust height for smaller screens
                          }),
                          menu: (provided) => ({
                            ...provided,
                            zIndex: 9999, // Ensure dropdown appears above other elements
                          }),
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tenants.length === 0 && (
              <p className="text-center py-4 text-gray-500">No tenants found</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const DashboardCard = ({ title, value, icon, link }) => (
  <Link to={link} className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <div className="text-blue-500">{icon}</div>
    </div>
  </Link>
);

export default Dashboard;
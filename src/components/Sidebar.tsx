import React, { useState, useRef, useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { Home, Building, Users, FileText, Menu, X, ChevronDown, Bell,LogOut } from "lucide-react";

const Sidebar = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false); // State to manage sidebar visibility on mobile
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = (menu) => {
    setActiveMenu((prevMenu) => (prevMenu === menu ? null : menu));
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const handleClickOutside = (e) => {
    if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
      setIsSidebarVisible(false); // Close sidebar when clicking outside
      setActiveMenu(null);
    }
  };

    // Logout function
    const handleLogout = () => {
      localStorage.removeItem("token"); // Clear the token from local storage
      navigate("/"); // Redirect to the login page
    };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow md:hidden"
      >
        {isSidebarVisible ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 fixed inset-y-0 left-0 transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:inset-auto transition-transform duration-200 ease-in-out z-40 overflow-y-auto`}
      >
        <nav className="relative">
          {/* Dashboard Link */}
          <div className="mt-10">
            <Link
              to="/dashboard"
              className="flex items-center py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700"
              onClick={() => setIsSidebarVisible(false)} // Close sidebar on link click
            >
              <Home className="inline-block mr-2" size={20} />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Properties Menu */}
          <div className="mt-10">
            <button
              onClick={() => toggleMenu("properties")}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center"
            >
              <Building className="inline-block mr-2" size={20} />
              <span>Properties</span>
              <ChevronDown
                className={`ml-auto transition-transform ${
                  activeMenu === "properties" ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            {activeMenu === "properties" && (
              <div className="pl-4">
                <Link
                  to="/properties/all"
                  className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
                  onClick={() => setIsSidebarVisible(false)} // Close sidebar on link click
                >
                  All Properties
                </Link>
              </div>
            )}
          </div>

          {/* Tenants Menu */}
          <div className="mt-10">
            <button
              onClick={() => toggleMenu("tenants")}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center"
            >
              <Users className="inline-block mr-2" size={20} />
              <span>Tenants</span>
              <ChevronDown
                className={`ml-auto transition-transform ${
                  activeMenu === "tenants" ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            {activeMenu === "tenants" && (
              <div className="pl-4">
                <Link
                  to="/tenants/all"
                  className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
                  onClick={() => setIsSidebarVisible(false)} // Close sidebar on link click
                >
                  All Tenants
                </Link>
              </div>
            )}
          </div>

          {/* Invoices Menu */}
          <div className="mt-10">
            <button
              onClick={() => toggleMenu("invoices")}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center"
            >
              <FileText className="inline-block mr-2" size={20} />
              <span>Invoices</span>
              <ChevronDown
                className={`ml-auto transition-transform ${
                  activeMenu === "invoices" ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            {activeMenu === "invoices" && (
              <div className="pl-4">
                <Link
                  to="/invoices/generate"
                  className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
                  onClick={() => setIsSidebarVisible(false)} // Close sidebar on link click
                >
                  Generate Invoice
                </Link>
                <Link
                  to="/invoices/owner"
                  className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
                  onClick={() => setIsSidebarVisible(false)} // Close sidebar on link click
                >
                  All Invoices
                </Link>
              </div>
            )}
          </div>

          {/* Reminders Menu */}
          <div className="mt-10">
            <button
              onClick={() => toggleMenu("reminders")}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center"
            >
              <Bell className="inline-block mr-2" size={20} />
              <span>Reminders</span>
              <ChevronDown
                className={`ml-auto transition-transform ${
                  activeMenu === "reminders" ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            {activeMenu === "reminders" && (
              <div className="pl-4">
                <Link
                  to="/reminders"
                  className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
                  onClick={() => setIsSidebarVisible(false)} // Close sidebar on link click
                >
                  Create Reminder
                </Link>
                <Link
                  to="/reminders/allreminders"
                  className="block py-2 px-4 text-sm hover:bg-gray-700 rounded"
                  onClick={() => setIsSidebarVisible(false)} // Close sidebar on link click
                >
                  All Reminders
                </Link>
              </div>
            )}
          </div>

          
          {/* Logout Button */}
          <div className="mt-10">
            <button
              onClick={handleLogout}
              className="w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 flex items-center"
            >
              <LogOut className="inline-block mr-2" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
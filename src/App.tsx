import React from 'react';
import { BrowserRouter as Router, Route, Routes,useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Properties from './components/Properties';
import Tenants from './components/Tenants';
import GenerateInvoice from './components/invoices/GenerateInvoice';
import InvoiceList from './components/invoices/InvoiceList';
import InvoiceDetail from './components/invoices/InvoiceDetail';
import OwnerInvoices from './components/invoices/OwnerInvoices';
import ReminderForm from './components/Reminder/Reminders';
import AllReminders from './components/Reminder/AllReminders';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AppContent/>
    </Router>
  );
}


function AppContent() {
  const Location = useLocation();
  const isLoginPage = Location.pathname === '/';
  const isSignUpPage = Location.pathname === '/signup';

  return (
    // <Router>
      <div className="flex h-screen bg-gray-100">
        {/* <Sidebar /> */}
        {!isLoginPage && !isSignUpPage && <Sidebar />}
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
          <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/properties/*" element={<Properties />} />
            <Route path="/tenants/*" element={<Tenants />} />
            <Route path="/invoices/generate" element={<GenerateInvoice />} />
            <Route path="/invoices/owner" element={<InvoiceList isOwner={true} />} />
            <Route path="/invoices/tenant" element={<InvoiceList isOwner={false} />} />
            <Route path="/invoices/:id" element={<InvoiceDetail />} />
             <Route path="/generate-invoice" element={<GenerateInvoice />} />
        <Route path="/invoices/owner" element={<OwnerInvoices />} />
        <Route path="/invoices/owner" element={<InvoiceList />} />
        <Route path="/reminders" element={<ReminderForm/>} />
        <Route path="/reminders/allreminders" element={<AllReminders/>} />
        </Route>
          </Routes>
        </div>
      </div>
    // </Router>
  );
}

export default App;
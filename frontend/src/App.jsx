import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import LoanForm from './components/LoanForm';

import Profile from './pages/Profile';
import ApplicationDetails from './pages/ApplicationDetails';
import ToastNotification from './components/ToastNotification';

function App() {
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast({ message: '', type: '' });
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ToastNotification message={toast.message} type={toast.type} onClose={closeToast} />
        <Routes>
          <Route path="/" element={<Login showToast={showToast} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/apply" element={<LoanForm showToast={showToast} />} />
          <Route path="/profile" element={<Profile showToast={showToast} />} />
          <Route path="/application/:id" element={<ApplicationDetails showToast={showToast} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

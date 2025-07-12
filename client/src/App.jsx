import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';

import EditPage from './pages/EditPage';
import StocktakePage from './pages/StocktakePage';
import ItemDefinitionsPage from './pages/ItemDefinitionsPage';

import VendorPage from './pages/VendorPage';

import AdminUserPage from './pages/AdminUserPage';

import Navbar from './components/Navbar';
import { AuthProvider } from './context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-lg text-center space-y-4">
        <h1 className="text-2xl font-bold mb-4">Inventory System</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-48 hover:bg-blue-700"
          onClick={() => navigate('/stocktake')}
        >
          Stocktake
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded w-48 hover:bg-green-700"
          onClick={() => navigate('/edit')}
        >
          Configure Storage
        </button>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stocktake" element={<StocktakePage />} />
          <Route path="/edit" element={<EditPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/definitions" element={<ItemDefinitionsPage />} />
          <Route path="/admin/users" element={<AdminUserPage />} />
          <Route path="/vendors" element={<VendorPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;

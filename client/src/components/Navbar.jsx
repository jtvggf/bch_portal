
import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (menu) => {
    setDropdownOpen(dropdownOpen === menu ? null : menu);
  };

  const closeAll = () => setDropdownOpen(null);

  return (
    <nav className="bg-gray-800 text-white px-4 py-2 flex justify-between items-center">
      <div className="flex items-center gap-8">
        <Link to="/" className="font-bold text-lg" onClick={closeAll}>Boston Coffeehouse</Link>

        <div className="relative">
          <button onClick={() => toggleDropdown('inventory')} className="hover:underline">Inventory ▾</button>
          {dropdownOpen === 'inventory' && (
            <div className="absolute left-0 bg-white text-black mt-2 w-48 rounded shadow z-10">
              <Link to="/stocktake" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-200">Stocktake</Link>
              <Link to="/definitions" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-200">Inventory Definitions</Link>
              <Link to="/configurestorage" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-200">Configure Storage</Link>
            </div>
          )}
        </div>

        <div className="relative">
          <button onClick={() => toggleDropdown('vendors')} className="hover:underline">Vendors ▾</button>
          {dropdownOpen === 'vendors' && (
            <div className="absolute left-0 bg-white text-black mt-2 w-48 rounded shadow z-10">
              <Link to="/vendors" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-200">Vendor Management</Link>
            </div>
          )}
        </div>

        {user?.role === 'admin' && (
          <div className="relative">
            <button onClick={() => toggleDropdown('admin')} className="hover:underline">Admin ▾</button>
            {dropdownOpen === 'admin' && (
              <div className="absolute left-0 bg-white text-black mt-2 w-48 rounded shadow z-10">
                <Link to="/admin/users" onClick={closeAll} className="block px-4 py-2 hover:bg-gray-200">User Management</Link>
              </div>
            )}
          </div>
        )}
      </div>

      {user && <button onClick={logout} className="hover:underline">Logout</button>}
    </nav>
  );
};

export default Navbar;

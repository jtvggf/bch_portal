import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminUserPage = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [editingRoles, setEditingRoles] = useState(null);
  const [roleDraft, setRoleDraft] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.role === 'admin') {
      fetch('/api/auth/users', {
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      })
        .then(res => res.json())
        .then(data => setUsers(data.users || []))
        .catch(() => setError('Failed to load users'));
    }
  }, [user]);

  const updateUser = async (email, updates) => {
    const res = await fetch('/api/auth/promote', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({ targetEmail: email, ...updates }),
    });
    if (res.ok) {
      setUsers(users.map(u =>
        u.email === email
          ? {
            ...u,
            ...(updates.newRole && { role: updates.newRole }),
            ...(updates.newEmployeeRole && { employeeRole: updates.newEmployeeRole })
          }
          : u
      ));
    } else {
      alert('Update failed');
    }
  };

  const toggleCheckbox = (role) => {
    setRoleDraft(prev =>
      prev.includes(role) ? prev.filter(r => r !== role) : [...prev, role]
    );
  };

  const saveEmployeeRoles = (email) => {
    updateUser(email, { newEmployeeRole: roleDraft });
    setEditingRoles(null);
  };

  if (user?.role !== 'admin') {
    return <div className="p-4 text-red-500">Access denied: Admins only</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      {error && <p className="text-red-500">{error}</p>}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Employee Roles</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.email}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.username}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 text-center">
                <select
                  value={u.role}
                  onChange={(e) => updateUser(u.email, { newRole: e.target.value })}
                  className="border rounded px-2 py-1"
                >
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="border p-2 text-center relative group">
                {editingRoles === u.email ? (
                  <div className="space-y-1">
                    {['cook', 'server', 'shift lead'].map(role => (
                      <label key={role} className="block">
                        <input
                          type="checkbox"
                          checked={roleDraft.includes(role)}
                          onChange={() => toggleCheckbox(role)}
                        /> {role}
                      </label>
                    ))}
                    <button
                      onClick={() => saveEmployeeRoles(u.email)}
                      className="mt-1 px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div
                    className="hover:bg-gray-100 p-1 cursor-pointer"
                    onClick={() => {
                      setEditingRoles(u.email);
                      setRoleDraft(u.employeeRole || []);
                    }}
                  >
                    {u.employeeRole?.length ? u.employeeRole.join(', ') : <span className="italic text-gray-500">None</span>}
                    <span className="ml-2 text-blue-500 text-sm">✏️</span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserPage;

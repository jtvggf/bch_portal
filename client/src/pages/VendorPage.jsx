import React, { useEffect, useState } from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const VendorPage = () => {
  const [vendors, setVendors] = useState([]);
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [newVendor, setNewVendor] = useState({
    name: '',
    address: '',
    phoneNumber: '',
    repName: '',
    repPhone: '',
    repEmail: '',
    order_dows: [],
    delivery_dows: [],
    cut_off: ''
  });

  const fetchVendors = () =>
    fetch('/api/vendors')
      .then(res => res.json())
      .then(setVendors);

  useEffect(() => {
    fetchVendors();
  }, []);

  const toggleDay = (field, day, source, setSource) => {
    setSource(prev => ({
      ...prev,
      [field]: prev[field].includes(day)
        ? prev[field].filter(d => d !== day)
        : [...prev[field], day]
    }));
  };

  const handleAddVendor = async () => {
    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVendor)
    });
    if (res.ok) {
      await fetchVendors();
      setNewVendor({
        name: '',
        address: '',
        phoneNumber: '',
        repName: '',
        repPhone: '',
        repEmail: '',
        order_dows: [],
        delivery_dows: [],
        cut_off: ''
      });
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch('/api/vendors/' + id, { method: 'DELETE' });
    if (res.ok) fetchVendors();
  };

  const handleRefreshCounts = async () => {
    const res = await fetch('/api/vendors/recount');
    if (res.ok) {
      const data = await res.json();
      setVendors(data);
    }
  };

  const handleEditSubmit = async () => {
    if (!editingVendor) return;
    const res = await fetch(`/api/vendors/${editingVendor._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingVendor)
    });
    if (res.ok) {
      setEditingVendor(null);
      fetchVendors();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Vendor Management</h1>

      {/*edit */}
      <button
        onClick={() => setShowAddVendor(true)}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Vendor
      </button>
      {/*edit */}


      {/* Add New Vendor Form */}
      {showAddVendor && (
        <div className="mb-8 border p-4 rounded bg-gray-50 relative">
          <button
            onClick={() => setShowAddVendor(false)}
            className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-red-500"
            title="Close"
          >
            ×
          </button>
          <h2 className="text-lg font-semibold mb-2">Add New Vendor</h2>
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Name" value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Address" value={newVendor.address} onChange={e => setNewVendor({ ...newVendor, address: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Phone Number" value={newVendor.phoneNumber} onChange={e => setNewVendor({ ...newVendor, phoneNumber: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Rep Name" value={newVendor.repName} onChange={e => setNewVendor({ ...newVendor, repName: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Rep Phone" value={newVendor.repPhone} onChange={e => setNewVendor({ ...newVendor, repPhone: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Rep Email" value={newVendor.repEmail} onChange={e => setNewVendor({ ...newVendor, repEmail: e.target.value })} className="border p-2 rounded" />
            <input placeholder="Cut-off Time (e.g. 2:00 PM)" value={newVendor.cut_off} onChange={e => setNewVendor({ ...newVendor, cut_off: e.target.value })} className="border p-2 rounded" />
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-1">Order Days:</h3>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <label key={day} className="text-sm">
                  <input type="checkbox" checked={newVendor.order_dows.includes(day)} onChange={() => toggleDay('order_dows', day, newVendor, setNewVendor)} className="mr-1" />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-1">Delivery Days:</h3>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => (
                <label key={day} className="text-sm">
                  <input type="checkbox" checked={newVendor.delivery_dows.includes(day)} onChange={() => toggleDay('delivery_dows', day, newVendor, setNewVendor)} className="mr-1" />
                  {day}
                </label>
              ))}
            </div>
          </div>

          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded" onClick={handleAddVendor}>Add Vendor</button>
        </div>
      )}

      {/* Vendor List Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Vendors List</h2>
        <button onClick={handleRefreshCounts} className="text-sm text-blue-600 hover:underline">🔄 Refresh</button>
      </div>

      {/* Vendor List */}
      <ul className="divide-y border rounded bg-white">
        {vendors.map(v => (
          <li key={v._id} className="p-4">
            {editingVendor?._id === v._id ? (
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Name" value={editingVendor.name || ''} onChange={e => setEditingVendor({ ...editingVendor, name: e.target.value })} className="border p-1" />
                <input placeholder="Address" value={editingVendor.address || ''} onChange={e => setEditingVendor({ ...editingVendor, address: e.target.value })} className="border p-1" />
                <input placeholder="Phone Number" value={editingVendor.phoneNumber || ''} onChange={e => setEditingVendor({ ...editingVendor, phoneNumber: e.target.value })} className="border p-1" />
                <input placeholder="Rep Name" value={editingVendor.repName || ''} onChange={e => setEditingVendor({ ...editingVendor, repName: e.target.value })} className="border p-1" />
                <input placeholder="Rep Phone" value={editingVendor.repPhone || ''} onChange={e => setEditingVendor({ ...editingVendor, repPhone: e.target.value })} className="border p-1" />
                <input placeholder="Rep Email" value={editingVendor.repEmail || ''} onChange={e => setEditingVendor({ ...editingVendor, repEmail: e.target.value })} className="border p-1" />
                <input placeholder="Cut-off Time" value={editingVendor.cut_off || ''} onChange={e => setEditingVendor({ ...editingVendor, cut_off: e.target.value })} className="border p-1" />
                <div className="col-span-2 flex gap-4 mt-2">
                  <button onClick={handleEditSubmit} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={() => setEditingVendor(null)} className="text-gray-600">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-lg font-bold">{v.name} ({v.numberOfItems || 0} items)</div>
                  <div className="text-base text-gray-700">
                    {[v.repName, v.repPhone, v.repEmail].filter(Boolean).join(' | ')}
                  </div>
                  <div className="text-base text-gray-600">
                    Orders: {v.order_dows?.join(', ') || '—'} | Deliveries: {v.delivery_dows?.join(', ') || '—'}
                  </div>
                  <div className="text-sm text-gray-500 italic">
                    Order Cut-off: {v.cut_off || '—'}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setEditingVendor(v)} className="text-sm text-blue-600 hover:underline">Edit</button>
                  <button onClick={() => handleDelete(v._id)} className="text-sm text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div >
  );
};

export default VendorPage;


import React, { useEffect, useState } from 'react';

const ItemDefinitionsPage = () => {
  const [items, setItems] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [showAddItem, setShowAddItem] = useState(false);
  const [viewMode, setViewMode] = useState('local');
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    container: '',
    minimum: '',
    maximum: '',
    mainVendor: '',
    vendorId: {},
    splitable: false,
    packsPerCase: '',
    unitsPerPack: '',
    pricePerCase: '',
    pricePerPack: '',
    pricePerUnit: '',
    usedInFood: false,
    usedInBeverage: false
  });

  useEffect(() => {
    fetch('/api/item-definitions').then(res => res.json()).then(setItems);
    fetch('/api/vendors').then(res => res.json()).then(setVendors);
  }, []);

  const handleAddItem = async () => {
    const res = await fetch('/api/item-definitions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newItem)
    });
    if (res.ok) {
      const newEntry = await res.json();
      setItems(prev => [...prev, newEntry]);
      setNewItem({ ...newItem, name: '', category: '', container: '', minimum: '', maximum: '' });
    }
  };

  const handleDelete = async (id) => {
    await fetch('/api/item-definitions/' + id, { method: 'DELETE' });
    setItems(prev => prev.filter(i => i._id !== id));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Inventory Definitions</h1>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setShowAddItem(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Item
        </button>
        <div>
          <label className="mr-2 font-semibold">View:</label>
          <select value={viewMode} onChange={e => setViewMode(e.target.value)} className="border rounded px-2 py-1">
            <option value="local">Local Info</option>
            <option value="vendor">Vendor Info</option>
          </select>
        </div>
      </div>

      {showAddItem && (
        <div className="border rounded p-4 bg-gray-50 mb-6 relative">
          <button
            onClick={() => setShowAddItem(false)}
            className="absolute top-2 right-3 text-lg font-bold text-gray-600 hover:text-red-500"
            title="Close"
          >
            ×
          </button>
          <h2 className="font-semibold mb-2">Add New Item</h2>
          <div className="grid grid-cols-3 gap-2">
            <input placeholder="Name" value={newItem.name} onChange={e => setNewItem({ ...newItem, name: e.target.value })} className="border p-1 rounded" />
            <input placeholder="Category" value={newItem.category} onChange={e => setNewItem({ ...newItem, category: e.target.value })} className="border p-1 rounded" />
            <input placeholder="Container" value={newItem.container} onChange={e => setNewItem({ ...newItem, container: e.target.value })} className="border p-1 rounded" />
            <input placeholder="Min" value={newItem.minimum} onChange={e => setNewItem({ ...newItem, minimum: e.target.value })} className="border p-1 rounded" />
            <input placeholder="Max" value={newItem.maximum} onChange={e => setNewItem({ ...newItem, maximum: e.target.value })} className="border p-1 rounded" />
            <select value={newItem.mainVendor} onChange={e => setNewItem({ ...newItem, mainVendor: e.target.value })} className="border p-1 rounded">
              <option value="">Select Vendor</option>
              {vendors.map(v => <option key={v._id} value={v.name}>{v.name}</option>)}
            </select>
            <select
              value={newItem.measurement}
              onChange={e => setNewItem({ ...newItem, measurement: e.target.value })}
              className="border p-1 rounded"
            >
              <option value="">Select Measurement</option>
              <option value="case">Case</option>
              <option value="pack">Pack</option>
              <option value="unit">Unit</option>
            </select>
          </div>
          <button onClick={handleAddItem} className="mt-3 bg-green-600 text-white px-4 py-1 rounded">Add Item</button>
        </div>
      )}

      <table className="w-full text-sm border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border w-6 text-center">F</th>
            <th className="p-2 border w-6 text-center">B</th>
            <th className="p-2 border">Name</th>
            {viewMode === 'local' ? (
              <>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Container</th>
                <th className="p-2 border">Msmt</th>
                <th className="p-2 border">Min</th>
                <th className="p-2 border">Max</th>
              </>
            ) : (
              <>
                <th className="p-2 border">Main Vendor</th>
                <th className="p-2 border">Vendor IDs</th>
                <th className="p-2 border">Splitable</th>
                <th className="p-2 border">Packs/Case</th>
                <th className="p-2 border">Units/Pack</th>
                <th className="p-2 border">Price/Case</th>
                <th className="p-2 border">Price/Pack</th>
                <th className="p-2 border">Price/Unit</th>
              </>
            )}
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item._id} className="border">
              <td className="p-1 border text-center">{item.usedInFood ? 'F' : ''}</td>
              <td className="p-1 border text-center">{item.usedInBeverage ? 'B' : ''}</td>
              <td className="p-1 border">{item.name}</td>
              {viewMode === 'local' ? (
                <>
                  <td className="p-1 border">{item.category}</td>
                  <td className="p-1 border">{item.container}</td>
                  <td className="p-1 border">{item.measurement}</td>
                  <td className="p-1 border">{item.minimum}</td>
                  <td className="p-1 border">{item.maximum}</td>
                </>
              ) : (
                <>
                  <td className="p-1 border">{item.mainVendor}</td>
                  <td className="p-1 border text-sm">
                    {item.vendorId && item.mainVendor && item.vendorId[item.mainVendor]
                      ? item.vendorId[item.mainVendor]
                      : '—'}
                  </td>
                  <td className="p-1 border">{item.splitable ? 'Yes' : 'No'}</td>
                  <td className="p-1 border">{item.packsPerCase}</td>
                  <td className="p-1 border">{item.unitsPerPack}</td>
                  <td className="p-1 border">{item.pricePerCase}</td>
                  <td className="p-1 border">{item.pricePerPack}</td>
                  <td className="p-1 border">{item.pricePerUnit}</td>
                </>
              )}
              <td className="p-1 border text-center">
                <button onClick={() => setEditingItem(item)} className="text-blue-600 mr-2">Edit</button>
                <button onClick={() => handleDelete(item._id)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemDefinitionsPage;

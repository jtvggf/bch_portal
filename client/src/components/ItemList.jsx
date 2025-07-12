import React from 'react';

const ItemList = ({ subArea, items, onQuantityChange }) => {
  if (!subArea) return <div className="p-4">Select a sub-area</div>;

  return (
    <div className="flex-1 p-4">
      <h2 className="text-xl font-bold mb-4">{subArea.name}</h2>
      <table className="w-full table-auto border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-1 border">Item</th>
            <th className="px-2 py-1 border">Case</th>
            <th className="px-2 py-1 border">Package</th>
            <th className="px-2 py-1 border">Unit</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t">
              <td className="px-2 py-1 border">{item.name}</td>
              {['case', 'package', 'unit'].map(qty => (
                <td key={qty} className="px-2 py-1 border">
                  <input
                    type="number"
                    className="w-full border rounded px-1"
                    value={item.quantities[qty]}
                    onChange={e => onQuantityChange(item.id, qty, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemList;

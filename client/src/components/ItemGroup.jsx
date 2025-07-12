import React, { useEffect, useRef } from 'react';

const ItemGroup = ({ subArea, items, onQuantityChange, onSubmit, isSelected }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [isSelected]);

  const formattedDate = new Date(subArea.lastStockTake).toLocaleDateString();

  return (
    <div
      ref={ref}
      className={`mb-10 p-4 rounded shadow-sm border-2 ${
        isSelected ? 'border-yellow-500 bg-yellow-50' : 'border-gray-300 bg-white'
      }`}
    >
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">{subArea.name}</h2>
        <div className="text-sm text-gray-500">Last Stock Take: {formattedDate}</div>
      </div>
      <table className="w-full table-auto border mb-4 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-1 border text-left w-2/3">Item</th>
            <th className="px-2 py-1 border text-left">Count</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-t hover:bg-gray-50">
              <td className="px-2 py-1 border">{item.name}{item.inputType ? ` (${item.inputType})` : ''}</td>
              <td className="px-2 py-1 border">
                <input
                  type="number"
                  className="w-full border rounded px-1 py-0.5"
                  value={item.count}
                  onChange={e => onQuantityChange(subArea.id, item.id, e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-right">
        <button
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm"
          onClick={() => onSubmit(subArea.id)}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ItemGroup;

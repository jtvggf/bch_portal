import React from 'react';
import ItemGroup from './ItemGroup';

const ItemPanel = ({ area, subAreas, allItems, onQuantityChange, onSubmit, selectedSubAreaId }) => {
  if (!area) return <div className="p-4">Select an area</div>;

  return (
    <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
      <h1 className="text-3xl font-bold text-center text-gray-700 mb-8">{area.name}</h1>
      {subAreas.map(sub => (
        <ItemGroup
          key={sub.id}
          subArea={sub}
          items={allItems[sub.id] || []}
          onQuantityChange={onQuantityChange}
          onSubmit={onSubmit}
          isSelected={selectedSubAreaId === sub.id}
        />
      ))}
    </div>
  );
};

export default ItemPanel;

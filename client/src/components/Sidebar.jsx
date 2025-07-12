import React from 'react';

const Sidebar = ({ areas, selectedArea, onSelectArea, onSelectSubArea }) => {
  return (
    <div className="w-1/4 h-full bg-gray-100 p-4 border-r border-gray-300 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Locations</h2>
      {areas.map(area => (
        <div key={area.name} className="mb-4">
          <div
            className={`cursor-pointer font-bold mb-1 ${
              selectedArea?.name === area.name ? 'text-blue-700' : ''
            }`}
            onClick={() => onSelectArea(area)}
          >
            {area.name}
          </div>
          <ul className="ml-4">
            {area.subAreas.map(sub => (
              <li
                key={sub.id}
                className="cursor-pointer hover:bg-yellow-100 rounded px-2 py-1 text-sm"
                onClick={() => onSelectSubArea(sub.id)}
              >
                {sub.name}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;

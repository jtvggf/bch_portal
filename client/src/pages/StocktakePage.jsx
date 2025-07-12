import React, { useEffect, useState } from 'react';

const StocktakePage = () => {
  const [areas, setAreas] = useState([]);
  const [containers, setContainers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);
  const [counts, setCounts] = useState({});

  const [selectedAreaId, setSelectedAreaId] = useState(null);
  const [selectedContainerId, setSelectedContainerId] = useState(null);
  const [expanded, setExpanded] = useState({ locations: true, todo: true });
  const [expandedAreas, setExpandedAreas] = useState({});

  useEffect(() => {
    fetch('/api/areas').then(res => res.json()).then(setAreas);
    fetch('/api/containers').then(res => res.json()).then(setContainers);
    fetch('/api/groups').then(res => res.json()).then(setGroups);
    fetch('/api/items').then(res => res.json()).then(setItems);
  }, []);

  const toggle = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };
  const toggleArea = (areaId) => {
    setExpandedAreas(prev => ({ ...prev, [areaId]: !prev[areaId] }));
  };

  const handleCountChange = (itemId, value) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setCounts(prev => ({ ...prev, [itemId]: value }));
    }
  };

  const handleSubmitContainer = (containerId) => {
    const containerGroupIds = groups.filter(g => g.containerId === containerId).map(g => g._id);
    const containerItemIds = items.filter(i => containerGroupIds.includes(i.groupId)).map(i => i._id);
    const data = containerItemIds.reduce((acc, id) => {
      if (counts[id]) acc[id] = parseFloat(counts[id]);
      return acc;
    }, {});
    console.log('Submit counts for container', containerId, data);
  };

  const renderItems = (groupId) =>
    items
      .filter(i => i.groupId === groupId)
      .map(i => (
        <div key={i._id} className="pl-4 py-1 text-sm flex items-center justify-between">
          <span>{i.itemId.name} ({i.itemId.inputType})</span>
          <input
            type="text"
            className="border p-1 text-sm w-24 ml-2"
            value={counts[i._id] || ''}
            onChange={e => handleCountChange(i._id, e.target.value)}
            placeholder="count"
          />
        </div>
      ));

  const renderGroups = (containerId) =>
    groups
      .filter(g => g.containerId === containerId)
      .map(g => (
        <div key={g._id} className="border rounded p-2 my-2 bg-white">
          <h4 className="font-semibold text-sm mb-1">{g.name}</h4>
          {renderItems(g._id)}
        </div>
      ));

  const renderContainers = () =>
    containers
      .filter(c => c.areaId === selectedAreaId)
      .map(c => (
        <div key={c._id} className="border rounded p-3 mb-6 bg-white">
          <h3 className="font-bold text-base mb-2">{c.name}</h3>
          {renderGroups(c._id)}
          <div className="text-right mt-2">
            <button
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
              onClick={() => handleSubmitContainer(c._id)}
            >
              Submit
            </button>
          </div>
        </div>
      ));

  return (
    <div className="flex h-screen">
      {/* File tree */}
      <div className="w-64 bg-gray-100 p-4 border-r overflow-y-auto">
        <div className="mb-4">
          <button
            onClick={() => toggle('todo')}
            className="font-bold text-base w-full text-left"
          >
            {expanded.todo ? '▾' : '▸'} To do
          </button>
          {expanded.todo && (
            <div className="pl-4 text-sm text-gray-500 italic mt-1">
              (No tasks yet)
            </div>
          )}
        </div>

        <div className="mb-2">
          <button
            onClick={() => toggle('locations')}
            className="font-bold text-base w-full text-left mb-1"
          >
            {expanded.locations ? '▾' : '▸'} Locations
          </button>
          {expanded.locations && areas.map(area => {
            return (
              <div key={area._id}>
                <div
                  className={`flex items-center justify-between px-2 py-1 rounded cursor-pointer ${
                    selectedAreaId === area._id ? 'bg-blue-200' : 'hover:bg-blue-50'
                  }`}
                >
                  <span
                    className="cursor-pointer font-medium"
                    onClick={() => {
                      setSelectedAreaId(area._id);
                      setSelectedContainerId(null);
                    }}
                  >
                    {area.name}
                  </span>
                  <span
                    className="cursor-pointer text-lg font-bold"
                    onClick={() => toggleArea(area._id)}
                  >
                    {expandedAreas[area._id] !== false ? '▾' : '▸'}
                  </span>
                </div>
                {expandedAreas[area._id] !== false && (
                  <div className="ml-4">
                    {containers
                      .filter(c => c.areaId === area._id)
                      .map(container => (
                        <div key={container._id}>
                          <div
                            className={`cursor-pointer px-2 py-1 rounded ${selectedContainerId === container._id ? 'bg-yellow-200' : 'hover:bg-yellow-50'}`}
                            onClick={() => {
                              setSelectedAreaId(area._id);
                              setSelectedContainerId(container._id);
                            }}
                          >
                            {container.name}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* View window */}
      <div className="flex-1 p-6 overflow-y-auto">
        {selectedContainerId ? (
          <>
            {renderGroups(selectedContainerId)}
            <div className="text-right mt-4">
              <button
                className="bg-blue-600 text-white px-3 py-1 text-sm rounded hover:bg-blue-700"
                onClick={() => handleSubmitContainer(selectedContainerId)}
              >
                Submit
              </button>
            </div>
          </>
        ) : selectedAreaId ? (
          renderContainers()
        ) : (
          <p className="text-gray-500">Select an area or container to view items.</p>
        )}
      </div>
    </div>
  );
};

export default StocktakePage;

import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const EditPage = () => {
  const [areas, setAreas] = useState([]);
  const [containers, setContainers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [items, setItems] = useState([]);

  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState(null);

  const [newArea, setNewArea] = useState('');
  const [newContainer, setNewContainer] = useState('');
  const [newGroup, setNewGroup] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState('unit');

  const [editItemId, setEditItemId] = useState(null);
  const [editItemName, setEditItemName] = useState('');
  const [editItemType, setEditItemType] = useState('unit');

  const [editNames, setEditNames] = useState({});

  useEffect(() => {
    fetch('/api/areas').then(res => res.json()).then(setAreas);
  }, []);

  useEffect(() => {
    const area = areas[selectedAreaIndex];
    if (area?._id) {
      fetch(`/api/containers?areaId=${area._id}`).then(res => res.json()).then(setContainers);
    }
  }, [areas, selectedAreaIndex]);

  useEffect(() => {
    const container = containers[selectedContainerIndex];
    if (container?._id) {
      fetch(`/api/groups?containerId=${container._id}`).then(res => res.json()).then(data => {
        setGroups(data);
        if (!selectedGroupId && data.length > 0) {
          setSelectedGroupId(data[0]._id);
        }
      });
      fetch(`/api/items?containerId=${container._id}`).then(res => res.json()).then(setItems);
    }
  }, [containers, selectedContainerIndex]);

  const addEntry = async (type) => {
    if (type === 'area') {
      const res = await fetch('/api/areas', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newArea })
      });
      const data = await res.json();
      setAreas([...areas, data]);
      setNewArea('');
    }
    if (type === 'container') {
      const res = await fetch('/api/containers', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newContainer, areaId: areas[selectedAreaIndex]._id })
      });
      const data = await res.json();
      setContainers([...containers, data]);
      setNewContainer('');
    }
    if (type === 'group') {
      const res = await fetch('/api/groups', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newGroup, containerId: containers[selectedContainerIndex]._id })
      });
      const data = await res.json();
      setGroups([...groups, data]);
      setNewGroup('');
      if (!selectedGroupId) setSelectedGroupId(data._id);
    }
    if (type === 'item') {
      const res = await fetch('/api/items', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          measurement: newItemType,
          containerId: containers[selectedContainerIndex]._id,
          groupId: selectedGroupId
        })
      });
      const data = await res.json();
      setItems([...items, data]);
      setNewItemName('');
    }
  };

  const handleUpdate = async (type, id, field, value) => {
    const routeMap = {
      area: 'areas',
      container: 'containers',
      group: 'groups',
      itemdef: 'itemdefinitions'
    };
    await fetch(`/api/${routeMap[type]}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: value })
    });
    setEditNames(p => {
      const updated = { ...p };
      delete updated[id];
      delete updated[id + '_name'];
      delete updated[id + '_type'];
      return updated;
    });
    fetch(`/api/areas`).then(res => res.json()).then(setAreas);
    fetch(`/api/containers?areaId=${areas[selectedAreaIndex]?._id}`).then(res => res.json()).then(setContainers);
    fetch(`/api/groups?containerId=${containers[selectedContainerIndex]?._id}`).then(res => res.json()).then(setGroups);
    fetch(`/api/items?containerId=${containers[selectedContainerIndex]?._id}`).then(res => res.json()).then(setItems);
  };

  const handleDelete = async (type, id) => {
    const routeMap = {
      area: 'areas',
      container: 'containers',
      group: 'groups',
      item: 'items'
    };
    await fetch(`/api/${routeMap[type]}/${id}`, { method: 'DELETE' });
    fetch(`/api/areas`).then(res => res.json()).then(setAreas);
    fetch(`/api/containers?areaId=${areas[selectedAreaIndex]?._id}`).then(res => res.json()).then(setContainers);
    fetch(`/api/groups?containerId=${containers[selectedContainerIndex]?._id}`).then(res => res.json()).then(setGroups);
    fetch(`/api/items?containerId=${containers[selectedContainerIndex]?._id}`).then(res => res.json()).then(setItems);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const itemId = result.draggableId;
    const destGroupId = result.destination.droppableId;
    await fetch('/api/items/' + itemId, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupId: destGroupId })
    });
    fetch(`/api/items?containerId=${containers[selectedContainerIndex]._id}`).then(res => res.json()).then(setItems);
  };

  const groupedItems = groups.map(group => ({
    group,
    items: items.filter(i => i.groupId === group._id)
  }));

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Areas */}
        <div className="bg-white p-3 border rounded shadow">
          <h2 className="font-bold mb-2">Areas</h2>
          {areas.map((a, i) => (
            <div key={a._id} className="flex items-center gap-2">
              {editNames[a._id] ? (
                <input value={editNames[a._id]} onChange={e => setEditNames(p => ({ ...p, [a._id]: e.target.value }))} onBlur={() => handleUpdate('area', a._id, 'name', editNames[a._id])} />
              ) : (
                <span className={`cursor-pointer p-1 rounded ${i === selectedAreaIndex ? 'bg-blue-200' : 'hover:bg-gray-100'}`} onClick={() => { setSelectedAreaIndex(i); setSelectedContainerIndex(0); }}>{a.name}</span>
              )}
              <button onClick={() => setEditNames(p => ({ ...p, [a._id]: a.name }))}>✏️</button>
              <button onClick={() => handleDelete('area', a._id)}>🗑️</button>
            </div>
          ))}
          <input value={newArea} onChange={e => setNewArea(e.target.value)} className="border p-1 mt-2 w-full text-sm" placeholder="New area" />
          <button onClick={() => addEntry('area')} className="bg-blue-600 text-white mt-1 px-2 py-1 text-xs rounded w-full">Add Area</button>
        </div>

        {/* Containers */}
        <div className="bg-white p-3 border rounded shadow">
          <h2 className="font-bold mb-2">Containers</h2>
          {containers.map((c, i) => (
            <div key={c._id} className="flex items-center gap-2">
              {editNames[c._id] ? (
                <input value={editNames[c._id]} onChange={e => setEditNames(p => ({ ...p, [c._id]: e.target.value }))} onBlur={() => handleUpdate('container', c._id, 'name', editNames[c._id])} />
              ) : (
                <span className={`cursor-pointer p-1 rounded ${i === selectedContainerIndex ? 'bg-yellow-200' : 'hover:bg-gray-100'}`} onClick={() => setSelectedContainerIndex(i)}>{c.name}</span>
              )}
              <button onClick={() => setEditNames(p => ({ ...p, [c._id]: c.name }))}>✏️</button>
              <button onClick={() => handleDelete('container', c._id)}>🗑️</button>
            </div>
          ))}
          <input value={newContainer} onChange={e => setNewContainer(e.target.value)} className="border p-1 mt-2 w-full text-sm" placeholder="New container" />
          <button onClick={() => addEntry('container')} className="bg-yellow-600 text-white mt-1 px-2 py-1 text-xs rounded w-full">Add Container</button>
        </div>

        {/* Groups */}
        <div className="bg-white p-3 border rounded shadow">
          <h2 className="font-bold mb-2">Groups (Shelves)</h2>
          {groups.map(g => (
            <div key={g._id} className="flex items-center gap-2">
              {editNames[g._id] ? (
                <input value={editNames[g._id]} onChange={e => setEditNames(p => ({ ...p, [g._id]: e.target.value }))} onBlur={() => handleUpdate('group', g._id, 'name', editNames[g._id])} />
              ) : (
                <span className={`p-1 cursor-pointer rounded ${selectedGroupId === g._id ? 'bg-green-200' : 'hover:bg-gray-100'}`} onClick={() => setSelectedGroupId(g._id)}>{g.name}</span>
              )}
              <button onClick={() => setEditNames(p => ({ ...p, [g._id]: g.name }))}>✏️</button>
              <button onClick={() => handleDelete('group', g._id)}>🗑️</button>
            </div>
          ))}
          <input value={newGroup} onChange={e => setNewGroup(e.target.value)} className="border p-1 mt-2 w-full text-sm" placeholder="New group" />
          <button onClick={() => addEntry('group')} className="bg-green-600 text-white mt-1 px-2 py-1 text-xs rounded w-full">Add Group</button>
        </div>
      </div>

      {/* Items Section */}
      <div className="mb-4 bg-white border rounded shadow p-4">
        <h2 className="font-bold mb-2 text-sm">Add Item to Selected Group</h2>
        <div className="flex gap-2 items-center mb-2">
          <input value={newItemName} onChange={e => setNewItemName(e.target.value)} className="border p-1 text-sm w-1/2" placeholder="Item name" />
          <select value={newItemType} onChange={e => setNewItemType(e.target.value)} className="border p-1 text-sm">
            <option value="Unit">Unit</option>
            <option value="Case">Case</option>
            <option value="Pack">Pack</option>
          </select>
          <button onClick={() => addEntry('item')} className="bg-blue-700 text-white px-2 py-1 text-sm rounded">Add Item</button>
        </div>
      </div>

      {/* Grouped Items */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groupedItems.map(({ group, items }) => (
            <Droppable droppableId={group._id} key={group._id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white border rounded shadow p-3 min-h-[100px]"
                >
                  <h3 className="font-semibold text-sm mb-2">{group.name}</h3>
                  {items.map((item, idx) => (
                    <Draggable draggableId={item._id} index={idx} key={item._id}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="p-2 mb-1 bg-gray-100 rounded text-sm flex justify-between items-center"
                        >
                          {editItemId === item._id ? (
                            <div className="flex gap-2 items-center w-full">
                              <input value={editItemName} onChange={e => setEditItemName(e.target.value)} className="text-sm border p-1 w-1/2" />
                              <select value={editItemType} onChange={e => setEditItemType(e.target.value)} className="text-sm border p-1">
                                <option value="Unit">Unit</option>
                                <option value="Case">Case</option>
                                <option value="Pack">Pack</option>
                              </select>
                              <button className="text-xs text-green-600" onClick={() => saveEditItem(item)}>💾</button>
                              <button className="text-xs text-gray-500" onClick={() => setEditItemId(null)}>✖</button>
                            </div>
                          ) : (
                            <>
                              <span>{item.itemId.name} ({item.itemId.measurement})</span>
                              <div className="flex gap-1">
                                <button onClick={() => { setEditItemId(item._id); setEditItemName(item.itemId.name); setEditItemType(item.itemId.measurement); }} className="text-xs text-blue-600">✏️</button>
                                <button onClick={() => handleDelete('item', item._id)} className="text-xs text-red-600">🗑️</button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default EditPage;

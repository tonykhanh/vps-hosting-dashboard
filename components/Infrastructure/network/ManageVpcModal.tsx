
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Network, Save, Route, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../Button';

interface ManageVpcModalProps {
  vpc: { id: string; name: string; region: string; ipRange: string; instances: number };
  onClose: () => void;
  onUpdate: (id: string, updates: any) => void;
}

export const ManageVpcModal: React.FC<ManageVpcModalProps> = ({ vpc, onClose, onUpdate }) => {
  const [name, setName] = useState(vpc.name);
  const [routes, setRoutes] = useState([
    { destination: '0.0.0.0/0', nextHop: 'Internet Gateway' }
  ]);

  const handleSave = () => {
    onUpdate(vpc.id, { name });
    onClose();
  };

  const addRoute = () => {
    setRoutes([...routes, { destination: '', nextHop: '' }]);
  };

  const removeRoute = (index: number) => {
    setRoutes(routes.filter((_, i) => i !== index));
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-neutral-700 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Network size={20} className="text-plasma-600"/> Manage VPC
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"><X size={24}/></button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
            {/* General Info */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">Region</div>
                    <div className="font-bold text-gray-900 dark:text-white">{vpc.region}</div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700">
                    <div className="text-xs text-gray-500 uppercase font-bold mb-1">IP Range</div>
                    <div className="font-mono font-bold text-gray-900 dark:text-white">{vpc.ipRange}</div>
                </div>
            </div>

            {/* Name Config */}
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">VPC Name</label>
                <input 
                    type="text" 
                    className="w-full px-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-xl outline-none focus:ring-2 focus:ring-plasma-500 dark:text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            {/* Routes */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">Routes</label>
                    <button onClick={addRoute} className="text-xs flex items-center gap-1 text-plasma-600 hover:text-plasma-700 font-bold">
                        <Plus size={12} /> Add Route
                    </button>
                </div>
                <div className="border border-gray-200 dark:border-neutral-700 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-neutral-900/50 text-gray-500 text-xs uppercase">
                            <tr>
                                <th className="px-4 py-2">Destination</th>
                                <th className="px-4 py-2">Next Hop</th>
                                <th className="px-4 py-2 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-neutral-700">
                            {routes.map((route, idx) => (
                                <tr key={idx} className="bg-white dark:bg-neutral-900">
                                    <td className="px-4 py-2">
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent outline-none font-mono text-xs dark:text-gray-300"
                                            value={route.destination}
                                            placeholder="0.0.0.0/0"
                                            onChange={(e) => {
                                                const newRoutes = [...routes];
                                                newRoutes[idx].destination = e.target.value;
                                                setRoutes(newRoutes);
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-2">
                                        <input 
                                            type="text" 
                                            className="w-full bg-transparent outline-none text-xs dark:text-gray-300"
                                            value={route.nextHop}
                                            placeholder="Gateway"
                                            onChange={(e) => {
                                                const newRoutes = [...routes];
                                                newRoutes[idx].nextHop = e.target.value;
                                                setRoutes(newRoutes);
                                            }}
                                        />
                                    </td>
                                    <td className="px-4 py-2 text-right">
                                        <button onClick={() => removeRoute(idx)} className="text-gray-400 hover:text-red-500">
                                            <Trash2 size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="mt-8 flex gap-3 pt-6 border-t border-gray-100 dark:border-neutral-800">
          <Button variant="secondary" onClick={onClose} className="flex-1 dark:bg-neutral-800 dark:text-white dark:border-neutral-700">Cancel</Button>
          <Button onClick={handleSave} className="flex-1 shadow-lg shadow-plasma-500/20 gap-2">
             <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>
    </div>,
    document.body
  );
};

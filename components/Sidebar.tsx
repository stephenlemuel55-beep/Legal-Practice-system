import React from 'react';
import { 
  LayoutDashboard, 
  Scale, 
  FileText, 
  BrainCircuit, 
  PenTool, 
  MessageSquare, 
  HardDrive, 
  Gavel, 
  Newspaper, 
  BookOpen,
  X
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, isOpen, onClose }) => {
  const menuItems = [
    { id: View.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { id: View.RESEARCH, label: 'Deep Research', icon: Scale },
    { id: View.ANALYSIS, label: 'Doc Analysis', icon: FileText },
    { id: View.PREDICTION, label: 'Case Prediction', icon: BrainCircuit },
    { id: View.DRAFTING, label: 'Drafting', icon: PenTool },
    { id: View.CHAT, label: 'Workspace Chat', icon: MessageSquare },
    { id: View.STORAGE, label: 'Cloud Vault', icon: HardDrive },
    { id: View.COURTS, label: 'Court Directory', icon: Gavel },
    { id: View.NEWS, label: 'Legal News', icon: Newspaper },
    { id: View.BLOG, label: 'Legal Blog', icon: BookOpen },
  ];

  return (
    <aside 
      className={`
        w-64 bg-nigeria-dark text-white flex flex-col h-full fixed left-0 top-0 z-40 shadow-xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}
    >
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif font-bold flex items-center gap-2">
            <span className="bg-white text-nigeria-green px-2 rounded">U</span>-Practice
          </h1>
          <p className="text-xs text-gray-300 mt-1">AI-Powered Legal Practice</p>
        </div>
        <button onClick={onClose} className="md:hidden text-gray-300 hover:text-white">
          <X size={24} />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  onViewChange(item.id);
                  onClose();
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-nigeria-green text-white font-semibold shadow-md'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-600 shrink-0"></div>
          <div className="overflow-hidden">
            <p className="text-sm font-medium truncate">Barr. Adebayo</p>
            <p className="text-xs text-gray-400 truncate">Premium Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
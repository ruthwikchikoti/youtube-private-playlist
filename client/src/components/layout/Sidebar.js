import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart2, 
  Play, 
  BookOpen, 
  ShoppingBag,
  List,
  MessageSquare,
  Calendar,
  Users
} from 'lucide-react';

const menuItems = [
  { icon: BarChart2, label: 'Revenue', path: '/revenue' },
  { icon: Play, label: 'Shoppable Video', path: '/video' },
  { icon: BookOpen, label: 'Story', path: '/story' },
  { icon: ShoppingBag, label: 'Live Commerce', path: '/commerce' },
  { 
    icon: List, 
    label: 'Playlist Manager', 
    path: '/dashboard',
    submenu: [
      { label: 'Product playlist', path: '/dashboard/playlists' }
    ]
  },
  { icon: MessageSquare, label: 'One Click Post', path: '/post' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Users, label: 'Hire Influencer', path: '/influencer' }
];

const Sidebar = () => {
  return (
    <aside className="w-64 min-h-screen bg-[#1a1d24] border-r border-gray-800">
      <div className="p-6">
        <div className="mb-8">
          <img 
            src="/api/placeholder/120/32"
            alt="Logo"
            className="h-8"
          />
        </div>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <div key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center space-x-3 px-4 py-2.5 rounded-lg
                    ${isActive 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>

                {item.submenu && (
                  <div className="ml-12 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={({ isActive }) => `
                          block px-4 py-2 rounded-lg text-sm
                          ${isActive 
                            ? 'text-blue-400' 
                            : 'text-gray-400 hover:text-white'
                          }
                        `}
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
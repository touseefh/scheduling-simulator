import React from 'react';
import { NavLink } from 'react-router-dom';
import { Cpu, BarChart2 } from 'lucide-react';

export const Navbar = () => {
  const navItems = [
    { to: '/', label: 'Home', icon: <Cpu className="w-5 h-5" /> },
    { to: '/simulator', label: 'Simulator', icon: <Cpu className="w-5 h-5" /> },
    // { to: '/comparison', label: 'Compare', icon: <BarChart2 className="w-5 h-5" /> },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive
                      ? 'border-indigo-500 text-gray-900'
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`
                }
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
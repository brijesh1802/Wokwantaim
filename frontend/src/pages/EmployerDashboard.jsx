import React, { useState, useEffect } from 'react';
import { FiUserPlus, FiUsers, FiBriefcase, FiSearch, FiPlusCircle, FiMenu, FiUser, FiX, FiDatabase } from 'react-icons/fi';

import EmployerProfileSection from '../components/employer/EmployerProfileSection';
import EmployerAddJobSection from '../components/employer/EmployerAddJobSection';
import EmployerApplicationsSection from '../components/employer/EmployerApplcationsSection';
import EmployerSearchJobsSection from '../components/employer/EmployerSearchJobsSection';
import EmployerSearchCandidatesSection from '../components/employer/EmployerSearchCandidatesSection';

import EmployerViewAdminsSection from '../components/admin/ViewAdminsSection';
import EmployerManageEntitiesSection from '../components/admin/ManageEntitiesSection';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    { id: 'profile', icon: FiUser, label: 'Profile' },
    { id: 'addJob', icon: FiPlusCircle, label: 'Add Job' },
    { id: 'applications', icon: FiBriefcase, label: 'Applications' },
    { id: 'searchJobs', icon: FiSearch, label: 'Search Jobs' },
    { id: 'searchCandidates', icon: FiSearch, label: 'Search Candidates' },
    { id: 'addAdmin', icon: FiUserPlus, label: 'Add Admin' },
    { id: 'viewAdmins', icon: FiUsers, label: 'View Admins' },
    { id: 'manageEntities', icon: FiDatabase, label: 'Manage Entities' },
  ]);

  const navigate = useNavigate();

  const renderContent = () => {
    switch(activeTab) {
      case 'profile':
        return <EmployerProfileSection />;
      case 'addJob':
        return <EmployerAddJobSection />;
      case 'applications':
        return <EmployerApplicationsSection />;
      case 'searchJobs':
        return <EmployerSearchJobsSection />;
      case 'searchCandidates':
        return <EmployerSearchCandidatesSection />;
      case 'addAdmin':
        return <EmployerAddAdminSection />;
      case 'viewAdmins':
        return <EmployerViewAdminsSection />;
      case 'manageEntities':
        return <EmployerManageEntitiesSection />;
      default:
        return <EmployerProfileSection />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:flex flex-col w-64 bg-white shadow-lg z-30 relative">
        <div className="flex items-center justify-center h-20 shadow-md">
          <h1 className="text-3xl font-bold text-orange-600">Menu</h1>
        </div>
        <ul className="flex flex-col py-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <a
                href="#"
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-orange-100 ${activeTab === item.id ? 'bg-orange-100' : ''}`}
              >
                <item.icon className="mr-3" />
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="flex items-center justify-between px-6 py-4 bg-white shadow-md z-20 relative">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className=" text-gray-500 focus:outline-none md:hidden "
            >
              <FiMenu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 ml-4">Employer Dashboard</h2>
          </div>
        </header>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white shadow-lg z-40 absolute top-0 left-0 w-full h-screen">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>
            <ul className="py-4">
              {menuItems.map((item) => (
                <li key={item.id}>
                  <a
                    href="#"
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center px-6 py-3 text-gray-700 hover:bg-orange-100 ${activeTab === item.id ? 'bg-orange-100' : ''}`}
                  >
                    <item.icon className="mr-3" />
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6 z-10">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;

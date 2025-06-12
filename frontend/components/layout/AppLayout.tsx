
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { ToastMessage } from '../../types';
import ToastContainer from '../ui/ToastContainer';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    setToasts(prev => [...prev, { ...toast, id: String(Date.now()) }]);
  };

  // This context could be created to provide addToast globally
  // For now, keeping it simple or assuming pages might manage their own toasts
  // Or, a global toast context could be implemented

  return (
    <div className="flex h-screen bg-neutral-light dark:bg-dark-bg">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-neutral-light dark:bg-dark-bg p-6">
          {/* Example of how a page could add a toast. Ideally, this is through context.
          <button onClick={() => addToast({ type: 'success', message: 'Action successful!' })}>
            Test Toast
          </button> 
          */}
          {children}
        </main>
      </div>
      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </div>
  );
};

export default AppLayout;

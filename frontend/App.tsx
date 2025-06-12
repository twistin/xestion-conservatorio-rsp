
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import LoginPage from './components/auth/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentsPage from './pages/StudentsPage';
import CoursesPage from './pages/CoursesPage';
import SchedulesPage from './pages/SchedulesPage';
import MyProfilePage from './pages/MyProfilePage';
import MyCoursesPage from './pages/MyCoursesPage';
import ComingSoon from './components/shared/ComingSoon';
import ProfessorsPage from './pages/ProfessorsPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import NotificationsPage from './pages/NotificationsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route 
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Routes>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/professors" element={<ProfessorsPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/schedules" element={<SchedulesPage />} />
                <Route path="/payments" element={<PaymentsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<MyProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                
                {/* Student specific routes */}
                {user?.role === 'Student' && (
                  <>
                    <Route path="/my-courses" element={<MyCoursesPage />} />
                    <Route path="/my-grades" element={<ComingSoon featureName="My Grades" />} />
                  </>
                )}

                {/* Professor specific routes */}
                 {user?.role === 'Professor' && (
                  <>
                    <Route path="/assigned-students" element={<ComingSoon featureName="Assigned Students" />} />
                    <Route path="/manage-grades" element={<ComingSoon featureName="Manage Grades" />} />
                  </>
                )}

                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

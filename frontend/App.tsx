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
import StudentProfilePage from './pages/StudentProfilePage';
import StudentSchedulePage from './pages/StudentSchedulePage';
import StudentEvaluationsPage from './pages/StudentEvaluationsPage';
import StudentResourcesPage from './pages/StudentResourcesPage';
import StudentMessagesPage from './pages/StudentMessagesPage';
import StudentAdminPage from './pages/StudentAdminPage';
import StudentActivitiesPage from './pages/StudentActivitiesPage';
import StudentAIPage from './pages/StudentAIPage';
import StudentStatsPage from './pages/StudentStatsPage';
import StudentSurveysPage from './pages/StudentSurveysPage';
import ProfessorAssignedStudentsPage from './pages/ProfessorAssignedStudentsPage';
import ProfessorSchedulePage from './pages/ProfessorSchedulePage';
import ProfessorEvaluationsPage from './pages/ProfessorEvaluationsPage';
import ProfessorResourcesPage from './pages/ProfessorResourcesPage';
import ProfessorMessagesPage from './pages/ProfessorMessagesPage';
import ProfessorAttendancePage from './pages/ProfessorAttendancePage';
import ProfessorAIAssistantPage from './pages/ProfessorAIAssistantPage';
import ProfessorActivitiesPage from './pages/ProfessorActivitiesPage';
import ProfessorStatsPage from './pages/ProfessorStatsPage';
import ProfessorAdminPage from './pages/ProfessorAdminPage';

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
                    <Route path="/student-profile" element={<StudentProfilePage />} />
                    <Route path="/student-schedule" element={<StudentSchedulePage />} />
                    <Route path="/student-evaluations" element={<StudentEvaluationsPage />} />
                    <Route path="/student-resources" element={<StudentResourcesPage />} />
                    <Route path="/student-messages" element={<StudentMessagesPage />} />
                    <Route path="/student-admin" element={<StudentAdminPage />} />
                    <Route path="/student-activities" element={<StudentActivitiesPage />} />
                    <Route path="/student-ai" element={<StudentAIPage />} />
                    <Route path="/student-stats" element={<StudentStatsPage />} />
                    <Route path="/student-surveys" element={<StudentSurveysPage />} />
                  </>
                )}

                {/* Professor specific routes */}
                 {user?.role === 'Professor' && (
                  <>
                    <Route path="/assigned-students" element={<ComingSoon featureName="Assigned Students" />} />
                    <Route path="/manage-grades" element={<ComingSoon featureName="Manage Grades" />} />
                    <Route path="/professor-assigned-students" element={<ProfessorAssignedStudentsPage />} />
                    <Route path="/professor-schedule" element={<ProfessorSchedulePage />} />
                    <Route path="/professor-evaluations" element={<ProfessorEvaluationsPage />} />
                    <Route path="/professor-resources" element={<ProfessorResourcesPage />} />
                    <Route path="/professor-messages" element={<ProfessorMessagesPage />} />
                    <Route path="/professor-attendance" element={<ProfessorAttendancePage />} />
                    <Route path="/professor-ai" element={<ProfessorAIAssistantPage />} />
                    <Route path="/professor-activities" element={<ProfessorActivitiesPage />} />
                    <Route path="/professor-stats" element={<ProfessorStatsPage />} />
                    <Route path="/professor-admin" element={<ProfessorAdminPage />} />
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


import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import ProfessorDashboard from '../components/dashboard/ProfessorDashboard';
import StudentDashboard from '../components/dashboard/StudentDashboard';
import Spinner from '../components/ui/Spinner';

const DashboardPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner fullPage message="Cargando panel de control..." />;
  }

  if (!user) {
    // Should be caught by ProtectedRoute, but as a fallback
    return <p>Erro: Usuario non atopado.</p>;
  }

  switch (user.role) {
    case UserRole.Admin:
      return <AdminDashboard user={user} />;
    case UserRole.Professor:
      return <ProfessorDashboard user={user} />;
    case UserRole.Student:
      return <StudentDashboard user={user} />;
    default:
      return <p>Rol de usuario descoñecido.</p>;
  }
};

export default DashboardPage;
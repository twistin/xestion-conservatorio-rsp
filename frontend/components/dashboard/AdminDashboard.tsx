import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import PageContainer from '../layout/PageContainer';
import MetricCard from '../ui/MetricCard';
import { ICONS, ROUTES } from '../../constants';
import * as dataService from '../../services/dataService';
import Card from '../ui/Card';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


interface AdminDashboardProps {
  user: User;
}
interface AdminMetrics {
    totalStudents: number;
    totalProfessors: number;
    activeCourses: number;
    totalPayments: number;
    recentEnrollments: string[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [enrollments, setEnrollments] = useState<any[]>([]);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const [data, realEnrollments] = await Promise.all([
          dataService.getDashboardMetrics(user.role, user.id) as Promise<AdminMetrics>,
          dataService.getAllEnrollments()
        ]);
        // Simulating translation for dynamic data for demo purposes
        if (data && data.recentEnrollments) {
            data.recentEnrollments = data.recentEnrollments.map(e => e.replace("Student", "Alumno/a").replace("enrolled in", "matriculouse en"));
        }
        setMetrics(data);
        setEnrollments(realEnrollments);
      } catch (error) {
        console.error("Failed to fetch admin metrics", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
  }, [user.role, user.id]);

  const breadcrumbs = [{ label: 'Panel de Control', current: true }];

  // Agrupar matrículas por año usando datos reales
  const enrollmentsByYear: Record<string, number> = {};
  enrollments.forEach((e) => {
    const year = new Date(e.enrollment_date || e.enrollmentDate).getFullYear();
    enrollmentsByYear[year] = (enrollmentsByYear[year] || 0) + 1;
  });

  // Calcular rango de años: 5 antes y 5 después del actual
  const currentYear = new Date().getFullYear();
  const yearsRange = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const enrollmentChartData = yearsRange.map(year => ({
    name: year.toString(),
    enrollments: enrollmentsByYear[year] || 0
  }));
  
  const quickLinks = [
    { label: "Xestionar Alumnado", href: ROUTES.students, icon: ICONS.students },
    { label: "Xestionar Profesorado", href: ROUTES.professors, icon: ICONS.professors },
    { label: "Xestionar Cursos", href: ROUTES.courses, icon: ICONS.courses },
    { label: "Ver Horarios", href: ROUTES.schedules, icon: ICONS.calendar },
  ];


  return (
    <PageContainer title={`Benvido/a, ${user.firstName}!`} breadcrumbs={breadcrumbs}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Alumnado" value={metrics?.totalStudents ?? 0} icon={ICONS.students} iconBgColor="bg-blue-500" isLoading={isLoading} />
        <MetricCard title="Total Profesorado" value={metrics?.totalProfessors ?? 0} icon={ICONS.professors} iconBgColor="bg-teal-500" isLoading={isLoading} />
        <MetricCard title="Cursos Activos" value={metrics?.activeCourses ?? 0} icon={ICONS.courses} iconBgColor="bg-purple-500" isLoading={isLoading} />
        <MetricCard title="Ingresos Mensuais" value={`€${(metrics?.totalPayments ?? 0).toLocaleString('gl-ES')}`} icon={ICONS.payments} iconBgColor="bg-yellow-500" isLoading={isLoading} description="Pagado este mes" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Matrículas Anuais" className="lg:col-span-2">
          {isLoading ? <div className="h-64 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div> : (
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={enrollmentChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-neutral-medium" />
                  <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 12 }} className="text-neutral-medium dark:text-gray-400" />
                  <YAxis tick={{ fill: 'currentColor', fontSize: 12 }} className="text-neutral-medium dark:text-gray-400" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="enrollments" fill="#2563eb" name="Matrículas" />
                </BarChart>
              </ResponsiveContainer>
          )}
        </Card>
        
        <Card title="Accesos Rápidos">
            {isLoading ? <div className="space-y-2"> {[1,2,3,4].map(i=><div key={i} className="h-10 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>)} </div> :
            <div className="space-y-3">
                {quickLinks.map(link => (
                    <Link key={link.label} to={link.href}>
                        <Button variant="outline" className="w-full justify-start" iconLeft={link.icon}>
                            {link.label}
                        </Button>
                    </Link>
                ))}
            </div>
            }
        </Card>
      </div>

      <Card title="Actividade Recente">
        {isLoading ? <div className="space-y-2"> {[1,2,3].map(i=><div key={i} className="h-8 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>)} </div> :
        metrics?.recentEnrollments && metrics.recentEnrollments.length > 0 ? (
          <ul className="divide-y divide-neutral-light dark:divide-neutral-medium">
            {metrics.recentEnrollments.map((activity, index) => (
              <li key={index} className="py-3 text-sm text-neutral-dark dark:text-neutral-light">
                <i className="fa-solid fa-user-plus mr-2 text-secondary"></i> {activity}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-medium dark:text-gray-400">Non hai actividade recente.</p>
        )}
      </Card>
    </PageContainer>
  );
};

export default AdminDashboard;
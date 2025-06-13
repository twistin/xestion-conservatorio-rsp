import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import PageContainer from '../layout/PageContainer';
import MetricCard from '../ui/MetricCard';
import { ICONS, ROUTES } from '../../constants';
import * as dataService from '../../services/dataService';
import Card from '../ui/Card';
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
  const [iaAnalysis, setIaAnalysis] = useState<dataService.IAEnrollmentAnalysis | null>(null);
  const [isIaLoading, setIsIaLoading] = useState(true);

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

  useEffect(() => {
    setIsIaLoading(true);
    dataService.getIAEnrollmentAnalysis()
      .then(setIaAnalysis)
      .catch(() => setIaAnalysis(null))
      .finally(() => setIsIaLoading(false));
  }, []);

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
  

  return (
    <PageContainer title={`Benvido/a, ${user.firstName}!`} breadcrumbs={breadcrumbs}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard title="Total Alumnado" value={metrics?.totalStudents ?? 0} icon={ICONS.students} iconBgColor="bg-blue-500" isLoading={isLoading} />
        <MetricCard title="Total Profesorado" value={metrics?.totalProfessors ?? 0} icon={ICONS.professors} iconBgColor="bg-teal-500" isLoading={isLoading} />
        <MetricCard title="Cursos Activos" value={metrics?.activeCourses ?? 0} icon={ICONS.courses} iconBgColor="bg-purple-500" isLoading={isLoading} />
        <MetricCard title="Ingresos Mensuais" value={`€${(metrics?.totalPayments ?? 0).toLocaleString('gl-ES')}`} icon={ICONS.payments} iconBgColor="bg-yellow-500" isLoading={isLoading} description="Pagado este mes" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Matrículas Anuales" className="lg:col-span-2">
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
        <Card title="IA Administrativa" className="lg:col-span-1">
          {isIaLoading ? (
            <div className="h-48 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>
          ) : iaAnalysis ? (
            <>
              <div className="mb-3">
                <b>📊 Asignaturas más elegidas:</b>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {iaAnalysis.top_courses.length === 0 ? <li>No hay datos.</li> : iaAnalysis.top_courses.map(c => (
                    <li key={c.course_id}>{c.name} <span className="text-neutral-medium">({c.num_enrollments} matrículas)</span></li>
                  ))}
                </ul>
              </div>
              <div className="mb-3">
                <b>🕒 Horarios saturados:</b>
                <ul className="list-disc pl-5 text-sm mt-1">
                  {iaAnalysis.saturated_schedules.length === 0 ? <li>No hay solapamientos detectados.</li> : iaAnalysis.saturated_schedules.map((s, i) => (
                    <li key={i}>Aula {s.room} - {s.date}: <span className="text-status-red">{s.count} cursos</span></li>
                  ))}
                </ul>
              </div>
              <div className="mt-4">
                <Button variant="primary" className="w-full" disabled>
                  IA Administrativa (demo)
                </Button>
              </div>
            </>
          ) : (
            <div className="text-sm text-status-red">No se pudo cargar el análisis IA.</div>
          )}
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
import React, { useEffect, useState } from 'react';
import { User } from '../../types';
import PageContainer from '../layout/PageContainer';
import MetricCard from '../ui/MetricCard';
import { ICONS, ROUTES } from '../../constants';
import * as dataService from '../../services/dataService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';


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
  const [scheduleOpt, setScheduleOpt] = useState<dataService.IAScheduleOptimization | null>(null);
  const [isScheduleOptLoading, setIsScheduleOptLoading] = useState(true);
  const [demandPrediction, setDemandPrediction] = useState<dataService.IADemandPrediction | null>(null);
  const [isDemandPredictionLoading, setIsDemandPredictionLoading] = useState(true);
  const [iaReport, setIaReport] = useState<dataService.IAReport | null>(null);
  const [isIaReportLoading, setIsIaReportLoading] = useState(true);
  const [iaEnabled, setIaEnabled] = useState(() => {
    const stored = localStorage.getItem('iaEnabled');
    return stored ? stored === 'true' : true;
  });

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

  useEffect(() => {
    setIsScheduleOptLoading(true);
    dataService.getIAScheduleOptimization()
      .then(setScheduleOpt)
      .catch(() => setScheduleOpt(null))
      .finally(() => setIsScheduleOptLoading(false));
  }, []);

  useEffect(() => {
    setIsDemandPredictionLoading(true);
    dataService.getIADemandPrediction()
      .then(setDemandPrediction)
      .catch(() => setDemandPrediction(null))
      .finally(() => setIsDemandPredictionLoading(false));
  }, []);

  useEffect(() => {
    setIsIaReportLoading(true);
    dataService.getIAReport()
      .then(setIaReport)
      .catch(() => setIaReport(null))
      .finally(() => setIsIaReportLoading(false));
  }, []);

  const handleToggleIA = () => {
    const newValue = !iaEnabled;
    setIaEnabled(newValue);
    localStorage.setItem('iaEnabled', String(newValue));
    // Aquí podrías disparar lógica adicional para alternar endpoints reales/mock si lo deseas
  };

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
        <Card title="Optimización de Horarios IA" className="lg:col-span-1">
          {isScheduleOptLoading ? (
            <div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>
          ) : scheduleOpt ? (
            <ul className="list-disc pl-5 text-sm mt-1">
              {scheduleOpt.optimizations.length === 0 ? <li>No hay solapamientos detectados.</li> : scheduleOpt.optimizations.map((opt, i) => (
                <li key={i} className="mb-2">
                  <b>Aula {opt.room}:</b> {opt.suggestion}
                  <div className="ml-2 mt-1 text-xs text-neutral-medium">
                    Cursos implicados: {opt.courses.map((name, idx) => (
                      <span key={idx}>{name}{idx < opt.courses.length-1 ? ', ' : ''}</span>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-status-red">No se pudo cargar la optimización IA.</div>
          )}
          <div className="mt-3 text-xs text-neutral-medium">
            Revise los cursos implicados y ajuste los horarios desde la sección de <Link to="/courses" className="underline text-primary">gestión de cursos</Link>.
          </div>
        </Card>
        <Card title="Predicción de Demanda IA" className="lg:col-span-1">
          {isDemandPredictionLoading ? (
            <div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>
          ) : demandPrediction ? (
            <ul className="list-disc pl-5 text-sm mt-1">
              {demandPrediction.predictions.length === 0 ? <li>No hay datos suficientes.</li> : demandPrediction.predictions.map((pred, i) => (
                <li key={i} className="mb-2">
                  <b>{pred.name}:</b> {pred.last_year ? `Último año (${pred.last_year}): ${pred.last_year_enrollments} → Predicción siguiente año: ` : ''}
                  <span className="text-primary font-semibold">{pred.predicted_next_year}</span> matrículas
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-sm text-status-red">No se pudo cargar la predicción IA.</div>
          )}
        </Card>
        <Card title="Informe Mensual IA" className="lg:col-span-1">
          {isIaReportLoading ? (
            <div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>
          ) : iaReport ? (
            <div className="text-sm space-y-1">
              <div><b>Mes:</b> {iaReport.report.month}/{iaReport.report.year}</div>
              <div><b>Nuevas matrículas:</b> {iaReport.report.new_enrollments}</div>
              <div><b>Asistencia media:</b> {iaReport.report.total_attendance}%</div>
              <div><b>Incidencias:</b> {iaReport.report.incidents}</div>
              <div><b>Pagos procesados:</b> {iaReport.report.payments_processed}</div>
              <div><b>Documentos revisados:</b> {iaReport.report.documents_reviewed}</div>
              <div className="mt-2 text-neutral-medium"><b>Notas:</b> {iaReport.report.notes}</div>
            </div>
          ) : (
            <div className="text-sm text-status-red">No se pudo generar el informe IA.</div>
          )}
        </Card>
        <Card title="Activar IA Administrativa" className="lg:col-span-1">
          <div className="mb-3 text-sm text-neutral-medium">
            Puedes activar o desactivar las funciones IA administrativas en tiempo real para pruebas o producción.
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="font-medium">Estado IA:</span>
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${iaEnabled ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{iaEnabled ? 'Activa' : 'Desactivada'}</span>
          </div>
          <Button variant={iaEnabled ? 'danger' : 'primary'} className="w-full" onClick={handleToggleIA}>
            {iaEnabled ? 'Desactivar IA' : 'Activar IA'}
          </Button>
          <div className="mt-3 text-xs text-neutral-medium">
            (El estado se guarda localmente. Próximamente: integración con backend/config global.)
          </div>
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
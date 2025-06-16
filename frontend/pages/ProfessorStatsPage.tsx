import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import MetricCard from '../components/ui/MetricCard';
import Card from '../components/ui/Card';
import { ICONS } from '../constants';
import * as dataService from '../services/dataService';
import { UserRole, Course, Student } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const ProfessorStatsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simular userId y role de profesor autenticado (ajustar si hay contexto de usuario global)
      const userId = localStorage.getItem('userId') || 'prof-1';
      const role = UserRole.Professor;
      try {
        const metricsData = await dataService.getDashboardMetrics(role, userId);
        setMetrics(metricsData);
        const prof = await dataService.getProfessorByUserId(userId);
        if (prof) {
          const assignedCourses = await dataService.getCoursesByTeacherId(prof.id);
          setCourses(assignedCourses);
          // Obtener alumnado único de esos cursos
          let allEnrollments: any[] = [];
          for (const course of assignedCourses) {
            const courseEnrollments = await dataService.getEnrollmentsByCourseId(course.id);
            allEnrollments = allEnrollments.concat(courseEnrollments);
          }
          const allStudents = await dataService.getStudents();
          const uniqueStudentIds = Array.from(new Set(allEnrollments.map(e => e.studentId)));
          setStudents(allStudents.filter(s => uniqueStudentIds.includes(s.id)));
          setEnrollments(allEnrollments);
        }
      } catch (e) {
        setMetrics(null); setCourses([]); setStudents([]); setEnrollments([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Datos para la gráfica: alumnos por curso
  const alumnosPorCurso = courses.map(course => ({
    name: course.name,
    alumnos: students.filter(s => enrollments.some(e => e.courseId === course.id && e.studentId === s.id)).length
  }));

  return (
    <PageContainer title="Estadísticas do Profesorado">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Cursos Asignados" value={metrics?.assignedCoursesCount ?? 0} icon={ICONS.courses} iconBgColor="bg-blue-500" isLoading={isLoading} />
        <MetricCard title="Total Alumnado Impartido" value={metrics?.totalStudentsTaught ?? 0} icon={ICONS.students} iconBgColor="bg-teal-500" isLoading={isLoading} />
        <MetricCard title="Clases Hoxe" value={metrics?.upcomingClassesToday ?? 0} icon={ICONS.calendar} iconBgColor="bg-purple-500" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Distribución de alumnado por curso">
          {isLoading ? <div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div> :
            <>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={alumnosPorCurso} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" tick={{ fill: '#6B7280', fontSize: 12 }} angle={-15} textAnchor="end" interval={0} height={60} />
                  <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#23272b', color: '#fff', border: 'none' }} />
                  <Bar dataKey="alumnos" fill="#059669" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <ul className="space-y-2 mt-4">
                {alumnosPorCurso.map(c => (
                  <li key={c.name} className="flex justify-between items-center">
                    <span className="font-medium text-neutral-dark dark:text-white">{c.name}</span>
                    <span className="text-xs text-neutral-medium dark:text-gray-400">{c.alumnos} alumnos/as</span>
                  </li>
                ))}
              </ul>
            </>
          }
        </Card>
        <Card title="Evolución do alumnado (mock)">
          <div className="h-40 flex items-center justify-center text-neutral-medium dark:text-gray-400">[Gráfica próximamente]</div>
        </Card>
      </div>

      <Card title="Listado de alumnado asignado">
        {isLoading ? <div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div> :
          students.length === 0 ? <div className="text-neutral-medium">Non hai alumnado asignado.</div> :
            <ul className="space-y-1">
              {students.map(s => (
                <li key={s.id} className="flex justify-between items-center">
                  <span className="font-medium text-neutral-dark dark:text-white">{s.firstName} {s.lastName}</span>
                  <span className="text-xs text-neutral-medium dark:text-gray-400">{s.email}</span>
                </li>
              ))}
            </ul>
        }
      </Card>
    </PageContainer>
  );
};

export default ProfessorStatsPage;

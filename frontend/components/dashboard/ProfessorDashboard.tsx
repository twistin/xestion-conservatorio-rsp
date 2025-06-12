
import React, { useEffect, useState } from 'react';
import { User, Course, ScheduleItem, Student } from '../../types';
import PageContainer from '../layout/PageContainer';
import MetricCard from '../ui/MetricCard';
import Card from '../ui/Card';
import { ICONS, ROUTES } from '../../constants';
import * as dataService from '../../services/dataService';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface ProfessorDashboardProps {
  user: User;
}

interface ProfessorMetrics {
    assignedCoursesCount: number;
    totalStudentsTaught: number;
    upcomingClassesToday: number;
}

const ProfessorDashboard: React.FC<ProfessorDashboardProps> = ({ user }) => {
  const [metrics, setMetrics] = useState<ProfessorMetrics | null>(null);
  const [assignedCourses, setAssignedCourses] = useState<Course[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const professorDetails = await dataService.getProfessorByUserId(user.id);
        if (!professorDetails) throw new Error("Datos do profesor non atopados");

        const [metricsData, coursesData, scheduleData] = await Promise.all([
          dataService.getDashboardMetrics(user.role, user.id) as Promise<ProfessorMetrics>,
          dataService.getCoursesByTeacherId(professorDetails.id),
          dataService.getSchedulesByUserId(user.id, user.role)
        ]);
        
        setMetrics(metricsData);
        setAssignedCourses(coursesData);
        
        const today = new Date().toLocaleDateString('gl-ES', { weekday: 'long' }); // Use Galician locale for day name
        const todayNormalized = today.charAt(0).toUpperCase() + today.slice(1); // Ensure consistent capitalization with mockData
        
        setTodaySchedule(scheduleData.filter(item => item.dayOfWeek.toLowerCase() === todayNormalized.toLowerCase()).sort((a,b) => a.startTime.localeCompare(b.startTime)));


      } catch (error) {
        console.error("Erro ao obter datos do panel do profesor", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id, user.role]);

  const breadcrumbs = [{ label: 'Panel de Control', current: true }];
  
  const quickLinks = [
    { label: "Ver O Meu Horario", href: ROUTES.schedules, icon: ICONS.calendar },
    { label: "Xestionar Alumnado Asignado", href: ROUTES.assignedStudents, icon: ICONS.students },
    { label: "Introducir Cualificacións", href: ROUTES.manageGrades, icon: "fa-solid fa-marker" },
  ];

  const daysOfWeekGalician: { [key: string]: string } = {
    Monday: 'Luns', Tuesday: 'Martes', Wednesday: 'Mércores',
    Thursday: 'Xoves', Friday: 'Venres', Saturday: 'Sábado', Sunday: 'Domingo'
  };


  return (
    <PageContainer title={`Benvido/a, Prof. ${user.lastName}!`} breadcrumbs={breadcrumbs}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Cursos Asignados" value={metrics?.assignedCoursesCount ?? 0} icon={ICONS.courses} iconBgColor="bg-blue-500" isLoading={isLoading} />
        <MetricCard title="Total Alumnado Impartido" value={metrics?.totalStudentsTaught ?? 0} icon={ICONS.students} iconBgColor="bg-teal-500" isLoading={isLoading} />
        <MetricCard title="Clases Hoxe" value={metrics?.upcomingClassesToday ?? 0} icon={ICONS.calendar} iconBgColor="bg-purple-500" isLoading={isLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Horario de Hoxe" className="lg:col-span-2">
          {isLoading ? <div className="h-64 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div> : 
           todaySchedule.length > 0 ? (
            <ul className="divide-y divide-neutral-light dark:divide-neutral-medium max-h-96 overflow-y-auto">
              {todaySchedule.map(item => (
                <li key={item.id} className="py-3 px-1">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-neutral-dark dark:text-white">{item.title}</span>
                    <span className="text-sm text-primary dark:text-accent">{item.startTime} - {item.endTime}</span>
                  </div>
                  <p className="text-xs text-neutral-medium dark:text-gray-400">
                    <i className="fa-solid fa-location-dot mr-1"></i>{item.location} | <i className="fa-solid fa-bookmark mr-1"></i>{item.type}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-neutral-medium dark:text-gray-400">Non hai clases programadas para hoxe.</p>
          )}
        </Card>

        <Card title="Accesos Rápidos">
            {isLoading ? <div className="space-y-2"> {[1,2,3].map(i=><div key={i} className="h-10 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>)} </div> :
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
      
      <Card title="Os Meus Cursos Asignados">
         {isLoading ? <div className="space-y-2"> {[1,2,3].map(i=><div key={i} className="h-10 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>)} </div> :
          assignedCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedCourses.map(course => (
              <Card key={course.id} title={course.name} className="bg-neutral-light dark:bg-neutral-dark shadow-sm hover:shadow-md">
                <p className="text-sm text-neutral-medium dark:text-gray-400 mb-1">{course.description}</p>
                <p className="text-xs text-primary dark:text-accent">{course.level}</p>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-medium dark:text-gray-400">Actualmente non ten cursos asignados.</p>
        )}
      </Card>
    </PageContainer>
  );
};

export default ProfessorDashboard;
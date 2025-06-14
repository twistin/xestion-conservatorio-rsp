import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { ScheduleItem, UserRole, Course, Professor, Student } from '../types';
import * as dataService from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { ICONS } from '../constants';
import Card from '../components/ui/Card';

const daysOfWeek: ScheduleItem['dayOfWeek'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysOfWeekGalician: Record<ScheduleItem['dayOfWeek'], string> = {
    Monday: 'Luns',
    Tuesday: 'Martes',
    Wednesday: 'Mércores',
    Thursday: 'Xoves',
    Friday: 'Venres',
    Saturday: 'Sábado',
    Sunday: 'Domingo',
};

// ErrorBoundary local para evitar pantallas en branco
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded text-red-900 text-center">
          <b>Ocurrió un erro inesperado nesta páxina.</b><br />
          Por favor, recarga ou contacta co administrador se persiste.
        </div>
      );
    }
    return this.props.children;
  }
}

const SchedulesPage: React.FC = () => {
  const { user } = useAuth();
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [students, setStudents] = useState<Student[]>([]);


  const fetchScheduleData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let items: ScheduleItem[];
      if (user.role === UserRole.Admin) {
        items = await dataService.getAllSchedules();
      } else {
        items = await dataService.getSchedulesByUserId(user.id, user.role);
      }
      setScheduleItems(items);

      const [coursesData, professorsData, studentsData] = await Promise.all([
          dataService.getCourses(),
          dataService.getProfessors(),
          dataService.getStudents()
      ]);
      setCourses(coursesData);
      setProfessors(professorsData);
      setStudents(studentsData);

    } catch (error) {
      console.error("Erro ao obter datos do horario:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchScheduleData();
  }, [fetchScheduleData]);
  
  const getRelatedName = (item: ScheduleItem): string => {
    if (item.courseId) {
        const course = courses.find(c => c.id === item.courseId);
        if (course) return `Curso: ${course.name}`;
    }
    if (item.teacherId) {
        const prof = professors.find(p => p.id === item.teacherId);
         if (prof) return `Prof: ${prof.firstName} ${prof.lastName}`;
    }
    if (item.studentId) {
        const stud = students.find(s => s.id === item.studentId);
        if (stud) return `Alumno/a: ${stud.firstName} ${stud.lastName}`;
    }
    return '';
  };


  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: user?.role === UserRole.Admin ? 'Horarios Xerais' : 'O Meu Horario', current: true },
  ];
  
  const pageTitle = user?.role === UserRole.Admin ? 'Horarios Xerais do Conservatorio' : 'O Meu Horario';

  if (isLoading) {
    return <Spinner fullPage message="Cargando horarios..." />;
  }
  return (
    <ErrorBoundary>
      <PageContainer title={pageTitle} breadcrumbs={breadcrumbs}>
        {scheduleItems.length === 0 ? (
          <EmptyState
            icon={ICONS.calendar}
            title="Non se atopou horario"
            description="Non hai elementos no seu horario."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {daysOfWeek.map(day => {
              const itemsForDay = scheduleItems.filter(item => item.dayOfWeek === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
              if (itemsForDay.length === 0 && user?.role !== UserRole.Admin) return null; 

              return (
                <Card key={day} title={daysOfWeekGalician[day]} className="min-h-[200px]">
                  {itemsForDay.length > 0 ? (
                      <ul className="space-y-3">
                      {itemsForDay.map(item => (
                          <li key={item.id} className="p-2 rounded-md bg-neutral-light dark:bg-neutral-dark shadow-sm">
                          <p className="font-semibold text-sm text-primary dark:text-accent">{item.title}</p>
                          <p className="text-xs text-neutral-medium dark:text-gray-400">
                              {item.startTime} - {item.endTime} @ {item.location}
                          </p>
                          <p className="text-xs text-neutral-medium dark:text-gray-500">{item.type} {getRelatedName(item) ? `(${getRelatedName(item)})` : ''}</p>
                          </li>
                      ))}
                      </ul>
                  ) : (
                      <p className="text-sm text-center text-neutral-medium dark:text-gray-400 py-4">Non hai actividades programadas para {daysOfWeekGalician[day].toLowerCase()}.</p>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </PageContainer>
    </ErrorBoundary>
  );
};

export default SchedulesPage;
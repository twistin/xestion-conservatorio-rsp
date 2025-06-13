import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import * as dataService from '../services/dataService';
import { ScheduleItem, UserRole, Course, Professor } from '../types';

const StudentSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        const sched = await dataService.getSchedulesByUserId(user.id, UserRole.Student);
        setSchedule(sched);
        // Obtener cursos y profesores relacionados
        const courseIds = Array.from(new Set(sched.map(s => s.courseId).filter(Boolean)));
        const profIds = Array.from(new Set(sched.map(s => s.teacherId).filter(Boolean)));
        // Filtrar ids válidos antes de llamar a getCourseById y getProfessorById
        const courseList = await Promise.all(courseIds.filter(Boolean).map(id => dataService.getCourseById(id!)));
        setCourses(courseList.filter(Boolean) as Course[]);
        const profList = await Promise.all(profIds.filter(Boolean).map(id => dataService.getProfessorById(id!)));
        setProfessors(profList.filter(Boolean) as Professor[]);
      } catch (error) {
        setSchedule([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  return (
    <PageContainer title="Horario e Calendario">
      <Card title="Mi Horario Semanal">
        {isLoading ? (
          <div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>
        ) : schedule.length === 0 ? (
          <p className="text-neutral-medium">No tienes clases programadas.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-medium">
                <th>Asignatura</th>
                <th>Profesor/a</th>
                <th>Día</th>
                <th>Hora</th>
                <th>Aula</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((item, i) => {
                const course = courses.find(c => c.id === item.courseId);
                const prof = professors.find(p => p.id === item.teacherId);
                return (
                  <tr key={item.id || i} className="border-b border-neutral-light">
                    <td>{course?.name || item.title}</td>
                    <td>{prof ? `${prof.firstName} ${prof.lastName}` : '-'}</td>
                    <td>{item.dayOfWeek}</td>
                    <td>{item.startTime} - {item.endTime}</td>
                    <td>{item.location || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </Card>
    </PageContainer>
  );
};

export default StudentSchedulePage;

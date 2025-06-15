import React, { useState, useEffect } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import * as dataService from '../services/dataService';
import { ScheduleItem, UserRole, Course } from '../types';

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

const ProfessorSchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setView] = useState<'semanal'|'diaria'>('semanal');
  const [selectedDay, setSelectedDay] = useState<ScheduleItem['dayOfWeek']>('Monday');
  const [notes, setNotes] = useState<Record<string, string>>({}); // key: scheduleItem.id

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        const sched = await dataService.getSchedulesByUserId(user.id, UserRole.Professor);
        setSchedule(sched);
        // Obtener cursos relacionados
        const courseIds = Array.from(new Set(sched.map(s => s.courseId).filter(Boolean)));
        const courseList = await Promise.all(courseIds.filter(Boolean).map(id => dataService.getCourseById(id!)));
        setCourses(courseList.filter(Boolean) as Course[]);
      } catch (error) {
        setSchedule([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleNoteChange = (id: string, value: string) => {
    setNotes(prev => ({ ...prev, [id]: value }));
  };

  const handleExportPDF = () => {
    // Placeholder: aquí se integraría jsPDF o similar
    alert('Exportación a PDF dispoñible próximamente.');
  };
  const handleExportICS = () => {
    // Placeholder: aquí se integraría ics.js o similar
    alert('Exportación a calendario ICS dispoñible próximamente.');
  };

  const renderScheduleList = (items: ScheduleItem[]) => (
    <ul className="space-y-3">
      {items.map(item => {
        const course = courses.find(c => c.id === item.courseId);
        // Calcular duración en minutos
        const getDuration = (start: string, end: string) => {
          const [h1, m1] = start.split(":").map(Number);
          const [h2, m2] = end.split(":").map(Number);
          const startMins = h1 * 60 + m1;
          const endMins = h2 * 60 + m2;
          return endMins > startMins ? endMins - startMins : 0;
        };
        const duration = getDuration(item.startTime, item.endTime);
        return (
          <li key={item.id} className="p-3 rounded-md bg-neutral-light dark:bg-neutral-dark shadow-sm flex flex-col gap-2 border border-blue-100 dark:border-neutral-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1">
              <span className="font-semibold text-primary dark:text-accent text-base">{item.title || course?.name || 'Sen grupo'}</span>
              <span className="text-xs text-neutral-medium">{item.startTime} - {item.endTime} ({duration} min)</span>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-neutral-medium">
              <span><i className="fa-solid fa-users mr-1"></i><b>Grupo:</b> {course?.name || 'Sen grupo'}</span>
              <span><i className="fa-solid fa-location-dot mr-1"></i><b>Aula:</b> {item.location || 'Sen aula'}</span>
              <span><i className="fa-solid fa-clock mr-1"></i><b>Tipo:</b> {item.type}</span>
            </div>
            <div className="flex flex-col gap-1 mt-1">
              <label htmlFor={`nota-${item.id}`} className="text-xs text-neutral-dark dark:text-neutral-light font-medium">Nota da clase</label>
              <textarea
                id={`nota-${item.id}`}
                className="w-full border border-blue-200 dark:border-neutral-700 rounded p-2 text-xs bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-blue-400"
                placeholder="Exemplo: Exame, traer partitura, repasar escala de Do maior..."
                value={notes[item.id] || ''}
                onChange={e => handleNoteChange(item.id, e.target.value)}
                rows={2}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );

  return (
    <PageContainer title="O Meu Horario" breadcrumbs={[{ label: 'Panel de Control', href: '/dashboard' }, { label: 'O Meu Horario', current: true }]}> 
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant={view==='semanal'?'primary':'outline'} onClick={()=>setView('semanal')}>Vista semanal</Button>
        <Button variant={view==='diaria'?'primary':'outline'} onClick={()=>setView('diaria')}>Vista diaria</Button>
        <Button variant="outline" iconLeft="fa-solid fa-file-pdf" onClick={handleExportPDF}>Exportar PDF</Button>
        <Button variant="outline" iconLeft="fa-solid fa-calendar-plus" onClick={handleExportICS}>Exportar ICS</Button>
      </div>
      {isLoading ? (
        <div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>
      ) : schedule.length === 0 ? (
        <Card title="Horario">
          <p className="text-neutral-medium">Non hai clases programadas.</p>
        </Card>
      ) : (
        <>
          {view === 'semanal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {daysOfWeek.map(day => {
                const itemsForDay = schedule.filter(item => item.dayOfWeek === day).sort((a,b) => a.startTime.localeCompare(b.startTime));
                return (
                  <Card key={day} title={daysOfWeekGalician[day]} className="min-h-[200px]">
                    {itemsForDay.length > 0 ? renderScheduleList(itemsForDay) : (
                      <p className="text-sm text-center text-neutral-medium py-4">Sen clases este día.</p>
                    )}
                  </Card>
                );
              })}
            </div>
          )}
          {view === 'diaria' && (
            <>
              <div className="mb-4 flex gap-2 flex-wrap">
                {daysOfWeek.map(day => (
                  <Button key={day} variant={selectedDay===day?'primary':'outline'} size="sm" onClick={()=>setSelectedDay(day)}>{daysOfWeekGalician[day]}</Button>
                ))}
              </div>
              <Card title={`Clases de ${daysOfWeekGalician[selectedDay]}`}>{
                renderScheduleList(schedule.filter(item => item.dayOfWeek === selectedDay))
              }</Card>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default ProfessorSchedulePage;

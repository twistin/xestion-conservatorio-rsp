
import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { Course, Enrollment, Professor, Grade } from '../types';
import * as dataService from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { ICONS, ROUTES } from '../constants';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const MyCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [grades, setGrades] = useState<Record<string, Grade[]>>({}); 
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const student = await dataService.getStudentByUserId(user.id);
      if (!student) throw new Error("Datos do alumno non atopados");

      const enrollmentsData = await dataService.getEnrollmentsByStudentId(student.id);
      setEnrollments(enrollmentsData);

      const coursePromises = enrollmentsData.map(e => dataService.getCourseById(e.courseId));
      const fetchedCourses = (await Promise.all(coursePromises)).filter(Boolean) as Course[];
      setCourses(fetchedCourses);

      const professorIds = new Set(fetchedCourses.map(c => c.teacherId).filter(Boolean) as string[]);
      const professorPromises = Array.from(professorIds).map(id => dataService.getProfessorById(id));
      const fetchedProfessors = (await Promise.all(professorPromises)).filter(Boolean) as Professor[];
      setProfessors(fetchedProfessors);

      const gradesPromises = enrollmentsData.map(async e => ({
        enrollmentId: e.id,
        grades: await dataService.getGradesByEnrollmentId(e.id)
      }));
      const fetchedGradesArray = await Promise.all(gradesPromises);
      const gradesMap: Record<string, Grade[]> = {};
      fetchedGradesArray.forEach(item => { gradesMap[item.enrollmentId] = item.grades; });
      setGrades(gradesMap);

    } catch (error) {
      console.error("Erro ao obter os cursos do alumno:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const breadcrumbs = [
    { label: 'Panel de Control', href: ROUTES.dashboard },
    { label: 'Os Meus Cursos', current: true },
  ];

  if (isLoading) {
    return <Spinner fullPage message="Cargando os teus cursos..." />;
  }

  const activeEnrollments = enrollments.filter(e => e.status === 'Active');

  return (
    <PageContainer title="Os Meus Cursos Matriculados" breadcrumbs={breadcrumbs}>
      {activeEnrollments.length === 0 ? (
        <EmptyState
          icon={ICONS.courses}
          title="Non hai Cursos Activos"
          description="Actualmente non está matriculado/a en ningún curso activo. Visite a oficina do conservatorio para matricularse."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeEnrollments.map(enrollment => {
            const course = courses.find(c => c.id === enrollment.courseId);
            if (!course) return null;
            const professor = professors.find(p => p.id === course.teacherId);
            const courseGrades = grades[enrollment.id] || [];
            const overallGrade = courseGrades.length > 0 ? (courseGrades.reduce((sum, g) => sum + g.score, 0) / courseGrades.length).toFixed(1) : 'N/D';

            return (
              <Card key={enrollment.id} title={course.name} className="flex flex-col">
                <div className="flex-grow">
                    <p className="text-sm text-neutral-medium dark:text-gray-400 mb-2">{course.description}</p>
                    <p className="text-xs mb-1"><strong className="dark:text-gray-300">Nivel:</strong> {course.level}</p>
                    {professor && <p className="text-xs mb-1"><strong className="dark:text-gray-300">Profesor/a:</strong> {professor.firstName} {professor.lastName}</p>}
                    <p className="text-xs mb-1"><strong className="dark:text-gray-300">Estado:</strong> <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${enrollment.status === 'Active' ? 'bg-secondary/20 text-secondary' : 'bg-neutral-medium/20 text-neutral-medium'}`}>{enrollment.status}</span></p>
                    <p className="text-xs mb-3"><strong className="dark:text-gray-300">Cualificación Media:</strong> {overallGrade}%</p>
                    
                    {courseGrades.length > 0 && (
                        <div className="mb-3">
                            <h4 className="text-xs font-semibold dark:text-gray-300 mb-1">Cualificacións Recentes:</h4>
                            <ul className="text-xs list-disc list-inside pl-1 space-y-0.5">
                                {courseGrades.slice(0,2).map(g => (
                                    <li key={g.id} className="text-neutral-medium dark:text-gray-400">{g.assignmentName}: {g.score}%</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
                <div className="mt-auto pt-3 border-t border-neutral-light dark:border-neutral-medium">
                  <Link to={`${ROUTES.schedules}?courseId=${course.id}`}> 
                    <Button variant="outline" size="sm" className="w-full" iconLeft="fa-solid fa-calendar-alt">Ver Horario</Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
};

export default MyCoursesPage;
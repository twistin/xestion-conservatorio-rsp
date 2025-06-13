import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import * as dataService from '../services/dataService';
import { Professor, Course, Enrollment, Student } from '../types';
import { Link } from 'react-router-dom';

const ProfessorAssignedStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        // 1. Obtener datos del profesor
        const prof = await dataService.getProfessorByUserId(user.id);
        if (!prof) return;
        setProfessor(prof);
        // 2. Obtener cursos asignados
        const profCourses = await dataService.getCourses();
        const assignedCourses = profCourses.filter(c => c.teacherId === prof.id);
        setCourses(assignedCourses);
        // 3. Obtener matrículas de esos cursos
        let allEnrollments: Enrollment[] = [];
        for (const course of assignedCourses) {
          const courseEnrollments = await dataService.getEnrollmentsByCourseId(course.id);
          allEnrollments = allEnrollments.concat(courseEnrollments);
        }
        setEnrollments(allEnrollments);
        // 4. Obtener datos de los estudiantes
        const studentIds = Array.from(new Set(allEnrollments.map(e => e.studentId)));
        const allStudents = await dataService.getStudents();
        setStudents(allStudents.filter(s => studentIds.includes(s.id)));
      } catch (error) {
        setCourses([]);
        setEnrollments([]);
        setStudents([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) return <PageContainer title="Estudiantes Asignados"><div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div></PageContainer>;
  if (!professor) return <PageContainer title="Estudiantes Asignados"><p>No se encontraron datos del profesor.</p></PageContainer>;

  return (
    <PageContainer title="Estudiantes Asignados">
      {courses.length === 0 ? (
        <Card title="Sin cursos asignados">
          <p className="text-neutral-medium">Actualmente no tienes cursos asignados.</p>
        </Card>
      ) : (
        courses.map(course => {
          const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
          const courseStudents = students.filter(s => courseEnrollments.some(e => e.studentId === s.id));
          return (
            <Card key={course.id} title={`Curso: ${course.name}`} className="mb-6">
              {courseStudents.length === 0 ? (
                <p className="text-neutral-medium">No hay estudiantes asignados a este curso.</p>
              ) : (
                <ul className="divide-y divide-neutral-light dark:divide-neutral-medium">
                  {courseStudents.map(student => (
                    <li key={student.id} className="py-3 flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <span className="font-medium text-neutral-dark dark:text-white">{student.firstName} {student.lastName}</span>
                        <span className="ml-2 text-xs text-neutral-medium">{student.email}</span>
                      </div>
                      <div className="flex flex-col md:flex-row md:items-center gap-2 mt-2 md:mt-0">
                        <Link to={`/student-profile?studentId=${student.id}`} className="text-primary underline text-xs">Ver perfil</Link>
                        {/* Espacio para observaciones y ficha de seguimiento */}
                        <span className="text-xs text-neutral-medium">(Observaciones y ficha: próximamente)</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          );
        })
      )}
    </PageContainer>
  );
};

export default ProfessorAssignedStudentsPage;

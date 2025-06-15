import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import * as dataService from '../services/dataService';
import { Professor, Course, Enrollment, Student, Grade, Instrument } from '../types';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const ProfessorAssignedStudentsPage: React.FC = () => {
  const { user } = useAuth();
  const [professor, setProfessor] = useState<Professor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [observations, setObservations] = useState<Record<string, string>>({}); // key: studentId-courseId
  const [obsLoading, setObsLoading] = useState<string | null>(null); // studentId-courseId
  const [obsEdit, setObsEdit] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        const prof = await dataService.getProfessorByUserId(user.id);
        if (!prof) return;
        setProfessor(prof);
        // DEBUG: Mostrar id del profesor
        console.log('ID del profesor autenticado:', prof.id, 'userId:', prof.userId);
        const profCourses = await dataService.getCourses();
        // DEBUG: Mostrar teacherId de los cursos
        console.log('teacherId de los cursos:', profCourses.map(c => c.teacherId));
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
        // Cargar instrumentos
        setInstruments(await dataService.getInstruments());
        // Cargar calificaciones
        let allGrades: Grade[] = [];
        for (const e of allEnrollments) {
          const g = await dataService.getGradesByEnrollmentId(e.id);
          allGrades = allGrades.concat(g);
        }
        setGrades(allGrades);
        // Cargar observaciones existentes
        let obs: Record<string, string> = {};
        for (const e of allEnrollments) {
          const obsList = await dataService.getObservations({student: e.studentId, course: e.courseId, professor: prof.id});
          if (obsList.length > 0) obs[`${e.studentId}-${e.courseId}`] = obsList[0].text;
        }
        setObservations(obs);
      } catch (error) {
        setCourses([]); setEnrollments([]); setStudents([]); setGrades([]); setInstruments([]); setObservations({});
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleObsChange = (studentId: string, courseId: string, value: string) => {
    setObsEdit(prev => ({ ...prev, [`${studentId}-${courseId}`]: value }));
  };

  const handleObsSave = async (studentId: string, courseId: string) => {
    if (!professor) return;
    const key = `${studentId}-${courseId}`;
    setObsLoading(key);
    try {
      const existing = await dataService.getObservations({student: studentId, course: courseId, professor: professor.id});
      if (existing.length > 0) {
        // Update
        await dataService.updateObservation(existing[0].id, { text: obsEdit[key] });
      } else {
        // Create
        await dataService.addObservation({ student: studentId, course: courseId, professor: professor.id, text: obsEdit[key] });
      }
      setObservations(prev => ({ ...prev, [key]: obsEdit[key] }));
    } catch (e) {
      alert('Erro ao gardar observación');
    } finally {
      setObsLoading(null);
    }
  };

  if (isLoading) return <PageContainer title="Alumnado asignado"><div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div></PageContainer>;
  if (!professor) return <PageContainer title="Alumnado asignado"><p>Non se atoparon datos do profesor/a.</p></PageContainer>;

  return (
    <PageContainer title="Alumnado asignado">
      {courses.length === 0 ? (
        <Card title="Sen cursos asignados">
          <p className="text-neutral-medium">Actualmente non tes cursos asignados.</p>
        </Card>
      ) : (
        courses.map(course => {
          const courseEnrollments = enrollments.filter(e => e.courseId === course.id);
          const courseStudents = students.filter(s => courseEnrollments.some(e => e.studentId === s.id));
          return (
            <Card key={course.id} title={`Curso: ${course.name}`} className="mb-6">
              {courseStudents.length === 0 ? (
                <p className="text-neutral-medium">Non hai alumnado asignado a este curso.</p>
              ) : (
                <ul className="divide-y divide-neutral-light dark:divide-neutral-medium">
                  {courseStudents.map(student => {
                    const enrollment = courseEnrollments.find(e => e.studentId === student.id);
                    const studentInstrument = instruments.find(i => i.id === student.instrumentId)?.name || 'N/D';
                    const studentGrades = grades.filter(g => g.enrollmentId === enrollment?.id).slice(-3).reverse();
                    const obsKey = `${student.id}-${course.id}`;
                    return (
                      <li key={student.id} className="py-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1 min-w-[200px]">
                          <div className="font-medium text-neutral-dark dark:text-white text-lg">{student.firstName} {student.lastName}</div>
                          <div className="text-xs text-neutral-medium mb-1">Email: {student.email}</div>
                          <div className="text-xs text-neutral-medium mb-1">Instrumento: {studentInstrument}</div>
                          <div className="text-xs text-neutral-medium mb-1">Grupo: {course.name}</div>
                          <div className="text-xs text-neutral-medium mb-1">Estado matrícula: {enrollment?.status}</div>
                          <div className="text-xs text-neutral-medium mb-1">Teléfono: {student.phoneNumber || <span className='italic'>N/D</span>}</div>
                          {student.emergencyContactName && (
                            <div className="text-xs text-neutral-medium mb-1">Contacto emerxencia: {student.emergencyContactName} ({student.emergencyContactPhone || 'N/D'})</div>
                          )}
                          <Link to={`/student-profile?studentId=${student.id}`} className="text-primary underline text-xs">Ver perfil</Link>
                        </div>
                        <div className="flex-1 min-w-[200px] mt-2 md:mt-0">
                          <div className="font-semibold text-blue-800 dark:text-blue-200 mb-1 text-xs flex items-center gap-2"><i className="fa-solid fa-graduation-cap"></i> Historial académico</div>
                          {studentGrades.length === 0 ? <div className="text-xs text-neutral-medium">Sen cualificacións recentes</div> : (
                            <ul className="text-xs text-neutral-medium space-y-1">
                              {studentGrades.map(g => (
                                <li key={g.id}><b>{g.assignmentName}:</b> {g.score}/100 <span className="text-neutral-light">({new Date(g.dateGiven).toLocaleDateString('gl-ES')})</span> {g.comments && <span className="text-neutral-medium">- {g.comments}</span>}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="flex-1 min-w-[200px] mt-2 md:mt-0">
                          <div className="font-semibold text-emerald-800 dark:text-emerald-200 mb-1 text-xs flex items-center gap-2"><i className="fa-solid fa-notes-medical"></i> Observacións persoais</div>
                          <label htmlFor={`obs-${student.id}-${course.id}`} className="sr-only">Observacións persoais para {student.firstName} {student.lastName} en {course.name}</label>
                          <textarea
                            id={`obs-${student.id}-${course.id}`}
                            name={`obs-${student.id}-${course.id}`}
                            autoComplete="off"
                            className="w-full border border-emerald-200 dark:border-neutral-700 rounded p-2 text-xs bg-white dark:bg-neutral-dark focus:ring-2 focus:ring-emerald-400"
                            rows={3}
                            placeholder="Observacións pedagóxicas, seguimento, incidencias..."
                            value={obsEdit[obsKey] !== undefined ? obsEdit[obsKey] : (observations[obsKey] || '')}
                            onChange={e => handleObsChange(student.id, course.id, e.target.value)}
                          />
                          <div className="flex gap-2 mt-1">
                            <Button size="sm" variant="primary" disabled={obsLoading===obsKey || (obsEdit[obsKey]===observations[obsKey])} onClick={()=>handleObsSave(student.id, course.id)}>
                              {obsLoading===obsKey ? 'Gardando...' : 'Gardar'}
                            </Button>
                            {observations[obsKey] && <span className="text-xs text-neutral-medium">Última actualización gardada</span>}
                          </div>
                        </div>
                      </li>
                    );
                  })}
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

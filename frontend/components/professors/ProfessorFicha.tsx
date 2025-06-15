import React, { useEffect, useState } from 'react';
import { Professor, Course, Enrollment, Student } from '../../types';
import * as dataService from '../../services/dataService';
import { ICONS } from '../../constants';

interface ProfessorFichaProps {
  professor: Professor;
}

const ProfessorFicha: React.FC<ProfessorFichaProps> = ({ professor }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const allCourses = await dataService.getCourses();
        const assignedCourses = allCourses.filter(c => c.teacherId === professor.id);
        setCourses(assignedCourses);
        let allEnrollments: Enrollment[] = [];
        for (const course of assignedCourses) {
          const courseEnrollments = await dataService.getEnrollmentsByCourseId(course.id);
          allEnrollments = allEnrollments.concat(courseEnrollments);
        }
        setEnrollments(allEnrollments);
        const allStudents = await dataService.getStudents();
        setStudents(allStudents.filter(s => allEnrollments.some(e => e.studentId === s.id)));
      } catch (e) {
        setCourses([]); setEnrollments([]); setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [professor.id]);

  return (
    <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-xl p-0 md:p-0 max-w-2xl mx-auto w-full">
      {/* Encabezado con avatar y nome */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-neutral-100 dark:border-neutral-medium bg-gradient-to-r from-emerald-900 via-emerald-700 to-emerald-500 rounded-t-2xl">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl shadow-2xl mb-2" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', border: '4px solid #34d399' }}>
          <span className="font-bold tracking-wide" style={{ color: '#059669' }}>{professor.firstName?.[0]}{professor.lastName?.[0]}</span>
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-1 text-center drop-shadow-lg" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', letterSpacing: '0.02em' }}>{professor.firstName} {professor.lastName}</h2>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">ID: {professor.id}</span>
        </div>
      </div>
      {/* Datos profesionais */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
            <i className="fa-solid fa-envelope text-emerald-400"></i>
            <span className="font-medium">Correo:</span>
            <span className="truncate max-w-[260px] md:max-w-[340px] lg:max-w-[420px] xl:max-w-[520px] 2xl:max-w-[700px]" title={professor.email}>{professor.email || <span className="italic">Non especificado</span>}</span>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
              <i className="fa-solid fa-phone text-emerald-400"></i>
              <span className="font-medium">Teléfono:</span>
              <span>{professor.phoneNumber || <span className="italic">Non especificado</span>}</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
              <i className="fa-solid fa-door-open text-emerald-400"></i>
              <span className="font-medium">Aula(s):</span>
              <span>{professor.classrooms || <span className="italic">Non especificadas</span>}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
            <i className="fa-solid fa-microscope text-emerald-400"></i>
            <span className="font-medium">Especialidade:</span> {professor.specialty || <span className="italic">Non especificada</span>}
          </div>
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
            <i className="fa-solid fa-calendar-days text-emerald-400"></i>
            <span className="font-medium">Contratación:</span> {professor.hireDate ? new Date(professor.hireDate).toLocaleDateString('gl-ES') : <span className="italic">Non especificada</span>}
          </div>
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
            <i className="fa-solid fa-clock text-emerald-400"></i>
            <span className="font-medium">Horario titoría:</span> {professor.tutoringSchedule || <span className="italic">Non especificado</span>}
          </div>
        </div>
      </div>
      {/* Sección: Cursos e alumnado asignado */}
      <div className="px-6 pb-6">
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4">
            <div className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-book-open"></i> Cursos asignados</div>
            {loading ? <div className="text-neutral-medium text-sm">Cargando cursos...</div> : courses.length === 0 ? <div className="text-neutral-medium text-sm">Non hai cursos asignados.</div> :
              <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-1">
                {courses.map(c => <li key={c.id}>{c.name}</li>)}
              </ul>
            }
          </div>
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4">
            <div className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-users"></i> Alumnado asignado</div>
            {loading ? <div className="text-neutral-medium text-sm">Cargando alumnado...</div> : students.length === 0 ? <div className="text-neutral-medium text-sm">Non hai alumnado asignado.</div> :
              <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-1">
                {students.map(s => <li key={s.id}><span className="font-medium text-neutral-dark dark:text-white">{s.firstName} {s.lastName}</span> <span className="ml-2 text-xs text-neutral-medium">{s.email}</span></li>)}
              </ul>
            }
          </div>
        </div>
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4">
            <div className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-clock-rotate-left"></i> Histórico de asignación</div>
            <div className="text-neutral-medium text-sm">(Aquí irá o histórico de cursos e períodos asignados)</div>
          </div>
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4">
            <div className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-user-shield"></i> Xestión de substitucións</div>
            <div className="text-neutral-medium text-sm">(Aquí irá a información sobre substitucións realizadas ou pendentes)</div>
          </div>
        </div>
        <div className="mb-4">
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4">
            <div className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-certificate"></i> Titulacións</div>
            <div className="text-neutral-medium text-sm">(Aquí se mostrarán as titulacións ou formacións do profesor/a)</div>
          </div>
        </div>
        {/* Bloque IA */}
        <div className="mb-4">
          <div className="bg-gradient-to-r from-yellow-50 to-teal-50 rounded-lg shadow-sm p-4">
            <div className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2">
              <i className="fa-solid fa-robot"></i> IA docente
            </div>
            <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-2">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-clock text-blue-400"></i>
                <span><b>Optimización de horarios:</b> Sen recomendacións pendentes</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-balance-scale text-green-500"></i>
                <span><b>Recomendación de carga docente:</b> Carga equilibrada</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-chart-line text-yellow-500"></i>
                <span><b>Análise de rendemento docente:</b> Sen alertas recentes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorFicha;

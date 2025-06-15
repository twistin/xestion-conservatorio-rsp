import React from 'react';
import { Course, Professor } from '../../types';
import { ICONS } from '../../constants';

interface CourseFichaProps {
  course: Course;
  professor?: Professor | null;
  // Puedes añadir más props para alumnado, ocupación, IA, etc.
}

const CourseFicha: React.FC<CourseFichaProps> = ({ course, professor }) => {
  // Placeholders para funcionalidades avanzadas
  return (
    <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow p-6">
      {/* Encabezado */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-neutral-100 dark:border-neutral-medium bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-500 rounded-t-2xl">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl text-blue-800 shadow-2xl mb-2 border-4 border-blue-400 dark:border-blue-700" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif' }}>
          <i className="fa-solid fa-book"></i>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-1 text-center drop-shadow-lg" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', letterSpacing: '0.02em' }}>{course.name}</h2>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">ID: {course.id}</span>
        </div>
      </div>
      {/* Datos do curso */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-layer-group text-purple-400"></i> <span className="font-medium">Nivel:</span> {course.level || <span className="italic">Non especificado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-user-tie text-purple-400"></i> <span className="font-medium">Profesor/a:</span> {professor ? `${professor.firstName} ${professor.lastName}` : <span className="italic">Non asignado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-calendar-day text-purple-400"></i> <span className="font-medium">Inicio:</span> {course.startDate ? new Date(course.startDate).toLocaleDateString() : <span className="italic">Non especificado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-calendar-check text-purple-400"></i> <span className="font-medium">Fin:</span> {course.endDate ? new Date(course.endDate).toLocaleDateString() : <span className="italic">Non especificado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-door-open text-purple-400"></i> <span className="font-medium">Aula:</span> {course.room || <span className="italic">Non especificada</span>}</div>
        </div>
      </div>
      {/* Plan de estudos */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-scroll"></i> Plan de estudos</div>
          <div className="text-neutral-medium text-sm">(Aquí irá o plan de estudos detallado do curso)</div>
        </div>
      </div>
      {/* Alumnado asignado */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-users"></i> Alumnado asignado</div>
          <div className="text-neutral-medium text-sm">(Aquí irá a lista de alumnado matriculado neste curso)</div>
        </div>
      </div>
      {/* Clasificación por nivel */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-signal"></i> Clasificación</div>
          <div className="text-neutral-medium text-sm">{course.level ? course.level : '(Sen clasificar: elemental, profesional, superior...)'}</div>
        </div>
      </div>
      {/* Indicadores de ocupación */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-chart-pie"></i> Ocupación</div>
          <div className="text-neutral-medium text-sm">(Exemplo: 80% de prazas cubertas)</div>
        </div>
      </div>
      {/* Bloque IA */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-purple-50 rounded-lg shadow-sm p-4">
          <div className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-robot"></i> IA para cursos
          </div>
          <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-2">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-lightbulb text-yellow-400"></i>
              <span><b>Suxestións de novos cursos:</b> (Segundo demanda histórica)</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-triangle-exclamation text-red-400"></i>
              <span><b>Detección de baixa eficiencia:</b> (Cursos con poucos alumnos ou alta rotación)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CourseFicha;

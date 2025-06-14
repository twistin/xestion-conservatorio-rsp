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
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-purple-200 flex items-center justify-center text-3xl text-purple-700 shadow-inner">
            <i className="fa-solid fa-book"></i>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-purple-900 mb-1">{course.name}</h2>
          <div className="text-sm text-neutral-medium">ID: {course.id}</div>
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

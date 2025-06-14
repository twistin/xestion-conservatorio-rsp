import React from 'react';
import { Professor } from '../../types';
import { ICONS } from '../../constants';

interface ProfessorFichaProps {
  professor: Professor;
  // Puedes añadir más props para datos de IA, asignaciones, etc.
}

const ProfessorFicha: React.FC<ProfessorFichaProps> = ({ professor }) => {
  // Placeholders para funcionalidades avanzadas
  return (
    <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl shadow p-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-teal-200 flex items-center justify-center text-3xl text-teal-700 shadow-inner">
            <i className="fa-solid fa-chalkboard-user"></i>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-teal-900 mb-1">{professor.firstName} {professor.lastName}</h2>
          <div className="text-sm text-neutral-medium">ID: {professor.id}</div>
        </div>
      </div>
      {/* Datos profesionais */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-envelope text-teal-400"></i> <span className="font-medium">Correo electrónico:</span> {professor.email || <span className="italic">Non especificado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-microscope text-teal-400"></i> <span className="font-medium">Especialidade:</span> {professor.specialty || <span className="italic">Non especificada</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-calendar-days text-teal-400"></i> <span className="font-medium">Data de contratación:</span> {professor.hireDate ? new Date(professor.hireDate).toLocaleDateString() : <span className="italic">Non especificada</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-phone text-teal-400"></i> <span className="font-medium">Teléfono:</span> {professor.phoneNumber || <span className="italic">Non especificado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-door-open text-teal-400"></i> <span className="font-medium">Aula(s):</span> {professor.classrooms || <span className="italic">Non especificadas</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark"><i className="fa-solid fa-clock text-teal-400"></i> <span className="font-medium">Horario de titoría:</span> {professor.tutoringSchedule || <span className="italic">Non especificado</span>}</div>
        </div>
      </div>
      {/* Elementos sugeridos */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-teal-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-clock-rotate-left"></i> Histórico de asignación</div>
          <div className="text-neutral-medium text-sm">(Aquí irá o histórico de cursos e períodos asignados)</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-teal-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-user-shield"></i> Xestión de substitucións</div>
          <div className="text-neutral-medium text-sm">(Aquí irá a información sobre substitucións realizadas ou pendentes)</div>
        </div>
      </div>
      {/* Asignación a cursos e carga horaria */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-teal-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-book-open"></i> Cursos asignados</div>
          <div className="text-neutral-medium text-sm">(Aquí irá a lista de cursos actuais asignados ao profesor/a)</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-teal-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-hourglass-half"></i> Carga horaria</div>
          <div className="text-neutral-medium text-sm">(Exemplo: 18h semanais)</div>
        </div>
      </div>
      {/* Titulacións */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-teal-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-certificate"></i> Titulacións</div>
          <div className="text-neutral-medium text-sm">(Aquí se mostrarán as titulacións ou formacións do profesor/a)</div>
        </div>
      </div>
      {/* Bloque IA */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-yellow-50 to-teal-50 rounded-lg shadow-sm p-4">
          <div className="font-semibold text-teal-800 mb-2 flex items-center gap-2">
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
  );
};

export default ProfessorFicha;

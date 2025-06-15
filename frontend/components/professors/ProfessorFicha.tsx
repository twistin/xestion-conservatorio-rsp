import React from 'react';
import { Professor } from '../../types';
import { ICONS } from '../../constants';

interface ProfessorFichaProps {
  professor: Professor;
  // Puedes añadir más props para datos de IA, asignaciones, etc.
}

const ProfessorFicha: React.FC<ProfessorFichaProps> = ({ professor }) => {
  return (
    <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-xl p-0 md:p-0 max-w-2xl mx-auto w-full">
      {/* Encabezado con avatar y nombre */}
      <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-neutral-100 dark:border-neutral-medium bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-500 rounded-t-2xl">
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl text-blue-800 shadow-2xl mb-2 border-4 border-blue-400 dark:border-blue-700" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif' }}>
          <span className="font-bold tracking-wide">{professor.firstName?.[0]}{professor.lastName?.[0]}</span>
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-1 text-center drop-shadow-lg" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', letterSpacing: '0.02em' }}>{professor.firstName} {professor.lastName}</h2>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">ID: {professor.id}</span>
        </div>
      </div>
      {/* Datos profesionales */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light"><i className="fa-solid fa-envelope text-teal-400"></i> <span className="font-medium">Correo:</span> {professor.email || <span className="italic">Non especificado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light"><i className="fa-solid fa-microscope text-teal-400"></i> <span className="font-medium">Especialidade:</span> {professor.specialty || <span className="italic">Non especificada</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light"><i className="fa-solid fa-calendar-days text-teal-400"></i> <span className="font-medium">Contratación:</span> {professor.hireDate ? new Date(professor.hireDate).toLocaleDateString() : <span className="italic">Non especificada</span>}</div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light"><i className="fa-solid fa-phone text-teal-400"></i> <span className="font-medium">Teléfono:</span> {professor.phoneNumber || <span className="italic">Non especificado</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light"><i className="fa-solid fa-door-open text-teal-400"></i> <span className="font-medium">Aula(s):</span> {professor.classrooms || <span className="italic">Non especificadas</span>}</div>
          <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light"><i className="fa-solid fa-clock text-teal-400"></i> <span className="font-medium">Horario titoría:</span> {professor.tutoringSchedule || <span className="italic">Non especificado</span>}</div>
        </div>
      </div>
      {/* Secciones adicionales */}
      <div className="px-6 pb-6">
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
        <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4">
            <div className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-book-open"></i> Cursos asignados</div>
            <div className="text-neutral-medium text-sm">(Aquí irá a lista de cursos actuais asignados ao profesor/a)</div>
          </div>
          <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4">
            <div className="font-semibold text-teal-800 dark:text-teal-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-hourglass-half"></i> Carga horaria</div>
            <div className="text-neutral-medium text-sm">(Exemplo: 18h semanais)</div>
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

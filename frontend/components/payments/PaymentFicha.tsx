import React from 'react';
import { Student, Payment } from '../../types';
import { ICONS } from '../../constants';

interface PaymentFichaProps {
  student: Student;
  payments: Payment[];
  // Puedes añadir más props para IA, descuentos, etc.
}

const PaymentFicha: React.FC<PaymentFichaProps> = ({ student, payments }) => {
  // Placeholders para funcionalidades avanzadas
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-white rounded-xl shadow p-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6 border-b pb-4">
        <div className="flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-yellow-200 flex items-center justify-center text-3xl text-yellow-700 shadow-inner">
            <i className="fa-solid fa-euro-sign"></i>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-yellow-900 mb-1">Pagamentos de {student.firstName} {student.lastName}</h2>
          <div className="text-sm text-neutral-medium">ID: {student.id}</div>
        </div>
      </div>
      {/* Estado de pagos */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-receipt"></i> Estado de pagos</div>
          <div className="text-neutral-medium text-sm">(Aquí irá o estado de pagos por alumno: ao día, pendente, etc.)</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-file-invoice"></i> Facturas / recibos</div>
          <div className="text-neutral-medium text-sm">(Aquí se mostrarán as facturas emitidas e recibos descargables)</div>
        </div>
      </div>
      {/* Pagos parciais e descontos */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-coins"></i> Pagos parciais</div>
          <div className="text-neutral-medium text-sm">(Aquí irá o rexistro de pagos parciais realizados)</div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-percent"></i> Descontos aplicables</div>
          <div className="text-neutral-medium text-sm">(Exemplo: familia numerosa, matrícula reducida...)</div>
        </div>
      </div>
      {/* Visualización por mensualidades */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-calendar-alt"></i> Visualización por mensualidades</div>
          <div className="text-neutral-medium text-sm">(Aquí se mostrará o estado de pagos mes a mes)</div>
        </div>
      </div>
      {/* Bloque IA */}
      <div className="mb-6">
        <div className="bg-gradient-to-r from-yellow-100 to-yellow-50 rounded-lg shadow-sm p-4">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <i className="fa-solid fa-robot"></i> IA para pagamentos
          </div>
          <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-2">
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-bell text-red-400"></i>
              <span><b>Alertas de impago:</b> (Aviso antes de vencemento)</span>
            </li>
            <li className="flex items-center gap-2">
              <i className="fa-solid fa-chart-line text-green-500"></i>
              <span><b>Proxección de ingresos:</b> (Estimación baseada en pagos históricos)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PaymentFicha;

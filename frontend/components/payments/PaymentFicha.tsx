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
      <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-neutral-100 dark:border-neutral-medium bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-500 rounded-t-2xl">
        <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-4xl text-blue-800 shadow-2xl mb-2 border-4 border-blue-400 dark:border-blue-700" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif' }}>
          <i className="fa-solid fa-euro-sign"></i>
        </div>
        <h2 className="text-3xl font-extrabold text-white mb-1 text-center drop-shadow-lg" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', letterSpacing: '0.02em' }}>
          Pagamentos de {student.firstName} {student.lastName}
        </h2>
        <div className="flex flex-wrap gap-2 justify-center mt-1">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">ID: {student.id}</span>
        </div>
      </div>
      {/* Estado de pagos */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-receipt"></i> Estado de pagos</div>
          <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-1">
            {payments.length === 0 ? (
              <li>Sen rexistros de pagamento</li>
            ) : (
              payments.map(p => (
                <li key={p.id} className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${p.status === 'Paid' ? 'bg-green-100 text-green-700' : p.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.status === 'Paid' ? 'Pagado' : p.status === 'Pending' ? 'Pendente' : 'Vencido'}</span>
                  <span>{p.description} - <b>€{p.amount.toFixed(2).replace('.', ',')}</b></span>
                  {p.paymentDate && <span className="text-xs">({new Date(p.paymentDate).toLocaleDateString()})</span>}
                </li>
              ))
            )}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-file-invoice"></i> Facturas / recibos</div>
          <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-1">
            {payments.filter(p => p.invoiceUrl).length === 0 ? <li>Sen facturas dispoñibles</li> :
              payments.filter(p => p.invoiceUrl).map(p => (
                <li key={p.id}><a href={p.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{p.description} ({new Date(p.dueDate).toLocaleDateString()})</a></li>
              ))}
          </ul>
        </div>
      </div>
      {/* Pagos parciais e descontos */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-coins"></i> Pagos parciais</div>
          <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-1">
            {payments.filter(p => p.amount < 100).length === 0 ? <li>Sen pagos parciais rexistrados</li> :
              payments.filter(p => p.amount < 100).map(p => (
                <li key={p.id}>{p.description} - <b>€{p.amount.toFixed(2).replace('.', ',')}</b> ({p.status === 'Paid' ? 'Pagado' : 'Pendente'})</li>
              ))}
          </ul>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-percent"></i> Descontos aplicables</div>
          <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-1">
            {/* Ejemplo: si hay pagos con descripción de descuento */}
            {payments.some(p => p.description.toLowerCase().includes('desconto')) ? (
              payments.filter(p => p.description.toLowerCase().includes('desconto')).map(p => (
                <li key={p.id}>{p.description} - <b>€{p.amount.toFixed(2).replace('.', ',')}</b></li>
              ))
            ) : <li>Sen descontos aplicados</li>}
          </ul>
        </div>
      </div>
      {/* Visualización por mensualidades */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="font-semibold text-yellow-800 mb-2 flex items-center gap-2"><i className="fa-solid fa-calendar-alt"></i> Visualización por mensualidades</div>
          <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-1">
            {(() => {
              // Agrupar pagos por mes/año
              const pagosPorMes: Record<string, Payment[]> = {};
              payments.forEach(p => {
                const d = new Date(p.dueDate);
                const key = `${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}`;
                if (!pagosPorMes[key]) pagosPorMes[key] = [];
                pagosPorMes[key].push(p);
              });
              const meses = Object.keys(pagosPorMes).sort();
              if (meses.length === 0) return <li>Sen pagos rexistrados por mes</li>;
              return meses.map(m => (
                <li key={m}><b>{m}</b>: {pagosPorMes[m].map(p => `${p.description} (€${p.amount.toFixed(2).replace('.', ',')})`).join(', ')}</li>
              ));
            })()}
          </ul>
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

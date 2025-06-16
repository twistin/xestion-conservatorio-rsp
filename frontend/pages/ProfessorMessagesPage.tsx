import React, { useState, useEffect } from 'react';
import * as dataService from '../services/dataService';
import { Student } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import NotificationsList from '../components/notifications/NotificationsList';

const ProfessorMessagesPage: React.FC = () => {
  // --- Mensaje directo ---
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  // --- Alertas rápidas ---
  const [quickType, setQuickType] = useState<'ausencia'|'nota'|'reunion'|''>('');
  const [quickMsg, setQuickMsg] = useState('');
  const [quickStatus, setQuickStatus] = useState('');
  const [absenceStudent, setAbsenceStudent] = useState('');
  const [absenceLoading, setAbsenceLoading] = useState(false);
  const [absenceError, setAbsenceError] = useState<string|null>(null);

  // --- Chat interno simulado ---
  const [chatMessages, setChatMessages] = useState<{user:string; text:string; role:string;}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatRole, setChatRole] = useState<'Profesorado'|'Administración'>('Profesorado');

  // --- Mensaje IA automático ---
  const [iaAlumno, setIaAlumno] = useState('');
  const [iaMotivo, setIaMotivo] = useState('');
  const [iaMsg, setIaMsg] = useState<string|null>(null);
  const [iaLoading, setIaLoading] = useState(false);
  const [iaError, setIaError] = useState<string|null>(null);

  useEffect(() => {
    dataService.getStudents().then(setStudents);
  }, []);

  // --- Envío de mensaje directo ---
  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !subject || !message) {
      setStatus('Por favor, completa todos los campos.');
      return;
    }
    setStatus('Mensaje enviado correctamente (simulado).');
    setSubject('');
    setMessage('');
    setSelectedStudent('');
  };

  // --- Envío de alerta rápida ---
  const handleQuickAlert = async (type: 'ausencia'|'nota'|'reunion') => {
    setQuickType(type);
    setQuickStatus('');
    setQuickMsg('');
    setAbsenceError(null);
    if (type === 'ausencia') {
      if (!absenceStudent) {
        setAbsenceError('Selecciona un alumno/a para registrar la ausencia.');
        return;
      }
      setAbsenceLoading(true);
      try {
        // Crea una notificación real para la familia del alumno
        await dataService.createNotification({
          titulo: 'Ausencia registrada',
          mensaxe: `Se ha registrado una ausencia para ${students.find(s=>s.id===absenceStudent)?.firstName || ''} ${students.find(s=>s.id===absenceStudent)?.lastName || ''}.`,
          usuario_destino: absenceStudent, // o email si se requiere
          tipo: 'aviso',
        });
        setQuickStatus('Alerta de ausencia enviada correctamente.');
        setQuickMsg('Se ha notificado la ausencia a la familia.');
        setAbsenceStudent('');
      } catch (e:any) {
        setAbsenceError(e.message || 'Error al enviar la notificación.');
      }
      setAbsenceLoading(false);
      setTimeout(() => setQuickStatus(''), 2000);
      return;
    }
    // ...existing code for nota/reunion...
    let msg = '';
    if (type === 'nota') msg = 'Nueva nota/cualificación disponible.';
    if (type === 'reunion') msg = 'Convocatoria de reunión para familias.';
    setQuickMsg(msg);
    setQuickStatus('Enviando...');
    setTimeout(() => {
      setQuickStatus('Alerta enviada correctamente.');
      setTimeout(() => setQuickStatus(''), 2000);
    }, 1200);
  };

  // --- Chat interno simulado ---
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages(msgs => [...msgs, {user: chatRole, text: chatInput, role: chatRole}]);
    setChatInput('');
  };

  // --- Mensaje IA automático ---
  const handleIaMsg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIaLoading(true);
    setIaMsg(null);
    setIaError(null);
    try {
      const res = await dataService.generateFamilyMessageIA(iaMotivo, iaAlumno);
      setIaMsg(res.mensaje);
    } catch {
      setIaError('Error al generar el mensaje IA.');
    } finally {
      setIaLoading(false);
    }
  };

  return (
    <div className="professor-messages-page max-w-3xl mx-auto mt-8 p-4 md:p-6 bg-white dark:bg-neutral-dark rounded shadow communication-form space-y-8">
      <h2 className="text-2xl font-bold mb-2 text-neutral-dark dark:text-white">Comunicación y Alertas</h2>
      {/* --- Panel de alertas rápidas --- */}
      <Card title="Alertas rápidas (familias/alumnado)" className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          <Button variant="outline" onClick={()=>handleQuickAlert('ausencia')} iconLeft="fa-solid fa-user-times" isLoading={absenceLoading}>Ausencia</Button>
          <Button variant="outline" onClick={()=>handleQuickAlert('nota')} iconLeft="fa-solid fa-graduation-cap">Nota</Button>
          <Button variant="outline" onClick={()=>handleQuickAlert('reunion')} iconLeft="fa-solid fa-handshake">Reunión</Button>
        </div>
        {/* Selector de alumno para ausencia */}
        {quickType==='ausencia' && (
          <div className="mb-2">
            <label className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Alumno/a ausente</label>
            <select
              className="w-full border rounded p-2 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border-neutral-300 dark:border-neutral-700"
              value={absenceStudent}
              onChange={e => setAbsenceStudent(e.target.value)}
            >
              <option value="">Selecciona un estudiante...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>
              ))}
            </select>
          </div>
        )}
        {absenceError && <div className="text-red-600 dark:text-red-400 text-xs mt-1">{absenceError}</div>}
        {quickStatus && <div className="text-green-600 dark:text-green-400 text-sm mt-2">{quickStatus}</div>}
        {quickType && quickMsg && <div className="text-neutral-medium text-xs mt-1">({quickMsg})</div>}
        <div className="mt-2 text-xs text-neutral-medium">Envía notificaciones rápidas a familias o alumnado con un solo clic.</div>
      </Card>

      {/* --- Mensaje directo a estudiante/familia --- */}
      <Card title="Enviar mensaje personalizado">
        <form onSubmit={handleSend} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-neutral-dark dark:text-neutral-light">Destinatario</label>
            <select
              className="w-full border rounded p-2 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border-neutral-300 dark:border-neutral-700"
              value={selectedStudent}
              onChange={e => setSelectedStudent(e.target.value)}
            >
              <option value="">Selecciona un estudiante...</option>
              {students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.email})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium text-neutral-dark dark:text-neutral-light">Asunto</label>
            <input
              className="w-full border rounded p-2 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border-neutral-300 dark:border-neutral-700"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="Asunto del mensaje"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium text-neutral-dark dark:text-neutral-light">Mensaje</label>
            <textarea
              className="w-full border rounded p-2 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border-neutral-300 dark:border-neutral-700"
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={5}
              placeholder="Escribe tu mensaje aquí..."
            />
          </div>
          <Button type="submit" variant="primary">Enviar mensaje</Button>
          {status && <div className="mt-2 text-sm text-green-600 dark:text-green-400">{status}</div>}
        </form>
      </Card>

      {/* --- Generador IA de mensajes automáticos --- */}
      <Card title="Generador automático de mensajes a familias (IA)" className="mb-4">
        <form onSubmit={handleIaMsg} className="space-y-3 mb-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input type="text" className="border rounded px-2 py-1" placeholder="Nombre del alumno/a" value={iaAlumno} onChange={e => setIaAlumno(e.target.value)} required />
            <input type="text" className="border rounded px-2 py-1" placeholder="Motivo (ausencia, felicitación, reunión...)" value={iaMotivo} onChange={e => setIaMotivo(e.target.value)} required />
          </div>
          <Button type="submit" variant="primary" disabled={iaLoading || !iaMotivo || !iaAlumno}>
            {iaLoading ? 'Generando...' : 'Generar Mensaje IA'}
          </Button>
        </form>
        {iaError && <div className="p-2 bg-red-50 border border-red-200 rounded text-red-900 mb-2">{iaError}</div>}
        {iaMsg && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded text-blue-900">
            <b>Mensaje generado:</b> {iaMsg}
          </div>
        )}
        <div className="mt-2 text-xs text-neutral-medium">Escribe el nombre del alumno/a y el motivo para obtener un mensaje automático listo para enviar a las familias.</div>
      </Card>

      {/* --- Chat interno simulado --- */}
      <Card title="Chat interno (solo profesorado y administración)" className="mb-4">
        <div className="flex gap-2 mb-2">
          <Button variant={chatRole==='Profesorado'?'primary':'outline'} size="sm" onClick={()=>setChatRole('Profesorado')}>Profesorado</Button>
          <Button variant={chatRole==='Administración'?'primary':'outline'} size="sm" onClick={()=>setChatRole('Administración')}>Administración</Button>
        </div>
        <div className="h-40 overflow-y-auto bg-neutral-light dark:bg-neutral-dark rounded p-2 mb-2 border border-neutral-200 dark:border-neutral-700" aria-live="polite">
          {chatMessages.length === 0 ? <div className="text-neutral-medium text-xs">No hay mensajes aún.</div> :
            chatMessages.map((msg, i) => (
              <div key={i} className={`mb-1 text-xs ${msg.role==='Profesorado' ? 'text-blue-700 dark:text-blue-300' : 'text-green-700 dark:text-green-300'}`}><b>{msg.user}:</b> {msg.text}</div>
            ))
          }
        </div>
        <form onSubmit={handleSendChat} className="flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border-neutral-300 dark:border-neutral-700"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            placeholder={`Mensaje para ${chatRole}`}
            aria-label="Mensaje de chat interno"
          />
          <Button type="submit" variant="primary" size="sm">Enviar</Button>
        </form>
        <div className="mt-2 text-xs text-neutral-medium">Solo visible para profesorado y administración. No es visible para alumnado/familias.</div>
      </Card>

      {/* --- Centro de notificaciones (histórico) --- */}
      <Card title="Histórico de notificaciones y alertas" className="mb-4">
        <NotificationsList />
      </Card>
    </div>
  );
};

export default ProfessorMessagesPage;

import React, { useEffect, useState } from 'react';
import * as dataService from '../../services/dataService';
import { Student, Course } from '../types';
import Button from '../components/ui/Button';

interface AttendanceRecord {
  id: string;
  student: string;
  course: string;
  date: string;
  status: string;
  justification_status: string;
  justification_comment?: string;
  justification_document?: string;
}

const AttendanceJustificationsPage: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      dataService.getAttendance({ justification_status: 'pending' }),
      dataService.getStudents(),
      dataService.getCourses(),
    ]).then(([att, stu, cou]) => {
      setRecords(att);
      setStudents(stu);
      setCourses(cou);
    }).finally(() => setLoading(false));
  }, []);

  const getStudent = (id: string) => students.find(s => s.id === id);
  const getCourse = (id: string) => courses.find(c => c.id === id);

  const handleReview = async (id: string, approve: boolean) => {
    setActionLoading(id);
    setStatusMsg('');
    try {
      await dataService.reviewJustification(id, approve ? 'aprobada' : 'rechazada', comment[id]);
      setRecords(prev => prev.filter(r => r.id !== id));
      setStatusMsg('Justificación actualizada correctamente.');
    } catch (e: any) {
      setStatusMsg(e.message || 'Error al actualizar justificación.');
    }
    setActionLoading(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 bg-white dark:bg-neutral-dark rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-neutral-dark dark:text-neutral-light">Revisión de Justificaciones de Ausencias</h2>
      {statusMsg && <div className="mb-4 text-green-700 dark:text-green-400 whitespace-pre-line">{statusMsg}</div>}
      {loading ? <div>Cargando...</div> : records.length === 0 ? (
        <div className="text-neutral-medium dark:text-neutral-400">No hay justificaciones pendientes.</div>
      ) : (
        <table className="w-full border rounded bg-white dark:bg-neutral-dark border-neutral-200 dark:border-neutral-700">
          <thead>
            <tr>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Alumno/a</th>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Curso</th>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Fecha</th>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Documento</th>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Comentario</th>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Acción</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => {
              const student = getStudent(r.student);
              const course = getCourse(r.course);
              return (
                <tr key={r.id} className="border-t border-neutral-100 dark:border-neutral-700">
                  <td className="p-2 text-neutral-dark dark:text-neutral-light">{student ? `${student.firstName} ${student.lastName}` : r.student}</td>
                  <td className="p-2 text-neutral-dark dark:text-neutral-light">{course ? course.name : r.course}</td>
                  <td className="p-2 text-neutral-dark dark:text-neutral-light">{r.date}</td>
                  <td className="p-2">
                    {r.justification_document ? (
                      <a href={r.justification_document} target="_blank" rel="noopener noreferrer" className="text-blue-700 dark:text-blue-300 underline">Ver documento</a>
                    ) : <span className="text-neutral-medium text-xs">No adjunto</span>}
                  </td>
                  <td className="p-2">
                    <textarea
                      className="w-full border border-neutral-200 dark:border-neutral-700 rounded p-1 text-xs bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light"
                      rows={2}
                      placeholder="Comentario de revisión..."
                      value={comment[r.id] || ''}
                      onChange={e => setComment(prev => ({ ...prev, [r.id]: e.target.value }))}
                    />
                  </td>
                  <td className="p-2 flex flex-col gap-2 min-w-[120px]">
                    <Button size="sm" variant="primary" disabled={actionLoading===r.id} onClick={() => handleReview(r.id, true)}>
                      {actionLoading===r.id ? 'Guardando...' : 'Aprobar'}
                    </Button>
                    <Button size="sm" variant="danger" disabled={actionLoading===r.id} onClick={() => handleReview(r.id, false)}>
                      {actionLoading===r.id ? 'Guardando...' : 'Rechazar'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AttendanceJustificationsPage;

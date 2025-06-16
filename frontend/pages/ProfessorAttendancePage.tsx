import React, { useEffect, useState } from 'react';
import * as dataService from '../../services/dataService';
import { Course, Student, Enrollment } from '../types';
import Button from '../components/ui/Button';

const attendanceStatusOptions = [
  { value: 'present', label: 'Presente' },
  { value: 'absent', label: 'Ausente' },
  { value: 'late', label: 'Tarde' },
  { value: 'justified', label: 'Justificado' },
];

const ProfessorAttendancePage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<Record<string, string>>({});
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string>('');
  const [justificationFiles, setJustificationFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    dataService.getCourses().then(setCourses);
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      dataService.getEnrollmentsByCourseId(selectedCourse).then((enrollments: Enrollment[]) => {
        const studentIds = enrollments.map((e: Enrollment) => e.studentId || (e as any).student);
        dataService.getStudents().then((allStudents: Student[]) => {
          setStudents(allStudents.filter((s: Student) => studentIds.includes(s.id)));
        });
      });
    } else {
      setStudents([]);
    }
  }, [selectedCourse]);

  const handleStatusChange = (studentId: string, value: string) => {
    setAttendance(prev => ({ ...prev, [studentId]: value }));
  };

  const handleFileChange = (studentId: string, file: File | null) => {
    setJustificationFiles(prev => ({ ...prev, [studentId]: file }));
  };

  const handleSave = async () => {
    setLoading(true);
    setStatusMsg('');
    try {
      await Promise.all(students.map(async student => {
        const status = attendance[student.id] || 'present';
        // Crear asistencia
        const attendanceRecord = await dataService.createAttendance({
          student: student.id,
          course: selectedCourse,
          date,
          status,
        });
        // Si es justificado y hay archivo, subirlo
        if (status === 'justified' && justificationFiles[student.id]) {
          try {
            await dataService.uploadJustificationDocument(attendanceRecord.id, justificationFiles[student.id]!);
          } catch (e) {
            // No bloquear el resto, pero mostrar aviso
            setStatusMsg(prev => prev + `\nError al subir justificante de ${student.firstName} ${student.lastName}`);
          }
        }
      }));
      setStatusMsg('Asistencia guardada correctamente.');
    } catch (e: any) {
      setStatusMsg(e.message || 'Error al guardar asistencia.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-4 bg-white dark:bg-neutral-dark rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-neutral-dark dark:text-neutral-light">Registro de Asistencia</h2>
      <div className="mb-4 flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-dark dark:text-neutral-light">Curso</label>
          <select className="input bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border border-neutral-200 dark:border-neutral-700" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
            <option value="">Selecciona un curso...</option>
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-neutral-dark dark:text-neutral-light">Fecha</label>
          <input type="date" className="input bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border border-neutral-200 dark:border-neutral-700" value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <Button onClick={handleSave} isLoading={loading} disabled={!selectedCourse || students.length === 0}>
          Guardar asistencia
        </Button>
      </div>
      {statusMsg && <div className="mb-4 text-green-700 dark:text-green-400 whitespace-pre-line">{statusMsg}</div>}
      {students.length > 0 ? (
        <table className="w-full border rounded bg-white dark:bg-neutral-dark border-neutral-200 dark:border-neutral-700">
          <thead>
            <tr>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Alumno/a</th>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Estado</th>
              <th className="p-2 text-left text-neutral-dark dark:text-neutral-light">Justificante</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id} className="border-t border-neutral-100 dark:border-neutral-700">
                <td className="p-2 text-neutral-dark dark:text-neutral-light">{student.firstName} {student.lastName}</td>
                <td className="p-2">
                  <select
                    className="input bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light border border-neutral-200 dark:border-neutral-700"
                    value={attendance[student.id] || 'present'}
                    onChange={e => handleStatusChange(student.id, e.target.value)}
                  >
                    {attendanceStatusOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </td>
                <td className="p-2">
                  {attendance[student.id] === 'justified' ? (
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="block w-full text-xs text-neutral-dark dark:text-neutral-light bg-white dark:bg-neutral-dark border border-neutral-200 dark:border-neutral-700 rounded"
                      onChange={e => handleFileChange(student.id, e.target.files?.[0] || null)}
                    />
                  ) : (
                    <span className="text-neutral-medium text-xs">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : selectedCourse ? (
        <div className="text-neutral-medium dark:text-neutral-400 mt-4">No hay alumnos asignados a este curso.</div>
      ) : null}
    </div>
  );
};

export default ProfessorAttendancePage;

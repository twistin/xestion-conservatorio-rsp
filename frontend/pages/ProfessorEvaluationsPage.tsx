import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import * as dataService from '../services/dataService';
import { Course, Enrollment, Student, Grade } from '../types';

const EVALUATION_FIELDS = [
  { key: 'tecnica', label: 'Técnica' },
  { key: 'interpretacion', label: 'Interpretación' },
  { key: 'asistencia', label: 'Asistencia' },
];

const TRIMESTRES = ['1º Trimestre', '2º Trimestre', '3º Trimestre'];

const ProfessorEvaluationsPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [editing, setEditing] = useState<Record<string, any>>({});
  const [saving, setSaving] = useState(false);
  const [selectedTrim, setSelectedTrim] = useState(TRIMESTRES[0]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      const profCourses = (await dataService.getCourses()).filter(c => c.teacherId === user.id);
      setCourses(profCourses);
      if (profCourses.length > 0) setSelectedCourse(profCourses[0].id);
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!selectedCourse) return;
      const ens = await dataService.getEnrollmentsByCourseId(selectedCourse);
      setEnrollments(ens);
      const allStudents = await dataService.getStudents();
      setStudents(allStudents.filter(s => ens.some(e => e.studentId === s.id)));
      let allGrades: Grade[] = [];
      for (const e of ens) {
        const g = await dataService.getGradesByEnrollmentId(e.id);
        allGrades = allGrades.concat(g);
      }
      setGrades(allGrades);
    };
    fetchEnrollments();
  }, [selectedCourse]);

  const handleFieldChange = (enrollmentId: string, field: string, value: string) => {
    setEditing(prev => ({ ...prev, [enrollmentId]: { ...prev[enrollmentId], [field]: value } }));
  };

  const handleCommentChange = (enrollmentId: string, value: string) => {
    setEditing(prev => ({ ...prev, [enrollmentId]: { ...prev[enrollmentId], comentario: value } }));
  };

  const handleSave = async (enrollmentId: string) => {
    setSaving(true);
    const edit = editing[enrollmentId];
    try {
      await dataService.addGrade({
        enrollmentId,
        assignmentName: selectedTrim,
        score: Math.round(((+edit.tecnica || 0) + (+edit.interpretacion || 0) + (+edit.asistencia || 0)) / 3),
        tecnica: edit.tecnica,
        interpretacion: edit.interpretacion,
        asistencia: edit.asistencia,
        comments: edit.comentario,
        dateGiven: new Date().toISOString(),
      });
      setEditing(prev => ({ ...prev, [enrollmentId]: {} }));
      // Recargar grades
      const ens = enrollments;
      let allGrades: Grade[] = [];
      for (const e of ens) {
        const g = await dataService.getGradesByEnrollmentId(e.id);
        allGrades = allGrades.concat(g);
      }
      setGrades(allGrades);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateReport = (enrollmentId: string) => {
    alert('Xeración de boletín PDF dispoñible próximamente.');
  };

  const handleSendGrade = (enrollmentId: string) => {
    alert('Envío de cualificación ao alumnado/familia dispoñible próximamente.');
  };

  return (
    <PageContainer title="Xestionar Cualificacións">
      <Card title="Curso" className="mb-4 bg-white dark:bg-neutral-dark">
        <div className="flex flex-wrap gap-2 items-center">
          <span>Selecciona curso:</span>
          <select value={selectedCourse || ''} onChange={e => setSelectedCourse(e.target.value)} className="border rounded px-2 py-1 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light">
            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <span>Trimestre:</span>
          <select value={selectedTrim} onChange={e => setSelectedTrim(e.target.value)} className="border rounded px-2 py-1 bg-white dark:bg-neutral-dark text-neutral-dark dark:text-neutral-light">
            {TRIMESTRES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </Card>
      <Card title="Notas por alumno/a" className="bg-white dark:bg-neutral-dark">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border bg-white dark:bg-neutral-dark">
            <thead className="bg-neutral-light dark:bg-neutral-800">
              <tr>
                <th>Alumno/a</th>
                {EVALUATION_FIELDS.map(f => <th key={f.key}>{f.label}</th>)}
                <th>Comentario</th>
                <th>Accións</th>
              </tr>
            </thead>
            <tbody>
              {enrollments.map(e => {
                const student = students.find(s => s.id === e.studentId);
                const edit = editing[e.id] || {};
                const lastGrade = grades.filter(g => g.enrollmentId === e.id && g.assignmentName === selectedTrim).slice(-1)[0];
                return (
                  <tr key={e.id} className="border-b">
                    <td>{student ? `${student.firstName} ${student.lastName}` : '-'}</td>
                    {EVALUATION_FIELDS.map(f => (
                      <td key={f.key}>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={edit[f.key] !== undefined ? edit[f.key] : (lastGrade && (lastGrade as any)[f.key]) || ''}
                          onChange={ev => handleFieldChange(e.id, f.key, ev.target.value)}
                          className="border rounded px-1 py-0.5 w-16"
                        />
                      </td>
                    ))}
                    <td>
                      <input
                        type="text"
                        value={edit.comentario !== undefined ? edit.comentario : lastGrade?.comments || ''}
                        onChange={ev => handleCommentChange(e.id, ev.target.value)}
                        className="border rounded px-1 py-0.5 w-40"
                        placeholder="Comentario cualitativo"
                      />
                    </td>
                    <td className="flex flex-col gap-1 min-w-[120px]">
                      <Button size="sm" variant="primary" disabled={saving} onClick={() => handleSave(e.id)}>Gardar</Button>
                      <Button size="sm" variant="outline" onClick={() => handleGenerateReport(e.id)} iconLeft="fa-solid fa-file-pdf">Boletín</Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendGrade(e.id)} iconLeft="fa-solid fa-paper-plane">Enviar</Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </PageContainer>
  );
};

export default ProfessorEvaluationsPage;

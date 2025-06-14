import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import StudentForm from '../components/students/StudentForm';
import Modal from '../components/ui/Modal';
import { Student, Instrument, TableColumn, Course, Professor, Enrollment, Grade } from '../types';
import * as dataService from '../services/dataService';
import { ICONS } from '../constants';

// ErrorBoundary local para evitar pantallas en branco
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded text-red-900 text-center">
          <b>Ocurrió un erro inesperado nesta páxina.</b><br />
          Por favor, recarga ou contacta co administrador se persiste.
        </div>
      );
    }
    return this.props.children;
  }
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [showFichaModal, setShowFichaModal] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchStudentsAndInstruments = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsData, instrumentsData] = await Promise.all([
        dataService.getStudents(),
        dataService.getInstruments(),
      ]);
      setStudents(studentsData);
      setInstruments(instrumentsData);
    } catch (error) {
      console.error("Erro ao obter alumnado ou instrumentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentsAndInstruments();
  }, [fetchStudentsAndInstruments]);

  // Alta de estudiante
  const handleSaveStudent = async (studentData: any) => {
    try {
      await dataService.addItem(studentData, 'student');
      setShowAddModal(false);
      // Refrescar lista
      const updated = await dataService.getStudents();
      setStudents(updated);
    } catch (e) {
      alert('Error al crear alumno/a');
    }
  };

  // Baja de estudiante
  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('¿Seguro que deseas dar de baixa este alumno/a?')) return;
    try {
      await dataService.deleteItem(id, 'student');
      setSelectedStudent(null);
      // Refrescar lista
      const updated = await dataService.getStudents();
      setStudents(updated);
    } catch (e) {
      alert('Error al dar de baixa al alumno/a');
    }
  };

  // Edición de estudiante
  const handleEditStudent = (student: Student) => {
    setEditStudent(student);
    setShowEditModal(true);
  };
  const handleUpdateStudent = async (studentData: any) => {
    if (!editStudent) return;
    try {
      await dataService.updateItem({ ...studentData, id: editStudent.id }, 'student');
      setShowEditModal(false);
      setEditStudent(null);
      // Refrescar lista
      const updated = await dataService.getStudents();
      setStudents(updated);
    } catch (e) {
      alert('Error al actualizar alumno/a');
    }
  };

  const columns: TableColumn<Student>[] = [
    { key: 'firstName', header: 'Nome' },
    { key: 'lastName', header: 'Apelidos' },
    { key: 'email', header: 'Correo Electrónico' },
    { 
      key: 'instrumentId', 
      header: 'Instrumento',
      render: (student) => instruments.find(i => i.id === student.instrumentId)?.name || 'N/D'
    },
    { key: 'enrollmentDate', header: 'Data de Matrícula', render: (student) => new Date(student.enrollmentDate).toLocaleDateString('gl-ES') },
    {
      key: 'actions',
      header: 'Accións',
      render: (student) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)} title="Editar">
            <i className={ICONS.edit}></i>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)} className="text-status-red hover:bg-red-100" title="Eliminar">
            <i className={ICONS.delete}></i>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            console.log('CLICK VER FICHA', student);
            setSelectedStudent(student);
            setShowFichaModal(true);
            setTimeout(() => window.scrollTo(0, 0), 100);
          }} title="Ver ficha">
            <i className="fa-solid fa-address-card"></i>
          </Button>
        </div>
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'Alumnado', current: true },
  ];

  // Cargar datos reales al seleccionar estudiante
  useEffect(() => {
    if (!selectedStudent) return;
    let isMounted = true;
    setLoadError(null); // Resetear error al abrir modal
    setStudentDetails(null); // Resetear detalles para mostrar spinner
    setEnrollments([]);
    setCourses([]);
    setProfessors([]);
    setGrades([]);
    setInstrument(null);
    (async () => {
      try {
        console.log('[MODAL] Cargando datos de ficha para', selectedStudent.id);
        const [student, enrollmentsData, allCourses, allProfessors, instr] = await Promise.all([
          dataService.getStudentById(selectedStudent.id).catch(e => {console.error('[MODAL] Error getStudentById', e); throw e;}),
          dataService.getEnrollmentsByStudentId(selectedStudent.id).catch(e => {console.error('[MODAL] Error getEnrollmentsByStudentId', e); throw e;}),
          dataService.getCourses().catch(e => {console.error('[MODAL] Error getCourses', e); throw e;}),
          dataService.getProfessors().catch(e => {console.error('[MODAL] Error getProfessors', e); throw e;}),
          selectedStudent.instrumentId
            ? dataService.getInstrumentById(selectedStudent.instrumentId).catch(e => {
                console.error('[MODAL] Error getInstrumentById', e);
                return null; // Fallback: no interrumpe la ficha si el instrumento no existe
              })
            : Promise.resolve(null)
        ]);
        let allGrades: Grade[] = [];
        if (enrollmentsData.length > 0) {
          const gradesArrays = await Promise.all(enrollmentsData.map(e => dataService.getGradesByEnrollmentId(e.id).catch(err => {console.error('[MODAL] Error getGradesByEnrollmentId', e.id, err); return [];})));
          allGrades = gradesArrays.flat();
        }
        if (!isMounted) return;
        setStudentDetails(student || null);
        setEnrollments(enrollmentsData);
        setCourses(allCourses);
        setProfessors(allProfessors);
        setGrades(allGrades);
        setInstrument(instr || null);
        setLoadError(null);
      } catch (e) {
        console.error('[MODAL] Error cargando ficha:', e);
        setStudentDetails(null);
        setEnrollments([]);
        setCourses([]);
        setProfessors([]);
        setGrades([]);
        setInstrument(null);
        setLoadError('No se pudo cargar la ficha del alumno.');
      }
    })();
    return () => { isMounted = false; };
  }, [selectedStudent]);

  if (isLoading && students.length === 0) { 
      return <Spinner fullPage message="Cargando alumnado..." />;
  }

  return (
    <ErrorBoundary>
      <PageContainer
        title="Xestionar Alumnado"
        breadcrumbs={breadcrumbs}
        headerActions={
          <Button onClick={() => setShowAddModal(true)} iconLeft={ICONS.add}>
            Engadir Alumno/a
          </Button>
        }
      >
        {/* Listado de estudiantes */}
        <Table<Student>
          columns={columns}
          data={students}
          isLoading={isLoading}
          onRowClick={student => {
            setSelectedStudent(student);
            setShowFichaModal(true);
          }}
          searchableKeys={['firstName', 'lastName', 'email']}
        />
        {/* Modal de alta de estudiante */}
        {showAddModal && (
          <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Alta de Estudiante">
            <StudentForm onSave={handleSaveStudent} onCancel={() => setShowAddModal(false)} instruments={instruments} />
          </Modal>
        )}
        {/* Modal de edición de estudiante */}
        {showEditModal && editStudent && (
          <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Editar Estudiante">
            <StudentForm student={editStudent} onSave={handleUpdateStudent} onCancel={() => setShowEditModal(false)} instruments={instruments} />
          </Modal>
        )}
        {/* Ficha individual del estudiante */}
        {showFichaModal && selectedStudent && (
          <Modal isOpen={showFichaModal} onClose={() => { setShowFichaModal(false); setSelectedStudent(null); }} title={studentDetails ? `Ficha de ${studentDetails.firstName} ${studentDetails.lastName}` : loadError ? 'Error al cargar ficha' : 'Cargando ficha...'}>
            {loadError ? (
              <div className="flex flex-col items-center justify-center min-h-[200px] text-red-600">
                <b>{loadError}</b>
                <div className="mt-2 text-xs">Intenta recargar la página o revisa la conexión.</div>
              </div>
            ) : !studentDetails ? (
              <div className="flex flex-col items-center justify-center min-h-[200px]">
                <Spinner message="Cargando datos del alumno..." />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-2">Ficha de {studentDetails.firstName} {studentDetails.lastName}</h2>
                {/* Datos personales */}
                <div className="mb-4">
                  <b>Datos personales:</b>
                  <ul className="text-neutral-medium text-sm ml-4 mt-1">
                    <li>Email: {studentDetails.email || <span className="italic">No especificado</span>}</li>
                    <li>Teléfono: {studentDetails.phoneNumber || <span className="italic">No especificado</span>}</li>
                    <li>Fecha de nacimiento: {studentDetails.dateOfBirth ? new Date(studentDetails.dateOfBirth).toLocaleDateString() : <span className="italic">No especificada</span>}</li>
                    <li>Instrumento: {instrument?.name || <span className="italic">No especificado</span>}</li>
                    <li>Dirección: {studentDetails.address || <span className="italic">No especificada</span>}</li>
                  </ul>
                </div>
                {/* Matrículas activas */}
                <div className="mb-4">
                  <b>Matrículas activas:</b>
                  <ul className="text-neutral-medium text-sm ml-4 mt-1">
                    {enrollments.filter(e => e.status === 'Active').length === 0 ? <li>No hay matrículas activas</li> :
                      enrollments.filter(e => e.status === 'Active').map(e => {
                        const course = courses.find(c => c.id === e.courseId);
                        return <li key={e.id}>{course?.name || 'Curso desconocido'} ({new Date(e.enrollmentDate).toLocaleDateString()})</li>;
                      })}
                  </ul>
                </div>
                {/* Asignación a cursos y profesores */}
                <div className="mb-4">
                  <b>Cursos y profesores asignados:</b>
                  <ul className="text-neutral-medium text-sm ml-4 mt-1">
                    {enrollments.length === 0 ? <li>No hay asignaciones</li> :
                      enrollments.map(e => {
                        const course = courses.find(c => c.id === e.courseId);
                        const prof = course && course.teacherId ? professors.find(p => p.id === course.teacherId) : null;
                        return <li key={e.id}>{course?.name || 'Curso desconocido'} - {prof ? `${prof.firstName} ${prof.lastName}` : 'Profesor/a N/D'}</li>;
                      })}
                  </ul>
                </div>
                {/* Seguimiento del progreso */}
                <div className="mb-4">
                  <b>Seguimiento del progreso:</b>
                  <ul className="text-neutral-medium text-sm ml-4 mt-1">
                    {enrollments.length === 0 ? <li>No hay calificaciones</li> :
                      enrollments.map(e => {
                        const enrollmentGrades = grades.filter(g => g.enrollmentId === e.id);
                        if (enrollmentGrades.length === 0) return <li key={e.id}>Sin calificaciones para {courses.find(c => c.id === e.courseId)?.name || 'curso'}</li>;
                        return (
                          <li key={e.id}>
                            <b>{courses.find(c => c.id === e.courseId)?.name || 'Curso'}:</b>
                            <ul className="ml-4">
                              {enrollmentGrades.slice(0,3).map(g => (
                                <li key={g.id}>{g.assignmentName}: {g.score}/100 ({new Date(g.dateGiven).toLocaleDateString()}) {g.comments && <span>- {g.comments}</span>}</li>
                              ))}
                            </ul>
                          </li>
                        );
                      })}
                  </ul>
                </div>
                {/* Botones de acción */}
                <div className="flex justify-end mt-4">
                  <Button variant="danger" onClick={() => handleDeleteStudent(studentDetails.id)}>Dar de baixa</Button>
                  <Button variant="primary" className="ml-2" onClick={() => handleEditStudent(studentDetails)}>Editar</Button>
                </div>
              </>
            )}
          </Modal>
        )}
      </PageContainer>
    </ErrorBoundary>
  );
};

export default StudentsPage;
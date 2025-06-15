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
              <div className="bg-white dark:bg-neutral-dark rounded-2xl shadow-xl p-0 md:p-0 max-w-[700px] mx-auto w-full">
                {/* Encabezado con avatar y nombre */}
                <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-neutral-100 dark:border-neutral-medium bg-gradient-to-r from-indigo-900 via-blue-800 to-blue-500 rounded-t-2xl">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl text-blue-800 shadow-2xl mb-2 border-4 border-blue-400 dark:border-blue-700" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif' }}>
                    <span className="font-bold tracking-wide">{studentDetails.firstName?.[0]}{studentDetails.lastName?.[0]}</span>
                  </div>
                  <h2 className="text-4xl font-extrabold text-white mb-1 text-center drop-shadow-lg" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', letterSpacing: '0.02em' }}>{studentDetails.firstName} {studentDetails.lastName}</h2>
                  <div className="flex flex-wrap gap-2 justify-center mt-1">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">ID: {studentDetails.id}</span>
                  </div>
                </div>
                {/* Datos personales y académicos */}
                <div className="p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-envelope text-blue-400"></i> <span className="font-medium">Correo:</span>
                    <span className="whitespace-nowrap overflow-x-auto max-w-full" style={{wordBreak:'keep-all'}}>{studentDetails.email || <span className="italic">Non especificado</span>}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-phone text-blue-400"></i> <span className="font-medium">Teléfono:</span>
                    <span className="whitespace-nowrap overflow-x-auto max-w-full" style={{wordBreak:'keep-all'}}>{studentDetails.phoneNumber || <span className="italic">Non especificado</span>}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-cake-candles text-blue-400"></i> <span className="font-medium">Nascimento:</span> {studentDetails.dateOfBirth ? new Date(studentDetails.dateOfBirth).toLocaleDateString() : <span className="italic">Non especificada</span>}
                  </div>
                  <div className="flex items-start gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-location-dot text-blue-400 mt-1"></i> <span className="font-medium">Enderezo:</span>
                    <span className="whitespace-normal break-words max-w-full">{studentDetails.address || <span className="italic">Non especificado</span>}</span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-music text-purple-400"></i> <span className="font-medium">Instrumento:</span> {instrument?.name || <span className="italic">Non especificado</span>}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-calendar-check text-green-400"></i> <span className="font-medium">Matrícula:</span> {studentDetails.enrollmentDate ? new Date(studentDetails.enrollmentDate).toLocaleDateString() : <span className="italic">N/D</span>}
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-graduation-cap text-blue-400"></i> <span className="font-medium">Cursos activos:</span> {enrollments.filter(e => e.status === 'Active').length}
                  </div>
                  <div className="flex items-start gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-user-tie text-teal-400 mt-1"></i> <span className="font-medium">Profesorado:</span>
                    <span className="flex flex-wrap gap-2">
                      {professors.length > 0 ? professors.map((p, idx) => (
                        <span key={p.id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs font-semibold">{p.firstName} {p.lastName}{idx < professors.length-1 ? ',' : ''}</span>
                      )) : <span className="italic">N/D</span>}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-neutral-dark dark:text-neutral-light">
                    <i className="fa-solid fa-certificate text-yellow-400"></i> <span className="font-medium">Nivel:</span> {courses.length > 0 ? courses[0].level : <span className="italic">N/D</span>}
                  </div>
                </div>
                {/* Secciones adicionales: Matrículas, Progreso, IA, etc. */}
                <div className="px-6 pb-6 flex flex-col gap-8">
                  <div className="mb-0">
                    <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-graduation-cap"></i> Matrículas activas</div>
                    <ul className="text-neutral-medium text-sm ml-4 mt-2 list-disc space-y-1">
                      {enrollments.filter(e => e.status === 'Active').length === 0 ? <li>Non hai matrículas activas</li> :
                        enrollments.filter(e => e.status === 'Active').map(e => {
                          const course = courses.find(c => c.id === e.courseId);
                          return <li key={e.id}>{course?.name || 'Curso descoñecido'} <span className="text-xs text-neutral-medium">({new Date(e.enrollmentDate).toLocaleDateString()})</span></li>;
                        })}
                    </ul>
                  </div>
                  <div className="mb-0">
                    <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-chalkboard-user"></i> Cursos e profesorado asignado</div>
                    <ul className="text-neutral-medium text-sm ml-4 mt-2 list-disc space-y-1">
                      {enrollments.length === 0 ? <li>Non hai asignacións</li> :
                        enrollments.map(e => {
                          const course = courses.find(c => c.id === e.courseId);
                          const prof = course && course.teacherId ? professors.find(p => p.id === course.teacherId) : null;
                          return <li key={e.id}>{course?.name || 'Curso descoñecido'} - {prof ? `${prof.firstName} ${prof.lastName}` : 'Profesor/a N/D'}</li>;
                        })}
                    </ul>
                  </div>
                  <div className="mb-0">
                    <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2"><i className="fa-solid fa-chart-line"></i> Seguimento do progreso</div>
                    <ul className="text-neutral-medium text-sm ml-4 mt-2 list-disc space-y-2">
                      {enrollments.length === 0 ? <li>Non hai cualificacións</li> :
                        enrollments.map(e => {
                          const enrollmentGrades = grades.filter(g => g.enrollmentId === e.id);
                          if (enrollmentGrades.length === 0) return <li key={e.id}>Sen cualificacións para {courses.find(c => c.id === e.courseId)?.name || 'curso'}</li>;
                          return (
                            <li key={e.id} className="mb-2">
                              <b>{courses.find(c => c.id === e.courseId)?.name || 'Curso'}:</b>
                              <ul className="ml-4 space-y-1">
                                {enrollmentGrades.slice(0,3).map(g => (
                                  <li key={g.id} className="flex items-center gap-2">
                                    <i className="fa-solid fa-star text-yellow-400"></i>
                                    <span>{g.assignmentName}: <b>{g.score}/100</b> <span className="text-xs text-neutral-medium">({new Date(g.dateGiven).toLocaleDateString()})</span> {g.comments && <span className="text-xs text-neutral-medium">- {g.comments}</span>}</span>
                                  </li>
                                ))}
                              </ul>
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                  {/* IA educativa */}
                  <div className="mb-0">
                    <div className="bg-gradient-to-r from-yellow-50 to-blue-50 rounded-lg shadow-sm p-4 flex flex-col gap-2">
                      <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                        <i className="fa-solid fa-robot"></i> IA educativa
                      </div>
                      <ul className="text-neutral-medium text-sm ml-2 mt-1 space-y-2">
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-person-walking-arrow-right text-red-400"></i>
                          <span><b>Predición de abandono:</b> <span className="text-red-600 font-semibold">Baixo risco</span></span>
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-route text-green-500"></i>
                          <span><b>Suxestións de itinerario:</b> Proponse continuar con "Grao Profesional" en Piano</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i>
                          <span><b>Alertas:</b> Sen incidencias recentes</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* Estado de pagos/documentación */}
                  <div className="mb-0 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-neutral-dark rounded-lg shadow-sm p-4 flex flex-col gap-2">
                      <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2 whitespace-normal break-words">
                        <i className="fa-solid fa-file-invoice-dollar"></i> <span>Estado de pagos / documentación</span>
                      </div>
                      <div className="flex flex-col gap-1 text-sm">
                        <span className="flex items-center gap-2"><i className="fa-solid fa-circle-check text-green-500"></i> Pagos ao día</span>
                        <span className="flex items-center gap-2"><i className="fa-solid fa-file-circle-check text-green-500"></i> Documentación completa</span>
                      </div>
                    </div>
                    <div></div>
                  </div>
                  {/* Botones de acción */}
                  <div className="flex flex-col md:flex-row justify-end gap-2 mt-8 border-t pt-6">
                    <Button variant="danger" onClick={() => handleDeleteStudent(studentDetails.id)}>
                      <i className="fa-solid fa-user-xmark mr-2"></i> Dar de baixa
                    </Button>
                    <Button variant="primary" className="ml-0 md:ml-2" onClick={() => {
                      setShowFichaModal(false);
                      handleEditStudent(studentDetails);
                    }}>
                      <i className="fa-solid fa-pen-to-square mr-2"></i> Editar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        )}
      </PageContainer>
    </ErrorBoundary>
  );
};

export default StudentsPage;
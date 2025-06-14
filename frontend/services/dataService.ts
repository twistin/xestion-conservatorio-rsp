import { Student, Professor, Course, Instrument, Enrollment, Grade, ScheduleItem, User, UserRole, AttendanceRecord, EnrollmentStatus, Notification } from '../types';
import { mockStudents, mockProfessors, mockCourses, mockEnrollments, mockGrades, mockSchedules, mockUsers, mockAttendance } from './mockData';

// Simulate API delay
const API_DELAY = 100; // Reduced delay for quicker UI updates

const simulateApiCall = <T,>(data: T): Promise<T> => {
  return new Promise(resolve => setTimeout(() => resolve(data), API_DELAY));
};

// Users
export const getUsers = async (role?: UserRole): Promise<User[]> => {
  let users = mockUsers;
  if (role) {
    users = users.filter(u => u.role === role);
  }
  return simulateApiCall(users);
};
export const getUserById = async (id: string): Promise<User | undefined> => 
  simulateApiCall(mockUsers.find(u => u.id === id));


// === ALUMNADO: USAR BACKEND REAL ===
const API_BASE = (import.meta as any).env.VITE_API_URL || 'https://xestion-conservatorio-rsp.onrender.com/api';

function studentFromApi(apiStudent: any): Student {
  return {
    id: apiStudent.id,
    userId: apiStudent.user_id,
    firstName: apiStudent.first_name,
    lastName: apiStudent.last_name,
    email: apiStudent.email,
    dateOfBirth: apiStudent.date_of_birth,
    instrumentId: apiStudent.instrument_id,
    enrollmentDate: apiStudent.enrollment_date,
    address: apiStudent.address,
    phoneNumber: apiStudent.phone_number,
  };
}

export const getStudents = async (): Promise<Student[]> => {
  const res = await fetch(`${API_BASE}/students/`);
  if (!res.ok) throw new Error('Error al obtener alumnado');
  const data = await res.json();
  return data.map(studentFromApi);
};

export const getStudentById = async (id: string): Promise<Student | undefined> => {
  const res = await fetch(`${API_BASE}/students/${id}/`);
  if (!res.ok) throw new Error('Error al obtener alumno/a');
  const data = await res.json();
  return studentFromApi(data);
};

export const getStudentByUserId = async (userId: string): Promise<Student | undefined> => {
  const res = await fetch(`${API_BASE}/students/by_user/${userId}/`);
  if (!res.ok) throw new Error('Error al obtener alumno/a por userId');
  const data = await res.json();
  return studentFromApi(data);
};


// === PROFESORADO: USAR BACKEND REAL ===
function professorFromApi(apiProfessor: any): Professor {
  return {
    id: apiProfessor.id,
    userId: apiProfessor.user_id,
    specialty: apiProfessor.specialty,
    hireDate: apiProfessor.hire_date,
    phoneNumber: apiProfessor.phone_number,
    tutoringSchedule: apiProfessor.tutoring_schedule,
    classrooms: apiProfessor.classrooms,
    firstName: apiProfessor.first_name,
    lastName: apiProfessor.last_name,
    email: apiProfessor.email,
  };
}

export const getProfessors = async (): Promise<Professor[]> => {
  const res = await fetch(`${API_BASE}/professors/`);
  if (!res.ok) throw new Error('Error al obtener profesorado');
  const data = await res.json();
  return data.map(professorFromApi);
};

export const getProfessorById = async (id: string): Promise<Professor | undefined> => {
  const res = await fetch(`${API_BASE}/professors/${id}/`);
  if (!res.ok) throw new Error('Error al obtener profesor/a');
  const data = await res.json();
  return professorFromApi(data);
};

// Forzar uso de mock para profesores (pruebas)
export const getProfessorByUserId = async (userId: string): Promise<Professor | undefined> => {
  // Buscar por userId y por id (para máxima compatibilidad en pruebas)
  return simulateApiCall(
    mockProfessors.find(p => p.userId === userId || p.id === userId)
  );
};


// Instruments
export const getInstruments = async (): Promise<Instrument[]> => {
  const res = await fetch(`${API_BASE}/instruments/`);
  if (!res.ok) throw new Error('Error al obtener instrumentos');
  return res.json();
};
export const getInstrumentById = async (id: string): Promise<Instrument | undefined> => {
  const res = await fetch(`${API_BASE}/instruments/${id}/`);
  if (!res.ok) throw new Error('Error al obtener instrumento');
  return res.json();
};

// === CURSOS: USAR BACKEND REAL ===
export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch(`${API_BASE}/courses/`);
  if (!res.ok) throw new Error('Error al obtener cursos');
  return res.json();
};

export const getCourseById = async (id: string): Promise<Course | undefined> => {
  const res = await fetch(`${API_BASE}/courses/${id}/`);
  if (!res.ok) throw new Error('Error al obtener curso');
  return res.json();
};

export const getCoursesByTeacherId = async (teacherId: string): Promise<Course[]> =>
  simulateApiCall(mockCourses.filter(c => c.teacherId === teacherId));


// === PAGOS: USAR BACKEND REAL ===
function paymentFromApi(apiPayment: any): Payment {
  return {
    id: apiPayment.id,
    studentId: apiPayment.student, // Es el id del alumno (clave foránea)
    amount: apiPayment.amount,
    paymentDate: apiPayment.payment_date,
    dueDate: apiPayment.due_date,
    status: apiPayment.status,
    description: apiPayment.description,
    invoiceUrl: apiPayment.invoice_url,
  };
}

export const getAllPayments = async (): Promise<Payment[]> => {
  const res = await fetch(`${API_BASE}/payments/`);
  if (!res.ok) throw new Error('Error al obtener pagos');
  const data = await res.json();
  return data.map(paymentFromApi);
};

export const getPaymentsByStudentId = async (studentId: string): Promise<Payment[]> => {
  const all = await getAllPayments();
  return all.filter(p => p.studentId === studentId);
};

export const updatePayment = async (payment: Payment): Promise<Payment> => {
  const snakeCasePayment = {
    student: payment.studentId,
    amount: payment.amount,
    payment_date: payment.paymentDate,
    due_date: payment.dueDate,
    status: payment.status,
    description: payment.description,
    invoice_url: payment.invoiceUrl,
  };
  const res = await fetch(`${API_BASE}/payments/${payment.id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snakeCasePayment)
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return paymentFromApi(await res.json());
};


// Enrollments
export const getAllEnrollments = async (): Promise<Enrollment[]> => {
  const res = await fetch(`${API_BASE}/enrollments/`);
  if (!res.ok) throw new Error('Error al obtener matrículas');
  return res.json();
};

export const getEnrollments = async (): Promise<Enrollment[]> => simulateApiCall(mockEnrollments);
export const getEnrollmentsByStudentId = async (studentId: string): Promise<Enrollment[]> =>
  simulateApiCall(mockEnrollments.filter(e => e.studentId === studentId));
export const getEnrollmentsByCourseId = async (courseId: string): Promise<Enrollment[]> =>
  simulateApiCall(mockEnrollments.filter(e => e.courseId === courseId));


// Grades
export const addGrade = async (grade: Omit<Grade, 'id'>): Promise<Grade> => {
  // Simulación: asignar un id único y añadir a mockGrades
  const newGrade: Grade = {
    id: `grade-${Date.now()}`,
    ...grade,
  };
  mockGrades.push(newGrade);
  return simulateApiCall(newGrade);
};

export const getGradesByEnrollmentId = async (enrollmentId: string): Promise<Grade[]> =>
  simulateApiCall(mockGrades.filter(g => g.enrollmentId === enrollmentId));


// Schedules
export const getSchedules = async (): Promise<ScheduleItem[]> => simulateApiCall(mockSchedules);
export const getSchedulesByUserId = async (userId: string, userRole: UserRole): Promise<ScheduleItem[]> => {
  const user = await getUserById(userId);
  if (!user) return simulateApiCall([]);

  if (userRole === UserRole.Student) {
    const student = await getStudentByUserId(userId);
    if (!student) return simulateApiCall([]);
    return simulateApiCall(mockSchedules.filter(s => s.studentId === student.id || (s.relatedUserIds && s.relatedUserIds.includes(student.id)) || (s.type === 'Course' && mockEnrollments.some(e => e.studentId === student.id && e.courseId === s.courseId))));
  }
  if (userRole === UserRole.Professor) {
     const professor = await getProfessorByUserId(userId);
    if (!professor) return simulateApiCall([]);
    return simulateApiCall(mockSchedules.filter(s => s.teacherId === professor.id || (s.relatedUserIds && s.relatedUserIds.includes(professor.id))));
  }
  return simulateApiCall([]); 
};
export const getAllSchedules = async (): Promise<ScheduleItem[]> => simulateApiCall(mockSchedules);

// Attendance
export const getAttendanceByEnrollmentId = async (enrollmentId: string): Promise<AttendanceRecord[]> =>
  simulateApiCall(mockAttendance.filter(a => a.enrollmentId === enrollmentId));


// Generic add/update/delete
export const addItem = async <T extends {id?: string}>(item: Omit<T, 'id'>, type: string): Promise<T> => {
  if (type === 'student') {
    // Solo los campos requeridos y en snake_case
    const snakeCaseStudent: any = {
      user_id: (item as any).user_id || (item as any).userId,
      first_name: (item as any).first_name || (item as any).firstName,
      last_name: (item as any).last_name || (item as any).lastName,
      email: (item as any).email,
      date_of_birth: (item as any).date_of_birth || (item as any).dateOfBirth,
      instrument_id: (item as any).instrument_id || (item as any).instrumentId,
      enrollment_date: (item as any).enrollment_date || (item as any).enrollmentDate,
    };
    if ((item as any).address) snakeCaseStudent.address = (item as any).address;
    if ((item as any).phone_number || (item as any).phoneNumber) snakeCaseStudent.phone_number = (item as any).phone_number || (item as any).phoneNumber;
    Object.keys(snakeCaseStudent).forEach(key => {
      if (snakeCaseStudent[key] === undefined || snakeCaseStudent[key] === null || snakeCaseStudent[key] === '') {
        delete snakeCaseStudent[key];
      }
    });
    const res = await fetch(`${API_BASE}/students/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeCaseStudent)
    });
    if (!res.ok) throw new Error('Error al crear alumno/a');
    return res.json();
  }
  if (type === 'professor') {
    // Asegurar campos obligatorios
    const userId = (item as any).userId || `user-prof-${Date.now()}`;
    const snakeCaseProfessor = {
      user_id: userId,
      first_name: (item as any).firstName,
      last_name: (item as any).lastName,
      email: (item as any).email,
      specialty: (item as any).specialty,
      hire_date: (item as any).hireDate,
      phone_number: (item as any).phoneNumber,
      tutoring_schedule: (item as any).tutoringSchedule,
      classrooms: (item as any).classrooms,
    };
    const res = await fetch(`${API_BASE}/professors/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeCaseProfessor)
    });
    if (!res.ok) throw new Error('Error al crear profesor/a');
    return professorFromApi(await res.json()) as any;
  }
  if (type === 'course') {
    // Transformar teacherId a teacher para el backend
    const snakeCaseCourse = {
      ...item,
      teacher: (item as any).teacherId || null,
    };
    delete (snakeCaseCourse as any).teacherId;
    const res = await fetch(`${API_BASE}/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeCaseCourse)
    });
    if (!res.ok) throw new Error('Error al crear curso');
    return res.json();
  }
  if (type === 'payment') {
    const res = await fetch(`${API_BASE}/payments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Error al crear pago');
    return res.json();
  }
  // ...existing code for other types...
  throw new Error('Tipo no soportado en addItem');
};

// === ACTIVIDADES ARTÍSTICAS (mock, adaptar a backend real) ===
const mockActivities: any[] = [];

export function getActivities(type?: string): Promise<any[]> {
  if (type) {
    return simulateApiCall(mockActivities.filter(a => a.type === type));
  }
  return simulateApiCall(mockActivities);
}

export function addActivity(activity: any): Promise<any> {
  const newActivity = {
    id: `activity-${Date.now()}`,
    ...activity,
    fileUrl: activity.file ? activity.file.name : undefined,
  };
  mockActivities.unshift(newActivity);
  return simulateApiCall(newActivity);
}

export const updateItem = async <T extends {id: string}>(item: T, type: string): Promise<T> => {
  if (type === 'student') {
    const res = await fetch(`${API_BASE}/students/${item.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Error al actualizar alumno/a');
    return res.json();
  }
  if (type === 'professor') {
    const snakeCaseProfessor = {
      user_id: (item as any).userId,
      first_name: (item as any).firstName,
      last_name: (item as any).lastName,
      email: (item as any).email,
      specialty: (item as any).specialty,
      hire_date: (item as any).hireDate,
      phone_number: (item as any).phoneNumber,
      tutoring_schedule: (item as any).tutoringSchedule,
      classrooms: (item as any).classrooms,
    };
    const res = await fetch(`${API_BASE}/professors/${(item as any).id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeCaseProfessor)
    });
    if (!res.ok) throw new Error('Error al actualizar profesor/a');
    return professorFromApi(await res.json()) as any;
  }
  if (type === 'course') {
    // Transformar teacherId a teacher para el backend
    const snakeCaseCourse = {
      ...item,
      teacher: (item as any).teacherId || null,
    };
    delete (snakeCaseCourse as any).teacherId;
    const res = await fetch(`${API_BASE}/courses/${(item as any).id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(snakeCaseCourse)
    });
    if (!res.ok) throw new Error('Error al actualizar curso');
    return res.json();
  }
  if (type === 'payment') {
    const res = await fetch(`${API_BASE}/payments/${item.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
    });
    if (!res.ok) throw new Error('Error al actualizar pago');
    return res.json();
  }
  // ...existing code for other types...
  throw new Error('Tipo no soportado en updateItem');
};

export const deleteItem = async (id: string, type: string): Promise<void> => {
  if (type === 'student') {
    const res = await fetch(`${API_BASE}/students/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar alumno/a');
    return;
  }
  if (type === 'professor') {
    const res = await fetch(`${API_BASE}/professors/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar profesor/a');
    return;
  }
  if (type === 'course') {
    const res = await fetch(`${API_BASE}/courses/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar curso');
    return;
  }
  if (type === 'payment') {
    const res = await fetch(`${API_BASE}/payments/${id}/`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Error al eliminar pago');
    return;
  }
  // ...existing code for other types...
  throw new Error('Tipo no soportado en deleteItem');
};

export const getDashboardMetrics = async (role: UserRole, userId: string) => {
  if (role === UserRole.Admin) {
    // Obtener datos reales del backend
    const [students, professors, courses, enrollments] = await Promise.all([
      getStudents(),
      getProfessors(),
      getCourses(),
      getAllEnrollments()
    ]);
    const now = new Date();
    // Cursos activos: sin fecha de fin o fecha de fin en el futuro
    const activeCourses = courses.filter((c: any) => !c.endDate || new Date(c.endDate) > now).length;
    // Matrículas recientes (últimas 5)
    const recentEnrollments = enrollments
      .sort((a: any, b: any) => new Date(b.enrollmentDate || b.enrollment_date).getTime() - new Date(a.enrollmentDate || a.enrollment_date).getTime())
      .slice(0, 5)
      .map((e: any) => {
        const student = students.find((s: any) => s.id === e.studentId || s.id === e.student);
        const course = courses.find((c: any) => c.id === e.courseId || c.id === e.course);
        return `Alumno/a ${student?.firstName || ''} matriculouse en ${course?.name || ''}`;
      });
    return {
      totalStudents: students.length,
      totalProfessors: professors.length,
      activeCourses,
      totalPayments: 0, // No hay pagos en mock
      recentEnrollments
    };
  }
  if (role === UserRole.Professor) {
    // Buscar el profesor por userId y obtener su id real
    const professor = mockProfessors.find(p => p.userId === userId || p.id === userId);
    if (!professor) return simulateApiCall(null);
    // Cursos asignados por id real
    const assignedCourses = mockCourses.filter(c => c.teacherId === professor.id);
    // Alumnado impartido: alumnos únicos en matrículas de esos cursos
    const studentsInCourses = new Set<string>();
    assignedCourses.forEach(course => {
      mockEnrollments.filter(e => e.courseId === course.id && e.status === EnrollmentStatus.Active).forEach(e => studentsInCourses.add(e.studentId));
    });
    // Clases hoy: buscar en mockSchedules por teacherId y día de la semana
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayNormalized = today.charAt(0).toUpperCase() + today.slice(1).toLowerCase();
    const upcomingClassesToday = mockSchedules.filter(s => s.teacherId === professor.id && s.dayOfWeek.toLowerCase() === todayNormalized.toLowerCase()).length;
    return simulateApiCall({
      assignedCoursesCount: assignedCourses.length,
      totalStudentsTaught: studentsInCourses.size,
      upcomingClassesToday
    });
  }
   if (role === UserRole.Student) {
    const student = mockStudents.find(s => s.userId === userId);
    if (!student) return simulateApiCall(null);
    const enrolledCourses = mockEnrollments.filter(e => e.studentId === student.id && e.status === EnrollmentStatus.Active).length;
    // Simplificado: Necesitaría una lógica más robusta para "próximas tareas" reales
    const upcomingAssignments = mockGrades.filter(g => mockEnrollments.some(e => e.id === g.enrollmentId && e.studentId === student.id && e.status === EnrollmentStatus.Active) && new Date(g.dateGiven) > new Date()).length; 
     return simulateApiCall({
        enrolledCourses,
        pendingPayments: 0, // No hay pagos en mock
        upcomingAssignments
    });
  }
  return simulateApiCall(null);
};

// Observaciones pedagógicas (backend real)
export interface Observation {
  id: number;
  student: string; // id
  course: string; // id
  professor: string; // id
  date: string;
  text: string;
}

export const getObservations = async (filters: {student?: string, course?: string, professor?: string} = {}): Promise<Observation[]> => {
  const params = new URLSearchParams();
  if (filters.student) params.append('student', filters.student);
  if (filters.course) params.append('course', filters.course);
  if (filters.professor) params.append('professor', filters.professor);
  const res = await fetch(`${API_BASE}/observations/?${params.toString()}`);
  if (!res.ok) throw new Error('Error al obtener observaciones');
  return res.json();
};

export const addObservation = async (observation: Omit<Observation, 'id' | 'date'>): Promise<Observation> => {
  const res = await fetch(`${API_BASE}/observations/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(observation)
  });
  if (!res.ok) throw new Error('Error al crear observación');
  return res.json();
};

export const updateObservation = async (id: number, observation: Partial<Observation>): Promise<Observation> => {
  const res = await fetch(`${API_BASE}/observations/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(observation)
  });
  if (!res.ok) throw new Error('Error al actualizar observación');
  return res.json();
};

export const deleteObservation = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE}/observations/${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar observación');
};

// === IA ADMINISTRATIVA ===
export interface IAEnrollmentAnalysis {
  top_courses: { course_id: number; name: string; num_enrollments: number }[];
  saturated_schedules: { room: string; date: string; count: number }[];
}

export function isIAEnabled() {
  const stored = localStorage.getItem('iaEnabled');
  return stored ? stored === 'true' : true;
}

export const getIAEnrollmentAnalysis = async (): Promise<IAEnrollmentAnalysis> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const res = await fetch(`${API_BASE}/ia/enrollment-analysis/`);
  if (!res.ok) throw new Error('Error al obtener análisis de matrículas IA');
  return await res.json();
};

export interface IAScheduleOptimization {
  optimizations: { room: string; courses: string[]; suggestion: string }[];
}

export const getIAScheduleOptimization = async (): Promise<IAScheduleOptimization> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const res = await fetch(`${API_BASE}/ia/schedule-optimization/`);
  if (!res.ok) throw new Error('Error al obtener optimización de horarios IA');
  return await res.json();
};

export interface IADemandPrediction {
  predictions: { course_id: number; name: string; last_year: number|null; last_year_enrollments: number; predicted_next_year: number }[];
}

export const getIADemandPrediction = async (): Promise<IADemandPrediction> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const res = await fetch(`${API_BASE}/ia/demand-prediction/`);
  if (!res.ok) throw new Error('Error al obtener predicción de demanda IA');
  return await res.json();
};

// Asistente IA para profesores
export const askProfessorFAQ = async (question: string): Promise<{answer: string}> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const res = await fetch(`${API_BASE}/ia/professor-faq/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Error al consultar el asistente IA');
  return await res.json();
};

export const reviewDocumentIA = async (file: File): Promise<{result: string}> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_BASE}/ia/document-review/`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Error al revisar el documento IA');
  return await res.json();
};

export interface IAReport {
  report: {
    month: number;
    year: number;
    new_enrollments: number;
    total_attendance: number;
    incidents: number;
    payments_processed: number;
    documents_reviewed: number;
    notes: string;
  };
}

export const getIAReport = async (): Promise<IAReport> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const res = await fetch(`${API_BASE}/ia/generate-report/`);
  if (!res.ok) throw new Error('Error al generar el informe IA');
  return await res.json();
};

export const getResourceSuggestionsIA = async (params: {level?: string, instrument?: string, topic?: string}): Promise<{suggestions: string[]}> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const res = await fetch(`${API_BASE}/ia/resources-suggestions/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Error al obtener sugerencias IA');
  return await res.json();
};

export const generateFamilyMessageIA = async (motivo: string, alumno: string): Promise<{mensaje: string}> => {
  if (!isIAEnabled()) throw new Error('La IA está desactivada por el administrador.');
  const res = await fetch(`${API_BASE}/ia/generate-family-message/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ motivo, alumno })
  });
  if (!res.ok) throw new Error('Error al generar el mensaje IA');
  return await res.json();
};

// === NOTIFICACIONS ===

function notificationFromApi(apiNotification: any): Notification {
  return {
    id: String(apiNotification.id),
    titulo: apiNotification.titulo,
    mensaxe: apiNotification.mensaxe,
    data_envio: apiNotification.data_envio,
    usuario_destino: apiNotification.usuario_destino,
    canal_preferido: apiNotification.canal_preferido,
    lido: apiNotification.lido,
    data_lectura: apiNotification.data_lectura,
    tipo: apiNotification.tipo,
    segmento: apiNotification.segmento,
    datos_extra: apiNotification.datos_extra,
  };
}

export const getNotifications = async (): Promise<Notification[]> => {
  const res = await fetch(`${API_BASE}/notifications/`);
  if (!res.ok) throw new Error('Erro ao obter as notificacións');
  const data = await res.json();
  return data.map(notificationFromApi);
};

export const createNotification = async (notification: Partial<Notification>): Promise<Notification> => {
  const res = await fetch(`${API_BASE}/notifications/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });
  if (!res.ok) throw new Error('Erro ao crear a notificación');
  return notificationFromApi(await res.json());
};

export const updateNotification = async (id: string, notification: Partial<Notification>): Promise<Notification> => {
  const res = await fetch(`${API_BASE}/notifications/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notification),
  });
  if (!res.ok) throw new Error('Erro ao actualizar a notificación');
  return notificationFromApi(await res.json());
};

export const deleteNotification = async (id: string): Promise<void> => {
  const res = await fetch(`${API_BASE}/notifications/${id}/`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Erro ao eliminar a notificación');
};

export const markNotificationAsRead = async (id: string): Promise<Notification> => {
  return updateNotification(id, { lido: true, data_lectura: new Date().toISOString() });
};

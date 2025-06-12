import { Student, Professor, Course, Instrument, Enrollment, Grade, Payment, ScheduleItem, User, UserRole, AttendanceRecord, PaymentStatus, EnrollmentStatus } from '../types';
import { mockStudents, mockProfessors, mockCourses, mockInstruments, mockEnrollments, mockGrades, mockPayments, mockSchedules, mockUsers, mockAttendance } from './mockData';

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

export const getStudentByUserId = async (userId: string): Promise<Student | undefined> =>
  simulateApiCall(mockStudents.find(s => s.userId === userId));


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

export const getProfessorByUserId = async (userId: string): Promise<Professor | undefined> =>
  simulateApiCall(mockProfessors.find(p => p.userId === userId));


// Instruments
export const getInstruments = async (): Promise<Instrument[]> => simulateApiCall([...mockInstruments]);
export const getInstrumentById = async (id: string): Promise<Instrument | undefined> =>
  simulateApiCall(mockInstruments.find(i => i.id === id));

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
export const getEnrollments = async (): Promise<Enrollment[]> => simulateApiCall(mockEnrollments);
export const getEnrollmentsByStudentId = async (studentId: string): Promise<Enrollment[]> =>
  simulateApiCall(mockEnrollments.filter(e => e.studentId === studentId));
export const getEnrollmentsByCourseId = async (courseId: string): Promise<Enrollment[]> =>
  simulateApiCall(mockEnrollments.filter(e => e.courseId === courseId));


// Grades
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
    const res = await fetch(`${API_BASE}/students/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
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
    const res = await fetch(`${API_BASE}/courses/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
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
    const res = await fetch(`${API_BASE}/courses/${item.id}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item)
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
    const totalStudents = mockStudents.length;
    const totalProfessors = mockProfessors.length;
    const activeCourses = mockCourses.filter(c => !c.endDate || new Date(c.endDate) > new Date()).length;
    const totalPayments = mockPayments.reduce((sum, p) => p.status === PaymentStatus.Paid ? sum + p.amount : sum, 0);
    return simulateApiCall({
      totalStudents,
      totalProfessors,
      activeCourses,
      totalPayments,
      recentEnrollments: mockEnrollments.slice(0, 5).map(e => {
        const student = mockStudents.find(s=>s.id === e.studentId);
        const course = mockCourses.find(c=>c.id === e.courseId);
        return `Student ${student?.firstName} enrolled in ${course?.name}`;
      })
    });
  }
  if (role === UserRole.Professor) {
    const professor = mockProfessors.find(p => p.userId === userId);
    if (!professor) return simulateApiCall(null);
    const assignedCourses = mockCourses.filter(c => c.teacherId === professor.id);
    const studentsInCourses = new Set<string>();
    assignedCourses.forEach(course => {
        mockEnrollments.filter(e => e.courseId === course.id && e.status === EnrollmentStatus.Active).forEach(e => studentsInCourses.add(e.studentId));
    });
    return simulateApiCall({
        assignedCoursesCount: assignedCourses.length,
        totalStudentsTaught: studentsInCourses.size,
        upcomingClassesToday: mockSchedules.filter(s => s.teacherId === professor.id && s.dayOfWeek.toLowerCase() === new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()).length,
    });
  }
   if (role === UserRole.Student) {
    const student = mockStudents.find(s => s.userId === userId);
    if (!student) return simulateApiCall(null);
    const enrolledCourses = mockEnrollments.filter(e => e.studentId === student.id && e.status === EnrollmentStatus.Active).length;
    const pendingPayments = mockPayments.filter(p => p.studentId === student.id && p.status === PaymentStatus.Pending).length;
    // Simplificado: Necesitaría una lógica más robusta para "próximas tareas" reales
    const upcomingAssignments = mockGrades.filter(g => mockEnrollments.some(e => e.id === g.enrollmentId && e.studentId === student.id && e.status === EnrollmentStatus.Active) && new Date(g.dateGiven) > new Date()).length; 
     return simulateApiCall({
        enrolledCourses,
        pendingPayments,
        upcomingAssignments
    });
  }
  return simulateApiCall(null);
};

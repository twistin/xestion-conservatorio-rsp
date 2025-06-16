// Si usas axios, descomenta la siguiente línea:
// import axios from 'axios';
import { Student, Professor, Course, Payment } from '../frontend/types';

// Función para obtener el token de autenticación desde localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper para añadir headers de autenticación
const authHeaders = (): Record<string, string> => {
  const token = getAuthToken();
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

// --- VALIDACIONES ---
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateRequiredFields = (obj: any, fields: string[]) => {
  for (const field of fields) {
    if (!obj[field] || obj[field].toString().trim() === '') {
      throw new Error(`El campo obligatorio '${field}' está vacío.`);
    }
  }
};

const validateStudentData = (student: any) => {
  validateRequiredFields(student, [
    'user_id', 'first_name', 'last_name', 'email', 'date_of_birth', 'instrument_id', 'enrollment_date'
  ]);
  if (!emailRegex.test(student.email)) {
    throw new Error('El email no tiene un formato válido.');
  }
};

const validateProfessorData = (professor: any) => {
  validateRequiredFields(professor, [
    'user_id', 'first_name', 'last_name', 'email', 'hire_date'
  ]);
  if (!emailRegex.test(professor.email)) {
    throw new Error('El email no tiene un formato válido.');
  }
};

const validateCourseData = (course: any) => {
  validateRequiredFields(course, [
    'name', 'description', 'start_date', 'end_date'
  ]);
  if (isNaN(Date.parse(course.start_date))) {
    throw new Error('La fecha de inicio no es válida.');
  }
  if (isNaN(Date.parse(course.end_date))) {
    throw new Error('La fecha de fin no es válida.');
  }
};

const validatePaymentData = (payment: any) => {
  validateRequiredFields(payment, [
    'student_id', 'amount', 'payment_date', 'method'
  ]);
  if (isNaN(Number(payment.amount)) || Number(payment.amount) <= 0) {
    throw new Error('El importe debe ser un número positivo.');
  }
  if (isNaN(Date.parse(payment.payment_date))) {
    throw new Error('La fecha de pago no es válida.');
  }
};

export const getHelloMessage = async (): Promise<string> => {
  const res = await fetch('http://localhost:8000/api/hello/', {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al conectar con el backend');
  const data = await res.json();
  return data.message;
};

export const getStudents = async () => {
  const res = await fetch('http://localhost:8000/api/students/', {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al obtener alumnado');
  return await res.json();
};

export const getProfessors = async () => {
  const res = await fetch('http://localhost:8000/api/professors/', {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al obtener profesorado');
  return await res.json();
};

export const getCourses = async () => {
  const res = await fetch('http://localhost:8000/api/courses/', {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al obtener cursos');
  return await res.json();
};

export const getPayments = async () => {
  const res = await fetch('http://localhost:8000/api/payments/', {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al obtener pagos');
  return await res.json();
};

// --- CRUD para alumnado ---
export const createStudent = async (student: any) => {
  // Solo los campos requeridos y sin id
  const snakeCaseStudent: any = {
    user_id: student.user_id || student.userId,
    first_name: student.first_name || student.firstName,
    last_name: student.last_name || student.lastName,
    email: student.email,
    date_of_birth: student.date_of_birth || student.dateOfBirth,
    instrument_id: student.instrument_id || student.instrumentId,
    enrollment_date: student.enrollment_date || student.enrollmentDate,
  };
  if (student.address) snakeCaseStudent.address = student.address;
  if (student.phone_number || student.phoneNumber) snakeCaseStudent.phone_number = student.phone_number || student.phoneNumber;
  // Eliminar campos vacíos
  Object.keys(snakeCaseStudent).forEach(key => {
    if (snakeCaseStudent[key] === undefined || snakeCaseStudent[key] === null || snakeCaseStudent[key] === '') {
      delete snakeCaseStudent[key];
    }
  });
  validateStudentData(snakeCaseStudent);
  const res = await fetch('http://localhost:8000/api/students/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(snakeCaseStudent)
  });
  if (!res.ok) throw new Error('Error al crear alumno/a');
  return await res.json();
};

export const updateStudent = async (id: string, student: any) => {
  validateStudentData(student);
  const res = await fetch(`http://localhost:8000/api/students/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(student)
  });
  if (!res.ok) throw new Error('Error al actualizar alumno/a');
  return await res.json();
};

export const deleteStudent = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/students/${id}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al eliminar alumno/a');
};

// --- CRUD para profesorado ---
export const createProfessor = async (professor: any) => {
  validateProfessorData(professor);
  const res = await fetch('http://localhost:8000/api/professors/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(professor)
  });
  if (!res.ok) throw new Error('Error al crear profesor/a');
  return await res.json();
};

export const updateProfessor = async (id: string, professor: any) => {
  validateProfessorData(professor);
  const res = await fetch(`http://localhost:8000/api/professors/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(professor)
  });
  if (!res.ok) throw new Error('Error al actualizar profesor/a');
  return await res.json();
};

export const deleteProfessor = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/professors/${id}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al eliminar profesor/a');
};

// --- CRUD para cursos ---
export const createCourse = async (course: any) => {
  validateCourseData(course);
  const res = await fetch('http://localhost:8000/api/courses/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(course)
  });
  if (!res.ok) throw new Error('Error al crear curso');
  return await res.json();
};

export const updateCourse = async (id: string, course: any) => {
  validateCourseData(course);
  const res = await fetch(`http://localhost:8000/api/courses/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(course)
  });
  if (!res.ok) throw new Error('Error al actualizar curso');
  return await res.json();
};

export const deleteCourse = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/courses/${id}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al eliminar curso');
};

// --- CRUD para pagos ---
export const createPayment = async (payment: any) => {
  validatePaymentData(payment);
  const res = await fetch('http://localhost:8000/api/payments/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payment)
  });
  if (!res.ok) throw new Error('Error al crear pago');
  return await res.json();
};

export const updatePayment = async (id: string, payment: any) => {
  validatePaymentData(payment);
  const res = await fetch(`http://localhost:8000/api/payments/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payment)
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return await res.json();
};

export const deletePayment = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/payments/${id}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al eliminar pago');
};

// --- Registrar ausencia como observación pedagógica ---
/**
 * Registra una ausencia como observación para un alumno.
 * @param studentId ID del alumno
 * @param courseId ID del curso (opcional, si se conoce)
 * @param professorId ID del profesor (opcional, si se conoce)
 * @param motivo Texto o motivo de la ausencia (opcional)
 */
export const registerAbsenceObservation = async ({ studentId, courseId, professorId, motivo }: { studentId: string, courseId?: string, professorId?: string, motivo?: string }) => {
  const observation: any = {
    student: studentId,
    text: motivo || 'Ausencia registrada',
  };
  if (courseId) observation.course = courseId;
  if (professorId) observation.professor = professorId;
  const res = await fetch('http://localhost:8000/api/observations/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(observation)
  });
  if (!res.ok) throw new Error('Error al registrar la ausencia en el sistema de asistencia');
  return await res.json();
};

// --- ASISTENCIA: BACKEND REAL ---
export const getAttendance = async (filters: Record<string, string | number> = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') params.append(key, String(value));
  });
  const res = await fetch(`http://localhost:8000/api/attendance/?${params.toString()}`, {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al obtener asistencia');
  return await res.json();
};

export const createAttendance = async (attendance: any) => {
  const res = await fetch('http://localhost:8000/api/attendance/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(attendance)
  });
  if (!res.ok) throw new Error('Error al registrar asistencia');
  return await res.json();
};

export const updateAttendance = async (id: string, attendance: any) => {
  const res = await fetch(`http://localhost:8000/api/attendance/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(attendance)
  });
  if (!res.ok) throw new Error('Error al actualizar asistencia');
  return await res.json();
};

export const deleteAttendance = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/attendance/${id}/`, {
    method: 'DELETE',
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al eliminar asistencia');
};

// --- JUSTIFICACIONES DE ASISTENCIA ---
/**
 * Sube un documento de justificación para una asistencia.
 * @param attendanceId ID de la asistencia
 * @param file Archivo de justificación (PDF, imagen, etc.)
 */
export const uploadJustificationDocument = async (attendanceId: string, file: File) => {
  const formData = new FormData();
  formData.append('justification_document', file);
  // El backend debe aceptar PATCH para actualizar solo el documento
  const res = await fetch(`http://localhost:8000/api/attendance/${attendanceId}/`, {
    method: 'PATCH',
    headers: { ...authHeaders() }, // No poner Content-Type, el navegador lo gestiona
    body: formData
  });
  if (!res.ok) throw new Error('Error al subir el documento de justificación');
  return await res.json();
};

/**
 * Revisa una justificación (aprobar o rechazar) y añade comentarios opcionales.
 * @param attendanceId ID de la asistencia
 * @param status 'aprobada' | 'rechazada'
 * @param comments Comentarios del revisor (opcional)
 */
export const reviewJustification = async (
  attendanceId: string,
  status: 'aprobada' | 'rechazada',
  comments?: string
) => {
  const body: any = {
    justification_status: status,
  };
  if (comments) body.justification_comments = comments;
  const res = await fetch(`http://localhost:8000/api/attendance/${attendanceId}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error('Error al actualizar el estado de la justificación');
  return await res.json();
};

// --- ENROLLMENTS ---
/**
 * Obtiene las matrículas de un curso por su ID.
 * @param courseId ID del curso
 */
export const getEnrollmentsByCourseId = async (courseId: string) => {
  const res = await fetch(`http://localhost:8000/api/enrollments/?course=${courseId}`, {
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Error al obtener matrículas del curso');
  return await res.json();
};

// --- ASISTENTE IA DEL PROFESOR ---

/**
 * Analiza una grabación de audio/video de un estudiante.
 * @param file Archivo de audio o video
 */
export const analyzeStudentRecording = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('http://localhost:8000/api/ia/analisis-audio/', {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData
  });
  if (!res.ok) throw new Error('Error al analizar la grabación');
  return await res.json();
};

/**
 * Analiza una partitura (PDF o MIDI).
 * @param file Archivo PDF o MIDI
 */
export const analyzeScore = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('http://localhost:8000/api/ia/analisis-partitura/', {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData
  });
  if (!res.ok) throw new Error('Error al analizar la partitura');
  return await res.json();
};

/**
 * Genera un ejercicio personalizado para un estudiante.
 * @param params Parámetros del ejercicio (tipo, nivel, instrumento, etc.)
 */
export const generateCustomExercise = async (params: any) => {
  const res = await fetch('http://localhost:8000/api/ia/generar-ejercicio/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Error al generar ejercicio');
  return await res.json();
};

/**
 * Obtiene sugerencias de repertorio para un estudiante.
 * @param params Parámetros de búsqueda (nivel, instrumento, intereses)
 */
export const getRepertoireSuggestions = async (params: any) => {
  const res = await fetch('http://localhost:8000/api/ia/sugerencias-repertorio/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Error al obtener sugerencias de repertorio');
  return await res.json();
};

/**
 * Explicador interactivo de teoría musical.
 * @param question Pregunta teórica
 */
export const explainMusicTheory = async (question: string) => {
  const res = await fetch('http://localhost:8000/api/ia/explicador-teoria/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Error al consultar el explicador de teoría');
  return await res.json();
};

/**
 * Genera un cuestionario automático.
 * @param params Parámetros del cuestionario (tema, nivel, etc.)
 */
export const generateQuiz = async (params: any) => {
  const res = await fetch('http://localhost:8000/api/ia/generar-cuestionario/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Error al generar cuestionario');
  return await res.json();
};

/**
 * Obtiene tareas y ensayos del estudiante/profesor.
 * @param params Filtros de búsqueda
 */
export const getTasksAndRehearsals = async (params: any = {}) => {
  const res = await fetch('http://localhost:8000/api/ia/tareas-ensayos/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(params)
  });
  if (!res.ok) throw new Error('Error al obtener tareas y ensayos');
  return await res.json();
};

/**
 * Genera un informe de progreso para un estudiante.
 * @param studentId ID del estudiante
 */
export const generateProgressReport = async (studentId: string) => {
  const res = await fetch('http://localhost:8000/api/ia/informe-progreso/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ studentId })
  });
  if (!res.ok) throw new Error('Error al generar informe de progreso');
  return await res.json();
};

/**
 * FAQ inteligente para preguntas frecuentes.
 * @param question Pregunta frecuente
 */
export const askIntelligentFAQ = async (question: string) => {
  const res = await fetch('http://localhost:8000/api/ia/faq-inteligente/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Error al consultar el FAQ inteligente');
  return await res.json();
};
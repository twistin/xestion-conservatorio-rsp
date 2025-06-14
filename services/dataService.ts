// Si usas axios, descomenta la siguiente línea:
// import axios from 'axios';
import { Student, Professor, Course, Payment } from '../frontend/types';

export const getHelloMessage = async (): Promise<string> => {
  // Puedes usar fetch o axios. Aquí con fetch:
  const res = await fetch('http://localhost:8000/api/hello/');
  if (!res.ok) throw new Error('Error al conectar con el backend');
  const data = await res.json();
  return data.message;
};

export const getStudents = async () => {
  const res = await fetch('http://localhost:8000/api/students/');
  if (!res.ok) throw new Error('Error al obtener alumnado');
  return await res.json();
};

export const getProfessors = async () => {
  const res = await fetch('http://localhost:8000/api/professors/');
  if (!res.ok) throw new Error('Error al obtener profesorado');
  return await res.json();
};

export const getCourses = async () => {
  const res = await fetch('http://localhost:8000/api/courses/');
  if (!res.ok) throw new Error('Error al obtener cursos');
  return await res.json();
};

export const getPayments = async () => {
  const res = await fetch('http://localhost:8000/api/payments/');
  if (!res.ok) throw new Error('Error al obtener pagos');
  return await res.json();
};

// --- CRUD para alumnado ---
export const createStudent = async (student: any) => {
  // Solo los campos esperados y en snake_case
  const snakeCaseStudent = {
    user_id: student.user_id || student.userId,
    first_name: student.first_name || student.firstName,
    last_name: student.last_name || student.lastName,
    email: student.email,
    date_of_birth: student.date_of_birth || student.dateOfBirth,
    instrument_id: student.instrument_id || student.instrumentId,
    enrollment_date: student.enrollment_date || student.enrollmentDate,
    address: student.address,
    phone_number: student.phone_number || student.phoneNumber,
  };
  const res = await fetch('http://localhost:8000/api/students/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(snakeCaseStudent)
  });
  if (!res.ok) throw new Error('Error al crear alumno/a');
  return await res.json();
};

export const updateStudent = async (id: string, student: any) => {
  const res = await fetch(`http://localhost:8000/api/students/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(student)
  });
  if (!res.ok) throw new Error('Error al actualizar alumno/a');
  return await res.json();
};

export const deleteStudent = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/students/${id}/`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar alumno/a');
};

// --- CRUD para profesorado ---
export const createProfessor = async (professor: any) => {
  const res = await fetch('http://localhost:8000/api/professors/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professor)
  });
  if (!res.ok) throw new Error('Error al crear profesor/a');
  return await res.json();
};

export const updateProfessor = async (id: string, professor: any) => {
  const res = await fetch(`http://localhost:8000/api/professors/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(professor)
  });
  if (!res.ok) throw new Error('Error al actualizar profesor/a');
  return await res.json();
};

export const deleteProfessor = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/professors/${id}/`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar profesor/a');
};

// --- CRUD para cursos ---
export const createCourse = async (course: any) => {
  const res = await fetch('http://localhost:8000/api/courses/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!res.ok) throw new Error('Error al crear curso');
  return await res.json();
};

export const updateCourse = async (id: string, course: any) => {
  const res = await fetch(`http://localhost:8000/api/courses/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(course)
  });
  if (!res.ok) throw new Error('Error al actualizar curso');
  return await res.json();
};

export const deleteCourse = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/courses/${id}/`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar curso');
};

// --- CRUD para pagos ---
export const createPayment = async (payment: any) => {
  const res = await fetch('http://localhost:8000/api/payments/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  });
  if (!res.ok) throw new Error('Error al crear pago');
  return await res.json();
};

export const updatePayment = async (id: string, payment: any) => {
  const res = await fetch(`http://localhost:8000/api/payments/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payment)
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return await res.json();
};

export const deletePayment = async (id: string) => {
  const res = await fetch(`http://localhost:8000/api/payments/${id}/`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al eliminar pago');
};
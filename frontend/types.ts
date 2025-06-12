export enum UserRole {
  Admin = 'Admin',
  Professor = 'Professor',
  Student = 'Student',
}

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Student {
  id: string;
  userId: string;
  dateOfBirth: string;
  instrumentId: string;
  enrollmentDate: string;
  address?: string;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  // For quick access, we can denormalize user info
  firstName: string;
  lastName: string;
  email: string;
}

export interface Professor {
  id: string;
  userId: string;
  specialty: string;
  hireDate: string;
  phoneNumber?: string;
  // For quick access
  firstName: string;
  lastName: string;
  email: string;
  tutoringSchedule?: string; // Nuevo campo
  classrooms?: string; // Nuevo campo
}

export interface Instrument {
  id: string;
  name: string;
  description?: string;
}

export enum CourseLevel {
  Beginner = 'Beginner',
  Intermediate = 'Intermediate',
  Advanced = 'Advanced',
}

export interface Course {
  id: string;
  name: string;
  description: string;
  level: CourseLevel;
  teacherId?: string; // Professor's ID
  startDate?: string;
  endDate?: string;
  room?: string; // For schedules tied to courses
}

export enum EnrollmentStatus {
  Active = 'Active',
  Completed = 'Completed',
  Withdrawn = 'Withdrawn',
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrollmentDate: string;
  status: EnrollmentStatus;
}

export interface Grade {
  id: string;
  enrollmentId: string;
  assignmentName: string;
  score: number; // e.g., 0-100
  dateGiven: string;
  comments?: string;
}

export enum AttendanceStatus {
  Present = 'Present',
  Absent = 'Absent',
  Late = 'Late',
  Justified = 'Justified',
}

export interface AttendanceRecord {
  id: string;
  enrollmentId: string;
  date: string;
  status: AttendanceStatus;
}

export enum PaymentStatus {
  Paid = 'Paid',
  Pending = 'Pending',
  Overdue = 'Overdue',
  Cancelled = 'Cancelled'
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  paymentDate?: string;
  dueDate: string;
  status: PaymentStatus;
  description: string; // e.g., Tuition Fee - March
  invoiceUrl?: string;
}

export interface ScheduleItem {
  id: string;
  title: string; // e.g., Piano Lesson, Music Theory
  dayOfWeek: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: 'Course' | 'IndividualLesson' | 'GroupSession' | 'Event';
  location: string; // e.g., Room 101, Auditorium
  courseId?: string;
  teacherId?: string;
  studentId?: string; // For individual schedules
  relatedUserIds?: string[]; // student or professor ids for group events
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

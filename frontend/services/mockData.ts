import { User, UserRole, Student, Professor, Instrument, Course, CourseLevel, Enrollment, EnrollmentStatus, Grade, Payment, PaymentStatus, ScheduleItem, AttendanceRecord, AttendanceStatus } from '../types';

export const mockUsers: User[] = [
  { id: 'user-admin-1', username: 'admin', email: 'admin@conservatory.edu', firstName: 'Admin', lastName: 'User', role: UserRole.Admin, avatarUrl: 'https://picsum.photos/seed/admin/100/100' },
  { id: 'user-prof-1', username: 'jdoe', email: 'jdoe@conservatory.edu', firstName: 'John', lastName: 'Doe', role: UserRole.Professor, avatarUrl: 'https://picsum.photos/seed/johndoe/100/100' },
  { id: 'user-prof-2', username: 'asmith', email: 'asmith@conservatory.edu', firstName: 'Alice', lastName: 'Smith', role: UserRole.Professor, avatarUrl: 'https://picsum.photos/seed/alicesmith/100/100' },
  { id: 'user-stud-1', username: 'bwayne', email: 'bwayne@conservatory.edu', firstName: 'Bruce', lastName: 'Wayne', role: UserRole.Student, avatarUrl: 'https://picsum.photos/seed/brucewayne/100/100' },
  { id: 'user-stud-2', username: 'ckent', email: 'ckent@conservatory.edu', firstName: 'Clark', lastName: 'Kent', role: UserRole.Student, avatarUrl: 'https://picsum.photos/seed/clarkkent/100/100' },
  { id: 'user-stud-3', username: 'dprince', email: 'dprince@conservatory.edu', firstName: 'Diana', lastName: 'Prince', role: UserRole.Student, avatarUrl: 'https://picsum.photos/seed/dianaprince/100/100' },
];

export const mockInstruments: Instrument[] = [
  { id: 'instr-1', name: 'Piano', description: 'Keyboard instrument' },
  { id: 'instr-2', name: 'Guitar', description: 'String instrument' },
  { id: 'instr-3', name: 'Violin', description: 'String instrument' },
  { id: 'instr-4', name: 'Drums', description: 'Percussion instrument' },
  { id: 'instr-5', name: 'Flute', description: 'Wind instrument' },
];

export const mockStudents: Student[] = [
  { id: 'stud-1', userId: 'user-stud-1', dateOfBirth: '2002-05-15', instrumentId: 'instr-1', enrollmentDate: '2023-09-01', firstName: 'Bruce', lastName: 'Wayne', email: 'bwayne@conservatory.edu', address: '1007 Mountain Drive, Gotham', phoneNumber: '555-0101' },
  { id: 'stud-2', userId: 'user-stud-2', dateOfBirth: '2001-08-20', instrumentId: 'instr-2', enrollmentDate: '2023-09-01', firstName: 'Clark', lastName: 'Kent', email: 'ckent@conservatory.edu', address: '344 Clinton St, Metropolis', phoneNumber: '555-0102' },
  { id: 'stud-3', userId: 'user-stud-3', dateOfBirth: '2003-01-10', instrumentId: 'instr-3', enrollmentDate: '2024-01-15', firstName: 'Diana', lastName: 'Prince', email: 'dprince@conservatory.edu', address: 'Gateway City', phoneNumber: '555-0103' },
];

export const mockProfessors: Professor[] = [
  { id: 'prof-1', userId: 'user-prof-1', specialty: 'Piano, Music Theory', hireDate: '2010-08-15', firstName: 'John', lastName: 'Doe', email: 'jdoe@conservatory.edu', phoneNumber: '555-0201' },
  { id: 'prof-2', userId: 'user-prof-2', specialty: 'Guitar, Composition', hireDate: '2015-01-20', firstName: 'Alice', lastName: 'Smith', email: 'asmith@conservatory.edu', phoneNumber: '555-0202' },
];

export const mockCourses: Course[] = [
  { id: 'course-1', name: 'Piano Basics', description: 'Introduction to piano playing.', level: CourseLevel.Beginner, teacherId: 'prof-1', startDate: '2024-09-02', endDate: '2024-12-20', room: 'Room 101' },
  { id: 'course-2', name: 'Intermediate Guitar', description: 'Advanced guitar techniques.', level: CourseLevel.Intermediate, teacherId: 'prof-2', startDate: '2024-09-02', endDate: '2024-12-20', room: 'Room 102' },
  { id: 'course-3', name: 'Music Theory I', description: 'Fundamentals of music theory.', level: CourseLevel.Beginner, teacherId: 'prof-1', startDate: '2024-09-03', endDate: '2024-12-19', room: 'Room 201' },
  { id: 'course-4', name: 'Advanced Violin', description: 'Mastering the violin.', level: CourseLevel.Advanced, teacherId: 'prof-1', startDate: '2024-09-03', endDate: '2024-12-19', room: 'Room 103' },
];

export const mockEnrollments: Enrollment[] = [
  { id: 'enroll-1', studentId: 'stud-1', courseId: 'course-1', enrollmentDate: '2024-08-20', status: EnrollmentStatus.Active },
  { id: 'enroll-2', studentId: 'stud-1', courseId: 'course-3', enrollmentDate: '2024-08-20', status: EnrollmentStatus.Active },
  { id: 'enroll-3', studentId: 'stud-2', courseId: 'course-2', enrollmentDate: '2024-08-21', status: EnrollmentStatus.Active },
  { id: 'enroll-4', studentId: 'stud-3', courseId: 'course-4', enrollmentDate: '2024-08-22', status: EnrollmentStatus.Completed },
];

export const mockGrades: Grade[] = [
  { id: 'grade-1', enrollmentId: 'enroll-1', assignmentName: 'Midterm Practical', score: 85, dateGiven: '2024-10-15', comments: 'Good progress.' },
  { id: 'grade-2', enrollmentId: 'enroll-1', assignmentName: 'Final Recital', score: 90, dateGiven: '2024-12-10', comments: 'Excellent performance!' },
  { id: 'grade-3', enrollmentId: 'enroll-2', assignmentName: 'Theory Exam 1', score: 92, dateGiven: '2024-10-20' },
  { id: 'grade-4', enrollmentId: 'enroll-3', assignmentName: 'Midterm Song', score: 78, dateGiven: '2024-10-18', comments: 'Needs more practice on scales.' },
];

export const mockPayments: Payment[] = [
  { id: 'payment-1', studentId: 'stud-1', amount: 500, paymentDate: '2024-09-01', dueDate: '2024-09-01', status: PaymentStatus.Paid, description: 'Tuition - Fall 2024 (Piano)' },
  { id: 'payment-2', studentId: 'stud-1', amount: 200, dueDate: '2024-10-01', status: PaymentStatus.Pending, description: 'Materials Fee - Fall 2024' },
  { id: 'payment-3', studentId: 'stud-2', amount: 550, paymentDate: '2024-09-02', dueDate: '2024-09-01', status: PaymentStatus.Paid, description: 'Tuition - Fall 2024 (Guitar)' },
  { id: 'payment-4', studentId: 'stud-3', amount: 600, dueDate: '2024-09-01', status: PaymentStatus.Overdue, description: 'Tuition - Fall 2024 (Violin)' },
];

export const mockSchedules: ScheduleItem[] = [
  { id: 'sched-1', title: 'Piano Basics (C1)', dayOfWeek: 'Monday', startTime: '14:00', endTime: '15:30', type: 'Course', location: 'Room 101', courseId: 'course-1', teacherId: 'prof-1', relatedUserIds: ['stud-1'] },
  { id: 'sched-2', title: 'Music Theory I (C3)', dayOfWeek: 'Tuesday', startTime: '10:00', endTime: '11:30', type: 'Course', location: 'Room 201', courseId: 'course-3', teacherId: 'prof-1', relatedUserIds: ['stud-1'] },
  { id: 'sched-3', title: 'Advanced Violin (C4)', dayOfWeek: 'Wednesday', startTime: '12:00', endTime: '13:30', type: 'Course', location: 'Room 103', courseId: 'course-4', teacherId: 'prof-1', relatedUserIds: ['stud-3'] },
  { id: 'sched-4', title: 'Piano Lesson - B. Wayne', dayOfWeek: 'Friday', startTime: '09:00', endTime: '10:00', type: 'IndividualLesson', location: 'Practice Room A', studentId: 'stud-1', teacherId: 'prof-1' },
  { id: 'sched-5', title: 'Faculty Meeting', dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', type: 'Event', location: 'Conference Hall', relatedUserIds: ['prof-1', 'prof-2'] },
  { id: 'sched-6', title: 'Guitar Masterclass', dayOfWeek: 'Thursday', startTime: '17:00', endTime: '18:30', type: 'Course', location: 'Room 202', courseId: 'course-2', teacherId: 'prof-2', relatedUserIds: ['stud-2'] },
  { id: 'sched-7', title: 'Clase Extra', dayOfWeek: 'Friday', startTime: '11:00', endTime: '12:00', type: 'Course', location: 'Room 105', courseId: 'course-1', teacherId: 'prof-1', relatedUserIds: ['stud-1'] },
];

export const mockAttendance: AttendanceRecord[] = [
    { id: 'att-1', enrollmentId: 'enroll-1', date: '2024-09-02', status: AttendanceStatus.Present },
    { id: 'att-2', enrollmentId: 'enroll-1', date: '2024-09-09', status: AttendanceStatus.Present },
    { id: 'att-3', enrollmentId: 'enroll-1', date: '2024-09-16', status: AttendanceStatus.Late },
    { id: 'att-4', enrollmentId: 'enroll-2', date: '2024-09-03', status: AttendanceStatus.Present },
    { id: 'att-5', enrollmentId: 'enroll-3', date: '2024-09-04', status: AttendanceStatus.Absent, },
];

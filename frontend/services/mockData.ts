import { User, UserRole, Student, Professor, Course, CourseLevel, Enrollment, EnrollmentStatus, Grade, ScheduleItem, AttendanceRecord, AttendanceStatus } from '../types';

export const mockUsers: User[] = [
  { id: 'user-admin-1', username: 'admin', email: 'admin@conservatory.edu', firstName: 'Admin', lastName: 'User', role: UserRole.Admin, avatarUrl: 'https://picsum.photos/seed/admin/100/100' },
  { id: 'user-prof-1', username: 'jdoe', email: 'jdoe@conservatory.edu', firstName: 'John', lastName: 'Doe', role: UserRole.Professor, avatarUrl: 'https://picsum.photos/seed/johndoe/100/100' },
  { id: 'user-prof-2', username: 'asmith', email: 'asmith@conservatory.edu', firstName: 'Alice', lastName: 'Smith', role: UserRole.Professor, avatarUrl: 'https://picsum.photos/seed/alicesmith/100/100' },
  { id: 'user-stud-1', username: 'bwayne', email: 'bwayne@conservatory.edu', firstName: 'Bruce', lastName: 'Wayne', role: UserRole.Student, avatarUrl: 'https://picsum.photos/seed/brucewayne/100/100' },
  { id: 'user-stud-2', username: 'ckent', email: 'ckent@conservatory.edu', firstName: 'Clark', lastName: 'Kent', role: UserRole.Student, avatarUrl: 'https://picsum.photos/seed/clarkkent/100/100' },
  { id: 'user-stud-3', username: 'dprince', email: 'dprince@conservatory.edu', firstName: 'Diana', lastName: 'Prince', role: UserRole.Student, avatarUrl: 'https://picsum.photos/seed/dianaprince/100/100' },
];

export const mockStudents: Student[] = [
  { id: 'stud-1', userId: 'user-stud-1', dateOfBirth: '2002-05-15', instrumentId: 'instr-1', enrollmentDate: '2023-09-01', firstName: 'Bruce', lastName: 'Wayne', email: 'bwayne@conservatory.edu', address: '1007 Mountain Drive, Gotham', phoneNumber: '555-0101' },
  { id: 'stud-2', userId: 'user-stud-2', dateOfBirth: '2001-08-20', instrumentId: 'instr-2', enrollmentDate: '2023-09-01', firstName: 'Clark', lastName: 'Kent', email: 'ckent@conservatory.edu', address: '344 Clinton St, Metropolis', phoneNumber: '555-0102' },
  { id: 'stud-3', userId: 'user-stud-3', dateOfBirth: '2003-01-10', instrumentId: 'instr-3', enrollmentDate: '2024-01-15', firstName: 'Diana', lastName: 'Prince', email: 'dprince@conservatory.edu', address: 'Gateway City', phoneNumber: '555-0103' },
];

export const mockProfessors: Professor[] = [
  { id: 'prof-1', userId: 'user-prof-1', specialty: 'Piano, Music Theory', hireDate: '2010-08-15', firstName: 'John', lastName: 'Doe', email: 'jdoe@conservatory.edu', phoneNumber: '555-0201' },
];

export const mockCourses: Course[] = [
  { id: 'course-1', name: 'Piano Basics', description: 'Introduction to piano playing.', level: CourseLevel.Beginner, teacherId: 'prof-1', startDate: '2024-09-02', endDate: '2024-12-20', room: 'Room 101' },
];

export const mockEnrollments: Enrollment[] = [
  { id: 'enroll-1', studentId: 'stud-1', courseId: 'course-1', enrollmentDate: '2024-08-20', status: EnrollmentStatus.Active },
];

export const mockGrades: Grade[] = [
  { id: 'grade-1', enrollmentId: 'enroll-1', assignmentName: 'Midterm Practical', score: 85, dateGiven: '2024-10-15', comments: 'Good progress.' },
  { id: 'grade-2', enrollmentId: 'enroll-1', assignmentName: 'Final Recital', score: 90, dateGiven: '2024-12-10', comments: 'Excellent performance!' },
];

export const mockSchedules: ScheduleItem[] = [
  { id: 'sched-1', title: 'Piano Basics (C1)', dayOfWeek: 'Monday', startTime: '14:00', endTime: '15:30', type: 'Course', location: 'Room 101', courseId: 'course-1', teacherId: 'prof-1', relatedUserIds: ['stud-1'] },
  { id: 'sched-2', title: 'Piano Lesson - B. Wayne', dayOfWeek: 'Friday', startTime: '09:00', endTime: '10:00', type: 'IndividualLesson', location: 'Practice Room A', studentId: 'stud-1', teacherId: 'prof-1' },
];

export const mockAttendance: AttendanceRecord[] = [
    { id: 'att-1', enrollmentId: 'enroll-1', date: '2024-09-02', status: AttendanceStatus.Present },
    { id: 'att-2', enrollmentId: 'enroll-1', date: '2024-09-09', status: AttendanceStatus.Present },
    { id: 'att-3', enrollmentId: 'enroll-1', date: '2024-09-16', status: AttendanceStatus.Late },
];

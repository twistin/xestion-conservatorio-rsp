import { UserRole } from './types';

export const APP_NAME = "Xestión Conservatorio";

export const COLORS = {
  primary: '#2563EB',
  secondary: '#10B981',
  accent: '#8B5CF6',
  neutralDark: '#1F2937',
  neutralMedium: '#6B7280',
  neutralLight: '#F3F4F6',
  white: '#FFFFFF',
  statusRed: '#EF4444',
  statusYellow: '#F59E0B',
  statusBlue: '#3B82F6',
  darkBg: '#1A1A1A',
  darkSurface: '#2D2D2D',
  darkText: '#E5E7EB',
};

export const TYPOGRAPHY = {
  fontSans: "Inter, sans-serif",
  fontDisplay: "Poppins, sans-serif",
  fontMono: "JetBrains Mono, monospace",
};

export const ROUTES = {
  login: '/login',
  dashboard: '/dashboard',
  students: '/students',
  professors: '/professors',
  courses: '/courses',
  schedules: '/schedules',
  payments: '/payments',
  reports: '/reports',
  notifications: '/notifications',
  profile: '/profile',
  settings: '/settings',
  myCourses: '/my-courses', // Student
  myGrades: '/my-grades', // Student
  assignedStudents: '/assigned-students', // Professor
  manageGrades: '/manage-grades', // Professor
  // Nuevos módulos estudiante
  studentProfile: '/student-profile',
  studentSchedule: '/student-schedule',
  studentEvaluations: '/student-evaluations',
  studentResources: '/student-resources',
  studentMessages: '/student-messages',
  studentAdmin: '/student-admin',
  studentActivities: '/student-activities',
  studentAI: '/student-ai',
  studentStats: '/student-stats',
  studentSurveys: '/student-surveys',
};

interface NavItem {
  label: string;
  href: string;
  icon: string; // Font Awesome class
  roles: UserRole[];
  children?: NavItem[];
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Panel de Control', href: ROUTES.dashboard, icon: 'fa-solid fa-tachometer-alt', roles: [UserRole.Admin, UserRole.Professor, UserRole.Student] },
  
  // Admin specific
  { label: 'Alumnado', href: ROUTES.students, icon: 'fa-solid fa-user-graduate', roles: [UserRole.Admin] },
  { label: 'Profesorado', href: ROUTES.professors, icon: 'fa-solid fa-chalkboard-teacher', roles: [UserRole.Admin] },
  { label: 'Cursos', href: ROUTES.courses, icon: 'fa-solid fa-book', roles: [UserRole.Admin] },
  { label: 'Pagamentos', href: ROUTES.payments, icon: 'fa-solid fa-credit-card', roles: [UserRole.Admin] },
  { label: 'Informes', href: ROUTES.reports, icon: 'fa-solid fa-chart-line', roles: [UserRole.Admin] },

  // Professor specific
  { label: 'O Meu Horario', href: ROUTES.schedules, icon: 'fa-solid fa-calendar-alt', roles: [UserRole.Professor] },
  { label: 'Alumnado Asignado', href: ROUTES.assignedStudents, icon: 'fa-solid fa-users', roles: [UserRole.Professor] },
  { label: 'Xestionar Cualificacións', href: ROUTES.manageGrades, icon: 'fa-solid fa-marker', roles: [UserRole.Professor] },
  
  // Student specific
  { label: 'Os Meus Cursos', href: ROUTES.myCourses, icon: 'fa-solid fa-book-open-reader', roles: [UserRole.Student] },
  { label: 'O Meu Horario', href: ROUTES.schedules, icon: 'fa-solid fa-calendar-check', roles: [UserRole.Student] },
  { label: 'As Miñas Cualificacións', href: ROUTES.myGrades, icon: 'fa-solid fa-graduation-cap', roles: [UserRole.Student] },
  { label: 'Os Meus Pagamentos', href: ROUTES.payments, icon: 'fa-solid fa-file-invoice-dollar', roles: [UserRole.Student] },
  // Student specific (añadir módulos avanzados)
  { label: 'Perfil', href: ROUTES.studentProfile, icon: 'fa-solid fa-user', roles: [UserRole.Student] },
  { label: 'Horario', href: ROUTES.studentSchedule, icon: 'fa-solid fa-calendar-days', roles: [UserRole.Student] },
  { label: 'Evaluaciones', href: ROUTES.studentEvaluations, icon: 'fa-solid fa-clipboard-check', roles: [UserRole.Student] },
  { label: 'Recursos', href: ROUTES.studentResources, icon: 'fa-solid fa-music', roles: [UserRole.Student] },
  { label: 'Comunicación', href: ROUTES.studentMessages, icon: 'fa-solid fa-comments', roles: [UserRole.Student] },
  { label: 'Administración', href: ROUTES.studentAdmin, icon: 'fa-solid fa-file-alt', roles: [UserRole.Student] },
  { label: 'Actividades', href: ROUTES.studentActivities, icon: 'fa-solid fa-users-rectangle', roles: [UserRole.Student] },
  { label: 'Asistente IA', href: ROUTES.studentAI, icon: 'fa-solid fa-robot', roles: [UserRole.Student] },
  { label: 'Estadísticas', href: ROUTES.studentStats, icon: 'fa-solid fa-chart-bar', roles: [UserRole.Student] },
  { label: 'Encuestas', href: ROUTES.studentSurveys, icon: 'fa-solid fa-poll', roles: [UserRole.Student] },

  // Common
  { label: 'Horarios Xerais', href: ROUTES.schedules, icon: 'fa-solid fa-calendar-days', roles: [UserRole.Admin] }, // Admin general schedule view
  { label: 'Notificacións', href: ROUTES.notifications, icon: 'fa-solid fa-bell', roles: [UserRole.Admin, UserRole.Professor, UserRole.Student] },
];

export const USER_MENU_ITEMS = [
  { label: 'O Meu Perfil', href: ROUTES.profile, icon: 'fa-solid fa-user-circle' },
  { label: 'Configuración', href: ROUTES.settings, icon: 'fa-solid fa-cog' },
];

export const PAGINATION_DEFAULT_PAGE_SIZE = 10;
export const TOAST_DEFAULT_DURATION = 3000;

export const ICONS = {
  users: 'fa-solid fa-users',
  calendar: 'fa-solid fa-calendar-alt',
  add: 'fa-solid fa-plus',
  edit: 'fa-solid fa-pencil-alt',
  delete: 'fa-solid fa-trash-alt',
  view: 'fa-solid fa-eye',
  search: 'fa-solid fa-search',
  filter: 'fa-solid fa-filter',
  logout: 'fa-solid fa-sign-out-alt',
  loading: 'fa-solid fa-spinner fa-spin',
  error: 'fa-solid fa-exclamation-circle',
  success: 'fa-solid fa-check-circle',
  info: 'fa-solid fa-info-circle',
  warning: 'fa-solid fa-exclamation-triangle',
  students: 'fa-solid fa-user-graduate',
  professors: 'fa-solid fa-chalkboard-teacher',
  courses: 'fa-solid fa-book',
  payments: 'fa-solid fa-credit-card',
  reports: 'fa-solid fa-chart-line',
  dashboard: 'fa-solid fa-tachometer-alt',
  notifications: 'fa-solid fa-bell',
  settings: 'fa-solid fa-cog',
  profile: 'fa-solid fa-user-circle',
  collapse: 'fa-solid fa-chevron-left',
  expand: 'fa-solid fa-chevron-right',
  darkMode: 'fa-solid fa-moon',
  lightMode: 'fa-solid fa-sun',
};

// Baseado na páxina 13 do PDF
export const COLOR_PALETTE = {
  primary: '#2563EB', 
  secondary: '#10B981', 
  accent: '#8B5CF6', 
  neutrals: {
    dark: '#1F2937', 
    medium: '#6B7280', 
    light: '#F3F4F6', 
    white: '#FFFFFF', 
  },
  status: {
    error: '#EF4444', 
    warning: '#F59E0B', 
    info: '#3B82F6', 
    success: '#10B981', 
  },
  darkTheme: {
    background: '#1A1A1A',
    surface: '#2D2D2D', 
    textPrimary: '#E5E7EB', 
    textSecondary: '#9CA3AF', 
  }
};
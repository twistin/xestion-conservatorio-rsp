
import React, { useEffect, useState }from 'react';
import { User, Course, Enrollment, Payment, Grade, Instrument, Student } from '../../types';
import PageContainer from '../layout/PageContainer';
import MetricCard from '../ui/MetricCard';
import Card from '../ui/Card';
import { ICONS, ROUTES } from '../../constants';
import * as dataService from '../../services/dataService';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

interface StudentDashboardProps {
  user: User;
}

interface StudentMetrics {
    enrolledCourses: number;
    pendingPayments: number;
    upcomingAssignments: number; 
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  const [metrics, setMetrics] = useState<StudentMetrics | null>(null);
  const [studentDetails, setStudentDetails] = useState<Student | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [recentGrades, setRecentGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const student = await dataService.getStudentByUserId(user.id);
        if (!student) throw new Error("Datos do alumno non atopados");
        setStudentDetails(student);

        const [metricsData, enrollmentsData] = await Promise.all([
          dataService.getDashboardMetrics(user.role, user.id) as Promise<StudentMetrics>,
          dataService.getEnrollmentsByStudentId(student.id)
        ]);
        
        setMetrics(metricsData);

        const coursePromises = enrollmentsData
            .filter(e => e.status === 'Active') 
            .map(e => dataService.getCourseById(e.courseId));
        const courses = (await Promise.all(coursePromises)).filter(c => c !== undefined) as Course[];
        setEnrolledCourses(courses);
        
        const gradePromises = enrollmentsData.map(e => dataService.getGradesByEnrollmentId(e.id));
        const gradesArrays = await Promise.all(gradePromises);
        const allGrades = gradesArrays.flat().sort((a,b) => new Date(b.dateGiven).getTime() - new Date(a.dateGiven).getTime());
        setRecentGrades(allGrades.slice(0, 3));

      } catch (error) {
        console.error("Erro ao obter datos do panel do alumno", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user.id, user.role]);
  
  const breadcrumbs = [{ label: 'Panel de Control', current: true }];

  const quickLinks = [
    { label: "Ver Os Meus Cursos", href: ROUTES.myCourses, icon: ICONS.courses },
    { label: "Ver O Meu Horario", href: ROUTES.schedules, icon: ICONS.calendar },
    { label: "Ver As Miñas Cualificacións", href: ROUTES.myGrades, icon: "fa-solid fa-graduation-cap" },
    { label: "Ver Os Meus Pagamentos", href: ROUTES.payments, icon: ICONS.payments },
  ];

  return (
    <PageContainer title={`Benvido/a, ${user.firstName}!`} breadcrumbs={breadcrumbs}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <MetricCard title="Cursos Activos" value={metrics?.enrolledCourses ?? 0} icon={ICONS.courses} iconBgColor="bg-blue-500" isLoading={isLoading}/>
        <MetricCard title="Pagamentos Pendentes" value={metrics?.pendingPayments ?? 0} icon={ICONS.payments} iconBgColor="bg-yellow-500" isLoading={isLoading}/>
        <MetricCard title="Tarefas Próximas" value={metrics?.upcomingAssignments ?? 0} icon="fa-solid fa-file-pen" iconBgColor="bg-purple-500" isLoading={isLoading}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card title="Os Meus Cursos Activos" className="lg:col-span-2">
            {isLoading ? <div className="h-64 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div> :
            enrolledCourses.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {enrolledCourses.map(course => (
                <Link key={course.id} to={`${ROUTES.myCourses}?courseId=${course.id}`} className="block hover:no-underline">
                    <Card titleClassName="py-3 px-4" title={course.name} className="bg-neutral-light dark:bg-neutral-dark shadow-sm hover:shadow-md cursor-pointer">
                        <p className="text-xs text-neutral-medium dark:text-gray-400">{course.description}</p>
                        <p className="text-xs mt-1 text-primary dark:text-accent">{course.level}</p>
                    </Card>
                </Link>
                ))}
            </div>
            ) : (
            <p className="text-sm text-neutral-medium dark:text-gray-400">Actualmente non está matriculado/a en ningún curso activo.</p>
            )}
        </Card>

         <Card title="Accesos Rápidos">
            {isLoading ? <div className="space-y-2"> {[1,2,3,4].map(i=><div key={i} className="h-10 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>)} </div> :
            <div className="space-y-3">
                {quickLinks.map(link => (
                    <Link key={link.label} to={link.href}>
                        <Button variant="outline" className="w-full justify-start" iconLeft={link.icon}>
                            {link.label}
                        </Button>
                    </Link>
                ))}
            </div>
            }
        </Card>
      </div>

      <Card title="Cualificacións Recentes">
        {isLoading ? <div className="space-y-2"> {[1,2,3].map(i=><div key={i} className="h-8 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div>)} </div> :
        recentGrades.length > 0 ? (
          <ul className="divide-y divide-neutral-light dark:divide-neutral-medium">
            {recentGrades.map(grade => (
              <li key={grade.id} className="py-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-neutral-dark dark:text-white">{grade.assignmentName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${grade.score >= 80 ? 'bg-secondary/20 text-secondary' : grade.score >= 60 ? 'bg-yellow-500/20 text-yellow-600' : 'bg-status-red/20 text-status-red'}`}>
                    {grade.score}/100
                  </span>
                </div>
                <p className="text-xs text-neutral-medium dark:text-gray-400">
                    Cualificado o: {new Date(grade.dateGiven).toLocaleDateString('gl-ES')}
                    {grade.comments && ` - ${grade.comments}`}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-neutral-medium dark:text-gray-400">Non hai cualificacións recentes dispoñibles.</p>
        )}
      </Card>

    </PageContainer>
  );
};

export default StudentDashboard;
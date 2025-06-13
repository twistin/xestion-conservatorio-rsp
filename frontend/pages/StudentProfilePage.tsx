import React, { useEffect, useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';
import * as dataService from '../services/dataService';
import { Student, Course, Instrument } from '../types';
import Card from '../components/ui/Card';

const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [instrument, setInstrument] = useState<Instrument | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (!user) return;
        const studentData = await dataService.getStudentByUserId(user.id);
        setStudent(studentData || null);
        if (studentData?.instrumentId) {
          const instr = await dataService.getInstrumentById(studentData.instrumentId);
          setInstrument(instr || null);
        }
        // Obtener cursos matriculados
        if (studentData) {
          const enrollments = await dataService.getEnrollmentsByStudentId(studentData.id);
          const coursePromises = enrollments.map(e => dataService.getCourseById(e.courseId));
          const courseList = (await Promise.all(coursePromises)).filter(Boolean) as Course[];
          setCourses(courseList);
        }
      } catch (error) {
        setStudent(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (isLoading) return <PageContainer title="Perfil do Estudante"><div className="h-32 bg-gray-200 dark:bg-neutral-dark rounded animate-pulse"></div></PageContainer>;
  if (!student) return <PageContainer title="Perfil do Estudante"><p>No se encontraron datos del estudiante.</p></PageContainer>;

  return (
    <PageContainer title="Perfil do Estudante">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Datos Personales" className="md:col-span-1">
          <div className="flex flex-col items-center">
            <img src={user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&size=128&background=2563EB&color=fff&rounded=true`} alt="Foto perfil" className="w-24 h-24 rounded-full mb-2" />
            <div className="text-lg font-bold">{student.firstName} {student.lastName}</div>
            <div className="text-sm text-neutral-medium">{student.email}</div>
            <div className="text-sm mt-2">{student.address || <span className='text-neutral-medium'>Sin dirección</span>}</div>
            <div className="text-sm">{student.phoneNumber || <span className='text-neutral-medium'>Sin teléfono</span>}</div>
          </div>
        </Card>
        <Card title="Instrumento" className="md:col-span-1">
          <div className="mb-2"><b>Instrumento:</b> {instrument?.name || 'N/D'}</div>
        </Card>
        <Card title="Cursos Matriculados" className="md:col-span-1">
          <ul className="list-disc pl-5">
            {courses.length > 0 ? courses.map((c, i) => <li key={i}>{c.name}</li>) : <li>No hay cursos matriculados</li>}
          </ul>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Historial Académico">
          <p className="text-neutral-medium">(Próximamente: historial real de calificaciones y cursos completados)</p>
        </Card>
        <Card title="Documentación">
          <p className="text-neutral-medium">(Próximamente: descarga de documentos y matrículas)</p>
        </Card>
      </div>
    </PageContainer>
  );
};

export default StudentProfilePage;

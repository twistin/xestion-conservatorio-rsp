import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Card from '../components/ui/Card';

const StudentProfilePage: React.FC = () => {
  const { user } = useAuth();

  // Simulación de datos de ejemplo
  const studentData = {
    nombre: user?.firstName + ' ' + user?.lastName,
    email: user?.email,
    direccion: 'Calle Exemplo 123',
    telefono: '600 123 456',
    foto: user?.avatarUrl || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&size=128&background=2563EB&color=fff&rounded=true`,
    tutor: 'Prof. Alicia López',
    instrumento: 'Piano',
    cursos: ['Piano Básico', 'Lenguaje Musical 1'],
    historial: [
      { curso: 'Piano Básico', año: 2024, nota: '8.5' },
      { curso: 'Lenguaje Musical 1', año: 2024, nota: '7.8' },
    ],
    documentos: [
      { nombre: 'Matrícula 2024', url: '#' },
      { nombre: 'Seguro Escolar', url: '#' },
    ]
  };

  return (
    <PageContainer title="Perfil do Estudante">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card title="Datos Personales" className="md:col-span-1">
          <div className="flex flex-col items-center">
            <img src={studentData.foto} alt="Foto perfil" className="w-24 h-24 rounded-full mb-2" />
            <div className="text-lg font-bold">{studentData.nombre}</div>
            <div className="text-sm text-neutral-medium">{studentData.email}</div>
            <div className="text-sm mt-2">{studentData.direccion}</div>
            <div className="text-sm">{studentData.telefono}</div>
          </div>
        </Card>
        <Card title="Tutor/a e Instrumento" className="md:col-span-1">
          <div className="mb-2"><b>Tutor/a:</b> {studentData.tutor}</div>
          <div><b>Instrumento:</b> {studentData.instrumento}</div>
        </Card>
        <Card title="Cursos Matriculados" className="md:col-span-1">
          <ul className="list-disc pl-5">
            {studentData.cursos.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card title="Historial Académico">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-neutral-medium">
                <th>Curso</th>
                <th>Año</th>
                <th>Nota</th>
              </tr>
            </thead>
            <tbody>
              {studentData.historial.map((h, i) => (
                <tr key={i} className="border-b border-neutral-light">
                  <td>{h.curso}</td>
                  <td>{h.año}</td>
                  <td>{h.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
        <Card title="Documentación">
          <ul className="list-disc pl-5">
            {studentData.documentos.map((doc, i) => (
              <li key={i}><a href={doc.url} className="text-primary underline">{doc.nombre}</a></li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
};

export default StudentProfilePage;

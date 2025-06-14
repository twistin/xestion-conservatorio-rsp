import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Student, Instrument, UserRole, TableColumn } from '../types';
import * as dataService from '../services/dataService';
import { ICONS } from '../constants';
import StudentForm from '../components/students/StudentForm'; 
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

// ErrorBoundary local para evitar pantallas en branco
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded text-red-900 text-center">
          <b>Ocurrió un erro inesperado nesta páxina.</b><br />
          Por favor, recarga ou contacta co administrador se persiste.
        </div>
      );
    }
    return this.props.children;
  }
}

const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const fetchStudentsAndInstruments = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsData, instrumentsData] = await Promise.all([
        dataService.getStudents(),
        dataService.getInstruments(),
      ]);
      setStudents(studentsData);
      setInstruments(instrumentsData);
    } catch (error) {
      console.error("Erro ao obter alumnado ou instrumentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudentsAndInstruments();
  }, [fetchStudentsAndInstruments]);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleDeleteStudent = async (studentId: string) => {
    if (window.confirm('Está seguro/a de que quere eliminar este/a alumno/a?')) {
      try {
        await dataService.deleteItem(studentId, 'student');
        fetchStudentsAndInstruments(); 
      } catch (error) {
        console.error("Erro ao eliminar alumno/a:", error);
      }
    }
  };
  
  const handleSaveStudent = async (studentData: Student) => {
    try {
      if (selectedStudent) {
        await dataService.updateItem(studentData, 'student');
      } else {
        await dataService.addItem(studentData, 'student');
      }
      fetchStudentsAndInstruments(); 
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao gardar alumno/a:", error);
    }
  };


  const columns: TableColumn<Student>[] = [
    { key: 'firstName', header: 'Nome' },
    { key: 'lastName', header: 'Apelidos' },
    { key: 'email', header: 'Correo Electrónico' },
    { 
      key: 'instrumentId', 
      header: 'Instrumento',
      render: (student) => instruments.find(i => i.id === student.instrumentId)?.name || 'N/D'
    },
    { key: 'enrollmentDate', header: 'Data de Matrícula', render: (student) => new Date(student.enrollmentDate).toLocaleDateString('gl-ES') },
    {
      key: 'actions',
      header: 'Accións',
      render: (student) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditStudent(student)} title="Editar">
            <i className={ICONS.edit}></i>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteStudent(student.id)} className="text-status-red hover:bg-red-100" title="Eliminar">
            <i className={ICONS.delete}></i>
          </Button>
        </div>
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'Alumnado', current: true },
  ];

  if (isLoading && students.length === 0) { 
      return <Spinner fullPage message="Cargando alumnado..." />;
  }

  return (
    <ErrorBoundary>
      <PageContainer
        title="Xestionar Alumnado"
        breadcrumbs={breadcrumbs}
        headerActions={
          <Button onClick={handleAddStudent} iconLeft={ICONS.add}>
            Engadir Alumno/a
          </Button>
        }
      >
        { !isLoading && students.length === 0 ? (
          <EmptyState 
            icon={ICONS.students}
            title="Non se atopou alumnado"
            description="Comece engadindo o seu primeiro alumno/a."
            action={<Button onClick={handleAddStudent} iconLeft={ICONS.add}>Engadir Alumno/a</Button>}
          />
        ) : (
          <Table<Student>
              columns={columns}
              data={students}
              isLoading={isLoading} 
              onRowClick={handleEditStudent} 
              searchableKeys={['firstName', 'lastName', 'email']}
          />
        )}

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedStudent ? 'Editar Alumno/a' : 'Engadir Novo/a Alumno/a'}
            size="lg"
          >
            <StudentForm 
              student={selectedStudent} 
              instruments={instruments}
              onSave={handleSaveStudent} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </Modal>
        )}
      </PageContainer>
    </ErrorBoundary>
  );
};

export default StudentsPage;
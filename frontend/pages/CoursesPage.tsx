import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Course, Professor, CourseLevel, TableColumn, SelectOption } from '../types';
import * as dataService from '../services/dataService';
import { ICONS } from '../constants';
import CourseForm from '../components/courses/CourseForm';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';

// ErrorBoundary local para evitar pantallas en blanco
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

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const fetchCoursesAndProfessors = useCallback(async () => {
    setIsLoading(true);
    try {
      const [coursesData, professorsData] = await Promise.all([
        dataService.getCourses(),
        dataService.getProfessors(),
      ]);
      setCourses(coursesData);
      setProfessors(professorsData);
    } catch (error) {
      console.error("Erro ao obter cursos ou profesorado:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCoursesAndProfessors();
  }, [fetchCoursesAndProfessors]);

  const handleAddCourse = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (course: Course | undefined | null) => {
    if (!course) {
      console.warn('handleEditCourse: curso no definido', course);
      return;
    }
    console.log('Abriendo modal para curso:', course);
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm('Está seguro/a de que quere eliminar este curso?')) {
      try {
        await dataService.deleteItem(courseId, 'course');
        fetchCoursesAndProfessors();
      } catch (error) {
        console.error("Erro ao eliminar curso:", error);
      }
    }
  };
  
  const handleSaveCourse = async (courseData: Course) => {
    // Transformar a snake_case y solo los campos requiridos
    const snakeCaseCourse: any = {
      name: courseData.name,
      description: courseData.description,
      level: courseData.level,
      teacher: courseData.teacherId || null,
      start_date: courseData.startDate || null,
      end_date: courseData.endDate || null,
      room: courseData.room || null,
    };
    // Eliminar campos vacíos/null
    Object.keys(snakeCaseCourse).forEach(key => {
      if (snakeCaseCourse[key] === undefined || snakeCaseCourse[key] === null || snakeCaseCourse[key] === '') {
        delete snakeCaseCourse[key];
      }
    });
    try {
      if (selectedCourse) {
        await dataService.updateItem({ ...snakeCaseCourse, id: selectedCourse.id }, 'course');
      } else {
        await dataService.addItem(snakeCaseCourse, 'course');
      }
      fetchCoursesAndProfessors();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Erro ao gardar curso:", error);
    }
  };

  const columns: TableColumn<Course>[] = [
    { key: 'name', header: 'Nome do Curso' },
    { key: 'level', header: 'Nivel' },
    { 
      key: 'teacherId', 
      header: 'Profesor/a',
      render: (course) => {
        const prof = professors.find(p => p.id === course.teacherId);
        return prof ? `${prof.firstName} ${prof.lastName}` : 'N/D';
      }
    },
    { key: 'startDate', header: 'Data de Inicio', render: (course) => course.startDate ? new Date(course.startDate).toLocaleDateString('gl-ES') : 'N/D' },
    { key: 'room', header: 'Aula' },
    {
      key: 'actions',
      header: 'Accións',
      render: (course) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditCourse(course)} title="Editar">
            <i className={ICONS.edit}></i>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteCourse(course.id)} className="text-status-red hover:bg-red-100" title="Eliminar">
            <i className={ICONS.delete}></i>
          </Button>
        </div>
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'Cursos', current: true },
  ];

  if (isLoading && courses.length === 0) {
      return <Spinner fullPage message="Cargando cursos..." />;
  }

  return (
    <ErrorBoundary>
      <PageContainer
        title="Xestionar Cursos"
        breadcrumbs={breadcrumbs}
        headerActions={
          <Button onClick={handleAddCourse} iconLeft={ICONS.add}>
            Engadir Curso
          </Button>
        }
      >
        { !isLoading && courses.length === 0 ? (
            <EmptyState 
              icon={ICONS.courses}
              title="Non se atoparon cursos"
              description="Comece engadindo o seu primeiro curso."
              action={<Button onClick={handleAddCourse} iconLeft={ICONS.add}>Engadir Curso</Button>}
            />
          ) : (
          <Table<Course>
              columns={columns}
              data={courses}
              isLoading={isLoading}
              onRowClick={handleEditCourse}
              searchableKeys={['name', 'level']}
          />
        )}

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title={selectedCourse ? 'Editar Curso' : 'Engadir Novo Curso'}
            size="lg"
          >
            <CourseForm 
              course={selectedCourse} 
              professors={professors}
              onSave={handleSaveCourse} 
              onCancel={() => setIsModalOpen(false)} 
            />
          </Modal>
        )}
      </PageContainer>
    </ErrorBoundary>
  );
};

export default CoursesPage;
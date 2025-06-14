import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Table from '../components/ui/Table';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { Professor, TableColumn } from '../types';
import * as dataService from '../services/dataService';
import { ICONS } from '../constants';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ProfessorForm from '../components/professors/ProfessorForm';
import ProfessorFicha from '../components/professors/ProfessorFicha';

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

const ProfessorsPage: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const fetchProfessors = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await dataService.getProfessors();
      setProfessors(data);
    } catch (error) {
      console.error('Erro ao obter profesorado:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfessors();
  }, [fetchProfessors]);

  const handleAddProfessor = () => {
    setSelectedProfessor(null);
    setIsModalOpen(true);
  };

  const handleEditProfessor = (prof: Professor) => {
    setSelectedProfessor(prof);
    setShowEditForm(false);
    setIsModalOpen(true);
  };

  const handleDeleteProfessor = async (professorId: string) => {
    if (window.confirm('Está seguro/a de que quere eliminar este/a profesor/a?')) {
      try {
        await dataService.deleteItem(professorId, 'professor');
        fetchProfessors();
      } catch (error) {
        console.error('Erro ao eliminar profesor/a:', error);
      }
    }
  };

  const handleSaveProfessor = async (profData: Professor) => {
    try {
      if (selectedProfessor) {
        await dataService.updateItem(profData, 'professor');
      } else {
        await dataService.addItem(profData, 'professor');
      }
      fetchProfessors();
      setIsModalOpen(false);
      setShowEditForm(false);
    } catch (error) {
      console.error('Erro ao gardar profesor/a:', error);
    }
  };

  const columns: TableColumn<Professor>[] = [
    { key: 'firstName', header: 'Nome' },
    { key: 'lastName', header: 'Apelidos' },
    { key: 'email', header: 'Correo Electrónico' },
    { key: 'specialty', header: 'Especialidade' },
    { key: 'tutoringSchedule', header: 'Horario de Titoría' },
    { key: 'classrooms', header: 'Aula(s)' },
    {
      key: 'actions',
      header: 'Accións',
      render: (prof) => (
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" onClick={() => handleEditProfessor(prof)} title="Editar">
            <i className={ICONS.edit}></i>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleDeleteProfessor(prof.id)} className="text-status-red hover:bg-red-100" title="Eliminar">
            <i className={ICONS.delete}></i>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => { setSelectedProfessor(prof); setShowEditForm(false); setIsModalOpen(true); }} title="Ver ficha">
            <i className="fa-solid fa-address-card"></i>
          </Button>
        </div>
      ),
    },
  ];

  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'Profesorado', current: true },
  ];

  if (isLoading && professors.length === 0) {
    return <Spinner fullPage message="Cargando profesorado..." />;
  }

  return (
    <ErrorBoundary>
      <PageContainer
        title="Xestionar Profesorado"
        breadcrumbs={breadcrumbs}
        headerActions={
          <Button onClick={handleAddProfessor} iconLeft={ICONS.add}>
            Engadir Profesor/a
          </Button>
        }
      >
        { !isLoading && professors.length === 0 ? (
          <EmptyState
            icon={ICONS.professors}
            title="Non se atopou profesorado"
            description="Comece engadindo o seu primeiro profesor/a."
            action={<Button onClick={handleAddProfessor} iconLeft={ICONS.add}>Engadir Profesor/a</Button>}
          />
        ) : (
          <Table<Professor>
            columns={columns}
            data={professors}
            isLoading={isLoading}
            onRowClick={handleEditProfessor}
            searchableKeys={['firstName', 'lastName', 'email']}
          />
        )}

        {isModalOpen && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setShowEditForm(false); }}
            title={selectedProfessor && !showEditForm ? `Ficha de ${selectedProfessor.firstName} ${selectedProfessor.lastName}` : selectedProfessor ? 'Editar Profesor/a' : 'Engadir Novo/a Profesor/a'}
            size="lg"
          >
            {selectedProfessor && !showEditForm ? (
              <>
                <ProfessorFicha professor={selectedProfessor} />
                <div className="flex justify-end gap-2 mt-4 border-t pt-4">
                  <Button variant="primary" onClick={() => setIsModalOpen(false)}>
                    Pechar
                  </Button>
                  <Button variant="secondary" onClick={() => setShowEditForm(true)}>
                    Editar
                  </Button>
                </div>
              </>
            ) : (
              <ProfessorForm
                professor={selectedProfessor}
                onSave={handleSaveProfessor}
                onCancel={() => { setShowEditForm(false); setIsModalOpen(false); }}
              />
            )}
          </Modal>
        )}
      </PageContainer>
    </ErrorBoundary>
  );
};

export default ProfessorsPage;

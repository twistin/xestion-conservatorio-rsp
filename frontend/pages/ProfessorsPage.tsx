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

// Puedes crear un formulario similar a StudentForm para profesores si no existe
const ProfessorForm = ({ professor, onSave, onCancel }: { professor: Professor | null, onSave: (data: Professor) => void, onCancel: () => void }) => {
  const [form, setForm] = useState<Partial<Professor>>(professor || {});
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form as Professor);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label>Nome</label>
        <input className="input" value={form.firstName || ''} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
      </div>
      <div className="mb-4">
        <label>Apelidos</label>
        <input className="input" value={form.lastName || ''} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} required />
      </div>
      <div className="mb-4">
        <label>Correo electrónico</label>
        <input className="input" type="email" value={form.email || ''} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
      </div>
      <div className="mb-4">
        <label>Especialidade</label>
        <input className="input" value={form.specialty || ''} onChange={e => setForm(f => ({ ...f, specialty: e.target.value }))} required />
      </div>
      <div className="mb-4">
        <label>Horario de titoría</label>
        <input className="input" value={form.tutoringSchedule || ''} onChange={e => setForm(f => ({ ...f, tutoringSchedule: e.target.value }))} placeholder="Ex: Luns 16:00-17:00" />
      </div>
      <div className="mb-4">
        <label>Aula(s)</label>
        <input className="input" value={form.classrooms || ''} onChange={e => setForm(f => ({ ...f, classrooms: e.target.value }))} placeholder="Ex: 101, 102" />
      </div>
      <div className="mb-4">
        <label>Data de contratación</label>
        <input className="input" type="date" value={form.hireDate || ''} onChange={e => setForm(f => ({ ...f, hireDate: e.target.value }))} required />
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit">Gardar</Button>
      </div>
    </form>
  );
};

const ProfessorsPage: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfessor, setSelectedProfessor] = useState<Professor | null>(null);

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
          onClose={() => setIsModalOpen(false)}
          title={selectedProfessor ? 'Editar Profesor/a' : 'Engadir Novo/a Profesor/a'}
          size="lg"
        >
          <ProfessorForm
            professor={selectedProfessor}
            onSave={handleSaveProfessor}
            onCancel={() => setIsModalOpen(false)}
          />
        </Modal>
      )}
    </PageContainer>
  );
};

export default ProfessorsPage;

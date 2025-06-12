import React, { useState, useEffect } from 'react';
import { Course, Professor, CourseLevel, SelectOption } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface CourseFormProps {
  course?: Course | null;
  professors: Professor[];
  onSave: (course: Course) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ course, professors, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Course>>({
    name: '',
    description: '',
    level: CourseLevel.Elemental,
    teacherId: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    room: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Course, string>>>({});

  useEffect(() => {
    if (course) {
      setFormData({
        ...course,
        startDate: course.startDate ? course.startDate.split('T')[0] : '',
        endDate: course.endDate ? course.endDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        name: '', description: '', level: CourseLevel.Elemental, teacherId: '',
        startDate: new Date().toISOString().split('T')[0], endDate: '', room: '',
      });
    }
  }, [course]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     if (errors[name as keyof Course]) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Course, string>> = {};
    if (!formData.name?.trim()) newErrors.name = 'O nome do curso é obrigatorio.';
    if (!formData.description?.trim()) newErrors.description = 'A descrición é obrigatoria.';
    if (!formData.level) newErrors.level = 'O nivel é obrigatorio.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    const courseDataToSave: Course = {
      id: course?.id || `course-new-${Date.now()}`,
      name: formData.name!,
      description: formData.description!,
      level: formData.level!,
      teacherId: formData.teacherId || undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      room: formData.room || undefined,
    };
    onSave(courseDataToSave);
  };

  const professorOptions: SelectOption[] = professors.map(prof => ({
    value: prof.id,
    label: `${prof.firstName} ${prof.lastName}`,
  }));

  const levelOptions: SelectOption<CourseLevel>[] = [
    { value: CourseLevel.Elemental, label: 'Grado elemental' },
    { value: CourseLevel.Profesional, label: 'Grado profesional' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input label="Nome do Curso" name="name" value={formData.name || ''} onChange={handleChange} error={errors.name} required />
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-neutral-dark dark:text-neutral-light mb-1">Descrición</label>
        <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description || ''}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 dark:bg-neutral-dark dark:border-neutral-medium dark:text-white ${errors.description ? 'border-status-red focus:ring-status-red' : 'border-gray-300 focus:ring-primary'}`}
        />
        {errors.description && <p className="mt-1 text-xs text-status-red">{errors.description}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select label="Nivel" name="level" options={levelOptions} value={formData.level || ''} onChange={handleChange} error={errors.level} required />
        <Select label="Profesor/a (Opcional)" name="teacherId" options={professorOptions} value={formData.teacherId || ''} onChange={handleChange} placeholder="Asignar un/ha profesor/a" />
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Data de Inicio (Opcional)" name="startDate" type="date" value={formData.startDate || ''} onChange={handleChange} />
        <Input label="Data de Fin (Opcional)" name="endDate" type="date" value={formData.endDate || ''} onChange={handleChange} />
      </div>
      <Input label="Aula (Opcional)" name="room" value={formData.room || ''} onChange={handleChange} />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary">
          {course ? 'Gardar Cambios' : 'Engadir Curso'}
        </Button>
      </div>
    </form>
  );
};

export default CourseForm;
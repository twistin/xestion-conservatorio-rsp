import React, { useState, useEffect } from 'react';
import { Professor } from '../../types';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface ProfessorFormProps {
  professor?: Professor | null;
  onSave: (professor: Professor) => void;
  onCancel: () => void;
}

const ProfessorForm: React.FC<ProfessorFormProps> = ({ professor, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Professor>>({
    firstName: '',
    lastName: '',
    email: '',
    specialty: '',
    tutoringSchedule: '',
    classrooms: '',
    hireDate: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Professor, string>>>({});

  useEffect(() => {
    if (professor) {
      setFormData({
        ...professor,
        hireDate: professor.hireDate ? professor.hireDate.split('T')[0] : '',
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        specialty: '',
        tutoringSchedule: '',
        classrooms: '',
        hireDate: '',
        phoneNumber: '',
      });
    }
  }, [professor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Professor]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Professor, string>> = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'O nome é obrigatorio.';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Os apelidos son obrigatorios.';
    if (!formData.email?.trim()) {
      newErrors.email = 'O correo electrónico é obrigatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'O correo electrónico non é válido.';
    }
    if (!formData.specialty?.trim()) newErrors.specialty = 'A especialidade é obrigatoria.';
    if (!formData.hireDate) newErrors.hireDate = 'A data de contratación é obrigatoria.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Generar userId si es nuevo
    const userId = professor?.userId || `user-prof-${Date.now()}`;
    onSave({
      ...professor,
      ...formData,
      userId,
      hireDate: formData.hireDate,
    } as Professor);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col items-center justify-center pt-8 pb-4 border-b border-neutral-100 dark:border-neutral-medium" style={{ background: 'linear-gradient(90deg, #064e3b 0%, #059669 60%, #34d399 100%)' }}>
        <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-5xl shadow-2xl mb-2 border-4" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', borderColor: '#34d399' }}>
          <span className="font-bold tracking-wide" style={{ color: '#059669' }}>{formData.firstName?.[0]}{formData.lastName?.[0]}</span>
        </div>
        <h2 className="text-4xl font-extrabold text-white mb-1 text-center drop-shadow-lg" style={{ fontFamily: 'Fira Sans, Fira, Arial, sans-serif', letterSpacing: '0.02em' }}>{formData.firstName} {formData.lastName}</h2>
        {professor?.id && (
          <div className="flex flex-wrap gap-2 justify-center mt-1">
            <span className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-semibold">ID: {professor.id}</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome" name="firstName" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} required />
        <Input label="Apelidos" name="lastName" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} required />
      </div>
      <Input label="Correo Electrónico" name="email" type="email" value={formData.email || ''} onChange={handleChange} error={errors.email} required />
      <Input label="Especialidade" name="specialty" value={formData.specialty || ''} onChange={handleChange} error={errors.specialty} required />
      <Input label="Horario de Titoría (Opcional)" name="tutoringSchedule" value={formData.tutoringSchedule || ''} onChange={handleChange} />
      <Input label="Aula(s) (Opcional)" name="classrooms" value={formData.classrooms || ''} onChange={handleChange} />
      <Input label="Data de Contratación" name="hireDate" type="date" value={formData.hireDate || ''} onChange={handleChange} error={errors.hireDate} required />
      <Input label="Número de Teléfono (Opcional)" name="phoneNumber" type="tel" value={formData.phoneNumber || ''} onChange={handleChange} />
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary">
          {professor ? 'Gardar Cambios' : 'Engadir Profesor/a'}
        </Button>
      </div>
    </form>
  );
};

export default ProfessorForm;

import React, { useState, useEffect } from 'react';
import { Student, Instrument, SelectOption, UserRole } from '../../types';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import * as dataService from '../../services/dataService';


interface StudentFormProps {
  student?: Student | null;
  instruments: Instrument[];
  onSave: (student: Student) => void;
  onCancel: () => void;
}

const StudentForm: React.FC<StudentFormProps> = ({ student, instruments, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Student>>({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: '',
    instrumentId: '',
    enrollmentDate: new Date().toISOString().split('T')[0], 
    address: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Student, string>>>({});

  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
        enrollmentDate: student.enrollmentDate ? student.enrollmentDate.split('T')[0] : new Date().toISOString().split('T')[0],
      });
    } else {
       setFormData({ 
        firstName: '', lastName: '', email: '', dateOfBirth: '', instrumentId: '',
        enrollmentDate: new Date().toISOString().split('T')[0], address: '', phoneNumber: '',
      });
    }
  }, [student]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Student]) {
        setErrors(prev => ({...prev, [name]: undefined}));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof Student, string>> = {};
    if (!formData.firstName?.trim()) newErrors.firstName = 'O nome é obrigatorio.';
    if (!formData.lastName?.trim()) newErrors.lastName = 'Os apelidos son obrigatorios.';
    if (!formData.email?.trim()) {
        newErrors.email = 'O correo electrónico é obrigatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'O correo electrónico non é válido.';
    }
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'A data de nacemento é obrigatoria.';
    if (!formData.instrumentId) newErrors.instrumentId = 'O instrumento é obrigatorio.';
    if (!formData.enrollmentDate) newErrors.enrollmentDate = 'A data de matrícula é obrigatoria.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const userId = student?.userId || `user-new-${Date.now()}`; 
    
    const userForStudent = await dataService.getUserById(userId) ?? {
        id: userId,
        username: formData.email!, 
        email: formData.email!,
        firstName: formData.firstName!,
        lastName: formData.lastName!,
        role: UserRole.Student,
    };

    const studentDataToSave: Student = {
      id: student?.id || `stud-new-${Date.now()}`,
      userId: userForStudent.id,
      firstName: formData.firstName!,
      lastName: formData.lastName!,
      email: formData.email!,
      dateOfBirth: formData.dateOfBirth!,
      instrumentId: formData.instrumentId!,
      enrollmentDate: formData.enrollmentDate!,
      address: formData.address,
      phoneNumber: formData.phoneNumber,
    };
    // Transformar a snake_case para el backend
    const snakeCaseStudent = {
      id: studentDataToSave.id,
      user_id: studentDataToSave.userId,
      first_name: studentDataToSave.firstName,
      last_name: studentDataToSave.lastName,
      email: studentDataToSave.email,
      date_of_birth: studentDataToSave.dateOfBirth,
      instrument_id: studentDataToSave.instrumentId,
      enrollment_date: studentDataToSave.enrollmentDate,
      address: studentDataToSave.address,
      phone_number: studentDataToSave.phoneNumber,
    };
    onSave(snakeCaseStudent as any);
  };

  const instrumentOptions: SelectOption[] = instruments.map(instr => ({
    value: instr.id,
    label: instr.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Nome" name="firstName" id="student-firstName" autoComplete="given-name" value={formData.firstName || ''} onChange={handleChange} error={errors.firstName} required />
        <Input label="Apelidos" name="lastName" id="student-lastName" autoComplete="family-name" value={formData.lastName || ''} onChange={handleChange} error={errors.lastName} required />
      </div>
      <Input label="Correo Electrónico" name="email" id="student-email" type="email" autoComplete="email" value={formData.email || ''} onChange={handleChange} error={errors.email} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Data de Nacemento" name="dateOfBirth" id="student-dateOfBirth" type="date" autoComplete="bday" value={formData.dateOfBirth || ''} onChange={handleChange} error={errors.dateOfBirth} required />
        <Select label="Instrumento" name="instrumentId" id="student-instrumentId" options={instrumentOptions} value={formData.instrumentId || ''} onChange={handleChange} error={errors.instrumentId} placeholder="Seleccione un instrumento" required autoComplete="off" />
      </div>
      <Input label="Data de Matrícula" name="enrollmentDate" id="student-enrollmentDate" type="date" autoComplete="off" value={formData.enrollmentDate || ''} onChange={handleChange} error={errors.enrollmentDate} required />
      <Input label="Enderezo (Opcional)" name="address" id="student-address" autoComplete="street-address" value={formData.address || ''} onChange={handleChange} />
      <Input label="Número de Teléfono (Opcional)" name="phoneNumber" id="student-phoneNumber" type="tel" autoComplete="tel" value={formData.phoneNumber || ''} onChange={handleChange} />
      
      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" variant="primary">
          {student ? 'Gardar Cambios' : 'Engadir Alumno/a'}
        </Button>
      </div>
    </form>
  );
};

export default StudentForm;
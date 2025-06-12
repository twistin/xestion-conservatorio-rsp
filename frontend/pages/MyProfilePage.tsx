
import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { User, Student, Professor, UserRole } from '../types';
import * as dataService from '../services/dataService';
import { ICONS } from '../constants';

const MyProfilePage: React.FC = () => {
  const { user: authUser, isLoading: authLoading, login } = useAuth(); 
  const [profileData, setProfileData] = useState<Partial<User & Student & Professor>>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return;
      setIsLoading(true);
      try {
        let specificProfile: Partial<Student & Professor> = {};
        if (authUser.role === UserRole.Student) {
          specificProfile = await dataService.getStudentByUserId(authUser.id) || {};
        } else if (authUser.role === UserRole.Professor) {
          specificProfile = await dataService.getProfessorByUserId(authUser.id) || {};
        }
        setProfileData({ ...authUser, ...specificProfile });
      } catch (error) {
        console.error("Erro ao obter datos do perfil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (authUser) {
      fetchProfile();
    } else if (!authLoading) { 
        setIsLoading(false);
    }
  }, [authUser, authLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!authUser) return;
    setIsLoading(true);
    try {
      const updatedUser = { ...authUser, ...profileData } as User; 
      localStorage.setItem('authUser', JSON.stringify(updatedUser)); 
      await login(updatedUser.username, 'mockPassword'); 

      setIsEditing(false);
    } catch (error) {
      console.error("Erro ao gardar perfil:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'O Meu Perfil', current: true },
  ];

  if (isLoading || authLoading) {
    return <Spinner fullPage message="Cargando perfil..." />;
  }

  if (!authUser || !profileData.id) {
    return <PageContainer title="O Meu Perfil" breadcrumbs={breadcrumbs}><p>Non se puido cargar o perfil.</p></PageContainer>;
  }

  return (
    <PageContainer title="O Meu Perfil" breadcrumbs={breadcrumbs}>
      <Card>
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <img
            src={profileData.avatarUrl || `https://ui-avatars.com/api/?name=${profileData.firstName}+${profileData.lastName}&size=128&background=2563EB&color=fff&rounded=true`}
            alt="Avatar do Perfil"
            className="w-32 h-32 rounded-full object-cover shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold font-display text-neutral-dark dark:text-white">{profileData.firstName} {profileData.lastName}</h2>
            <p className="text-neutral-medium dark:text-gray-400">{profileData.email}</p>
            <p className="text-sm text-primary dark:text-accent font-semibold">{profileData.role}</p>
             {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" iconLeft={ICONS.edit} className="mt-4">
                Editar Perfil
              </Button>
            )}
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Input label="Nome" name="firstName" value={profileData.firstName || ''} onChange={handleChange} disabled={!isEditing} />
            <Input label="Apelidos" name="lastName" value={profileData.lastName || ''} onChange={handleChange} disabled={!isEditing} />
            <Input label="Correo Electrónico" name="email" type="email" value={profileData.email || ''} onChange={handleChange} disabled={!isEditing} />
            <Input label="Nome de Usuario" name="username" value={profileData.username || ''} disabled /> 
            
            {profileData.role === UserRole.Student && (
              <>
                <Input label="Data de Nacemento" name="dateOfBirth" type="date" value={profileData.dateOfBirth?.split('T')[0] || ''} onChange={handleChange} disabled={!isEditing} />
                <Input label="Data de Matrícula" name="enrollmentDate" type="date" value={profileData.enrollmentDate?.split('T')[0] || ''} disabled />
                <Input label="Número de Teléfono" name="phoneNumber" type="tel" value={profileData.phoneNumber || ''} onChange={handleChange} disabled={!isEditing} wrapperClassName="md:col-span-2"/>
                <Input label="Enderezo" name="address" value={profileData.address || ''} onChange={handleChange} disabled={!isEditing} wrapperClassName="md:col-span-2"/>
              </>
            )}
            {profileData.role === UserRole.Professor && (
              <>
                <Input label="Especialidade" name="specialty" value={profileData.specialty || ''} onChange={handleChange} disabled={!isEditing} />
                <Input label="Data de Contratación" name="hireDate" type="date" value={profileData.hireDate?.split('T')[0] || ''} disabled />
                <Input label="Número de Teléfono" name="phoneNumber" type="tel" value={profileData.phoneNumber || ''} onChange={handleChange} disabled={!isEditing} wrapperClassName="md:col-span-2"/>
              </>
            )}
          </div>

          {isEditing && (
            <div className="mt-8 flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => { setIsEditing(false); /* TODO: Reset changes if needed */ }}>Cancelar</Button>
              <Button type="submit" variant="primary" isLoading={isLoading}>Gardar Cambios</Button>
            </div>
          )}
        </form>
      </Card>
    </PageContainer>
  );
};

export default MyProfilePage;
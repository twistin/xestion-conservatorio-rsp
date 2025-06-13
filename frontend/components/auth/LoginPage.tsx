import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { APP_NAME, ICONS, ROUTES } from '../../constants';
import { UserRole } from '../../types';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const success = await login(username, password);
    if (success) {
      navigate(ROUTES.dashboard);
    } else {
      setError('Nome de usuario ou contrasinal non válidos. Proba con "admin", "jdoe", ou "bwayne" (o campo de contrasinal ignórase para a demo).');
    }
  };

  const quickLogin = async (user: string) => {
    const success = await login(user, 'password'); // Password is not used in mock
    if (success) {
      navigate(ROUTES.dashboard);
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-neutral-light dark:bg-dark-surface">
      {/* Logo centrado arriba del texto principal, con padding vertical y mayor tamaño */}
      <img src="/cmus.png" alt="Logo Conservatorio" className="mx-auto my-8 w-40 h-40 object-contain" />
      <div className="bg-white dark:bg-dark-surface shadow-2xl rounded-xl p-8 md:p-12 w-full max-w-md transform transition-all duration-500 hover:scale-105">
        <div className="text-center mb-8">
          {/* Eliminadas las corcheas/música, solo el logo arriba */}
          <h1 className="text-3xl font-bold font-display text-neutral-dark dark:text-white">{APP_NAME}</h1>
          <p className="text-neutral-medium dark:text-gray-400 mt-1">Accede ao teu portal do conservatorio</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-status-red text-status-red dark:text-red-300 rounded-md text-sm">
            <i className={`${ICONS.error} mr-2`}></i> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Nome de usuario"
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ex: admin, jdoe, bwayne"
            iconLeft={<i className="fa-solid fa-user"></i>}
            required
            autoFocus
          />
          <Input
            label="Contrasinal"
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Introduce o teu contrasinal"
            iconLeft={<i className="fa-solid fa-lock"></i>}
            required
          />
          <Button type="submit" isLoading={isLoading} className="w-full" size="lg">
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>
        <div className="mt-6 text-center">
            <p className="text-sm text-neutral-medium dark:text-gray-400 mb-2">Inicios de sesión rápidos (Demo):</p>
            <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={() => quickLogin('admin')} variant="outline" size="sm">Admin</Button>
                <Button onClick={() => quickLogin('jdoe')} variant="outline" size="sm">Profesor</Button>
                <Button onClick={() => quickLogin('bwayne')} variant="outline" size="sm">Alumno</Button>
            </div>
        </div>
        <p className="mt-8 text-xs text-center text-neutral-medium dark:text-gray-500">
          © {new Date().getFullYear()} {APP_NAME}. Inspirado pola creatividade.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
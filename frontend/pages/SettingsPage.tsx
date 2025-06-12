
import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import { useDarkMode } from '../hooks/useDarkMode';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';

const SettingsPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: 'Configuración', current: true },
  ];

  return (
    <PageContainer title="Configuración" breadcrumbs={breadcrumbs}>
      <div className="max-w-2xl mx-auto">
        <Card title="Aparencia">
          <div className="flex justify-between items-center py-3">
            <div>
              <p className="font-medium text-neutral-dark dark:text-white">Modo Escuro</p>
              <p className="text-sm text-neutral-medium dark:text-gray-400">
                Cambia entre temas claro e escuro.
              </p>
            </div>
            <Button
              onClick={toggleDarkMode}
              variant="outline"
              iconLeft={isDarkMode ? ICONS.lightMode : ICONS.darkMode}
            >
              {isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Escuro'}
            </Button>
          </div>
        </Card>

        <Card title="Configuración da Conta" className="mt-6">
           <p className="text-sm text-neutral-medium dark:text-gray-400">Xestiona aquí as preferencias da túa conta. Máis opcións proximamente.</p>
        </Card>
      </div>
    </PageContainer>
  );
};

export default SettingsPage;
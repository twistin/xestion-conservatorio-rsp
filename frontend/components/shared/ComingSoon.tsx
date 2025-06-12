
import React from 'react';
import PageContainer from '../layout/PageContainer';
import EmptyState from '../ui/EmptyState';
import { ICONS } from '../../constants';

interface ComingSoonProps {
  featureName: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ featureName }) => {
  return (
    <PageContainer title={featureName}>
      <EmptyState
        icon="fa-solid fa-person-digging"
        title={`${featureName} - Proximamente!`}
        description={`Estamos a traballar arreo para desenvolver esta funcionalidade. Por favor, volve máis tarde para ver as actualizacións sobre ${featureName.toLowerCase()}.`}
        className="mt-8"
      />
    </PageContainer>
  );
};

export default ComingSoon;
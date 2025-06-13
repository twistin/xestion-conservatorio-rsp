import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentAIPage: React.FC = () => (
  <PageContainer title="Asistente Educativo / IA">
    <ComingSoon message="Aquí tendrás recomendaciones personalizadas, análisis de progreso y planificador de estudio." />
  </PageContainer>
);

export default StudentAIPage;

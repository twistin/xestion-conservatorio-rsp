import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentActivitiesPage: React.FC = () => (
  <PageContainer title="Actividades Artísticas">
    <ComingSoon message="Aquí verás tu participación en agrupaciones, conciertos y podrás subir grabaciones." />
  </PageContainer>
);

export default StudentActivitiesPage;

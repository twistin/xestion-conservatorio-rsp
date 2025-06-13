import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentResourcesPage: React.FC = () => (
  <PageContainer title="Recursos Educativos">
    <ComingSoon message="Aquí tendrás acceso a partituras, audios, vídeos y foros de consulta." />
  </PageContainer>
);

export default StudentResourcesPage;

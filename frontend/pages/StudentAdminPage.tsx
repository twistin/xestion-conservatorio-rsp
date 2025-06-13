import React from 'react';
import PageContainer from '../components/layout/PageContainer';
import ComingSoon from '../components/shared/ComingSoon';

const StudentAdminPage: React.FC = () => (
  <PageContainer title="Gestión Administrativa">
    <ComingSoon message="Aquí podrás consultar tu matrícula, pagos, certificados y becas." />
  </PageContainer>
);

export default StudentAdminPage;

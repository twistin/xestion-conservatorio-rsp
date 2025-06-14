import React, { useState } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ICONS } from '../constants';

const ReportsPage: React.FC = () => {
  const [filter, setFilter] = useState<'matricula'|'ocupacion'|'pagos'|'evaluaciones'|'todos'>('todos');
  // Placeholders para datos reales y exportaciones
  const handleExport = (type: 'pdf'|'excel') => {
    alert(`Exportar informe en formato ${type.toUpperCase()} (próximamente)`);
  };

  return (
    <PageContainer title="Informes Xerais e Analíticos" breadcrumbs={[
      { label: 'Panel de Control', href: '/dashboard' },
      { label: 'Informes', current: true },
    ]}>
      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant={filter==='todos'?'primary':'outline'} onClick={()=>setFilter('todos')}>Todos</Button>
        <Button variant={filter==='matricula'?'primary':'outline'} onClick={()=>setFilter('matricula')}>Matrícula</Button>
        <Button variant={filter==='ocupacion'?'primary':'outline'} onClick={()=>setFilter('ocupacion')}>Ocupación</Button>
        <Button variant={filter==='pagos'?'primary':'outline'} onClick={()=>setFilter('pagos')}>Pagos</Button>
        <Button variant={filter==='evaluaciones'?'primary':'outline'} onClick={()=>setFilter('evaluaciones')}>Avaliacións</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Reportes generales */}
        {(filter==='todos'||filter==='matricula') && (
          <Card title="Informe de Matrícula">
            <div className="flex items-center gap-2 mb-2"><i className={ICONS.students + ' text-xl text-blue-500'}></i><span className="text-neutral-medium text-sm">Resumo de altas, baixas e evolución do alumnado.</span></div>
            <Button variant="secondary" onClick={()=>handleExport('pdf')}>Exportar PDF</Button>
            <Button variant="outline" className="ml-2" onClick={()=>handleExport('excel')}>Exportar Excel</Button>
          </Card>
        )}
        {(filter==='todos'||filter==='ocupacion') && (
          <Card title="Informe de Ocupación">
            <div className="flex items-center gap-2 mb-2"><i className={ICONS.courses + ' text-xl text-purple-500'}></i><span className="text-neutral-medium text-sm">Porcentaxe de prazas cubertas por curso e nivel.</span></div>
            <Button variant="secondary" onClick={()=>handleExport('pdf')}>Exportar PDF</Button>
            <Button variant="outline" className="ml-2" onClick={()=>handleExport('excel')}>Exportar Excel</Button>
          </Card>
        )}
        {(filter==='todos'||filter==='pagos') && (
          <Card title="Informe de Pagos">
            <div className="flex items-center gap-2 mb-2"><i className={ICONS.payments + ' text-xl text-yellow-500'}></i><span className="text-neutral-medium text-sm">Resumo de ingresos, impagos e descontos aplicados.</span></div>
            <Button variant="secondary" onClick={()=>handleExport('pdf')}>Exportar PDF</Button>
            <Button variant="outline" className="ml-2" onClick={()=>handleExport('excel')}>Exportar Excel</Button>
          </Card>
        )}
        {(filter==='todos'||filter==='evaluaciones') && (
          <Card title="Informe de Avaliacións">
            <div className="flex items-center gap-2 mb-2"><i className="fa-solid fa-marker text-xl text-green-500"></i><span className="text-neutral-medium text-sm">Resultados académicos, medias e distribución de notas.</span></div>
            <Button variant="secondary" onClick={()=>handleExport('pdf')}>Exportar PDF</Button>
            <Button variant="outline" className="ml-2" onClick={()=>handleExport('excel')}>Exportar Excel</Button>
          </Card>
        )}
      </div>
      {/* Panel IA: Resúmenes y tendencias */}
      <div className="mb-8">
        <Card title="Resumo Executivo (IA)">
          <div className="flex items-center gap-2 mb-2"><i className="fa-solid fa-robot text-xl text-primary"></i><span className="text-neutral-medium text-sm">Xeración automática de resumo mensual e anual con IA.</span></div>
          <ul className="list-disc pl-5 text-sm mb-2">
            <li><b>Tendencia anual de baixas:</b> (gráfica ou dato IA)</li>
            <li><b>Tendencia anual de inscricións:</b> (gráfica ou dato IA)</li>
            <li><b>Proxección de ingresos:</b> (estimación IA)</li>
          </ul>
          <Button variant="primary" disabled>Descargar Resumo IA (próximamente)</Button>
        </Card>
      </div>
      {/* Informes automáticos mensuais */}
      <div className="mb-8">
        <Card title="Informes Mensuais Automáticos">
          <div className="flex items-center gap-2 mb-2"><i className="fa-solid fa-calendar-alt text-xl text-blue-400"></i><span className="text-neutral-medium text-sm">Xeración e descarga de informes mensuais de matrícula, pagos e ocupación.</span></div>
          <Button variant="primary" disabled>Descargar último informe mensual</Button>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ReportsPage;

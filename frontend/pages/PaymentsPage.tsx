import React, { useEffect, useState, useCallback } from 'react';
import PageContainer from '../components/layout/PageContainer';
import Table from '../components/ui/Table';
import { Payment, PaymentStatus, Student, UserRole, TableColumn } from '../types';
import * as dataService from '../services/dataService';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { ICONS } from '../constants';
import Button from '../components/ui/Button'; // Added import
import Modal from '../components/ui/Modal';

// ErrorBoundary local para evitar pantallas en branco
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch() {}
  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-xl mx-auto mt-12 p-6 bg-red-50 border border-red-200 rounded text-red-900 text-center">
          <b>Ocurrió un erro inesperado nesta páxina.</b><br />
          Por favor, recarga ou contacta co administrador se persiste.
        </div>
      );
    }
    return this.props.children;
  }
}

const emptyPayment = (students: Student[]): Partial<Payment> => ({
  studentId: students[0]?.id || '',
  amount: 0,
  dueDate: new Date().toISOString().split('T')[0],
  status: PaymentStatus.Pending,
  description: '',
});

const PaymentsPage: React.FC = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [students, setStudents] = useState<Student[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPayment, setNewPayment] = useState<Partial<Payment>>(emptyPayment([]));

  const fetchPayments = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      if (user.role === UserRole.Admin) {
        const [paymentsData, studentsData] = await Promise.all([
            dataService.getAllPayments(),
            dataService.getStudents()
        ]);
        setPayments(paymentsData);
        setStudents(studentsData);
      } else if (user.role === UserRole.Student) {
        const studentDetails = await dataService.getStudentByUserId(user.id);
        if (studentDetails) {
            const paymentsData = await dataService.getPaymentsByStudentId(studentDetails.id);
            setPayments(paymentsData);
        }
      }
    } catch (error) {
      console.error("Erro ao obter pagamentos:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const getPaymentStatusPill = (status: PaymentStatus) => {
    let bgColor = '';
    let textColor = '';
    let displayText: string; // Use a new variable for the display text

    switch (status) {
      case PaymentStatus.Paid: 
        bgColor = 'bg-secondary/20'; 
        textColor = 'text-secondary dark:text-green-300'; 
        displayText = 'Pagado'; 
        break;
      case PaymentStatus.Pending: 
        bgColor = 'bg-yellow-500/20'; 
        textColor = 'text-yellow-600 dark:text-yellow-300'; 
        displayText = 'Pendente'; 
        break;
      case PaymentStatus.Overdue: 
        bgColor = 'bg-status-red/20'; 
        textColor = 'text-status-red dark:text-red-300'; 
        displayText = 'Vencido'; 
        break;
      case PaymentStatus.Cancelled: 
        bgColor = 'bg-neutral-medium/20'; 
        textColor = 'text-neutral-medium dark:text-gray-400'; 
        displayText = 'Cancelado'; 
        break;
      default: 
        bgColor = 'bg-gray-200'; 
        textColor = 'text-gray-700';
        displayText = status; // Fallback to the original status if not matched
    }
    return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}>{displayText}</span>;
  };
  
  const studentColumns: TableColumn<Payment>[] = [
    { key: 'description', header: 'Descrición' },
    { key: 'amount', header: 'Importe', render: (p) => `€${p.amount.toFixed(2).replace('.',',')}` },
    { key: 'dueDate', header: 'Data de Vencemento', render: (p) => new Date(p.dueDate).toLocaleDateString('gl-ES') },
    { key: 'paymentDate', header: 'Data de Pagamento', render: (p) => p.paymentDate ? new Date(p.paymentDate).toLocaleDateString('gl-ES') : 'N/D' },
    { key: 'status', header: 'Estado', render: (p) => getPaymentStatusPill(p.status) },
    { key: 'invoiceUrl', header: 'Factura', render: (p) => p.invoiceUrl ? <a href={p.invoiceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Ver</a> : 'N/D' },
  ];

  const handleStatusChange = async (payment: Payment, newStatus: PaymentStatus) => {
    try {
      await dataService.updatePayment({ ...payment, status: newStatus });
      fetchPayments();
    } catch (error) {
      alert('Erro ao actualizar o estado do pagamento');
    }
  };

  const adminColumns: TableColumn<Payment>[] = [
     { key: 'studentId', header: 'Alumno/a', render: (p) => {
        const student = students.find(s => s.id === p.studentId);
        return student ? `${student.firstName} ${student.lastName}` : 'Descoñecido';
     }},
    ...studentColumns.filter(col => col.key !== 'invoiceUrl'), 
    { key: 'actions', header: 'Accións', render: (p) => (
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(p, PaymentStatus.Paid)} title="Marcar como Pagado"><i className="fa-solid fa-check text-green-600"></i></Button>
        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(p, PaymentStatus.Pending)} title="Marcar como Pendente"><i className="fa-solid fa-hourglass-half text-yellow-600"></i></Button>
        <Button variant="ghost" size="sm" onClick={() => handleStatusChange(p, PaymentStatus.Overdue)} title="Marcar como Vencido"><i className="fa-solid fa-exclamation-triangle text-red-600"></i></Button>
      </div>
    ) }
  ];

  const columns = user?.role === UserRole.Admin ? adminColumns : studentColumns;

  const breadcrumbs = [
    { label: 'Panel de Control', href: '/dashboard' },
    { label: user?.role === UserRole.Admin ? 'Todos os Pagamentos' : 'Os Meus Pagamentos', current: true },
  ];
  
  const pageTitle = user?.role === UserRole.Admin ? 'Visión Xeral Financeira' : 'Os Meus Pagamentos';

  const handleAddPayment = () => {
    setNewPayment(emptyPayment(students));
    setIsModalOpen(true);
  };

  const handleSavePayment = async () => {
    try {
      const snakeCasePayment = {
        student: newPayment.studentId,
        amount: newPayment.amount,
        due_date: newPayment.dueDate,
        payment_date: newPayment.paymentDate || null,
        status: newPayment.status,
        description: newPayment.description,
        invoice_url: newPayment.invoiceUrl || '',
      };
      await fetch('http://localhost:8000/api/payments/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(snakeCasePayment)
      });
      setIsModalOpen(false);
      fetchPayments();
    } catch (error) {
      alert('Erro ao crear o pagamento');
    }
  };

  if (isLoading) {
    return <Spinner fullPage message="Cargando pagamentos..." />;
  }
  return (
    <ErrorBoundary>
      <PageContainer title={pageTitle} breadcrumbs={breadcrumbs}
        headerActions={user?.role === UserRole.Admin ? (
          <Button onClick={handleAddPayment} iconLeft={ICONS.add}>Engadir Pago</Button>
        ) : undefined}
      >
        {payments.length === 0 ? (
          <EmptyState
            icon={ICONS.payments}
            title="Non se atoparon pagamentos"
            description={user?.role === UserRole.Admin ? "Non hai rexistros de pagamento dispoñibles no sistema." : "Non ten rexistros de pagamento neste momento."}
          />
        ) : (
          <Table<Payment>
            columns={columns}
            data={payments}
            isLoading={isLoading}
            searchableKeys={user?.role === UserRole.Admin ? ['description', 'studentId'] : ['description']}
          />
        )}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Engadir Novo Pago">
          <form onSubmit={e => { e.preventDefault(); handleSavePayment(); }} className="space-y-4">
            <div>
              <label>Alumno/a</label>
              <select className="input" value={newPayment.studentId} onChange={e => setNewPayment(p => ({ ...p, studentId: e.target.value }))} required>
                {students.map(s => <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>)}
              </select>
            </div>
            <div>
              <label>Importe (€)</label>
              <input className="input" type="number" min="0" step="0.01" value={newPayment.amount || ''} onChange={e => setNewPayment(p => ({ ...p, amount: parseFloat(e.target.value) }))} required />
            </div>
            <div>
              <label>Descrición</label>
              <input className="input" value={newPayment.description || ''} onChange={e => setNewPayment(p => ({ ...p, description: e.target.value }))} required />
            </div>
            <div>
              <label>Data de Vencemento</label>
              <input className="input" type="date" value={newPayment.dueDate || ''} onChange={e => setNewPayment(p => ({ ...p, dueDate: e.target.value }))} required />
            </div>
            <div>
              <label>Estado</label>
              <select className="input" value={newPayment.status} onChange={e => setNewPayment(p => ({ ...p, status: e.target.value as PaymentStatus }))} required>
                <option value={PaymentStatus.Pending}>Pendente</option>
                <option value={PaymentStatus.Paid}>Pagado</option>
                <option value={PaymentStatus.Overdue}>Vencido</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
              <Button type="submit">Gardar</Button>
            </div>
          </form>
        </Modal>
      </PageContainer>
    </ErrorBoundary>
  );
};

export default PaymentsPage;
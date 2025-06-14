import React from 'react';
import Modal from '../ui/Modal';
import PaymentFicha from './PaymentFicha';
import { Student, Payment } from '../../types';

interface PaymentFichaModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
  payments: Payment[];
}

const PaymentFichaModal: React.FC<PaymentFichaModalProps> = ({ isOpen, onClose, student, payments }) => (
  <Modal isOpen={isOpen} onClose={onClose} title={`Ficha de Pagamentos de ${student.firstName} ${student.lastName}`} size="lg">
    <PaymentFicha student={student} payments={payments} />
    <div className="flex justify-end gap-2 mt-4 border-t pt-4">
      <button className="btn btn-primary" onClick={onClose}>Pechar</button>
    </div>
  </Modal>
);

export default PaymentFichaModal;

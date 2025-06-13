import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import * as dataService from '../services/dataService';

const ProfessorResourcesPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await dataService.reviewDocumentIA(file);
      setResult(res.result);
    } catch {
      setError('Error al revisar el documento.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Revisión IA de Documentos" className="max-w-xl mx-auto mt-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Sube un documento para revisión automática:</label>
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading || !file}>
          {isLoading ? 'Revisando...' : 'Revisar Documento'}
        </Button>
      </form>
      {result && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-900">
          <b>Resultado IA:</b> {result}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-900">
          {error}
        </div>
      )}
      <div className="mt-6 text-xs text-neutral-medium">
        Solo se aceptan archivos PDF o imagen (máx. 2MB). Si el nombre contiene "firma", se validará como firmado.
      </div>
    </Card>
  );
};

export default ProfessorResourcesPage;

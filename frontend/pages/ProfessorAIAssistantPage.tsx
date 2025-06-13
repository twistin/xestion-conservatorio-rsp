import React, { useState } from 'react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import * as dataService from '../services/dataService';

const ProfessorAIAssistantPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAnswer(null);
    try {
      const res = await dataService.askProfessorFAQ(question);
      setAnswer(res.answer);
    } catch (err) {
      setError('Error al consultar el asistente IA.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card title="Asistente IA para Profesorado" className="max-w-xl mx-auto mt-8">
      <form onSubmit={handleAsk} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Pregunta al asistente:</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ej: ¿Cómo subo un recurso?"
            required
          />
        </div>
        <Button type="submit" variant="primary" disabled={isLoading || !question}>
          {isLoading ? 'Consultando...' : 'Preguntar'}
        </Button>
      </form>
      {answer && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded text-green-900">
          <b>Respuesta IA:</b> {answer}
        </div>
      )}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-900">
          {error}
        </div>
      )}
      <div className="mt-6 text-xs text-neutral-medium">
        Ejemplos: "¿Cómo subo un recurso?", "¿Cómo registrar asistencia?", "¿Cómo ver mi horario?"
      </div>
    </Card>
  );
};

export default ProfessorAIAssistantPage;

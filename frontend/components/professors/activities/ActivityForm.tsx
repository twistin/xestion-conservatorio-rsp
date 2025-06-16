import React, { useState } from "react";

interface ActivityFormProps {
  type: string;
  onSubmit?: (data: any) => void;
}

const ActivityForm: React.FC<ActivityFormProps> = ({ type, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit({ title, date, description, file });
    }
    // Aquí se puede conectar con el backend/API
  };

  return (
    <form className="ia-block p-4 rounded-lg shadow mb-4" onSubmit={handleSubmit}>
      <h3 className="text-lg font-bold mb-2">Nueva {type}</h3>
      <div className="mb-3">
        <label className="block font-medium mb-1">Título</label>
        <input
          type="text"
          className="w-full p-2 rounded border"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Fecha</label>
        <input
          type="date"
          className="w-full p-2 rounded border"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Descripción</label>
        <textarea
          className="w-full p-2 rounded border"
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
        />
      </div>
      <div className="mb-3">
        <label className="block font-medium mb-1">Adjuntar archivo (opcional)</label>
        <input
          type="file"
          className="w-full"
          onChange={e => setFile(e.target.files ? e.target.files[0] : null)}
        />
      </div>
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
        Guardar {type}
      </button>
    </form>
  );
};

export default ActivityForm;

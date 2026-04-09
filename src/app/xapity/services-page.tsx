import { useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  category?: string;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Servicio ejemplo",
      description: "Descripción de ejemplo",
      category: "tipo demo",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.description) return;

    const newService: Service = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      category: formData.category,
    };

    setServices((prev) => [...prev, newService]);

    setFormData({ name: "", description: "", category: "" });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Servicios</h1>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowForm(true)}
        >
          Crear Servicio
        </button>
      </div>

      {/* Table */}
      {services.length === 0 ? (
        <p>No hay servicios</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Nombre</th>
              <th className="p-2">Descripción</th>
              <th className="p-2">Tipo</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.description}</td>
                <td className="p-2">{s.category}</td>
                <td className="p-2 flex gap-2">
                  <button className="bg-yellow-400 px-2 py-1 rounded">
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    onClick={() => handleDelete(s.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Crear Servicio</h2>

            <input
              name="name"
              placeholder="Nombre"
              value={formData.name}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <textarea
              name="description"
              placeholder="Descripción"
              value={formData.description}
              onChange={handleChange}
              className="w-full border p-2 mb-2"
            />

            <input
              name="category"
              placeholder="Tipo"
              value={formData.category}
              onChange={handleChange}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                className="px-3 py-1"
                onClick={() => setShowForm(false)}
              >
                Cancelar
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Crear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Cuando este listo backend:

// Solo cambiar esto:

// setServices((prev) => [...prev, newService]);

// por:

// await createService(formData);
// await fetchServices();

// Y listo. Sin rehacer nada.
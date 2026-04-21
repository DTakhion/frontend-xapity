import { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_XAPITY_API_URL;

interface Service {
  id: string;
  name: string;
  description: string;
  category?: string;
}
//hola
export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  const [showEditForm, setShowEditForm] = useState(false);

  const [editFormData, setEditFormData] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
  });

  // Obtener servicios desde backend
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/services`);
      const data = await res.json();

      setServices(
        data.items.map((s: any) => ({
          id: s.serviceId,
          name: s.name,
          description: s.description,
          category: s.category,
        }))
      );
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  // Manejo de inputs
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value,
    });
  };

  // Crear servicio (POST)
  const handleSubmit = async () => {
    if (!formData.name || !formData.description) return;

    try {
      const res = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error:", errorData);
        return;
      }

      const newService = await res.json();

      setServices((prev) => [
        ...prev,
        {
          id: newService.serviceId,
          name: newService.name,
          description: newService.description,
          category: newService.category,
        },
      ]);

      setFormData({ name: "", description: "", category: "" });
      setShowForm(false);
    } catch (error) {
      console.error("Error creating service:", error);
    }
  };

  // Editar servicio (UPDATE)
  const handleUpdate = async () => {
    try {
      const res = await fetch(`${API_URL}/services/${editFormData.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editFormData.name,
          description: editFormData.description,
          category: editFormData.category,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error updating:", errorData);
        return;
      }

      const updated = await res.json();

      setServices((prev) =>
        prev.map((s) =>
          s.id === editFormData.id
            ? {
                id: updated.serviceId,
                name: updated.name,
                description: updated.description,
                category: updated.category,
              }
            : s
        )
      );

      setShowEditForm(false);

    } catch (error) {
      console.error("Error updating service:", error);
    }
  };

  // Eliminar servicio (DELETE)
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/services/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error("Error deleting service");
        return;
      }

      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting service:", error);
    }
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
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded"
                    onClick={() => {
                      setEditFormData({
                        id: s.id,
                        name: s.name,
                        description: s.description,
                        category: s.category || "",
                      });
                      setShowEditForm(true);
                    }}
                  >
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

      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Editar Servicio</h2>

            <input
              name="name"
              value={editFormData.name}
              onChange={handleEditChange}
              className="w-full border p-2 mb-2"
            />

            <textarea
              name="description"
              value={editFormData.description}
              onChange={handleEditChange}
              className="w-full border p-2 mb-2"
            />

            <input
              name="category"
              value={editFormData.category}
              onChange={handleEditChange}
              className="w-full border p-2 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowEditForm(false)}>
                Cancelar
              </button>

              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={handleUpdate}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import { useState } from "react";

// interface Service {
//   id: string;
//   name: string;
//   description: string;
//   category?: string;
// }

// export default function ServicesPage() {
//   const [services, setServices] = useState<Service[]>([
//     {
//       id: "1",
//       name: "Servicio ejemplo",
//       description: "Descripción de ejemplo",
//       category: "tipo demo",
//     },
//   ]);

//   const [showForm, setShowForm] = useState(false);

//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     category: "",
//   });

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (!formData.name || !formData.description) return;

//     const newService: Service = {
//       id: Date.now().toString(),
//       name: formData.name,
//       description: formData.description,
//       category: formData.category,
//     };

//     setServices((prev) => [...prev, newService]);

//     setFormData({ name: "", description: "", category: "" });
//     setShowForm(false);
//   };

//   const handleDelete = (id: string) => {
//     setServices((prev) => prev.filter((s) => s.id !== id));
//   };

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-xl font-bold">Servicios</h1>
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={() => setShowForm(true)}
//         >
//           Crear Servicio
//         </button>
//       </div>

//       {/* Table */}
//       {services.length === 0 ? (
//         <p>No hay servicios</p>
//       ) : (
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2">Nombre</th>
//               <th className="p-2">Descripción</th>
//               <th className="p-2">Tipo</th>
//               <th className="p-2">Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {services.map((s) => (
//               <tr key={s.id} className="border-t">
//                 <td className="p-2">{s.name}</td>
//                 <td className="p-2">{s.description}</td>
//                 <td className="p-2">{s.category}</td>
//                 <td className="p-2 flex gap-2">
//                   <button className="bg-yellow-400 px-2 py-1 rounded">
//                     Editar
//                   </button>
//                   <button
//                     className="bg-red-500 text-white px-2 py-1 rounded"
//                     onClick={() => handleDelete(s.id)}
//                   >
//                     Eliminar
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       {/* Modal Form */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
//           <div className="bg-white p-6 rounded w-full max-w-md">
//             <h2 className="text-lg font-bold mb-4">Crear Servicio</h2>

//             <input
//               name="name"
//               placeholder="Nombre"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2"
//             />

//             <textarea
//               name="description"
//               placeholder="Descripción"
//               value={formData.description}
//               onChange={handleChange}
//               className="w-full border p-2 mb-2"
//             />

//             <input
//               name="category"
//               placeholder="Tipo"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full border p-2 mb-4"
//             />

//             <div className="flex justify-end gap-2">
//               <button
//                 className="px-3 py-1"
//                 onClick={() => setShowForm(false)}
//               >
//                 Cancelar
//               </button>
//               <button
//                 className="bg-blue-500 text-white px-4 py-2 rounded"
//                 onClick={handleSubmit}
//               >
//                 Crear
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// Cuando este listo backend:

// Solo cambiar esto:

// setServices((prev) => [...prev, newService]);

// por:

// await createService(formData);
// await fetchServices();

// Y listo. Sin rehacer nada.
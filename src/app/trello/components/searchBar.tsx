'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // Reemplaza con el ID de tu tablero de Trello
const customFieldSprintId = '627d42ca703bb351e5e7e653'; // Reemplaza con el ID del campo "ID Sprint"

type SearchBarProps = {
  setSelectedSprint: (sprint: string | null) => void; // Aseguramos que sea string o null
};

const SearchBar: React.FC<SearchBarProps> = ({ setSelectedSprint }) => {
  const [sprintValues, setSprintValues] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchSprintValues = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${apiToken}&customFieldItems=true`
      );

      if (response.data && response.data.length > 0) {

        const sprintFieldValues: any[] = [];
        const sprintCustomFieldId = customFieldSprintId; // ID correcto del campo "ID Sprint"

        response.data.forEach((card: any) => {

          // Verificar si la tarjeta tiene campos personalizados
          if (card.customFieldItems && card.customFieldItems.length > 0) {
            // Buscamos el campo "ID Sprint"
            const sprintField = card.customFieldItems.find(
              (field: any) => field.idCustomField === sprintCustomFieldId
            );

            // Si se encuentra el campo y tiene un valor numérico
            if (sprintField && sprintField.value?.number) {
              sprintFieldValues.push({
                cardName: card.name,
                sprintValue: sprintField.value.number,
                cardId: card.id,
              });
            }
          }
        });
        setSprintValues(sprintFieldValues); // Guardamos los valores obtenidos
      } else {
        setError('No se encontraron tarjetas con campos personalizados.');
      }
    } catch (error: any) {
      console.error('Error al obtener los valores del campo "ID Sprint":', error);
      setError('Ocurrió un error al obtener los datos de Trello.');
    }
  };

  useEffect(() => {
    fetchSprintValues(); // Obtener los valores del campo al cargar el componente
  }, []);

  return (
    <div className="relative">
<h3 className="text-lg font-bold text-white">Filtrar por &quot;ID Sprint&quot;</h3>

      {sprintValues.length > 0 && (
        <div>
          {/* Dropdown para seleccionar el Sprint */}
          <select
            onChange={(e) => setSelectedSprint(e.target.value || null)}
            className="bg-gray-800 text-white p-2 rounded"
          >
            <option value="">Mostrar todos los Sprints</option>
            {Array.from(new Set(sprintValues.map((sprint) => sprint.sprintValue))).map((sprintId) => (
              <option key={sprintId} value={sprintId}>
                Sprint {sprintId}
              </option>
            ))}
          </select>
        </div>
      )}

      {error && <p className="text-red-500">Error: {error}</p>}
    </div>
  );
};

export default SearchBar;

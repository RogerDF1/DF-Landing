import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // ID del tablero de Trello

type TablesPartnersProps = {
    sprintNumber: string;
};


const TablesPartners = ({ sprintNumber }: TablesPartnersProps) => {
  const [participantsData, setParticipantsData] = useState<any[]>([]);
  const [totalSprintHours, setTotalSprintHours] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los datos de las tarjetas de Trello
  const fetchParticipantData = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${apiToken}&customFieldItems=true`
      );

      if (response.data && response.data.length > 0) {
        const participantsMap: { [key: string]: { participant1: number, participant2: number, participant3: number, total: number } } = {};
        let sprintTotal = 0;

        response.data.forEach((card: any) => {
          // Filtrar por el sprint seleccionado
          const sprintField = card.customFieldItems.find(
            (field: any) => field.idCustomField === 'Sprint Field ID' && field.value?.number === sprintNumber
          );

          if (sprintField) {
            // Asumimos que cada tarjeta tiene datos de participantes y horas
            const participant1 = card.customFieldItems.find((field: any) => field.idCustomField === 'Participante 1');
            const participant2 = card.customFieldItems.find((field: any) => field.idCustomField === 'Participante 2');
            const participant3 = card.customFieldItems.find((field: any) => field.idCustomField === 'Participante 3');

            const hours1 = card.customFieldItems.find((field: any) => field.idCustomField === 'Horas Participante 1');
            const hours2 = card.customFieldItems.find((field: any) => field.idCustomField === 'Horas Participante 2');
            const hours3 = card.customFieldItems.find((field: any) => field.idCustomField === 'Horas Participante 3');

            // Agregar los datos de cada participante al mapa
            if (participant1 && hours1 && hours1.value.number) {
              if (!participantsMap[participant1.value.text]) {
                participantsMap[participant1.value.text] = { participant1: 0, participant2: 0, participant3: 0, total: 0 };
              }
              participantsMap[participant1.value.text].participant1 += parseFloat(hours1.value.number);
              participantsMap[participant1.value.text].total += parseFloat(hours1.value.number);
              sprintTotal += parseFloat(hours1.value.number);
            }

            if (participant2 && hours2 && hours2.value.number) {
              if (!participantsMap[participant2.value.text]) {
                participantsMap[participant2.value.text] = { participant1: 0, participant2: 0, participant3: 0, total: 0 };
              }
              participantsMap[participant2.value.text].participant2 += parseFloat(hours2.value.number);
              participantsMap[participant2.value.text].total += parseFloat(hours2.value.number);
              sprintTotal += parseFloat(hours2.value.number);
            }

            if (participant3 && hours3 && hours3.value.number) {
              if (!participantsMap[participant3.value.text]) {
                participantsMap[participant3.value.text] = { participant1: 0, participant2: 0, participant3: 0, total: 0 };
              }
              participantsMap[participant3.value.text].participant3 += parseFloat(hours3.value.number);
              participantsMap[participant3.value.text].total += parseFloat(hours3.value.number);
              sprintTotal += parseFloat(hours3.value.number);
            }
          }
        });

        setParticipantsData(Object.entries(participantsMap).map(([name, hours]: any) => ({ name, ...hours })));
        setTotalSprintHours(sprintTotal);
      } else {
        setError('No se encontraron tarjetas con datos de participantes.');
      }
    } catch (error: any) {
      console.error('Error al obtener los datos de Trello:', error);
      setError('Ocurrió un error al obtener los datos de Trello.');
    }
  };

  useEffect(() => {
    fetchParticipantData();
  }, [sprintNumber]); // El efecto se ejecutará cuando cambie el sprintNumber
  

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Horas</div>
      </header>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table role="table" className="w-full">
          <thead>
            <tr role="row">
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participantes</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participante 1</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participante 2</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participante 3</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Total de horas</div>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {error && (
              <tr>
                <td colSpan={5} className="text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {participantsData.length > 0 ? (
              participantsData.map((participant: any) => (
                <tr key={participant.name} role="row">
                  <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{participant.name}</p>
                    </div>
                  </td>
                  <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                    <p className="text-sm font-bold text-white">{participant.participant1 || 0}</p>
                  </td>
                  <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                    <p className="text-sm font-bold text-white">{participant.participant2 || 0}</p>
                  </td>
                  <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                    <p className="text-sm font-bold text-white">{participant.participant3 || 0}</p>
                  </td>
                  <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                    <p className="text-sm font-bold text-white">{participant.total}</p>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-gray-400">No se encontraron datos.</td>
              </tr>
            )}
            <tr role="row">
              <td colSpan={4} className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">Total Sprint</td>
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{totalSprintHours}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablesPartners;

'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // Reemplaza con el ID de tu tablero de Trello
const customFieldSprintId = '627d42ca703bb351e5e7e653'; // ID del campo "ID Sprint"
const customFieldParticipantIds = ['Participante 1', 'Participante 2', 'Participante 3']; // IDs de los campos de participantes
const customFieldHoursIds = ['Horas Participante 1', 'Horas Participante 2', 'Horas Participante 3']; // IDs de los campos de horas

type CardProps = {
  sprintNumber: string; // El número del Sprint seleccionado
};

const Card = ({ sprintNumber }: CardProps) => {
  const [participantsData, setParticipantsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los datos filtrados de Trello
  const fetchParticipantData = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${apiToken}&customFieldItems=true`
      );

      if (response.data && response.data.length > 0) {
        const participantsMap: { [key: string]: number } = {};

        response.data.forEach((card: any) => {
          // Filtramos las tarjetas por Sprint seleccionado
          const sprintField = card.customFieldItems.find((field: any) => field.idCustomField === customFieldSprintId);
          if (sprintField && sprintField.value?.number === sprintNumber) {
            // Procesamos los participantes y sus horas
            customFieldParticipantIds.forEach((participantFieldId, index) => {
              const participantField = card.customFieldItems.find((field: any) => field.idCustomField === participantFieldId);
              const hoursField = card.customFieldItems.find((field: any) => field.idCustomField === customFieldHoursIds[index]);

              if (participantField && participantField.value?.text && hoursField && hoursField.value?.number) {
                const participantName = participantField.value.text;
                const hours = parseInt(hoursField.value.number, 10);

                if (participantsMap[participantName]) {
                  participantsMap[participantName] += hours;
                } else {
                  participantsMap[participantName] = hours;
                }
              }
            });
          }
        });

        // Convertimos el mapa en un array para poder renderizarlo
        const participantsArray = Object.entries(participantsMap).map(([name, hours]) => ({ name, hours }));
        setParticipantsData(participantsArray);
      } else {
        setError('No se encontraron tarjetas con campos personalizados.');
      }
    } catch (error: any) {
      console.error('Error al obtener los datos de Trello:', error);
      setError('Ocurrió un error al obtener los datos de Trello.');
    }
  };

  useEffect(() => {
    if (sprintNumber) {
      fetchParticipantData(); // Llamar a la API si hay un sprint seleccionado
    }
  }, [sprintNumber]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {participantsData.length > 0 ? (
        participantsData.map(({ name, hours }) => (
          <div key={name} className="!z-5 relative flex flex-col rounded-[20px] bg-clip-border shadow-3xl shadow-shadow-500 !bg-navy-800 text-white shadow-none !flex-row flex-grow items-center rounded-[20px]">
            <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
              <div className="rounded-full p-3 bg-navy-700">
                <span className="flex items-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="h-50 ml-4 flex w-auto flex-col justify-center">
              <p className="font-dm text-sm font-medium text-gray-600">{name}</p>
              <h4 className="text-xl font-bold text-white">{hours} horas</h4>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-400">No se encontraron participantes para este Sprint.</p>
      )}
    </div>
  );
};

export default Card;

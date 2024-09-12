import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // ID del tablero de Trello

type TablesHoursProps = {
  sprintNumber: string;
};

interface CustomFieldData {
  id: string;
  name: string;
  type: string;
  options?: { id: string; value: { text: string } }[];
}

interface ProcessedCard {
  id: string;
  name: string;
  idProyecto: string;
  idSprint: string;
  idCliente: string;
  participante1: string;
  participante2: string;
  participante3: string;
}

const TablesHours: React.FC<TablesHoursProps> = ({ sprintNumber }) => {
  const [cards, setCards] = useState<ProcessedCard[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldData[]>([]);
  const [totals, setTotals] = useState<{ [key: string]: { tarjetas1: number, tarjetas2: number, tarjetas3: number, total: number } }>({});

  // Función para obtener los campos personalizados desde Trello
  const fetchCustomFields = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/customFields?key=${apiKey}&token=${apiToken}`
      );
      setCustomFields(response.data);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  };

  // Función para obtener las tarjetas desde Trello
  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${apiToken}&customFieldItems=true`
      );
      
      const processedCards: ProcessedCard[] = response.data.map((card: any) => {
        const processedCard: ProcessedCard = {
          id: card.id,
          name: card.name,
          idProyecto: '',
          idSprint: '',
          idCliente: '',
          participante1: '',
          participante2: '',
          participante3: '',
        };

        // Procesar campos personalizados
        card.customFieldItems.forEach((item: any) => {
          const field = customFields.find(cf => cf.id === item.idCustomField);
          if (field) {
            switch(field.name) {
              case 'ID Sprint':
                processedCard.idSprint = item.value?.number?.toString() || '';
                break;
              case 'Participante 1':
                processedCard.participante1 = field.options?.find(opt => opt.id === item.idValue)?.value.text || '';
                break;
              case 'Participante 2':
                processedCard.participante2 = field.options?.find(opt => opt.id === item.idValue)?.value.text || '';
                break;
              case 'Participante 3':
                processedCard.participante3 = field.options?.find(opt => opt.id === item.idValue)?.value.text || '';
                break;
            }
          }
        });

        return processedCard;
      });

      setCards(processedCards);
    } catch (error) {
      console.error("Error fetching cards from Trello:", error);
    }
  };

  // Calcular la cantidad de tarjetas por cada participante
  const calculateTotals = () => {
    const totals: { [key: string]: { tarjetas1: number, tarjetas2: number, tarjetas3: number, total: number } } = {};
    cards.filter(card => card.idSprint === sprintNumber).forEach(card => {
      ['participante1', 'participante2', 'participante3'].forEach((participante, index) => {
        const nombre = card[participante as keyof ProcessedCard];
        if (nombre) {
          if (!totals[nombre]) {
            totals[nombre] = { tarjetas1: 0, tarjetas2: 0, tarjetas3: 0, total: 0 };
          }
          totals[nombre][`tarjetas${index + 1}` as keyof typeof totals[nombre]] += 1; // Incrementa la tarjeta para cada participante
          totals[nombre].total += 1;
        }
      });
    });
    setTotals(totals);
  };

  useEffect(() => {
    fetchCustomFields().then(fetchCards);
  }, [sprintNumber]);

  useEffect(() => {
    if (cards.length > 0) {
      calculateTotals();
    }
  }, [cards]);

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Tarjetas por Participante - Sprint {sprintNumber}</div>
      </header>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table role="table" className="w-full">
          <thead>
            <tr role="row">
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participante</div>
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
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Total</div>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {Object.entries(totals).map(([nombre, { tarjetas1, tarjetas2, tarjetas3, total }]) => (
              <tr role="row" key={nombre}>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{nombre}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">{tarjetas1}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">{tarjetas2}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">{tarjetas3}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablesHours;

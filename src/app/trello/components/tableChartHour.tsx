import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // ID del tablero de Trello

type TablesPartnersProps = {
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
  horasParticipante1: number;
  participante2: string;
  horasParticipante2: number;
  participante3: string;
  horasParticipante3: number;
}

const TablesPartners: React.FC<TablesPartnersProps> = ({ sprintNumber }) => {
  const [cards, setCards] = useState<ProcessedCard[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldData[]>([]);

  const fetchCustomFields = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/customFields?key=${apiKey}&token=${apiToken}`
      );
      setCustomFields(response.data);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  }, []); // Sin dependencias

  const fetchCards = useCallback(async () => {
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
          horasParticipante1: 0,
          participante2: '',
          horasParticipante2: 0,
          participante3: '',
          horasParticipante3: 0
        };

        card.customFieldItems.forEach((item: any) => {
          const field = customFields.find(cf => cf.id === item.idCustomField);
          if (field) {
            switch(field.name) {
              case 'ID Proyecto':
                processedCard.idProyecto = item.value?.text || '';
                break;
              case 'ID Sprint':
                processedCard.idSprint = item.value?.number?.toString() || '';
                break;
              case 'ID Cliente':
                processedCard.idCliente = item.value?.text || '';
                break;
              case 'Participante 1':
                processedCard.participante1 = field.options?.find(opt => opt.id === item.idValue)?.value.text || '';
                break;
              case 'Horas Participante 1':
                processedCard.horasParticipante1 = item.value?.number || 0;
                break;
              case 'Participante 2':
                processedCard.participante2 = field.options?.find(opt => opt.id === item.idValue)?.value.text || '';
                break;
              case 'Horas Participante 2':
                processedCard.horasParticipante2 = item.value?.number || 0;
                break;
              case 'Participante 3':
                processedCard.participante3 = field.options?.find(opt => opt.id === item.idValue)?.value.text || '';
                break;
              case 'Horas Participante 3':
                processedCard.horasParticipante3 = item.value?.number || 0;
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
  }, [customFields]);

  useEffect(() => {
    fetchCustomFields().then(fetchCards);
  }, [fetchCustomFields, fetchCards, sprintNumber]);

  const filteredCards = useMemo(() => cards.filter(card => card.idSprint === sprintNumber), [cards, sprintNumber]);

  const totals = useMemo(() => {
    const totals: {[key: string]: {horas1: number, horas2: number, horas3: number, total: number}} = {};
    
    filteredCards.forEach(card => {
      ['participante1', 'participante2', 'participante3'].forEach((participante, index) => {
        const nombre = card[participante as keyof ProcessedCard];
        const horas = parseFloat(card[`horasParticipante${index + 1}` as keyof ProcessedCard].toString()) || 0;
        
        if (typeof nombre === 'string' && horas) {
          if (!totals[nombre]) {
            totals[nombre] = { horas1: 0, horas2: 0, horas3: 0, total: 0 };
          }
          totals[nombre][`horas${index + 1}` as 'horas1' | 'horas2' | 'horas3'] += horas;
          totals[nombre].total += horas;
        }
      });
    });
  
    return totals;
  }, [filteredCards]);

  const pieData = useMemo(() => ({
    labels: Object.keys(totals),
    datasets: [
      {
        label: 'Horas',
        data: Object.values(totals).map(total => total.total),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  }), [totals]);

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Horas por Participante - Sprint {sprintNumber}</div>
      </header>

      {/* Gráfico circular */}
      <div className="mt-8">
        <Pie data={pieData} />
      </div>
    </div>
  );
};

export default TablesPartners;
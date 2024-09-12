import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

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

interface Totals {
  [key: string]: { tarjetas1: number, tarjetas2: number, tarjetas3: number, total: number };
}

const TablesHours: React.FC<TablesHoursProps> = ({ sprintNumber }) => {
  const [cards, setCards] = useState<ProcessedCard[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldData[]>([]);
  const [totals, setTotals] = useState<Totals>({});

  // Función para obtener los campos personalizados desde Trello
  const fetchCustomFields = useCallback(async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/customFields?key=${apiKey}&token=${apiToken}`
      );
      setCustomFields(response.data);
    } catch (error) {
      console.error("Error fetching custom fields:", error);
    }
  }, []);

  // Función para obtener las tarjetas desde Trello
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
          participante2: '',
          participante3: '',
        };

        card.customFieldItems.forEach((item: any) => {
          const field = customFields.find(cf => cf.id === item.idCustomField);
          if (field) {
            switch (field.name) {
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
  }, [customFields]);

  const calculateTotals = useCallback(() => {
    const newTotals: Totals = {};
    cards.filter(card => card.idSprint === sprintNumber).forEach(card => {
      ['participante1', 'participante2', 'participante3'].forEach((participante, index) => {
        const nombre = card[participante as keyof ProcessedCard];
        if (nombre) {
          if (!newTotals[nombre]) {
            newTotals[nombre] = { tarjetas1: 0, tarjetas2: 0, tarjetas3: 0, total: 0 };
          }
          (newTotals[nombre] as any)[`tarjetas${index + 1}`] += 1;  // Aquí se aplica 'as any'
          newTotals[nombre].total += 1;
        }
      });
    });
    setTotals(newTotals);
  }, [cards, sprintNumber]);
  

  useEffect(() => {
    fetchCustomFields().then(fetchCards);
  }, [fetchCustomFields, fetchCards]);

  useEffect(() => {
    if (cards.length > 0) {
      calculateTotals();
    }
  }, [cards, calculateTotals]);

  // Optimización de los datos para el gráfico
  const participants = useMemo(() => Object.keys(totals), [totals]);
  const tarjetas = useMemo(() => Object.values(totals).map(val => val.total), [totals]);

  const data = useMemo(() => ({
    labels: participants,
    datasets: [
      {
        label: "Tarjetas realizadas",
        data: tarjetas,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }), [participants, tarjetas]);


  

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Tarjetas por Participante - Sprint {sprintNumber}</div>
      </header>
      <div className="mt-[5em]">
        < Doughnut  data={data}  />
      </div>
    </div>
  );
};

export default TablesHours;

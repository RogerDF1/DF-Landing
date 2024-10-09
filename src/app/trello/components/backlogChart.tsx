import { fetchWithRetry } from './../api/trello'


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Registrar los componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // Reemplaza con el ID de tu tablero de Trello

const TablesCards = () => {
  const [listsData, setListsData] = useState<any[]>([]);
  const [totalCards, setTotalCards] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los datos de Trello
  const fetchListsData = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/lists?cards=open&key=${apiKey}&token=${apiToken}`
      );

      if (response.data && response.data.length > 0) {
        const totalCardsCount = response.data.reduce((acc: number, list: any) => acc + list.cards.length, 0);

        setListsData(response.data);
        setTotalCards(totalCardsCount); // Guardar el número total de tarjetas
      } else {
        setError('No se encontraron listas con tarjetas.');
      }
    } catch (error: any) {
      console.error('Error al obtener los datos de Trello:', error);
      setError('Ocurrió un error al obtener los datos de Trello.');
    }
  };

  useEffect(() => {
    fetchListsData(); // Obtener los valores al cargar el componente
  }, []);

  // Preparar los datos para el gráfico de pie
  const chartData = {
    labels: listsData.map(list => list.name), // Nombres de las listas
    datasets: [
      {
        label: 'Número de Tarjetas',
        data: listsData.map(list => list.cards.length), // Número de tarjetas en cada lista
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
  };

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Tarjetas por lista</div>
      </header>


      {/* Gráfico de pie */}
      <div className="mt-8">
        <Pie data={chartData} />
      </div>
    </div>
  );
};

export default TablesCards;

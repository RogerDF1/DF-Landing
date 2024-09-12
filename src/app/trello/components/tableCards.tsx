'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Tarjetas por lista</div>
      </header>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table role="table" className="w-full">
          <thead>
            <tr role="row">
              <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">List Name</div>
              </th>
              <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Tarjetas</div>
              </th>
              <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Porcentaje</div>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {error && (
              <tr>
                <td colSpan={3} className="text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {listsData.length > 0 ? (
              listsData.map((list: any, index: number) => {
                const cardCount = list.cards.length;
                const percentage = ((cardCount / totalCards) * 100).toFixed(2); // Calcular el porcentaje

                return (
                  <tr key={`${list.id}-${index}`} role="row">
                    <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{list.name}</p>
                      </div>
                    </td>
                    <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                      <div className="flex items-center">
                        <p className="text-sm font-bold text-white">{cardCount}</p>
                      </div>
                    </td>
                    <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                      <p className="text-sm font-bold text-white">{percentage}%</p>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={3} className="text-gray-400">
                  No se encontraron listas con tarjetas.
                </td>
              </tr>
            )}
            <tr role="row">
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">Suma total</td>
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{totalCards}</td>
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablesCards;

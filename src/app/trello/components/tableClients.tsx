import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // ID del tablero de Trello
const customFieldClienteId = '627d5135cdffb5859fa1ad95'; // ID del campo personalizado "ID Cliente"
const customFieldSprintId = '627d42ca703bb351e5e7e653'; // ID del campo personalizado "ID Sprint"
const customFieldHorasParticipante1Id = '627d46063d42d4380dcb20c5'; // ID del campo personalizado "Horas Participante 1"
const customFieldHorasParticipante2Id = '627d4718e6dfbf598a6a0748'; // ID del campo personalizado "Horas Participante 2"
const customFieldHorasParticipante3Id = '63bda80ea9e47a01f16b4a7b'; // ID del campo personalizado "Horas Participante 3"

type TablesHoursProps = {
  sprintNumber: string;
};

interface CustomFieldData {
  id: string;
  name: string;
  type: string;
  options?: { id: string; value: { text: string } }[];
}

interface ClientData {
  id: string;
  name: string;
}

interface ProcessedCard {
  id: string;
  name: string;
  idCliente: string;
  idSprint: string;
  horas: number;
}

const TablesHours: React.FC<TablesHoursProps> = ({ sprintNumber }) => {
  const [cards, setCards] = useState<ProcessedCard[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldData[]>([]);
  const [clients, setClients] = useState<ClientData[]>([]);

  const fetchCustomFields = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/customFields?key=${apiKey}&token=${apiToken}`
      );
      setCustomFields(response.data);

      // Imprimir todos los campos personalizados en la consola
      console.log('Custom Fields:', response.data);
    } catch (error) {
      console.error('Error fetching custom fields:', error);
    }
  };

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/cards?key=${apiKey}&token=${apiToken}&customFieldItems=true`
      );

      const processedCards: ProcessedCard[] = response.data.map((card: any) => {
        const processedCard: ProcessedCard = {
          id: card.id,
          name: card.name,
          idCliente: '',
          idSprint: '',
          horas: 0,
        };

        card.customFieldItems.forEach((item: any) => {
          if (item.idCustomField === customFieldClienteId) {
            processedCard.idCliente = item.value?.number?.toString() || '';
          } else if (item.idCustomField === customFieldSprintId) {
            processedCard.idSprint = item.value?.number?.toString() || '';
          } else if (item.idCustomField === customFieldHorasParticipante1Id || 
                     item.idCustomField === customFieldHorasParticipante2Id || 
                     item.idCustomField === customFieldHorasParticipante3Id) {
            const horasValue = item.value?.number || item.value?.text;
            if (horasValue) {
              processedCard.horas += parseFloat(horasValue);
            }
            // Imprimir el valor de horas para depuración
            console.log(`Card ID: ${card.id}, Horas Value (${item.idCustomField}):`, horasValue);
          }
        });

        return processedCard;
      });

      // Imprimir las tarjetas procesadas para depuración
      console.log('Processed Cards:', processedCards);

      setCards(processedCards);
    } catch (error) {
      console.error('Error fetching cards from Trello:', error);
    }
  };

  const fetchClients = async () => {
    // Simulating fetching client data from another source (e.g., a database or a file)
    const clientsData: ClientData[] = [
      { id: '1', name: 'Digital Family' },
      { id: '3', name: 'Aprende Zapopan' },
      { id: '7', name: 'Colegio Ingles Hidalgo' },
      { id: '8', name: 'Colegio Reims' },
      { id: '9', name: 'Consultoría Educativa AIDEI' },
      { id: '13', name: 'Escuela Miguel Hidalgo' },
      { id: '20', name: 'Secretaría de Educación del Estado de Colima' },
      { id: '29', name: 'Villa Educativa S.C.' },
      { id: '34', name: 'Colegio Marcelina' },
      { id: '36', name: 'Bluetopia' },
      { id: '37', name: 'Fundación Bring' },
      { id: '38', name: 'Escuela Normal' },
    ];
    setClients(clientsData);
  };

  const calculateTotals = () => {
    const totals: { [key: string]: { tarjetas: number, horas: number, nombreCliente: string } } = {};
    cards.filter(card => card.idSprint === sprintNumber).forEach(card => {
      if (!totals[card.idCliente]) {
        const client = clients.find(c => c.id === card.idCliente);
        totals[card.idCliente] = {
          tarjetas: 0,
          horas: 0,
          nombreCliente: client ? client.name : 'Cliente desconocido'
        };
      }
      totals[card.idCliente].tarjetas += 1;
      totals[card.idCliente].horas += card.horas;
    });
    return totals;
  };

  useEffect(() => {
    fetchClients();
    fetchCustomFields();
  }, []);

  useEffect(() => {
    if (customFields.length > 0 && clients.length > 0 && customFieldClienteId) {
      fetchCards();
    }
  }, [customFields, clients, customFieldClienteId, sprintNumber]);

  const totals = calculateTotals();

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Horas por Cliente - Sprint {sprintNumber}</div>
      </header>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table role="table" className="w-full">
          <thead>
            <tr role="row">
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Cliente</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">ID Cliente</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Tarjetas</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Horas</div>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {Object.entries(totals).map(([idCliente, { tarjetas, horas, nombreCliente }], index) => (
              <tr role="row" key={`${idCliente}-${index}`}>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{nombreCliente}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">{idCliente}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">{tarjetas}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{horas.toFixed(2)}</td>
              </tr>
            ))}
            <tr role="row">
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">Suma total</td>
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">-</td>
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{Object.values(totals).reduce((sum, { tarjetas }) => sum + tarjetas, 0)}</td>
              <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{Object.values(totals).reduce((sum, { horas }) => sum + horas, 0).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablesHours;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_TRELLO_API || '';
const apiToken = process.env.NEXT_PUBLIC_TRELLO_TOKEN || '';
const boardId = 'UTrQCeTP'; // ID del tablero de Trello
const customFieldProyectoId = '627d42ca703bb351e5e7e650'; // ID del campo personalizado "ID Proyecto"
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

interface ProjectData {
  id: string;
  name: string;
}

interface ProcessedCard {
  id: string;
  name: string;
  idProyecto: string;
  idSprint: string;
  horas: number;
}

const TablesHours: React.FC<TablesHoursProps> = ({ sprintNumber }) => {
  const [cards, setCards] = useState<ProcessedCard[]>([]);
  const [customFields, setCustomFields] = useState<CustomFieldData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  const fetchCustomFields = async () => {
    try {
      const response = await axios.get(
        `https://api.trello.com/1/boards/${boardId}/customFields?key=${apiKey}&token=${apiToken}`
      );
      setCustomFields(response.data);

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
          idProyecto: '',
          idSprint: '',
          horas: 0,
        };

        card.customFieldItems.forEach((item: any) => {
          if (item.idCustomField === customFieldProyectoId) {
            processedCard.idProyecto = item.value?.number?.toString() || '';
          } else if (item.idCustomField === customFieldSprintId) {
            processedCard.idSprint = item.value?.number?.toString() || '';
          } else if (item.idCustomField === customFieldHorasParticipante1Id || 
                     item.idCustomField === customFieldHorasParticipante2Id || 
                     item.idCustomField === customFieldHorasParticipante3Id) {
            const horasValue = item.value?.number || item.value?.text;
            if (horasValue) {
              processedCard.horas += parseFloat(horasValue);
            }
          }
        });

        return processedCard;
      });


      setCards(processedCards);
    } catch (error) {
      console.error('Error fetching cards from Trello:', error);
    }
  };

  const fetchProjects = async () => {
    // Simulating fetching project data from another source (e.g., a database or a file)
    const projectsData: ProjectData[] = [
      { id: '1', name: 'Soporte Técnico' },
      { id: '2', name: 'Capacitación Técnica' },
      { id: '3', name: 'Enroll CB' },
      { id: '4', name: 'Implementación' },
      { id: '5', name: 'Migración' },
      { id: '6', name: 'Chromeflex' },
      { id: '7', name: 'Licenciamiento GW' },
      { id: '8', name: 'Zoho CRM' },
      { id: '9', name: 'Reportes Looker Studio' },
      { id: '10', name: 'Seguridad y estandarización interna' },
      { id: '11', name: 'Crecimiento profesional TI' },
      { id: '12', name: 'Onboarding' },
      { id: '13', name: 'Offboarding' },
      { id: '14', name: 'Automatización equipo interno' },
      { id: '15', name: 'Automatización cliente' },
      { id: '16', name: 'Fortalecimiento Partner' },
      { id: '17', name: 'Tech Tips' },
      { id: '18', name: 'Reportes internos' },
      { id: '19', name: 'Soporte Técnico Interno' },
      { id: '20', name: 'Capacitación Técnica Interna' },
      { id: '21', name: 'Enroll interna' },
      { id: '22', name: 'Implementación herramienta nueva' },
      { id: '23', name: 'Servicios Técnicos' },
      { id: '24', name: 'Preventa técnica' },
      { id: '25', name: 'Actividades recreativas internas' },
      { id: '26', name: 'Implementación a medida' },
    ];
    setProjects(projectsData);
  };

  const calculateTotals = () => {
    const totals: { [key: string]: { tarjetas: number, horas: number, nombreProyecto: string } } = {};
    cards.filter(card => card.idSprint === sprintNumber).forEach(card => {
      if (!totals[card.idProyecto]) {
        const project = projects.find(p => p.id === card.idProyecto);
        totals[card.idProyecto] = {
          tarjetas: 0,
          horas: 0,
          nombreProyecto: project ? project.name : 'Proyecto desconocido'
        };
      }
      totals[card.idProyecto].tarjetas += 1;
      totals[card.idProyecto].horas += card.horas;
    });
    return totals;
  };

  useEffect(() => {
    fetchProjects();
    fetchCustomFields();
  }, []);

  useEffect(() => {
    if (customFields.length > 0 && projects.length > 0 && customFieldProyectoId) {
      fetchCards();
    }
  }, [customFields, projects, customFieldProyectoId, sprintNumber]);

  const totals = calculateTotals();

  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
      <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">Horas por Proyecto - Sprint {sprintNumber}</div>
      </header>
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table role="table" className="w-full">
          <thead>
            <tr role="row">
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Proyecto</div>
              </th>
              <th className="border-b border-navy-700 pr-16 pb-[10px] text-start">
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">ID Proyecto</div>
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
            {Object.entries(totals).map(([idProyecto, { tarjetas, horas, nombreProyecto }], index) => (
              <tr role="row" key={`${idProyecto}-${index}`}>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px] font-bold">{nombreProyecto}</td>
                <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">{idProyecto}</td>
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
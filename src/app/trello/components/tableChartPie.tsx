import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Registrar los componentes necesarios de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);
    // Datos para el gráfico de "pie"
    const data = {
    labels: ["Participante 1", "Participante 2", "Participante 3"],
    datasets: [
        {
        label: "Horas trabajadas",
        data: [12, 4, 15], // Los valores de las horas de los participantes
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
    };

const tableChartPie = () => {
  return (
        <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
            <header className="relative flex items-center justify-between pt-4">
                <div className="text-xl font-bold">Tarjetas</div>
            </header>
            <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table role="table" className="w-full">
                    <thead>
                    <tr role="row">
                        <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                        <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participantes</div>
                        </th>
                        <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                        <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participante 1</div>
                        </th>
                        <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                        <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participante 2</div>
                        </th>
                        <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                        <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Participante 3</div>
                        </th>
                        <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                        <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">Total de horas</div>
                        </th>
                    </tr>
                    </thead>
                    <tbody role="rowgroup">
                    <tr role="row">
                        <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-bold text-white">Rocio</p>
                        </div>
                        </td>
                        <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                        <div className="flex items-center">
                            <p className="text-sm font-bold text-white">12</p>
                        </div>
                        </td>
                        <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                        <p className="text-sm font-bold text-white">4</p>
                        </td>
                        <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                        <p className="text-sm font-bold text-white">15</p>
                        </td>
                        <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                        <p className="text-sm font-bold text-white">40</p>
                        </td>
                    </tr>
                    {/* Más filas */}
                    </tbody>
                </table>
            </div>
            {/* Gráfico de pie */}
            <div className="mt-8">
                <Pie data={data} />
            </div>
        </div>
  )
}

export default tableChartPie
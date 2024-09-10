import React from 'react'

const tablesHours = () => {
  return (
    <div className="!z-5 relative flex flex-col rounded-[20px] bg-navy-800 text-white w-full h-full sm:overflow-auto px-6">
    <header className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold">
        Proyectos
        </div>
    </header>
    <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table role="table" className="w-full">
        <thead>
            <tr role="row">
            <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                ID de proyecto
                </div>
            </th>
            <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                Nombre
                </div>
            </th>
            <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                Tarjetas
                </div>
            </th>
            <th colSpan={1} role="columnheader" className="border-b border-navy-700 pr-16 pb-[10px] text-start" style={{ cursor: "pointer" }}>
                <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                Horas
                </div>
            </th>
            </tr>
        </thead>
        <tbody role="rowgroup">
            <tr role="row">
            <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                <div className="flex items-center gap-2">
                    <p className='text-sm font-bold text-white'>13</p>
                </div>
            </td>
            <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                <div className="flex items-center">
                <p className="text-sm font-bold text-white">
                    Test
                </p>
                </div>
            </td>
            <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                <p className="text-sm font-bold text-white">
                4
                </p>
            </td>
            <td role="cell" className="pt-[14px] pb-[16px] sm:text-[14px]">
                <p className="text-sm font-bold text-white">
                15
                </p>
            </td>
            </tr>
            {/* Más filas */}
        </tbody>
        </table>
    </div>
    </div>


  )
}

export default tablesHours
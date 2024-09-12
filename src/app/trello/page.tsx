'use client'

import { useState } from 'react';
import Footer from "@/components/navigation/footer";
import TablesCards from "./components/tableCards";
import TableChartPie from "./components/tableChartPie";
import TablesHours from "./components/tablesHours";
import TablesPartners from "./components/tablesPartners";
import SearchBar from './components/searchBar'; 
import TableChartHour from './components/tableChartHour';

const Trello = () => {
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null); 

  return (
    <div className="mr-[5em] mt-5 overflow-auto ml-[5em]">
      <div className="flex flex-row justify-between items-center gap-10 mb-6">
        <h3 className="text-5xl font-bold">Trello</h3>
      <SearchBar setSelectedSprint={setSelectedSprint} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-4">
        <TablesHours sprintNumber={selectedSprint ?? ''} />
        <TablesPartners sprintNumber={selectedSprint ?? ''} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-4">
        <TablesCards />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TableChartHour sprintNumber={selectedSprint ?? ''} />
          <TableChartPie sprintNumber={selectedSprint ?? ''} />
        </div>
      </div>

      <Footer />

    </div>
  );
};

export default Trello;

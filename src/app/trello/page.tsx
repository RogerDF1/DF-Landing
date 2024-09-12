'use client'

import { useState } from 'react';
import Footer from "@/components/navigation/footer";
import Card from "./components/card";
import TablesCards from "./components/tableCards";
import TableChartPie from "./components/tableChartPie";
import TablesHours from "./components/tablesHours";
import TablesPartners from "./components/tablesPartners";
import { BackgroundBeams } from "@/components/ui/background-beams";
import TableProyects from "./components/tableProyects";
import BacklogChart from "./components/backlogChart";
import SearchBar from './components/searchBar'; 
import TableChartHour from './components/tableChartHour';

const Trello = () => {
  const [selectedSprint, setSelectedSprint] = useState<string | null>(null); 

  return (
    <div className="mr-[5em] mt-5 overflow-auto ml-[5em]">
      <div className="flex flex-row justify-between items-center gap-10 mb-6">
        <h3 className="text-5xl font-bold">Trello</h3>
              {/* Pasa setSelectedSprint al componente SearchBar */}
      <SearchBar setSelectedSprint={setSelectedSprint} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-4">
        <TablesHours sprintNumber={selectedSprint} />
        <TablesPartners sprintNumber={selectedSprint} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-4">
        <TablesCards />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TableChartHour sprintNumber={selectedSprint} />
          <TableChartPie sprintNumber={selectedSprint} />
        </div>
      </div>
{/*

      <div className="grid grid-cols-1 sm:grid-cols-2 mt-10 gap-6">
        <TableProyects />
        <BacklogChart />
      </div>
*/}


      <Footer />

      <BackgroundBeams className="absolute inset-0 z-[-1] bg-gradient-to-b from-black to-neutral-900" />

    </div>
  );
};

export default Trello;

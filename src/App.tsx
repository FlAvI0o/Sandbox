import React, { useState } from 'react';
import ProtocolCanvas from './components/ProtocolCanvas';
import Home from './pages/Home';
import Filter from './pages/Filter';
import Schedule from './pages/Schedule';

type PageState = 'HOME' | 'FILTER' | 'SCHEDULE';

function App() {
  const [currentPage, setCurrentPage] = useState<PageState>('HOME');
  
  // 0 = Chaos (Red), 1 = Order (Gold)
  // When they pass the Filter, we switch to Order.
  const visualPhase = currentPage === 'SCHEDULE' ? 1 : 0; 

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      
      {/* THE SOUL: Reacts to your progress */}
      <ProtocolCanvas phase={visualPhase} />

      {/* THE HUD */}
      <div className="absolute inset-0 z-10">
        {currentPage === 'HOME' && (
          <Home onStart={() => setCurrentPage('FILTER')} />
        )}
        
        {currentPage === 'FILTER' && (
           // When onPass is called, phase switches to 1 via state change
          <Filter onPass={() => setCurrentPage('SCHEDULE')} />
        )}

        {currentPage === 'SCHEDULE' && (
          <Schedule />
        )}
      </div>
      
      {/* ...grain overlay... */}
    </div>
  );
}

export default App;
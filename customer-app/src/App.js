import React from 'react';
import './App.css';
import CustomerTable from './CustomerTable'; // Import the CustomerTable component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Customer Data</h1>
      </header>
      <main>
        <CustomerTable /> {/* Render the CustomerTable component */}
      </main>
    </div>
  );
}

export default App;

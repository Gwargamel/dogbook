//Start-sida med lista över befintliga hundar och länkar till andra sidor 

// Importerar React-hooks och navigeringsfunktion från react-router-dom
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Importerar API-funktioner
import { fetchDogs, deleteDog } from '../api/dogService.js';
// Importerar CSS för styling
import '../App.css';

function Start() {
  const [dogs, setDogs] = useState([]); // State för att hålla listan av hundar

  useEffect(() => {
    const getDogs = async () => {
      try {
        const dogsData = await fetchDogs(); // Hämtar alla hundar från servern
        setDogs(dogsData); // Uppdaterar state med de hämtade hundarna
      } catch (error) {
        console.error('Error fetching dogs:', error); // Loggar eventuella fel vid hämtningen
      }
    };
    getDogs(); // Kallar på funktionen för att hämta hundar
  }, []); // Effekten körs en gång när komponenten monteras

  const handleDelete = async (id) => {
    try {
      await deleteDog(id); // Anropar API:t för att radera en hund
      const updatedDogs = dogs.filter(dog => dog._id !== id); // Filtrerar bort raderade hundar från listan
      setDogs(updatedDogs); // Uppdaterar state med den nya listan av hundar
    } catch (error) {
      console.error('Error deleting dog:', error); // Loggar eventuella fel vid raderingen
    }
  };

  // JSX som renderar startsidan
  return (
    
    <div className="container">
      <h1>Hunddagis</h1>
      <br />
      <Link to="/create" className="button">Skapa ny hund</Link>
      <br /><br />
      <ul className="friend-list">
        {dogs.map(dog => (
          <li key={dog._id} className="friend-item">
            <Link to={`/profile/${dog._id}`} className={dog.present ? 'dog-present' : 'dog-absent'}>
              {dog.name}
            </Link>
            <button className="button" onClick={() => handleDelete(dog._id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Exporterar komponenten för användning i andra delar av applikationen
export default Start;

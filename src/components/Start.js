import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchDogs, deleteDog } from '../api/dogService.js'; // Justera sökvägen efter din projektstruktur

function Start() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    const getDogs = async () => {
      try {
        const dogsData = await fetchDogs();
        setDogs(dogsData);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    };

    getDogs();
  }, []);

  const handleDeleteDog = async (id) => {
    try {
      await deleteDog(id);
      setDogs(dogs.filter(dog => dog._id !== id)); // Uppdatera statet för att reflektera borttagningen
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  };

  return (
    <div>
      <h1>Hunddagis</h1>
      <Link to="/create">Skapa ny hund</Link>
      <ul>
        {dogs.map(dog => (
          <li key={dog._id}>
            {dog.name} - {dog.present ? <span style={{color: 'green'}}>På dagiset</span> : <span style={{color: 'red'}}>Hemma</span>}
            <Link to={`/profile/${dog._id}`}> Profil </Link>
            <button onClick={() => handleDeleteDog(dog._id)} style={{marginLeft: '10px', color: 'red'}}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Start;

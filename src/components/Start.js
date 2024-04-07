import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchDogs, deleteDog } from '../api/dogService.js';

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

  const handleDelete = async (id) => {
    try {
      await deleteDog(id);
      const updatedDogs = dogs.filter(dog => dog._id !== id);
      setDogs(updatedDogs);
    } catch (error) {
      console.error('Error deleting dog:', error);
    }
  };

  return (
    <div className="container">
      <h1>Hunddagis</h1>
      <Link to="/create" className="button">Skapa ny hund</Link>
      <ul>
        {dogs.map(dog => (
          <li key={dog._id} className="friend-item">
            <Link to={`/profile/${dog._id}`} className={dog.present ? 'dog-present' : 'dog-absent'}>
              {dog.name}
            </Link>
            <button className="button" onClick={() => handleDelete(dog._id)}>Ta bort</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Start;

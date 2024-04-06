import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Start() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    axios.get('/api/dogs')
      .then(response => {
        setDogs(response.data);
      })
      .catch(error => {
        console.error('Error fetching dogs:', error);
      });
  }, []);

  const deleteDog = (id) => {
    axios.delete(`/api/dogs/${id}`)
      .then(() => {
        setDogs(dogs.filter(dog => dog._id !== id));
      })
      .catch(error => {
        console.error('Error deleting dog:', error);
      });
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
            <button onClick={() => deleteDog(dog._id)} style={{marginLeft: '10px', color: 'red'}}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Start;

//Create.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importera axios

function Create() {
  const navigate = useNavigate();
  const [dog, setDog] = useState({
    name: '',
    age: '',
    description: '',
    present: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDog(prevDog => ({
      ...prevDog,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dog.name || dog.age <= 0) {
      alert('Var vänlig fyll i namn och säkerställ att åldern är större än 0');
      return;
    }

    try {
      const response = await axios.post('/api/dogs', dog);
      console.log('Hunden skapad:', response.data); // Logga responsen från servern
      alert('Hunden har lagts till!');
      setDog({ name: '', age: '', description: '', present: false }); // Återställ formuläret
      navigate('/'); // Omdirigera användaren till startsidan
    } catch (error) {
      console.error('Fel vid skapande av hund:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulärelementen ska vara här */}
      <div>
        <label>Namn:</label>
        <input type="text" name="name" value={dog.name} onChange={handleChange} required />
      </div>
      <div>
        <label>Ålder:</label>
        <input type="number" name="age" value={dog.age} onChange={handleChange} required />
      </div>
      <div>
        <label>Beskrivning:</label>
        <textarea name="description" value={dog.description} onChange={handleChange} />
      </div>
      <div>
        <label>Närvarande på dagiset:</label>
        <input type="checkbox" name="present" checked={dog.present} onChange={handleChange} />
      </div>
      <button type="submit">Lägg till hund</button>
    </form>
  );
}

export default Create;

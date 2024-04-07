//Create.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createDog } from '../api/dogService.js'; // Importera createDog funktionen

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

    // Validera åldern som ett tal och inte som en sträng
    const validatedDog = {
      ...dog,
      age: parseInt(dog.age, 10),
    };

    if (!validatedDog.name || validatedDog.age <= 0) {
      alert('Var vänlig fyll i namn och säkerställ att åldern är större än 0');
      return;
    }

    try {
      const response = await createDog(validatedDog); // Använd createDog funktionen för att skicka datan
      console.log('Hunden skapad:', response); // Logga svaret från servern
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
      {/* Formulärelement här */}
      <button type="submit">Lägg till hund</button>
    </form>
  );
}

export default Create;

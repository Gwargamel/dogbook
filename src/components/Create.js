import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Importera useHistory hook från 'react-router-dom'

function Create() {
  const history = useHistory(); // Använd useHistory för att omdirigera användaren efter inskickning
  const [dog, setDog] = useState({
    name: '',
    age: 0, // Initialisera åldern som 0 eller null
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

    // Enkel validering
    if (!dog.name || dog.age <= 0) {
      alert('Var vänlig fyll i namn och säkerställ att åldern är större än 0');
      return;
    }

    try {
      const response = await fetch('/api/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dog),
      });

      if (!response.ok) throw new Error('Något gick fel vid sparandet av hunden');
      alert('Hunden har lagts till!');
      setDog({ name: '', age: 0, description: '', present: false }); // Återställ formuläret
      history.push('/'); // Omdirigera användaren till startsidan
    } catch (error) {
      console.error('Fel vid skapande av hund:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Formulärelement här */}
    </form>
  );
}

export default Create;

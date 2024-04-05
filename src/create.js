import React, { useState } from 'react';

function Create() {
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
    try {
      const response = await fetch('/api/dogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dog),
      });

      if (!response.ok) throw new Error('Något gick fel vid sparandet av hunden');
      // Rensa formuläret eller omdirigera användaren
      alert('Hunden har lagts till!');
      setDog({ name: '', age: '', description: '', present: false });
    } catch (error) {
      console.error('Fel vid skapande av hund:', error);
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Namn:
        <input
          type="text"
          name="name"
          value={dog.name}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Ålder:
        <input
          type="number"
          name="age"
          value={dog.age}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Beskrivning:
        <textarea
          name="description"
          value={dog.description}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Närvarande:
        <input
          type="checkbox"
          name="present"
          checked={dog.present}
          onChange={handleChange}
        />
      </label>
      <br />
      <button type="submit">Lägg till hund</button>
    </form>
  );
}

export default Create;

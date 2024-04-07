import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDogs, createDog } from '../api/dogService.js'; 
import '../App.css';

function Create() {
  const navigate = useNavigate();
  const [dog, setDog] = useState({
    name: '',
    age: '',
    description: '',
    present: false,
    friends: [] // Lägg till en ny property för vänner
  });
  const [allDogs, setAllDogs] = useState([]); // State för att lagra alla hundar

  // Hämta alla hundar när komponenten laddas
  useEffect(() => {
    const getAllDogs = async () => {
      const dogs = await fetchDogs();
      setAllDogs(dogs);
    };
    getAllDogs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDog(prevDog => ({
      ...prevDog,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Hantera förändringar i vänval
  const handleFriendSelection = (friendId) => {
    const isFriendSelected = dog.friends.includes(friendId);
    setDog(prevDog => ({
      ...prevDog,
      friends: isFriendSelected
        ? prevDog.friends.filter(id => id !== friendId)
        : [...prevDog.friends, friendId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newDog = {
      ...dog,
      age: Number(dog.age), // Konverterar åldern till ett nummer
    };

    try {
      await createDog(newDog); // Använd den uppdaterade funktionen för att skapa en hund
      alert('Hunden har lagts till!');
      navigate('/'); // Omdirigera användaren till startsidan
    } catch (error) {
      console.error('Fel vid skapande av hund:', error);
      alert('Fel vid skapande av hund:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Dina ursprungliga formulärfält här */}
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
      {/* Lägg till det nya fältet för att välja vänner */}
      <fieldset>
        <legend>Välj vänner (valfritt):</legend>
        {allDogs.map(friend => (
          <div key={friend._id}>
            <label>
              <input
                type="checkbox"
                name="friends"
                value={friend._id}
                checked={dog.friends.includes(friend._id)}
                onChange={() => handleFriendSelection(friend._id)}
              /> {friend.name}
            </label>
          </div>
        ))}
      </fieldset>
      <button type="submit">Lägg till hund</button>
    </form>
  );
}

export default Create;

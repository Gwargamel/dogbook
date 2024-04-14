// En komponent som ansvarar för att skapa en ny hund och hantera användarinteraktioner genom formulärfält. 

// Importerar React-hooks och navigeringsfunktion från react-router-dom
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

// Importerar API-funktioner för att hämta och skapa hundar
import { fetchDogs, createDog } from '../api/dogService.js'; 


function Create() {
  const navigate = useNavigate(); // Hook för att navigera användaren till en annan route
  const [dog, setDog] = useState({
    name: '',
    age: '',
    description: '',
    present: false,
    friends: [] // En property för hundens vänner
  });
  // State-array som anger tillgängliga hundar för val av vänner
  const [allDogs, setAllDogs] = useState([]); 

  // Hämtar alla hundar när komponenten laddas
  useEffect(() => {
    const getAllDogs = async () => {
      const dogs = await fetchDogs();
      setAllDogs(dogs); // Sätter alla hundar i state
    };
    getAllDogs();
  }, []);

  // Hanterar ändringar i formulärfälten
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDog(prevDog => ({
      ...prevDog,
      [name]: type === 'checkbox' ? checked : value // Uppdaterar värden för text eller checkbox
    }));
  };

  // Hanterar förändringar i val av hundvänner
  const handleFriendSelection = (friendId) => {
    const isFriendSelected = dog.friends.includes(friendId);
    setDog(prevDog => ({
      ...prevDog,
      friends: isFriendSelected
        ? prevDog.friends.filter(id => id !== friendId) // Tar bort vän om den redan är vald
        : [...prevDog.friends, friendId], // Lägger till vän om den inte redan är vald
    }));
  };

  // Hanterar när formuläret skickas
  const handleSubmit = async (e) => {
    e.preventDefault(); // Förhindrar standardbeteende för formulärskick
    const newDog = {
      ...dog,
      age: Number(dog.age), // Konverterar åldern till ett nummer
    };

    try {
      await createDog(newDog); // Skapar ny hund genom API-anrop
      alert('Hunden har lagts till!');
      navigate('/'); // Omdirigerar användaren tillbaka till startsidan
    } catch (error) {
      console.error('Fel vid skapande av hund:', error);
      alert('Fel vid skapande av hund:', error);
    }
  };

  // JSX för formuläret
  return (
    <form onSubmit={handleSubmit}>
      <div className="container">
        <label>Namn:</label>
        <input type="text" name="name" value={dog.name} onChange={handleChange} required />
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
      </div>
      <div className="container">
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
      </div>
      <div className="container">
      <button className="button" type="submit">Lägg till hund</button>
      <br /><br />
          <Link to="/" className="App-link">Tillbaka till startsidan</Link>
      </div>
    </form>
  );
}

// Exporterar komponenten för användning i andra delar av applikationen
export default Create;

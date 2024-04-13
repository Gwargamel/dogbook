//Komponenten hanterar formulärinmatning, val av vänner och submission av det uppdaterade hundobjektet till servern. Vid framgångsrik uppdatering visas en alert och användaren navigeras tillbaka till hemsidan.

// Importerar React-hooks och navigeringsfunktion från react-router-dom
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Importerar API-funktioner för att uppdatera hundar
import { fetchDogById, updateDog, fetchDogs } from '../api/dogService.js';

const Edit = () => {
  // Använder useParams för att få tag i ID från URL:en, och useNavigate för att kunna omdirigera användaren
  const { id } = useParams();
  const navigate = useNavigate();
  // States för hunddata, lista på alla hundar, laddningsstatus och felmeddelanden
  const [dog, setDog] = useState({ name: '', age: '', description: '', friends: [] });
  const [allDogs, setAllDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

   // Använder useEffect för att hämta data när komponenten laddas
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dogData = await fetchDogById(id); // Hämtar information om hunden
        const dogsData = await fetchDogs(); // Hämtar information om alla hundar
        setDog(dogData); // Sätter hunden i state
        setAllDogs(dogsData.filter(d => d._id !== id)); // Sätter en filtrerad lista på alla hundar (utom den aktuella hunden) i state
      } catch (error) {
        console.error('Failed to fetch data', error); // Loggar eventuella fel
        setError('Ett fel uppstod.'); // Sätter felmeddelandet i state
      } finally {
        setIsLoading(false); // Sätter isLoading till false när data är laddad eller ett fel uppstår
      }
    };

    fetchData();
  }, [id]); // Effekten körs när 'id' ändras

  // Hanterar ändringar i formulärfälten
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDog(prevDog => ({
      ...prevDog,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Hanterar när användaren väljer/tar bort en hundvän
  const handleFriendSelection = (friendId) => {
    const isFriendSelected = dog.friends.includes(friendId); 
    if (isFriendSelected) {
      setDog(prevDog => ({
        ...prevDog,
        friends: prevDog.friends.filter(id => id !== friendId), // Tar bort ID om det redan finns
      }));
    } else {
      setDog(prevDog => ({
        ...prevDog,
        friends: [...prevDog.friends, friendId], // Lägger till ID om det inte redan finns
      }));
    }
  };

   // Hanterar när formuläret skickas
  const handleSubmit = async (event) => {
    event.preventDefault(); // Förhindrar att sidan startas om
    try {
      await updateDog(id, dog); // Uppdaterar hundinformationen via API-anropet
      alert('Hunden har uppdaterats!'); // Visar en bekräftelse-alert
      navigate('/'); // Omdirigerar användaren till startsidan
    } catch (error) {
      console.error('Error updating dog', error); // Loggar eventuella fel
    }
  };

  // Visar laddningsmeddelande om innehållet laddas
  if (isLoading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  // Formuläret för att redigera hundens information
  return (
    <div className="container">
      <div className="edit-container">
        <form onSubmit={handleSubmit}>
          <label>
            Namn:
            <input type="text" name="name" value={dog.name} onChange={handleInputChange} />
          </label>
          <label>
            Ålder:
            <input type="number" name="age" value={dog.age} onChange={handleInputChange} />
          </label>
          <label>
            Beskrivning:
            <textarea name="description" value={dog.description} onChange={handleInputChange} />
          </label>
          <fieldset>
            <legend>Välj vänner:</legend>
            {allDogs.map((friend) => (
  <div key={friend._id} className="friend-selection">
    <input
      type="checkbox"
      name="friends"
      value={friend._id}
      checked={dog.friends.includes(friend._id)}
      onChange={() => handleFriendSelection(friend._id)}
    />
    <label onClick={() => handleFriendSelection(friend._id)}>{friend.name}</label>
  </div>
))}
          </fieldset>
          <button className="button" type="submit">Spara ändringar</button>
        </form>
      </div>
    </div>
  );
};

// Exporterar komponenten för användning i andra delar av applikationen
export default Edit;

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams(); // Använd hundens unika ID för att hämta och uppdatera profildata
  const history = useHistory(); // Används för att navigera tillbaka efter att ändringar sparats
  const [dog, setDog] = useState({ name: '', age: '', description: '', friends: [] });
  const [allDogs, setAllDogs] = useState([]); // Lista över alla hundar för att lägga till i vänlistan
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dogData, dogsData] = await Promise.all([
          fetch(`/api/dogs/${id}`).then(res => res.json()),
          fetch('/api/dogs').then(res => res.json())
        ]);
        setDog(dogData);
        setAllDogs(dogsData.filter(({ id: otherId }) => otherId !== id)); // Exkludera den aktuella hunden från vänlistan
      } catch (error) {
        console.error('Failed to fetch data', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setDog(prevDog => ({
      ...prevDog,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await fetch(`/api/dogs/${id}`, {
        method: 'PUT', // Använd 'PATCH' om du endast uppdaterar en del av datan
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dog),
      });
      history.push('/'); // Navigera tillbaka till startsidan efter uppdatering
    } catch (error) {
      console.error('Failed to update dog profile', error);
    }
  };

  const handleFriendToggle = (friendId) => {
    setDog(prevDog => ({
      ...prevDog,
      friends: prevDog.friends.includes(friendId) ?
        prevDog.friends.filter(id => id !== friendId) : // Ta bort vän
        [...prevDog.friends, friendId], // Lägg till vän
    }));
  };

  if (isLoading) {
    return <p>Laddar...</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Namn:
        <input
          type="text"
          name="name"
          value={dog.name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Ålder:
        <input
          type="number"
          name="age"
          value={dog.age}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Beskrivning:
        <textarea
          name="description"
          value={dog.description}
          onChange={handleInputChange}
        />
      </label>
      <fieldset>
        <legend>Vänner</legend>
        {allDogs.map(friend => (
          <label key={friend.id}>
            <input
              type="checkbox"
              checked={dog.friends.includes(friend.id)}
              onChange={() => handleFriendToggle(friend.id)}
            />
            {friend.name}
          </label>
        ))}
      </fieldset>
      <button type="submit">Spara ändringar</button>
    </form>
  );
};

export default Edit;

import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';

const Edit = () => {
  const { id } = useParams();
  const history = useHistory();
  const [dog, setDog] = useState({ name: '', age: 0, description: '', friends: [] });
  const [allDogs, setAllDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [dogResponse, dogsResponse] = await Promise.all([
          fetch(`/api/dogs/${id}`).then(res => res.json()),
          fetch('/api/dogs').then(res => res.json())
        ]);
        setDog(dogResponse);
        setAllDogs(dogsResponse.filter(({ _id: otherId }) => otherId !== id)); // Exkludera den aktuella hunden från vänlistan
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Ett fel uppstod när hundens information laddades.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setDog(prevDog => ({
      ...prevDog,
      [name]: type === 'checkbox' ? checked : (name === 'age' ? Number(value) : value),
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!dog.name || dog.age <= 0) {
      alert('Var vänlig ange ett giltigt namn och en ålder större än 0.');
      return;
    }

    try {
      const response = await fetch(`/api/dogs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dog),
      });

      if (!response.ok) throw new Error('Misslyckades med att uppdatera hunden.');

      alert('Hunden har uppdaterats framgångsrikt!');
      history.push('/');
    } catch (error) {
      console.error('Fel vid uppdatering av hundprofil:', error);
      alert(error.message);
    }
  };

  const handleFriendToggle = (friendId) => {
    setDog(prevDog => ({
      ...prevDog,
      friends: prevDog.friends.includes(friendId) ?
        prevDog.friends.filter(id => id !== friendId) :
        [...prevDog.friends, friendId],
    }));
  };

  if (isLoading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

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
      <br />
      <label>
        Ålder:
        <input
          type="number"
          name="age"
          value={dog.age}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Beskrivning:
        <textarea
          name="description"
          value={dog.description}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <fieldset>
        <legend>Vänner</legend>
        {allDogs.map(friend => (
          <label key={friend._id}>
            <input
              type="checkbox"
              checked={dog.friends.includes(friend._id)}
              onChange={() => handleFriendToggle(friend._id)}
            />
            {friend.name}
          </label>
        ))}
      </fieldset>
      <br />
      <button type="submit">Spara ändringar</button>
    </form>
  );
};

export default Edit;

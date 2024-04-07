//Edit.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDogById, updateDog, fetchDogs } from '../api/dogService.js'; // Justera sökvägen efter din projektmappstruktur

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState({ name: '', age: '', description: '', friends: [] });
  const [allDogs, setAllDogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const dogData = await fetchDogById(id);
        const dogsData = await fetchDogs();
        setDog(dogData);
        // Filtrera bort nuvarande hund från listan av alla hundar
        setAllDogs(dogsData.filter(({ _id: otherId }) => otherId !== id));
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
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleFriendToggle = (friendId) => {
    setDog(prevDog => ({
      ...prevDog,
      friends: prevDog.friends.includes(friendId) ?
        prevDog.friends.filter(id => id !== friendId) :
        [...prevDog.friends, friendId],
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateDog(id, dog);
      alert('Hunden har uppdaterats framgångsrikt!');
      navigate('/');
    } catch (error) {
      console.error('Fel vid uppdatering av hundprofil:', error);
      alert(error.message);
    }
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
          value={dog.name || ''}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Ålder:
        <input
          type="number"
          name="age"
          value={dog.age || ''}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <label>
        Beskrivning:
        <textarea
          name="description"
          value={dog.description || ''}
          onChange={handleInputChange}
        />
      </label>
      <br />
      <fieldset>
        <legend>Välj vänner:</legend>
        {allDogs.length > 0 ? (
          allDogs.map((friend) => (
            <div key={friend._id}>
              <label>
                <input
                  type="checkbox"
                  checked={dog.friends.includes(friend._id)}
                  onChange={() => handleFriendToggle(friend._id)}
                /> {friend.name}
              </label>
            </div>
          ))
        ) : (
          <p>Inga andra hundar att visa.</p>
        )}
      </fieldset>
      <button type="submit">Spara ändringar</button>
    </form>
  );
};

export default Edit;

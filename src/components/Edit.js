import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDogById, updateDog, fetchDogs } from '../api/dogService.js';

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
        setAllDogs(dogsData.filter(d => d._id !== id)); // Exkludera nuvarande hund från listan
      } catch (error) {
        console.error('Failed to fetch data', error);
        setError('Ett fel uppstod.');
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

  const handleFriendSelection = (friendId) => {
    const isFriendSelected = dog.friends.includes(friendId);
    if (isFriendSelected) {
      setDog(prevDog => ({
        ...prevDog,
        friends: prevDog.friends.filter(id => id !== friendId),
      }));
    } else {
      setDog(prevDog => ({
        ...prevDog,
        friends: [...prevDog.friends, friendId],
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await updateDog(id, dog);
      alert('Hunden har uppdaterats!');
      navigate('/');
    } catch (error) {
      console.error('Error updating dog', error);
    }
  };

  if (isLoading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
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
      <button type="submit">Spara ändringar</button>
    </form>
  );
};

export default Edit;

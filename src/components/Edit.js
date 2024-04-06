import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchDogById, updateDog, fetchDogs } from '../api/dogService.js'; // Justera sökvägen till din servicefil

const Edit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState({ name: '', age: 0, description: '', friends: [] });
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
        setAllDogs(dogsData.filter(({ _id: otherId }) => otherId !== id)); // Exkludera den aktuella hunden från vänlistan
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
      await updateDog(id, dog);
      alert('Hunden har uppdaterats framgångsrikt!');
      navigate('/'); // Använd navigate för att omdirigera användaren
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
      {/* Formulärelementen liknar det som du hade tidigare */}
    </form>
  );
};

export default Edit;

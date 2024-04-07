import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDogById, updateDog } from '../api/dogService.js';

const Profile = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const dogData = await fetchDogById(id);
        setDog(dogData);
      } catch (error) {
        console.error("Failed to fetch dog's profile", error);
        setError('Ett fel uppstod när hundens profil skulle hämtas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handlePresenceToggle = async () => {
    try {
      const updatedDog = await updateDog(id, { ...dog, present: !dog.present });
      setDog(updatedDog);
    } catch (error) {
      console.error('Error updating dog', error);
    }
  };

  if (isLoading) return <p>Laddar...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>{dog?.name}</h2>
      <p>Ålder: {dog?.age}</p>
      <p>Beskrivning: {dog?.description}</p>
      <label>
        Närvarande:
        <input
          type="checkbox"
          checked={dog?.present}
          onChange={handlePresenceToggle}
        />
      </label>
      <br />
      <Link to="/">Tillbaka till startsidan</Link>
    </div>
  );
};

export default Profile;

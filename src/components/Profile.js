import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDogById, fetchDogsByIds } from '../api/dogService.js';

const Profile = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndFriends = async () => {
      setIsLoading(true);
      try {
        // Hämta information om den specifika hunden baserat på ID
        const dogData = await fetchDogById(id);
        if (!dogData) {
          setError('Hundprofilen kunde inte hittas.');
          setIsLoading(false);
          return;
        }
        setDog(dogData);

        // Hämta information om hundens vänner om det finns några
        if (dogData.friends && dogData.friends.length > 0) {
          const friendsData = await fetchDogsByIds(dogData.friends);
          setFriends(friendsData);
        }
      } catch (error) {
        console.error("Failed to fetch profile or friends", error);
        setError('Ett fel uppstod när hundens profil eller vänner skulle hämtas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndFriends();
  }, [id]);

  if (isLoading) {
    return <p>Laddar...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>{dog.name}</h2>
      <p>Ålder: {dog.age}</p>
      <p>Beskrivning: {dog.description}</p>
      {friends.length > 0 ? (
        <>
          <p>Vänner:</p>
          <ul>
            {friends.map(friend => (
              <li key={friend._id}>{friend.name}</li>
            ))}
          </ul>
        </>
      ) : (
        <p>Inga vänner listade.</p>
      )}
      <Link to="/">Tillbaka till startsidan</Link>
      <Link to={`/edit/${id}`} style={{ marginLeft: '10px' }}>Redigera</Link>
    </div>
  );
};

export default Profile;

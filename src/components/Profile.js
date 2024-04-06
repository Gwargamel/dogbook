import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDogById, fetchDogsByIds } from '../api/dogService.js';

const Profile = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfileAndFriends = async () => {
      setIsLoading(true);
      try {
        const dogData = await fetchDogById(id);
        setDog(dogData);
        
        if (dogData && dogData.friends && dogData.friends.length > 0) {
          const friendsData = await fetchDogsByIds(dogData.friends);
          setFriends(friendsData);
        }
      } catch (error) {
        console.error("Failed to fetch profile or friends", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndFriends();
  }, [id]);

  if (isLoading) return <p>Laddar...</p>;

  if (!dog) return <p>Hundprofilen kunde inte hittas.</p>;

  return (
    <div>
      <h2>{dog.name}</h2>
      <p>Ålder: {dog.age}</p>
      <p>Beskrivning: {dog.description}</p>
      <p>Vänner:</p>
      <ul>
        {friends.map(friend => (
          <li key={friend._id}>{friend.name}</li>
        ))}
      </ul>
      <Link to="/">Tillbaka till startsidan</Link>
      <Link to={`/edit/${id}`} style={{ marginLeft: '10px' }}>Redigera</Link>
    </div>
  );
};

export default Profile;

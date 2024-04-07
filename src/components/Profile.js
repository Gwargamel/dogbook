import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchDogById, updateDog, fetchDogsByIds } from '../api/dogService.js';

const Profile = () => {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [friends, setFriends] = useState([]);
  const [dogImage, setDogImage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndImageAndFriends = async () => {
      setIsLoading(true);
      try {
        const dogData = await fetchDogById(id);
        setDog(dogData);

        if (dogData.friends.length > 0) {
          const friendsData = await fetchDogsByIds(dogData.friends);
          setFriends(friendsData);
        }

        const imageRes = await fetch('https://dog.ceo/api/breeds/image/random');
        const imageData = await imageRes.json();
        setDogImage(imageData.message);
      } catch (error) {
        console.error("Failed to fetch dog's profile, image, or friends", error);
        setError('Ett fel uppstod när hundens profil, bild eller vänner skulle hämtas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileAndImageAndFriends();
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
    <div className="container">
      <div className="profile-container">
        {dogImage && <img src={dogImage} alt="Hund" className="dog-photo" />}
        <h2>{dog?.name}</h2>
        <p>Ålder: {dog?.age}</p>
        <p>Beskrivning: {dog?.description}</p>
        {friends.length > 0 && (
          <>
            <h3>Vänner:</h3>
            <ul className="friend-list">
              {friends.map(friend => (
                <li key={friend._id} className="friend-item">{friend.name}</li>
              ))}
            </ul>
          </>
        )}
        <div className="presence-container">
          <label>
            Närvarande:
            <input
              type="checkbox"
              checked={dog?.present}
              onChange={handlePresenceToggle}
            />
          </label>
        </div>
        <br />
        <Link to={`/edit/${id}`} className="button">Redigera</Link>
        <br />
        <Link to="/" className="App-link">Tillbaka till startsidan</Link>
      </div>
    </div>
  );
};

export default Profile;

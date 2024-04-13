// Komponenten visar en hunds profil med bild, information och vänlista. Användaren kan ändra hundens närvarostatus och navigera till redigeringsvy eller tillbaka till hemsidan. 

// Importerar React-hooks och navigeringsfunktion från react-router-dom
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Importerar API-funktioner
import { fetchDogById, updateDog, fetchDogsByIds } from '../api/dogService.js';

const Profile = () => { // Hämtar ID från URL-parametern och initierar state-variabler
  const { id } = useParams();
  const [dog, setDog] = useState(null); // State för hundens profildata
  const [friends, setFriends] = useState([]); // State för hundens vänlista
  const [dogImage, setDogImage] = useState(''); // State för hundens profilbild
  const [isLoading, setIsLoading] = useState(true); // State för laddningsindikator
  const [error, setError] = useState(''); // State för felmeddelanden

  // Effekten körs när komponenten monteras och varje gång 'id' ändras 
  useEffect(() => {
    const fetchProfileAndImageAndFriends = async () => {
      setIsLoading(true);
      try {
        const dogData = await fetchDogById(id); // API-anrop för att hämta hundens data
        setDog(dogData); // Sätter hundens data i state

        // Om hunden har vänner hämtas deras data
        if (dogData.friends.length > 0) {
          const friendsData = await fetchDogsByIds(dogData.friends);
          setFriends(friendsData); // Sätter hundvännernas data i state
        }

        // Hämtar en slumpmässig hundbild från ett externt API
        const imageRes = await fetch('https://dog.ceo/api/breeds/image/random');
        const imageData = await imageRes.json();
        setDogImage(imageData.message); // Sätter hundens bild i state
      } catch (error) {
        console.error("Failed to fetch dog's profile, image, or friends", error);
        setError('Ett fel uppstod när hundens profil, bild eller vänner skulle hämtas.');
      } finally {
        setIsLoading(false); // Indikerar att laddningen är klar
      }
    };

    fetchProfileAndImageAndFriends();
  }, [id]);

   // Hanterar växlingen av närvarostatus för hunden
  const handlePresenceToggle = async () => {
    try {
      const updatedDog = await updateDog(id, { ...dog, present: !dog.present });
      setDog(updatedDog); // Uppdaterar hundens data med den nya närvarostatusen
    } catch (error) {
      console.error('Error updating dog', error);
    }
  };

  if (isLoading) return <p>Laddar...</p>; // Visar laddningsmeddelande medan data hämtas
  if (error) return <p>{error}</p>; // Visar felmeddelande om något går fel

  // JSX som renderar hundens profil
  return (
    <div className="container">
      <div className="profile-container">
        {dogImage && <img src={dogImage} alt="Hund" className="dog-photo" />}
        <h2>{dog?.name}</h2>
        <p>Ålder: {dog?.age}</p>
        <p>Beskrivning: {dog?.description}</p>
        {friends.length > 0 && (
          <>
            <h2>Vänner:</h2>
            <ul className="friend-list">
              {friends.map(friend => (
                <li key={friend._id} className="friend-item">{friend.name}</li>
              ))}
            </ul>
          </>
        )}
        <div className="presence-container">
          <label className="checkbox-label">
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
        <br />
        <Link to="/" className="App-link">Tillbaka till startsidan</Link>
      </div>
    </div>
  );
};

// Exporterar komponenten för användning i andra delar av applikationen
export default Profile;

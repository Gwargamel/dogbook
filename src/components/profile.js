import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const Profile = () => {
  const { id } = useParams(); // Antag att varje hund har en unik ID
  const [dog, setDog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Funktion för att hämta hundens profildata
  useEffect(() => {
    const fetchDogProfile = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/dogs/${id}`); // Antag att detta är din API-endpoint
        const data = await response.json();
        setDog(data);
      } catch (error) {
        console.error("Failed to fetch dog profile", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDogProfile();
  }, [id]); // Kör denna effekt när `id` ändras

  // Laddningsindikator
  if (isLoading) {
    return <p>Laddar...</p>;
  }

  // Om ingen hund hittades
  if (!dog) {
    return <p>Hundprofilen kunde inte hittas.</p>;
  }

  return (
    <div>
      <img src={dog.imageUrl} alt={dog.name} style={{ width: '100%', maxWidth: '300px', height: 'auto' }} />
      <h2>{dog.name}</h2>
      <p>Smeknamn: {dog.nickname}</p>
      <p>Ålder: {dog.age}</p>
      <p>Beskrivning: {dog.description}</p>
      <p>Vänner:</p>
      <ul>
        {dog.friends.map(friend => (
          <li key={friend.id}>{friend.name}</li>
        ))}
      </ul>
      <label>
        Närvarande på dagiset:
        <input type="checkbox" checked={dog.isPresent} readOnly />
      </label>
      <br />
      <Link to="/">Tillbaka till startsidan</Link>
      <br />
      <Link to={`/edit/${id}`}>Redigera</Link>
    </div>
  );
};

export default Profile;

import React from 'react';

const Start = () => {
  return (
    <div>
      <h1>Hunddagis Admin</h1>
      <p>Här visas en lista över hundar:</p>
      {/* Exempel på en lista, ersätt med dynamisk data */}
      <ul>
        <li>Max - <span style={{color: 'green'}}>På dagiset</span> <button>X</button></li>
        <li>Bella - <span style={{color: 'red'}}>Hemma</span> <button>X</button></li>
      </ul>
      <a href="/create">Skapa ny hund</a>
    </div>
  );
};

export default Start;

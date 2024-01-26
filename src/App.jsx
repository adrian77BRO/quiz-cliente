import { useState } from 'react';
import { Chat } from '../src/Chat';
import { Preguntas } from './Preguntas';

export default function App() {
  const [username, setUsername] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username) {
      setIsLogged(true);
    } else {
      alert('Ingrese su nombre por favor');
    }
  };

  return (
    <div>
      {!isLogged && (
        <div>
          <label>Ingresa tu nombre: </label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          <button onClick={handleUsernameSubmit}>Entrar</button>
        </div>
      )}
      {isLogged && (
        <div>
          <Preguntas username={username} />
          <Chat username={username} />
        </div>
      )}
    </div>
  );
}
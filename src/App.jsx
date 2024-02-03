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
        <div className='container text-center bg-secondary p-3 rounded-3'>
          <div className='row'>
            <div className='col'>
              <Preguntas username={username} />
            </div>
            <div className='col'>
              <Chat username={username} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
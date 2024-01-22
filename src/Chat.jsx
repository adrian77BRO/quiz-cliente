import { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

export function Chat() {
    const [mensaje, setMensaje] = useState('');
    const [mensajes, setMensajes] = useState([]);

    const enviarMensaje = (e) => {
        e.preventDefault();

        const nuevoMensaje = {
            cuerpo: mensaje,
            from: 'Me'
        }
        setMensajes([...mensajes, nuevoMensaje]);
        socket.emit('message', mensaje);
    }

    useEffect(() => {
        socket.on('message', recibirMensaje);

        return () => {
            socket.off('message', recibirMensaje);
        }
    }, []);

    const recibirMensaje = (mensaje) => {
        setMensajes(state => [...state, mensaje]);
    }

    return (
        <div className='chat'>
            <form onSubmit={enviarMensaje}>
                <input type='text' placeholder='Escribir mensaje...'
                    onChange={(e) => setMensaje(e.target.value)} />
                <button>Enviar</button>
            </form>

            <ul>
                {mensajes.map((mensaje, i) => (
                    <li key={i}>{mensaje.from}: {mensaje.cuerpo}</li>
                ))}
            </ul>
        </div>
    )
}
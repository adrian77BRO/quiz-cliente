import { useState, useEffect } from 'react';

export function Chat({ username }) {
    const [mensajes, setMensajes] = useState([]);
    const [usuario, setUsuario] = useState('');
    const [mensaje, setMensaje] = useState('');

    const enviarMensajes = async () => {
        await fetch('http://localhost:3000/mensajes/enviar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario, mensaje }),
        });
        setMensaje('');
    };

    useEffect(() => {
        const obtenerMensajes = async () => {
            try {
                const response = await fetch('http://localhost:3000/mensajes/recibir');
                const nuevosMensajes = await response.json();
                setMensajes(nuevosMensajes);
            } catch (error) {
                console.log('Error al cargar los mensajes', error);
            }
        };

        const obtenerNuevoMensaje = async () => {
            try {
                const response = await fetch('http://localhost:3000/mensajes/nuevo-mensaje');
                const nuevoMensaje = await response.json();
                setMensajes(prevMessages => [...prevMessages, nuevoMensaje]);
            } catch (error) {
                console.log('Error al cargar los mensajes', error);
            } finally {
                obtenerNuevoMensaje();
            }
        };

        setUsuario(username);
        obtenerMensajes();
        obtenerNuevoMensaje();

        return () => { };
    }, []);

    return (
        <div className="App">
            <div>
                <h2>Chat</h2>
                <div>
                    {mensajes.map((msg, index) => (
                        <div key={index} className='bg-info p-1 m-1 rounded-2'>
                            <strong>{msg.usuario}:</strong> {msg.mensaje}
                        </div>
                    ))}
                </div>
                <div>
                    <input className='form-control'
                        type="text"
                        placeholder="Message"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                    />
                    <button onClick={enviarMensajes} className='btn btn-warning m-2'>Enviar</button>
                </div>
            </div>
        </div>
    );
}
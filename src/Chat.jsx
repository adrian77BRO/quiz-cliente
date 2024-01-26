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

    const getMensajes = async () => {
        const response = await fetch('http://localhost:3000/mensajes/recibir');
        const nuevosMensajes = await response.json();
        setMensajes(...mensajes, nuevosMensajes);
        getMensajes();
    };

    useEffect(() => {
        setUsuario(username);
        getMensajes();
    }, []);

    return (
        <div className="App">
            <div>
                <h2>Chat</h2>
                <div>
                    {mensajes.map((msg, index) => (
                        <div key={index}>
                            <strong>{msg.usuario}:</strong> {msg.mensaje}
                        </div>
                    ))}
                </div>
                <div>
                    <input
                        type="text"
                        placeholder="Message"
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                    />
                    <button onClick={enviarMensajes}>Enviar</button>
                </div>
            </div>
        </div>
    );
}
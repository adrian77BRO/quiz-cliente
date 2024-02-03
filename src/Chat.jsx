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
        try {
            const response = await fetch('http://localhost:3000/mensajes/recibir');
            const nuevosMensajes = await response.json();
            if (nuevosMensajes.length > 0) {
                setMensajes(...mensajes, nuevosMensajes);
                setTimeout(getMensajes, 1000);
            }
            /*setMensajes(...mensajes, nuevosMensajes);
            setTimeout(getMensajes, 1000);*/
        } catch (error) {
            console.log('Error al cargar los mensajes', error);
        }
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
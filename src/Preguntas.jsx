import React, { useEffect, useState } from 'react';

export function Preguntas({ username }) {
    const [pregunta, setPregunta] = useState(null);
    const [respuesta, setRespuesta] = useState('');
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(10);
    const [jugadoresConectados, setJugadoresConectados] = useState(0);
    const [notificacion, setNotificacion] = useState('');
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            console.log('Conexión establecida');
            setWs(socket);
            socket.send('Nuevo jugador');
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'nuevaPregunta') {
                setPregunta(data.data);
                setRespuesta('');
                setTiempo(data.tiempo);
                iniciarTemporizador();
            } else if (data.type === 'puntos') {
                setPuntos(data.data);
            } else if (data.type === 'finDelJuego') {
                crearNotificacion(`¡Juego terminado! Puntaje: ${data.data.puntos}`);
                setPuntos(0);
                setPregunta(null);
                setRespuesta('');
            } else if (data.type === 'nuevoJugador') {
                setJugadoresConectados(data.data.totalJugadores);
                crearNotificacion(`Total de jugadores: ${data.data.totalJugadores}`);
            } else if (data.type === 'jugadorDesconectado') {
                setJugadoresConectados(data.data.totalJugadores);
                crearNotificacion(`Total de jugadores: ${data.data.totalJugadores}`);
            }
        };

        socket.onclose = () => {
            console.log('Conexión cerrada');
        };

        return () => {
            socket.close();
        };
    }, []);

    const iniciarTemporizador = () => {
        const temporizador = setInterval(() => {
            setTiempo((prevTiempo) => {
                return prevTiempo - 1;
            });
        }, 1000);
        return () => clearInterval(temporizador);
    };

    const handleChangeRespuesta = (event) => {
        setRespuesta(event.target.value);
    };

    const enviarRespuesta = () => {
        if (respuesta !== '' && ws) {
            ws.send(respuesta);
        }
    };

    const obtenerNotificaciones = async () => {
        try {
            const response = await fetch('http://localhost:3000/notifs/getall');
            const data = await response.json();
            setNotificacion(data);
        } catch (error) {
            console.error('Error al obtener notificaciones', error);
        }
    };

    const crearNotificacion = async (cuerpo) => {
        await fetch('http://localhost:3000/notifs/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cuerpo }),
        });
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            obtenerNotificaciones();
        }, 2000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <h3>{username}</h3>
            <div className='bg-success rounded-2 text-center'>{notificacion}</div>
            {pregunta && (
                <div className='bg-info rounded-2 m-4 p-3'>
                    <p>{pregunta.pregunta}</p>
                    <ul>
                        {pregunta.opciones.map((opcion, index) => (
                            <li key={index}>
                                <label>
                                    <input
                                        type="radio"
                                        name="respuesta"
                                        value={opcion}
                                        checked={respuesta === opcion}
                                        onChange={handleChangeRespuesta}
                                    />
                                    {opcion}
                                </label>
                            </li>
                        ))}
                    </ul>
                    <button onClick={enviarRespuesta} className='btn btn-warning m-2'>Enviar Respuesta</button>
                </div>
            )}
            <p className='bg-success rounded-2 text-center'>Puntos: {puntos}</p>
        </div>
    );
};
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function Preguntas({ username }) {
    const [pregunta, setPregunta] = useState(null);
    const [respuesta, setRespuesta] = useState('');
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(10);
    const [jugadoresConectados, setJugadoresConectados] = useState(0);
    const [notificacion, setNotificacion] = useState('');
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = io('http://localhost:3000/quiz');
        const room = 'salaJugadores';

        socket.emit('joinRoom', room, username);

        socket.on('connect', () => {
            console.log('Conexión establecida');
            setSocket(socket);
            socket.emit('Nuevo jugador');
        });

        socket.on('nuevaPregunta', (data) => {
            setPregunta(data.pregunta);
            console.log(pregunta);
            setRespuesta('');
            setTiempo(data.tiempo);
            iniciarTemporizador();
        });

        socket.on('puntos', (data) => {
            setPuntos(data);
        });

        socket.on('finDelJuego', (data) => {
            crearNotificacion(`¡Juego terminado! Puntaje: ${data.puntaje}`);
            setPuntos(0);
            setPregunta(null);
            setRespuesta('');
        });

        socket.on('nuevoJugador', (data) => {
            setJugadoresConectados(data.totalJugadores);
            crearNotificacion(`Total de jugadores: ${data.totalJugadores}`);
        });

        socket.on('jugadorDesconectado', (data) => {
            setJugadoresConectados(data.totalJugadores);
            crearNotificacion(`Total de jugadores: ${data.totalJugadores}`);
        });

        socket.on('disconnect', () => {
            console.log('Conexión cerrada');
        });

        return () => {
            socket.disconnect();
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
        if (respuesta !== '' && socket) {
            socket.emit('respuesta', respuesta, 'salaJugadores');
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
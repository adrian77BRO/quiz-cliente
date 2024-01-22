import React, { useEffect, useState } from 'react';

export function Preguntas() {
    const [pregunta, setPregunta] = useState(null);
    const [respuesta, setRespuesta] = useState('');
    const [puntos, setPuntos] = useState(0);
    const [tiempo, setTiempo] = useState(0);
    const [ws, setWs] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:3000');

        socket.onopen = () => {
            console.log('Conexión establecida');
            setWs(socket);
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
                alert(`¡Juego terminado! Puntaje: ${data.data.puntos}`);
                setPuntos(0);
                setPregunta(null);
                setRespuesta('');
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
        // Temporizador para actualizar el tiempo restante
        const temporizador = setInterval(() => {
            setTiempo((prevTiempo) => prevTiempo - 1);
        }, 1000);

        // Limpiar el temporizador al desmontar el componente o al cambiar de pregunta
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

    return (
        <div>
            {pregunta && (
                <div>
                    <h1>Pregunta:</h1>
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
                    <button onClick={enviarRespuesta}>Enviar Respuesta</button>
                </div>
            )}
            <p>Puntos: {puntos}</p>
        </div>
    );
};
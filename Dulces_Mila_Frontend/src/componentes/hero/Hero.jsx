import "./Hero.css";
import imagenFondo from "../../assets/img/1.jpg";
import { useNavigate } from 'react-router-dom';

export function Hero() {
    const navigate = useNavigate(); // Inicializa useNavigate

    // Función para navegar dentro de React
    const irACatalogo = () => {
        navigate('/productos'); // Cambia '/productos' a la ruta que necesites
    };

    return (
        <section
            id="hero"
            style={{ backgroundImage: `url(${imagenFondo})` }}
        >
            <h1>
                Los mejores <br />
                <i>dulces</i> de Maipú
            </h1>
            {/* Cambia la acción y el texto del botón */}
            <button onClick={irACatalogo}>Ver Catálogo</button>
        </section>
    );
}

// 💡 No olvides añadir 'export default Hero;' si lo importas sin llaves
export default Hero;
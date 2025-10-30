// 1. Importamos los componentes del dashboard
import { HeroAdmin } from "../../componentes/heroAdmin/HeroAdmin";

export function Administrador() {
    return (
        // 2. El Layout (desde App.jsx) ya pone el Navbar y Footer
        //    Esta página SOLO muestra el contenido del administrador
        <div className="container my-4">
            <HeroAdmin />
        </div>
    );
}

export default Administrador;
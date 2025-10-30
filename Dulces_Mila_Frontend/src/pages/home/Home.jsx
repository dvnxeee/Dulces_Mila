import Hero from "../../componentes/hero/Hero";
import Catalogo from "../../componentes/catalogo/Catalogo";
import Somos from "../../componentes/quienesSomos/QuienesSomos"; 
import "./Home.css";

export function Home() {
    return (
        <>
            <Hero />
            <Somos />
            <Catalogo />
        </>
    );
}

export default Home;
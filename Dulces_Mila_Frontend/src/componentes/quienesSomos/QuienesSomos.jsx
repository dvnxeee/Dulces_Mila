import "./QuienesSomos.css";

export function QuienesSomos() {
    return (
        <section id="Quienes-somos">
            <div className="container">
                <h2>Quiénes somos</h2>
                <p> Bienvenido!
                    Somos una pastelería maipucina
                    con tradición familiar, <br />
                    comprometidos en elaborar
                    productos de buena calidad <br />
                    para nuestro clientes.
                </p>
                {/* La imagen se aplica por CSS según tu archivo */}
                <div className="imagen"></div>
            </div>
        </section>
    );
}

export default QuienesSomos;
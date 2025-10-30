import { useState } from 'react';
// 1. Importamos la lógica del carrito
import { addItemToCart } from '../../services/CartService';
// 2. Importamos el CSS para las tarjetas
import '../../pages/productos/ProductListByCategory.css'; 

export const ProductoCard = ({ producto }) => {
    // 3. Estado local para la cantidad de este producto
    const [cantidad, setCantidad] = useState(1);

    // 4. Lógica para agregar al carrito
    const handleAgregar = () => {
        const cant = parseInt(cantidad, 10);
        
        // Validaciones
        if (isNaN(cant) || cant < 1) {
            alert("La cantidad debe ser al menos 1.");
            setCantidad(1);
            return;
        }
        if (cant > producto.stock) {
             alert(`No puedes agregar más de ${producto.stock} (stock disponible).`);
             setCantidad(producto.stock); // Corrige la cantidad al máximo disponible
            return;
        }
        
        // Llama al servicio del carrito
        addItemToCart(producto, cant);
        
        // Damos feedback al usuario
        alert(`${cant} "${producto.nombre}" se agregó al carrito.`);
    };

    return (
        // 5. Usamos las clases CSS que definimos
        <div className="producto-card"> 
            <img 
                src={producto.imagen ? `http://localhost:8080${producto.imagen}` : '/placeholder.png'} 
                className="producto-imagen"
                alt={producto.nombre} 
                // Fallback por si la imagen del backend se rompe
                onError={(e) => { e.target.onerror = null; e.target.src="/placeholder.png"; }}
            />
            <div className="d-flex flex-column" style={{ minHeight: '300px' }}>
                <h3>{producto.nombre}</h3>
                <p className="precio">${producto.precio}</p>
                <p className="descripcion flex-grow-1">{producto.descripcion || "Sin descripción."}</p>
                <p className="stock">Stock disponible: {producto.stock}</p>
                
                <div className="input-group">
                    <span className="input-group-text">Cantidad:</span>
                    <input 
                        type="number" 
                        className="form-control" 
                        value={cantidad}
                        onChange={(e) => setCantidad(e.target.value)}
                        min="1"
                        max={producto.stock} // No permite agregar más que el stock
                        disabled={producto.stock === 0} // Deshabilita si no hay stock
                    />
                </div>
                
                <button 
                    className="btn-agregar" 
                    onClick={handleAgregar} 
                    disabled={producto.stock === 0} // Deshabilita si no hay stock
                >
                    {producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                </button>
            </div>
        </div>
    );
};

export default ProductoCard;
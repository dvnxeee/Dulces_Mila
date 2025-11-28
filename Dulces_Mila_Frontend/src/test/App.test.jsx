import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

// Importamos componentes para probar
// (Asegúrate de que las rutas sean correctas para TU proyecto)
import { LoginView } from '../componentes/formulario/LoginView';
import { Navbar } from '../componentes/navbar/Navbar';
import ProductoCard from '../componentes/productos/ProductoCard';

// Mockeamos los servicios para no llamar al backend real durante el test
vi.mock('../services/UserService', () => ({
    login: vi.fn(),
}));
vi.mock('../services/CartService', () => ({
    addItemToCart: vi.fn(),
}));

// Wrapper para proveer el Router a los componentes que usan Link o useNavigate
const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Pruebas Unitarias Frontend - Dulces Mila', () => {

    // --- TEST 1: Verificar que el Login se renderiza correctamente ---
    it('Test 1: El formulario de Login muestra los campos y botón', () => {
        renderWithRouter(<LoginView />);
        
        // Buscamos por el texto del label o placeholder
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
        // Buscamos el botón
        expect(screen.getByRole('button', { name: /Aceptar|Iniciar Sesión/i })).toBeInTheDocument();
    });

    // --- TEST 2: Verificar que el Navbar muestra el título de la marca ---
    it('Test 2: El Navbar muestra la marca "Dulces Mila"', () => {
        renderWithRouter(<Navbar />);
        
        // Verifica que el texto de la marca esté presente
        expect(screen.getByText(/Dulces Mila/i)).toBeInTheDocument();
    });

    // --- TEST 3: Verificar que ProductoCard muestra la información del producto ---
    it('Test 3: ProductoCard muestra el nombre y precio correctamente', () => {
        const productoPrueba = {
            id: 1,
            nombre: 'Torta de Prueba',
            precio: 15000,
            stock: 10,
            imagen: '',
            descripcion: 'Una torta rica'
        };

        render(<ProductoCard producto={productoPrueba} />);

        expect(screen.getByText('Torta de Prueba')).toBeInTheDocument();
        expect(screen.getByText('$15000')).toBeInTheDocument();
    });

    // --- TEST 4: Verificar lógica de inputs (Escribir en el login) ---
    it('Test 4: Se puede escribir en los campos de email y contraseña', () => {
        renderWithRouter(<LoginView />);
        
        const emailInput = screen.getByLabelText(/Email/i);
        const passInput = screen.getByLabelText(/Contraseña/i);

        // Simulamos que el usuario escribe
        fireEvent.change(emailInput, { target: { value: 'test@correo.com' } });
        fireEvent.change(passInput, { target: { value: '123456' } });

        // Verificamos que el valor cambió
        expect(emailInput.value).toBe('test@correo.com');
        expect(passInput.value).toBe('123456');
    });

    // --- TEST 5: Verificar que el botón "Agregar" no explota (Interacción básica) ---
    it('Test 5: El botón de agregar al carrito es clickeable', () => {
         const productoPrueba = {
            id: 1,
            nombre: 'Torta Test',
            precio: 1000,
            stock: 5,
            imagen: ''
        };
        
        render(<ProductoCard producto={productoPrueba} />);
        
        const botonAgregar = screen.getByText(/Agregar al Carrito/i);
        
        // Verificamos que no esté deshabilitado (porque hay stock)
        expect(botonAgregar).not.toBeDisabled();
        
        // Simulamos click (aunque el servicio está mockeado, probamos que el evento se dispara)
        fireEvent.click(botonAgregar);
    });

});
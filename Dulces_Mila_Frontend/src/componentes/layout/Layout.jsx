// src/componentes/layout/Layout.jsx
import React from 'react';
// Importamos los componentes de tu compañero
import { Navbar } from '../navbar/Navbar';
import { Footer } from '../footer/Footer';

const Layout = ({ children }) => {
    return (
        <React.Fragment>
            <Navbar />
            <main>
                {children}
            </main>
            <Footer />
        </React.Fragment>
    );
};

export default Layout;
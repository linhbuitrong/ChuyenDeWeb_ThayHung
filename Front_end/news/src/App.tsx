import React from "react";
import Header from "./components/Header/Header";
import Menu from "./components/Menu/Menu";
import { Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/Scroll/ScrollToTop";
function App() {
    return (
        <AuthProvider>
            <ScrollToTop />
            <Header />
            <Menu />
            <Outlet />
        </AuthProvider>
    );
}

export default App;

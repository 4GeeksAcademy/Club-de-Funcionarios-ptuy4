import React from "react"; 
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";
import { Demo } from "./pages/demo";
import { UserLogin } from "./pages/userLogin";
import { Register } from "./pages/register";
import { Single } from "./pages/single";
import Library from "./pages/library";
import Locals from "./pages/locals";
import { Profile } from "./pages/profile";
import { AdminPage } from "./pages/adminPage";
import { RecoverPassword } from "./pages/recoverPassword";
import { MyReservations } from "./pages/myReservations";
import injectContext from "./store/appContext";
import ProtectedRoute from "./component/protectedRoute";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL === "") return <BackendURL />;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <Navbar />
                <Routes>
                    {/* Rutas principales */}
                    <Route element={<Home />} path="/" />
                    {/* <Route element={<Demo />} path="/demo" />*/}
                    <Route element={<Register />} path="/register" />
                    <Route element={<Single />} path="/single/:theid" />*/}
                    <Route element={<RecoverPassword />} path="/recoverPassword" />
                                        
                    {/* Ruta protegida con ProtectedRoute */}
                    <Route path="/userLogin" element={<ProtectedRoute isAdminRequired={false}> <UserLogin /> </ProtectedRoute>}/>
                    <Route path="/adminPage" element={<ProtectedRoute isAdminRequired={true}> <AdminPage /> </ProtectedRoute>}/>
                    <Route path="/library" element={<ProtectedRoute isAdminRequired={false}> <Library /> </ProtectedRoute>}/>
                    <Route path="/locals" element={<ProtectedRoute isAdminRequired={false}> <Locals /> </ProtectedRoute>}/>
                    <Route path="/myReservations" element={<ProtectedRoute isAdminRequired={false}> <MyReservations /> </ProtectedRoute>}/>
                    <Route path="/profile" element={<ProtectedRoute isAdminRequired={false}> <Profile /> </ProtectedRoute>}/>

                    {/* Ruta para páginas no encontradas */}
                    <Route element={<h1>Not found!</h1>} path="*" />

                </Routes>
                <Footer />
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
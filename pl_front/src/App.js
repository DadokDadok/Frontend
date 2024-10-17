import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ListMapView from "./pages/map/ListMapView";
import Main from "./pages/main/Main";
import NavBar from "./component/nav-bar/navBar";
import Footer from "./component/footer";
import KeywordCloud from "./pages/keyword/KeywordCloud";
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        background-color: #FAF7F0;
        height: 100vh;
        overflow: auto;
        color: #335061;
        
    }
`;

function App() {
    return (
        <BrowserRouter>
            <GlobalStyle />
            <NavBar/>
            <Routes>
                <Route exact path="/" element={<Main/>}/>
                <Route exact path="/map" element={<ListMapView/>}/>
                <Route exact path="/keyword" element={<KeywordCloud/>}/>
            </Routes>
            <Footer />
        </BrowserRouter>

    );
}

export default App;

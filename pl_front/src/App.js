import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ListMapView from "./pages/map/ListMapView";
import Main from "./pages/main/Main";
import NavBar from "./component/nav-bar/navBar";
import Footer from "./component/footer";
import KeywordView from "./pages/keyword/KeywordView";

function App() {
    return (
        <BrowserRouter>
            <NavBar/>
            <Routes>
                <Route exact path="/" element={<Main/>}/>
                <Route exact path="/map" element={<ListMapView/>}/>
                <Route exact path="/keyword" element={<KeywordView/>}/>
            </Routes>
            <Footer />
        </BrowserRouter>

    );
}

export default App;

import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TestPage from "./pages/testPage/TestPage.jsx";
import ListMapView from "./pages/map/ListMapView.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<TestPage/>}/>
          <Route exact path="/map" element={<ListMapView/>}/>
        </Routes>
      </BrowserRouter>

      );
}

export default App;

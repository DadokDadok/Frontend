import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import TestPage from "./pages/testPage/TestPage";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<TestPage/>}/>
        </Routes>
      </BrowserRouter>

      );
}

export default App;

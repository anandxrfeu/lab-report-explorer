import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router-dom";
import './App.css';

import { AuthContextComponent } from "./contexts/authContext";
import Home from "./pages/Home"
import Search from "./pages/Search"
import Upload from "./pages/Upload"



function App() {

  return (
    <BrowserRouter>
      <AuthContextComponent>
        <Routes>
          <Route exact path="/" element={ <Home />} />
          <Route exact path="/search" element={ <Search />} />
          <Route exact path="/upload" element={ <Upload />} />
        </Routes>
      </AuthContextComponent>
  </BrowserRouter>
  );
}

export default App;

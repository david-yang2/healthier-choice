import { Routes, Route, BrowserRouter } from "react-router-dom";
import Splash from "./components/Splash";
import CameraContainer from "./components/CameraContainer";

import DisplayHarmfulIngredients from "./components/DisplayHarmfulIngredients";
import { ImageProvider } from "./context/ImageContext";

const App = () => {
  return (
    <ImageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/camera" element={<CameraContainer />} />

          <Route path="/display" element={<DisplayHarmfulIngredients />} />
        </Routes>
      </BrowserRouter>
    </ImageProvider>
  );
};

export default App;

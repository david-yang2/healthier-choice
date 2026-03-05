import { Routes, Route, BrowserRouter } from "react-router-dom";
import Splash from "./Splash";
import CameraContainer from "./CameraContainer"
import GenereateText from "./GenerateText";
import { ImageProvider } from "./context/ImageContext";

const App = () => {
  return (
        <ImageProvider>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Splash />} />
        <Route path="/camera" element={<CameraContainer />} />
        <Route path="/generate" element={<GenereateText />} />
      </Routes>
    </BrowserRouter>
        </ImageProvider>
  );
};

export default App;

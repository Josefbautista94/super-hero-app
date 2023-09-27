import MainPage from "./Components/MainPage/MainPage.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
     <Router>
<Routes>
<Route path="/" exact element={<MainPage />} />
</Routes>

     </Router>
    </div>
  );
}

export default App;

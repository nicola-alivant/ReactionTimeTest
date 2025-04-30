import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import BottomNavBar from "./BottomNavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import List from "./components/List";
import Chart from "./components/Chart";
import "./app.css";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="content">
          <Routes>
            <Route exact path="/" Component={List}></Route>
            <Route exact path="/chart" Component={Chart}></Route>
          </Routes>
          <ToastContainer position="top-right" autoClose={2000} />
        </div>
        <BottomNavBar />
      </Router>
    </div>
  );
}

export default App;

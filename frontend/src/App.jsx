import { BrowserRouter, Routes, Route } from "react-router-dom";
import Form from "./assets/components/Form.jsx";
import Table from "./assets/components/Table.jsx";
import Header from "./assets/components/Header.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Table />} />
          <Route path="/register" element={<Form />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

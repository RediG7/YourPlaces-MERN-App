import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Users />} />
        <Route path="/places/new" element={<NewPlace />} />
        {/* To keep the history clean, you should set replace prop. This will avoid extra redirects after the user click back. */}
        <Route path="*" element={<Navigate to="/" replace />} /> 
      </Routes>
    </BrowserRouter>
  );
};

export default App;

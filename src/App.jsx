import { useState } from 'react';
import Nav from "./nav.jsx";
import NotificationBar from './NotificationBar';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Top Notification Bar */}
      <NotificationBar />

      {/* Overlay Sidebar */}
      <div className="absolute top-0 left-0 z-2 h-full">
        <Nav />
      </div>

      {/* Main Page Content */}
      <div className="pl-72 pt-[40px] h-full bg-gray-50 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold underline text-green-800">Hello world!</h1>
        </div>
      </div>
    </div>
  );
}

export default App;

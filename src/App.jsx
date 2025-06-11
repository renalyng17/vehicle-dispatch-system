import { useState } from 'react';
import Nav from "./nav.jsx";
import NotificationBar from './NotificationBar';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col h-screen">
      {/* Top Notification Bar */}
      <NotificationBar />

      {/* Main sidebar*/}
      <div className="flex flex-1">
        <Nav />

        {/* Main Page Content */}
        <div className="flex-1 p-6 bg-gray-50">
          <h1 className="text-3xl font-bold underline text-green-800">Hello world!</h1>
        </div>
      </div>
    </div>
  );
}

export default App;

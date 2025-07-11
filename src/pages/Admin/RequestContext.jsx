<<<<<<< HEAD
=======

>>>>>>> 51b73d99c076a8d216668d38333b2c46e02f5923
// src/context/RequestContext.js
import { createContext, useState, useContext } from "react";

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  const [requests, setRequests] = useState([]);

  const addRequest = (request) => {
    setRequests((prev) => [...prev, request]);
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequestContext = () => useContext(RequestContext);

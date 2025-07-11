
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

import { createContext, useContext, useState, useCallback } from 'react';

const PRDContext = createContext();

const emptyPRD = {
  id: null,
  title: '',
  objective: '',
  description: '',
  functionalRequirements: '',
  nonFunctionalRequirements: '',
  dependencies: '',
  acceptanceCriteria: '',
};

export function PRDProvider({ children }) {
  const [currentPRD, setCurrentPRD] = useState(emptyPRD);
  const [prds, setPrds] = useState([]);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const updateField = useCallback((field, value) => {
    setCurrentPRD(prev => ({ ...prev, [field]: value }));
  }, []);

  const resetPRD = useCallback(() => {
    setCurrentPRD(emptyPRD);
    setMessages([]);
  }, []);

  const loadPRD = useCallback((prd) => {
    setCurrentPRD(prd);
  }, []);

  const addMessage = useCallback((role, content) => {
    setMessages(prev => [...prev, { role, content, id: Date.now() }]);
  }, []);

  return (
    <PRDContext.Provider value={{
      currentPRD,
      prds,
      setPrds,
      updateField,
      resetPRD,
      loadPRD,
      messages,
      addMessage,
      setMessages,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </PRDContext.Provider>
  );
}

export function usePRD() {
  const context = useContext(PRDContext);
  if (!context) {
    throw new Error('usePRD must be used within a PRDProvider');
  }
  return context;
}

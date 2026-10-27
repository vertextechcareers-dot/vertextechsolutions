import React, { createContext, useContext, useState, useCallback } from 'react';
import ConsultationModal from './ConsultationModal';

interface ConsultationContextType {
  openConsultation: (service?: string) => void;
  closeConsultation: () => void;
}

const ConsultationContext = createContext<ConsultationContextType>({
  openConsultation: () => {},
  closeConsultation: () => {},
});

export const useConsultation = () => useContext(ConsultationContext);

export const ConsultationProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prefillService, setPrefillService] = useState<string | undefined>();

  const openConsultation = useCallback((service?: string) => {
    setPrefillService(service);
    setIsOpen(true);
  }, []);

  const closeConsultation = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ConsultationContext.Provider value={{ openConsultation, closeConsultation }}>
      {children}
      <ConsultationModal isOpen={isOpen} onClose={closeConsultation} prefillService={prefillService} />
    </ConsultationContext.Provider>
  );
};
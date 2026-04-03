"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { PriceEstimatePayload } from "@/lib/price-estimate-export";

/** Сразу открыть ContactModal на форме «Ориентировочный расчёт» или отправку сметы с /price */
export type ContactModalInitialStep = "form-calculator" | "form-price-estimate" | null;

interface ModalContextType {
  isOpen: boolean;
  openModal: () => void;
  /** Модалка заявки сразу на шаг ориентировочного расчёта (не прайс-калькулятор /price) */
  openModalToEstimate: () => void;
  /** Отправка набранной сметы с калькулятора прайса — имя/телефон + данные сметы */
  openModalWithPriceEstimate: (payload: PriceEstimatePayload) => void;
  closeModal: () => void;
  initialContactStep: ContactModalInitialStep;
  priceEstimatePayload: PriceEstimatePayload | null;
}

const ModalContext = createContext<ModalContextType>({
  isOpen: false,
  openModal: () => {},
  openModalToEstimate: () => {},
  openModalWithPriceEstimate: () => {},
  closeModal: () => {},
  initialContactStep: null,
  priceEstimatePayload: null,
});

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [initialContactStep, setInitialContactStep] = useState<ContactModalInitialStep>(null);
  const [priceEstimatePayload, setPriceEstimatePayload] = useState<PriceEstimatePayload | null>(null);

  const openModal = useCallback(() => {
    setInitialContactStep(null);
    setPriceEstimatePayload(null);
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const openModalToEstimate = useCallback(() => {
    setPriceEstimatePayload(null);
    setInitialContactStep("form-calculator");
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const openModalWithPriceEstimate = useCallback((payload: PriceEstimatePayload) => {
    setPriceEstimatePayload(payload);
    setInitialContactStep("form-price-estimate");
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setInitialContactStep(null);
    setPriceEstimatePayload(null);
    document.body.style.overflow = "";
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal,
        openModalToEstimate,
        openModalWithPriceEstimate,
        closeModal,
        initialContactStep,
        priceEstimatePayload,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}

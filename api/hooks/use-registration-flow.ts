"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StudentData {
  id?: number;
  surname: string;
  firstnames: string;
  preferredName: string;
  dateOfBirth: string;
  idNumber: string;
  sex: string;
  homeLanguage: string;
  religion: string;
  numberOfChildren: number;
  positionInFamily: number;
  previousSchool: string;
  intendedPrimarySchool: string;
  careRequired: 'half_day' | 'full_day';
  enrollmentDate: string;
  ageAtEnrollment: number;
  contactNumberMother: string;
  contactNumberFather: string;
  
  // Emergency Contacts
  emergencyContactFriend: {
    name: string;
    relationship: string;
    address: string;
    workPhone: string;
    homePhone: string;
    cellPhone: string;
  };
  emergencyContactKin: {
    name: string;
    relationship: string;
    address: string;
    workPhone: string;
    homePhone: string;
    cellPhone: string;
  };
  
  // Transport
  authorizedPersons: Array<{
    name: string;
    phone: string;
  }>;
  specialInstructions: string;
  
  // Medical Information
  familyDoctor: string;
  doctorPhone: string;
  medicalConditions: Array<{
    condition: string;
    details: string;
  }>;
  childhoodIllnesses: string;
  lifeThreateningAllergies: string;
  otherAllergies: string;
  regularMedications: string;
  majorOperations: string;
  behaviorProblems: string;
  speechHearingProblems: string;
  birthComplications: string;
  immunisationUpToDate: string;
  familyMedicalHistory: string;
  
  // Medical Consent
  medicalConsent1: string;
  medicalConsent2: string;
  maritalStatus: string;
  livesWith: string;
  
  // POPI Act
  popiConsent: boolean;
  popiMotherSignature: string;
  popiFatherSignature: string;
  popiMotherDate: string;
  popiFatherDate: string;
}

interface ParentData {
  mother: {
    title: string;
    surname: string;
    firstNames: string;
    idNumber: string;
    occupation: string;
    employer: string;
    workPhone: string;
    homePhone: string;
    cellPhone: string;
    email: string;
    homeAddress: string;
    postalAddress: string;
    workAddress: string;
  };
  father: {
    title: string;
    surname: string;
    firstNames: string;
    idNumber: string;
    occupation: string;
    employer: string;
    workPhone: string;
    homePhone: string;
    cellPhone: string;
    email: string;
    homeAddress: string;
    postalAddress: string;
    workAddress: string;
  };
}

interface FinancialAgreementData {
  monthlyAmount: string;
  paymentDate: string;
  agreedTerms: boolean;
  agreedLiability: boolean;
  agreedCancellation: boolean;
  motherSignature: string;
  fatherSignature: string;
  motherSignatureDate: string;
  fatherSignatureDate: string;
}

interface RegistrationFlowState {
  currentStep: number;
  studentData: StudentData | null;
  parentData: ParentData | null;
  financialAgreementData: FinancialAgreementData | null;
  registeredStudentId: number | null;
  
  // Actions
  setCurrentStep: (step: number) => void;
  setStudentData: (data: StudentData) => void;
  setParentData: (data: ParentData) => void;
  setFinancialAgreementData: (data: FinancialAgreementData) => void;
  setRegisteredStudentId: (id: number) => void;
  resetRegistration: () => void;
  
  // Validation helpers
  canProceedToFinancialAgreement: () => boolean;
  getCurrentProgress: () => { current: number; total: number };
}

export const useRegistrationFlow = create<RegistrationFlowState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      studentData: null,
      parentData: null,
      financialAgreementData: null,
      registeredStudentId: null,
      
      setCurrentStep: (step) => set({ currentStep: step }),
      
      setStudentData: (data) => set({ studentData: data }),
      
      setParentData: (data) => set({ parentData: data }),
      
      setFinancialAgreementData: (data) => set({ financialAgreementData: data }),
      
      setRegisteredStudentId: (id) => set({ registeredStudentId: id }),
      
      resetRegistration: () => set({
        currentStep: 1,
        studentData: null,
        parentData: null,
        financialAgreementData: null,
        registeredStudentId: null,
      }),
      
      canProceedToFinancialAgreement: () => {
        const state = get();
        return !!state.registeredStudentId && !!state.studentData;
      },
      
      getCurrentProgress: () => {
        const state = get();
        let completedSteps = 0;
        const totalSteps = 2; // Student reg + Financial agreement
        
        if (state.registeredStudentId) completedSteps++;
        if (state.financialAgreementData) completedSteps++;
        
        return { current: completedSteps, total: totalSteps };
      },
    }),
    {
      name: 'registration-flow-storage',
      // Only persist specific fields to avoid bloating localStorage
      partialize: (state) => ({
        registeredStudentId: state.registeredStudentId,
        currentStep: state.currentStep,
        // Don't persist large form data for too long
        studentData: state.studentData,
        parentData: state.parentData,
      }),
    }
  )
);
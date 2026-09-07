import React, { createContext, useContext, useEffect, useState } from "react";
import { setActiveCert } from "../components/AbbreviatedText";
import { Domain } from "../types";

export type CertificationId =
  "dva-c02" | "clf-c02" | "aif-c01" | "mls-c01" | "ccao-f" | "saa-c03";

export interface CertMeta {
  id: CertificationId;
  name: string;
  fullName: string;
  examInfo: string;
  icon: string;
  color: string;
  storageKey: string;
  /** Exam-blueprint domain weights (must sum to 1). Used for composite readiness. */
  domainWeights: Partial<Record<Domain, number>>;
}

export const CERT_META: Record<CertificationId, CertMeta> = {
  "dva-c02": {
    id: "dva-c02",
    name: "DVA-C02",
    fullName: "AWS Certified Developer – Associate",
    examInfo: "65 questions · 130 min · Passing score: 720/1000",
    icon: "code-slash",
    color: "#FF9900",
    storageKey: "aws_training_progress_dva",
    // DVA-C02 blueprint: Development 32%, Security 26%, Deployment 24%, Troubleshooting 18%
    domainWeights: {
      development: 0.32,
      security: 0.26,
      deployment: 0.24,
      troubleshooting: 0.18,
    },
  },
  "clf-c02": {
    id: "clf-c02",
    name: "CLF-C02",
    fullName: "AWS Certified Cloud Practitioner",
    examInfo: "65 questions · 90 min · Passing score: 700/1000",
    icon: "cloud",
    color: "#4A90E2",
    storageKey: "aws_training_progress_clf",
    // CLF-C02 blueprint: Deployment (Cloud Concepts) 24%, Security 30%, Development (Technology) 34%, Troubleshooting (Billing/Support) 12%
    domainWeights: {
      deployment: 0.24,
      security: 0.3,
      development: 0.34,
      troubleshooting: 0.12,
    },
  },
  "aif-c01": {
    id: "aif-c01",
    name: "AIF-C01",
    fullName: "AWS Certified AI Practitioner",
    examInfo: "85 questions · 120 min · Passing score: 700/1000",
    icon: "hardware-chip",
    color: "#7B61FF",
    storageKey: "aws_training_progress_aif",
    // AIF-C01 blueprint: Fundamentals 20%, Applications 28%, Services (ML concepts) 36%, Security 16%
    domainWeights: {
      fundamentals: 0.2,
      applications: 0.28,
      services: 0.36,
      security: 0.16,
    },
  },
  "mls-c01": {
    id: "mls-c01",
    name: "MLS-C01",
    fullName: "AWS Certified Machine Learning Specialty",
    examInfo: "65 questions · 180 min · Passing score: 750/1000",
    icon: "analytics",
    color: "#00A86B",
    storageKey: "aws_training_progress_mls",
    // MLS-C01 blueprint: Services (Data Engineering) 20%, Fundamentals (Modeling) 36%, Deployment 20%, Security 24%
    domainWeights: {
      services: 0.2,
      fundamentals: 0.36,
      deployment: 0.2,
      security: 0.24,
    },
  },
  "ccao-f": {
    id: "ccao-f",
    name: "CCAO-F",
    fullName: "Anthropic Claude AI Operations – Foundations",
    examInfo: "60 questions · 120 min · Passing score: 720/1000",
    icon: "sparkles",
    color: "#D97706",
    storageKey: "aws_training_progress_ccao",
    // CCAO-F blueprint: Fundamentals 45%, Services (API/Capabilities) 25%, Troubleshooting 18%, Security 12%
    domainWeights: {
      fundamentals: 0.45,
      services: 0.25,
      troubleshooting: 0.18,
      security: 0.12,
    },
  },
  "saa-c03": {
    id: "saa-c03",
    name: "SAA-C03",
    fullName: "AWS Certified Solutions Architect – Associate",
    examInfo: "65 questions · 130 min · Passing score: 720/1000",
    icon: "git-network",
    color: "#FF9900",
    storageKey: "aws_training_progress_saa",
    // SAA-C03 blueprint: Fundamentals (Resilient Arch) 26%, Deployment (Performant Arch) 24%, Security 30%, Applications (Cost-Optimized) 20%
    domainWeights: {
      fundamentals: 0.26,
      deployment: 0.24,
      security: 0.3,
      applications: 0.2,
    },
  },
};

interface CertContextValue {
  certId: CertificationId;
  certMeta: CertMeta;
  setCert: (id: CertificationId) => void;
}

const CertContext = createContext<CertContextValue>({
  certId: "dva-c02",
  certMeta: CERT_META["dva-c02"],
  setCert: () => {},
});

export function CertProvider({ children }: { children: React.ReactNode }) {
  const [certId, setCertId] = useState<CertificationId>("dva-c02");

  useEffect(() => {
    setActiveCert(certId);
  }, [certId]);

  const setCert = (id: CertificationId) => {
    setCertId(id);
  };

  return (
    <CertContext.Provider
      value={{ certId, certMeta: CERT_META[certId], setCert }}
    >
      {children}
    </CertContext.Provider>
  );
}

export function useCert() {
  return useContext(CertContext);
}

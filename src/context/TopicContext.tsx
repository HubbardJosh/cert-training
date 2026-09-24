import React, { createContext, useContext, useState } from "react";
import { ServiceGuide } from "../types/guide";
import { FlashCard, QuizQuestion } from "../types";

export interface TopicMeta {
  id: string;
  name: string;
  fullName: string;
  tagline: string;
  icon: string;
  color: string;
  storageKey: string;
  category: string;
}

export interface TopicData {
  guides: ServiceGuide[];
  flashcards: FlashCard[];
  quizQuestions: QuizQuestion[];
}

export const TOPIC_META: Record<string, TopicMeta> = {
  "bedrock-agentcore": {
    id: "bedrock-agentcore",
    name: "Bedrock AgentCore",
    fullName: "Amazon Bedrock AgentCore",
    tagline: "Production platform for AI agents — any framework, any model",
    icon: "hardware-chip",
    color: "#00BCD4",
    storageKey: "topic_progress_bedrock_agentcore",
    category: "AWS AI & ML",
  },
  "amazon-sqs": {
    id: "amazon-sqs",
    name: "Amazon SQS",
    fullName: "Amazon Simple Queue Service — Deep Dive",
    tagline:
      "Fully managed message queuing: Standard vs FIFO, DLQs, visibility timeouts, and Lambda integration",
    icon: "git-network-outline",
    color: "#FF9900",
    storageKey: "topic_progress_amazon_sqs",
    category: "AWS Messaging",
  },
};

interface TopicContextValue {
  topicId: string | null;
  topicMeta: TopicMeta | null;
  setTopic: (id: string | null) => void;
}

const TopicContext = createContext<TopicContextValue>({
  topicId: null,
  topicMeta: null,
  setTopic: () => {},
});

export function TopicProvider({ children }: { children: React.ReactNode }) {
  const [topicId, setTopicId] = useState<string | null>(null);

  const setTopic = (id: string | null) => {
    setTopicId(id);
  };

  return (
    <TopicContext.Provider
      value={{
        topicId,
        topicMeta: topicId ? (TOPIC_META[topicId] ?? null) : null,
        setTopic,
      }}
    >
      {children}
    </TopicContext.Provider>
  );
}

export function useTopic() {
  return useContext(TopicContext);
}

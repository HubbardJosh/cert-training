import { useTopic } from "./TopicContext";
import { allGuides as agentcoreGuides } from "../data/topics/bedrock-agentcore/guides";
import { flashcards as agentcoreFlashcards } from "../data/topics/bedrock-agentcore/flashcards";
import { quizQuestions as agentcoreQuizQuestions } from "../data/topics/bedrock-agentcore/quizQuestions";

export function useTopicData() {
  const { topicId } = useTopic();

  switch (topicId) {
    case "bedrock-agentcore":
      return {
        guides: agentcoreGuides,
        flashcards: agentcoreFlashcards,
        quizQuestions: agentcoreQuizQuestions,
      };
    default:
      return null;
  }
}

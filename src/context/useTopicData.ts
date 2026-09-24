import { useTopic } from "./TopicContext";
import { allGuides as agentcoreGuides } from "../data/topics/bedrock-agentcore/guides";
import { flashcards as agentcoreFlashcards } from "../data/topics/bedrock-agentcore/flashcards";
import { quizQuestions as agentcoreQuizQuestions } from "../data/topics/bedrock-agentcore/quizQuestions";
import { allGuides as amazonSqsGuides } from "../data/topics/amazon-sqs/guides";
import { flashcards as amazonSqsFlashcards } from "../data/topics/amazon-sqs/flashcards";
import { quizQuestions as amazonSqsQuizQuestions } from "../data/topics/amazon-sqs/quizQuestions";

export function useTopicData() {
  const { topicId } = useTopic();

  switch (topicId) {
    case "bedrock-agentcore":
      return {
        guides: agentcoreGuides,
        flashcards: agentcoreFlashcards,
        quizQuestions: agentcoreQuizQuestions,
      };
    case "amazon-sqs":
      return {
        guides: amazonSqsGuides,
        flashcards: amazonSqsFlashcards,
        quizQuestions: amazonSqsQuizQuestions,
      };
    default:
      return null;
  }
}

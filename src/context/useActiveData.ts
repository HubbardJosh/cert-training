import { useTopic } from "./TopicContext";
import { useCert } from "./CertContext";
import { useCertData } from "./useCertData";
import { useTopicData } from "./useTopicData";

/**
 * Returns the active content (guides, flashcards, quizQuestions) for whichever
 * mode is active — topic mode takes priority over cert mode.
 */
export function useActiveData() {
  const { topicId } = useTopic();
  const certData = useCertData();
  const topicData = useTopicData();

  if (topicId && topicData) {
    return topicData;
  }
  return certData;
}

/**
 * Returns the storage key for the active mode (topic or cert).
 */
export function useActiveStorageKey() {
  const { topicId, topicMeta } = useTopic();
  const { certMeta } = useCert();

  if (topicId && topicMeta) {
    return topicMeta.storageKey;
  }
  return certMeta.storageKey;
}

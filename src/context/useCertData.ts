import { useCert } from "./CertContext";
import { allGuides as dvaGuides } from "../data/aws/dva/guides";
import { flashcards as dvaFlashcards } from "../data/aws/dva/flashcards";
import { quizQuestions as dvaQuizQuestions } from "../data/aws/dva/quizQuestions";
import { allGuides as clfGuides } from "../data/aws/clf/guides";
import { flashcards as clfFlashcards } from "../data/aws/clf/flashcards";
import { quizQuestions as clfQuizQuestions } from "../data/aws/clf/quizQuestions";
import { allGuides as aifGuides } from "../data/aws/aif/guides";
import { flashcards as aifFlashcards } from "../data/aws/aif/flashcards";
import { quizQuestions as aifQuizQuestions } from "../data/aws/aif/quizQuestions";
import { allGuides as mlsGuides } from "../data/aws/mls/guides";
import { flashcards as mlsFlashcards } from "../data/aws/mls/flashcards";
import { quizQuestions as mlsQuizQuestions } from "../data/aws/mls/quizQuestions";
import { allGuides as ccaoGuides } from "../data/anthropic/ccao/guides";
import { flashcards as ccaoFlashcards } from "../data/anthropic/ccao/flashcards";
import { quizQuestions as ccaoQuizQuestions } from "../data/anthropic/ccao/quizQuestions";
import { allGuides as saaGuides } from "../data/aws/saa/guides";
import { flashcards as saaFlashcards } from "../data/aws/saa/flashcards";
import { quizQuestions as saaQuizQuestions } from "../data/aws/saa/quizQuestions";

export function useCertData() {
  const { certId } = useCert();

  switch (certId) {
    case "clf-c02":
      return {
        guides: clfGuides,
        flashcards: clfFlashcards,
        quizQuestions: clfQuizQuestions,
      };
    case "aif-c01":
      return {
        guides: aifGuides,
        flashcards: aifFlashcards,
        quizQuestions: aifQuizQuestions,
      };
    case "mls-c01":
      return {
        guides: mlsGuides,
        flashcards: mlsFlashcards,
        quizQuestions: mlsQuizQuestions,
      };
    case "ccao-f":
      return {
        guides: ccaoGuides,
        flashcards: ccaoFlashcards,
        quizQuestions: ccaoQuizQuestions,
      };
    case "saa-c03":
      return {
        guides: saaGuides,
        flashcards: saaFlashcards,
        quizQuestions: saaQuizQuestions,
      };
    default:
      return {
        guides: dvaGuides,
        flashcards: dvaFlashcards,
        quizQuestions: dvaQuizQuestions,
      };
  }
}

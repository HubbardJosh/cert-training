import { useCert } from "./CertContext";
import { allGuides as dvaGuides } from "../data/dva/guides";
import { flashcards as dvaFlashcards } from "../data/dva/flashcards";
import { quizQuestions as dvaQuizQuestions } from "../data/dva/quizQuestions";
import { allGuides as clfGuides } from "../data/clf/guides";
import { flashcards as clfFlashcards } from "../data/clf/flashcards";
import { quizQuestions as clfQuizQuestions } from "../data/clf/quizQuestions";
import { allGuides as aifGuides } from "../data/aif/guides";
import { flashcards as aifFlashcards } from "../data/aif/flashcards";
import { quizQuestions as aifQuizQuestions } from "../data/aif/quizQuestions";
import { allGuides as mlsGuides } from "../data/mls/guides";
import { flashcards as mlsFlashcards } from "../data/mls/flashcards";
import { quizQuestions as mlsQuizQuestions } from "../data/mls/quizQuestions";
import { allGuides as ccaoGuides } from "../data/ccao/guides";
import { flashcards as ccaoFlashcards } from "../data/ccao/flashcards";
import { quizQuestions as ccaoQuizQuestions } from "../data/ccao/quizQuestions";
import { allGuides as saaGuides } from "../data/saa/guides";
import { flashcards as saaFlashcards } from "../data/saa/flashcards";
import { quizQuestions as saaQuizQuestions } from "../data/saa/quizQuestions";

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

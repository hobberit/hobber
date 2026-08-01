import { useRouter } from "expo-router";

import { QuizForm } from "@/components/quiz-form";
import { useAuth } from "@/features/auth/AuthProvider";
import { completeOnboarding, type OnboardingAnswers } from "@/services/onboarding";

export default function RetakeQuizScreen() {
  const router = useRouter();
  const { session, refreshProfile } = useAuth();

  async function handleSubmit(answers: OnboardingAnswers) {
    if (!session?.user) return;
    await completeOnboarding(session.user.id, answers);
    await refreshProfile();
    router.back();
  }

  return <QuizForm onSubmit={handleSubmit} finishLabel="Save" />;
}

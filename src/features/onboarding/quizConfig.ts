import type { HobbyCategory } from "@/types";

export interface QuizOption {
  label: string;
  value: string;
}

export interface QuizStep {
  id: string;
  type: "single-select" | "multi-select";
  question: string;
  helperText?: string;
  options: QuizOption[];
}

const interestOptions: { label: string; value: HobbyCategory }[] = [
  { label: "Creative & artistic", value: "creative" },
  { label: "Physical & active", value: "physical" },
  { label: "Technical & maker", value: "technical" },
  { label: "Outdoor & nature", value: "outdoor" },
  { label: "Social & community", value: "social" },
];

/**
 * Drives the onboarding quiz UI. Step `id`s that match a `users` column
 * name (free_time_hrs_week, budget_range, indoor_outdoor_pref,
 * solo_social_pref) get written there directly; everything else lands in
 * `users.personality_profile` — see completeOnboarding().
 */
export const quizSteps: QuizStep[] = [
  {
    id: "current_hobbies",
    type: "multi-select",
    question: "What do you already do in your free time?",
    helperText: "Pick as many as apply — or none.",
    options: [
      "Reading",
      "Gaming",
      "Cooking",
      "Watching shows/movies",
      "Working out",
      "Music",
      "Traveling",
      "Socializing",
      "None of these",
    ].map((label) => ({ label, value: label })),
  },
  {
    id: "interests",
    type: "multi-select",
    question: "Which of these sound interesting to you?",
    helperText: "Pick as many as apply.",
    options: interestOptions,
  },
  {
    id: "free_time_hrs_week",
    type: "single-select",
    question:
      "How much free time can you realistically put toward a new hobby each week?",
    options: [
      { label: "Less than 2 hours", value: "1" },
      { label: "2-5 hours", value: "3.5" },
      { label: "5-10 hours", value: "7.5" },
      { label: "10+ hours", value: "12" },
    ],
  },
  {
    id: "budget_range",
    type: "single-select",
    question: "What's your budget to get started?",
    options: [
      { label: "Free — $0", value: "0-0" },
      { label: "Low — up to $150", value: "0-150" },
      { label: "Medium — up to $500", value: "0-500" },
      { label: "High — $500+", value: "500-2000" },
    ],
  },
  {
    id: "indoor_outdoor_pref",
    type: "single-select",
    question: "Indoor or outdoor?",
    options: [
      { label: "Indoor", value: "indoor" },
      { label: "Outdoor", value: "outdoor" },
      { label: "Either / both", value: "both" },
    ],
  },
  {
    id: "solo_social_pref",
    type: "single-select",
    question: "Solo or social?",
    options: [
      { label: "Solo", value: "solo" },
      { label: "Social", value: "social" },
      { label: "Either / both", value: "both" },
    ],
  },
];

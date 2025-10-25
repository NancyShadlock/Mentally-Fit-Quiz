import React, { useState, useEffect, useReducer } from 'react';
import { MessageCircle, ArrowRight, CheckCircle, Calendar, User, Mail, ChevronLeft, Sparkles } from 'lucide-react';

// Saboteur data - Attribution: Positive Intelligence®
const SABOTEUR_INFO = {
  avoider: {
    name: "The Avoider",
    tagline: "Anything to avoid the uncomfortable",
    impact: "Your Avoider keeps you stuck by making you dodge difficult conversations, challenging work, and growth opportunities. You say yes when you mean no. Problems pile up while you focus on what's easy and pleasant.",
    cost: "In 5 years: The avoided conversations have destroyed key relationships. The delayed decisions have cost you career advancement. The pile of someday tasks has become overwhelming anxiety.",
    patterns: [
      "Procrastinating on hard or uncomfortable tasks",
      "Saying yes to avoid conflict, then resenting it",
      "Staying busy with easy tasks to avoid important ones",
      "Rationalizing why now isn't the right time"
    ],
    microPlan: [
      "Daily 5-min rep: Identify one uncomfortable conversation you're avoiding. Write it down.",
      "Practice: Send one difficult email or text you've been putting off.",
      "Boundary rep: Say 'no' or 'let me think about it' to one request this week."
    ]
  },
  controller: {
    name: "The Controller",
    tagline: "If you want it done right, control everything",
    impact: "Your Controller exhausts you and alienates others. The anxiety of things being out of your control drives you to micromanage, over-prepare, and struggle to delegate. Trust feels impossible.",
    cost: "In 5 years: Your team resents you and stops bringing ideas. Your relationships feel transactional. You're burned out from trying to control the uncontrollable while everything important slips through your fingers.",
    patterns: [
      "Anxiety when others don't do things your way",
      "Difficulty delegating or trusting others",
      "Need to be involved in all decisions",
      "Tension when plans change or things feel uncertain"
    ],
    microPlan: [
      "Delegation rep: Assign one task and don't check on it for 24 hours.",
      "Uncertainty tolerance: When plans change, pause 10 seconds before reacting.",
      "Trust practice: Let someone do something their way, even if different from yours."
    ]
  },
  hyperAchiever: {
    name: "The Hyper-Achiever",
    tagline: "Your worth equals your last accomplishment",
    impact: "Your Hyper-Achiever has you on a hamster wheel where no achievement is ever enough. You can't rest without guilt. Your relationships suffer because work always comes first. Success feels hollow.",
    cost: "In 5 years: You've achieved the goals but lost the relationships. Your health is compromised from chronic stress. You still don't feel successful, just more behind. You've taught your kids that love is conditional on performance.",
    patterns: [
      "Can't relax without feeling guilty or anxious",
      "Latest success quickly forgotten, need the next one",
      "Relationships take backseat to achievement",
      "Identity and worth tied to accomplishments"
    ],
    microPlan: [
      "Presence rep: Spend 15 minutes doing nothing productive. Notice the discomfort.",
      "Relationship practice: Have one conversation where you're fully present, not multitasking.",
      "Worth reminder: List 3 reasons you matter that have nothing to do with achievement."
    ]
  },
  hyperRational: {
    name: "The Hyper-Rational",
    tagline: "Feelings are inefficient and illogical",
    impact: "Your Hyper-Rational has you living in your head while your relationships starve. You analyze instead of feel. Others experience you as cold or distant. You're missing the human connection that makes life meaningful.",
    cost: "In 5 years: Your marriage is over or loveless. Your kids don't come to you with problems. You're successful but lonely. You've optimized everything except what actually matters.",
    patterns: [
      "Impatience with emotional people",
      "Analyzing feelings instead of experiencing them",
      "Being told you're distant, cold, or uncaring",
      "Intellectual arguments instead of connection"
    ],
    microPlan: [
      "Emotion practice: When feeling arises, name it without analyzing why.",
      "Empathy rep: When someone shares emotions, say 'that sounds hard' instead of solving.",
      "Connection moment: Share one feeling with someone close without explaining it."
    ]
  },
  hyperVigilant: {
    name: "The Hyper-Vigilant",
    tagline: "Constant anxiety about what could go wrong",
    impact: "Your Hyper-Vigilant keeps you in permanent fight-or-flight. You can't enjoy the present because you're scanning for threats. Your anxiety spreads to those around you. Sleep is disrupted by racing thoughts about dangers.",
    cost: "In 5 years: Chronic anxiety has become your identity. You've missed experiences because what if. Your health is impacted by constant stress hormones. Others avoid you because your anxiety is exhausting.",
    patterns: [
      "Constant worry about potential problems",
      "Difficulty trusting things will work out",
      "Sleep disruption from anxious thoughts",
      "Others seeing you as pessimistic or fearful"
    ],
    microPlan: [
      "Worry window: Designate 10 minutes to worry, then mentally close it.",
      "Evidence practice: When anxious, ask 'what evidence supports things will be okay?'",
      "Body scan: 2-minute breathing to shift from threat mode to presence."
    ]
  },
  pleaser: {
    name: "The Pleaser",
    tagline: "Everyone else's needs before your own",
    impact: "Your Pleaser has you so focused on others that you've lost yourself. You're exhausted from over-giving. Resentment builds when people don't reciprocate. You can't ask for what you need or set boundaries.",
    cost: "In 5 years: You're burned out and bitter. People take advantage of you because you taught them they could. You don't know who you are outside of helping others. Your own dreams are forgotten.",
    patterns: [
      "Resentment from constantly over-giving",
      "Can't say no without guilt",
      "Difficulty receiving help or asking for support",
      "Lost yourself in others' needs and expectations"
    ],
    microPlan: [
      "Boundary rep: Say no to one request without over-explaining.",
      "Self-check: Three times daily, ask 'what do I need right now?'",
      "Receiving practice: Accept one compliment or offer of help without deflecting."
    ]
  },
  restless: {
    name: "The Restless",
    tagline: "The next thing will finally satisfy",
    impact: "Your Restless keeps you chasing the next thing while missing what's here. You start projects but don't finish them. Relationships suffer because you're never fully present. Boredom feels intolerable.",
    cost: "In 5 years: A trail of unfinished projects and disappointed people. Partners who left because you were always looking for the next thing. A resume of half-realized potential. Still feeling empty and searching.",
    patterns: [
      "Constant boredom with current activities",
      "Starting many things, finishing few",
      "Always planning the next thing instead of enjoying now",
      "Feeling trapped or restless in commitments"
    ],
    microPlan: [
      "Completion rep: Finish one small thing before starting something new.",
      "Presence practice: Stay with current activity for 5 more minutes when boredom hits.",
      "Gratitude moment: Notice one good thing about what you're doing now."
    ]
  },
  stickler: {
    name: "The Stickler",
    tagline: "Perfect or it's pointless",
    impact: "Your Stickler's perfectionism paralyzes you. Projects don't get finished because they're not perfect. You're anxious about order and organization. Others feel judged by your standards. You're missing the joy of good enough.",
    cost: "In 5 years: Major projects still unfinished waiting for perfect. Relationships damaged by unrealistic expectations. Opportunities missed because the conditions weren't ideal. Exhaustion from trying to perfect everything.",
    patterns: [
      "Perfectionism preventing completion",
      "Anxiety when things aren't organized your way",
      "Frustration when others don't meet your standards",
      "Missing deadlines because it's not perfect yet"
    ],
    microPlan: [
      "Good enough rep: Ship something at 80% perfect. Notice the world doesn't end.",
      "Flexibility practice: Leave one thing slightly messy or imperfect on purpose.",
      "Compassion moment: When noticing flaws, add 'and that's okay' to your thought."
    ]
  },
  victim: {
    name: "The Victim",
    tagline: "Life is harder for me than everyone else",
    impact: "Your Victim keeps you stuck in suffering as identity. You connect through pain rather than joy. Others walk on eggshells around your emotional intensity. Disappointment confirms your worldview that life is unfair to you.",
    cost: "In 5 years: People avoid you because the emotional drama is exhausting. Opportunities passed because you focused on what's wrong. You've become the martyr you feared, suffering to prove you matter.",
    patterns: [
      "Feeling life is uniquely harder for you",
      "Using suffering to get attention or connection",
      "Emotional intensity that exhausts others",
      "Finding the painful angle in situations"
    ],
    microPlan: [
      "Perspective shift: When complaining, follow with one thing going right.",
      "Connection rep: Share good news with someone instead of problems.",
      "Responsibility practice: Notice one thing you have control over in a hard situation."
    ]
  }
};

const SABOTEUR_KEYS = Object.keys(SABOTEUR_INFO);

const STRESS_INTAKE_QUESTIONS = [
  {
    id: 'work_stress',
    question: "What's creating the most stress at work right now?",
    placeholder: "Deadlines, difficult relationships, overwhelming workload, lack of clarity..."
  },
  {
    id: 'relationship_stress',
    question: "What tension or patterns are showing up in your most important relationships?",
    placeholder: "Communication breakdowns, feeling disconnected, recurring conflicts..."
  },
  {
    id: 'health_stress',
    question: "How is stress showing up in your body and sleep?",
    placeholder: "Insomnia, tension, fatigue, anxiety symptoms, health concerns..."
  }
];

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: "When you make a mistake at work, what's your first internal response?",
    options: [
      { text: "I analyze what went wrong logically", saboteurs: { hyperRational: 3, stickler: 1 } },
      { text: "I worry about who else knows and what they think", saboteurs: { hyperVigilant: 3, pleaser: 1 } },
      { text: "I feel like this always happens to me", saboteurs: { victim: 3 } },
      { text: "I avoid thinking about it and move to something else", saboteurs: { avoider: 3, restless: 1 } },
      { text: "I immediately start planning how to fix it perfectly", saboteurs: { stickler: 2, hyperAchiever: 2 } }
    ]
  },
  {
    id: 'q2',
    question: "When someone gives you critical feedback, you typically:",
    options: [
      { text: "Take it very personally and replay it for days", saboteurs: { victim: 3, pleaser: 1 } },
      { text: "Get defensive and explain why they're wrong", saboteurs: { controller: 3 } },
      { text: "Smile and agree but feel hurt inside", saboteurs: { pleaser: 3, avoider: 1 } },
      { text: "Immediately create a plan to fix and improve", saboteurs: { hyperAchiever: 3, stickler: 1 } },
      { text: "Analyze it intellectually without emotional reaction", saboteurs: { hyperRational: 3 } }
    ]
  },
  {
    id: 'q3',
    question: "How do you handle conflict in close relationships?",
    options: [
      { text: "Avoid it as long as possible, then explode", saboteurs: { avoider: 3, victim: 1 } },
      { text: "Try to fix the other person's feelings or behavior", saboteurs: { controller: 3, pleaser: 1 } },
      { text: "Get emotional and feel like they don't understand", saboteurs: { victim: 3 } },
      { text: "Stay calm and logical while they get emotional", saboteurs: { hyperRational: 3, controller: 1 } },
      { text: "Focus on solving it quickly to move on", saboteurs: { restless: 2, avoider: 1, hyperAchiever: 1 } }
    ]
  },
  {
    id: 'q4',
    question: "When plans change unexpectedly, you:",
    options: [
      { text: "Get excited about the new possibility", saboteurs: { restless: 3 } },
      { text: "Feel anxious about what could go wrong", saboteurs: { hyperVigilant: 3, controller: 1 } },
      { text: "Get frustrated that it wasn't done right", saboteurs: { stickler: 3, controller: 1 } },
      { text: "Adapt easily as long as no one is upset", saboteurs: { pleaser: 3, avoider: 1 } },
      { text: "Feel like this always happens to you", saboteurs: { victim: 3 } }
    ]
  },
  {
    id: 'q5',
    question: "What's most true about your relationship with success?",
    options: [
      { text: "I downplay my achievements or question if I deserve them", saboteurs: { victim: 2, pleaser: 1 } },
      { text: "Success feels good briefly, then I need the next goal", saboteurs: { hyperAchiever: 3, restless: 1 } },
      { text: "I achieved it but it wasn't done perfectly", saboteurs: { stickler: 3, hyperAchiever: 1 } },
      { text: "I'm proud but worried about maintaining it", saboteurs: { hyperVigilant: 3, controller: 1 } },
      { text: "Success is great but I'm ready for the next thing", saboteurs: { restless: 3, hyperAchiever: 1 } }
    ]
  },
  {
    id: 'q6',
    question: "When you're working on a team project:",
    options: [
      { text: "I struggle to delegate, easier to do it myself", saboteurs: { controller: 3, hyperAchiever: 1 } },
      { text: "I focus on keeping everyone happy and harmonious", saboteurs: { pleaser: 3, avoider: 1 } },
      { text: "I worry others aren't taking it seriously enough", saboteurs: { hyperVigilant: 2, controller: 1, stickler: 1 } },
      { text: "I get frustrated when people are too emotional", saboteurs: { hyperRational: 3, controller: 1 } },
      { text: "I'm already thinking about the next project", saboteurs: { restless: 3, hyperAchiever: 1 } }
    ]
  },
  {
    id: 'q7',
    question: "Your relationship with relaxation and downtime:",
    options: [
      { text: "I feel guilty when I'm not being productive", saboteurs: { hyperAchiever: 3, stickler: 1 } },
      { text: "I can't sit still, always need to be doing something", saboteurs: { restless: 3, hyperAchiever: 1 } },
      { text: "I relax by avoiding things I should be doing", saboteurs: { avoider: 3, restless: 1 } },
      { text: "I can't relax worrying about what needs to be done", saboteurs: { hyperVigilant: 3, stickler: 1 } },
      { text: "I relax but feel sad or focus on what's wrong", saboteurs: { victim: 3 } }
    ]
  },
  {
    id: 'q8',
    question: "When someone needs your help, you:",
    options: [
      { text: "Say yes even when overwhelmed, then feel resentful", saboteurs: { pleaser: 3 } },
      { text: "Help but take over and do it your way", saboteurs: { controller: 3, stickler: 1 } },
      { text: "Give advice and solutions, not emotional support", saboteurs: { hyperRational: 3, controller: 1 } },
      { text: "Help if it's quick, get impatient if it takes too long", saboteurs: { restless: 2, hyperAchiever: 1 } },
      { text: "Avoid getting involved, too much drama", saboteurs: { avoider: 3, hyperRational: 1 } }
    ]
  },
  {
    id: 'q9',
    question: "How do you handle your own emotions?",
    options: [
      { text: "I feel them intensely and others know about it", saboteurs: { victim: 3, pleaser: 1 } },
      { text: "I analyze them or rationalize them away", saboteurs: { hyperRational: 3, avoider: 1 } },
      { text: "I get anxious they'll overwhelm me or others", saboteurs: { hyperVigilant: 2, pleaser: 2 } },
      { text: "I distract myself with activity or the next thing", saboteurs: { restless: 3, avoider: 2 } },
      { text: "I judge myself for having them at all", saboteurs: { stickler: 2, hyperAchiever: 1 } }
    ]
  },
  {
    id: 'q10',
    question: "What's most true about how others experience you?",
    options: [
      { text: "Intense, emotional, sometimes exhausting", saboteurs: { victim: 3, pleaser: 1 } },
      { text: "Controlling, hard to satisfy, micromanaging", saboteurs: { controller: 3, stickler: 1 } },
      { text: "Distant, analytical, hard to connect with", saboteurs: { hyperRational: 3, avoider: 1 } },
      { text: "Driven, busy, hard to pin down", saboteurs: { hyperAchiever: 2, restless: 2 } },
      { text: "Nice but won't be direct or set boundaries", saboteurs: { pleaser: 3, avoider: 1 } }
    ]
  },
  {
    id: 'q11',
    question: "When you're stressed, you typically:",
    options: [
      { text: "Try to control more things", saboteurs: { controller: 3, hyperVigilant: 1 } },
      { text: "Work harder and longer", saboteurs: { hyperAchiever: 3, stickler: 1 } },
      { text: "Withdraw and avoid people", saboteurs: { avoider: 3, hyperRational: 1 } },
      { text: "Worry about worst case scenarios", saboteurs: { hyperVigilant: 3 } },
      { text: "Get emotional and need others to know I'm struggling", saboteurs: { victim: 3, pleaser: 1 } }
    ]
  },
  {
    id: 'q12',
    question: "Your standards for yourself are:",
    options: [
      { text: "Impossibly high, nothing is ever good enough", saboteurs: { stickler: 3, hyperAchiever: 1 } },
      { text: "High for performance, lower for everything else", saboteurs: { hyperAchiever: 3, avoider: 1 } },
      { text: "High but I focus on what's still wrong", saboteurs: { stickler: 3 } },
      { text: "Lower than I wish, I avoid pushing myself", saboteurs: { avoider: 3, victim: 1 } },
      { text: "High for logic and competence, not emotion", saboteurs: { hyperRational: 3 } }
    ]
  }
];

const initialScores = SABOTEUR_KEYS.reduce((acc, k) => {
  acc[k] = 0;
  return acc;
}, {});

const initialState = {
  stage: 'welcome',
  intakeStage: 0,
  intakeResponses: {},
  currentQuestion: 0,
  scores: initialScores,
  answers: [],
  email: '',
  consented: false,
  showEmailGate: false
};

function reducer(state, action) {
  switch (action.type) {
    case 'START':
      return { ...state, stage: 'intake' };
    case 'INTAKE_ANSWER':
      const newIntakeResponses = { ...state.intakeResponses, [action.questionId]: action.value };
      const nextIntakeStage = state.intakeStage + 1;
      if (nextIntakeStage >= STRESS_INTAKE_QUESTIONS.length) {
        return { ...state, intakeResponses: newIntakeResponses, stage: 'quiz', intakeStage: nextIntakeStage };
      }
      return { ...state, intakeResponses: newIntakeResponses, intakeStage: nextIntakeStage };
    case 'ANSWER': {
      const question = QUIZ_QUESTIONS[state.currentQuestion];
      const option = question.options[action.optionIndex];
      const newAnswers = [...state.answers];
      const prevIndex = newAnswers[state.currentQuestion];
      const newScores = { ...state.scores };
      
      if (prevIndex != null) {
        const prevOption = question.options[prevIndex];
        Object.entries(prevOption.saboteurs).forEach(([s, pts]) => {
          newScores[s] = (newScores[s] || 0) - pts;
        });
      }
      
      Object.entries(option.saboteurs).forEach(([s, pts]) => {
        newScores[s] = (newScores[s] || 0) + pts;
      });
      
      newAnswers[state.currentQuestion] = action.optionIndex;
      
      if (state.currentQuestion < QUIZ_QUESTIONS.length - 1) {
        return { ...state, answers: newAnswers, scores: newScores, currentQuestion: state.currentQuestion + 1 };
      } else {
        return { ...state, answers: newAnswers, scores: newScores, showEmailGate: true };
      }
    }
    case 'BACK':
      if (state.currentQuestion === 0) return state;
      return { ...state, currentQuestion: state.currentQuestion - 1 };
    case 'SET_EMAIL':
      return { ...state, email: action.value };
    case 'SET_CONSENTED':
      return { ...state, consented: action.value };
    case 'EMAIL_SUBMIT':
      return { ...state, stage: 'results' };
    case 'LOAD_STATE':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const getRankedSaboteurs = (scores) => {
  const entries = Object.entries(scores || {}).filter(([_, v]) => v > 0);
  if (!entries.length) return [];
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([key, value], idx) => ({ key, value, rank: idx + 1 }));
};

const personalize = (intakeText, bullets) => {
  const allText = Object.values(intakeText).join(' ').toLowerCase();
  const keywords = {
    sleep: ['sleep', 'insomnia', 'tired', 'exhausted', 'awake'],
    work: ['boss', 'manager', 'deadline', 'workload', 'overwhelmed'],
    relationship: ['spouse', 'partner', 'husband', 'wife', 'marriage', 'relationship'],
    anxiety: ['anxiety', 'panic', 'worry', 'fear', 'stressed']
  };
  
  const hits = [];
  Object.entries(keywords).forEach(([category, words]) => {
    if (words.some(w => allText.includes(w))) {
      hits.push(category);
    }
  });
  
  if (hits.length === 0) return bullets;
  
  const context = hits.map(h => {
    if (h === 'sleep') return 'disrupted sleep';
    if (h === 'work') return 'work pressure';
    if (h === 'relationship') return 'relationship strain';
    if (h === 'anxiety') return 'anxiety symptoms';
    return h;
  }).join(', ');
  
  return [
    `You specifically mentioned ${context}. This pattern directly connects to those struggles.`,
    ...bullets
  ];
};

function IntakeQuestion({ question, progress, onContinue }) {
  const [currentText, setCurrentText] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 p-4">
      <div className="max-w-3xl mx-auto pt-8 pb-12">
        <div className="mb-6">
          <div className="flex justify-between text-sm text-indigo-200 mb-2">
            <span>Step {progress.current} of {progress.total}</span>
            <span>{Math.round((progress.current / progress.total) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(progress.current / progress.total) * 100}%` }}
            />
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            {question.question}
          </h2>
          
          <p className="text-gray-600 mb-6">
            Be specific. The more honest you are, the more personalized your results will be.
          </p>
          
          <textarea
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder={question.placeholder}
            className="w-full h-40 p-4 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none resize-none text-gray-700"
            aria-label={question.question}
          />
          
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                onContinue(currentText);
                setCurrentText('');
              }}
              disabled={!currentText.trim()}
              className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
              aria-label="Continue to next question"
            >
              Continue
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  useEffect(() => {
    const saved = localStorage.getItem('mfa_state');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_STATE', payload: parsed });
      } catch (e) {
        console.error('Failed to load saved state');
      }
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('mfa_state', JSON.stringify(state));
  }, [state]);

  if (state.stage === 'welcome') {

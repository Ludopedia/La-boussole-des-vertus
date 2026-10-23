export type VirtueKey = 'prudence' | 'temperance' | 'fortitude' | 'justice';

export interface VirtueDefinition {
  key: VirtueKey;
  frenchTitle: string;
  subTitle: string;
  latinName: string;
  greekName: string;
  cardinalRole: string;
  essence: string;
  falseFriends: string;
  antiqueQuote: {
    text: string;
    author: string;
    work?: string;
  };
  color: {
    primary: string;
    bg: string;
    border: string;
    text: string;
    light: string;
  };
  questions: {
    id: string;
    text: string;
    subtext?: string;
  }[];
}

export interface SelfAnswers {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
}

export interface Participant {
  id: string;
  name: string;
  avatarColor: string;
  selfScores: Record<VirtueKey, SelfAnswers>;
  peerReviews: Record<
    string,
    {
      scores: Record<VirtueKey, number>; // 0 to 20
      anecdote?: string;
    }
  >;
  commitment?: {
    virtue: VirtueKey;
    action: string;
  };
}

export interface WorkshopSession {
  id: string;
  title: string;
  date: string;
  goldenRuleAccepted?: boolean;
  participants: Participant[];
}

export const createDefaultSelfScores = (): Record<VirtueKey, SelfAnswers> => ({
  prudence: { q1: 3, q2: 3, q3: 3, q4: 3 },
  temperance: { q1: 3, q2: 3, q3: 3, q4: 3 },
  fortitude: { q1: 3, q2: 3, q3: 3, q4: 3 },
  justice: { q1: 3, q2: 3, q3: 3, q4: 3 },
});

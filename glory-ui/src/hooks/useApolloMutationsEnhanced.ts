import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

// GraphQL Mutations
export const CREATE_FIGHTER = gql`
  mutation CreateFighter($name: String!, $weight_class: String!, $record: String, $nationality: String, $age: Int, $mugshot_url: String, $voice_profile: String) {
    createFighter(name: $name, weight_class: $weight_class, record: $record, nationality: $nationality, age: $age, mugshot_url: $mugshot_url, voice_profile: $voice_profile) {
      id
      name
      weight_class
      record
      nationality
      age
      mugshot_url
      voice_profile
      ai_generated
      created_at
    }
  }
`;

export const SCHEDULE_MATCH = gql`
  mutation ScheduleMatch($fighterAId: Int!, $fighterBId: Int!, $venue: String!, $date: String!, $scheduledRounds: Int, $titleFight: Boolean) {
    scheduleMatch(fighterAId: $fighterAId, fighterBId: $fighterBId, venue: $venue, date: $date, scheduledRounds: $scheduledRounds, titleFight: $titleFight) {
      id
      fighter_a_id
      fighter_b_id
      venue
      date
      scheduled_rounds
      title_fight
      status
      created_at
    }
  }
`;

export const SUBMIT_PRESS_QUESTION = gql`
  mutation SubmitPressQuestion($matchId: Int!, $question: String!, $category: String, $importance: Int) {
    submitPressQuestion(matchId: $matchId, question: $question, category: $category, importance: $importance) {
      id
      match_id
      questions
      transcript
      ai_generated_quotes
      public_sentiment_score
      created_at
    }
  }
`;

export const GENERATE_AI_MUGSHOT = gql`
  mutation GenerateAiMugshot($fighterId: Int!, $style: String) {
    generateAiMugshot(fighterId: $fighterId, style: $style) {
      success
      mugshot_url
      error_message
    }
  }
`;

export const GENERATE_AI_VOICE = gql`
  mutation GenerateAiVoice($fighterId: Int!, $voiceType: String) {
    generateAiVoice(fighterId: $fighterId, voiceType: $voiceType) {
      success
      voice_profile
      error_message
    }
  }
`;

export const UPDATE_FIGHTER_RANKING = gql`
  mutation UpdateFighterRanking($fighterId: Int!, $organization: String!, $weightClass: String!, $rank: Int!) {
    updateFighterRanking(fighterId: $fighterId, organization: $organization, weightClass: $weightClass, rank: $rank) {
      id
      fighter_id
      organization
      weight_class
      rank
      updated_at
    }
  }
`;

// GraphQL Queries
export const GET_FIGHTERS = gql`
  query GetFighters {
    getFighters {
      id
      name
      weight_class
      record
      nationality
      age
      mugshot_url
      voice_profile
      ai_generated
      created_at
    }
  }
`;

export const GET_FIGHTER = gql`
  query GetFighter($fighterId: Int!) {
    getFighter(fighterId: $fighterId) {
      id
      name
      weight_class
      record
      nationality
      age
      mugshot_url
      voice_profile
      ai_generated
      created_at
    }
  }
`;

export const GET_MATCHES = gql`
  query GetMatches {
    getMatches {
      id
      fighter_a_id
      fighter_b_id
      venue
      date
      result
      scorecard
      scheduled_rounds
      title_fight
      status
      created_at
    }
  }
`;

export const GET_PRESS_CONFERENCES = gql`
  query GetPressConferences {
    getPressConferences {
      id
      match_id
      questions
      transcript
      ai_generated_quotes
      public_sentiment_score
      created_at
    }
  }
`;

export const GET_TITLES = gql`
  query GetTitles {
    getTitles {
      id
      organization
      weight_class
      current_champion_id
      updated_at
    }
  }
`;

export const GET_RANKINGS = gql`
  query GetRankings {
    getRankings {
      id
      fighter_id
      organization
      weight_class
      rank
      updated_at
    }
  }
`;

export const GET_RANKINGS_BY_WEIGHT_CLASS = gql`
  query GetRankingsByWeightClass($weightClass: String!) {
    getRankingsByWeightClass(weightClass: $weightClass) {
      id
      fighter_id
      organization
      weight_class
      rank
      updated_at
    }
  }
`;

// Hook for creating fighters
export const useCreateFighter = () => {
  const [createFighter, { loading, error, data }] = useMutation(CREATE_FIGHTER, {
    refetchQueries: [{ query: GET_FIGHTERS }],
    onError: (error) => {
      console.error('Error creating fighter:', error);
    },
  });

  const createFighterWithErrorHandling = async (input: {
    name: string;
    weight_class: string;
    record?: string;
    nationality?: string;
    age?: number;
    mugshot_url?: string;
    voice_profile?: string;
  }) => {
    try {
      const result = await createFighter({
        variables: input,
      });
      return { success: true, data: result.data?.createFighter };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    createFighter: createFighterWithErrorHandling,
    loading,
    error,
    data: data?.createFighter,
  };
};

// Hook for scheduling matches
export const useScheduleMatch = () => {
  const [scheduleMatch, { loading, error, data }] = useMutation(SCHEDULE_MATCH, {
    refetchQueries: [{ query: GET_MATCHES }],
    onError: (error) => {
      console.error('Error scheduling match:', error);
    },
  });

  const scheduleMatchWithErrorHandling = async (input: {
    fighterAId: number;
    fighterBId: number;
    venue: string;
    date: string;
    scheduledRounds?: number;
    titleFight?: boolean;
  }) => {
    try {
      const result = await scheduleMatch({
        variables: input,
      });
      return { success: true, data: result.data?.scheduleMatch };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    scheduleMatch: scheduleMatchWithErrorHandling,
    loading,
    error,
    data: data?.scheduleMatch,
  };
};

// Hook for submitting press questions
export const useSubmitPressQuestion = () => {
  const [submitPressQuestion, { loading, error, data }] = useMutation(SUBMIT_PRESS_QUESTION, {
    refetchQueries: [{ query: GET_PRESS_CONFERENCES }],
    onError: (error) => {
      console.error('Error submitting press question:', error);
    },
  });

  const submitPressQuestionWithErrorHandling = async (input: {
    matchId: number;
    question: string;
    category?: string;
    importance?: number;
  }) => {
    try {
      const result = await submitPressQuestion({
        variables: input,
      });
      return { success: true, data: result.data?.submitPressQuestion };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    submitPressQuestion: submitPressQuestionWithErrorHandling,
    loading,
    error,
    data: data?.submitPressQuestion,
  };
};

// Hook for generating AI mugshots
export const useGenerateAiMugshot = () => {
  const [generateAiMugshot, { loading, error, data }] = useMutation(GENERATE_AI_MUGSHOT, {
    refetchQueries: [{ query: GET_FIGHTERS }],
    onError: (error) => {
      console.error('Error generating AI mugshot:', error);
    },
  });

  const generateMugshotWithErrorHandling = async (input: {
    fighterId: number;
    style?: string;
  }) => {
    try {
      const result = await generateAiMugshot({
        variables: input,
      });
      return { success: true, data: result.data?.generateAiMugshot };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    generateAiMugshot: generateMugshotWithErrorHandling,
    loading,
    error,
    data: data?.generateAiMugshot,
  };
};

// Hook for generating AI voice
export const useGenerateAiVoice = () => {
  const [generateAiVoice, { loading, error, data }] = useMutation(GENERATE_AI_VOICE, {
    refetchQueries: [{ query: GET_FIGHTERS }],
    onError: (error) => {
      console.error('Error generating AI voice:', error);
    },
  });

  const generateVoiceWithErrorHandling = async (input: {
    fighterId: number;
    voiceType?: string;
  }) => {
    try {
      const result = await generateAiVoice({
        variables: input,
      });
      return { success: true, data: result.data?.generateAiVoice };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    generateAiVoice: generateVoiceWithErrorHandling,
    loading,
    error,
    data: data?.generateAiVoice,
  };
};

// Hook for updating fighter rankings
export const useUpdateFighterRanking = () => {
  const [updateFighterRanking, { loading, error, data }] = useMutation(UPDATE_FIGHTER_RANKING, {
    refetchQueries: [{ query: GET_RANKINGS }],
    onError: (error) => {
      console.error('Error updating fighter ranking:', error);
    },
  });

  const updateRankingWithErrorHandling = async (input: {
    fighterId: number;
    organization: string;
    weightClass: string;
    rank: number;
  }) => {
    try {
      const result = await updateFighterRanking({
        variables: input,
      });
      return { success: true, data: result.data?.updateFighterRanking };
    } catch (err) {
      return { success: false, error: err };
    }
  };

  return {
    updateFighterRanking: updateRankingWithErrorHandling,
    loading,
    error,
    data: data?.updateFighterRanking,
  };
};

// Hook for fetching fighters
export const useGetFighters = () => {
  const { loading, error, data, refetch } = useQuery(GET_FIGHTERS, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching fighters:', error);
    },
  });

  return {
    fighters: data?.getFighters || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching a single fighter
export const useGetFighter = (fighterId: number) => {
  const { loading, error, data, refetch } = useQuery(GET_FIGHTER, {
    variables: { fighterId },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching fighter:', error);
    },
  });

  return {
    fighter: data?.getFighter,
    loading,
    error,
    refetch,
  };
};

// Hook for fetching matches
export const useGetMatches = () => {
  const { loading, error, data, refetch } = useQuery(GET_MATCHES, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching matches:', error);
    },
  });

  return {
    matches: data?.getMatches || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching press conferences
export const useGetPressConferences = () => {
  const { loading, error, data, refetch } = useQuery(GET_PRESS_CONFERENCES, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching press conferences:', error);
    },
  });

  return {
    pressConferences: data?.getPressConferences || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching titles
export const useGetTitles = () => {
  const { loading, error, data, refetch } = useQuery(GET_TITLES, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching titles:', error);
    },
  });

  return {
    titles: data?.getTitles || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching rankings
export const useGetRankings = () => {
  const { loading, error, data, refetch } = useQuery(GET_RANKINGS, {
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching rankings:', error);
    },
  });

  return {
    rankings: data?.getRankings || [],
    loading,
    error,
    refetch,
  };
};

// Hook for fetching rankings by weight class
export const useGetRankingsByWeightClass = (weightClass: string) => {
  const { loading, error, data, refetch } = useQuery(GET_RANKINGS_BY_WEIGHT_CLASS, {
    variables: { weightClass },
    fetchPolicy: 'cache-and-network',
    onError: (error) => {
      console.error('Error fetching rankings by weight class:', error);
    },
  });

  return {
    rankings: data?.getRankingsByWeightClass || [],
    loading,
    error,
    refetch,
  };
};

// Custom hook for form state management
export const useFormState = <T extends Record<string, any>>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const updateField = (field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const setFieldError = (field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const clearErrors = () => {
    setErrors({});
  };

  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  return {
    formData,
    errors,
    updateField,
    setFieldError,
    clearErrors,
    resetForm,
  };
};

// Validation utilities
export const validateFighterInput = (input: {
  name: string;
  weight_class: string;
  record?: string;
  nationality?: string;
  age?: number;
  mugshot_url?: string;
  voice_profile?: string;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!input.name?.trim()) {
    errors.name = 'Fighter name is required';
  }

  if (!input.weight_class?.trim()) {
    errors.weight_class = 'Weight class is required';
  }

  if (input.age && (input.age < 16 || input.age > 60)) {
    errors.age = 'Age must be between 16 and 60';
  }

  return errors;
};

export const validateMatchInput = (input: {
  fighterAId: number;
  fighterBId: number;
  venue: string;
  date: string;
  scheduledRounds?: number;
  titleFight?: boolean;
}): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!input.fighterAId) {
    errors.fighterAId = 'Fighter A is required';
  }

  if (!input.fighterBId) {
    errors.fighterBId = 'Fighter B is required';
  }

  if (input.fighterAId === input.fighterBId) {
    errors.fighterBId = 'Fighters must be different';
  }

  if (!input.venue?.trim()) {
    errors.venue = 'Venue is required';
  }

  if (!input.date) {
    errors.date = 'Date is required';
  } else {
    const selectedDate = new Date(input.date);
    const now = new Date();
    if (selectedDate <= now) {
      errors.date = 'Match date must be in the future';
    }
  }

  if (input.scheduledRounds && (input.scheduledRounds < 4 || input.scheduledRounds > 12)) {
    errors.scheduledRounds = 'Rounds must be between 4 and 12';
  }

  return errors;
}; 
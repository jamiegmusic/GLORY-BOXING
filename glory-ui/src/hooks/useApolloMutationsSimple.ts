import { gql, useMutation, useQuery } from "@apollo/client";
import { useState } from "react";

// GraphQL Mutations
export const CREATE_FIGHTER = gql`
  mutation CreateFighter($name: String!, $weight_class: String!, $record: String, $nationality: String, $age: Int, $mugshot_url: String) {
    createFighter(name: $name, weight_class: $weight_class, record: $record, nationality: $nationality, age: $age, mugshot_url: $mugshot_url) {
      id
      name
      weight_class
      record
      nationality
      age
      mugshot_url
      created_at
    }
  }
`;

export const SCHEDULE_MATCH = gql`
  mutation ScheduleMatch($fighterAId: Int!, $fighterBId: Int!, $venue: String!, $date: String!) {
    scheduleMatch(fighterAId: $fighterAId, fighterBId: $fighterBId, venue: $venue, date: $date) {
      id
      fighter_a_id
      fighter_b_id
      venue
      date
      created_at
    }
  }
`;

export const SUBMIT_QUESTION = gql`
  mutation SubmitPressQuestion($matchId: Int!, $question: String!) {
    submitPressQuestion(matchId: $matchId, question: $question) {
      id
      match_id
      questions
      created_at
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
      created_at
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
  const [submitPressQuestion, { loading, error, data }] = useMutation(SUBMIT_QUESTION, {
    onError: (error) => {
      console.error('Error submitting press question:', error);
    },
  });

  const submitPressQuestionWithErrorHandling = async (input: {
    matchId: number;
    question: string;
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

  return errors;
}; 
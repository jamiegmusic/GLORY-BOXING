import { useMutation, useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import type { Fighter, Match, PressConference, PressQuestion } from '../lib/unified-types';

// GraphQL Mutations
const CREATE_FIGHTER = gql`
  mutation CreateFighter($input: CreateFighterInput!) {
    createFighter(input: $input) {
      id
      name
      weight_class
      record_wins
      record_losses
      record_draws
      nationality
      age
      mugshot_url
      stance
      promoter
      amateur_record
      pro_record
      debut_date
      retired
      created_at
      updated_at
    }
  }
`;

const SCHEDULE_MATCH = gql`
  mutation ScheduleMatch($input: ScheduleMatchInput!) {
    scheduleMatch(input: $input) {
      id
      fighter_a_id
      fighter_b_id
      venue
      date
      scheduled_rounds
      title_fight
      title_id
      status
      created_at
      updated_at
    }
  }
`;

const SUBMIT_PRESS_QUESTION = gql`
  mutation SubmitPressQuestion($input: SubmitPressQuestionInput!) {
    submitPressQuestion(input: $input) {
      id
      press_conference_id
      question
      target
      category
      importance
      journalist
      created_at
    }
  }
`;

// GraphQL Queries
const GET_FIGHTERS = gql`
  query GetFighters {
    fighters {
      id
      name
      weight_class
      record_wins
      record_losses
      record_draws
      nationality
      age
      mugshot_url
      stance
      promoter
      retired
    }
  }
`;

const GET_MATCHES = gql`
  query GetMatches {
    matches {
      id
      fighter_a_id
      fighter_b_id
      venue
      date
      status
      title_fight
      title_id
    }
  }
`;

const GET_PRESS_CONFERENCES = gql`
  query GetPressConferences {
    pressConferences {
      id
      match_id
      event_name
      conference_date
      questions
      transcript
      created_at
    }
  }
`;

// TypeScript interfaces for mutation inputs
interface CreateFighterInput {
  name: string;
  weight_class: string;
  nationality?: string;
  age?: number;
  mugshot_url?: string;
  stance?: string;
  promoter?: string;
  amateur_record?: string;
  pro_record?: string;
  debut_date?: string;
}

interface ScheduleMatchInput {
  fighter_a_id: string;
  fighter_b_id: string;
  venue: string;
  date: string;
  scheduled_rounds?: number;
  title_fight?: boolean;
  title_id?: string;
}

interface SubmitPressQuestionInput {
  press_conference_id: string;
  question: string;
  target?: string;
  category?: string;
  importance?: number;
  journalist?: string;
}

// Hook for creating fighters
export const useCreateFighter = () => {
  const [createFighter, { loading, error, data }] = useMutation(CREATE_FIGHTER, {
    refetchQueries: [{ query: GET_FIGHTERS }],
    onError: (error) => {
      console.error('Error creating fighter:', error);
    },
  });

  const createFighterWithErrorHandling = async (input: CreateFighterInput) => {
    try {
      const result = await createFighter({
        variables: { input },
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

  const scheduleMatchWithErrorHandling = async (input: ScheduleMatchInput) => {
    try {
      const result = await scheduleMatch({
        variables: { input },
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

  const submitPressQuestionWithErrorHandling = async (input: SubmitPressQuestionInput) => {
    try {
      const result = await submitPressQuestion({
        variables: { input },
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
    fighters: data?.fighters || [],
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
    matches: data?.matches || [],
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
    pressConferences: data?.pressConferences || [],
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
export const validateFighterInput = (input: CreateFighterInput): Record<string, string> => {
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

export const validateMatchInput = (input: ScheduleMatchInput): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!input.fighter_a_id) {
    errors.fighter_a_id = 'Fighter A is required';
  }

  if (!input.fighter_b_id) {
    errors.fighter_b_id = 'Fighter B is required';
  }

  if (input.fighter_a_id === input.fighter_b_id) {
    errors.fighter_b_id = 'Fighters must be different';
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

export const validatePressQuestionInput = (input: SubmitPressQuestionInput): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!input.press_conference_id) {
    errors.press_conference_id = 'Press conference is required';
  }

  if (!input.question?.trim()) {
    errors.question = 'Question is required';
  }

  if (input.question && input.question.length > 500) {
    errors.question = 'Question must be less than 500 characters';
  }

  return errors;
}; 
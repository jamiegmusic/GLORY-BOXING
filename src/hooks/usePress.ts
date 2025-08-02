import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { PressConference, PressQuestion } from '../lib/unified-types'

export const usePress = () => {
  const [pressConferences, setPressConferences] = useState<PressConference[]>([])
  const [pressQuestions, setPressQuestions] = useState<PressQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPressConferences = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('press_conferences')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPressConferences(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch press conferences')
    } finally {
      setLoading(false)
    }
  }

  const fetchPressQuestions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('press_questions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPressQuestions(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch press questions')
    } finally {
      setLoading(false)
    }
  }

  const createPressConference = async (conferenceData: Omit<PressConference, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('press_conferences')
        .insert(conferenceData)
        .select()

      if (error) throw error
      await fetchPressConferences()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create press conference')
      throw err
    }
  }

  const addPressQuestion = async (question: Omit<PressQuestion, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('press_questions')
        .insert(question)
        .select()

      if (error) throw error
      await fetchPressQuestions()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add press question')
      throw err
    }
  }

  const getQuestionsForMatch = (matchId: string) => {
    return pressQuestions.filter(q => q.match_id === matchId)
  }

  const getConferenceForMatch = (matchId: string) => {
    return pressConferences.find(c => c.match_id === matchId)
  }

  const generateAIPressQuestions = async (matchId: string, fighterA: string, fighterB: string) => {
    try {
      const questions = [
        {
          match_id: matchId,
          question: `How do you feel about facing ${fighterB} in this upcoming fight?`,
          target: fighterA,
          category: 'pre-fight',
          importance: 8,
          journalist: 'AI Sports Reporter'
        },
        {
          match_id: matchId,
          question: `What's your strategy going into this fight against ${fighterA}?`,
          target: fighterB,
          category: 'pre-fight',
          importance: 7,
          journalist: 'AI Sports Reporter'
        },
        {
          match_id: matchId,
          question: 'How do you think the crowd will react to this matchup?',
          target: 'both',
          category: 'pre-fight',
          importance: 6,
          journalist: 'AI Sports Reporter'
        }
      ]

      for (const question of questions) {
        await addPressQuestion(question)
      }

      return questions
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI press questions')
      throw err
    }
  }

  const updatePublicSentiment = async (conferenceId: string, sentimentScore: number) => {
    try {
      const { data, error } = await supabase
        .from('press_conferences')
        .update({ public_sentiment_score: sentimentScore })
        .eq('id', conferenceId)
        .select()

      if (error) throw error
      await fetchPressConferences()
      return data?.[0]
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update public sentiment')
      throw err
    }
  }

  useEffect(() => {
    fetchPressConferences()
    fetchPressQuestions()
  }, [])

  return {
    pressConferences,
    pressQuestions,
    loading,
    error,
    fetchPressConferences,
    fetchPressQuestions,
    createPressConference,
    addPressQuestion,
    getQuestionsForMatch,
    getConferenceForMatch,
    generateAIPressQuestions,
    updatePublicSentiment
  }
} 
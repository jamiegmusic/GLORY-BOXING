import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  MessageSquare, 
  Mic, 
  Users, 
  Calendar, 
  MapPin, 
  TrendingUp, 
  AlertCircle,
  Send,
  Quote,
  Newspaper
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  useSubmitPressQuestion, 
  useGetPressConferences, 
  useGetMatches, 
  useGetFighters,
  useFormState, 
  validatePressQuestionInput 
} from '../../hooks/useApolloMutations';
import type { PressConference, Match, Fighter } from '../../lib/unified-types';

interface PressTabEnhancedProps {
  className?: string;
}

const PressTabEnhanced: React.FC<PressTabEnhancedProps> = ({ className }) => {
  const { submitPressQuestion, loading: submitLoading, error: submitError } = useSubmitPressQuestion();
  const { pressConferences, loading: conferencesLoading, error: conferencesError } = useGetPressConferences();
  const { matches, loading: matchesLoading, error: matchesError } = useGetMatches();
  const { fighters, loading: fightersLoading, error: fightersError } = useGetFighters();

  const { formData, errors, updateField, setFieldError, clearErrors, resetForm } = useFormState({
    press_conference_id: '',
    question: '',
    target: '',
    category: 'general',
    importance: 5,
    journalist: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('submit');

  const getMatchById = (id: string): Match | undefined => {
    return matches.find(match => match.id === id);
  };

  const getFighterById = (id: string): Fighter | undefined => {
    return fighters.find(fighter => fighter.id === id);
  };

  const getFighterDisplayName = (fighter: Fighter): string => {
    const record = `${fighter.record_wins}-${fighter.record_losses}-${fighter.record_draws}`;
    return `${fighter.name} (${record})`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Validate form
    const validationErrors = validatePressQuestionInput(formData);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        setFieldError(field as keyof typeof formData, error);
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitPressQuestion({
        press_conference_id: formData.press_conference_id,
        question: formData.question,
        target: formData.target || undefined,
        category: formData.category,
        importance: formData.importance,
        journalist: formData.journalist || undefined
      });

      if (result.success) {
        resetForm();
        // Show success message
        console.log('Press question submitted successfully:', result.data);
      } else {
        console.error('Failed to submit press question:', result.error);
      }
    } catch (error) {
      console.error('Error submitting press question:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPressConferenceById = (id: string): PressConference | undefined => {
    return pressConferences.find(conference => conference.id === id);
  };

  const getMatchForConference = (conference: PressConference): Match | undefined => {
    return getMatchById(conference.match_id);
  };

  const getFightersForMatch = (match: Match): { fighterA?: Fighter; fighterB?: Fighter } => {
    return {
      fighterA: getFighterById(match.fighter_a_id),
      fighterB: getFighterById(match.fighter_b_id)
    };
  };

  const recentConferences = pressConferences
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  const upcomingMatches = matches
    .filter(match => new Date(match.date) > new Date() && match.status === 'scheduled')
    .slice(0, 3);

  if (conferencesLoading || matchesLoading || fightersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading press data...</p>
        </div>
      </div>
    );
  }

  if (conferencesError || matchesError || fightersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading press data</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Press Conferences</h2>
          <p className="text-muted-foreground">
            Manage press conferences and submit questions for upcoming fights
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {pressConferences.length} Conferences
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="submit" className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Submit Question
          </TabsTrigger>
          <TabsTrigger value="conferences" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            Recent Conferences
          </TabsTrigger>
        </TabsList>

        <TabsContent value="submit" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Submit Question Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Submit Press Question
                </CardTitle>
                <CardDescription>
                  Submit a question for an upcoming press conference
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Press Conference Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="press_conference_id">Press Conference</Label>
                    <Select
                      value={formData.press_conference_id}
                      onValueChange={(value) => updateField('press_conference_id', value)}
                    >
                      <SelectTrigger className={cn(errors.press_conference_id && "border-destructive")}>
                        <SelectValue placeholder="Select a press conference" />
                      </SelectTrigger>
                      <SelectContent>
                        {pressConferences.map((conference) => {
                          const match = getMatchForConference(conference);
                          const { fighterA, fighterB } = match ? getFightersForMatch(match) : {};
                          
                          return (
                            <SelectItem key={conference.id} value={conference.id}>
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {fighterA?.name} vs {fighterB?.name}
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {format(new Date(conference.created_at), 'MMM dd, yyyy')}
                                </span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                    {errors.press_conference_id && (
                      <p className="text-sm text-destructive">{errors.press_conference_id}</p>
                    )}
                  </div>

                  {/* Question Input */}
                  <div className="space-y-2">
                    <Label htmlFor="question">Question</Label>
                    <Textarea
                      id="question"
                      placeholder="Enter your press question..."
                      value={formData.question}
                      onChange={(e) => updateField('question', e.target.value)}
                      className={cn(errors.question && "border-destructive")}
                      rows={4}
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Be specific and professional</span>
                      <span>{formData.question.length}/500</span>
                    </div>
                    {errors.question && (
                      <p className="text-sm text-destructive">{errors.question}</p>
                    )}
                  </div>

                  {/* Question Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="target">Target (Optional)</Label>
                      <Input
                        id="target"
                        placeholder="Specific fighter or topic"
                        value={formData.target}
                        onChange={(e) => updateField('target', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => updateField('category', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="fight_preparation">Fight Preparation</SelectItem>
                          <SelectItem value="personal">Personal</SelectItem>
                          <SelectItem value="controversy">Controversy</SelectItem>
                          <SelectItem value="prediction">Prediction</SelectItem>
                          <SelectItem value="career">Career</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Importance and Journalist */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="importance">Importance Level</Label>
                      <Select
                        value={formData.importance.toString()}
                        onValueChange={(value) => updateField('importance', parseInt(value))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">Low Priority</SelectItem>
                          <SelectItem value="3">Medium Priority</SelectItem>
                          <SelectItem value="5">Standard</SelectItem>
                          <SelectItem value="7">High Priority</SelectItem>
                          <SelectItem value="10">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="journalist">Journalist (Optional)</Label>
                      <Input
                        id="journalist"
                        placeholder="Your name or outlet"
                        value={formData.journalist}
                        onChange={(e) => updateField('journalist', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting || submitLoading}
                  >
                    {isSubmitting || submitLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Submitting Question...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Submit Question
                      </>
                    )}
                  </Button>

                  {submitError && (
                    <p className="text-sm text-destructive text-center">
                      Error submitting question. Please try again.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>

            {/* Upcoming Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Fights
                </CardTitle>
                <CardDescription>
                  Recent matches that may have press conferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingMatches.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No upcoming matches</p>
                    <p className="text-sm text-muted-foreground">
                      Schedule matches to see them here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingMatches.map((match) => {
                      const { fighterA, fighterB } = getFightersForMatch(match);
                      
                      return (
                        <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{fighterA?.name}</span>
                              <span className="text-muted-foreground">vs</span>
                              <span className="font-medium">{fighterB?.name}</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {match.venue}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(match.date), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">
                            {match.scheduled_rounds} Rounds
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Recent Press Conferences
              </CardTitle>
              <CardDescription>
                Latest press conferences and their questions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentConferences.length === 0 ? (
                <div className="text-center py-8">
                  <Newspaper className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No press conferences yet</p>
                  <p className="text-sm text-muted-foreground">
                    Submit questions to see conferences here
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentConferences.map((conference) => {
                    const match = getMatchForConference(conference);
                    const { fighterA, fighterB } = match ? getFightersForMatch(match) : {};
                    
                    return (
                      <div key={conference.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {fighterA?.name} vs {fighterB?.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(conference.created_at), 'PPP')}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {conference.questions?.length || 0} Questions
                          </Badge>
                        </div>

                        {match && (
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {match.venue}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {format(new Date(match.date), 'MMM dd, yyyy')}
                            </div>
                          </div>
                        )}

                        {conference.transcript && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Transcript</h4>
                            <p className="text-sm text-muted-foreground">
                              {conference.transcript}
                            </p>
                          </div>
                        )}

                        {conference.highlights && conference.highlights.length > 0 && (
                          <div className="mb-4">
                            <h4 className="font-medium mb-2">Highlights</h4>
                            <div className="space-y-1">
                              {conference.highlights.map((highlight, index) => (
                                <p key={index} className="text-sm text-muted-foreground">
                                  • {highlight}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {conference.controversies && conference.controversies.length > 0 && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-destructive" />
                              Controversies
                            </h4>
                            <div className="space-y-1">
                              {conference.controversies.map((controversy, index) => (
                                <p key={index} className="text-sm text-destructive">
                                  • {controversy}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PressTabEnhanced; 
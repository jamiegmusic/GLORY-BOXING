import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, MapPin, Users, Trophy } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useScheduleMatch, useGetFighters, useGetMatches, useFormState, validateMatchInput } from '../../hooks/useApolloMutations';
import type { Fighter, Match } from '../../lib/unified-types';

interface ScheduleTabEnhancedProps {
  className?: string;
}

const ScheduleTabEnhanced: React.FC<ScheduleTabEnhancedProps> = ({ className }) => {
  const { scheduleMatch, loading: scheduleLoading, error: scheduleError } = useScheduleMatch();
  const { fighters, loading: fightersLoading, error: fightersError } = useGetFighters();
  const { matches, loading: matchesLoading, error: matchesError } = useGetMatches();

  const { formData, errors, updateField, setFieldError, clearErrors, resetForm } = useFormState({
    fighter_a_id: '',
    fighter_b_id: '',
    venue: '',
    date: '',
    scheduled_rounds: 12,
    title_fight: false,
    title_id: '',
    notes: ''
  });

  const [selectedDate, setSelectedDate] = useState<Date>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update form data when date is selected
  useEffect(() => {
    if (selectedDate) {
      updateField('date', format(selectedDate, 'yyyy-MM-dd'));
    }
  }, [selectedDate, updateField]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Validate form
    const validationErrors = validateMatchInput(formData);
    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        setFieldError(field as keyof typeof formData, error);
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await scheduleMatch({
        fighter_a_id: formData.fighter_a_id,
        fighter_b_id: formData.fighter_b_id,
        venue: formData.venue,
        date: formData.date,
        scheduled_rounds: formData.scheduled_rounds,
        title_fight: formData.title_fight,
        title_id: formData.title_id || undefined
      });

      if (result.success) {
        resetForm();
        setSelectedDate(undefined);
        // Show success message
        console.log('Match scheduled successfully:', result.data);
      } else {
        console.error('Failed to schedule match:', result.error);
      }
    } catch (error) {
      console.error('Error scheduling match:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFighterById = (id: string): Fighter | undefined => {
    return fighters.find(fighter => fighter.id === id);
  };

  const getFighterDisplayName = (fighter: Fighter): string => {
    const record = `${fighter.record_wins}-${fighter.record_losses}-${fighter.record_draws}`;
    return `${fighter.name} (${record})`;
  };

  const upcomingMatches = matches.filter(match => 
    new Date(match.date) > new Date() && match.status === 'scheduled'
  ).slice(0, 5);

  if (fightersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading fighters...</p>
        </div>
      </div>
    );
  }

  if (fightersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading fighters</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Schedule Matches</h2>
          <p className="text-muted-foreground">
            Schedule upcoming fights and manage your fight card
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {fighters.length} Active Fighters
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Schedule Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Schedule New Match
            </CardTitle>
            <CardDescription>
              Create a new fight by selecting fighters, venue, and date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Fighter Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="fighter_a_id">Fighter A</Label>
                  <Select
                    value={formData.fighter_a_id}
                    onValueChange={(value) => updateField('fighter_a_id', value)}
                  >
                    <SelectTrigger className={cn(errors.fighter_a_id && "border-destructive")}>
                      <SelectValue placeholder="Select Fighter A" />
                    </SelectTrigger>
                    <SelectContent>
                      {fighters
                        .filter(fighter => !fighter.retired)
                        .map((fighter) => (
                          <SelectItem key={fighter.id} value={fighter.id}>
                            {getFighterDisplayName(fighter)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.fighter_a_id && (
                    <p className="text-sm text-destructive">{errors.fighter_a_id}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fighter_b_id">Fighter B</Label>
                  <Select
                    value={formData.fighter_b_id}
                    onValueChange={(value) => updateField('fighter_b_id', value)}
                  >
                    <SelectTrigger className={cn(errors.fighter_b_id && "border-destructive")}>
                      <SelectValue placeholder="Select Fighter B" />
                    </SelectTrigger>
                    <SelectContent>
                      {fighters
                        .filter(fighter => !fighter.retired && fighter.id !== formData.fighter_a_id)
                        .map((fighter) => (
                          <SelectItem key={fighter.id} value={fighter.id}>
                            {getFighterDisplayName(fighter)}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {errors.fighter_b_id && (
                    <p className="text-sm text-destructive">{errors.fighter_b_id}</p>
                  )}
                </div>
              </div>

              {/* Venue and Date */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    placeholder="Enter venue name"
                    value={formData.venue}
                    onChange={(e) => updateField('venue', e.target.value)}
                    className={cn(errors.venue && "border-destructive")}
                  />
                  {errors.venue && (
                    <p className="text-sm text-destructive">{errors.venue}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground",
                          errors.date && "border-destructive"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.date && (
                    <p className="text-sm text-destructive">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Match Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="scheduled_rounds">Rounds</Label>
                  <Select
                    value={formData.scheduled_rounds.toString()}
                    onValueChange={(value) => updateField('scheduled_rounds', parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4">4 Rounds</SelectItem>
                      <SelectItem value="6">6 Rounds</SelectItem>
                      <SelectItem value="8">8 Rounds</SelectItem>
                      <SelectItem value="10">10 Rounds</SelectItem>
                      <SelectItem value="12">12 Rounds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title_fight">Title Fight</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="title_fight"
                      checked={formData.title_fight}
                      onCheckedChange={(checked) => updateField('title_fight', checked)}
                    />
                    <Label htmlFor="title_fight" className="text-sm">
                      Championship bout
                    </Label>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes about the match..."
                  value={formData.notes}
                  onChange={(e) => updateField('notes', e.target.value)}
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || scheduleLoading}
              >
                {isSubmitting || scheduleLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Scheduling Match...
                  </>
                ) : (
                  'Schedule Match'
                )}
              </Button>

              {scheduleError && (
                <p className="text-sm text-destructive text-center">
                  Error scheduling match. Please try again.
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
              Upcoming Matches
            </CardTitle>
            <CardDescription>
              Recently scheduled fights
            </CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No upcoming matches</p>
                <p className="text-sm text-muted-foreground">
                  Schedule your first match to see it here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingMatches.map((match) => {
                  const fighterA = getFighterById(match.fighter_a_id);
                  const fighterB = getFighterById(match.fighter_b_id);
                  
                  return (
                    <div key={match.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{fighterA?.name}</span>
                          <span className="text-muted-foreground">vs</span>
                          <span className="font-medium">{fighterB?.name}</span>
                          {match.title_fight && (
                            <Badge variant="secondary" className="ml-2">
                              <Trophy className="h-3 w-3 mr-1" />
                              Title
                            </Badge>
                          )}
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
    </div>
  );
};

export default ScheduleTabEnhanced; 
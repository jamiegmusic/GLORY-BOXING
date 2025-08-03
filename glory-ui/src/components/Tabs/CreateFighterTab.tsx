import type { Fighter } from '@/lib/unified-types';
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  UserPlus, 
  Upload, 
  Camera, 
  Globe, 
  Calendar,
  Award,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCreateFighter, useGetFighters, useFormState, validateFighterInput } from '../../hooks/useApolloMutationsSimple';

interface CreateFighterTabProps {
  className?: string;
}

const CreateFighterTab: React.FC<CreateFighterTabProps> = ({ className }) => {
  const { createFighter, loading: createLoading, error: createError } = useCreateFighter();
  const { fighters, loading: fightersLoading, error: fightersError } = useGetFighters();

  const { formData, errors, updateField, setFieldError, clearErrors, resetForm } = useFormState({
    name: '',
    weight_class: '',
    record: '0-0-0',
    nationality: '',
    age: '',
    mugshot_url: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weightClasses = [
    'Strawweight',
    'Flyweight', 
    'Bantamweight',
    'Super Bantamweight',
    'Featherweight',
    'Super Featherweight',
    'Lightweight',
    'Super Lightweight',
    'Welterweight',
    'Super Welterweight',
    'Middleweight',
    'Super Middleweight',
    'Light Heavyweight',
    'Cruiserweight',
    'Heavyweight'
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulate file upload progress
      setUploadProgress(0);
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 100);

      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        updateField('mugshot_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    // Validate form
    const validationErrors = validateFighterInput({
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined
    });

    if (Object.keys(validationErrors).length > 0) {
      Object.entries(validationErrors).forEach(([field, error]) => {
        setFieldError(field as keyof typeof formData, error);
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createFighter({
        name: formData.name,
        weight_class: formData.weight_class,
        record: formData.record,
        nationality: formData.nationality || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        mugshot_url: formData.mugshot_url || undefined
      });

      if (result.success) {
        resetForm();
        setImagePreview('');
        setUploadProgress(0);
        // Show success message
        console.log('Fighter created successfully:', result.data);
      } else {
        console.error('Failed to create fighter:', result.error);
      }
    } catch (error) {
      console.error('Error creating fighter:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const recentFighters = fighters.slice(-5).reverse();

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
          <h2 className="text-3xl font-bold tracking-tight">Create Fighter</h2>
          <p className="text-muted-foreground">
            Add new fighters to your boxing roster
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {fighters.length} Total Fighters
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Create Fighter Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              New Fighter Profile
            </CardTitle>
            <CardDescription>
              Enter fighter details and upload a mugshot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Information */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter fighter's full name"
                    value={formData.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('name', e.target.value)}
                    className={cn(errors.name && "border-destructive")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight_class">Weight Class</Label>
                  <Select
                    value={formData.weight_class}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('weight_class', e.target.value)}
                    className={cn(errors.weight_class && "border-destructive")}
                  >
                    <option value="">Select weight class</option>
                    {weightClasses.map((weightClass) => (
                      <option key={weightClass} value={weightClass}>
                        {weightClass}
                      </option>
                    ))}
                  </Select>
                  {errors.weight_class && (
                    <p className="text-sm text-destructive">{errors.weight_class}</p>
                  )}
                </div>
              </div>

              {/* Record and Nationality */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="record">Record (W-L-D)</Label>
                  <Input
                    id="record"
                    placeholder="0-0-0"
                    value={formData.record}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('record', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: Wins-Losses-Draws
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    placeholder="e.g., USA, Mexico, UK"
                    value={formData.nationality}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('nationality', e.target.value)}
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateField('age', e.target.value)}
                  className={cn(errors.age && "border-destructive")}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age}</p>
                )}
              </div>

              {/* Mugshot Upload */}
              <div className="space-y-4">
                <Label>Mugshot</Label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {/* Image Preview */}
                  <div className="relative">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={imagePreview || formData.mugshot_url} />
                      <AvatarFallback>
                        <Camera className="h-8 w-8" />
                      </AvatarFallback>
                    </Avatar>
                    {imagePreview && (
                      <CheckCircle className="h-5 w-5 text-green-500 absolute -top-1 -right-1" />
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || createLoading}
              >
                {isSubmitting || createLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Fighter...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create Fighter
                  </>
                )}
              </Button>

              {createError && (
                <p className="text-sm text-destructive text-center">
                  Error creating fighter. Please try again.
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Recent Fighters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Recent Fighters
            </CardTitle>
            <CardDescription>
              Recently added fighters to your roster
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentFighters.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No fighters yet</p>
                <p className="text-sm text-muted-foreground">
                  Create your first fighter to see them here
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentFighters.map((fighter: Fighter) => (
                  <div key={fighter.id} className="flex items-center gap-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={fighter.mugshot_url} />
                      <AvatarFallback>
                        {fighter.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{fighter.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs">
                          {fighter.weight_class}
                        </Badge>
                        <span>{fighter.record}</span>
                        {fighter.nationality && (
                          <>
                            <Globe className="h-3 w-3" />
                            <span>{fighter.nationality}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{fighter.age} years</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(fighter.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateFighterTab; 
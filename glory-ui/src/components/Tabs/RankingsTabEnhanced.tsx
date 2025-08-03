import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  TrendingUp, 
  Users, 
  Globe, 
  Award,
  Medal,
  Star,
  Filter,
  Search,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useGetFighters, useGetRankings } from '../../hooks/useApolloMutationsSimple';

interface RankingsTabEnhancedProps {
  className?: string;
}

const RankingsTabEnhanced: React.FC<RankingsTabEnhancedProps> = ({ className }) => {
  const { fighters, loading: fightersLoading, error: fightersError } = useGetFighters();
  const { rankings, loading: rankingsLoading, error: rankingsError } = useGetRankings();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWeightClass, setSelectedWeightClass] = useState<string>('all');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'rank' | 'name' | 'record'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

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

  const organizations = ['WBC', 'WBA', 'IBF', 'WBO', 'The Ring'];

  // Get fighter by ID
  const getFighterById = (id: number) => {
    return fighters.find(fighter => fighter.id === id);
  };

  // Get ranking data for a fighter
  const getFighterRankings = (fighterId: number) => {
    return rankings.filter(ranking => ranking.fighter_id === fighterId);
  };

  // Filter and sort fighters
  const filteredFighters = fighters
    .filter(fighter => {
      const matchesSearch = fighter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           fighter.nationality?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesWeightClass = selectedWeightClass === 'all' || fighter.weight_class === selectedWeightClass;
      return matchesSearch && matchesWeightClass;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'record':
          const aWins = parseInt(a.record.split('-')[0]) || 0;
          const bWins = parseInt(b.record.split('-')[0]) || 0;
          comparison = aWins - bWins;
          break;
        case 'rank':
        default:
          const aRankings = getFighterRankings(a.id);
          const bRankings = getFighterRankings(b.id);
          const aBestRank = Math.min(...aRankings.map(r => r.rank || Infinity));
          const bBestRank = Math.min(...bRankings.map(r => r.rank || Infinity));
          comparison = aBestRank - bBestRank;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getRankingBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500 text-white">🥇 Champion</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400 text-white">🥈 #2</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600 text-white">🥉 #3</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  const getRecordColor = (record: string) => {
    const [wins, losses] = record.split('-').map(Number);
    const total = wins + losses;
    if (total === 0) return 'text-muted-foreground';
    const winRate = wins / total;
    if (winRate >= 0.8) return 'text-green-600 font-semibold';
    if (winRate >= 0.6) return 'text-blue-600';
    if (winRate >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (fightersLoading || rankingsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading rankings...</p>
        </div>
      </div>
    );
  }

  if (fightersError || rankingsError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading rankings</p>
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
          <h2 className="text-3xl font-bold tracking-tight">Fighter Rankings</h2>
          <p className="text-muted-foreground">
            Professional boxing rankings and fighter profiles
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {fighters.length} Fighters
        </Badge>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search fighters..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight-class">Weight Class</Label>
              <Select 
                value={selectedWeightClass} 
                onChange={(e) => setSelectedWeightClass(e.target.value)}
              >
                <option value="all">All Weight Classes</option>
                {weightClasses.map((weightClass) => (
                  <option key={weightClass} value={weightClass}>
                    {weightClass}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Select 
                value={selectedOrganization} 
                onChange={(e) => setSelectedOrganization(e.target.value)}
              >
                <option value="all">All Organizations</option>
                {organizations.map((org) => (
                  <option key={org} value={org}>
                    {org}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort">Sort By</Label>
              <div className="flex gap-2">
                <Select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value as 'rank' | 'name' | 'record')}
                  className="flex-1"
                >
                  <option value="rank">Rank</option>
                  <option value="name">Name</option>
                  <option value="record">Record</option>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                >
                  {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rankings Display */}
      <Tabs defaultValue="grid" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="grid" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Grid View
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            List View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grid" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFighters.map((fighter) => {
              const fighterRankings = getFighterRankings(fighter.id);
              const bestRanking = fighterRankings.length > 0 
                ? fighterRankings.reduce((min, r) => r.rank < min.rank ? r : min)
                : null;

              return (
                <Card key={fighter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Avatar className="h-32 w-32">
                        <AvatarImage src={fighter.mugshot_url} />
                        <AvatarFallback className="text-2xl">
                          {fighter.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {bestRanking && (
                      <div className="absolute top-2 right-2">
                        {getRankingBadge(bestRanking.rank)}
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg">{fighter.name}</h3>
                        <p className="text-sm text-muted-foreground">{fighter.weight_class}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className={cn("text-sm font-medium", getRecordColor(fighter.record))}>
                          {fighter.record}
                        </span>
                        {fighter.nationality && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Globe className="h-3 w-3" />
                            {fighter.nationality}
                          </div>
                        )}
                      </div>

                      {fighterRankings.length > 0 && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Rankings:</p>
                          <div className="flex flex-wrap gap-1">
                            {fighterRankings.slice(0, 3).map((ranking) => (
                              <Badge key={ranking.id} variant="secondary" className="text-xs">
                                {ranking.organization} #{ranking.rank}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{fighter.age} years old</span>
                        <span>{new Date(fighter.created_at).getFullYear()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Fighter Rankings List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredFighters.map((fighter, index) => {
                  const fighterRankings = getFighterRankings(fighter.id);
                  const bestRanking = fighterRankings.length > 0 
                    ? fighterRankings.reduce((min, r) => r.rank < min.rank ? r : min)
                    : null;

                  return (
                    <div key={fighter.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={fighter.mugshot_url} />
                          <AvatarFallback>
                            {fighter.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg truncate">{fighter.name}</h3>
                          {bestRanking && getRankingBadge(bestRanking.rank)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="font-medium">{fighter.weight_class}</span>
                          <span className={cn("font-medium", getRecordColor(fighter.record))}>
                            {fighter.record}
                          </span>
                          {fighter.nationality && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              <span>{fighter.nationality}</span>
                            </div>
                          )}
                        </div>

                        {fighterRankings.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {fighterRankings.map((ranking) => (
                              <Badge key={ranking.id} variant="outline" className="text-xs">
                                {ranking.organization} #{ranking.rank}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm font-medium">{fighter.age} years</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(fighter.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {filteredFighters.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No fighters found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RankingsTabEnhanced; 
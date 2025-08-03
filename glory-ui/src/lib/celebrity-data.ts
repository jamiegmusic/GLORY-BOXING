import { Celebrity, CelebrityIndustryValue } from './unified-types';

// Real celebrity data for demo purposes
export const DEMO_CELEBRITIES: Celebrity[] = [
  {
    id: 'celeb_1',
    name: 'Emma Stone',
    age: 35,
    nationality: 'American',
    hometown: 'Scottsdale, Arizona',
    primary_industry: 'acting' as CelebrityIndustryValue,
    secondary_industries: ['modeling' as CelebrityIndustryValue],
    net_worth: 40000000,
    popularity: 92,
    experience: 85,
    fan_base_size: 15000000,
    energy_level: 85,
    stress_level: 30,
    physical_health: 90,
    mental_health: 85,
    public_image: 95,
    media_sentiment: 'positive',
    business_skills: {
      negotiation: 85,
      marketing: 80,
      branding: 90,
      networking: 88,
      financial_management: 75
    },
    personality_traits: {
      charisma: 90,
      professionalism: 95,
      creativity: 88,
      ambition: 85,
      resilience: 90
    },
    debut_date: new Date('2004-01-01'),
    ranking: 8,
    industry_ranking: 12,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'celeb_2',
    name: 'Drake',
    age: 37,
    nationality: 'Canadian',
    hometown: 'Toronto, Ontario',
    primary_industry: 'music' as CelebrityIndustryValue,
    secondary_industries: ['acting' as CelebrityIndustryValue, 'business' as CelebrityIndustryValue],
    net_worth: 250000000,
    popularity: 98,
    experience: 90,
    fan_base_size: 50000000,
    energy_level: 80,
    stress_level: 40,
    physical_health: 85,
    mental_health: 80,
    public_image: 88,
    media_sentiment: 'positive',
    business_skills: {
      negotiation: 95,
      marketing: 98,
      branding: 100,
      networking: 92,
      financial_management: 90
    },
    personality_traits: {
      charisma: 95,
      professionalism: 88,
      creativity: 95,
      ambition: 98,
      resilience: 85
    },
    debut_date: new Date('2006-01-01'),
    ranking: 3,
    industry_ranking: 1,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'celeb_3',
    name: 'Serena Williams',
    age: 42,
    nationality: 'American',
    hometown: 'Saginaw, Michigan',
    primary_industry: 'sports' as CelebrityIndustryValue,
    secondary_industries: ['business' as CelebrityIndustryValue, 'modeling' as CelebrityIndustryValue],
    net_worth: 300000000,
    popularity: 95,
    experience: 98,
    fan_base_size: 25000000,
    energy_level: 90,
    stress_level: 25,
    physical_health: 95,
    mental_health: 90,
    public_image: 98,
    media_sentiment: 'positive',
    business_skills: {
      negotiation: 90,
      marketing: 85,
      branding: 95,
      networking: 88,
      financial_management: 92
    },
    personality_traits: {
      charisma: 92,
      professionalism: 98,
      creativity: 80,
      ambition: 100,
      resilience: 100
    },
    debut_date: new Date('1995-01-01'),
    ranking: 5,
    industry_ranking: 2,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Export individual celebrities for easier access
export const [EMMA_STONE, DRAKE, SERENA_WILLIAMS] = DEMO_CELEBRITIES;

// Helper function to get celebrity by ID
export const getCelebrityById = (id: string): Celebrity | undefined => {
  return DEMO_CELEBRITIES.find(celeb => celeb.id === id);
};

// Helper function to get celebrities by industry
export const getCelebritiesByIndustry = (industry: CelebrityIndustryValue): Celebrity[] => {
  return DEMO_CELEBRITIES.filter(celeb => 
    celeb.primary_industry === industry || 
    celeb.secondary_industries.includes(industry)
  );
};

// Helper function to get top celebrities by popularity
export const getTopCelebritiesByPopularity = (limit: number = 10): Celebrity[] => {
  return [...DEMO_CELEBRITIES]
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

// Helper function to get celebrities by net worth
export const getCelebritiesByNetWorth = (minNetWorth: number): Celebrity[] => {
  return DEMO_CELEBRITIES.filter(celeb => (celeb.net_worth || 0) >= minNetWorth);
}; 
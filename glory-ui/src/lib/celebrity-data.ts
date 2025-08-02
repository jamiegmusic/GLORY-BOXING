// Real Celebrity Data for Glory Boxing Manager
// This file contains real celebrities with their stats and career information

import type {
  Celebrity,
  CelebrityIndustryValue,
  ActingSkills,
  MusicSkills,
  SportsSkills,
  SocialMediaSkills,
  BusinessSkills,
  PersonalityTraits,
  VoiceProfile
} from './unified-types';

// ===== REAL CELEBRITY DATA =====

export const REAL_CELEBRITIES: Omit<Celebrity, 'id' | 'created_at' | 'updated_at'>[] = [
  // ===== ACTING INDUSTRY =====
  {
    name: 'Tom Hanks',
    age: 67,
    nationality: 'American',
    primary_industry: 'acting' as CelebrityIndustryValue,
    secondary_industries: ['business', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('1980-01-01'),
    nickname: 'America\'s Dad',
    hometown: 'Concord, California',
    region: 'North America',
    popularity: 95,
    experience: 45,
    ranking: 1,
    industry_ranking: 1,
    net_worth: 400000000,
    physical_health: 85,
    mental_health: 90,
    stress_level: 20,
    energy_level: 80,
    public_image: 95,
    fan_base_size: 50000000,
    media_sentiment: 'positive',
    acting_skills: {
      dramatic_acting: 95,
      comedic_acting: 90,
      method_acting: 88,
      voice_acting: 85,
      stage_presence: 92,
      emotional_range: 95,
      accent_work: 85,
      improvisation: 80,
      chemistry_with_co_stars: 95,
      audition_skills: 90
    },
    business_skills: {
      entrepreneurship: 75,
      investment_acumen: 80,
      negotiation: 85,
      strategic_planning: 80,
      brand_management: 85,
      financial_literacy: 80,
      market_analysis: 75,
      networking: 90,
      risk_management: 85,
      innovation: 80
    },
    personality_traits: {
      confidence: 90,
      aggression: 30,
      intelligence: 95,
      charisma: 95,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'tom_hanks_voice',
      voice_name: 'Tom Hanks',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['warm', 'trustworthy', 'versatile', 'expressive']
    }
  },
  {
    name: 'Meryl Streep',
    age: 74,
    nationality: 'American',
    primary_industry: 'acting' as CelebrityIndustryValue,
    secondary_industries: ['business'] as CelebrityIndustryValue[],
    debut_date: new Date('1975-01-01'),
    nickname: 'The Queen of Acting',
    hometown: 'Summit, New Jersey',
    region: 'North America',
    popularity: 92,
    experience: 48,
    ranking: 2,
    industry_ranking: 2,
    net_worth: 160000000,
    physical_health: 80,
    mental_health: 90,
    stress_level: 25,
    energy_level: 75,
    public_image: 95,
    fan_base_size: 30000000,
    media_sentiment: 'positive',
    acting_skills: {
      dramatic_acting: 98,
      comedic_acting: 85,
      method_acting: 95,
      voice_acting: 80,
      stage_presence: 90,
      emotional_range: 98,
      accent_work: 95,
      improvisation: 85,
      chemistry_with_co_stars: 90,
      audition_skills: 95
    },
    business_skills: {
      entrepreneurship: 70,
      investment_acumen: 75,
      negotiation: 80,
      strategic_planning: 75,
      brand_management: 80,
      financial_literacy: 75,
      market_analysis: 70,
      networking: 85,
      risk_management: 80,
      innovation: 75
    },
    personality_traits: {
      confidence: 95,
      aggression: 20,
      intelligence: 98,
      charisma: 90,
      work_ethic: 98
    },
    voice_profile: {
      voice_id: 'meryl_streep_voice',
      voice_name: 'Meryl Streep',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['versatile', 'expressive', 'accent_master', 'dramatic']
    }
  },
  {
    name: 'Leonardo DiCaprio',
    age: 49,
    nationality: 'American',
    primary_industry: 'acting' as CelebrityIndustryValue,
    secondary_industries: ['business', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('1989-01-01'),
    nickname: 'Leo',
    hometown: 'Los Angeles, California',
    region: 'North America',
    popularity: 94,
    experience: 34,
    ranking: 3,
    industry_ranking: 3,
    net_worth: 300000000,
    physical_health: 85,
    mental_health: 85,
    stress_level: 30,
    energy_level: 80,
    public_image: 90,
    fan_base_size: 45000000,
    media_sentiment: 'positive',
    acting_skills: {
      dramatic_acting: 95,
      comedic_acting: 80,
      method_acting: 90,
      voice_acting: 75,
      stage_presence: 88,
      emotional_range: 92,
      accent_work: 85,
      improvisation: 80,
      chemistry_with_co_stars: 90,
      audition_skills: 88
    },
    business_skills: {
      entrepreneurship: 85,
      investment_acumen: 90,
      negotiation: 85,
      strategic_planning: 80,
      brand_management: 85,
      financial_literacy: 85,
      market_analysis: 80,
      networking: 90,
      risk_management: 85,
      innovation: 85
    },
    personality_traits: {
      confidence: 90,
      aggression: 40,
      intelligence: 90,
      charisma: 92,
      work_ethic: 90
    },
    voice_profile: {
      voice_id: 'leonardo_dicaprio_voice',
      voice_name: 'Leonardo DiCaprio',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['intense', 'passionate', 'charismatic', 'expressive']
    }
  },

  // ===== MUSIC INDUSTRY =====
  {
    name: 'Taylor Swift',
    age: 34,
    nationality: 'American',
    primary_industry: 'music' as CelebrityIndustryValue,
    secondary_industries: ['acting', 'business', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('2006-01-01'),
    nickname: 'T-Swift',
    hometown: 'Reading, Pennsylvania',
    region: 'North America',
    popularity: 98,
    experience: 18,
    ranking: 1,
    industry_ranking: 1,
    net_worth: 1100000000,
    physical_health: 90,
    mental_health: 85,
    stress_level: 35,
    energy_level: 95,
    public_image: 85,
    fan_base_size: 80000000,
    media_sentiment: 'positive',
    music_skills: {
      vocal_ability: 90,
      instrumental_skill: 75,
      songwriting: 95,
      stage_performance: 95,
      studio_recording: 90,
      musical_theory: 80,
      genre_versatility: 90,
      live_performance: 95,
      collaboration: 85,
      music_production: 80
    },
    social_media_skills: {
      content_creation: 95,
      audience_engagement: 98,
      trend_awareness: 95,
      platform_mastery: 95,
      viral_potential: 95,
      brand_voice: 90,
      community_building: 95,
      crisis_management: 85,
      monetization: 95,
      authenticity: 90
    },
    business_skills: {
      entrepreneurship: 90,
      investment_acumen: 85,
      negotiation: 90,
      strategic_planning: 95,
      brand_management: 95,
      financial_literacy: 90,
      market_analysis: 85,
      networking: 90,
      risk_management: 85,
      innovation: 90
    },
    personality_traits: {
      confidence: 95,
      aggression: 60,
      intelligence: 90,
      charisma: 95,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'taylor_swift_voice',
      voice_name: 'Taylor Swift',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['clear', 'expressive', 'versatile', 'emotional']
    }
  },
  {
    name: 'Drake',
    age: 37,
    nationality: 'Canadian',
    primary_industry: 'music' as CelebrityIndustryValue,
    secondary_industries: ['acting', 'business', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('2006-01-01'),
    nickname: 'Drizzy',
    hometown: 'Toronto, Ontario',
    region: 'North America',
    popularity: 96,
    experience: 18,
    ranking: 2,
    industry_ranking: 2,
    net_worth: 250000000,
    physical_health: 85,
    mental_health: 80,
    stress_level: 40,
    energy_level: 90,
    public_image: 80,
    fan_base_size: 70000000,
    media_sentiment: 'positive',
    music_skills: {
      vocal_ability: 85,
      instrumental_skill: 70,
      songwriting: 90,
      stage_performance: 90,
      studio_recording: 95,
      musical_theory: 75,
      genre_versatility: 85,
      live_performance: 90,
      collaboration: 90,
      music_production: 85
    },
    social_media_skills: {
      content_creation: 90,
      audience_engagement: 95,
      trend_awareness: 95,
      platform_mastery: 90,
      viral_potential: 95,
      brand_voice: 85,
      community_building: 90,
      crisis_management: 75,
      monetization: 90,
      authenticity: 80
    },
    business_skills: {
      entrepreneurship: 85,
      investment_acumen: 80,
      negotiation: 85,
      strategic_planning: 80,
      brand_management: 85,
      financial_literacy: 80,
      market_analysis: 75,
      networking: 90,
      risk_management: 80,
      innovation: 85
    },
    personality_traits: {
      confidence: 95,
      aggression: 70,
      intelligence: 85,
      charisma: 95,
      work_ethic: 90
    },
    voice_profile: {
      voice_id: 'drake_voice',
      voice_name: 'Drake',
      accent: 'Canadian',
      language: 'English',
      voice_characteristics: ['smooth', 'confident', 'versatile', 'charismatic']
    }
  },
  {
    name: 'Beyoncé',
    age: 42,
    nationality: 'American',
    primary_industry: 'music' as CelebrityIndustryValue,
    secondary_industries: ['acting', 'business', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('1997-01-01'),
    nickname: 'Queen Bey',
    hometown: 'Houston, Texas',
    region: 'North America',
    popularity: 97,
    experience: 27,
    ranking: 3,
    industry_ranking: 3,
    net_worth: 500000000,
    physical_health: 95,
    mental_health: 85,
    stress_level: 30,
    energy_level: 95,
    public_image: 90,
    fan_base_size: 75000000,
    media_sentiment: 'positive',
    music_skills: {
      vocal_ability: 98,
      instrumental_skill: 80,
      songwriting: 85,
      stage_performance: 98,
      studio_recording: 95,
      musical_theory: 85,
      genre_versatility: 90,
      live_performance: 98,
      collaboration: 90,
      music_production: 85
    },
    social_media_skills: {
      content_creation: 85,
      audience_engagement: 90,
      trend_awareness: 90,
      platform_mastery: 85,
      viral_potential: 90,
      brand_voice: 95,
      community_building: 90,
      crisis_management: 90,
      monetization: 90,
      authenticity: 95
    },
    business_skills: {
      entrepreneurship: 90,
      investment_acumen: 85,
      negotiation: 90,
      strategic_planning: 90,
      brand_management: 95,
      financial_literacy: 85,
      market_analysis: 80,
      networking: 90,
      risk_management: 85,
      innovation: 90
    },
    personality_traits: {
      confidence: 98,
      aggression: 50,
      intelligence: 90,
      charisma: 98,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'beyonce_voice',
      voice_name: 'Beyoncé',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['powerful', 'soulful', 'versatile', 'commanding']
    }
  },

  // ===== SPORTS INDUSTRY =====
  {
    name: 'LeBron James',
    age: 39,
    nationality: 'American',
    primary_industry: 'sports' as CelebrityIndustryValue,
    secondary_industries: ['business', 'acting', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('2003-01-01'),
    nickname: 'King James',
    hometown: 'Akron, Ohio',
    region: 'North America',
    popularity: 95,
    experience: 21,
    ranking: 1,
    industry_ranking: 1,
    net_worth: 1000000000,
    physical_health: 90,
    mental_health: 85,
    stress_level: 35,
    energy_level: 90,
    public_image: 85,
    fan_base_size: 60000000,
    media_sentiment: 'positive',
    sports_skills: {
      athletic_ability: 95,
      technical_skill: 90,
      mental_toughness: 95,
      teamwork: 90,
      leadership: 95,
      strategic_thinking: 90,
      physical_endurance: 95,
      competitive_spirit: 95,
      injury_recovery: 90,
      peak_performance: 95
    },
    business_skills: {
      entrepreneurship: 90,
      investment_acumen: 85,
      negotiation: 90,
      strategic_planning: 85,
      brand_management: 90,
      financial_literacy: 85,
      market_analysis: 80,
      networking: 90,
      risk_management: 85,
      innovation: 85
    },
    social_media_skills: {
      content_creation: 85,
      audience_engagement: 90,
      trend_awareness: 85,
      platform_mastery: 85,
      viral_potential: 90,
      brand_voice: 85,
      community_building: 90,
      crisis_management: 80,
      monetization: 90,
      authenticity: 85
    },
    personality_traits: {
      confidence: 95,
      aggression: 70,
      intelligence: 90,
      charisma: 95,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'lebron_james_voice',
      voice_name: 'LeBron James',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['deep', 'confident', 'leadership', 'charismatic']
    }
  },
  {
    name: 'Cristiano Ronaldo',
    age: 39,
    nationality: 'Portuguese',
    primary_industry: 'sports' as CelebrityIndustryValue,
    secondary_industries: ['business', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('2002-01-01'),
    nickname: 'CR7',
    hometown: 'Funchal, Madeira',
    region: 'Europe',
    popularity: 98,
    experience: 22,
    ranking: 2,
    industry_ranking: 2,
    net_worth: 500000000,
    physical_health: 95,
    mental_health: 90,
    stress_level: 30,
    energy_level: 95,
    public_image: 85,
    fan_base_size: 80000000,
    media_sentiment: 'positive',
    sports_skills: {
      athletic_ability: 98,
      technical_skill: 95,
      mental_toughness: 95,
      teamwork: 90,
      leadership: 90,
      strategic_thinking: 90,
      physical_endurance: 95,
      competitive_spirit: 98,
      injury_recovery: 90,
      peak_performance: 95
    },
    business_skills: {
      entrepreneurship: 85,
      investment_acumen: 80,
      negotiation: 85,
      strategic_planning: 80,
      brand_management: 90,
      financial_literacy: 80,
      market_analysis: 75,
      networking: 90,
      risk_management: 80,
      innovation: 85
    },
    social_media_skills: {
      content_creation: 90,
      audience_engagement: 95,
      trend_awareness: 90,
      platform_mastery: 90,
      viral_potential: 95,
      brand_voice: 85,
      community_building: 90,
      crisis_management: 80,
      monetization: 90,
      authenticity: 85
    },
    personality_traits: {
      confidence: 98,
      aggression: 80,
      intelligence: 85,
      charisma: 95,
      work_ethic: 98
    },
    voice_profile: {
      voice_id: 'cristiano_ronaldo_voice',
      voice_name: 'Cristiano Ronaldo',
      accent: 'Portuguese',
      language: 'Portuguese, English',
      voice_characteristics: ['confident', 'passionate', 'determined', 'charismatic']
    }
  },
  {
    name: 'Serena Williams',
    age: 42,
    nationality: 'American',
    primary_industry: 'sports' as CelebrityIndustryValue,
    secondary_industries: ['business', 'acting', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('1995-01-01'),
    nickname: 'Queen of Tennis',
    hometown: 'Saginaw, Michigan',
    region: 'North America',
    popularity: 90,
    experience: 29,
    ranking: 3,
    industry_ranking: 3,
    net_worth: 250000000,
    physical_health: 85,
    mental_health: 90,
    stress_level: 25,
    energy_level: 85,
    public_image: 90,
    fan_base_size: 40000000,
    media_sentiment: 'positive',
    sports_skills: {
      athletic_ability: 95,
      technical_skill: 95,
      mental_toughness: 95,
      teamwork: 80,
      leadership: 90,
      strategic_thinking: 90,
      physical_endurance: 90,
      competitive_spirit: 95,
      injury_recovery: 85,
      peak_performance: 95
    },
    business_skills: {
      entrepreneurship: 85,
      investment_acumen: 80,
      negotiation: 85,
      strategic_planning: 80,
      brand_management: 85,
      financial_literacy: 80,
      market_analysis: 75,
      networking: 85,
      risk_management: 80,
      innovation: 85
    },
    social_media_skills: {
      content_creation: 80,
      audience_engagement: 85,
      trend_awareness: 80,
      platform_mastery: 80,
      viral_potential: 85,
      brand_voice: 85,
      community_building: 85,
      crisis_management: 85,
      monetization: 85,
      authenticity: 90
    },
    personality_traits: {
      confidence: 95,
      aggression: 75,
      intelligence: 90,
      charisma: 90,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'serena_williams_voice',
      voice_name: 'Serena Williams',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['powerful', 'confident', 'determined', 'inspirational']
    }
  },

  // ===== SOCIAL MEDIA INDUSTRY =====
  {
    name: 'Kylie Jenner',
    age: 26,
    nationality: 'American',
    primary_industry: 'social_media' as CelebrityIndustryValue,
    secondary_industries: ['business', 'modeling', 'reality_tv'] as CelebrityIndustryValue[],
    debut_date: new Date('2007-01-01'),
    nickname: 'Kylie',
    hometown: 'Los Angeles, California',
    region: 'North America',
    popularity: 92,
    experience: 17,
    ranking: 1,
    industry_ranking: 1,
    net_worth: 680000000,
    physical_health: 85,
    mental_health: 80,
    stress_level: 45,
    energy_level: 90,
    public_image: 80,
    fan_base_size: 350000000,
    media_sentiment: 'mixed',
    social_media_skills: {
      content_creation: 95,
      audience_engagement: 98,
      trend_awareness: 95,
      platform_mastery: 95,
      viral_potential: 95,
      brand_voice: 90,
      community_building: 95,
      crisis_management: 75,
      monetization: 95,
      authenticity: 70
    },
    business_skills: {
      entrepreneurship: 90,
      investment_acumen: 85,
      negotiation: 85,
      strategic_planning: 80,
      brand_management: 95,
      financial_literacy: 80,
      market_analysis: 75,
      networking: 90,
      risk_management: 80,
      innovation: 85
    },
    personality_traits: {
      confidence: 90,
      aggression: 60,
      intelligence: 80,
      charisma: 90,
      work_ethic: 85
    },
    voice_profile: {
      voice_id: 'kylie_jenner_voice',
      voice_name: 'Kylie Jenner',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['young', 'trendy', 'confident', 'influential']
    }
  },
  {
    name: 'MrBeast',
    age: 25,
    nationality: 'American',
    primary_industry: 'social_media' as CelebrityIndustryValue,
    secondary_industries: ['business', 'technology'] as CelebrityIndustryValue[],
    debut_date: new Date('2012-01-01'),
    nickname: 'MrBeast',
    hometown: 'Greenville, North Carolina',
    region: 'North America',
    popularity: 90,
    experience: 12,
    ranking: 2,
    industry_ranking: 2,
    net_worth: 500000000,
    physical_health: 90,
    mental_health: 85,
    stress_level: 40,
    energy_level: 95,
    public_image: 90,
    fan_base_size: 200000000,
    media_sentiment: 'positive',
    social_media_skills: {
      content_creation: 98,
      audience_engagement: 95,
      trend_awareness: 95,
      platform_mastery: 95,
      viral_potential: 98,
      brand_voice: 90,
      community_building: 95,
      crisis_management: 85,
      monetization: 95,
      authenticity: 90
    },
    business_skills: {
      entrepreneurship: 95,
      investment_acumen: 85,
      negotiation: 85,
      strategic_planning: 90,
      brand_management: 90,
      financial_literacy: 85,
      market_analysis: 80,
      networking: 90,
      risk_management: 85,
      innovation: 95
    },
    personality_traits: {
      confidence: 95,
      aggression: 40,
      intelligence: 90,
      charisma: 95,
      work_ethic: 98
    },
    voice_profile: {
      voice_id: 'mrbeast_voice',
      voice_name: 'MrBeast',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['energetic', 'enthusiastic', 'charismatic', 'engaging']
    }
  },
  {
    name: 'Charli D\'Amelio',
    age: 19,
    nationality: 'American',
    primary_industry: 'social_media' as CelebrityIndustryValue,
    secondary_industries: ['dancing', 'acting'] as CelebrityIndustryValue[],
    debut_date: new Date('2019-01-01'),
    nickname: 'Charli',
    hometown: 'Norwalk, Connecticut',
    region: 'North America',
    popularity: 88,
    experience: 5,
    ranking: 3,
    industry_ranking: 3,
    net_worth: 20000000,
    physical_health: 90,
    mental_health: 80,
    stress_level: 50,
    energy_level: 95,
    public_image: 75,
    fan_base_size: 150000000,
    media_sentiment: 'mixed',
    social_media_skills: {
      content_creation: 95,
      audience_engagement: 90,
      trend_awareness: 95,
      platform_mastery: 95,
      viral_potential: 95,
      brand_voice: 85,
      community_building: 90,
      crisis_management: 70,
      monetization: 85,
      authenticity: 80
    },
    business_skills: {
      entrepreneurship: 75,
      investment_acumen: 70,
      negotiation: 75,
      strategic_planning: 70,
      brand_management: 80,
      financial_literacy: 70,
      market_analysis: 65,
      networking: 80,
      risk_management: 70,
      innovation: 80
    },
    personality_traits: {
      confidence: 85,
      aggression: 30,
      intelligence: 80,
      charisma: 90,
      work_ethic: 85
    },
    voice_profile: {
      voice_id: 'charli_damelio_voice',
      voice_name: 'Charli D\'Amelio',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['young', 'energetic', 'trendy', 'relatable']
    }
  },

  // ===== BUSINESS INDUSTRY =====
  {
    name: 'Elon Musk',
    age: 52,
    nationality: 'American',
    primary_industry: 'business' as CelebrityIndustryValue,
    secondary_industries: ['technology', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('1995-01-01'),
    nickname: 'The Real Iron Man',
    hometown: 'Pretoria, South Africa',
    region: 'North America',
    popularity: 95,
    experience: 29,
    ranking: 1,
    industry_ranking: 1,
    net_worth: 200000000000,
    physical_health: 80,
    mental_health: 75,
    stress_level: 60,
    energy_level: 90,
    public_image: 70,
    fan_base_size: 100000000,
    media_sentiment: 'mixed',
    business_skills: {
      entrepreneurship: 98,
      investment_acumen: 95,
      negotiation: 90,
      strategic_planning: 95,
      brand_management: 85,
      financial_literacy: 95,
      market_analysis: 95,
      networking: 90,
      risk_management: 90,
      innovation: 98
    },
    social_media_skills: {
      content_creation: 85,
      audience_engagement: 90,
      trend_awareness: 90,
      platform_mastery: 85,
      viral_potential: 95,
      brand_voice: 80,
      community_building: 85,
      crisis_management: 60,
      monetization: 90,
      authenticity: 70
    },
    personality_traits: {
      confidence: 95,
      aggression: 80,
      intelligence: 95,
      charisma: 85,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'elon_musk_voice',
      voice_name: 'Elon Musk',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['confident', 'technical', 'visionary', 'direct']
    }
  },
  {
    name: 'Oprah Winfrey',
    age: 70,
    nationality: 'American',
    primary_industry: 'business' as CelebrityIndustryValue,
    secondary_industries: ['acting', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('1973-01-01'),
    nickname: 'The Queen of All Media',
    hometown: 'Kosciusko, Mississippi',
    region: 'North America',
    popularity: 95,
    experience: 51,
    ranking: 2,
    industry_ranking: 2,
    net_worth: 2500000000,
    physical_health: 85,
    mental_health: 90,
    stress_level: 25,
    energy_level: 85,
    public_image: 95,
    fan_base_size: 50000000,
    media_sentiment: 'positive',
    business_skills: {
      entrepreneurship: 95,
      investment_acumen: 90,
      negotiation: 95,
      strategic_planning: 95,
      brand_management: 98,
      financial_literacy: 90,
      market_analysis: 85,
      networking: 95,
      risk_management: 90,
      innovation: 90
    },
    social_media_skills: {
      content_creation: 85,
      audience_engagement: 95,
      trend_awareness: 85,
      platform_mastery: 80,
      viral_potential: 90,
      brand_voice: 95,
      community_building: 95,
      crisis_management: 95,
      monetization: 90,
      authenticity: 95
    },
    personality_traits: {
      confidence: 98,
      aggression: 30,
      intelligence: 95,
      charisma: 98,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'oprah_winfrey_voice',
      voice_name: 'Oprah Winfrey',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['warm', 'authoritative', 'inspirational', 'empathetic']
    }
  },
  {
    name: 'Mark Zuckerberg',
    age: 40,
    nationality: 'American',
    primary_industry: 'business' as CelebrityIndustryValue,
    secondary_industries: ['technology', 'social_media'] as CelebrityIndustryValue[],
    debut_date: new Date('2004-01-01'),
    nickname: 'Zuck',
    hometown: 'White Plains, New York',
    region: 'North America',
    popularity: 85,
    experience: 20,
    ranking: 3,
    industry_ranking: 3,
    net_worth: 100000000000,
    physical_health: 85,
    mental_health: 80,
    stress_level: 55,
    energy_level: 90,
    public_image: 70,
    fan_base_size: 50000000,
    media_sentiment: 'mixed',
    business_skills: {
      entrepreneurship: 95,
      investment_acumen: 90,
      negotiation: 85,
      strategic_planning: 95,
      brand_management: 85,
      financial_literacy: 90,
      market_analysis: 95,
      networking: 85,
      risk_management: 85,
      innovation: 95
    },
    social_media_skills: {
      content_creation: 75,
      audience_engagement: 80,
      trend_awareness: 95,
      platform_mastery: 98,
      viral_potential: 90,
      brand_voice: 75,
      community_building: 90,
      crisis_management: 70,
      monetization: 95,
      authenticity: 70
    },
    personality_traits: {
      confidence: 90,
      aggression: 60,
      intelligence: 95,
      charisma: 75,
      work_ethic: 95
    },
    voice_profile: {
      voice_id: 'mark_zuckerberg_voice',
      voice_name: 'Mark Zuckerberg',
      accent: 'American',
      language: 'English',
      voice_characteristics: ['technical', 'measured', 'analytical', 'focused']
    }
  }
];

// ===== DEFAULT CELEBRITY CONFIGURATIONS =====

export const DEFAULT_CELEBRITY_STATS = {
  popularity: 50,
  experience: 0,
  ranking: 0,
  industry_ranking: 0,
  net_worth: 0,
  physical_health: 100,
  mental_health: 100,
  stress_level: 0,
  energy_level: 100,
  public_image: 50,
  fan_base_size: 0,
  media_sentiment: 'neutral' as const,
  injuries: [],
  is_injured: false
};

export const DEFAULT_PERSONALITY_TRAITS: PersonalityTraits = {
  confidence: 50,
  aggression: 50,
  intelligence: 50,
  charisma: 50,
  work_ethic: 50
};

export const DEFAULT_ACTING_SKILLS: ActingSkills = {
  dramatic_acting: 50,
  comedic_acting: 50,
  method_acting: 50,
  voice_acting: 50,
  stage_presence: 50,
  emotional_range: 50,
  accent_work: 50,
  improvisation: 50,
  chemistry_with_co_stars: 50,
  audition_skills: 50
};

export const DEFAULT_MUSIC_SKILLS: MusicSkills = {
  vocal_ability: 50,
  instrumental_skill: 50,
  songwriting: 50,
  stage_performance: 50,
  studio_recording: 50,
  musical_theory: 50,
  genre_versatility: 50,
  live_performance: 50,
  collaboration: 50,
  music_production: 50
};

export const DEFAULT_SPORTS_SKILLS: SportsSkills = {
  athletic_ability: 50,
  technical_skill: 50,
  mental_toughness: 50,
  teamwork: 50,
  leadership: 50,
  strategic_thinking: 50,
  physical_endurance: 50,
  competitive_spirit: 50,
  injury_recovery: 50,
  peak_performance: 50
};

export const DEFAULT_SOCIAL_MEDIA_SKILLS: SocialMediaSkills = {
  content_creation: 50,
  audience_engagement: 50,
  trend_awareness: 50,
  platform_mastery: 50,
  viral_potential: 50,
  brand_voice: 50,
  community_building: 50,
  crisis_management: 50,
  monetization: 50,
  authenticity: 50
};

export const DEFAULT_BUSINESS_SKILLS: BusinessSkills = {
  entrepreneurship: 50,
  investment_acumen: 50,
  negotiation: 50,
  strategic_planning: 50,
  brand_management: 50,
  financial_literacy: 50,
  market_analysis: 50,
  networking: 50,
  risk_management: 50,
  innovation: 50
};

// ===== INDUSTRY CONFIGURATIONS =====

export const INDUSTRY_WEIGHT_CLASSES = {
  acting: {
    beginner: { min: 0, max: 25, name: 'Amateur Actor' },
    intermediate: { min: 26, max: 50, name: 'Supporting Actor' },
    advanced: { min: 51, max: 75, name: 'Lead Actor' },
    expert: { min: 76, max: 100, name: 'A-List Star' }
  },
  music: {
    beginner: { min: 0, max: 25, name: 'Local Musician' },
    intermediate: { min: 26, max: 50, name: 'Recording Artist' },
    advanced: { min: 51, max: 75, name: 'Chart Topper' },
    expert: { min: 76, max: 100, name: 'Music Icon' }
  },
  sports: {
    beginner: { min: 0, max: 25, name: 'Amateur Athlete' },
    intermediate: { min: 26, max: 50, name: 'Professional Athlete' },
    advanced: { min: 51, max: 75, name: 'Champion' },
    expert: { min: 76, max: 100, name: 'Legend' }
  },
  social_media: {
    beginner: { min: 0, max: 25, name: 'Content Creator' },
    intermediate: { min: 26, max: 50, name: 'Influencer' },
    advanced: { min: 51, max: 75, name: 'Viral Star' },
    expert: { min: 76, max: 100, name: 'Digital Icon' }
  },
  business: {
    beginner: { min: 0, max: 25, name: 'Entrepreneur' },
    intermediate: { min: 26, max: 50, name: 'Business Leader' },
    advanced: { min: 51, max: 75, name: 'Industry Mogul' },
    expert: { min: 76, max: 100, name: 'Billionaire' }
  }
};

// ===== UTILITY FUNCTIONS =====

export const getRandomCelebrity = (): Omit<Celebrity, 'id' | 'created_at' | 'updated_at'> => {
  const randomIndex = Math.floor(Math.random() * REAL_CELEBRITIES.length);
  return REAL_CELEBRITIES[randomIndex];
};

export const getCelebritiesByIndustry = (industry: CelebrityIndustryValue): Omit<Celebrity, 'id' | 'created_at' | 'updated_at'>[] => {
  return REAL_CELEBRITIES.filter(celebrity => 
    celebrity.primary_industry === industry || 
    celebrity.secondary_industries.includes(industry)
  );
};

export const getTopCelebrities = (limit: number = 10): Omit<Celebrity, 'id' | 'created_at' | 'updated_at'>[] => {
  return REAL_CELEBRITIES
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, limit);
};

export const getCelebritiesByNetWorth = (minNetWorth: number): Omit<Celebrity, 'id' | 'created_at' | 'updated_at'>[] => {
  return REAL_CELEBRITIES.filter(celebrity => (celebrity.net_worth || 0) >= minNetWorth);
}; 
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Instagram, 
  Twitter, 
  Youtube, 
  Facebook,
  MessageSquare,
  Copy,
  Download,
  RefreshCw,
  Settings,
  TrendingUp,
  Hash,
  Image,
  Video,
  Mic,
  Type,
  Zap
} from 'lucide-react';
import type { 
  Celebrity, 
  SocialMediaPlatformValue,
  SocialMediaPost,
  MediaInterview
} from '../../lib/unified-types';

interface GeneratedContent {
  id: string;
  type: 'social_post' | 'interview_response' | 'pr_statement' | 'bio_update';
  platform?: SocialMediaPlatformValue;
  content: string;
  hashtags: string[];
  media_suggestions: string[];
  tone: 'professional' | 'casual' | 'inspirational' | 'controversial' | 'humorous';
  engagement_prediction: number;
  viral_potential: number;
  created_at: Date;
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  type: 'social_post' | 'interview_response' | 'pr_statement' | 'bio_update';
  template: string;
  variables: string[];
  platforms: SocialMediaPlatformValue[];
  tone: 'professional' | 'casual' | 'inspirational' | 'controversial' | 'humorous';
}

interface AIContentGeneratorProps {
  celebrity: Celebrity;
  onContentGenerated: (content: GeneratedContent) => void;
}

const AIContentGenerator: React.FC<AIContentGeneratorProps> = ({
  celebrity,
  onContentGenerated
}) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'templates' | 'history' | 'analytics'>('generator');
  const [contentType, setContentType] = useState<'social_post' | 'interview_response' | 'pr_statement' | 'bio_update'>('social_post');
  const [selectedPlatform, setSelectedPlatform] = useState<SocialMediaPlatformValue>('instagram');
  const [tone, setTone] = useState<'professional' | 'casual' | 'inspirational' | 'controversial' | 'humorous'>('casual');
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [contentHistory, setContentHistory] = useState<GeneratedContent[]>([]);

  // Sample content templates
  const contentTemplates: ContentTemplate[] = [
    {
      id: 'template_1',
      name: 'Behind the Scenes',
      description: 'Share behind-the-scenes content from your latest project',
      type: 'social_post',
      template: "Just wrapped up an incredible day on set! 🎬 The energy was amazing and I can't wait to share this project with you all. #BehindTheScenes #NewProject #Excited",
      variables: ['project_name', 'location', 'emotion'],
      platforms: ['instagram', 'twitter', 'facebook'],
      tone: 'casual'
    },
    {
      id: 'template_2',
      name: 'Achievement Celebration',
      description: 'Celebrate a recent achievement or milestone',
      type: 'social_post',
      template: "Humbled and grateful for this incredible recognition! 🙏 Thank you to everyone who supported me on this journey. This is just the beginning! #Achievement #Grateful #ThankYou",
      variables: ['achievement_name', 'supporters', 'future_plans'],
      platforms: ['instagram', 'twitter', 'facebook'],
      tone: 'inspirational'
    },
    {
      id: 'template_3',
      name: 'Interview Response',
      description: 'Professional response for media interviews',
      type: 'interview_response',
      template: "I'm passionate about [topic] and believe it's important to [perspective]. My experience has taught me that [insight], and I'm committed to [action].",
      variables: ['topic', 'perspective', 'insight', 'action'],
      platforms: ['all' as any],
      tone: 'professional'
    },
    {
      id: 'template_4',
      name: 'PR Statement',
      description: 'Official statement for public relations',
      type: 'pr_statement',
      template: "I want to address the recent [situation]. I take full responsibility for [actions] and am committed to [resolution]. I appreciate the support and understanding of my fans during this time.",
      variables: ['situation', 'actions', 'resolution'],
      platforms: ['all' as any],
      tone: 'professional'
    }
  ];

  // Sample hashtag suggestions
  const hashtagSuggestions = {
    instagram: ['#lifestyle', '#motivation', '#fitness', '#fashion', '#travel', '#food', '#art', '#photography'],
    twitter: ['#trending', '#news', '#politics', '#technology', '#sports', '#entertainment', '#business'],
    youtube: ['#vlog', '#tutorial', '#review', '#gaming', '#music', '#comedy', '#education'],
    facebook: ['#family', '#friends', '#community', '#charity', '#events', '#local'],
    tiktok: ['#viral', '#dance', '#comedy', '#trending', '#challenge', '#duet', '#fyp']
  };

  const generateContent = async () => {
    setIsGenerating(true);
    
    // Simulate AI content generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const content = generateAIContent();
    setGeneratedContent(content);
    setContentHistory(prev => [content, ...prev]);
    onContentGenerated(content);
    setIsGenerating(false);
  };

  const generateAIContent = (): GeneratedContent => {
    const baseContent = getBaseContent();
    const hashtags = generateHashtags();
    const mediaSuggestions = generateMediaSuggestions();
    
    return {
      id: `content_${Date.now()}`,
      type: contentType,
      platform: contentType === 'social_post' ? selectedPlatform : undefined,
      content: baseContent,
      hashtags,
      media_suggestions: mediaSuggestions,
      tone,
      engagement_prediction: Math.floor(Math.random() * 50) + 50, // 50-100
      viral_potential: Math.floor(Math.random() * 30) + 20, // 20-50
      created_at: new Date()
    };
  };

  const getBaseContent = (): string => {
    const templates = {
      social_post: {
        instagram: [
          `Just had an amazing ${topic || 'experience'}! ${getEmotionText()} ${getHashtagText()}`,
          `Behind the scenes of my latest ${topic || 'project'} 📸 ${getEmotionText()} ${getHashtagText()}`,
          `${getInspirationalText()} ${getHashtagText()}`
        ],
        twitter: [
          `${topic || 'Thoughts'} on ${keywords || 'life'}. ${getProfessionalText()}`,
          `Just wrapped up ${topic || 'something incredible'}! ${getEmotionText()} ${getHashtagText()}`,
          `${getCasualText()} ${getHashtagText()}`
        ],
        youtube: [
          `New video alert! 🎥 ${topic || 'Check out my latest content'} ${getEmotionText()} ${getHashtagText()}`,
          `Behind the scenes of ${topic || 'my latest project'} 📹 ${getEmotionText()} ${getHashtagText()}`,
          `${getInspirationalText()} ${getHashtagText()}`
        ]
      },
      interview_response: [
        `I'm passionate about ${topic || 'my work'} and believe it's important to ${keywords || 'make a difference'}. My experience has taught me that ${getInsightText()}, and I'm committed to ${getActionText()}.`,
        `When it comes to ${topic || 'this industry'}, I think ${getPerspectiveText()}. It's crucial that we ${getActionText()} and I'm excited to be part of that journey.`,
        `${getProfessionalText()} I believe in ${getInspirationalText()} and I'm grateful for the opportunity to ${getActionText()}.`
      ],
      pr_statement: [
        `I want to address the recent ${topic || 'situation'}. I take full responsibility for ${getActionText()} and am committed to ${getResolutionText()}. I appreciate the support and understanding of my fans during this time.`,
        `Regarding ${topic || 'recent events'}, I want to be clear that ${getProfessionalText()}. I am committed to ${getResolutionText()} and thank everyone for their patience.`,
        `${getProfessionalText()} I understand the concerns about ${topic || 'this matter'} and I am taking steps to ${getResolutionText()}. Thank you for your continued support.`
      ],
      bio_update: [
        `${celebrity.name} | ${getProfessionalText()} | ${getInspirationalText()} | ${getHashtagText()}`,
        `${getCasualText()} | ${getProfessionalText()} | ${getInspirationalText()} | ${getHashtagText()}`,
        `${getInspirationalText()} | ${getProfessionalText()} | ${getCasualText()} | ${getHashtagText()}`
      ]
    };

    const contentArray = templates[contentType as keyof typeof templates];
    if (Array.isArray(contentArray)) {
      return contentArray[Math.floor(Math.random() * contentArray.length)];
    } else {
      const platformContent = contentArray[selectedPlatform as keyof typeof contentArray];
      return platformContent[Math.floor(Math.random() * platformContent.length)];
    }
  };

  const generateHashtags = (): string[] => {
    const baseHashtags = hashtagSuggestions[selectedPlatform as keyof typeof hashtagSuggestions] || [];
    const topicHashtags = topic ? [`#${topic.toLowerCase().replace(/\s+/g, '')}`] : [];
    const keywordHashtags = keywords ? keywords.split(',').map(k => `#${k.trim().toLowerCase().replace(/\s+/g, '')}`) : [];
    
    return [...topicHashtags, ...keywordHashtags, ...baseHashtags.slice(0, 5)];
  };

  const generateMediaSuggestions = (): string[] => {
    const suggestions = {
      instagram: ['Behind-the-scenes photo', 'Lifestyle shot', 'Professional headshot', 'Candid moment'],
      twitter: ['Infographic', 'Quote card', 'Event photo', 'Professional update'],
      youtube: ['Vlog footage', 'Tutorial content', 'Interview clip', 'Behind-the-scenes video'],
      facebook: ['Community photo', 'Event coverage', 'Personal update', 'Professional achievement']
    };
    
    return suggestions[selectedPlatform as keyof typeof suggestions] || ['Professional photo', 'Event coverage', 'Behind-the-scenes'];
  };

  // Helper functions for content generation
  const getEmotionText = () => {
    const emotions = ['So grateful for this opportunity! 🙏', 'Can\'t believe how amazing this is! 😍', 'Feeling blessed! ✨', 'This is incredible! 🎉'];
    return emotions[Math.floor(Math.random() * emotions.length)];
  };

  const getInspirationalText = () => {
    const inspirational = [
      'Remember, every challenge is an opportunity to grow stronger 💪',
      'Dream big, work hard, stay focused 🎯',
      'Success is not final, failure is not fatal: it is the courage to continue that counts ✨',
      'Your potential is limitless, keep pushing forward 🚀'
    ];
    return inspirational[Math.floor(Math.random() * inspirational.length)];
  };

  const getProfessionalText = () => {
    const professional = [
      'I\'m committed to excellence in everything I do',
      'Professional growth and development are my priorities',
      'I believe in maintaining the highest standards',
      'Continuous improvement drives my success'
    ];
    return professional[Math.floor(Math.random() * professional.length)];
  };

  const getCasualText = () => {
    const casual = [
      'Having a great time with this! 😊',
      'This is exactly what I needed today ✨',
      'So excited to share this with you all! 🎉',
      'Can\'t wait to see where this takes us 🚀'
    ];
    return casual[Math.floor(Math.random() * casual.length)];
  };

  const getHashtagText = () => {
    return `#${celebrity.name.toLowerCase().replace(/\s+/g, '')} #${celebrity.primary_industry} #success`;
  };

  const getInsightText = () => {
    const insights = [
      'hard work and dedication always pay off',
      'surrounding yourself with the right people is crucial',
      'staying true to your values is essential',
      'continuous learning is the key to growth'
    ];
    return insights[Math.floor(Math.random() * insights.length)];
  };

  const getActionText = () => {
    const actions = [
      'continue making a positive impact',
      'inspire others to pursue their dreams',
      'contribute to meaningful change',
      'build a legacy that matters'
    ];
    return actions[Math.floor(Math.random() * actions.length)];
  };

  const getPerspectiveText = () => {
    const perspectives = [
      'authenticity is everything',
      'innovation drives progress',
      'collaboration creates success',
      'excellence is a habit, not an act'
    ];
    return perspectives[Math.floor(Math.random() * perspectives.length)];
  };

  const getResolutionText = () => {
    const resolutions = [
      'addressing this matter appropriately',
      'learning from this experience',
      'making positive changes',
      'ensuring this doesn\'t happen again'
    ];
    return resolutions[Math.floor(Math.random() * resolutions.length)];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const getPlatformIcon = (platform: SocialMediaPlatformValue) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'twitter': return <Twitter className="w-5 h-5 text-blue-400" />;
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-600" />;
      default: return <MessageSquare className="w-5 h-5 text-gray-500" />;
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional': return 'text-blue-600 bg-blue-100';
      case 'casual': return 'text-green-600 bg-green-100';
      case 'inspirational': return 'text-purple-600 bg-purple-100';
      case 'controversial': return 'text-red-600 bg-red-100';
      case 'humorous': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-purple-500" />
          <h2 className="text-2xl font-bold text-gray-900">AI Content Generator</h2>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'generator', label: 'Generator', icon: Zap },
          { id: 'templates', label: 'Templates', icon: Copy },
          { id: 'history', label: 'History', icon: RefreshCw },
          { id: 'analytics', label: 'Analytics', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Generator Tab */}
      {activeTab === 'generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Content Settings</h3>
              
              {/* Content Type */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                <select
                  value={contentType}
                  onChange={(e) => setContentType(e.target.value as any)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="social_post">Social Media Post</option>
                  <option value="interview_response">Interview Response</option>
                  <option value="pr_statement">PR Statement</option>
                  <option value="bio_update">Bio Update</option>
                </select>
              </div>

              {/* Platform Selection */}
              {contentType === 'social_post' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['instagram', 'twitter', 'youtube', 'facebook', 'tiktok'].map(platform => (
                      <button
                        key={platform}
                        onClick={() => setSelectedPlatform(platform as SocialMediaPlatformValue)}
                        className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                          selectedPlatform === platform
                            ? 'border-purple-500 bg-purple-50 text-purple-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {getPlatformIcon(platform as SocialMediaPlatformValue)}
                        <span className="capitalize">{platform}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Tone Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
                <div className="grid grid-cols-2 gap-2">
                  {['professional', 'casual', 'inspirational', 'controversial', 'humorous'].map(toneOption => (
                    <button
                      key={toneOption}
                      onClick={() => setTone(toneOption as any)}
                      className={`p-2 rounded text-sm font-medium transition-colors ${
                        tone === toneOption
                          ? getToneColor(toneOption)
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {toneOption.charAt(0).toUpperCase() + toneOption.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Topic Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic/Theme</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., new project, achievement, behind the scenes"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Keywords Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., success, motivation, growth"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Generate Button */}
              <button
                onClick={generateContent}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate Content
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Generated Content Display */}
          <div className="lg:col-span-2">
            {generatedContent ? (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Generated Content</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(generatedContent.content)}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                    <button
                      onClick={() => copyToClipboard(generatedContent.content + '\n\n' + generatedContent.hashtags.join(' '))}
                      className="flex items-center gap-1 px-3 py-1 text-sm text-green-600 hover:text-green-700"
                    >
                      <Download className="w-3 h-3" />
                      Copy with Hashtags
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Content:</div>
                  <div className="p-4 bg-gray-50 rounded-lg border">
                    <p className="text-gray-900 whitespace-pre-wrap">{generatedContent.content}</p>
                  </div>
                </div>

                {/* Hashtags */}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Hashtags:</div>
                  <div className="flex flex-wrap gap-2">
                    {generatedContent.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Media Suggestions */}
                <div className="mb-6">
                  <div className="text-sm text-gray-600 mb-2">Media Suggestions:</div>
                  <div className="space-y-2">
                    {generatedContent.media_suggestions.map((suggestion, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Image className="w-4 h-4 text-gray-500" />
                        <span>{suggestion}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{generatedContent.engagement_prediction}%</div>
                    <div className="text-sm text-gray-600">Engagement Prediction</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{generatedContent.viral_potential}%</div>
                    <div className="text-sm text-gray-600">Viral Potential</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center py-12">
                  <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Ready to Generate</h3>
                  <p className="text-gray-500">Configure your content settings and click "Generate Content" to create AI-powered content for your celebrity.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getToneColor(template.tone)}`}>
                    {template.tone}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Template:</div>
                  <div className="p-3 bg-gray-50 rounded border text-sm">
                    {template.template}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Platforms:</div>
                  <div className="flex flex-wrap gap-1">
                    {template.platforms.map(platform => (
                      <span key={platform} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <Copy className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold">Content History</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {contentHistory.map(content => (
                <div key={content.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold mb-2">{content.type.replace('_', ' ').toUpperCase()}</h4>
                      <p className="text-sm text-gray-600">{content.content.substring(0, 100)}...</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getToneColor(content.tone)}`}>
                        {content.tone}
                      </span>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Engagement: {content.engagement_prediction}%</span>
                    <span>Viral: {content.viral_potential}%</span>
                    <span>{new Date(content.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Content Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Generated</span>
                  <span className="font-semibold">{contentHistory.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Engagement</span>
                  <span className="font-semibold">
                    {contentHistory.length > 0 
                      ? Math.round(contentHistory.reduce((sum, c) => sum + c.engagement_prediction, 0) / contentHistory.length)
                      : 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Viral Potential</span>
                  <span className="font-semibold">
                    {contentHistory.length > 0 
                      ? Math.round(contentHistory.reduce((sum, c) => sum + c.viral_potential, 0) / contentHistory.length)
                      : 0}%
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Most Used Tones</h3>
              <div className="space-y-3">
                {['casual', 'professional', 'inspirational'].map(tone => (
                  <div key={tone} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{tone}</span>
                    <span className="font-semibold">
                      {contentHistory.filter(c => c.tone === tone).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4">Platform Usage</h3>
              <div className="space-y-3">
                {['instagram', 'twitter', 'youtube', 'facebook'].map(platform => (
                  <div key={platform} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{platform}</span>
                    <span className="font-semibold">
                      {contentHistory.filter(c => c.platform === platform).length}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIContentGenerator; 
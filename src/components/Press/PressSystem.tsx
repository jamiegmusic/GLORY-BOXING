import React, { useState, useEffect } from 'react'
import { Mic, Newspaper, TrendingUp, MessageSquare } from 'lucide-react'
import { supabase, Fighter } from '@/lib/supabase'

interface PressArticle {
  id: string
  title: string
  content: string
  author: string
  published_date: string
  category: 'news' | 'interview' | 'analysis' | 'rumor'
  fighter_id?: string
  fight_id?: string
  views: number
  sentiment: 'positive' | 'negative' | 'neutral'
}

export default function PressSystem() {
  const [articles, setArticles] = useState<PressArticle[]>([])
  const [fighters, setFighters] = useState<Fighter[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadArticles()
    loadFighters()
  }, [])

  const loadArticles = async () => {
    try {
      const { data, error } = await supabase
        .from('press_articles')
        .select('*')
        .order('published_date', { ascending: false })

      if (error) throw error
      setArticles(data || [])
    } catch (error) {
      console.error('Error loading articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadFighters = async () => {
    try {
      const { data, error } = await supabase
        .from('fighters')
        .select('*')

      if (error) throw error
      setFighters(data || [])
    } catch (error) {
      console.error('Error loading fighters:', error)
    }
  }

  const getFighterName = (fighterId: string) => {
    const fighter = fighters.find(f => f.id === fighterId)
    return fighter?.name || 'Unknown Fighter'
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'text-green-400'
      case 'negative':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(a => a.category === selectedCategory)

  const categories = ['all', 'news', 'interview', 'analysis', 'rumor']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Press & Media</h2>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded-md border border-gray-600 focus:border-red-500 focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-white">Loading articles...</div>
      ) : (
        <div className="grid gap-4">
          {filteredArticles.map((article) => (
            <div key={article.id} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{article.title}</h3>
                  <p className="text-gray-300 mb-3 line-clamp-3">{article.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Newspaper className="w-4 h-4" />
                      <span>{article.category}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{article.views} views</span>
                    </div>
                    <div className={`flex items-center space-x-1 ${getSentimentColor(article.sentiment)}`}>
                      <MessageSquare className="w-4 h-4" />
                      <span>{article.sentiment}</span>
                    </div>
                    {article.fighter_id && (
                      <div className="flex items-center space-x-1">
                        <Mic className="w-4 h-4" />
                        <span>{getFighterName(article.fighter_id)}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>{new Date(article.published_date).toLocaleDateString()}</div>
                  <div>by {article.author}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 
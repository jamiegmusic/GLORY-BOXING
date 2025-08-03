'use client'

import React, { useEffect, useState } from 'react'
import { X, Trophy, Book, Map, Star, Clock } from 'lucide-react'
import { useDreamworldProgressStore, Notification } from '@/stores/dreamworldProgressStore'

const NotificationItem: React.FC<{
  notification: Notification
  onDismiss: () => void
}> = ({ notification, onDismiss }) => {
  const [isExiting, setIsExiting] = useState(false)

  const handleDismiss = () => {
    setIsExiting(true)
    setTimeout(onDismiss, 300)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const getIcon = () => {
    switch (notification.type) {
      case 'quest_complete': return Map
      case 'chapter_complete': return Book
      case 'era_unlock': return Clock
      case 'milestone': return Star
      case 'reward': return Trophy
      default: return Star
    }
  }

  const getColorScheme = () => {
    switch (notification.type) {
      case 'quest_complete': return 'from-amber-500 to-yellow-500'
      case 'chapter_complete': return 'from-purple-500 to-pink-500'
      case 'era_unlock': return 'from-blue-500 to-cyan-500'
      case 'milestone': return 'from-green-500 to-emerald-500'
      case 'reward': return 'from-orange-500 to-red-500'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const Icon = getIcon()

  return (
    <div
      className={`relative overflow-hidden bg-sepia-900/95 backdrop-blur-sm rounded-lg 
                  shadow-2xl border-2 border-sepia-700 transform transition-all duration-300
                  ${isExiting ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'}
                  ${!isExiting && 'animate-slide-in-right'}`}
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getColorScheme()}`} />
      
      <div className="flex items-start gap-4 p-4">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${getColorScheme()} text-white`}>
          {notification.icon ? (
            <span className="text-2xl">{notification.icon}</span>
          ) : (
            <Icon className="w-6 h-6" />
          )}
        </div>
        
        <div className="flex-1">
          <h4 className="text-white font-bold text-lg">{notification.title}</h4>
          <p className="text-sepia-200 text-sm mt-1">{notification.message}</p>
        </div>
        
        <button
          onClick={handleDismiss}
          className="p-1 rounded-full hover:bg-sepia-800 transition-colors"
        >
          <X className="w-4 h-4 text-sepia-400" />
        </button>
      </div>
      
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sepia-800">
        <div 
          className={`h-full bg-gradient-to-r ${getColorScheme()} animate-progress-bar`}
        />
      </div>
    </div>
  )
}

export const DreamworldNotifications: React.FC = () => {
  const { notifications, markNotificationRead } = useDreamworldProgressStore()
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Only show the 3 most recent unread notifications
    const unreadNotifications = notifications
      .filter(n => !n.read)
      .slice(0, 3)
    
    setVisibleNotifications(unreadNotifications)
  }, [notifications])

  const handleDismiss = (notificationId: string) => {
    markNotificationRead(notificationId)
  }

  if (visibleNotifications.length === 0) return null

  return (
    <div className="fixed top-20 right-4 z-50 space-y-3 max-w-sm w-full">
      {visibleNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onDismiss={() => handleDismiss(notification.id)}
        />
      ))}
      
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        
        .animate-progress-bar {
          animation: progressBar 5s linear;
        }
      `}</style>
    </div>
  )
}

// Notification Center Modal
export const NotificationCenter: React.FC<{
  isOpen: boolean
  onClose: () => void
}> = ({ isOpen, onClose }) => {
  const { notifications, clearAllNotifications } = useDreamworldProgressStore()

  if (!isOpen) return null

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-sepia-900 
                      shadow-2xl z-50 transform transition-transform duration-300
                      ${isOpen ? 'translate-x-0' : 'translate-x-full'}">
        <div className="flex items-center justify-between p-6 border-b border-sepia-700">
          <h2 className="text-2xl font-bold text-white">Notifications</h2>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={clearAllNotifications}
                className="text-sm text-sepia-400 hover:text-sepia-200 transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-sepia-800 transition-colors"
            >
              <X className="w-5 h-5 text-sepia-400" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-sepia-400">
              <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border border-sepia-700 
                              ${notification.read ? 'bg-sepia-800/50 opacity-70' : 'bg-sepia-800'}`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{notification.icon || '🔔'}</span>
                    <div className="flex-1">
                      <h4 className="text-white font-semibold">{notification.title}</h4>
                      <p className="text-sepia-300 text-sm mt-1">{notification.message}</p>
                      <p className="text-sepia-500 text-xs mt-2">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
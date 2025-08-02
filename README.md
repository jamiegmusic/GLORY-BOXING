# 🥊 Glory Boxing Manager

A comprehensive boxing management simulation game built with React, TypeScript, and Supabase. Experience the thrill of managing fighters, scheduling fights, and building your boxing empire with AI-powered commentary and realistic fight simulation.

## ✨ Features

### 🎮 Core Game Systems
- **Fighter Management**: 210+ features including psychology, training, and career progression
- **Fight Scheduling**: Create and manage fights with detailed event planning
- **Real-time Simulation**: Advanced fight simulation with AI commentary
- **Rankings System**: Dynamic rankings with movement tracking
- **Championship Titles**: Manage multiple boxing organizations and belts
- **Press & Media**: Comprehensive media coverage and public relations
- **Business Management**: Contract negotiations and financial planning

### 🤖 AI Commentary System
- **Multiple Styles**: Technical, dramatic, and casual commentary
- **Real-time Generation**: Live commentary during fight simulation
- **Enhanced Schemas**: 15 event types with detailed fighter metadata
- **Environmental Context**: Venue stats, crowd reactions, and sponsor integration

### 🎯 Advanced Features
- **Fighter Psychology**: Confidence, motivation, and stress management
- **Training Camps**: Skill development and fighter improvement
- **Interactive Cut Scenes**: Story-driven decision making
- **Contract Negotiations**: Complex business dealings
- **Settings Management**: Game configuration and preferences

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/glory-boxing-manager.git
cd glory-boxing-manager
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Fill in your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Set up Supabase database**
```bash
pnpm db:setup
```

5. **Start the development server**
```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to start playing!

## 🏗️ Architecture

### Frontend
- **React 18** with TypeScript
- **Next.js 14** for routing and API routes
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

### Backend
- **Supabase** for database and authentication
- **PostgreSQL** for data storage
- **Real-time subscriptions** for live updates

### AI & Simulation
- **Custom fight simulator** with realistic algorithms
- **AI commentary generation** with multiple styles
- **Enhanced event schemas** for detailed fight data

## 📊 Database Schema

### Core Tables
- `fighters` - Fighter profiles and stats
- `fights` - Fight scheduling and results
- `rankings` - Dynamic fighter rankings
- `titles` - Championship belt management
- `press_articles` - Media coverage
- `game_state` - Global game state
- `training_camps` - Training session data
- `contracts` - Fighter contracts

### Advanced Features
- `commentary_data` - AI-generated commentary
- `analytics` - User engagement metrics
- `settings` - Game configuration
- `cut_scenes` - Interactive story content

## 🎮 Game Systems

### Fighter Management
- **Psychology System**: Confidence, motivation, stress levels
- **Training System**: Skill development and improvement
- **Career Progression**: Prospect → Contender → Champion
- **Injury Management**: Realistic injury and recovery system

### Fight Simulation
- **Realistic Algorithms**: Based on fighter stats and psychology
- **Multiple Outcomes**: KO, TKO, Decision, Draw
- **Round-by-round**: Detailed action simulation
- **Revenue Calculation**: Gate receipts and PPV sales

### Business Management
- **Contract Negotiations**: Complex deal-making
- **Financial Planning**: Budget management
- **Sponsorship**: Revenue generation
- **Media Relations**: Public relations management

## 🤖 AI Commentary Features

### Commentary Styles
- **Technical**: Detailed analysis and statistics
- **Dramatic**: Exciting, high-energy commentary
- **Casual**: Relaxed, conversational style

### Enhanced Data
- **15 Event Types**: Punch, block, dodge, knockdown, etc.
- **Fighter Metadata**: Records, stats, psychology
- **Environmental Context**: Venue, crowd, weather
- **Sponsor Integration**: Commercial elements

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Coverage Report
```bash
pnpm test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment
```bash
pnpm build
pnpm start
```

## 📈 Performance Monitoring

### Built-in Analytics
- **Vercel Analytics**: Real-time user tracking
- **Sentry**: Error monitoring and performance
- **Custom Metrics**: Fight simulation performance

### Logging
- **Structured Logging**: JSON format for easy parsing
- **Error Tracking**: Comprehensive error handling
- **Performance Monitoring**: API response times

## 🔒 Security

### Data Protection
- **GDPR Compliance**: Data anonymization and deletion
- **Rate Limiting**: API request throttling
- **Input Validation**: Comprehensive data validation
- **Authentication**: Supabase Auth integration

## 🌐 Internationalization

### Multi-language Support
- **English**: Primary language
- **Spanish**: Full translation
- **French**: Partial translation
- **German**: Partial translation

## 📚 Documentation

### Guides
- [Advanced Implementation Guide](./ADVANCED_IMPLEMENTATION_GUIDE.md)
- [Enhanced Schemas Guide](./ENHANCED_SCHEMAS_GUIDE.md)
- [Deployment Guide](./DEPLOYMENT.md)

### API Documentation
- [Commentary API](./src/app/api/commentary/route.ts)
- [Fight Simulation](./src/lib/match-simulator.ts)
- [Database Schema](./src/lib/supabase.ts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend platform
- **Vercel** for seamless deployment
- **Tailwind CSS** for the beautiful styling system
- **Framer Motion** for smooth animations
- **Lucide** for the comprehensive icon set

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/your-username/glory-boxing-manager/issues)
- **Discord**: Join our community for discussions
- **Email**: support@gloryboxingmanager.com

---

**Ready to become the greatest boxing manager of all time? Start your journey today!** 🥊 
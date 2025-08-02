# 🚀 Quick Start Guide - Glory Boxing Manager FastAPI Backend

Get your FastAPI + GraphQL backend running in minutes!

## ⚡ 5-Minute Setup

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Run Auto-Setup
```bash
python setup.py
```

### 3. Configure Environment
Edit the `.env` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://yutwoddmzgntofygfdve.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key_here
SECRET_KEY=your-secret-key-here
```

### 4. Start the Server
```bash
python run.py
```

### 5. Test the API
```bash
python test_api.py
```

## 🎯 Quick Test

Once running, visit:
- **API Docs**: http://localhost:8000/docs
- **GraphQL Playground**: http://localhost:8000/graphql
- **Health Check**: http://localhost:8000/health

## 📝 Example Queries

### REST API
```bash
# Get all fighters
curl http://localhost:8000/api/fighters

# Get specific fighter
curl http://localhost:8000/api/fighters/{fighter_id}

# Get matches
curl http://localhost:8000/api/matches
```

### GraphQL
```graphql
# Get fighters
query {
  fighters(limit: 5) {
    id
    name
    age
    nationality
    weightClass
  }
}

# Get matches
query {
  matches(limit: 5) {
    id
    fighterA
    fighterB
    venue
    result
  }
}
```

## 🔧 Troubleshooting

### Database Connection Issues
1. Check your Supabase credentials in `.env`
2. Verify your Supabase project is active
3. Run `python test_api.py` to diagnose

### Port Already in Use
```bash
# Use different port
uvicorn app.main:app --port 8001
```

### Missing Dependencies
```bash
# Reinstall dependencies
pip install -r requirements.txt
```

## 📚 Next Steps

1. **Explore the API**: Visit http://localhost:8000/docs
2. **Test GraphQL**: Visit http://localhost:8000/graphql
3. **Run Examples**: `python examples.py`
4. **Integrate with Frontend**: Update your React app to use the new API

## 🎉 Success!

Your FastAPI + GraphQL backend is now running and ready to power your Glory Boxing Manager application!

---

**Need help?** Check the full README.md for detailed documentation. 
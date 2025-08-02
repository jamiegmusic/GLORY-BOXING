# Deployment Guide

## Overview

This guide covers the complete deployment pipeline for Glory Boxing Manager, including staging and production environments with advanced security and quality checks.

## CI/CD Pipeline Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Code Push     │───▶│   Test Suite    │───▶│   SonarCloud    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   E2E Tests     │    │  Quality Gate   │
                       └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │  API Tests      │    │   Deployment    │
                       └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │ Security Audit  │    │   Notification  │
                       └─────────────────┘    └─────────────────┘
```

## Environment Setup

### 1. GitHub Secrets Configuration

Add these secrets to your GitHub repository:

```bash
# Vercel Configuration
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id

# SonarCloud Configuration
SONAR_TOKEN=your_sonarcloud_token

# Environment Variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional: Notification Services
SLACK_WEBHOOK_URL=your_slack_webhook_url
DISCORD_WEBHOOK_URL=your_discord_webhook_url
```

### 2. Vercel Project Setup

1. **Create Vercel Project**:
   ```bash
   npx vercel --yes
   ```

2. **Configure Environment Variables**:
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   ```

3. **Get Project Details**:
   ```bash
   vercel project ls
   vercel org ls
   ```

### 3. SonarCloud Setup

1. **Create SonarCloud Account**:
   - Visit [sonarcloud.io](https://sonarcloud.io)
   - Sign up with GitHub account

2. **Create Organization**:
   - Create organization: `glory-boxing`
   - Set up billing plan

3. **Create Project**:
   - Import from GitHub
   - Project key: `glory-boxing-manager`
   - Organization: `glory-boxing`

4. **Get Token**:
   - Go to Account → Security
   - Generate new token
   - Add to GitHub secrets as `SONAR_TOKEN`

## Deployment Workflow

### Staging Deployment

**Trigger**: Push to `develop` branch

**Process**:
1. Run all tests (unit, integration, E2E)
2. Security audit
3. Build application
4. Deploy to Vercel staging environment

**URL**: `https://glory-boxing-manager-staging.vercel.app`

### Production Deployment

**Trigger**: Push to `main` branch

**Process**:
1. Run all tests (unit, integration, E2E)
2. Security audit
3. SonarCloud quality analysis
4. Quality gate validation
5. Build application
6. Deploy to Vercel production environment

**URL**: `https://glory-boxing-manager.vercel.app`

## Quality Gates

### SonarCloud Quality Gates

**Pass Criteria**:
- ✅ Coverage ≥ 80%
- ✅ Duplications ≤ 3%
- ✅ Security hotspots reviewed
- ✅ No critical vulnerabilities
- ✅ Maintainability rating ≥ A
- ✅ Reliability rating ≥ A
- ✅ Security rating ≥ A

**Fail Criteria**:
- ❌ Coverage < 80%
- ❌ Duplications > 3%
- ❌ Unreviewed security hotspots
- ❌ Critical vulnerabilities
- ❌ Maintainability rating < A
- ❌ Reliability rating < A
- ❌ Security rating < A

### Security Checks

**Dependency Audit**:
```bash
npm audit --audit-level moderate
```

**Vulnerability Scanning**:
- Automated scanning in CI/CD
- Block deployment on critical issues
- Regular dependency updates

## Environment Variables

### Staging Environment

```bash
NODE_ENV=staging
NEXT_PUBLIC_SUPABASE_URL=https://your-staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_staging_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_staging_service_role_key
NEXT_PUBLIC_APP_URL=https://glory-boxing-manager-staging.vercel.app
```

### Production Environment

```bash
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-production-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://glory-boxing-manager.vercel.app
```

## Monitoring & Alerts

### Deployment Notifications

**Success Notifications**:
- Slack channel: `#deployments`
- Discord channel: `#deployments`
- Email to team leads

**Failure Notifications**:
- Immediate Slack/Discord alerts
- Email to DevOps team
- PagerDuty escalation (if configured)

### Health Checks

**Application Health**:
- `/api/health` endpoint
- Database connectivity
- Supabase connection status

**Performance Monitoring**:
- Vercel Analytics
- Core Web Vitals
- Error tracking

## Rollback Procedures

### Automatic Rollback

**Conditions**:
- Health check failures
- Error rate > 5%
- Response time > 2s

**Process**:
1. Detect failure
2. Trigger rollback job
3. Deploy previous version
4. Notify team

### Manual Rollback

```bash
# Rollback to previous deployment
vercel rollback

# Rollback to specific deployment
vercel rollback <deployment-id>

# Check deployment history
vercel ls
```

## Security Best Practices

### 1. Secret Management

**Never commit secrets**:
```bash
# ❌ Bad
echo "API_KEY=secret123" >> .env

# ✅ Good
echo "API_KEY=${{ secrets.API_KEY }}" >> .env
```

**Use GitHub Secrets**:
- Store all sensitive data in GitHub Secrets
- Rotate secrets regularly
- Use different secrets per environment

### 2. Environment Isolation

**Staging vs Production**:
- Separate Supabase projects
- Different API keys
- Isolated databases
- Separate Vercel projects

### 3. Access Control

**GitHub Branch Protection**:
- Require PR reviews
- Require status checks
- Block force pushes
- Require up-to-date branches

**Vercel Team Access**:
- Role-based permissions
- Environment-specific access
- Audit logging

## Troubleshooting

### Common Issues

**1. Build Failures**:
```bash
# Check build logs
vercel logs

# Local build test
npm run build

# Check TypeScript errors
npx tsc --noEmit
```

**2. Test Failures**:
```bash
# Run tests locally
npm run test

# Check coverage
npm run test:coverage

# Debug specific test
npm test -- --verbose
```

**3. Deployment Failures**:
```bash
# Check Vercel status
vercel status

# View deployment logs
vercel logs <deployment-id>

# Check environment variables
vercel env ls
```

### Performance Optimization

**Build Optimization**:
- Enable Vercel build cache
- Optimize bundle size
- Use dynamic imports
- Implement code splitting

**Runtime Optimization**:
- Enable Vercel Edge Functions
- Use CDN caching
- Optimize images
- Implement lazy loading

## Maintenance

### Regular Tasks

**Weekly**:
- Review SonarCloud reports
- Update dependencies
- Check security advisories
- Monitor performance metrics

**Monthly**:
- Rotate secrets
- Review access permissions
- Update deployment documentation
- Performance audit

**Quarterly**:
- Security audit
- Infrastructure review
- Cost optimization
- Team training

## Support

### Getting Help

**GitHub Issues**: Create issues for bugs and feature requests
**Discord**: Join our development community
**Documentation**: Check project README and docs
**Team Chat**: Use Slack for quick questions

### Emergency Contacts

- **DevOps Lead**: @devops-lead
- **Security Team**: @security-team
- **On-Call Engineer**: @oncall-engineer

---

*Last updated: January 2024*
*Version: 1.0.0* 
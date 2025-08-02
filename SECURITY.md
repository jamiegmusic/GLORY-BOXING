# Security Guide

## Overview

This document outlines security best practices, vulnerability management, and incident response procedures for the Glory Boxing Manager application.

## Security Architecture

### Defense in Depth

```
┌─────────────────────────────────────────────────────────────┐
│                    Application Layer                       │
├─────────────────────────────────────────────────────────────┤
│  • Input Validation    • Authentication    • Authorization │
│  • Rate Limiting      • CORS Protection   • CSRF Tokens   │
├─────────────────────────────────────────────────────────────┤
│                    API Gateway Layer                       │
├─────────────────────────────────────────────────────────────┤
│  • Request Validation • Rate Limiting     • DDoS Protection│
│  • SSL/TLS           • API Key Management • Logging        │
├─────────────────────────────────────────────────────────────┤
│                    Infrastructure Layer                    │
├─────────────────────────────────────────────────────────────┤
│  • Network Security   • Container Security • Secret Mgmt   │
│  • Access Control    • Monitoring         • Alerting       │
└─────────────────────────────────────────────────────────────┘
```

## Security Controls

### 1. Authentication & Authorization

**Supabase Auth Integration**:
```typescript
// Secure authentication
const { user, session } = await supabase.auth.getUser()

// Role-based access control
const { data: profile } = await supabase
  .from('profiles')
  .select('role, permissions')
  .eq('id', user.id)
  .single()
```

**API Route Protection**:
```typescript
// Middleware for protected routes
export async function middleware(req: NextRequest) {
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  
  return NextResponse.next()
}
```

### 2. Input Validation

**Zod Schema Validation**:
```typescript
import { z } from 'zod'

const MatchSchema = z.object({
  fighterA: z.string().min(1).max(100),
  fighterB: z.string().min(1).max(100),
  venue: z.string().min(1).max(200),
  date: z.string().datetime(),
  weightClass: z.enum(['Flyweight', 'Bantamweight', 'Featherweight']),
  titleFight: z.boolean(),
  belt: z.string().optional()
})

// Validate input
const validatedData = MatchSchema.parse(requestBody)
```

**SQL Injection Prevention**:
```typescript
// ✅ Safe - Parameterized queries
const { data, error } = await supabase
  .from('matches')
  .select('*')
  .eq('id', matchId)

// ❌ Dangerous - String concatenation
const query = `SELECT * FROM matches WHERE id = ${matchId}`
```

### 3. Data Protection

**Environment Variables**:
```bash
# Production secrets (never commit)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Development secrets
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Database Security**:
```sql
-- Row Level Security (RLS)
CREATE POLICY "Users can view their own matches" ON matches
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create matches" ON matches
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own matches" ON matches
  FOR UPDATE USING (auth.uid() = user_id);
```

### 4. Network Security

**CORS Configuration**:
```typescript
// Next.js API route CORS
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
```

**Rate Limiting**:
```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
})

// Apply to API routes
app.use('/api/', limiter)
```

## Vulnerability Management

### 1. Dependency Scanning

**Automated Scanning**:
```bash
# Check for vulnerabilities
npm audit

# Fix automatically
npm audit fix

# Check with specific level
npm audit --audit-level moderate
```

**GitHub Actions Integration**:
```yaml
- name: Security audit
  run: npm audit --audit-level moderate

- name: Run dependency check
  run: npx audit-ci --moderate
```

### 2. Code Quality Gates

**SonarCloud Security Rules**:
- No critical vulnerabilities
- No high severity issues
- Security hotspots reviewed
- No hardcoded secrets
- Input validation implemented

**Quality Thresholds**:
```properties
# Security rating must be A
sonar.security.rating.enabled=true
sonar.security.rating.minimum=A

# No critical vulnerabilities
sonar.security.hotspots.reviewed=true
```

### 3. Container Security

**Docker Security**:
```dockerfile
# Use non-root user
USER node

# Scan for vulnerabilities
RUN npm audit --audit-level moderate

# Remove unnecessary files
RUN rm -rf /tmp/* /var/tmp/*
```

## Incident Response

### 1. Security Incident Classification

**Critical (P0)**:
- Data breach
- Authentication bypass
- SQL injection
- XSS attacks

**High (P1)**:
- Unauthorized access
- Rate limiting bypass
- Information disclosure

**Medium (P2)**:
- Minor vulnerabilities
- Configuration issues
- Performance degradation

**Low (P3)**:
- Code quality issues
- Documentation gaps

### 2. Response Procedures

**Immediate Response (0-1 hour)**:
1. Assess impact and scope
2. Isolate affected systems
3. Notify security team
4. Begin incident documentation

**Short-term Response (1-24 hours)**:
1. Implement temporary fixes
2. Monitor for additional attacks
3. Notify stakeholders
4. Begin root cause analysis

**Long-term Response (1-7 days)**:
1. Implement permanent fixes
2. Update security controls
3. Review and update procedures
4. Conduct post-incident review

### 3. Communication Plan

**Internal Notifications**:
- Security team: Immediate
- DevOps team: Within 1 hour
- Development team: Within 4 hours
- Management: Within 8 hours

**External Notifications**:
- Users: If data affected
- Partners: If service impacted
- Regulators: If required by law

## Security Monitoring

### 1. Logging

**Application Logs**:
```typescript
// Structured logging
logger.info('User authentication', {
  userId: user.id,
  action: 'login',
  timestamp: new Date().toISOString(),
  ip: request.ip,
  userAgent: request.headers['user-agent']
})
```

**Security Events**:
- Failed login attempts
- Unauthorized access attempts
- Rate limit violations
- Suspicious activity patterns

### 2. Alerting

**Real-time Alerts**:
- Multiple failed logins
- Unusual access patterns
- System resource exhaustion
- Error rate spikes

**Escalation Matrix**:
```
Level 1: Automated response (0-5 min)
Level 2: On-call engineer (5-15 min)
Level 3: Security team (15-30 min)
Level 4: Management (30+ min)
```

## Compliance

### 1. Data Protection

**GDPR Compliance**:
- Data minimization
- User consent management
- Right to be forgotten
- Data portability

**Data Classification**:
- Public: Match results, rankings
- Internal: User preferences, analytics
- Confidential: Personal data, API keys
- Restricted: Service keys, admin access

### 2. Audit Trail

**Access Logging**:
```sql
-- Audit table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  resource VARCHAR(200),
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);
```

## Security Training

### 1. Developer Guidelines

**Secure Coding Practices**:
- Always validate input
- Use parameterized queries
- Implement proper authentication
- Follow principle of least privilege
- Keep dependencies updated

**Code Review Checklist**:
- [ ] Input validation implemented
- [ ] Authentication required
- [ ] Authorization checked
- [ ] No hardcoded secrets
- [ ] Error handling secure
- [ ] Logging appropriate

### 2. Security Awareness

**Regular Training**:
- Quarterly security workshops
- Monthly security updates
- Annual security assessments
- Continuous learning resources

## Emergency Contacts

### Security Team
- **Security Lead**: @security-lead
- **Incident Response**: @incident-response
- **Forensics**: @forensics-team

### External Contacts
- **Vercel Security**: security@vercel.com
- **Supabase Security**: security@supabase.com
- **GitHub Security**: security@github.com

---

*Last updated: January 2024*
*Version: 1.0.0* 
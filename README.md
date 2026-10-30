# CKMH | Digital Healthcare Infrastructure

### Charles Kulwa Memorial Hospital — Web Platform

<p align="center">
  <img src="public/ckmlogo.png" width="90" alt="CKMH" />
</p>

---

## SYSTEM OVERVIEW

CKMH is a cloud-hosted healthcare web platform engineered to centralize hospital information delivery, administrative content management, and digital patient engagement.

The system adopts a component-driven frontend architecture integrated with Supabase backend infrastructure and Vercel deployment services.

**Production endpoint:** `https://www.ckmhospital.org`

## TECHNOLOGY ARCHITECTURE

| Layer | Technology |
|---|---|
| Presentation | React + TypeScript |
| UI Engineering | Tailwind CSS |
| Build System | Vite |
| Routing | React Router |
| Backend Services | Supabase |
| Database Engine | PostgreSQL |
| Identity Management | Supabase Auth |
| Deployment Infrastructure | Vercel |
| Source Control | Git / GitHub |

### System Data Flow

```text
                 CLIENT LAYER
                       |
             +---------+---------+
             |                   |
         PUBLIC USERS       ADMINISTRATORS
             |                   |
             +---------+---------+
                       |
                 REACT APPLICATION
                       |
                 ROUTING LAYER
                       |
                SUPABASE CLIENT
                       |
          +------------+------------+
          |            |            |
      AUTHENTICATION DATABASE     STORAGE
          |            |            |
          +------------+------------+
                       |
              ACCESS CONTROL
                       |
               APPLICATION DATA

          DEPLOYMENT: VERCEL
          DOMAIN: www.ckmhospital.org
```

## APPLICATION SURFACE

| Endpoint | Function |
|---|---|
| `/` | Main application |
| `/about` | Institutional information |
| `/services` | Healthcare services |
| `/clinic` | Specialist clinic |
| `/departments` | Department directory |
| `/gallery` | Media resources |
| `/news` | Information publishing |
| `/faq` | Knowledge and support |
| `/contact` | Communication interface |

Administrative functionality is managed through the protected application interface.

## SECURITY ENGINEERING

Security considerations span application access, database authorization, transport security, and deployment configuration.

| Security Domain | Control / Objective |
|---|---|
| Identity | Supabase Authentication |
| Authorization | Database-enforced RLS |
| Application Access | Protected administrative routes |
| Data Protection | Least-privilege database permissions |
| Transport | HTTPS |
| Browser Security | Content Security Policy |
| Infrastructure | Vercel security configuration |
| Secrets Management | Environment-based configuration |
| Input Handling | Validation and sanitization |
| Accountability | Administrative audit logging roadmap |

### Security Principles

- Never trust frontend authorization as the sole access-control mechanism.
- Enforce database permissions independently of UI visibility.
- Keep privileged credentials outside the client bundle.
- Restrict cross-origin and external resource access.
- Validate untrusted input at appropriate system boundaries.
- Maintain controlled database schema changes.
- Monitor dependencies and security advisories.

## ENGINEERING ROADMAP

<details>
<summary><strong>01 — Application Security</strong></summary>

- [ ] Comprehensive Supabase RLS assessment.
- [ ] Role-based authorization improvements.
- [ ] Administrative audit trails.
- [ ] API abuse prevention and rate limiting.
- [ ] Automated dependency vulnerability scanning.
- [ ] Security header and CSP review.
- [ ] OWASP-based application security assessment.

</details>

<details>
<summary><strong>02 — Infrastructure & Reliability</strong></summary>

- [ ] CI/CD quality gates.
- [ ] Automated database backups.
- [ ] Disaster recovery procedures.
- [ ] Centralized logging and alerting.
- [ ] Availability and performance monitoring.
- [ ] Deployment rollback strategy.

</details>

<details>
<summary><strong>03 — Digital Healthcare Expansion</strong></summary>

- [ ] Online appointment management.
- [ ] Patient queue management.
- [ ] Specialist scheduling workflows.
- [ ] Patient communication integrations.
- [ ] Operational analytics.
- [ ] AI-assisted information services.

</details>

## LOCAL DEVELOPMENT

```bash
git clone https://github.com/nsecintelligence/charleskulwamemorialhospital.git

cd charleskulwamemorialhospital

npm install
```

Configure the required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_public_key
```

Start development:

```bash
npm run dev
```

Production build:

```bash
npm run build
```

## DEPLOYMENT

```text
GITHUB
   |
   v
SOURCE CONTROL
   |
   v
VERCEL BUILD PIPELINE
   |
   v
PRODUCTION ARTIFACT
   |
   v
www.ckmhospital.org
   |
   v
SUPABASE BACKEND
```

Production configuration must preserve SPA routing, HTTPS, environment separation, Supabase connectivity, and required security policies.

## SECURITY STATUS & SCOPE

This repository documents the platform's architecture and security engineering direction. It is not an independent security certification or penetration-test report.

Security controls should be verified against the deployed configuration before being represented as fully implemented.

The platform should not be considered a clinical records system unless the relevant clinical workflows, privacy controls, and compliance requirements have been separately implemented and assessed.

---

<p align="center">
  <strong>CHARLES KULWA MEMORIAL HOSPITAL</strong><br/>
  <code>CKMH DIGITAL HEALTHCARE PLATFORM</code><br/><br/>
  <sub>Engineered for reliability, security, and patient-focused digital services.</sub><br/>
  <strong>Mahitaji ya mgonjwa kwanza.</strong>
</p>

# Feature: Enhanced Profile System

## Overview
The Profile system provides a role-adaptive interface for users to manage their professional presence on the platform.

## Adaptive UI
The profile page (`/profile`) dynamically renders fields based on whether the user is a `seeker` or an `employer`.

### Seeker Fields:
- **Professional Bio**: A summary of career objectives and experience.
- **Technical Skills**: A tag-based system for managing expertise.
- **Social Links**: Integration with GitHub, LinkedIn, and personal websites.

### Employer Fields:
- **Company Name**: The official name of the hiring entity.
- **Website URL**: Link to the company's corporate site.
- **Social Presence**: LinkedIn and Twitter (X) profiles.

## AI Bio Generation
Users can use a "Generate with AI" feature for their bio.
- **Technology**: Google Gemini (`gemini-1.5-flash`).
- **Input**: Based on the user's existing profile data and role.
- **Output**: A polished, 3-5 sentence professional summary.

## Database Schema
The `profiles` table includes the following fields:
- `bio`: (text)
- `skills`: (text[])
- `website_url`, `github_url`, `linkedin_url`, `twitter_url`: (text)

import OpenAI from 'openai';
import * as gigRepo from '../repositories/gig.repo.js';
import * as freelancerRepo from '../repositories/freelancer.repo.js';
import env from '../config/env.js';

const openai = new OpenAI({
  apiKey: env.ai.apiKey,
  baseURL: env.ai.baseUrl,
});

// ── AI-powered gig matching ──
const getAIGigMatches = async (userId) => {
  // 1. Get freelancer profile
  const freelancer = await freelancerRepo.findFreelancerByUserId(userId);
  if (!freelancer) throw new Error('Freelancer profile not found. Please set up your profile first.');

  const skills = freelancer.skills.map(s => `${s.name} (${s.proficiencyLevel})`).join(', ');
  const bio = freelancer.bio || '';
  const hourlyRate = freelancer.hourlyRate || 0;
  const location = freelancer.location?.city || '';

  // 2. Get all open gigs
  const gigs = await gigRepo.findAllGigs(50, 0);
  const openGigs = gigs.filter(g => g.status === 'open');

  if (openGigs.length === 0) return { matches: [], explanation: 'No open gigs available right now.' };

  // 3. Build prompt for Gemini
  const gigList = openGigs.map((g, i) =>
    `[${i}] ID:${g._id} | "${g.title}" | Category:${g.category} | Budget:$${g.budget?.min}-$${g.budget?.max} | Skills:${(g.requiredSkills || []).join(',')} | Duration:${g.duration}`
  ).join('\n');

  const prompt = `You are an AI job matching engine for a freelance marketplace.

FREELANCER PROFILE:
- Skills: ${skills}
- Bio: ${bio}
- Hourly Rate: $${hourlyRate}/hr
- Location: ${location}

AVAILABLE GIGS:
${gigList}

TASK: Analyze and return the top 5 best matching gigs for this freelancer.
For each match, provide:
1. The gig index number (from the list above)
2. A match score from 0-100
3. A 1-sentence reason why it's a good match
4. Any skill gaps to be aware of

Respond ONLY with valid JSON in this exact format, no other text:
{
  "matches": [
    {
      "index": 0,
      "score": 85,
      "reason": "Strong match for your React skills and the budget aligns with your rate",
      "skillGap": "GraphQL experience would be a bonus"
    }
  ],
  "summary": "One sentence overall assessment of the freelancer's market fit"
}`;

  const response = await openai.chat.completions.create({
    model: env.ai.model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 1000,
  });

  let aiResult;
  try {
    const text = response.choices[0].message.content.replace(/```json|```/g, '').trim();
    aiResult = JSON.parse(text);
  } catch (e) {
    // Fallback: skill-based scoring if AI parse fails
    const scored = openGigs.map(g => {
      const gigSkills = (g.requiredSkills || []).map(s => s.toLowerCase());
      const freelancerSkillNames = freelancer.skills.map(s => s.name.toLowerCase());
      const matchCount = gigSkills.filter(s => freelancerSkillNames.some(fs => fs.includes(s) || s.includes(fs))).length;
      const score = gigSkills.length > 0 ? Math.round((matchCount / gigSkills.length) * 100) : 20;
      return { gig: g, score, reason: `Matched ${matchCount} of ${gigSkills.length} required skills`, skillGap: '' };
    });
    const top5 = scored.sort((a, b) => b.score - a.score).slice(0, 5);
    return { matches: top5.map(m => ({ gig: m.gig, score: m.score, reason: m.reason, skillGap: m.skillGap })), summary: 'Results based on skill matching.' };
  }

  // Map AI result back to gig objects
  const enrichedMatches = (aiResult.matches || []).map(m => ({
    gig: openGigs[m.index],
    score: m.score,
    reason: m.reason,
    skillGap: m.skillGap || '',
  })).filter(m => m.gig);

  return { matches: enrichedMatches, summary: aiResult.summary || '', freelancerSkills: skills };
};

// ── AI proposal writer ──
const generateProposal = async (gigId, userId) => {
  const gig = await gigRepo.findGigById(gigId);
  if (!gig) throw new Error('Gig not found');

  const freelancer = await freelancerRepo.findFreelancerByUserId(userId);
  if (!freelancer) throw new Error('Freelancer profile not found');

  const skills = freelancer.skills.map(s => s.name).join(', ');
  const experience = (freelancer.workExperience || []).map(e => `${e.role} at ${e.company}`).join('; ');

  const prompt = `Write a professional freelance proposal for this job posting.

GIG DETAILS:
- Title: ${gig.title}
- Description: ${gig.description}
- Required Skills: ${(gig.requiredSkills || []).join(', ')}
- Budget: $${gig.budget?.min} - $${gig.budget?.max}
- Duration: ${gig.duration}

FREELANCER PROFILE:
- Skills: ${skills}
- Experience: ${experience || 'Various freelance projects'}
- Bio: ${freelancer.bio}

Write a compelling 150-200 word proposal that:
1. Shows understanding of the client's needs
2. Highlights relevant skills and experience
3. Proposes a clear approach
4. Ends with a call to action

Respond ONLY with JSON:
{
  "title": "A short proposal title",
  "proposal": "The full proposal text",
  "suggestedBid": 500,
  "estimatedDays": 7
}`;

  const response = await openai.chat.completions.create({
    model: env.ai.model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 600,
  });

  const text = response.choices[0].message.content.replace(/```json|```/g, '').trim();
  return JSON.parse(text);
};

// ── Trending skills detection ──
const getTrendingSkills = async () => {
  const gigs = await gigRepo.findAllGigs(100, 0);
  const skillCount = {};
  gigs.filter(g => g.status === 'open').forEach(g => {
    (g.requiredSkills || []).forEach(skill => {
      const s = skill.toLowerCase().trim();
      skillCount[s] = (skillCount[s] || 0) + 1;
    });
  });
  return Object.entries(skillCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([skill, count]) => ({ skill, count, demand: count > 5 ? 'High' : count > 2 ? 'Medium' : 'Low' }));
};

export { getAIGigMatches, generateProposal, getTrendingSkills };
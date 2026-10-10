const { z } = require('zod');

const stringArray = z.array(z.string().trim().min(1)).default([]);

const analysisResponseSchema = z.object({
  matchScore: z.number().min(0).max(100),
  matchedTechnicalSkills: stringArray,
  missingRequiredSkills: stringArray,
  relevantWorkExperience: stringArray,
  missingJobRequirements: stringArray,
  strengths: stringArray,
  weaknesses: stringArray,
  atsRecommendations: stringArray,
  improvementSuggestions: stringArray,
  scoreRationale: z.string().min(1)
});

const resumeSectionSchema = z.object({
  title: z.string().min(1),
  items: z.array(z.string()).default([])
});

const generatedResumeSchema = z.object({
  contact: z.object({
    name: z.string().default(''),
    email: z.string().default(''),
    phone: z.string().default(''),
    location: z.string().default(''),
    links: z.array(z.object({ label: z.string(), url: z.string() })).default([])
  }),
  headline: z.string().default(''),
  summary: z.string().default(''),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()) })).default([]),
  experience: z.array(z.object({
    company: z.string().default(''),
    role: z.string().default(''),
    location: z.string().default(''),
    startDate: z.string().default(''),
    endDate: z.string().default(''),
    bullets: z.array(z.string()).default([])
  })).default([]),
  projects: z.array(z.object({
    name: z.string().default(''),
    description: z.string().default(''),
    technologies: z.array(z.string()).default([]),
    bullets: z.array(z.string()).default([])
  })).default([]),
  education: z.array(z.object({
    institution: z.string().default(''),
    degree: z.string().default(''),
    location: z.string().default(''),
    dates: z.string().default('')
  })).default([]),
  certifications: z.array(z.string()).default([]),
  additionalSections: z.array(resumeSectionSchema).default([])
});

const analyzeRequestSchema = z.object({
  resumeText: z.string().min(100, 'Resume text is too short to analyze.'),
  jobDescription: z.string().min(80, 'Job description is too short to analyze.')
});

const generateRequestSchema = analyzeRequestSchema.extend({
  analysis: analysisResponseSchema.optional()
});

const pdfRequestSchema = z.object({
  resume: generatedResumeSchema,
  template: z.enum(['classic', 'modern', 'compact']).default('classic')
});

module.exports = {
  analysisResponseSchema,
  generatedResumeSchema,
  analyzeRequestSchema,
  generateRequestSchema,
  pdfRequestSchema
};

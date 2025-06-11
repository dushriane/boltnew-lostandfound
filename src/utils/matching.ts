import type { Item, Match, MatchingCriteria } from '../types';
import { aiService } from './aiService';

const MATCHING_WEIGHTS: MatchingCriteria = {
  category: 0.20,
  location: 0.15,
  description: 0.15,
  color: 0.08,
  brand: 0.08,
  size: 0.04,
  dateRange: 0.10,
  aiDescription: 0.10,
  imageMatch: 0.10,
};

const MINIMUM_MATCH_SCORE = 0.6;

export function calculateMatchScore(lostItem: Item, foundItem: Item): number {
  let score = 0;
  const matchedFields: string[] = [];

  // Category match (exact)
  if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    score += MATCHING_WEIGHTS.category;
    matchedFields.push('category');
  }

  // Location proximity (simplified - exact match for now)
  if (lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase()) ||
      foundItem.location.toLowerCase().includes(lostItem.location.toLowerCase())) {
    score += MATCHING_WEIGHTS.location;
    matchedFields.push('location');
  }

  // Description similarity (keyword matching)
  const lostKeywords = extractKeywords(lostItem.description);
  const foundKeywords = extractKeywords(foundItem.description);
  const descriptionSimilarity = calculateKeywordSimilarity(lostKeywords, foundKeywords);
  score += MATCHING_WEIGHTS.description * descriptionSimilarity;
  if (descriptionSimilarity > 0.3) {
    matchedFields.push('description');
  }

  // AI-enhanced description matching
  if (lostItem.aiDescription && foundItem.aiDescription) {
    const aiKeywords1 = extractKeywords(lostItem.aiDescription);
    const aiKeywords2 = extractKeywords(foundItem.aiDescription);
    const aiSimilarity = calculateKeywordSimilarity(aiKeywords1, aiKeywords2);
    score += MATCHING_WEIGHTS.aiDescription * aiSimilarity;
    if (aiSimilarity > 0.4) {
      matchedFields.push('aiDescription');
    }
  }

  // Image similarity matching
  if (lostItem.imageEmbeddings && foundItem.imageEmbeddings && 
      lostItem.imageEmbeddings.length > 0 && foundItem.imageEmbeddings.length > 0) {
    const imageSimilarity = aiService.calculateImageSimilarity(
      lostItem.imageEmbeddings, 
      foundItem.imageEmbeddings
    );
    score += MATCHING_WEIGHTS.imageMatch * imageSimilarity;
    if (imageSimilarity > 0.7) {
      matchedFields.push('imageMatch');
    }
  }

  // Color match
  if (lostItem.color && foundItem.color && 
      lostItem.color.toLowerCase() === foundItem.color.toLowerCase()) {
    score += MATCHING_WEIGHTS.color;
    matchedFields.push('color');
  }

  // Brand match
  if (lostItem.brand && foundItem.brand && 
      lostItem.brand.toLowerCase() === foundItem.brand.toLowerCase()) {
    score += MATCHING_WEIGHTS.brand;
    matchedFields.push('brand');
  }

  // Size match
  if (lostItem.size && foundItem.size && 
      lostItem.size.toLowerCase() === foundItem.size.toLowerCase()) {
    score += MATCHING_WEIGHTS.size;
    matchedFields.push('size');
  }

  // Date range proximity (within 7 days)
  const daysDifference = Math.abs(
    (lostItem.dateOccurred.getTime() - foundItem.dateOccurred.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysDifference <= 7) {
    const dateScore = Math.max(0, 1 - (daysDifference / 7));
    score += MATCHING_WEIGHTS.dateRange * dateScore;
    if (dateScore > 0.5) {
      matchedFields.push('dateRange');
    }
  }

  return Math.min(score, 1);
}

function extractKeywords(text: string): string[] {
  const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'was', 'are', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2 && !commonWords.includes(word));
}

function calculateKeywordSimilarity(keywords1: string[], keywords2: string[]): number {
  if (keywords1.length === 0 || keywords2.length === 0) return 0;
  
  const intersection = keywords1.filter(word => keywords2.includes(word));
  const union = [...new Set([...keywords1, ...keywords2])];
  
  return intersection.length / union.length;
}

export function findMatches(items: Item[]): Match[] {
  const matches: Match[] = [];
  const lostItems = items.filter(item => item.type === 'lost' && item.status === 'active');
  const foundItems = items.filter(item => item.type === 'found' && item.status === 'active');

  lostItems.forEach(lostItem => {
    foundItems.forEach(foundItem => {
      const score = calculateMatchScore(lostItem, foundItem);
      
      if (score >= MINIMUM_MATCH_SCORE) {
        const matchedFields = getMatchedFields(lostItem, foundItem);
        
        // Calculate AI confidence if both items have AI analysis
        let aiConfidence = 0;
        if (lostItem.aiDescription && foundItem.aiDescription) {
          aiConfidence = calculateAIConfidence(lostItem, foundItem);
        }

        // Calculate image match score if both have embeddings
        let imageMatchScore = 0;
        if (lostItem.imageEmbeddings && foundItem.imageEmbeddings) {
          imageMatchScore = aiService.calculateImageSimilarity(
            lostItem.imageEmbeddings, 
            foundItem.imageEmbeddings
          );
        }
        
        matches.push({
          id: `${lostItem.id}-${foundItem.id}`,
          lostItemId: lostItem.id,
          foundItemId: foundItem.id,
          matchScore: score,
          matchedFields,
          dateMatched: new Date(),
          status: 'pending',
          notificationSent: false,
          aiConfidence,
          imageMatchScore,
        });
      }
    });
  });

  return matches.sort((a, b) => b.matchScore - a.matchScore);
}

function calculateAIConfidence(lostItem: Item, foundItem: Item): number {
  // Simple confidence calculation based on AI descriptions
  const lostKeywords = extractKeywords(lostItem.aiDescription || '');
  const foundKeywords = extractKeywords(foundItem.aiDescription || '');
  return calculateKeywordSimilarity(lostKeywords, foundKeywords);
}

function getMatchedFields(lostItem: Item, foundItem: Item): string[] {
  const fields: string[] = [];
  
  if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    fields.push('category');
  }
  
  if (lostItem.location.toLowerCase().includes(foundItem.location.toLowerCase()) ||
      foundItem.location.toLowerCase().includes(lostItem.location.toLowerCase())) {
    fields.push('location');
  }
  
  if (lostItem.color && foundItem.color && 
      lostItem.color.toLowerCase() === foundItem.color.toLowerCase()) {
    fields.push('color');
  }
  
  if (lostItem.brand && foundItem.brand && 
      lostItem.brand.toLowerCase() === foundItem.brand.toLowerCase()) {
    fields.push('brand');
  }

  // Add AI-specific matched fields
  if (lostItem.aiDescription && foundItem.aiDescription) {
    const aiKeywords1 = extractKeywords(lostItem.aiDescription);
    const aiKeywords2 = extractKeywords(foundItem.aiDescription);
    if (calculateKeywordSimilarity(aiKeywords1, aiKeywords2) > 0.4) {
      fields.push('aiAnalysis');
    }
  }

  if (lostItem.imageEmbeddings && foundItem.imageEmbeddings) {
    const imageSimilarity = aiService.calculateImageSimilarity(
      lostItem.imageEmbeddings, 
      foundItem.imageEmbeddings
    );
    if (imageSimilarity > 0.7) {
      fields.push('imageMatch');
    }
  }
  
  return fields;
}
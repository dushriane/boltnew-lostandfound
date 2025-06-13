export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'student' | 'faculty' | 'admin';
  studentId?: string;
  department?: string;
  createdAt: Date;
  isActive: boolean;
  profileImage?: string;
}

export interface Item {
  id: string;
  type: 'lost' | 'found';
  title: string;
  description: string;
  category: string;
  location: string;
  dateReported: Date;
  dateOccurred: Date;
  userId: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  images?: string[];
  status: 'active' | 'matched' | 'resolved' | 'claimed';
  matchedWith?: string;
  tags: string[];
  color?: string;
  brand?: string;
  size?: string;
  reward?: number;
  aiDescription?: string;
  imageEmbeddings?: number[];
  claimedBy?: string;
  claimedAt?: Date;
  adminNotes?: string;
  isVerified: boolean;
}

export interface Match {
  id: string;
  lostItemId: string;
  foundItemId: string;
  matchScore: number;
  matchedFields: string[];
  dateMatched: Date;
  status: 'pending' | 'confirmed' | 'rejected';
  notificationSent: boolean;
  aiConfidence?: number;
  imageMatchScore?: number;
  reviewedBy?: string;
  reviewedAt?: Date;
}

export interface Payment {
  id: string;
  itemId: string;
  payerId: string;
  receiverId: string;
  amount: number;
  currency: 'RWF' | 'USD';
  method: 'momo' | 'airtel_money' | 'bank_transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt: Date;
  completedAt?: Date;
  description: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'match_found' | 'item_claimed' | 'payment_received' | 'admin_message';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  relatedItemId?: string;
  relatedMatchId?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalItems: number;
  activeItems: number;
  resolvedItems: number;
  totalMatches: number;
  pendingReviews: number;
  recentActivity: {
    newUsers: number;
    newItems: number;
    newMatches: number;
  };
}

export interface MatchingCriteria {
  category: number;
  location: number;
  description: number;
  color: number;
  brand: number;
  size: number;
  dateRange: number;
  aiDescription: number;
  imageMatch: number;
}

export interface AIAnalysis {
  description: string;
  tags: string[];
  category: string;
  color?: string;
  brand?: string;
  confidence: number;
}

export interface ImageEmbedding {
  embedding: number[];
  confidence: number;
}
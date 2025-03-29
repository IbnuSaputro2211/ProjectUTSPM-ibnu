// User Role Type
export type UserRole = 'student' | 'teacher' | 'admin';

// Rating Interface
export interface Rating {
  id?: string; 
  userId: string;
  userName: string;
  value: number;
  commentId?: string;  
  timestamp: number;
}

export interface Comment {
  id?: string; 
  userId: string;
  userName: string;
  content: string;
  userRole: UserRole;
  timestamp: number;
  edited?: boolean;  
  editedTimestamp?: number;  
  rating?: number;  
}


export interface FirebaseComment extends Comment {
  firebaseId?: string; 
}

export interface AggregatedRating {
  averageRating: number;
  totalVotes: number;
  ratingDistribution?: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  lastUpdated?: number;
  firebaseId?: string;  
}

export interface IndividualRating {
  hoveredRating: number;
  selectedRating: number;
  commentId?: string;
}
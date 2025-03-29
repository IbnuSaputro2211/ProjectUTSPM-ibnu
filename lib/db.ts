import { db } from '@/lib/firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  getDoc 
} from 'firebase/firestore';
import { Comment, Rating, AggregatedRating } from '../types/Comment';

export default class DatabaseService {
  private static instance: DatabaseService;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async addComment(
    commentData: Omit<Comment, 'id' | 'timestamp'> & { rating?: number }
  ): Promise<Comment> {
    const newComment: Comment = {
      ...commentData,
      timestamp: Date.now(),
      rating: commentData.rating || 0
    };

    try {
      const docRef = await addDoc(collection(db, 'comments'), newComment);
      
      // Automatically add rating if provided
      if (commentData.rating) {
        await this.addRating({
          userId: newComment.userId,
          userName: newComment.userName,
          value: commentData.rating
        });
      }

      return { ...newComment, id: docRef.id };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  public async getComments(): Promise<Comment[]> {
    try {
      const q = query(collection(db, 'comments'));
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Comment)).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    } catch (error) {
      console.error('Error getting comments:', error);
      throw error;
    }
  }

  public async updateComment(
    id: string, 
    newContent: string, 
    newRating?: number
  ): Promise<Comment | null> {
    try {
      const commentRef = doc(db, 'comments', id);
      const commentSnap = await getDoc(commentRef);

      if (!commentSnap.exists()) return null;

      const updateData: Partial<Comment> = { content: newContent };
      
      if (newRating !== undefined) {
        updateData.rating = newRating;
        
        // Update or add rating
        await this.addRating({
          userId: (commentSnap.data() as Comment).userId,
          userName: (commentSnap.data() as Comment).userName,
          value: newRating
        });
      }

      await updateDoc(commentRef, updateData);
      
      const updatedDoc = await getDoc(commentRef);
      return { id: updatedDoc.id, ...updatedDoc.data() } as Comment;
    } catch (error) {
      console.error('Error updating comment:', error);
      throw error;
    }
  }

  public async deleteComment(id: string): Promise<boolean> {
    try {
      const commentRef = doc(db, 'comments', id);
      const commentSnap = await getDoc(commentRef);
      
      if (!commentSnap.exists()) {
        console.warn(`Comment with ID ${id} not found`);
        return false;
      }
  
      const userId = (commentSnap.data() as Comment).userId;
  
      // Delete comment
      await deleteDoc(commentRef);
  
      // Remove associated ratings for this user
      const ratingsQuery = query(
        collection(db, 'ratings'), 
        where('userId', '==', userId)
      );
      const ratingsSnapshot = await getDocs(ratingsQuery);
      
      // Use Promise.all for proper async handling
      await Promise.all(
        ratingsSnapshot.docs.map(ratingDoc => deleteDoc(ratingDoc.ref))
      );
  
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }

  public async addRating(
    ratingData: Omit<Rating, 'timestamp'>
  ): Promise<Rating> {
    try {
      const newRating: Rating = {
        ...ratingData,
        timestamp: Date.now()
      };

      // Remove previous rating from the same user
      const existingRatingsQuery = query(
        collection(db, 'ratings'), 
        where('userId', '==', ratingData.userId)
      );
      const existingRatingsSnapshot = await getDocs(existingRatingsQuery);
      
      existingRatingsSnapshot.docs.forEach(async (existingRating) => {
        await deleteDoc(existingRating.ref);
      });

      // Add new rating
      await addDoc(collection(db, 'ratings'), newRating);
      
      return newRating;
    } catch (error) {
      console.error('Error adding rating:', error);
      throw error;
    }
  }

  public async calculateAggregatedRating(): Promise<AggregatedRating> {
    try {
      const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
      
      if (ratingsSnapshot.empty) {
        return { averageRating: 0, totalVotes: 0 };
      }

      const ratings = ratingsSnapshot.docs.map(doc => doc.data() as Rating);
      
      const totalRating = ratings.reduce((sum, rating) => sum + rating.value, 0);
      const averageRating = totalRating / ratings.length;

      return {
        averageRating: Number(averageRating.toFixed(1)),
        totalVotes: ratings.length
      };
    } catch (error) {
      console.error('Error calculating aggregated rating:', error);
      throw error;
    }
  }

  public async resetAllRatings(): Promise<void> {
    try {
      // Delete all ratings
      const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
      ratingsSnapshot.docs.forEach(async (ratingDoc) => {
        await deleteDoc(ratingDoc.ref);
      });

      // Reset ratings in comments
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      commentsSnapshot.docs.forEach(async (commentDoc) => {
        await updateDoc(commentDoc.ref, { rating: 0 });
      });
    } catch (error) {
      console.error('Error resetting ratings:', error);
      throw error;
    }
  }

  public async resetAllComments(): Promise<void> {
    try {
      // Delete all comments
      const commentsSnapshot = await getDocs(collection(db, 'comments'));
      commentsSnapshot.docs.forEach(async (commentDoc) => {
        await deleteDoc(commentDoc.ref);
      });

      // Delete all ratings
      const ratingsSnapshot = await getDocs(collection(db, 'ratings'));
      ratingsSnapshot.docs.forEach(async (ratingDoc) => {
        await deleteDoc(ratingDoc.ref);
      });
    } catch (error) {
      console.error('Error resetting comments:', error);
      throw error;
    }
  }
}
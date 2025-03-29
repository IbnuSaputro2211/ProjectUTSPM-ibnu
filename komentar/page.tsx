'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, RefreshCw, Menu, X } from 'lucide-react';
import { useTheme } from '../lib/ThemeContext';
import DatabaseService from '../lib/db';
import { Comment, AggregatedRating } from '../types/Comment';

const CommentSection: React.FC = () => {
  const { theme } = useTheme();
  const [isClient, setIsClient] = useState(false);
  const [dbService, setDbService] = useState<DatabaseService | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [userName, setUserName] = useState('');
  const [userRole, setUserRole] = useState<'student' | 'teacher' | 'admin'>('student');

  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  const [aggregatedRating, setAggregatedRating] = useState<AggregatedRating>({ 
    averageRating: 0, 
    totalVotes: 0 
  });

  useEffect(() => {
    const loadData = async () => {
      setIsClient(true);
      const service = DatabaseService.getInstance();
      setDbService(service);
      
      try {
        const loadedComments = await service.getComments();
        setComments(loadedComments);

        const initialAggregation = await service.calculateAggregatedRating();
        console.log("Initial Aggregated Rating:", initialAggregation);
        setAggregatedRating(initialAggregation);
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Gagal memuat komentar');
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const updateAggregation = async () => {
      if (dbService) {
        const updatedAggregation = await dbService.calculateAggregatedRating();
        setAggregatedRating(updatedAggregation);
      }
    };
    
    updateAggregation();
  }, [comments, dbService]); 

  if (!isClient) return null;

  const handleAddComment = async () => {
    if (!dbService || newComment.trim() === '' || selectedRating === 0) {
      alert('Harap isi komentar dan berikan rating terlebih dahulu');
      return;
    }
    
    const effectiveName = userName.trim() || 'Anonymous';

    try {
      const comment = await dbService.addComment({
        userId: 'user_' + Date.now(), 
        userName: effectiveName,
        content: newComment,
        userRole: userRole,
        rating: selectedRating
      });
      const updatedComments = await dbService.getComments();
      const updatedAggregation = await dbService.calculateAggregatedRating();

      setComments(updatedComments);
      setAggregatedRating(updatedAggregation);

      setNewComment('');
      setUserName('');
      setSelectedRating(0);
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Gagal menambahkan komentar');
    }
  };

  const handleEditComment = (comment: Comment) => {
    setEditingComment({...comment});
    setSelectedRating(comment.rating || 0);
  };

  const handleUpdateComment = async () => {
    if (!dbService || !editingComment) {
      alert('Data tidak lengkap untuk pembaruan');
      return;
    }
  
    try {
      const updatedComment = await dbService.updateComment(
        editingComment.id || '', 
        editingComment.content ?? '',
        selectedRating > 0 ? selectedRating : (editingComment.rating || 0)
      );
  
      if (updatedComment) {
        const updatedComments = await dbService.getComments();
        const updatedAggregation = await dbService.calculateAggregatedRating();

        setComments(updatedComments);
        setAggregatedRating(updatedAggregation);

        setEditingComment(null);
        setSelectedRating(0);
        alert('Komentar berhasil diperbarui');
      } else {
        alert('Komentar tidak ditemukan');
      }
    } catch (error) {
      console.error('Kesalahan memperbarui komentar:', error);
      alert('Gagal memperbarui komentar. Silakan coba lagi.');
    }
  };  

  const handleDeleteComment = async (id: string) => {
    if (!dbService) {
      alert('Layanan database tidak tersedia');
      return;
    }
    
    try {
      const commentToDelete = comments.find(comment => comment.id === id);
      if (!commentToDelete) {
        alert('Komentar tidak ditemukan');
        return;
      }
      const commentId = String(id).trim();
      if (!commentId) {
        alert('ID komentar tidak valid');
        return;
      }
      const success = await dbService.deleteComment(commentId);
      
      if (success === true) {
        const updatedComments = comments.filter(comment => comment.id !== id);
        setComments(updatedComments);
        const updatedAggregation = await dbService.calculateAggregatedRating();
        setAggregatedRating(updatedAggregation);
        
        alert('Komentar berhasil dihapus');
      } else {
        alert('Gagal menghapus komentar. Mohon coba lagi.');
      }
    } catch (error) {
      console.error('Kesalahan menghapus komentar:', error);
      alert('Gagal menghapus komentar. Silakan coba lagi.');
    }
  };

  const handleResetRating = async () => {
    if (!dbService) return;

    try {
      await dbService.resetAllComments();
      
      setComments([]);
      setAggregatedRating({ averageRating: 0, totalVotes: 0 });

      setNewComment('');
      setUserName('');
      setSelectedRating(0);
      setEditingComment(null);
    } catch (error) {
      console.error('Error resetting comments:', error);
      alert('Gagal mereset komentar');
    }
  };

  const starColor = (index: number) => {
    const filled = index <= (hoveredRating || selectedRating);
    return filled 
      ? (theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500') 
      : (theme === 'dark' ? 'text-gray-600' : 'text-gray-300');
  };

  return (
    <div className={`py-6 md:py-12 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-black'}`}>
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row px-4 md:px-0">
        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h2 className={`text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${
            theme === 'dark'
              ? 'from-blue-400 to-purple-500'
              : 'from-blue-600 to-purple-700'
          }`}>
            Bebas Berkomentar
          </h2>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-200 text-black'}`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="w-full md:w-2/3 md:pr-8">
          {/* Desktop Title */}
          <div className="hidden md:block text-center mb-10">
            <h2 className={`text-4xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r ${
              theme === 'dark'
                ? 'from-blue-400 to-purple-500'
                : 'from-blue-600 to-purple-700'
            }`}>
              Bebas Berkomentar
            </h2>
          </div>

          {/* Mobile Dropdown Menu */}
          <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="mb-4 flex flex-col space-y-2">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Nama Anda"
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              />
              <select
                value={userRole}
                onChange={(e) => setUserRole(e.target.value as 'student' | 'teacher' | 'admin')}
                className={`w-full p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              >
                <option value="student">Mahasiswa</option>
                <option value="teacher">Dosen</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Mobile Rating Input */}
            <div className="mb-4 flex justify-center">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star
                  key={index}
                  fill={(hoveredRating || selectedRating) >= index 
                    ? (theme === 'dark' ? '#fbbf24' : '#eab308') 
                    : 'none'}
                  className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${starColor(index)}`}
                  onMouseEnter={() => setHoveredRating(index)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setSelectedRating(index)}
                  strokeWidth={1}
                />
              ))}
            </div>
          </div>

          {/* Desktop User Information and Rating */}
          <div className="hidden md:block mb-4 flex space-x-2">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Nama Anda"
              className={`flex-grow p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as 'student' | 'teacher' | 'admin')}
              className={`p-2 rounded ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            >
              <option value="student">Mahasiswa</option>
              <option value="teacher">Dosen</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Desktop Rating Input */}
          <div className="hidden md:flex mb-4 justify-center">
            {[1, 2, 3, 4, 5].map((index) => (
              <Star
                key={index}
                fill={(hoveredRating || selectedRating) >= index 
                  ? (theme === 'dark' ? '#fbbf24' : '#eab308') 
                  : 'none'}
                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${starColor(index)}`}
                onMouseEnter={() => setHoveredRating(index)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setSelectedRating(index)}
                strokeWidth={1}
              />
            ))}
          </div>

          {/* Comment Input */}
          <div className="mb-4 flex flex-col md:flex-row">
            <input
              type="text"
              value={editingComment ? editingComment.content : newComment}
              onChange={(e) => 
                editingComment 
                  ? setEditingComment({...editingComment, content: e.target.value}) 
                  : setNewComment(e.target.value)
              }
              placeholder="Tulis Komentar disini...."
              className={`w-full md:flex-grow p-2 rounded mb-2 md:mb-0 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
            />
            <div className="flex space-x-2 md:ml-2">
              {editingComment ? (
                <>
                  <button 
                    onClick={handleUpdateComment}
                    className={`w-1/2 md:w-auto px-4 py-2 rounded ${theme === 'dark' ? 'bg-green-600 hover:bg-green-700' : 'bg-green-500 hover:bg-green-600'} text-white`}
                  >
                    Simpan
                  </button>
                  <button 
                    onClick={() => {
                      setEditingComment(null);
                      setSelectedRating(0);
                    }}
                    className={`w-1/2 md:w-auto px-4 py-2 rounded ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                  >
                    Batal
                  </button>
                </>
              ) : (
                <button 
                  onClick={handleAddComment}
                  className={`w-full md:w-auto px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                >
                  Kirim
                </button>
              )}
            </div>
          </div>

          {/* Comments List */}
          <div>
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={`mb-4 p-4 rounded ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow`}
              >
                <div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2 mb-2 md:mb-0">
                      <span className="font-bold">{comment.userName}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        comment.userRole === 'teacher' ? 'bg-green-500' : 
                        comment.userRole === 'admin' ? 'bg-red-500' : 'bg-blue-500'
                      } text-white`}>
                        {comment.userRole === 'teacher' ? 'Dosen' : 
                         comment.userRole === 'admin' ? 'Admin' : 'Mahasiswa'}
                      </span>
                    </div>
                    <div className="flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-2">
                      <span className="text-sm text-gray-500">
                        {new Date(comment.timestamp).toLocaleString()}
                      </span>
                      {comment.rating && (
                        <div className="flex items-center">
                          {[...Array(comment.rating)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 text-yellow-500" fill="currentColor" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <p>{comment.content}</p>
                  <div className="mt-2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                    <button 
                      onClick={() => handleEditComment(comment)}
                      className={`w-full md:w-auto px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
                    >
                      Edit
                    </button>
                    <button 
                        onClick={() => comment.id && handleDeleteComment(comment.id)}
                        className={`w-full md:w-auto px-2 py-1 rounded text-sm ${theme === 'dark' ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white`}
                      >
                        Hapus
                      </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Rating Summary Section */}
        <div className={`w-full md:w-1/3 mt-4 md:mt-0 md:pl-8 ${isMobileMenuOpen ? 'hidden md:block' : ''} md:border-l border-gray-300`}>
          <div className={`flex flex-col items-center p-4 rounded ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className={`text-center w-full ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
              <p className="text-lg font-semibold">
                Rating Keseluruhan: {aggregatedRating?.averageRating?.toFixed(1) || 0} 
                <span className="text-sm text-gray-500 ml-2">
                  (dari {aggregatedRating?.totalVotes || 0} penilai)
                </span>
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={handleResetRating}
                  className={`flex items-center justify-center px-3 py-2 rounded ${
                    theme === 'dark' 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <RefreshCw className="mr-2 w-4 h-4" />
                  Reset Rating
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { destinationService, galleryService } from '../services/api';
import { MapPin, Star, User, Image as ImageIcon, Send, Upload, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UploadModal from '../components/UploadModal';

const DestinationDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [destination, setDestination] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [photos, setPhotos] = useState([]);
    
    const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
    const [newBlog, setNewBlog] = useState({ title: '', content: '', travelTips: '' });
    const [showBlogForm, setShowBlogForm] = useState(false);
    
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [destRes, blogsRes, reviewsRes, photosRes] = await Promise.all([
                destinationService.getById(id),
                destinationService.getBlogs(id),
                destinationService.getReviews(id),
                galleryService.getByDestination(id)
            ]);
            
            setDestination(destRes.data);
            setBlogs(blogsRes.data);
            setReviews(reviewsRes.data);
            setPhotos(photosRes.data);
        } catch (error) {
            console.error("Error fetching destination details", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddReview = async (e) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in to leave a review.");
        try {
            await destinationService.addReview(id, {
                ...newReview,
                userId: user.id
            });
            setNewReview({ rating: 5, comment: '' });
            fetchData();
        } catch (error) {
            console.error("Error adding review", error);
        }
    };

    const handleAddBlog = async (e) => {
        e.preventDefault();
        if (!user) return alert("You must be logged in to write a blog.");
        
        const tipsArray = newBlog.travelTips.split('\n').filter(t => t.trim() !== '');
        
        try {
            await destinationService.createBlog({
                destinationId: id,
                userId: user.id,
                title: newBlog.title,
                content: newBlog.content,
                travelTips: tipsArray
            });
            setNewBlog({ title: '', content: '', travelTips: '' });
            setShowBlogForm(false);
            fetchData();
        } catch (error) {
            console.error("Error adding blog", error);
        }
    };

    const getImageUrl = (filename) => {
        // Construct the URL to the API Gateway routing to gallery service file endpoint
        return `http://localhost:8080/api/gallery/files/${filename}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!destination) {
        return <div className="text-center py-20 text-slate-500 dark:text-slate-400">Destination not found.</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl mx-auto">
            {/* Header */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 transition-colors">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-2">{destination.title}</h1>
                        <p className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-lg mb-4">
                            <MapPin className="w-5 h-5 text-primary-500" /> {destination.location}, {destination.country}
                        </p>
                        <div className="flex gap-2 mb-6 flex-wrap">
                            {destination.tags?.map(t => (
                                <span key={t} className="text-sm font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-3 py-1 rounded-full">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xl shadow-sm border border-amber-100 dark:border-amber-900/50">
                        <Star className="w-6 h-6 fill-current" />
                        {destination.rating ? destination.rating.toFixed(1) : 'New'}
                    </div>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                    {destination.description}
                </p>
            </div>

            {/* Photos Gallery */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <ImageIcon className="w-6 h-6 text-primary-500" /> Traveler Photos
                    </h2>
                    <button 
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors font-medium text-sm"
                    >
                        <Upload className="w-4 h-4" /> Upload Photo
                    </button>
                </div>
                
                {photos.length === 0 ? (
                    <div className="bg-slate-50 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 rounded-2xl p-12 text-center text-slate-500 dark:text-slate-400">
                        No photos yet. Be the first to upload one!
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm group bg-slate-200 dark:bg-slate-700">
                                <img 
                                    src={getImageUrl(photo.fileName)} 
                                    alt="Destination" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    onError={(e) => { e.target.src = 'https://placehold.co/400?text=Image+Not+Found' }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Travel Blogs */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Travel Blogs & Tips</h2>
                    <button 
                        onClick={() => setShowBlogForm(!showBlogForm)}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors font-medium text-sm"
                    >
                        <Plus className="w-4 h-4" /> Write Blog
                    </button>
                </div>

                {showBlogForm && (
                    <form onSubmit={handleAddBlog} className="mb-6 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4">
                        <input 
                            type="text" 
                            placeholder="Blog Title" 
                            required 
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                            value={newBlog.title} 
                            onChange={e => setNewBlog({...newBlog, title: e.target.value})} 
                        />
                        <textarea 
                            placeholder="Share your story..." 
                            required 
                            rows="5"
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                            value={newBlog.content} 
                            onChange={e => setNewBlog({...newBlog, content: e.target.value})} 
                        />
                        <textarea 
                            placeholder="Travel Tips (One per line)" 
                            rows="3"
                            className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500" 
                            value={newBlog.travelTips} 
                            onChange={e => setNewBlog({...newBlog, travelTips: e.target.value})} 
                        />
                        <div className="flex justify-end gap-2 mt-4">
                            <button type="button" onClick={() => setShowBlogForm(false)} className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                            <button type="submit" className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg">Publish Blog</button>
                        </div>
                    </form>
                )}

                {blogs.length === 0 ? (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border border-slate-100 dark:border-slate-700 text-center text-slate-500 dark:text-slate-400 shadow-sm">
                        No blogs written for this destination yet.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {blogs.map(blog => (
                            <div key={blog.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{blog.title}</h3>
                                <p className="text-slate-600 dark:text-slate-300 mb-4 whitespace-pre-wrap">{blog.content}</p>
                                {blog.travelTips && blog.travelTips.length > 0 && (
                                    <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-xl">
                                        <h4 className="font-semibold text-primary-900 dark:text-primary-300 mb-2">Travel Tips:</h4>
                                        <ul className="list-disc list-inside text-primary-800 dark:text-primary-400 space-y-1 text-sm">
                                            {blog.travelTips.map((tip, i) => <li key={i}>{tip}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Reviews</h2>
                
                {/* Add Review Form */}
                <form onSubmit={handleAddReview} className="mb-10 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Write a Review</h3>
                    <div className="flex gap-4 mb-4">
                        <select 
                            value={newReview.rating}
                            onChange={(e) => setNewReview({...newReview, rating: parseInt(e.target.value)})}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-2.5 font-medium shadow-sm outline-none"
                        >
                            <option value="5">5 Stars - Excellent</option>
                            <option value="4">4 Stars - Good</option>
                            <option value="3">3 Stars - Average</option>
                            <option value="2">2 Stars - Poor</option>
                            <option value="1">1 Star - Terrible</option>
                        </select>
                    </div>
                    <div className="relative">
                        <textarea 
                            className="block w-full p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-primary-500 focus:border-primary-500 shadow-sm outline-none resize-none"
                            rows="3"
                            placeholder="Share your experience..."
                            required
                            value={newReview.comment}
                            onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                        ></textarea>
                        <button type="submit" className="absolute bottom-4 right-4 bg-primary-600 hover:bg-primary-700 text-white p-2.5 rounded-full shadow-md transition-transform hover:scale-105">
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-slate-100 dark:border-slate-700 last:border-0 pb-6 last:pb-0">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center text-primary-600 dark:text-primary-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="font-medium text-slate-900 dark:text-white">User {review.userId}</div>
                                    <div className="flex text-amber-500 dark:text-amber-400 text-sm">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-700'}`} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-600 dark:text-slate-300 pl-13 ml-13">{review.comment}</p>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-slate-500 dark:text-slate-400 text-center">No reviews yet.</p>}
                </div>
            </div>

            {showUploadModal && (
                <UploadModal 
                    onClose={() => setShowUploadModal(false)} 
                    onSuccess={() => {
                        alert("Photo uploaded successfully!");
                        fetchData();
                    }} 
                    initialDestId={id}
                />
            )}
        </div>
    );
};

export default DestinationDetails;

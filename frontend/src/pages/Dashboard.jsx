import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationService, profileService } from '../services/api';
import { Search, MapPin, Star, Heart, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DestinationCard = ({ dest, user, handleAddFavorite, handleEditClick, handleDeleteClick }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        import('../services/api').then(({ galleryService }) => {
            galleryService.getByDestination(dest.id).then(res => {
                if (res.data && res.data.length > 0) {
                    setImageUrl(res.data[0].photoUrl);
                }
            }).catch(() => {});
        });
    }, [dest.id]);

    return (
        <div className="group bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col relative">
            <div className="h-48 bg-slate-900 relative overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={dest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.target.style.display='none' }} />
                ) : (
                    <>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-indigo-900 opacity-80 z-10"></div>
                        <img src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80" alt="Travel Background" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                        <div className="absolute inset-0 flex items-center justify-center text-white/50 z-20">
                            <MapPin className="w-12 h-12" />
                        </div>
                    </>
                )}
                <div className="absolute top-4 right-4 flex gap-2 z-30">
                    {user && (
                        <>
                            <button onClick={(e) => { e.preventDefault(); handleEditClick(dest); }} className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-slate-400 dark:text-slate-500 hover:text-blue-500 transition-colors shadow-sm">
                                <Edit className="w-4 h-4" />
                            </button>
                            <button onClick={(e) => { e.preventDefault(); handleDeleteClick(dest.id); }} className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-slate-400 dark:text-slate-500 hover:text-rose-500 transition-colors shadow-sm">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                    <button 
                        onClick={(e) => { e.preventDefault(); handleAddFavorite(dest.id); }}
                        className="p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-full text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shadow-sm"
                    >
                        <Heart className="w-5 h-5" />
                    </button>
                </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        <Link to={`/destination/${dest.id}`}>{dest.title}</Link>
                    </h3>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-1 rounded-md text-sm font-semibold shrink-0 ml-2">
                        <Star className="w-4 h-4 fill-current" />
                        {dest.rating ? dest.rating.toFixed(1) : 'New'}
                    </div>
                </div>
                <p className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-4 font-medium">
                    <MapPin className="w-4 h-4 shrink-0" /> <span className="truncate">{dest.location}, {dest.country}</span>
                </p>
                <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 mb-4 flex-grow">
                    {dest.description}
                </p>
                <div className="flex gap-2 flex-wrap mb-4">
                    {dest.tags?.map(t => {
                        const tagText = t.startsWith('#') ? t : `#${t}`;
                        return (
                            <span key={t} className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/30 px-2.5 py-1 rounded-md">
                                {tagText}
                            </span>
                        );
                    })}
                </div>
                <Link to={`/destination/${dest.id}`} className="block w-full text-center py-2.5 bg-slate-50 dark:bg-slate-700 hover:bg-primary-600 dark:hover:bg-primary-600 hover:text-white text-slate-700 dark:text-slate-200 font-medium rounded-xl transition-colors mt-auto">
                    Explore Details
                </Link>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { user } = useAuth();
    const [destinations, setDestinations] = useState([]);
    const [searchTag, setSearchTag] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentDestId, setCurrentDestId] = useState(null);
    const [destForm, setDestForm] = useState({ title: '', location: '', country: '', description: '', tags: '' });

    useEffect(() => {
        fetchDestinations();
    }, []);

    const fetchDestinations = async (tag = '') => {
        setLoading(true);
        try {
            const res = await destinationService.getAll(tag);
            setDestinations(res.data);
        } catch (error) {
            console.error("Error fetching destinations", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchDestinations(searchTag);
    };

    const handleAddFavorite = async (destId) => {
        if (!user) return alert("Please login to add favorites.");
        try {
            await profileService.addFavorite(user.id, destId);
            alert("Added to favorites!");
        } catch (error) {
            alert("Could not add to favorites. Maybe already added?");
        }
    };

    const openCreateModal = () => {
        setIsEditing(false);
        setDestForm({ title: '', location: '', country: '', description: '', tags: '' });
        setShowModal(true);
    };

    const openEditModal = (dest) => {
        setIsEditing(true);
        setCurrentDestId(dest.id);
        setDestForm({
            title: dest.title,
            location: dest.location,
            country: dest.country,
            description: dest.description,
            tags: dest.tags ? dest.tags.join(', ') : ''
        });
        setShowModal(true);
    };

    const handleSaveDest = async (e) => {
        e.preventDefault();
        const tagsArray = destForm.tags.split(',').map(t => t.trim().replace(/^#/, '')).filter(t => t);
        
        try {
            if (isEditing) {
                const res = await destinationService.update(currentDestId, { ...destForm, tags: tagsArray });
                setDestinations(destinations.map(d => d.id === currentDestId ? res.data : d));
            } else {
                const res = await destinationService.create({ ...destForm, tags: tagsArray });
                setDestinations([...destinations, res.data]);
            }
            setShowModal(false);
        } catch (err) {
            console.error("Failed to save", err);
            alert("Failed to save destination.");
        }
    };

    const handleDeleteDest = async (id) => {
        if (window.confirm("Are you sure you want to delete this destination? This action cannot be undone.")) {
            try {
                await destinationService.delete(id);
                setDestinations(destinations.filter(d => d.id !== id));
            } catch (err) {
                console.error("Failed to delete", err);
                alert("Failed to delete destination.");
            }
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Search Section */}
            <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col items-center text-center transition-colors">
                <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white mb-4 tracking-tight">
                    Discover Your Next Adventure
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl text-lg">
                    Explore trending destinations, read travel blogs, and plan your perfect trip with TripDiary.
                </p>
                
                <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-900 border-transparent rounded-full text-slate-900 dark:text-white placeholder-slate-400 focus:border-primary-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-4 focus:ring-primary-500/20 transition-all shadow-sm outline-none"
                        placeholder="Search by tag (e.g. beach, hiking)..."
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                    />
                    <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors shadow-md">
                        Search
                    </button>
                </form>
                
                <div className="flex gap-2 mt-6 flex-wrap justify-center">
                    {['beach', 'mountain', 'city', 'budget'].map(tag => (
                        <button 
                            key={tag} 
                            onClick={() => { setSearchTag(tag); fetchDestinations(tag); }}
                            className="px-4 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-primary-50 dark:hover:bg-primary-900/30 text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 rounded-full text-sm font-medium transition-colors"
                        >
                            #{tag}
                        </button>
                    ))}
                    {searchTag && (
                        <button onClick={() => { setSearchTag(''); fetchDestinations(''); }} className="px-4 py-1.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full text-sm font-medium hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Destinations Grid */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Trending Destinations</h2>
                    {user && (
                        <button 
                            onClick={openCreateModal}
                            className="flex items-center gap-1 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                        >
                            <Plus className="w-4 h-4" /> Add Destination
                        </button>
                    )}
                </div>
                
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map(dest => (
                            <DestinationCard 
                                key={dest.id} 
                                dest={dest} 
                                user={user}
                                handleAddFavorite={handleAddFavorite} 
                                handleEditClick={openEditModal}
                                handleDeleteClick={handleDeleteDest}
                            />
                        ))}
                        
                        {destinations.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
                                No destinations found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-xl">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            {isEditing ? 'Edit Destination' : 'Add New Destination'}
                        </h3>
                        <form onSubmit={handleSaveDest} className="space-y-4">
                            <input type="text" placeholder="Title" required className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white" value={destForm.title} onChange={e => setDestForm({...destForm, title: e.target.value})} />
                            <div className="flex gap-2">
                                <input type="text" placeholder="Location" required className="w-1/2 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white" value={destForm.location} onChange={e => setDestForm({...destForm, location: e.target.value})} />
                                <input type="text" placeholder="Country" required className="w-1/2 p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white" value={destForm.country} onChange={e => setDestForm({...destForm, country: e.target.value})} />
                            </div>
                            <textarea placeholder="Description" rows={3} required className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white" value={destForm.description} onChange={e => setDestForm({...destForm, description: e.target.value})} />
                            <input type="text" placeholder="Tags (comma separated)" className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white" value={destForm.tags} onChange={e => setDestForm({...destForm, tags: e.target.value})} />
                            <div className="flex justify-end gap-2 mt-6">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                                    {isEditing ? 'Save Changes' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

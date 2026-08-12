import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { destinationService, DEMO_USER_ID, profileService } from '../services/api';
import { Search, MapPin, Star, Heart } from 'lucide-react';

const Dashboard = () => {
    const [destinations, setDestinations] = useState([]);
    const [searchTag, setSearchTag] = useState('');
    const [loading, setLoading] = useState(true);

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
        try {
            await profileService.addFavorite(DEMO_USER_ID, destId);
            alert("Added to favorites!");
        } catch (error) {
            alert("Could not add to favorites. Maybe already added?");
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Search Section */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Discover Your Next Adventure
                </h1>
                <p className="text-slate-500 mb-8 max-w-2xl text-lg">
                    Explore trending destinations, read travel blogs, and plan your perfect trip with TripDiary.
                </p>
                
                <form onSubmit={handleSearch} className="w-full max-w-lg relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-transparent rounded-full text-slate-900 placeholder-slate-400 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/20 transition-all shadow-sm outline-none"
                        placeholder="Search by tag (e.g. #beach, #hiking)..."
                        value={searchTag}
                        onChange={(e) => setSearchTag(e.target.value)}
                    />
                    <button type="submit" className="absolute inset-y-2 right-2 px-6 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-medium transition-colors shadow-md">
                        Search
                    </button>
                </form>
                
                <div className="flex gap-2 mt-6 flex-wrap justify-center">
                    {['#beach', '#mountain', '#city', '#budget'].map(tag => (
                        <button 
                            key={tag} 
                            onClick={() => { setSearchTag(tag); fetchDestinations(tag); }}
                            className="px-4 py-1.5 bg-slate-100 hover:bg-primary-50 hover:text-primary-600 text-slate-600 rounded-full text-sm font-medium transition-colors"
                        >
                            {tag}
                        </button>
                    ))}
                    {searchTag && (
                        <button onClick={() => { setSearchTag(''); fetchDestinations(''); }} className="px-4 py-1.5 bg-rose-50 text-rose-600 rounded-full text-sm font-medium hover:bg-rose-100 transition-colors">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Destinations Grid */}
            <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Trending Destinations</h2>
                
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map(dest => (
                            <div key={dest.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                <div className="h-48 bg-slate-200 relative overflow-hidden">
                                    {/* Placeholder image pattern */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-indigo-100 opacity-50 group-hover:scale-105 transition-transform duration-500"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-primary-300">
                                        <MapPin className="w-12 h-12 opacity-50" />
                                    </div>
                                    <button 
                                        onClick={(e) => { e.preventDefault(); handleAddFavorite(dest.id); }}
                                        className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-slate-400 hover:text-rose-500 transition-colors shadow-sm"
                                    >
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                                            <Link to={`/destination/${dest.id}`}>{dest.title}</Link>
                                        </h3>
                                        <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-md text-sm font-semibold">
                                            <Star className="w-4 h-4 fill-current" />
                                            {dest.rating ? dest.rating.toFixed(1) : 'New'}
                                        </div>
                                    </div>
                                    <p className="flex items-center gap-1 text-slate-500 text-sm mb-4 font-medium">
                                        <MapPin className="w-4 h-4" /> {dest.location}, {dest.country}
                                    </p>
                                    <p className="text-slate-600 text-sm line-clamp-2 mb-4">
                                        {dest.description}
                                    </p>
                                    <div className="flex gap-2 flex-wrap mb-4">
                                        {dest.tags?.map(t => (
                                            <span key={t} className="text-xs font-medium text-primary-600 bg-primary-50 px-2.5 py-1 rounded-md">
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                    <Link to={`/destination/${dest.id}`} className="block w-full text-center py-2.5 bg-slate-50 hover:bg-primary-600 hover:text-white text-slate-700 font-medium rounded-xl transition-colors">
                                        Explore Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                        
                        {destinations.length === 0 && (
                            <div className="col-span-full py-12 text-center text-slate-500">
                                No destinations found matching your criteria.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

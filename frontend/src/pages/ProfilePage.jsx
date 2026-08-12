import { useState, useEffect } from 'react';
import { profileService, galleryService, DEMO_USER_ID, destinationService } from '../services/api';
import { User, Heart, Image as ImageIcon, CheckCircle, Upload } from 'lucide-react';
import UploadModal from '../components/UploadModal';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [visited, setVisited] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    
    // We fetch dest details for favorites/visited to show titles
    const [destMap, setDestMap] = useState({});

    useEffect(() => {
        fetchProfileData();
    }, []);

    const fetchProfileData = async () => {
        try {
            // First we need to create a user if not exists for demo
            let userData;
            try {
                const userRes = await profileService.getUser(DEMO_USER_ID);
                userData = userRes.data;
            } catch {
                const newUser = await profileService.createUser({
                    id: DEMO_USER_ID,
                    name: "Alex Traveler",
                    email: "alex@example.com"
                });
                userData = newUser.data;
            }
            setUser(userData);

            const [favRes, visRes, photosRes] = await Promise.all([
                profileService.getFavorites(DEMO_USER_ID),
                profileService.getVisitedPlaces(DEMO_USER_ID),
                galleryService.getByUser(DEMO_USER_ID)
            ]);
            
            setFavorites(favRes.data);
            setVisited(visRes.data);
            setPhotos(photosRes.data);
            
            // Fetch titles for favorite destinations
            const dMap = {};
            for (let f of favRes.data) {
                if (!dMap[f.destinationId]) {
                    const d = await destinationService.getById(f.destinationId);
                    dMap[f.destinationId] = d.data.title;
                }
            }
            setDestMap(dMap);

        } catch (error) {
            console.error("Error fetching profile", error);
        }
    };

    if (!user) return <div className="p-8 text-center">Loading profile...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
            {/* Profile Header */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                <div className="w-32 h-32 bg-gradient-to-tr from-primary-500 to-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-primary-50">
                    <User className="w-16 h-16" />
                </div>
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{user.name}</h1>
                    <p className="text-slate-500 mb-6 font-medium">{user.email}</p>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm">
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-2xl font-bold text-slate-800">{visited.length}</span>
                            <span className="text-slate-500 uppercase tracking-wider font-semibold text-xs">Places Visited</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-2xl font-bold text-slate-800">{favorites.length}</span>
                            <span className="text-slate-500 uppercase tracking-wider font-semibold text-xs">Saved Favorites</span>
                        </div>
                        <div className="flex flex-col items-center sm:items-start">
                            <span className="text-2xl font-bold text-slate-800">{photos.length}</span>
                            <span className="text-slate-500 uppercase tracking-wider font-semibold text-xs">Photos Uploaded</span>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setIsUploadOpen(true)}
                    className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full font-semibold transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                    <Upload className="w-5 h-5" />
                    Upload Photo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Favorites */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-rose-500" /> Saved Favorites
                    </h2>
                    <ul className="space-y-4">
                        {favorites.map(fav => (
                            <li key={fav.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 transition-colors">
                                <span className="font-semibold text-slate-700">{destMap[fav.destinationId] || 'Loading...'}</span>
                                <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full shadow-sm">
                                    Added {new Date(fav.addedAt).toLocaleDateString()}
                                </span>
                            </li>
                        ))}
                        {favorites.length === 0 && <p className="text-slate-500">No favorites saved yet.</p>}
                    </ul>
                </div>

                {/* Visited Places */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-emerald-500" /> Places Visited
                    </h2>
                    <ul className="space-y-4">
                        {visited.map(place => (
                            <li key={place.id} className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="font-bold text-emerald-900">{place.placeName}, {place.country}</span>
                                    <span className="text-xs text-emerald-600 bg-white px-2 py-1 rounded-md font-medium shadow-sm">
                                        {place.visitedDate}
                                    </span>
                                </div>
                                {place.notes && <p className="text-sm text-emerald-700 italic">"{place.notes}"</p>}
                            </li>
                        ))}
                        {visited.length === 0 && <p className="text-slate-500">No places marked as visited.</p>}
                    </ul>
                </div>
            </div>

            {/* My Gallery */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <ImageIcon className="w-6 h-6 text-primary-500" /> My Photo Gallery
                </h2>
                {photos.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                        <p className="text-slate-500 mb-4">No photos uploaded yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100 group">
                                <img 
                                    src={photo.photoUrl} 
                                    alt="User Upload" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isUploadOpen && (
                <UploadModal 
                    onClose={() => setIsUploadOpen(false)} 
                    onSuccess={fetchProfileData}
                />
            )}
        </div>
    );
};

export default ProfilePage;

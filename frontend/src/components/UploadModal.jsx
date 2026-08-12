import { useState, useEffect } from 'react';
import { galleryService, destinationService, DEMO_USER_ID } from '../services/api';
import { X, UploadCloud, Loader2 } from 'lucide-react';

const UploadModal = ({ onClose, onSuccess }) => {
    const [file, setFile] = useState(null);
    const [destinations, setDestinations] = useState([]);
    const [selectedDestId, setSelectedDestId] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const fetchDests = async () => {
            const res = await destinationService.getAll();
            setDestinations(res.data);
            if (res.data.length > 0) setSelectedDestId(res.data[0].id);
        };
        fetchDests();
    }, []);

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !selectedDestId) return;

        setUploading(true);
        try {
            await galleryService.upload(file, DEMO_USER_ID, selectedDestId);
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Make sure the API gateway and gallery service are running.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex justify-center items-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-xl font-bold text-slate-800">Upload Photo</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <form onSubmit={handleUpload} className="p-6">
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Select Destination</label>
                        <select 
                            value={selectedDestId}
                            onChange={(e) => setSelectedDestId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-primary-500 focus:border-primary-500 block p-3 shadow-sm outline-none"
                            required
                        >
                            {destinations.map(d => (
                                <option key={d.id} value={d.id}>{d.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Photo</label>
                        <div className="flex items-center justify-center w-full">
                            <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${file ? 'border-primary-500 bg-primary-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                                    <UploadCloud className={`w-10 h-10 mb-3 ${file ? 'text-primary-500' : 'text-slate-400'}`} />
                                    {file ? (
                                        <p className="text-sm font-semibold text-primary-700">{file.name}</p>
                                    ) : (
                                        <>
                                            <p className="mb-2 text-sm text-slate-600"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                            <p className="text-xs text-slate-400">PNG, JPG or GIF (MAX. 10MB)</p>
                                        </>
                                    )}
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    required
                                />
                            </label>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={uploading || !file}
                        className="w-full flex items-center justify-center gap-2 text-white bg-primary-600 hover:bg-primary-700 disabled:bg-primary-300 focus:ring-4 focus:ring-primary-500/20 font-bold rounded-xl text-lg px-5 py-3.5 text-center transition-all shadow-md"
                    >
                        {uploading ? (
                            <><Loader2 className="w-5 h-5 animate-spin" /> Uploading...</>
                        ) : (
                            'Upload Photo'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadModal;

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', bio: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        const result = await register(formData);
        if (result.success) {
            alert('Account created successfully! Please log in.');
            navigate('/login');
        } else {
            setError(result.error || 'Failed to register');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Create an account</h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Join TripDiary to share your travel experiences</p>
                </div>
                
                {error && (
                    <div className="p-4 text-sm text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-400 rounded-lg">
                        {error}
                    </div>
                )}
                
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Full Name
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Email address
                        </label>
                        <div className="relative mt-2 rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-slate-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 sm:text-sm border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                            Short Bio (Optional)
                        </label>
                        <div className="mt-2">
                            <textarea
                                id="bio"
                                name="bio"
                                rows={3}
                                value={formData.bio}
                                onChange={handleChange}
                                className="block w-full px-3 py-2.5 sm:text-sm border-slate-300 dark:border-slate-600 rounded-lg focus:ring-primary-500 focus:border-primary-500 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
                                placeholder="Tell us about your travels..."
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-70 transition-colors dark:focus:ring-offset-slate-800"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5" /> : (
                            <>
                                Sign up <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </button>
                </form>
                
                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                        Sign in instead
                    </Link>
                </p>
            </div>
        </div>
    );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Profile = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        income: '',
        employmentType: 'SALARIED'
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/profile/${user.username}`);
            setFormData({
                fullName: res.data.fullName || '',
                phone: res.data.phone || '',
                income: res.data.income || '',
                employmentType: res.data.employmentType || 'SALARIED'
            });
            setLoading(false);
        } catch (error) {
            console.error("Error fetching profile", error);
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/api/profile/${user.username}`, formData);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error("Error updating profile", error);
            alert('Failed to update profile');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">My Profile</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">Dashboard</button>
                            <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="text-red-500 hover:text-red-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 bg-blue-600">
                        <h2 className="text-xl font-bold text-white">Edit Profile</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Monthly Income ($)</label>
                            <input type="number" name="income" value={formData.income} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                            <select name="employmentType" value={formData.employmentType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                <option value="SALARIED">Salaried</option>
                                <option value="SELF_EMPLOYED">Self Employed</option>
                                <option value="UNEMPLOYED">Unemployed</option>
                            </select>
                        </div>
                        <div className="flex justify-end pt-4">
                            <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Save Changes</button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Profile;

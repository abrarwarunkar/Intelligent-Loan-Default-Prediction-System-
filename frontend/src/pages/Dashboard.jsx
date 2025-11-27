import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [loans, setLoans] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/loan/my-loans?username=${user.username}`);
            setLoans(res.data);
        } catch (error) {
            console.error("Error fetching loans", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">My Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600">Welcome, {user?.username}</span>
                            <Link to="/profile" className="text-blue-600 hover:text-blue-800">Profile</Link>
                            <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="text-red-500 hover:text-red-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">My Loan Applications</h2>
                        <Link to="/apply" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Apply for Loan</Link>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {loans.length === 0 ? (
                                <li className="px-6 py-4 text-center text-gray-500">No loan applications found.</li>
                            ) : (
                                loans.map((loan) => (
                                    <li key={loan.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/application/${loan.id}`)}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600">Loan #{loan.id}</p>
                                                <p className="text-sm text-gray-500">Amount: ${loan.loanAmount}</p>
                                                <p className="text-sm text-gray-500">Date: {new Date(loan.applicationDate).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {loan.status}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;

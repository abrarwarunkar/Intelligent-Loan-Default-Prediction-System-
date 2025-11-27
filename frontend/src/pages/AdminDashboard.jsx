import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const AdminDashboard = () => {
    const [loans, setLoans] = useState([]);
    const [monthlyTrends, setMonthlyTrends] = useState({});
    const [riskDist, setRiskDist] = useState({});
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'ADMIN') {
            navigate('/');
        }
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const loansRes = await axios.get('http://localhost:8081/api/loan/all');
            setLoans(loansRes.data);

            const trendsRes = await axios.get('http://localhost:8081/api/admin/analytics/monthly');
            setMonthlyTrends(trendsRes.data);

            const riskRes = await axios.get('http://localhost:8081/api/admin/analytics/risk');
            setRiskDist(riskRes.data);
        } catch (error) {
            console.error("Error fetching admin data", error);
        }
    };

    const handleExport = async () => {
        try {
            const response = await axios.get('http://localhost:8081/api/admin/export', {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'loan_applications.csv');
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error exporting data", error);
        }
    };

    // Analytics Data Preparation
    const statusCounts = {
        APPROVED: loans.filter(l => l.status === 'APPROVED').length,
        REJECTED: loans.filter(l => l.status === 'REJECTED').length,
        PENDING: loans.filter(l => l.status === 'PENDING').length,
    };

    const pieData = {
        labels: ['Approved', 'Rejected', 'Pending'],
        datasets: [
            {
                data: [statusCounts.APPROVED, statusCounts.REJECTED, statusCounts.PENDING],
                backgroundColor: ['#10B981', '#EF4444', '#F59E0B'],
                hoverBackgroundColor: ['#059669', '#DC2626', '#D97706'],
            },
        ],
    };

    const barData = {
        labels: ['High', 'Medium', 'Low'],
        datasets: [
            {
                label: 'Risk Distribution',
                data: [riskDist.High || 0, riskDist.Medium || 0, riskDist.Low || 0],
                backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
            },
        ],
    };

    const lineData = {
        labels: Object.keys(monthlyTrends).sort(),
        datasets: [
            {
                label: 'Monthly Applications',
                data: Object.keys(monthlyTrends).sort().map(key => monthlyTrends[key]),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <h1 className="text-xl font-bold text-gray-800">Admin Analytics Dashboard</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <button onClick={handleExport} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Export CSV</button>
                            <span className="text-gray-600">Admin</span>
                            <button onClick={() => { localStorage.removeItem('user'); navigate('/'); }} className="text-red-500 hover:text-red-700">Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">Loan Status</h3>
                            <div className="h-64 flex justify-center">
                                <Pie data={pieData} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">Risk Profile</h3>
                            <div className="h-64 flex justify-center">
                                <Bar options={{ responsive: true, maintainAspectRatio: false }} data={barData} />
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow">
                            <h3 className="text-lg font-bold mb-4 text-gray-700">Monthly Trends</h3>
                            <div className="h-64 flex justify-center">
                                <Line options={{ responsive: true, maintainAspectRatio: false }} data={lineData} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Applications</h3>
                        </div>
                        <div className="border-t border-gray-200">
                            <ul className="divide-y divide-gray-200">
                                {loans.slice(0, 5).map((loan) => (
                                    <li key={loan.id} className="px-6 py-4 hover:bg-gray-50 cursor-pointer" onClick={() => navigate(`/application/${loan.id}`)}>
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-blue-600">Application #{loan.id}</p>
                                                <p className="text-sm text-gray-500">Applicant: {loan.user?.username}</p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500 mr-4">${loan.loanAmount}</span>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${loan.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    loan.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {loan.status}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;


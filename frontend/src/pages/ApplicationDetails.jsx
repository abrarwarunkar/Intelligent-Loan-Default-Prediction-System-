import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ApplicationDetails = ({ showToast }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [risk, setRisk] = useState(null);
    const [loading, setLoading] = useState(true);
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchApplication();
    }, [id]);

    const fetchApplication = async () => {
        try {
            const res = await axios.get(`http://localhost:8081/api/loan/${id}`);
            setApplication(res.data);

            // Fetch risk info if available (or if user is admin)
            try {
                const riskRes = await axios.get(`http://localhost:8081/api/loan/${id}/risk`);
                setRisk(riskRes.data);
            } catch (e) {
                console.log("Risk info not available yet");
            }

            setLoading(false);
        } catch (error) {
            console.error("Error fetching application", error);
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (status) => {
        try {
            await axios.put(`http://localhost:8081/api/loan/${id}/status?status=${status}`);
            if (showToast) showToast(`Application ${status}`, 'success');
            else alert(`Application ${status}`);
            fetchApplication(); // Refresh
        } catch (error) {
            if (showToast) showToast('Error updating status', 'error');
            else alert('Error updating status');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!application) return <div className="p-8 text-center">Application not found</div>;

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-blue-600 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">Application #{application.id}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                            application.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                        {application.status}
                    </span>
                </div>

                <div className="p-6 space-y-6">
                    {/* Risk Assessment (Visible to Admin or if status is processed) */}
                    {risk && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Risk Assessment</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-gray-500">Risk Level:</span>
                                    <span className={`ml-2 font-bold ${risk.riskLevel === 'High' ? 'text-red-600' : 'text-green-600'}`}>{risk.riskLevel}</span>
                                </div>
                                <div>
                                    <span className="text-gray-500">Default Probability:</span>
                                    <span className="ml-2 font-medium">{(risk.defaultProbability * 100).toFixed(2)}%</span>
                                </div>
                            </div>
                            {/* SHAP Explanation */}
                            <div className="mt-4">
                                <h4 className="text-sm font-semibold text-gray-700">Key Factors (SHAP):</h4>
                                <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto">
                                    {JSON.stringify(JSON.parse(risk.explanation || '{}'), null, 2)}
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-gray-500">Applicant:</span> <span className="font-medium">{application.user?.username}</span></div>
                            <div><span className="text-gray-500">Age:</span> <span className="font-medium">{application.age}</span></div>
                            <div><span className="text-gray-500">Marital Status:</span> <span className="font-medium">{application.maritalStatus || 'N/A'}</span></div>
                            <div><span className="text-gray-500">Dependents:</span> <span className="font-medium">{application.dependents || 0}</span></div>
                            <div><span className="text-gray-500">Job Type:</span> <span className="font-medium">{application.jobType || 'N/A'}</span></div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Financial Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-gray-500">Monthly Income:</span> <span className="font-medium">${application.income}</span></div>
                            <div><span className="text-gray-500">Existing EMIs:</span> <span className="font-medium">${application.existingEmis || 0}</span></div>
                            <div><span className="text-gray-500">Monthly Expenses:</span> <span className="font-medium">${application.monthlyExpenses || 0}</span></div>
                            <div><span className="text-gray-500">Credit Score:</span> <span className="font-medium">{application.creditScore}</span></div>
                            <div><span className="text-gray-500">DTI Ratio:</span> <span className="font-medium">{application.dtiRatio}</span></div>
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Loan Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div><span className="text-gray-500">Loan Amount:</span> <span className="font-medium">${application.loanAmount}</span></div>
                            <div><span className="text-gray-500">Loan Term:</span> <span className="font-medium">{application.loanTerm} months</span></div>
                            <div><span className="text-gray-500">Interest Rate:</span> <span className="font-medium">{application.interestRate}%</span></div>
                            <div><span className="text-gray-500">Purpose:</span> <span className="font-medium">{application.loanPurpose || 'N/A'}</span></div>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {user?.role === 'ADMIN' && application.status === 'PENDING' && (
                        <div className="flex justify-end space-x-4 border-t pt-4">
                            <button onClick={() => handleStatusUpdate('REJECTED')} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Reject</button>
                            <button onClick={() => handleStatusUpdate('APPROVED')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <button onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Back</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetails;

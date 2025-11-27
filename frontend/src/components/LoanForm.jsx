import { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import { useNavigate } from 'react-router-dom';

const LoanForm = ({ showToast }) => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const [formData, setFormData] = useState({
        age: 30,
        maritalStatus: 'SINGLE',
        dependents: 0,
        jobType: 'SALARIED',
        income: 5000,
        existingEmis: 0,
        monthlyExpenses: 2000,
        creditScore: 700,
        monthsEmployed: 24,
        numCreditLines: 5,
        loanAmount: 10000,
        loanTerm: 36,
        interestRate: 10.0,
        loanPurpose: 'PERSONAL',
        dtiRatio: 0.3
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/loan/apply?username=${user.username}`, formData);
            showToast('Application submitted successfully!', 'success');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            showToast('Error submitting application', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 bg-blue-600">
                    <h2 className="text-xl font-bold text-white">Comprehensive Loan Application</h2>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Personal Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Personal Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Marital Status</label>
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="SINGLE">Single</option>
                                    <option value="MARRIED">Married</option>
                                    <option value="DIVORCED">Divorced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Dependents</label>
                                <input type="number" name="dependents" value={formData.dependents} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Job Type</label>
                                <select name="jobType" value={formData.jobType} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="SALARIED">Salaried</option>
                                    <option value="SELF_EMPLOYED">Self Employed</option>
                                    <option value="BUSINESS">Business Owner</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Financial Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Financial Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monthly Income ($)</label>
                                <input type="number" name="income" value={formData.income} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Existing EMIs ($)</label>
                                <input type="number" name="existingEmis" value={formData.existingEmis} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Monthly Expenses ($)</label>
                                <input type="number" name="monthlyExpenses" value={formData.monthlyExpenses} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Credit Score</label>
                                <input type="number" name="creditScore" value={formData.creditScore} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Months Employed</label>
                                <input type="number" name="monthsEmployed" value={formData.monthsEmployed} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Credit Lines</label>
                                <input type="number" name="numCreditLines" value={formData.numCreditLines} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                        </div>
                    </div>

                    {/* Loan Details */}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Loan Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Amount ($)</label>
                                <input type="number" name="loanAmount" value={formData.loanAmount} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Term (Months)</label>
                                <input type="number" name="loanTerm" value={formData.loanTerm} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Interest Rate (%)</label>
                                <input type="number" step="0.1" name="interestRate" value={formData.interestRate} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loan Purpose</label>
                                <select name="loanPurpose" value={formData.loanPurpose} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                                    <option value="PERSONAL">Personal</option>
                                    <option value="HOME">Home</option>
                                    <option value="EDUCATION">Education</option>
                                    <option value="BUSINESS">Business</option>
                                    <option value="CAR">Car</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700">DTI Ratio (0-1) - Calculated automatically in real app</label>
                                <input type="number" step="0.01" name="dtiRatio" value={formData.dtiRatio} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button type="button" onClick={() => navigate('/dashboard')} className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                        <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Submit Application</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoanForm;

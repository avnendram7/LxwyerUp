import { Scale, LogOut, User, Briefcase, Calendar, FileText, Clock, CheckCircle } from 'lucide-react';
import { StatCard, CorporateBadge, SimpleCard } from '../components/CorporateComponents';

export default function FirmClientDashboardDemo() {
  const client = {
    id: 'demo123',
    full_name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    law_firm_name: 'Shah & Associates',
    case_type: 'civil',
    assigned_lawyer_name: 'Adv. Priya Sharma',
    created_at: '2025-01-10T00:00:00'
  };

  const caseUpdates = [
    {
      id: '1',
      update_type: 'hearing_date',
      title: 'Court Hearing Scheduled',
      description: 'Your court hearing has been scheduled for January 30, 2025 at 10:00 AM in Civil Court, Mumbai',
      created_at: '2025-01-20T10:00:00',
      created_by: 'Adv. Priya Sharma'
    },
    {
      id: '2',
      update_type: 'document_submitted',
      title: 'Documents Submitted to Court',
      description: 'All required documents have been submitted to the court. Waiting for review.',
      created_at: '2025-01-18T15:30:00',
      created_by: 'Adv. Priya Sharma'
    },
    {
      id: '3',
      update_type: 'meeting_scheduled',
      title: 'Meeting with Lawyer',
      description: 'Initial consultation meeting completed. Next review meeting scheduled for January 25, 2025 at 3:00 PM',
      created_at: '2025-01-15T09:00:00',
      created_by: 'Manager - Shah & Associates'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 to-blue-900 border-b border-blue-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Lxwyer Up</h1>
                <p className="text-xs text-blue-300">Client Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{client.full_name}</p>
                <p className="text-xs text-blue-300">{client.email}</p>
              </div>
              <button className="p-2 text-blue-300 hover:text-white transition-colors hover:bg-slate-700 rounded-lg">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            Welcome back, Rajesh
          </h2>
          <p className="text-blue-200">
            Here's an overview of your case progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Briefcase className="w-8 h-8 text-white" />
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-green-100 text-sm mb-1">Case Status</p>
            <p className="text-2xl font-bold text-white">Active</p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <p className="text-blue-100 text-sm mb-1">Next Hearing</p>
            <p className="text-xl font-bold text-white">Jan 30, 2025</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <p className="text-purple-100 text-sm mb-1">Documents</p>
            <p className="text-2xl font-bold text-white">12</p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl p-6 shadow-xl transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-white" />
            </div>
            <p className="text-orange-100 text-sm mb-1">Days Active</p>
            <p className="text-2xl font-bold text-white">45</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Case Updates */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-900">Case Updates</h3>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">3 Updates</span>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-slate-900 font-bold">Court Hearing Scheduled</h4>
                        <span className="text-xs text-slate-600 bg-white px-2 py-1 rounded">1/20/2025</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">Your court hearing has been scheduled for January 30, 2025 at 10:00 AM in Civil Court, Mumbai</p>
                      <p className="text-xs text-slate-600">By: Adv. Priya Sharma</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-slate-900 font-bold">Documents Submitted to Court</h4>
                        <span className="text-xs text-slate-600 bg-white px-2 py-1 rounded">1/18/2025</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">All required documents have been submitted to the court. Waiting for review.</p>
                      <p className="text-xs text-slate-600">By: Adv. Priya Sharma</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 border-l-4 border-purple-500 rounded-lg p-4 hover:shadow-md transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="text-slate-900 font-bold">Meeting with Lawyer</h4>
                        <span className="text-xs text-slate-600 bg-white px-2 py-1 rounded">1/15/2025</span>
                      </div>
                      <p className="text-sm text-slate-700 mb-2">Initial consultation meeting completed. Next review meeting scheduled for January 25, 2025 at 3:00 PM</p>
                      <p className="text-xs text-slate-600">By: Manager - Shah & Associates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Assigned Lawyer */}
            <div className="bg-white rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Assigned Lawyer</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Adv. Priya Sharma</p>
                    <p className="text-sm text-indigo-600 font-semibold">Civil Law</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t-2 border-slate-200 space-y-3">
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold mb-1">Experience</p>
                    <p className="text-sm text-slate-900 font-bold">12+ years</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold mb-1">Phone</p>
                    <p className="text-sm text-slate-900 font-bold">+91 98765 43210</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 font-semibold mb-1">Email</p>
                    <p className="text-sm text-indigo-600 font-bold">priya@shahandassociates.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Information */}
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-white mb-4">Case Information</h3>
              <div className="space-y-3">
                <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                  <p className="text-xs text-blue-300 font-semibold mb-1">Law Firm</p>
                  <p className="text-sm text-white font-bold">Shah & Associates</p>
                </div>
                <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                  <p className="text-xs text-blue-300 font-semibold mb-1">Case Type</p>
                  <p className="text-sm text-white font-bold">Civil Law</p>
                </div>
                <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                  <p className="text-xs text-blue-300 font-semibold mb-1">Status</p>
                  <span className="inline-block px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">Active</span>
                </div>
                <div className="bg-white bg-opacity-10 p-3 rounded-lg">
                  <p className="text-xs text-blue-300 font-semibold mb-1">Started On</p>
                  <p className="text-sm text-white font-bold">Jan 10, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

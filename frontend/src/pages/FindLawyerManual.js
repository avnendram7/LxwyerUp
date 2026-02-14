import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scale, Search, Filter, X, Briefcase, MapPin, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { CorporateButton, CorporateInput, CorporateBadge } from '../components/CorporateComponents';
import { dummyLawyers, states, specializations, searchLawyers } from '../data/lawyersData';

export default function FindLawyerManual() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    specialization: '',
    court: '',
    minRating: 0
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const lawyersPerPage = 20;

  // Search and filter lawyers
  const filteredLawyers = searchLawyers(searchQuery, filters);

  // Pagination
  const totalPages = Math.ceil(filteredLawyers.length / lawyersPerPage);
  const startIndex = (currentPage - 1) * lawyersPerPage;
  const endIndex = startIndex + lawyersPerPage;
  const currentLawyers = filteredLawyers.slice(startIndex, endIndex);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      city: '',
      specialization: '',
      court: '',
      minRating: 0
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleBookConsultation = (lawyer) => {
    navigate('/book-consultation-signup', { state: { lawyer } });
  };

  const getCities = () => {
    if (!filters.state) return [];
    return states[filters.state]?.cities || [];
  };

  const getCourts = () => {
    if (!filters.state) return [];
    return states[filters.state]?.courts || [];
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => navigate('/find-lawyer')}
              className="flex items-center space-x-3 text-white hover:text-blue-500 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">Lxwyer Up</span>
            </button>

            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/find-lawyer/ai')}
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                Try AI Assistant
              </button>
              <button
                onClick={() => navigate('/role-selection?mode=login')}
                className="text-slate-400 hover:text-white transition-colors"
              >
                Login
              </button>
              <CorporateButton
                variant="primary"
                onClick={() => navigate('/user-signup')}
              >
                Sign Up
              </CorporateButton>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, specialization, or location..."
                  className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-600 transition-colors"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-slate-900 border border-slate-700 hover:border-blue-600 text-white rounded-lg flex items-center gap-2 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-500 hover:text-blue-400"
                >
                  Clear All
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">State</label>
                  <select
                    value={filters.state}
                    onChange={(e) => {
                      handleFilterChange('state', e.target.value);
                      handleFilterChange('city', '');
                      handleFilterChange('court', '');
                    }}
                    className="w-full px-4 py-2 bg-black border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="">All States</option>
                    {Object.keys(states).map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">City</label>
                  <select
                    value={filters.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    disabled={!filters.state}
                    className="w-full px-4 py-2 bg-black border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-600 disabled:opacity-50"
                  >
                    <option value="">All Cities</option>
                    {getCities().map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* Specialization */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Specialization</label>
                  <select
                    value={filters.specialization}
                    onChange={(e) => handleFilterChange('specialization', e.target.value)}
                    className="w-full px-4 py-2 bg-black border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="">All Specializations</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Court */}
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2">Court</label>
                  <select
                    value={filters.court}
                    onChange={(e) => handleFilterChange('court', e.target.value)}
                    disabled={!filters.state}
                    className="w-full px-4 py-2 bg-black border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-600 disabled:opacity-50"
                  >
                    <option value="">All Courts</option>
                    {getCourts().map(court => (
                      <option key={court} value={court}>{court}</option>
                    ))}
                  </select>
                </div>

              </div>
            </div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-slate-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredLawyers.length)} of {filteredLawyers.length} lawyers
          </div>
        </div>

        {/* Lawyer Grid */}
        {currentLawyers.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {currentLawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-5 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={lawyer.photo}
                      alt={lawyer.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-semibold text-white truncate">{lawyer.name}</h3>
                      <p className="text-xs text-slate-400 truncate">{lawyer.specialization}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Briefcase className="w-4 h-4 flex-shrink-0" />
                      {lawyer.experience}yrs
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{lawyer.city}, {lawyer.state}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedLawyer(lawyer)}
                      className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleBookConsultation(lawyer)}
                      className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      Book
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {[...Array(Math.min(totalPages, 5))].map((_, idx) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = idx + 1;
                    } else if (currentPage <= 3) {
                      pageNum = idx + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + idx;
                    } else {
                      pageNum = currentPage - 2 + idx;
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg transition-colors ${currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No lawyers found</h3>
            <p className="text-slate-400 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Lawyer Profile Modal */}
      {selectedLawyer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-semibold text-white">Lawyer Profile</h2>
                <button
                  onClick={() => setSelectedLawyer(null)}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex items-start gap-6 mb-6">
                <img
                  src={selectedLawyer.photo}
                  alt={selectedLawyer.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedLawyer.name}</h3>
                  <p className="text-slate-400 mb-3">{selectedLawyer.specialization}</p>
                  <div className="flex items-center gap-4">
                    <CorporateBadge variant="info">{selectedLawyer.experience} Years</CorporateBadge>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-2">About</h4>
                  <p className="text-white">{selectedLawyer.bio}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Location</h4>
                    <p className="text-white">{selectedLawyer.city}, {selectedLawyer.state}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-slate-400 mb-1">Court</h4>
                    <p className="text-white text-sm">{selectedLawyer.court}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Languages</h4>
                  <p className="text-white">{selectedLawyer.languages.join(', ')}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Consultation Fee</h4>
                  <p className="text-white">{selectedLawyer.fee}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Experience</h4>
                  <p className="text-white">{selectedLawyer.experience}+ years of practice</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-400 mb-1">Bar Council ID</h4>
                  <p className="text-white">{selectedLawyer.bar_council}</p>
                </div>
              </div>

              <CorporateButton
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleBookConsultation(selectedLawyer)}
              >
                Book Consultation
                <ArrowRight className="w-5 h-5" />
              </CorporateButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

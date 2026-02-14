import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, MapPin, Users, Award, ArrowRight, Filter, Search as SearchIcon, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { API } from '../App';

export default function FindLawFirmManual() {
  const navigate = useNavigate();
  const [lawFirms, setLawFirms] = useState([]);
  const [filteredFirms, setFilteredFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  const specializations = [
    'all',
    'Civil Law',
    'Criminal Law',
    'Corporate Law',
    'Family Law',
    'Property Law',
    'Intellectual Property',
    'Tax Law',
    'Labor Law'
  ];

  // Dummy law firms data
  // Dummy law firms data
  const dummyFirms = [
    {
      id: 'dummy_manual_firm_1',
      firm_name: 'Dummy Manual Firm',
      city: 'Delhi',
      state: 'Delhi',
      specialization: ['Civil Law', 'Criminal Law'],
      total_lawyers: 10,
      established_year: 2020,
      cases_handled: 100,
      consultation_fee: 2000,
      description: 'This is a dummy firm for demonstration purposes.'
    }
  ];

  useEffect(() => {
    fetchLawFirms();
  }, []);

  const fetchLawFirms = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API}/lawfirms/approved`);
      // Combine real data with dummy data
      const combinedFirms = [...dummyFirms, ...response.data];
      setLawFirms(combinedFirms);
      setFilteredFirms(combinedFirms);
    } catch (error) {
      console.error('Error fetching law firms:', error);
      // Use dummy data if API fails
      setLawFirms(dummyFirms);
      setFilteredFirms(dummyFirms);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterFirms();
  }, [searchQuery, selectedSpecialization, lawFirms]);

  const filterFirms = () => {
    let filtered = [...lawFirms];

    if (searchQuery) {
      filtered = filtered.filter(firm =>
        firm.firm_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        firm.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        firm.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedSpecialization !== 'all') {
      filtered = filtered.filter(firm =>
        firm.specialization?.includes(selectedSpecialization)
      );
    }

    setFilteredFirms(filtered);
  };

  const handleJoinFirm = (firm) => {
    navigate('/join-lawfirm-signup', { state: { firm } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Law Firm</h1>
          <p className="text-xl text-slate-400">Connect with established law firms across India</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by firm name or location..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Specialization Filter */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
              >
                {specializations.map(spec => (
                  <option key={spec} value={spec}>
                    {spec === 'all' ? 'All Specializations' : spec}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-slate-400">
            Showing <span className="text-white font-semibold">{filteredFirms.length}</span> law firm{filteredFirms.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Law Firms Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 mt-4">Loading law firms...</p>
          </div>
        ) : filteredFirms.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No law firms found matching your criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFirms.map((firm, index) => (
              <motion.div
                key={firm.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/50 transition-all"
              >
                {/* Firm Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{firm.firm_name}</h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-400 text-sm mb-4 line-clamp-2">{firm.description}</p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-xs">Lawyers</span>
                    </div>
                    <p className="text-white font-bold">{firm.total_lawyers}+</p>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-slate-400 mb-1">
                      <Award className="w-4 h-4" />
                      <span className="text-xs">Since</span>
                    </div>
                    <p className="text-white font-bold">{firm.established_year}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{firm.city}, {firm.state}</span>
                </div>

                {/* Specializations */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {firm.specialization?.slice(0, 2).map((spec, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">
                      {spec}
                    </span>
                  ))}
                  {firm.specialization?.length > 2 && (
                    <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded-lg text-xs">
                      +{firm.specialization.length - 2} more
                    </span>
                  )}
                </div>

                {/* Fee & Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div>
                    <p className="text-xs text-slate-500">Consultation Fee</p>
                    <p className="text-xl font-bold text-blue-400">₹{firm.consultation_fee}</p>
                  </div>
                  <button
                    onClick={() => handleJoinFirm(firm)}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
                  >
                    Join
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

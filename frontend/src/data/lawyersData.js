// Comprehensive Dummy Lawyer Data for Lxwyer Up - 500 Lawyers

const firstNames = [
  'Rajesh', 'Priya', 'Amit', 'Neha', 'Vikram', 'Sunita', 'Arun', 'Kavita', 'Sanjay', 'Meera',
  'Rahul', 'Anjali', 'Deepak', 'Pooja', 'Suresh', 'Rekha', 'Vivek', 'Anita', 'Manish', 'Seema',
  'Rakesh', 'Shweta', 'Ajay', 'Nisha', 'Vijay', 'Ritu', 'Ashok', 'Divya', 'Ramesh', 'Sarita',
  'Karan', 'Jyoti', 'Nikhil', 'Preeti', 'Gaurav', 'Shruti', 'Alok', 'Swati', 'Mohit', 'Pallavi',
  'Rohit', 'Megha', 'Tarun', 'Sneha', 'Pankaj', 'Komal', 'Harsh', 'Tanvi', 'Vishal', 'Sakshi'
];

const lastNames = [
  'Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Malhotra', 'Kapoor', 'Agarwal', 'Jain', 'Patel',
  'Shah', 'Mehta', 'Reddy', 'Nair', 'Khanna', 'Bhatia', 'Chopra', 'Bansal', 'Saxena', 'Yadav',
  'Mishra', 'Pandey', 'Dubey', 'Srivastava', 'Tiwari', 'Chauhan', 'Rathore', 'Arora', 'Sethi', 'Dhawan',
  'Bajaj', 'Goyal', 'Ahuja', 'Mehra', 'Tandon', 'Kaul', 'Dua', 'Vohra', 'Grover', 'Bhargava'
];

const specializations = [
  'Criminal Law', 'Civil Law', 'Family Law', 'Property Law', 'Corporate Law',
  'Tax Law', 'Labour Law', 'Consumer Law', 'Constitutional Law', 'Intellectual Property',
  'Banking Law', 'Cyber Law', 'Immigration Law', 'Environmental Law', 'Medical Negligence'
];

const cities = [
  { city: 'New Delhi', state: 'Delhi' },
  { city: 'North Delhi', state: 'Delhi' },
  { city: 'South Delhi', state: 'Delhi' },
  { city: 'West Delhi', state: 'Delhi' },
  { city: 'East Delhi', state: 'Delhi' },
  { city: 'Mumbai', state: 'Maharashtra' },
  { city: 'Pune', state: 'Maharashtra' },
  { city: 'Nagpur', state: 'Maharashtra' },
  { city: 'Bangalore', state: 'Karnataka' },
  { city: 'Chennai', state: 'Tamil Nadu' },
  { city: 'Kolkata', state: 'West Bengal' },
  { city: 'Hyderabad', state: 'Telangana' },
  { city: 'Ahmedabad', state: 'Gujarat' },
  { city: 'Lucknow', state: 'Uttar Pradesh' },
  { city: 'Noida', state: 'Uttar Pradesh' },
  { city: 'Ghaziabad', state: 'Uttar Pradesh' },
  { city: 'Varanasi', state: 'Uttar Pradesh' },
  { city: 'Gurgaon', state: 'Haryana' },
  { city: 'Faridabad', state: 'Haryana' },
  { city: 'Chandigarh', state: 'Punjab' },
  { city: 'Jaipur', state: 'Rajasthan' },
  { city: 'Indore', state: 'Madhya Pradesh' },
  { city: 'Bhopal', state: 'Madhya Pradesh' },
  { city: 'Patna', state: 'Bihar' },
  { city: 'Kochi', state: 'Kerala' }
];

const courts = [
  'Supreme Court', 'High Court', 'District Court', 'Sessions Court', 'Family Court',
  'Consumer Court', 'Labour Court', 'NCLT', 'ITAT', 'Civil Court'
];

const languages = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Bengali', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi'];

const educations = [
  'LLB from Delhi University',
  'LLB, LLM from NLS Bangalore',
  'BA LLB from NALSAR',
  'LLB from Mumbai University',
  'LLB, LLM from Symbiosis',
  'BA LLB from Amity University',
  'LLB from Lucknow University',
  'LLB from Gujarat University',
  'BA LLB from NLIU Bhopal',
  'LLB, LLM from Pune University'
];

const generateLawyers = () => {
  return specializations.map((spec, index) => {
    // Round-robin assignment for location to test filters
    const location = cities[index % cities.length];
    const experience = 5 + (index % 20); // varied experience

    return {
      id: `dummy_lawyer_${index + 1}`,
      name: `Dummy ${spec} Lawyer`, // Clearly labeled as dummy
      firstName: 'Dummy',
      lastName: 'Lawyer',
      email: `dummy.${spec.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      phone: '+91 9876543210',
      specialization: spec,
      secondarySpecializations: [],
      experience,
      rating: 4.5, // Default good rating
      reviews: 50,
      casesWon: 100,
      casesHandled: 150,
      city: location.city,
      state: location.state,
      location: `${location.city}, ${location.state}`,
      court: courts[index % courts.length],
      barCouncilNumber: `DUMMY/${location.state.substring(0, 2).toUpperCase()}/${2024 - experience}`,
      education: 'LLB, LLM (Dummy University)',
      languages: ['English', 'Hindi'],
      feeMin: 2000,
      feeMax: 5000,
      bio: `This is a dummy profile for a ${spec} lawyer. Used for demonstration purposes only.`,
      image: `https://ui-avatars.com/api/?name=Dummy+Lawyer&background=top&color=fff`,
      availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      consultationModes: ['In-Person', 'Video Call', 'Phone'],
      verified: false, // Dummy data should not be verified
      featured: index < 3, // Feature first few
      joinedDate: '2024-01-01'
    };
  });
};

export const dummyLawyers = generateLawyers();

export const specializationsList = specializations;
export { specializations };
export const citiesList = cities;
export const statesList = [...new Set(cities.map(c => c.state))];

// Legacy exports for backward compatibility with FindLawyerManual.js
export const states = {
  'Delhi': {
    cities: ['New Delhi', 'North Delhi', 'South Delhi', 'West Delhi', 'East Delhi'],
    courts: ['Delhi High Court', 'Tis Hazari Courts', 'Saket District Court', 'Patiala House Court', 'Karkardooma Court']
  },
  'Maharashtra': {
    cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik'],
    courts: ['Bombay High Court', 'Mumbai City Civil Court', 'Pune District Court', 'NCLT Mumbai']
  },
  'Karnataka': {
    cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
    courts: ['Karnataka High Court', 'Bangalore City Civil Court', 'District Court Bangalore']
  },
  'Tamil Nadu': {
    cities: ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
    courts: ['Madras High Court', 'Chennai City Civil Court', 'District Court Chennai']
  },
  'West Bengal': {
    cities: ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
    courts: ['Calcutta High Court', 'City Civil Court Kolkata', 'District Court Kolkata']
  },
  'Telangana': {
    cities: ['Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad'],
    courts: ['Telangana High Court', 'City Civil Court Hyderabad', 'District Court Hyderabad']
  },
  'Gujarat': {
    cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
    courts: ['Gujarat High Court', 'City Civil Court Ahmedabad', 'District Court Ahmedabad']
  },
  'Uttar Pradesh': {
    cities: ['Lucknow', 'Noida', 'Ghaziabad', 'Varanasi', 'Kanpur', 'Agra'],
    courts: ['Allahabad High Court', 'Lucknow Bench', 'District Court Lucknow', 'District Court Noida']
  },
  'Haryana': {
    cities: ['Gurgaon', 'Faridabad', 'Chandigarh', 'Rohtak', 'Panipat'],
    courts: ['Punjab and Haryana High Court', 'District Court Gurgaon', 'District Court Faridabad']
  },
  'Punjab': {
    cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
    courts: ['Punjab and Haryana High Court', 'District Court Chandigarh', 'District Court Ludhiana']
  },
  'Rajasthan': {
    cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    courts: ['Rajasthan High Court', 'District Court Jaipur', 'District Court Jodhpur']
  },
  'Madhya Pradesh': {
    cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior'],
    courts: ['Madhya Pradesh High Court', 'District Court Indore', 'District Court Bhopal']
  },
  'Bihar': {
    cities: ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur'],
    courts: ['Patna High Court', 'District Court Patna']
  },
  'Kerala': {
    cities: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
    courts: ['Kerala High Court', 'District Court Kochi', 'District Court Thiruvananthapuram']
  }
};

// Search function for backward compatibility
export const searchLawyers = (query, filters) => {
  return dummyLawyers.filter(lawyer => {
    // Search query
    if (query) {
      const q = query.toLowerCase();
      const matchesSearch =
        lawyer.name.toLowerCase().includes(q) ||
        lawyer.specialization.toLowerCase().includes(q) ||
        lawyer.location.toLowerCase().includes(q) ||
        lawyer.city.toLowerCase().includes(q);
      if (!matchesSearch) return false;
    }

    // State filter
    if (filters.state && lawyer.state !== filters.state) {
      return false;
    }

    // City filter
    if (filters.city && lawyer.city !== filters.city) {
      return false;
    }

    // Specialization filter
    if (filters.specialization && lawyer.specialization !== filters.specialization) {
      return false;
    }

    // Court filter
    if (filters.court && lawyer.court !== filters.court) {
      return false;
    }

    // Rating filter
    if (filters.minRating && lawyer.rating < filters.minRating) {
      return false;
    }

    return true;
  });
};

export default dummyLawyers;

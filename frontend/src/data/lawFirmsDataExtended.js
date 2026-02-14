// Comprehensive Dummy Law Firm Data for Lxwyer Up - 100 Law Firms

const firmPrefixes = [
  'Shah', 'Kumar', 'Mehta', 'Reddy', 'Khanna', 'Patel', 'Singh', 'Verma', 'Gupta', 'Agarwal',
  'Bhatia', 'Chopra', 'Bansal', 'Saxena', 'Yadav', 'Mishra', 'Pandey', 'Srivastava', 'Tiwari', 'Chauhan',
  'Rathore', 'Arora', 'Sethi', 'Dhawan', 'Bajaj', 'Goyal', 'Ahuja', 'Mehra', 'Tandon', 'Kaul',
  'Dua', 'Vohra', 'Grover', 'Bhargava', 'Joshi', 'Sharma', 'Kapoor', 'Malhotra', 'Jain', 'Nair'
];

const firmSuffixes = [
  '& Associates', '& Partners', 'Legal Solutions', 'Law Chambers', 'Law Group',
  'Legal Consultancy', 'Legal Services', '& Co.', 'Law Firm', 'Legal Advisors'
];

const specializations = [
  'Criminal Law', 'Civil Law', 'Family Law', 'Property Law', 'Corporate Law',
  'Tax Law', 'Labour Law', 'Consumer Law', 'Constitutional Law', 'Intellectual Property',
  'Banking Law', 'Cyber Law', 'Immigration Law', 'Environmental Law', 'Real Estate Law'
];

const cities = [
  { city: 'New Delhi', state: 'Delhi', area: 'Connaught Place' },
  { city: 'New Delhi', state: 'Delhi', area: 'Saket' },
  { city: 'New Delhi', state: 'Delhi', area: 'Dwarka' },
  { city: 'Mumbai', state: 'Maharashtra', area: 'Nariman Point' },
  { city: 'Mumbai', state: 'Maharashtra', area: 'Bandra' },
  { city: 'Mumbai', state: 'Maharashtra', area: 'Andheri' },
  { city: 'Pune', state: 'Maharashtra', area: 'Koregaon Park' },
  { city: 'Bangalore', state: 'Karnataka', area: 'MG Road' },
  { city: 'Bangalore', state: 'Karnataka', area: 'Koramangala' },
  { city: 'Chennai', state: 'Tamil Nadu', area: 'T Nagar' },
  { city: 'Kolkata', state: 'West Bengal', area: 'Park Street' },
  { city: 'Hyderabad', state: 'Telangana', area: 'Banjara Hills' },
  { city: 'Ahmedabad', state: 'Gujarat', area: 'CG Road' },
  { city: 'Lucknow', state: 'Uttar Pradesh', area: 'Hazratganj' },
  { city: 'Noida', state: 'Uttar Pradesh', area: 'Sector 62' },
  { city: 'Gurgaon', state: 'Haryana', area: 'Cyber City' },
  { city: 'Chandigarh', state: 'Punjab', area: 'Sector 17' },
  { city: 'Jaipur', state: 'Rajasthan', area: 'MI Road' },
  { city: 'Indore', state: 'Madhya Pradesh', area: 'Vijay Nagar' },
  { city: 'Kochi', state: 'Kerala', area: 'MG Road' }
];

const descriptions = [
  'Premier law firm with expertise in civil, criminal, and corporate matters.',
  'Leading legal practice providing comprehensive legal solutions.',
  'Trusted legal advisors with a proven track record of success.',
  'Modern law firm combining technology with legal expertise.',
  'Client-focused legal services with personalized attention.',
  'Established practice known for integrity and excellence.',
  'Dynamic legal team handling complex litigation matters.',
  'Full-service law firm serving individuals and businesses.',
  'Expert legal counsel with deep industry knowledge.',
  'Boutique law firm specializing in niche practice areas.'
];

const generateLawFirms = () => {
  return specializations.map((spec, i) => {
    // Round-robin assignment for location
    const location = cities[i % cities.length];
    const establishedYear = 2000 + (i % 24);

    return {
      id: `dummy_firm_${i + 1}`,
      firm_name: `Dummy ${spec} Firm`,
      name: `Dummy ${spec} Firm`, // alias
      email: `contact@dummy.${spec.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: '+91 9876543210',
      website: `www.dummy.${spec.toLowerCase().replace(/\s+/g, '')}.com`,
      address: `${location.area}, ${location.city}`,
      city: location.city,
      state: location.state,
      pincode: '110001',
      registration_number: `DUMMY/FIRM/${establishedYear}/${String(i + 1).padStart(3, '0')}`,
      established_year: establishedYear,
      since: establishedYear,
      total_lawyers: 5 + (i % 10),
      lawyers: 5 + (i % 10), // alias
      total_staff: 10 + (i % 10),
      practice_areas: [spec], // Just one specialization to keep it clean
      areas: [spec], // alias
      specializations: [spec],
      description: `This is a dummy profile for a law firm specializing in ${spec}. Used for demonstration purposes only.`,
      achievements: 'Dummy Achievement: Excellence in Legal Services',
      status: 'approved',
      rating: 4.5,
      reviews: 50,
      casesHandled: 200,
      consultation: '₹2000',
      consultationFee: 2000,
      logo: `https://ui-avatars.com/api/?name=Dummy+Firm&background=0F2944&color=fff&size=128`,
      verified: false, // Dummy data should not be verified
      featured: i < 3,
      services: ['Legal Consultation', 'Document Drafting', 'Court Representation'],
      workingHours: '9:00 AM - 6:00 PM',
      workingDays: 'Monday - Saturday'
    };
  });
};

export const dummyLawFirms = generateLawFirms();

export const specializationsList = specializations;
export const citiesList = [...new Set(cities.map(c => c.city))];
export const statesList = [...new Set(cities.map(c => c.state))];

export default dummyLawFirms;

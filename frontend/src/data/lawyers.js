// Expanded Dummy Indian Lawyers Data - 1000 lawyers
// All major states with proper distribution across specializations

// Indian States and Cities (expanded)
export const indianLocations = {
  "Delhi": ["New Delhi", "Central Delhi", "South Delhi", "North Delhi", "East Delhi", "West Delhi"],
  "Uttar Pradesh": ["Lucknow", "Noida", "Ghaziabad", "Varanasi", "Kanpur", "Agra", "Prayagraj", "Meerut"],
  "Haryana": ["Gurugram", "Faridabad", "Chandigarh", "Rohtak", "Karnal", "Panipat", "Hisar"],
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Navi Mumbai"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Salem", "Trichy"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer"],
  "West Bengal": ["Kolkata", "Howrah", "Siliguri", "Durgapur", "Asansol"],
  "Telangana": ["Hyderabad", "Secunderabad", "Warangal", "Nizamabad", "Karimnagar"],
  "Punjab": ["Chandigarh", "Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
  "Kerala": ["Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kannur"]
};

// Courts by State
export const courtsByState = {
  "Delhi": ["Delhi High Court", "Tis Hazari Courts", "Saket District Court", "Patiala House Court", "Karkardooma Court", "Rohini Court"],
  "Uttar Pradesh": ["Allahabad High Court", "Lucknow Bench", "District Court Lucknow", "Gautam Budh Nagar District Court", "District Court Varanasi", "District Court Kanpur"],
  "Haryana": ["Punjab & Haryana High Court", "Gurugram District Court", "Faridabad District Court", "Rohtak District Court"],
  "Maharashtra": ["Bombay High Court", "Pune District Court", "NCLT Mumbai", "Nagpur Bench", "Aurangabad Bench"],
  "Karnataka": ["Karnataka High Court", "Bangalore City Civil Court", "Sessions Court Bangalore", "NCLT Bangalore"],
  "Tamil Nadu": ["Madras High Court", "Chennai City Civil Court", "Coimbatore District Court", "Madurai Bench"],
  "Gujarat": ["Gujarat High Court", "Ahmedabad City Civil Court", "Surat District Court", "Vadodara District Court"],
  "Rajasthan": ["Rajasthan High Court", "Jaipur Bench", "Jodhpur Bench", "Udaipur District Court"],
  "West Bengal": ["Calcutta High Court", "Alipore Court", "City Civil Court Kolkata", "Asansol District Court"],
  "Telangana": ["Telangana High Court", "Hyderabad City Civil Court", "Ranga Reddy District Court", "NCLT Hyderabad"],
  "Punjab": ["Punjab & Haryana High Court", "Ludhiana District Court", "Amritsar District Court", "Jalandhar District Court"],
  "Kerala": ["Kerala High Court", "Ernakulam District Court", "Thiruvananthapuram District Court", "Kozhikode District Court"]
};

// Case/Crime Types (expanded)
export const caseTypes = [
  "Criminal Law",
  "Family Law",
  "Property Law",
  "Corporate Law",
  "Civil Law",
  "Cyber Law",
  "Tax Law",
  "Labour Law",
  "Constitutional Law",
  "Consumer Law",
  "Banking Law",
  "Immigration Law",
  "Intellectual Property",
  "Medical Negligence",
  "Environmental Law",
  "Real Estate Law",
  "Insurance Law",
  "Arbitration",
  "Human Rights",
  "Motor Accident Claims"
];

// Helper functions to generate random data
const firstNames = {
  male: ["Rajesh", "Amit", "Vikram", "Sanjay", "Arun", "Deepak", "Rahul", "Suresh", "Manoj", "Ajay", "Pradeep", "Rakesh", "Vijay", "Rohit", "Nitin", "Anand", "Mohit", "Sumit", "Vivek", "Ashish", "Gaurav", "Karan", "Arjun", "Ravi", "Naveen", "Sandeep", "Harish", "Dinesh", "Ramesh", "Yogesh", "Pankaj", "Sachin", "Rajiv", "Manish", "Anil", "Sunil", "Mukesh", "Alok", "Abhishek", "Varun"],
  female: ["Priya", "Neha", "Sunita", "Kavita", "Anjali", "Pooja", "Meera", "Rekha", "Nisha", "Sarita", "Anita", "Deepika", "Swati", "Shweta", "Ritu", "Geeta", "Seema", "Manisha", "Rashmi", "Komal", "Shreya", "Divya", "Preeti", "Shalini", "Archana", "Vandana", "Jyoti", "Pallavi", "Sonam", "Kritika", "Simran", "Aishwarya", "Tanvi", "Ishita", "Aditi", "Sneha", "Nikita", "Monika", "Shilpa", "Radhika"]
};

const lastNames = ["Sharma", "Kumar", "Singh", "Verma", "Gupta", "Agarwal", "Jain", "Mehta", "Patel", "Shah", "Rao", "Reddy", "Nair", "Menon", "Pillai", "Iyer", "Mukherjee", "Banerjee", "Chatterjee", "Das", "Bose", "Sen", "Ghosh", "Roy", "Deshmukh", "Patil", "Kulkarni", "Joshi", "Sawant", "Pawar", "Thakur", "Chauhan", "Rajput", "Yadav", "Tiwari", "Pandey", "Mishra", "Dubey", "Srivastava", "Awasthi", "Tripathi", "Saxena", "Malhotra", "Kapoor", "Chopra", "Khanna", "Bhatia", "Tandon", "Arora", "Sethi"];

const universities = [
  "Delhi University", "Mumbai University", "Bangalore University", "National Law School", 
  "NLSIU Bangalore", "NLU Delhi", "NALSAR Hyderabad", "NUJS Kolkata", "GNLU Gandhinagar",
  "Symbiosis Law School", "ILS Law College Pune", "Government Law College Mumbai",
  "Faculty of Law BHU", "Aligarh Muslim University", "Lucknow University",
  "Panjab University", "Gujarat National Law University", "Christ University",
  "Amity Law School", "Jindal Global Law School", "KIIT Law School", "Lloyd Law College"
];

const barCouncilPrefixes = {
  "Delhi": "D", "Uttar Pradesh": "UP", "Haryana": "HR", "Maharashtra": "MH",
  "Karnataka": "KA", "Tamil Nadu": "TN", "Gujarat": "GJ", "Rajasthan": "RJ",
  "West Bengal": "WB", "Telangana": "TS", "Punjab": "PB", "Kerala": "KL"
};

const languages = {
  "Delhi": ["Hindi", "English", "Punjabi"],
  "Uttar Pradesh": ["Hindi", "English", "Urdu"],
  "Haryana": ["Hindi", "English", "Punjabi", "Haryanvi"],
  "Maharashtra": ["Marathi", "Hindi", "English", "Gujarati"],
  "Karnataka": ["Kannada", "Hindi", "English", "Telugu"],
  "Tamil Nadu": ["Tamil", "English", "Hindi"],
  "Gujarat": ["Gujarati", "Hindi", "English"],
  "Rajasthan": ["Hindi", "English", "Rajasthani"],
  "West Bengal": ["Bengali", "Hindi", "English"],
  "Telangana": ["Telugu", "Hindi", "English", "Urdu"],
  "Punjab": ["Punjabi", "Hindi", "English"],
  "Kerala": ["Malayalam", "English", "Hindi"]
};

const feeRanges = [
  "₹2,000 - ₹5,000", "₹3,000 - ₹8,000", "₹4,000 - ₹10,000", "₹5,000 - ₹12,000",
  "₹5,000 - ₹15,000", "₹6,000 - ₹18,000", "₹7,000 - ₹20,000", "₹8,000 - ₹25,000",
  "₹10,000 - ₹30,000", "₹10,000 - ₹35,000", "₹12,000 - ₹40,000", "₹15,000 - ₹50,000",
  "₹20,000 - ₹60,000", "₹25,000 - ₹75,000", "₹30,000 - ₹100,000"
];

const bios = {
  "Criminal Law": [
    "Senior criminal lawyer with expertise in bail matters, murder trials, and white-collar crimes.",
    "Criminal defense advocate handling serious offences, NDPS cases, and economic crimes.",
    "Expert in criminal litigation with focus on cybercrime and financial fraud cases.",
    "Specializes in appeals, revisions, and complex criminal matters at High Court level."
  ],
  "Family Law": [
    "Specialist in divorce, child custody, maintenance, and domestic violence cases.",
    "Expert in NRI divorce cases, international child custody, and family settlements.",
    "Compassionate approach to sensitive family matters including adoption and guardianship.",
    "Handles matrimonial disputes, property division, and maintenance claims efficiently."
  ],
  "Property Law": [
    "Property dispute expert handling land acquisition, title verification, and real estate matters.",
    "Specializes in partition suits, illegal possession, and redevelopment disputes.",
    "Expert in agricultural land matters, succession, and property registration.",
    "Handles real estate transactions, builder-buyer disputes, and RERA matters."
  ],
  "Corporate Law": [
    "Corporate lawyer specializing in mergers, acquisitions, and business contracts.",
    "Expert in company law, insolvency proceedings, and NCLT matters.",
    "Handles IPOs, private equity deals, SEBI compliance, and corporate governance.",
    "Advises startups and MNCs on compliance, contracts, and regulatory matters."
  ],
  "Civil Law": [
    "Civil litigation expert handling contract disputes, recovery suits, and injunction matters.",
    "Specializes in declaratory suits, specific performance, and civil appeals.",
    "Expert in tort law, defamation cases, and civil remedies.",
    "Handles commercial disputes, partnership matters, and civil writs."
  ],
  "Cyber Law": [
    "Cyber crime specialist handling online fraud, data theft, and IT Act cases.",
    "Expert in data protection, privacy laws, and digital compliance.",
    "Handles corporate data breaches, online defamation, and cyber stalking cases.",
    "Specializes in e-commerce disputes, digital contracts, and cyber forensics."
  ],
  "Tax Law": [
    "Tax litigation expert specializing in GST, Income Tax disputes, and corporate taxation.",
    "Expert in international taxation, transfer pricing, and tax planning.",
    "Handles tax appeals, assessments, and prosecution matters.",
    "Specializes in GST litigation, customs duty, and excise matters."
  ],
  "Labour Law": [
    "Employment law specialist handling wrongful termination, workplace harassment, and disputes.",
    "Expert in industrial disputes, ESI/PF matters, and workmen compensation.",
    "Handles trade union matters, collective bargaining, and labour compliance.",
    "Specializes in IT sector employment issues, contracts, and policies."
  ],
  "Constitutional Law": [
    "Senior advocate specializing in PIL, fundamental rights, and constitutional matters.",
    "Expert in writ petitions, administrative law, and constitutional challenges.",
    "Handles human rights cases, election matters, and constitutional remedies.",
    "Specializes in service matters, administrative tribunals, and government litigation."
  ],
  "Consumer Law": [
    "Consumer rights advocate handling defective products and service deficiency cases.",
    "Expert in real estate complaints, insurance claims, and e-commerce disputes.",
    "Handles banking complaints, unfair trade practices, and medical negligence.",
    "Specializes in FEMA violations, consumer finance, and product liability."
  ],
  "Banking Law": [
    "Banking and finance law expert handling loan recovery and SARFAESI matters.",
    "Expert in banking fraud, DRT proceedings, and financial regulations.",
    "Handles NBFC matters, securitization, and debt recovery.",
    "Specializes in banking disputes, cheque bounce, and financial crimes."
  ],
  "Immigration Law": [
    "Immigration specialist handling visa issues, deportation, and citizenship matters.",
    "Expert in Canadian, US, UK, and Australian immigration laws.",
    "Handles OCI/PIO matters, passport issues, and FRRO compliance.",
    "Specializes in work permits, student visas, and immigration appeals."
  ],
  "Intellectual Property": [
    "IP lawyer handling trademark, copyright, and patent matters.",
    "Expert in IP litigation, licensing, and brand protection.",
    "Handles entertainment law, media rights, and digital IP.",
    "Specializes in technology law, software patents, and IP commercialization."
  ],
  "Medical Negligence": [
    "Medical malpractice specialist handling hospital negligence and wrong diagnosis cases.",
    "Expert in surgical errors, medical compensation, and healthcare litigation.",
    "Handles medical board proceedings, insurance claims, and patient rights.",
    "Specializes in pharmaceutical liability and clinical trial matters."
  ],
  "Environmental Law": [
    "Environmental law expert handling pollution control and NGT matters.",
    "Specializes in forest clearances, wildlife protection, and green compliance.",
    "Handles industrial pollution cases, EIA clearances, and environmental impact.",
    "Expert in sustainability law, carbon credits, and environmental permits."
  ],
  "Real Estate Law": [
    "Real estate lawyer handling RERA matters and builder-buyer disputes.",
    "Expert in property transactions, due diligence, and title verification.",
    "Handles redevelopment projects, housing society matters, and lease agreements.",
    "Specializes in commercial real estate, land use, and zoning laws."
  ],
  "Insurance Law": [
    "Insurance law specialist handling claim disputes and policy interpretation.",
    "Expert in life, health, motor, and general insurance litigation.",
    "Handles reinsurance matters, regulatory compliance, and IRDAI issues.",
    "Specializes in marine insurance, liability claims, and insurance fraud."
  ],
  "Arbitration": [
    "Arbitration expert handling domestic and international commercial disputes.",
    "Specializes in institutional arbitration, ad-hoc proceedings, and enforcement.",
    "Handles construction disputes, infrastructure arbitration, and investor-state matters.",
    "Expert in mediation, conciliation, and alternative dispute resolution."
  ],
  "Human Rights": [
    "Human rights advocate handling custodial violence and civil liberties cases.",
    "Expert in prison reforms, refugee matters, and minority rights.",
    "Handles discrimination cases, disability rights, and social justice matters.",
    "Specializes in child rights, women's rights, and LGBTQ+ advocacy."
  ],
  "Motor Accident Claims": [
    "Motor accident claims specialist handling MACT tribunal matters.",
    "Expert in compensation claims, insurance disputes, and hit-and-run cases.",
    "Handles road accident cases, third-party claims, and negligence suits.",
    "Specializes in commercial vehicle accidents and transport litigation."
  ]
};

// Generate 1000 lawyers
const generateLawyers = () => {
  const lawyers = [];
  let id = 1;
  
  const states = Object.keys(indianLocations);
  const lawyersPerState = Math.ceil(1000 / states.length); // ~83 per state
  
  states.forEach(state => {
    const cities = indianLocations[state];
    const courts = courtsByState[state];
    const stateLanguages = languages[state];
    const barPrefix = barCouncilPrefixes[state];
    
    // Ensure at least 10 lawyers per specialization per state (if possible)
    // With 12 states and 20 specializations, distribute evenly
    
    for (let i = 0; i < lawyersPerState && id <= 1000; i++) {
      const isFemale = Math.random() > 0.55; // 45% female lawyers
      const firstName = isFemale 
        ? firstNames.female[Math.floor(Math.random() * firstNames.female.length)]
        : firstNames.male[Math.floor(Math.random() * firstNames.male.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      
      // Ensure even distribution of specializations
      const specialization = caseTypes[i % caseTypes.length];
      const city = cities[Math.floor(Math.random() * cities.length)];
      const court = courts[Math.floor(Math.random() * courts.length)];
      const experience = Math.floor(Math.random() * 25) + 3; // 3-28 years
      const rating = (Math.random() * 1 + 4).toFixed(1); // 4.0-5.0
      const casesWon = Math.floor(Math.random() * 400) + 50 + (experience * 15);
      
      // Select 2-3 languages
      const numLanguages = Math.floor(Math.random() * 2) + 2;
      const selectedLanguages = [...stateLanguages]
        .sort(() => Math.random() - 0.5)
        .slice(0, numLanguages);
      if (!selectedLanguages.includes("English")) selectedLanguages.push("English");
      
      const feeRange = feeRanges[Math.min(Math.floor(experience / 2), feeRanges.length - 1)];
      const bioOptions = bios[specialization] || bios["Civil Law"];
      const bio = bioOptions[Math.floor(Math.random() * bioOptions.length)];
      const university = universities[Math.floor(Math.random() * universities.length)];
      const barYear = 2024 - experience;
      const barNumber = `${barPrefix}/${String(Math.floor(Math.random() * 9000) + 1000)}/${barYear}`;
      
      // Photo URLs (cycling through available portraits)
      const photoGender = isFemale ? "women" : "men";
      const photoNum = (id % 99) + 1;
      
      lawyers.push({
        id,
        name: `Adv. ${firstName} ${lastName}`,
        photo: `https://randomuser.me/api/portraits/${photoGender}/${photoNum}.jpg`,
        specialization,
        experience,
        rating: parseFloat(rating),
        cases_won: casesWon,
        state,
        city,
        court,
        languages: selectedLanguages,
        fee: feeRange,
        bio,
        education: `LLB from ${university}`,
        bar_council: barNumber
      });
      
      id++;
    }
  });
  
  return lawyers;
};

// Generate and export the lawyers array
export const lawyers = generateLawyers();

// Function to get lawyers by specialization
export const getLawyersBySpecialization = (specialization) => {
  return lawyers.filter(l => l.specialization === specialization);
};

// Function to get lawyers by state
export const getLawyersByState = (state) => {
  return lawyers.filter(l => l.state === state);
};

// Function to search lawyers by name
export const searchLawyersByName = (query) => {
  const lowerQuery = query.toLowerCase();
  return lawyers.filter(l => l.name.toLowerCase().includes(lowerQuery));
};

// Get count of lawyers by specialization for verification
export const getSpecializationCounts = () => {
  const counts = {};
  caseTypes.forEach(type => {
    counts[type] = lawyers.filter(l => l.specialization === type).length;
  });
  return counts;
};

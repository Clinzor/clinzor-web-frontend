"use client"
import { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Camera, Building, ChevronRight, Clock, Plus } from 'lucide-react';

const ClinicProfile = () => {
  const [profileImage, setProfileImage] = useState("/api/placeholder/180/180");
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | ArrayBuffer | null>(null);
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position for animation effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setPreviewImage(event.target.result);
          setShowImagePreview(true);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const confirmImageUpload = () => {
    if (typeof previewImage === "string") {
      setProfileImage(previewImage);
    }
    setShowImagePreview(false);
  };

  const cancelImageUpload = () => {
    setShowImagePreview(false);
    setPreviewImage(null);
  };
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const operatingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <div className="flex flex-col w-full h-full bg-white text-gray-900">
      {/* Minimal floating header */}
      <div className={`sticky top-0 z-50 transition-all duration-300 ${scrollPosition > 20 ? 'backdrop-blur-md bg-white/90 shadow-sm' : 'bg-white'}`}>
        <div className="max-w-4xl mx-auto px-6 py-4">
          <nav className="flex items-center text-sm">
            <Building className={`h-5 w-5 mr-2 transition-colors duration-300 ${scrollPosition > 20 ? 'text-gray-900' : 'text-gray-400'}`} />
            <div className="flex items-center space-x-2">
              <a className="text-gray-400 hover:text-gray-800 transition-colors duration-200" href="#">Dashboard</a>
              <ChevronRight className="h-3 w-3 text-gray-300" />
              <a className="text-gray-400 hover:text-gray-800 transition-colors duration-200" href="#">Clinics</a>
              <ChevronRight className="h-3 w-3 text-gray-300" />
              <span className="text-gray-900 font-medium">Edit Profile</span>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content with smooth fade-in */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 space-y-6 animate-fadeIn">
        {/* Clinic Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-gray-900 mr-3"></span>
              Clinic Information
            </h2>
            
            <div className="flex flex-col md:flex-row gap-12">
              {/* Profile Image */}
              <div className="flex flex-col items-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-50 transition-all duration-300 group-hover:shadow-lg">
                    <img 
                      src={profileImage} 
                      alt="Clinic profile" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <label 
                    htmlFor="profile-upload" 
                    className="absolute -bottom-2 -right-2 p-2 bg-white rounded-full shadow-md cursor-pointer transform transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
                  >
                    <Camera className="h-5 w-5 text-gray-700" />
                    <input 
                      type="file" 
                      id="profile-upload" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Form Fields with subtle animations */}
              <div className="flex-1 space-y-5">
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                    Clinic Name
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                    placeholder="Enter clinic name"
                    defaultValue="HealthCare Medical Center"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="transform transition-all duration-300 hover:translate-x-1">
                    <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                      Email Address
                    </label>
                    <div className="relative">
                      <input 
                        type="email" 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                        placeholder="clinic@example.com"
                        defaultValue="info@healthcare-medical.com"
                      />
                      <Mail className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="transform transition-all duration-300 hover:translate-x-1">
                    <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                      Phone Number
                    </label>
                    <div className="relative">
                      <input 
                        type="tel" 
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                        placeholder="+1 (555) 123-4567"
                        defaultValue="+1 (555) 987-6543"
                      />
                      <Phone className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>
                
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                    Clinic Type
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none transition-all duration-300"
                    >
                      <option value="general">General Practice</option>
                      <option value="dental">Dental Clinic</option>
                      <option value="specialty">Specialty Clinic</option>
                      <option value="urgent">Urgent Care</option>
                      <option value="hospital">Hospital</option>
                    </select>
                    <ChevronRight className="absolute right-4 top-3 h-4 w-4 text-gray-400 transform rotate-90" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Location Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-gray-900 mr-3"></span>
              Location
            </h2>
            
            <div className="space-y-5">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                  Street Address
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                    placeholder="123 Main Street"
                    defaultValue="456 Healthcare Ave"
                  />
                  <MapPin className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                    City
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                    placeholder="City"
                    defaultValue="San Francisco"
                  />
                </div>
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                    State/Province
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                    placeholder="State"
                    defaultValue="California"
                  />
                </div>
                <div className="transform transition-all duration-300 hover:translate-x-1">
                  <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                    Postal Code
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                    placeholder="Zip/Postal Code"
                    defaultValue="94107"
                  />
                </div>
              </div>
              
              <div className="mt-6 border rounded-xl overflow-hidden bg-gray-50 h-56 group transition-all duration-300 hover:shadow-md transform hover:scale-[1.01]">
                <div className="w-full h-full flex items-center justify-center relative">
                  <div className="flex flex-col items-center transition-opacity duration-500 group-hover:opacity-0">
                    <MapPin className="h-8 w-8 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-400">Map preview</p>
                  </div>
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 flex items-center justify-center">
                    <button className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm flex items-center space-x-2 transform transition-transform duration-300 hover:scale-105">
                      <Plus className="h-4 w-4" />
                      <span>Add Location</span>
                    </button>
                  </div>
                </div>
              </div>              
            </div>
          </div>
        </div>
        
        {/* Operating Hours Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-gray-900 mr-3"></span>
              Operating Hours
            </h2>
            
            <div className="space-y-3">
              {operatingDays.map((day, index) => (
                <div key={day} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 group">
                  <div className="w-24 transform transition-all duration-300 group-hover:translate-x-1">
                    <span className="text-sm font-medium text-gray-600">{day}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <div className="relative transition-all duration-300 group-hover:scale-105">
                        <select className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm appearance-none pr-8 transition-all duration-300">
                          {Array.from({length: 24}, (_, i) => {
                            const hour = i % 12 || 12;
                            const ampm = i < 12 ? 'AM' : 'PM';
                            return <option key={`open-${i}`} value={i}>{`${hour}:00 ${ampm}`}</option>;
                          })}
                        </select>
                        <ChevronRight className="absolute right-2 top-2.5 h-3.5 w-3.5 text-gray-400 transform rotate-90" />
                      </div>
                      <span className="text-gray-400">—</span>
                      <div className="relative transition-all duration-300 group-hover:scale-105">
                        <select className="px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-sm appearance-none pr-8 transition-all duration-300">
                          {Array.from({length: 24}, (_, i) => {
                            const hour = i % 12 || 12;
                            const ampm = i < 12 ? 'AM' : 'PM';
                            return <option key={`close-${i}`} value={i}>{`${hour}:00 ${ampm}`}</option>;
                          })}
                        </select>
                        <ChevronRight className="absolute right-2 top-2.5 h-3.5 w-3.5 text-gray-400 transform rotate-90" />
                      </div>
                    </div>
                    
                    <label className="relative inline-flex items-center cursor-pointer transition-all duration-300 group-hover:scale-105">
                      <input
                        type="checkbox" 
                        className="sr-only peer"
                        defaultChecked={index < 5}
                      />
                      <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-gray-900 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-300"></div>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Additional Information Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md mb-16">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
              <span className="inline-block w-4 h-4 rounded-full bg-gray-900 mr-3"></span>
              Additional Information
            </h2>
            
            <div className="space-y-5">
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                  About Your Clinic
                </label>
                <textarea 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  rows={4}
                  placeholder="Describe your clinic, services, and mission..."
                  defaultValue="HealthCare Medical Center is a state-of-the-art medical facility dedicated to providing comprehensive healthcare services with a patient-centered approach. Our team of experienced professionals is committed to delivering high-quality care in a comfortable and welcoming environment."
                ></textarea>
              </div>
              
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                  Insurance Networks
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  placeholder="Blue Cross, Aetna, Medicare, etc."
                  defaultValue="Blue Cross, Cigna, Aetna, Medicare, Medicaid"
                />
              </div>
              
              <div className="transform transition-all duration-300 hover:translate-x-1">
                <label className="block text-sm text-gray-500 mb-1.5 font-medium">
                  Specialties
                </label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-300"
                  placeholder="Family Medicine, Pediatrics, etc."
                  defaultValue="Family Medicine, Internal Medicine, Pediatrics, Women's Health"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Preview Modal with animations */}
      {showImagePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl animate-scaleIn">
            <h3 className="text-lg font-medium mb-6 text-gray-900">Preview Image</h3>
            <div className="relative w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-md">
              <img 
                src={typeof previewImage === "string" ? previewImage : undefined}
                alt="Preview" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button 
                onClick={cancelImageUpload}
                className="px-6 py-2 border border-gray-200 rounded-full text-sm font-medium text-gray-600 transition-all duration-300 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmImageUpload}
                className="px-6 py-2 bg-gray-900 text-white rounded-full text-sm font-medium transition-all duration-300 hover:bg-gray-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Add global animations to CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ClinicProfile;
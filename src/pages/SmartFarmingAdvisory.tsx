import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

interface Advisory {
  plantingSchedule: string;
  irrigationAdvice: string;
  pestControl: string;
  weatherAlert: string;
  bestPractices: string[];
}

const SOIL_TYPES = ['Clay', 'Sandy', 'Loamy', 'Silty', 'Peaty', 'Chalky', 'Black Cotton'];

const ALL_CROPS = [
  'Wheat', 'Rice', 'Maize', 'Sorghum (Jowar)', 'Bajra (Pearl Millet)', 'Ragi (Finger Millet)', 'Barley', 'Oats',
  'Soybean', 'Sunflower', 'Groundnut', 'Mustard', 'Sesame (Til)', 'Linseed', 'Castor',
  'Cotton', 'Sugarcane', 'Jute', 'Tobacco',
  'Chickpea (Chana)', 'Pigeon Pea (Tur/Arhar)', 'Green Gram (Moong)', 'Black Gram (Urad)', 'Lentil (Masoor)', 'Cow Pea',
  'Tomato', 'Onion', 'Potato', 'Brinjal (Eggplant)', 'Okra (Bhendi)', 'Cabbage', 'Cauliflower', 'Bitter Gourd', 'Cucumber', 'Chilli', 'Vegetables',
  'Mango', 'Banana', 'Grape', 'Pomegranate', 'Guava', 'Papaya', 'Orange', 'Lemon', 'Sapota', 'Custard Apple', 'Litchi',
  'Turmeric', 'Ginger', 'Cardamom', 'Black Pepper', 'Coriander', 'Cumin (Jeera)', 'Fenugreek (Methi)',
  'Napier Grass', 'Berseem (Egyptian Clover)', 'Lucerne', 'Sudan Grass',
  'Garlic', 'Coconut', 'Arecanut', 'Cashew', 'Tapioca', 'Mulberry', 'Guar', 'Moth Bean',
  'Tea', 'Coffee', 'Rubber', 'Flowers',
];

const STATE_DISTRICTS: Record<string, string[]> = {
  'Andhra Pradesh': ['All Districts', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Visakhapatnam', 'West Godavari'],
  'Bihar': ['All Districts', 'Bhagalpur', 'Darbhanga', 'Gaya', 'Muzaffarpur', 'Patna', 'Samastipur', 'Saran', 'Vaishali'],
  'Gujarat': ['All Districts', 'Ahmedabad', 'Amreli', 'Anand', 'Junagadh', 'Kutch', 'Rajkot', 'Surat', 'Vadodara'],
  'Haryana': ['All Districts', 'Ambala', 'Hisar', 'Karnal', 'Kurukshetra', 'Panipat', 'Rohtak', 'Sirsa', 'Sonipat'],
  'Karnataka': ['All Districts', 'Belgaum', 'Bellary', 'Bengaluru', 'Dharwad', 'Mandya', 'Mysuru', 'Shimoga', 'Tumkur'],
  'Kerala': ['All Districts', 'Ernakulam', 'Idukki', 'Kannur', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thiruvananthapuram', 'Thrissur'],
  'Madhya Pradesh': ['All Districts', 'Bhopal', 'Gwalior', 'Hoshangabad', 'Indore', 'Jabalpur', 'Rewa', 'Sagar', 'Ujjain'],
  'Maharashtra': ['All Districts', 'Akola', 'Amravati', 'Aurangabad', 'Jalgaon', 'Kolhapur', 'Latur', 'Nagpur', 'Nashik', 'Pune', 'Solapur'],
  'Odisha': ['All Districts', 'Bolangir', 'Cuttack', 'Ganjam', 'Khordha', 'Koraput', 'Puri', 'Sambhalpur', 'Sundargarh'],
  'Punjab': ['All Districts', 'Amritsar', 'Bathinda', 'Ferozpur', 'Gurdaspur', 'Jalandhar', 'Ludhiana', 'Moga', 'Patiala'],
  'Rajasthan': ['All Districts', 'Ajmer', 'Alwar', 'Bharatpur', 'Bikaner', 'Jaipur', 'Jodhpur', 'Kota', 'Udaipur'],
  'Tamil Nadu': ['All Districts', 'Coimbatore', 'Dindigul', 'Erode', 'Madurai', 'Salem', 'Thanjavur', 'Tirunelveli', 'Vellore'],
  'Telangana': ['All Districts', 'Hyderabad', 'Karimnagar', 'Khammam', 'Medak', 'Nalgonda', 'Nizamabad', 'Rangareddy', 'Warangal'],
  'Uttar Pradesh': ['All Districts', 'Agra', 'Allahabad', 'Kanpur', 'Lucknow', 'Mathura', 'Meerut', 'Muzaffarnagar', 'Varanasi'],
  'West Bengal': ['All Districts', 'Bankura', 'Bardhaman', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Malda', 'Murshidabad', 'Nadia'],
};

const DISTRICT_CROPS: Record<string, string[]> = {
  // Andhra Pradesh
  'Andhra Pradesh:All Districts': ['Rice', 'Maize', 'Sugarcane', 'Cotton', 'Groundnut', 'Chilli', 'Tobacco', 'Turmeric', 'Onion', 'Tomato', 'Sorghum (Jowar)', 'Pigeon Pea (Tur/Arhar)', 'Green Gram (Moong)', 'Black Gram (Urad)'],
  'Andhra Pradesh:Chittoor': ['Sugarcane', 'Tomato', 'Mango', 'Banana', 'Groundnut'],
  'Andhra Pradesh:East Godavari': ['Rice', 'Coconut', 'Sugarcane', 'Banana', 'Cashew'],
  'Andhra Pradesh:Guntur': ['Cotton', 'Chilli', 'Tobacco', 'Rice', 'Maize'],
  'Andhra Pradesh:Krishna': ['Rice', 'Sugarcane', 'Maize', 'Tomato', 'Cotton'],
  'Andhra Pradesh:Kurnool': ['Cotton', 'Groundnut', 'Sorghum (Jowar)', 'Rice', 'Chilli'],
  'Andhra Pradesh:Nellore': ['Rice', 'Sugarcane', 'Groundnut', 'Cotton', 'Chilli'],
  'Andhra Pradesh:Visakhapatnam': ['Rice', 'Sugarcane', 'Maize', 'Cashew', 'Coconut'],
  'Andhra Pradesh:West Godavari': ['Rice', 'Sugarcane', 'Coconut', 'Tobacco', 'Banana'],
  // Bihar
  'Bihar:All Districts': ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Potato', 'Lentil (Masoor)', 'Chickpea (Chana)', 'Litchi', 'Banana', 'Mustard'],
  'Bihar:Bhagalpur': ['Rice', 'Wheat', 'Maize', 'Mustard', 'Banana'],
  'Bihar:Darbhanga': ['Wheat', 'Rice', 'Maize', 'Jute', 'Banana'],
  'Bihar:Gaya': ['Wheat', 'Rice', 'Maize', 'Pigeon Pea (Tur/Arhar)', 'Mustard'],
  'Bihar:Muzaffarpur': ['Litchi', 'Banana', 'Wheat', 'Maize', 'Potato'],
  'Bihar:Patna': ['Rice', 'Wheat', 'Maize', 'Potato', 'Vegetables'],
  'Bihar:Samastipur': ['Wheat', 'Rice', 'Maize', 'Potato', 'Sugarcane'],
  'Bihar:Saran': ['Wheat', 'Rice', 'Sugarcane', 'Maize', 'Potato'],
  'Bihar:Vaishali': ['Wheat', 'Sugarcane', 'Maize', 'Banana', 'Potato'],
  // Gujarat
  'Gujarat:All Districts': ['Groundnut', 'Cotton', 'Castor', 'Wheat', 'Rice', 'Maize', 'Mango', 'Banana', 'Sugarcane', 'Cumin (Jeera)', 'Potato', 'Sesame (Til)'],
  'Gujarat:Ahmedabad': ['Cotton', 'Wheat', 'Castor', 'Groundnut', 'Cumin (Jeera)'],
  'Gujarat:Amreli': ['Groundnut', 'Cotton', 'Castor', 'Sesame (Til)', 'Wheat'],
  'Gujarat:Anand': ['Tobacco', 'Potato', 'Cotton', 'Maize', 'Banana'],
  'Gujarat:Junagadh': ['Groundnut', 'Cotton', 'Mango', 'Wheat', 'Banana'],
  'Gujarat:Kutch': ['Cotton', 'Castor', 'Groundnut', 'Cumin (Jeera)', 'Sesame (Til)'],
  'Gujarat:Rajkot': ['Groundnut', 'Cotton', 'Sesame (Til)', 'Castor', 'Wheat'],
  'Gujarat:Surat': ['Sugarcane', 'Rice', 'Cotton', 'Banana', 'Maize'],
  'Gujarat:Vadodara': ['Cotton', 'Sugarcane', 'Maize', 'Wheat', 'Rice'],
  // Haryana
  'Haryana:All Districts': ['Wheat', 'Rice', 'Cotton', 'Mustard', 'Sugarcane', 'Bajra (Pearl Millet)', 'Potato', 'Sunflower', 'Maize'],
  'Haryana:Ambala': ['Wheat', 'Rice', 'Sugarcane', 'Potato', 'Mustard'],
  'Haryana:Hisar': ['Cotton', 'Wheat', 'Mustard', 'Bajra (Pearl Millet)', 'Sunflower'],
  'Haryana:Karnal': ['Wheat', 'Rice', 'Sugarcane', 'Maize', 'Potato'],
  'Haryana:Kurukshetra': ['Wheat', 'Rice', 'Potato', 'Mustard', 'Sugarcane'],
  'Haryana:Panipat': ['Wheat', 'Rice', 'Sugarcane', 'Mustard', 'Maize'],
  'Haryana:Rohtak': ['Wheat', 'Rice', 'Sugarcane', 'Mustard', 'Bajra (Pearl Millet)'],
  'Haryana:Sirsa': ['Cotton', 'Wheat', 'Rice', 'Bajra (Pearl Millet)', 'Mustard'],
  'Haryana:Sonipat': ['Wheat', 'Rice', 'Vegetables', 'Sugarcane', 'Mustard'],
  // Karnataka
  'Karnataka:All Districts': ['Rice', 'Maize', 'Sorghum (Jowar)', 'Ragi (Finger Millet)', 'Cotton', 'Sunflower', 'Sugarcane', 'Banana', 'Mango', 'Coconut', 'Cardamom', 'Turmeric', 'Chickpea (Chana)', 'Groundnut'],
  'Karnataka:Belgaum': ['Sugarcane', 'Cotton', 'Maize', 'Sorghum (Jowar)', 'Rice'],
  'Karnataka:Bellary': ['Cotton', 'Sunflower', 'Maize', 'Sorghum (Jowar)', 'Groundnut'],
  'Karnataka:Bengaluru': ['Ragi (Finger Millet)', 'Maize', 'Mulberry', 'Tomato', 'Potato'],
  'Karnataka:Dharwad': ['Cotton', 'Chickpea (Chana)', 'Sunflower', 'Maize', 'Sorghum (Jowar)'],
  'Karnataka:Mandya': ['Sugarcane', 'Rice', 'Ragi (Finger Millet)', 'Coconut', 'Maize'],
  'Karnataka:Mysuru': ['Sugarcane', 'Ragi (Finger Millet)', 'Maize', 'Coconut', 'Vegetables'],
  'Karnataka:Shimoga': ['Rice', 'Maize', 'Sugarcane', 'Arecanut', 'Coconut'],
  'Karnataka:Tumkur': ['Ragi (Finger Millet)', 'Coconut', 'Mulberry', 'Groundnut', 'Maize'],
  // Kerala
  'Kerala:All Districts': ['Rice', 'Coconut', 'Banana', 'Rubber', 'Black Pepper', 'Cardamom', 'Ginger', 'Turmeric', 'Tapioca', 'Arecanut'],
  'Kerala:Ernakulam': ['Coconut', 'Banana', 'Rice', 'Tapioca', 'Vegetables'],
  'Kerala:Idukki': ['Cardamom', 'Black Pepper', 'Ginger', 'Tea', 'Coffee'],
  'Kerala:Kannur': ['Coconut', 'Arecanut', 'Banana', 'Rice', 'Pepper'],
  'Kerala:Kozhikode': ['Coconut', 'Banana', 'Ginger', 'Arecanut', 'Rice'],
  'Kerala:Malappuram': ['Coconut', 'Banana', 'Rice', 'Arecanut', 'Tapioca'],
  'Kerala:Palakkad': ['Rice', 'Coconut', 'Banana', 'Sugarcane', 'Vegetables'],
  'Kerala:Thiruvananthapuram': ['Coconut', 'Tapioca', 'Banana', 'Vegetables', 'Rice'],
  'Kerala:Thrissur': ['Coconut', 'Banana', 'Rice', 'Arecanut', 'Tapioca'],
  // Madhya Pradesh
  'Madhya Pradesh:All Districts': ['Soybean', 'Wheat', 'Chickpea (Chana)', 'Lentil (Masoor)', 'Maize', 'Rice', 'Cotton', 'Pigeon Pea (Tur/Arhar)', 'Mustard', 'Sesame (Til)', 'Garlic', 'Onion', 'Sorghum (Jowar)'],
  'Madhya Pradesh:Bhopal': ['Wheat', 'Soybean', 'Maize', 'Chickpea (Chana)', 'Mustard'],
  'Madhya Pradesh:Gwalior': ['Wheat', 'Mustard', 'Soybean', 'Chickpea (Chana)', 'Lentil (Masoor)'],
  'Madhya Pradesh:Hoshangabad': ['Wheat', 'Rice', 'Soybean', 'Chickpea (Chana)', 'Maize'],
  'Madhya Pradesh:Indore': ['Soybean', 'Wheat', 'Chickpea (Chana)', 'Onion', 'Garlic'],
  'Madhya Pradesh:Jabalpur': ['Rice', 'Wheat', 'Soybean', 'Pigeon Pea (Tur/Arhar)', 'Maize'],
  'Madhya Pradesh:Rewa': ['Rice', 'Wheat', 'Maize', 'Sorghum (Jowar)', 'Pigeon Pea (Tur/Arhar)'],
  'Madhya Pradesh:Sagar': ['Wheat', 'Soybean', 'Chickpea (Chana)', 'Lentil (Masoor)', 'Mustard'],
  'Madhya Pradesh:Ujjain': ['Soybean', 'Wheat', 'Garlic', 'Onion', 'Chickpea (Chana)'],
  // Maharashtra
  'Maharashtra:All Districts': ['Wheat', 'Rice', 'Maize', 'Sorghum (Jowar)', 'Bajra (Pearl Millet)', 'Cotton', 'Sugarcane', 'Soybean', 'Tomato', 'Onion', 'Chickpea (Chana)', 'Pigeon Pea (Tur/Arhar)', 'Sunflower', 'Groundnut', 'Turmeric', 'Ginger', 'Chilli', 'Mango', 'Banana', 'Grape', 'Orange', 'Pomegranate'],
  'Maharashtra:Akola': ['Cotton', 'Soybean', 'Wheat', 'Chickpea (Chana)', 'Pigeon Pea (Tur/Arhar)'],
  'Maharashtra:Amravati': ['Cotton', 'Soybean', 'Wheat', 'Sorghum (Jowar)', 'Pigeon Pea (Tur/Arhar)'],
  'Maharashtra:Aurangabad': ['Sugarcane', 'Cotton', 'Soybean', 'Sorghum (Jowar)', 'Maize'],
  'Maharashtra:Jalgaon': ['Banana', 'Cotton', 'Maize', 'Wheat', 'Tomato'],
  'Maharashtra:Kolhapur': ['Sugarcane', 'Rice', 'Groundnut', 'Soybean', 'Vegetables'],
  'Maharashtra:Latur': ['Soybean', 'Pigeon Pea (Tur/Arhar)', 'Chickpea (Chana)', 'Sorghum (Jowar)', 'Wheat'],
  'Maharashtra:Nagpur': ['Cotton', 'Orange', 'Soybean', 'Sorghum (Jowar)', 'Wheat'],
  'Maharashtra:Nashik': ['Onion', 'Tomato', 'Grape', 'Wheat', 'Maize', 'Sugarcane', 'Pomegranate'],
  'Maharashtra:Pune': ['Sugarcane', 'Onion', 'Wheat', 'Bajra (Pearl Millet)', 'Tomato', 'Potato'],
  'Maharashtra:Solapur': ['Pomegranate', 'Onion', 'Sugarcane', 'Cotton', 'Sorghum (Jowar)'],
  // Odisha
  'Odisha:All Districts': ['Rice', 'Maize', 'Sorghum (Jowar)', 'Groundnut', 'Cotton', 'Sugarcane', 'Jute', 'Turmeric', 'Ginger', 'Pigeon Pea (Tur/Arhar)', 'Green Gram (Moong)', 'Black Gram (Urad)'],
  'Odisha:Bolangir': ['Rice', 'Cotton', 'Pigeon Pea (Tur/Arhar)', 'Groundnut', 'Maize'],
  'Odisha:Cuttack': ['Rice', 'Jute', 'Vegetables', 'Mustard', 'Green Gram (Moong)'],
  'Odisha:Ganjam': ['Rice', 'Sugarcane', 'Coconut', 'Cotton', 'Groundnut'],
  'Odisha:Khordha': ['Rice', 'Vegetables', 'Coconut', 'Maize', 'Groundnut'],
  'Odisha:Koraput': ['Rice', 'Maize', 'Ginger', 'Turmeric', 'Pigeon Pea (Tur/Arhar)'],
  'Odisha:Puri': ['Rice', 'Vegetables', 'Coconut', 'Groundnut', 'Maize'],
  'Odisha:Sambhalpur': ['Rice', 'Cotton', 'Maize', 'Groundnut', 'Sesame (Til)'],
  'Odisha:Sundargarh': ['Rice', 'Maize', 'Cotton', 'Vegetables', 'Pigeon Pea (Tur/Arhar)'],
  // Punjab
  'Punjab:All Districts': ['Wheat', 'Rice', 'Maize', 'Cotton', 'Potato', 'Sugarcane', 'Sunflower', 'Mustard', 'Bajra (Pearl Millet)'],
  'Punjab:Amritsar': ['Wheat', 'Rice', 'Maize', 'Potato', 'Sugarcane'],
  'Punjab:Bathinda': ['Wheat', 'Cotton', 'Rice', 'Mustard', 'Sunflower'],
  'Punjab:Ferozpur': ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'],
  'Punjab:Gurdaspur': ['Wheat', 'Rice', 'Sugarcane', 'Maize', 'Potato'],
  'Punjab:Jalandhar': ['Wheat', 'Potato', 'Sugarcane', 'Maize', 'Rice'],
  'Punjab:Ludhiana': ['Wheat', 'Cotton', 'Potato', 'Maize', 'Rice'],
  'Punjab:Moga': ['Wheat', 'Cotton', 'Rice', 'Potato', 'Mustard'],
  'Punjab:Patiala': ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Potato'],
  // Rajasthan
  'Rajasthan:All Districts': ['Wheat', 'Bajra (Pearl Millet)', 'Maize', 'Sorghum (Jowar)', 'Mustard', 'Chickpea (Chana)', 'Cumin (Jeera)', 'Coriander', 'Groundnut', 'Sesame (Til)', 'Guar', 'Moth Bean', 'Fenugreek (Methi)'],
  'Rajasthan:Ajmer': ['Wheat', 'Bajra (Pearl Millet)', 'Maize', 'Mustard', 'Cumin (Jeera)'],
  'Rajasthan:Alwar': ['Wheat', 'Mustard', 'Bajra (Pearl Millet)', 'Tomato', 'Potato'],
  'Rajasthan:Bharatpur': ['Wheat', 'Mustard', 'Maize', 'Potato', 'Bajra (Pearl Millet)'],
  'Rajasthan:Bikaner': ['Bajra (Pearl Millet)', 'Moth Bean', 'Guar', 'Cumin (Jeera)', 'Sesame (Til)'],
  'Rajasthan:Jaipur': ['Wheat', 'Mustard', 'Bajra (Pearl Millet)', 'Sorghum (Jowar)', 'Maize'],
  'Rajasthan:Jodhpur': ['Bajra (Pearl Millet)', 'Moth Bean', 'Guar', 'Sesame (Til)', 'Cumin (Jeera)'],
  'Rajasthan:Kota': ['Soybean', 'Wheat', 'Mustard', 'Maize', 'Sorghum (Jowar)'],
  'Rajasthan:Udaipur': ['Wheat', 'Maize', 'Soybean', 'Rice', 'Sorghum (Jowar)'],
  // Tamil Nadu
  'Tamil Nadu:All Districts': ['Rice', 'Sugarcane', 'Cotton', 'Banana', 'Mango', 'Coconut', 'Turmeric', 'Groundnut', 'Sorghum (Jowar)', 'Ragi (Finger Millet)', 'Maize', 'Tapioca', 'Black Pepper', 'Cardamom'],
  'Tamil Nadu:Coimbatore': ['Cotton', 'Banana', 'Coconut', 'Maize', 'Turmeric'],
  'Tamil Nadu:Dindigul': ['Cotton', 'Banana', 'Tapioca', 'Vegetables', 'Maize'],
  'Tamil Nadu:Erode': ['Turmeric', 'Banana', 'Sugarcane', 'Coconut', 'Cotton'],
  'Tamil Nadu:Madurai': ['Rice', 'Banana', 'Cotton', 'Sugarcane', 'Vegetables'],
  'Tamil Nadu:Salem': ['Sugarcane', 'Maize', 'Turmeric', 'Banana', 'Mango'],
  'Tamil Nadu:Thanjavur': ['Rice', 'Banana', 'Sugarcane', 'Coconut', 'Groundnut'],
  'Tamil Nadu:Tirunelveli': ['Rice', 'Banana', 'Cotton', 'Groundnut', 'Tapioca'],
  'Tamil Nadu:Vellore': ['Sugarcane', 'Rice', 'Groundnut', 'Mango', 'Vegetables'],
  // Telangana
  'Telangana:All Districts': ['Rice', 'Cotton', 'Maize', 'Sorghum (Jowar)', 'Sunflower', 'Turmeric', 'Groundnut', 'Chilli', 'Soybean', 'Pigeon Pea (Tur/Arhar)', 'Green Gram (Moong)'],
  'Telangana:Hyderabad': ['Vegetables', 'Rice', 'Maize', 'Flowers'],
  'Telangana:Karimnagar': ['Rice', 'Cotton', 'Maize', 'Chilli', 'Sorghum (Jowar)'],
  'Telangana:Khammam': ['Cotton', 'Rice', 'Maize', 'Sugarcane', 'Chilli'],
  'Telangana:Medak': ['Cotton', 'Maize', 'Rice', 'Sunflower', 'Sorghum (Jowar)'],
  'Telangana:Nalgonda': ['Cotton', 'Sunflower', 'Maize', 'Rice', 'Sorghum (Jowar)'],
  'Telangana:Nizamabad': ['Turmeric', 'Rice', 'Maize', 'Sorghum (Jowar)', 'Sugarcane'],
  'Telangana:Rangareddy': ['Vegetables', 'Rice', 'Maize', 'Cotton', 'Flowers'],
  'Telangana:Warangal': ['Cotton', 'Rice', 'Maize', 'Chilli', 'Pigeon Pea (Tur/Arhar)'],
  // Uttar Pradesh
  'Uttar Pradesh:All Districts': ['Wheat', 'Rice', 'Maize', 'Sugarcane', 'Potato', 'Mustard', 'Sorghum (Jowar)', 'Bajra (Pearl Millet)', 'Lentil (Masoor)', 'Chickpea (Chana)', 'Tomato', 'Onion'],
  'Uttar Pradesh:Agra': ['Wheat', 'Potato', 'Mustard', 'Maize', 'Tomato'],
  'Uttar Pradesh:Allahabad': ['Wheat', 'Rice', 'Maize', 'Potato', 'Guava'],
  'Uttar Pradesh:Kanpur': ['Wheat', 'Sugarcane', 'Mustard', 'Lentil (Masoor)', 'Potato'],
  'Uttar Pradesh:Lucknow': ['Wheat', 'Rice', 'Potato', 'Sugarcane', 'Vegetables'],
  'Uttar Pradesh:Mathura': ['Wheat', 'Mustard', 'Potato', 'Tomato', 'Maize'],
  'Uttar Pradesh:Meerut': ['Wheat', 'Sugarcane', 'Maize', 'Potato', 'Vegetables'],
  'Uttar Pradesh:Muzaffarnagar': ['Sugarcane', 'Wheat', 'Maize', 'Rice', 'Potato'],
  'Uttar Pradesh:Varanasi': ['Rice', 'Wheat', 'Tomato', 'Brinjal (Eggplant)', 'Vegetables'],
  // West Bengal
  'West Bengal:All Districts': ['Rice', 'Jute', 'Potato', 'Wheat', 'Maize', 'Tea', 'Mustard', 'Vegetables', 'Tomato', 'Onion'],
  'West Bengal:Bankura': ['Rice', 'Potato', 'Mustard', 'Maize', 'Vegetables'],
  'West Bengal:Bardhaman': ['Rice', 'Wheat', 'Potato', 'Mustard', 'Jute'],
  'West Bengal:Hooghly': ['Rice', 'Jute', 'Vegetables', 'Potato', 'Mustard'],
  'West Bengal:Howrah': ['Rice', 'Vegetables', 'Potato', 'Jute', 'Mustard'],
  'West Bengal:Jalpaiguri': ['Tea', 'Rice', 'Maize', 'Jute', 'Ginger'],
  'West Bengal:Malda': ['Mango', 'Rice', 'Maize', 'Jute', 'Vegetables'],
  'West Bengal:Murshidabad': ['Rice', 'Jute', 'Potato', 'Mustard', 'Vegetables'],
  'West Bengal:Nadia': ['Rice', 'Jute', 'Vegetables', 'Potato', 'Mustard'],
};

function generateAdvisory(crop: string, soil: string, state: string): Advisory {
  const advisories: Record<string, Advisory> = {
    Wheat: {
      plantingSchedule: 'Optimal sowing: October 15 – November 15. Use certified seeds at 100 kg/ha. Row spacing: 22.5 cm.',
      irrigationAdvice: 'Apply 6 irrigations: Crown Root Initiation (CRI), Tillering, Jointing, Flowering, Grain Filling, and Dough stage.',
      pestControl: 'Monitor for Yellow Rust and Aphids. Apply Propiconazole for rust. Use Imidacloprid for aphid control.',
      weatherAlert: '⚠️ Light frost expected this week. Cover young seedlings or apply anti-frost measures.',
      bestPractices: [
        'Apply 120-60-40 kg/ha NPK fertilizer as basal dose',
        'Use zero tillage or minimum tillage to conserve moisture',
        'Harvest at 13–14% grain moisture for optimal storage',
        'Store grain below 12% moisture to prevent mold',
      ],
    },
    Rice: {
      plantingSchedule: 'Transplant: June 15 – July 15 in kharif season. Use 25–30 day old seedlings. Spacing: 20x15 cm.',
      irrigationAdvice: 'Maintain 5 cm standing water for first 3 weeks. Alternate wetting and drying (AWD) saves 30% water.',
      pestControl: 'Check for Brown Plant Hopper (BPH) and Blast disease. Apply Tricyclazole for blast. Use Cartap for BPH.',
      weatherAlert: '🌧️ Heavy rainfall expected. Ensure proper drainage to prevent waterlogging damage.',
      bestPractices: [
        'Use SRI (System of Rice Intensification) for 20-30% higher yield',
        'Apply split dose of nitrogen: 50% basal, 25% at tillering, 25% at panicle initiation',
        'Keep fields clean to reduce weed competition',
        'Harvest at 20-25% grain moisture; field dry to 14% before storage',
      ],
    },
  };

  const base = advisories[crop] || {
    plantingSchedule: `For ${crop} in ${state}: Consult your local Krishi Vigyan Kendra (KVK) for state-specific sowing dates. Generally sow after first monsoon rains.`,
    irrigationAdvice: `Irrigate ${crop} based on soil moisture. Apply water when topsoil dries to 2 cm depth. Drip irrigation recommended for water saving.`,
    pestControl: `Regular scouting of ${crop} fields recommended. Use pheromone traps for pest monitoring. Apply IPM-based control measures.`,
    weatherAlert: '☀️ Clear skies expected for next 5 days. Good conditions for field operations.',
    bestPractices: [
      'Conduct soil test before every season for optimal fertilizer application',
      'Use certified disease-free seeds from registered dealers',
      'Follow crop rotation to break pest and disease cycles',
      `Join local ${state} farmer cooperative for market access`,
    ],
  };

  if (soil === 'Sandy') {
    base.irrigationAdvice += ' Sandy soils need more frequent, lighter irrigations due to low water retention.';
  } else if (soil === 'Clay') {
    base.irrigationAdvice += ' Clay soils retain water well — avoid over-irrigation to prevent waterlogging.';
  }

  return base;
}

export default function SmartFarmingAdvisory() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [crop, setCrop] = useState('');
  const [soil, setSoil] = useState('');
  const [selectedState, setSelectedState] = useState(user?.state || '');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [advisory, setAdvisory] = useState<Advisory | null>(null);
  const [loading, setLoading] = useState(false);

  const districts = selectedState ? (STATE_DISTRICTS[selectedState] || []) : [];

  const cropKey = selectedState && selectedDistrict && selectedDistrict !== 'All Districts'
    ? `${selectedState}:${selectedDistrict}`
    : selectedState
      ? `${selectedState}:All Districts`
      : '';
  const availableCrops = cropKey && DISTRICT_CROPS[cropKey]
    ? DISTRICT_CROPS[cropKey]
    : ALL_CROPS;

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setSelectedDistrict('');
    setCrop('');
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setCrop('');
  };

  const locationLabel = selectedState
    ? (selectedDistrict && selectedDistrict !== 'All Districts'
        ? `${selectedDistrict}, ${selectedState}`
        : selectedState)
    : '';

  const handleGetAdvice = async () => {
    if (!crop || !soil || !selectedState) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setAdvisory(generateAdvisory(crop, soil, locationLabel || selectedState));
    setLoading(false);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>🌾 {t.advisoryTitle}</h1>
        <p>{t.advisorySubtitle}</p>
      </div>

      <div className="content-grid two-col">
        <div className="card">
          <h3>🗺️ Farm Details</h3>
          <div className="form-group">
            <label>{t.state}</label>
            <select value={selectedState} onChange={e => handleStateChange(e.target.value)}>
              <option value="">Select state</option>
              {Object.keys(STATE_DISTRICTS).sort().map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {districts.length > 0 && (
            <div className="form-group">
              <label>District</label>
              <select value={selectedDistrict} onChange={e => handleDistrictChange(e.target.value)}>
                <option value="">Select district</option>
                {districts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-group">
            <label>{t.cropName}</label>
            <select value={crop} onChange={e => setCrop(e.target.value)}>
              <option value="">Select crop</option>
              {availableCrops.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t.soilType}</label>
            <select value={soil} onChange={e => setSoil(e.target.value)}>
              <option value="">Select soil type</option>
              {SOIL_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button
            className="btn btn-primary btn-large"
            onClick={handleGetAdvice}
            disabled={!crop || !soil || !selectedState || loading}
          >
            {loading ? `⏳ ${t.loading}` : `🌾 ${t.getAdvice}`}
          </button>
        </div>

        <div className="card">
          <h3>📋 {t.advisory}</h3>
          {!advisory && (
            <div className="empty-state">
              <span>🌾</span>
              <p>Fill in your farm details and get personalized advice</p>
            </div>
          )}
          {advisory && (
            <div className="advisory-result">
              <div className="advisory-item">
                <h4>🗓️ {t.plantingSchedule}</h4>
                <p>{advisory.plantingSchedule}</p>
              </div>
              <div className="advisory-item">
                <h4>💧 {t.irrigationAdvice}</h4>
                <p>{advisory.irrigationAdvice}</p>
              </div>
              <div className="advisory-item">
                <h4>🐛 {t.pestControl}</h4>
                <p>{advisory.pestControl}</p>
              </div>
              <div className="advisory-item weather-alert">
                <h4>⛅ {t.weatherAlert}</h4>
                <p>{advisory.weatherAlert}</p>
              </div>
              <div className="advisory-item">
                <h4>✅ Best Practices</h4>
                <ul>
                  {advisory.bestPractices.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

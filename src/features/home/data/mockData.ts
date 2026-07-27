export interface Streamer {
  id: string;
  name: string;
  viewers: string;
  flag: string;
  country: string;
  imageUri: string;
  avatarUri: string;
}

export const COUNTRY_TABS = [
  { id: 'global',      label: 'Global',       flag: '🌐' },
  { id: 'india',       label: 'India',        flag: '🇮🇳' },
  { id: 'philippines', label: 'Philippines',  flag: '🇵🇭' },
  { id: 'brazil',      label: 'Brazil',       flag: '🇧🇷' },
  { id: 'usa',         label: 'USA',          flag: '🇺🇸' },
  { id: 'korea',       label: 'Korea',        flag: '🇰🇷' },
  { id: 'japan',       label: 'Japan',        flag: '🇯🇵' },
  { id: 'mexico',      label: 'Mexico',       flag: '🇲🇽' },
  { id: 'germany',     label: 'Germany',      flag: '🇩🇪' },
  { id: 'china',       label: 'China',        flag: '🇨🇳' },
  { id: 'russia',      label: 'Russia',       flag: '🇷🇺' },
  { id: 'colombia',    label: 'Colombia',     flag: '🇨🇴' },
];

const FIRST_NAMES = [
  'Sofia', 'Mia', 'Priya', 'Emily', 'Aisha', 'Luna', 'Camila', 'Anna', 'Yuna', 'Sara',
  'Mei', 'Fatima', 'Lena', 'Bea', 'Nina', 'Grace', 'Hana', 'Rina', 'Dani', 'Yara',
  'Elena', 'Chloe', 'Zoe', 'Maya', 'Zara', 'Leila', 'Amara', 'Olivia', 'Emma', 'Ava',
];

const LAST_NAMES = [
  'Chen', 'Nakamura', 'Sharma', 'Rose', 'Diallo', 'Park', 'Reyes', 'Müller', 'Kim', 'Ali',
  'Lin', 'Noor', 'Popov', 'Santos', 'Torres', 'Osei', 'Suzuki', 'Patel', 'Brooks', 'Silva',
  'Gomez', 'Lee', 'Singh', 'Wang', 'Johnson', 'Smith', 'Davies', 'Kumar', 'Rodriguez', 'Costa',
];

const COUNTRIES = [
  { id: 'india', flag: '🇮🇳' },
  { id: 'philippines', flag: '🇵🇭' },
  { id: 'brazil', flag: '🇧🇷' },
  { id: 'usa', flag: '🇺🇸' },
  { id: 'korea', flag: '🇰🇷' },
  { id: 'japan', flag: '🇯🇵' },
  { id: 'mexico', flag: '🇲🇽' },
  { id: 'germany', flag: '🇩🇪' },
  { id: 'china', flag: '🇨🇳' },
  { id: 'russia', flag: '🇷🇺' },
  { id: 'colombia', flag: '🇨🇴' },
];

const IMAGE_POOL = [
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80',
  'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80',
  'https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
  'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
];

const AVATAR_POOL = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&q=80',
];

// Generate exactly 100 unique streamers
export const generateMockStreamers = (): Streamer[] => {
  const list: Streamer[] = [];
  
  for (let i = 1; i <= 100; i++) {
    const fName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lName = LAST_NAMES[i % LAST_NAMES.length];
    const countryObj = COUNTRIES[i % COUNTRIES.length];
    const viewersVal = (Math.random() * 15 + 1.2).toFixed(1); // 1.2K to 16.2K
    
    list.push({
      id: String(i),
      name: `${fName} ${lName}`,
      viewers: `${viewersVal}K`,
      flag: countryObj.flag,
      country: countryObj.id,
      imageUri: IMAGE_POOL[i % IMAGE_POOL.length],
      avatarUri: AVATAR_POOL[i % AVATAR_POOL.length],
    });
  }
  
  return list;
};

export const MOCK_DATA = generateMockStreamers();

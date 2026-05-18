import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RegionData {
  id: string;
  name: string;
  traditions: string[];
  festivals: string[];
  foods: string[];
  languages: string[];
  clothing: string;
  history: string;
  music: string;
  summary?: string;
  images: string[];
}

const REGIONS_DATA: Record<string, RegionData> = {
  tigray: {
    id: 'tigray',
    name: 'Tigray',
    traditions: ['Ashenda Festival', 'Traditional coffee ceremony', 'Deep Orthodox Christian heritage'],
    festivals: ['Ashenda', 'Timkat in Axum'],
    foods: ['Tihlo', 'Injera with Sebhi'],
    languages: ['Tigrinya'],
    clothing: ['Tilfi (Embroidered dresses)'],
    history: 'Heart of the ancient Aksumite Empire, home to the Ark of the Covenant according to tradition.',
    music: 'Guayla (dynamic, circular dance music)',
    images: ['https://picsum.photos/id/1011/800/600', 'https://picsum.photos/id/1012/800/600'],
    summary: 'The northernmost region of Ethiopia, rich in ancient history and monolithic churches.'
  },
  oromiya: {
    id: 'oromiya',
    name: 'Oromia',
    traditions: ['Gadaa System (indigenous democratic system)', 'Irreechaa festival'],
    festivals: ['Irreechaa (Thanksgiving)'],
    foods: ['Chumbo', 'Oatmeal with butter', 'Ancootee'],
    languages: ['Afaan Oromo'],
    clothing: ['Kuandee', 'Aadaa Oromo attire'],
    history: 'Birthplace of coffee (Kaffa region historically connected). Home to the ancient Gadaa system.',
    music: 'Ragada and Shaggooyyee dance styles',
    images: ['https://picsum.photos/id/1015/800/600', 'https://picsum.photos/id/1016/800/600'],
    summary: 'The largest region in Ethiopia, known for its diverse landscapes, coffee, and rich Gadaa heritage.'
  },
  amhara: {
    id: 'amhara',
    name: 'Amhara',
    traditions: ['Eskista dance', 'Stretching religious fasts', 'Intricate weaving'],
    festivals: ['Genna in Lalibela', 'Timkat in Gondar'],
    foods: ['Doro Wat', 'Kitfo (influenced)', 'Injera'],
    languages: ['Amharic'],
    clothing: ['Habesha Kemis'],
    history: 'Home to the rock-hewn churches of Lalibela and the castles of Gondar.',
    music: 'Eskista (shoulder-focused dance music)',
    images: ['https://picsum.photos/id/1018/800/600', 'https://picsum.photos/id/1019/800/600'],
    summary: 'A region characterized by high mountains, ancient castles, and deep Christian orthodox traditions.'
  },
  somalia: {
    id: 'somalia',
    name: 'Somali',
    traditions: ['Nomadic pastoralism', 'Camel herding culture', 'Storytelling and poetry'],
    festivals: ['Eid celebrations'],
    foods: ['Bariis (Rice with meat)', 'Muqmad (Dried meat)'],
    languages: ['Somali'],
    clothing: ['Koofiyad and Macawiis for men, Dirac for women'],
    history: 'Historically part of trade routes connecting the horn to the Arab world.',
    music: 'Dhaanto (traditional folk dance and music)',
    images: ['https://picsum.photos/id/1021/800/600', 'https://picsum.photos/id/1022/800/600'],
    summary: 'An arid and beautiful region dominated by pastoralist culture and vibrant trade history.'
  },
  afar: {
    id: 'afar',
    name: 'Afar',
    traditions: ['Nomadic lifestyle', 'Salt mining in Danakil'],
    festivals: ['Tribal gatherings'],
    foods: ['Milk and meat-based diet'],
    languages: ['Afar'],
    clothing: ['Sanafil (wraparound skirt)'],
    history: 'The Danakil Depression is one of the hottest places on earth. Discovery site of "Lucy" (Dinknesh).',
    music: 'High-energy warrior dances',
    images: ['https://picsum.photos/id/1024/800/600', 'https://picsum.photos/id/1025/800/600'],
    summary: 'A land of extremes, featuring active volcanoes, salt flats, and the cradle of humanity.'
  }
};

const CulturalMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>('oromiya');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRegions = useMemo(() => {
    return Object.values(REGIONS_DATA).filter(region => 
      region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      region.traditions.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const activeRegionData = selectedRegion ? REGIONS_DATA[selectedRegion] : null;

  return (
    <div className="min-h-screen bg-stone-50 p-6 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10 text-center lg:text-left">
          <span className="bg-amber-500 text-stone-900 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-3 inline-block shadow-lg">Interactive Experience</span>
          <h1 className="text-5xl font-black text-stone-900 tracking-tighter leading-none mb-2">Cultural <span className="text-amber-600">Atlas</span> of Ethiopia</h1>
          <p className="text-stone-500 text-sm font-medium">Explore the rich diversity, traditions, and history of Ethiopia's regions.</p>
        </header>

        {/* Search Bar */}
        <div className="relative mb-10 max-w-2xl mx-auto lg:mx-0">
          <input 
            type="text"
            placeholder="Search regions, traditions, or festivals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-14 bg-white border-2 border-stone-100 rounded-2xl px-14 text-sm font-bold focus:border-amber-500 focus:outline-none focus:ring-4 focus:ring-amber-500/10 transition-all shadow-sm"
          />
          <svg className="w-5 h-5 absolute left-5 top-4.5 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">
          {/* Map Column */}
          <div className="lg:col-span-7 bg-white p-6 rounded-[2.5rem] border border-stone-200 shadow-xl flex items-center justify-center min-h-[500px]">
            <div className="relative w-full max-w-2xl">
              {/* Fallback list for search on mobile/small screens */}
              {searchQuery && (
                <div className="absolute top-0 left-0 right-0 bg-white/95 backdrop-blur-sm z-10 p-4 rounded-2xl border border-stone-100 shadow-lg">
                  <p className="text-xs font-black text-stone-400 uppercase mb-2">Search Results</p>
                  <div className="flex flex-wrap gap-2">
                    {filteredRegions.map(r => (
                      <button 
                        key={r.id}
                        onClick={() => setSelectedRegion(r.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedRegion === r.id ? 'bg-amber-500 text-stone-900' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}`}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 441.853 328.295"
                className="w-full h-auto"
              >
                {/* Tigray Region */}
                <motion.polygon
                  id="tigray"
                  points="202.882 11.743 200.309 11.296 193.93 11.403 188.826 9.383 185.105 12.36 182.766 7.894 180.427 7.15 177.875 7.15 175.643 9.383 164.913 12.18 163.203 12.572 161.396 12.679 155.867 6.937 148.106 2.578 146.085 0.771 143.853 4.386 139.964 13.087 138.537 14.805 131.626 11.297 123.333 12.785 120.037 15.124 119.186 17.038 116.499 17.038 113.551 15.656 110.716 16.365 106.003 16.612 102.494 24.268 102.281 27.457 103.238 30.221 101.407 33.683 104.553 36.007 104.856 36.585 107.835 36.958 108.378 37.683 111.006 37.683 116.034 42.368 119.653 42.996 122.548 41.225 126.09 41.111 126.834 42.506 134.547 43.054 139.46 39.283 139.689 36.883 141.289 35.054 143.231 37.797 146.888 38.94 157.058 39.397 161.058 37.226 163.801 39.625 167.343 39.397 168.714 40.54 169.4 46.368 175.257 46.584 178.084 48.481 177.883 53.167 184.027 53.453 185.627 62.023 182.676 63.393 184.255 67.81 184.141 72.308 185.741 73.45 192.712 72.879 194.54 74.199 196.826 73.222 200.482 73.222 200.593 66.388 203.111 62.48 203.453 59.395 199.568 56.995 199.682 47.625 198.197 46.482 198.882 44.196 199.225 38.14 201.625 37.111 201.511 34.369 200.939 33.798 200.597 22.827 196.94 19.97 198.654 16.885 197.168 15.171 201.396 13.8 202.882 11.743"
                  className="cursor-pointer"
                  fill={selectedRegion === 'tigray' ? '#F59E0B' : hoveredRegion === 'tigray' ? '#FBBF24' : '#E7E5E4'}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                  onClick={() => setSelectedRegion('tigray')}
                  onMouseEnter={() => setHoveredRegion('tigray')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />

                {/* Oromiya Region */}
                <motion.path
                  id="oromiya"
                  d="M293.615,182.664l-1.974-3.509.439-3.509-6.58-6.361-.691-3.365L280.3,155.6l-1.594-.354-1.974-5.264-2.576,1.522-2.232.268-.714.893-.179,2.857-.714.714-4.115.727-7.58.523-2.053-1.518-3.661.447-.982,1.16-1.339-.178-3.571-1.34-3.035.447-9.553,5.446-2.465-1.531,2.69-1.014.222-1.83-.983-.8h-2.344l-.869.892h-1.161l-1.695-1.375-.634,2.812-5.273.692-.317,1.581-6.812,7.548-.3,2.251-3.951,3.951-1.983-.029,1.674-3.952-2.852-.6-3.793-4.129-2.687.81-.155,7.112-2.532.632-4.267,2.845-2.371-2.055-1.739,1.581-2.1.752-.889-6.216,2.836-4.335-2.853-2.106-.466-2.794,5.374-1.9-.153-2.6-4.019-1.168.055-1.527,1.763-.13,1.722-5.165-1.739-1.422-4.583,1.738-1.22,3.66-2.574-.341-1.9-4.267-3.278.5-2.775-1.536-.263-5.083-3.8-2.888,4.8-2.32-.053-6.689-8.693-.474-2.949,3.881-.36,2.061-3.217,1.744-11.966,5.748h-1.9l-.949,1.9-4.425-.158-4.267-4.425-2.061.259-.143-1.663-3.4,1.352-4.509-3.168v-2.944l-3.813-1.624-1.369,1.895-3.465.192-1.867-2.2-2.97.112-4.171,2.305-2.324-2.325-1.89-.192-1.756,1.775-.292,2.609-1.62,1.769-4.862.868.109,11.437,5.469,4.387,1,.2.889-1.085,3.329.859L103.7,157.94l-.329,1.868-.908,1.11-2.388-1.33-.311,1.661-1.423-.6-2.551.153-1.208,1.318,2.145,1.609-.5,2.456-3.3,1.1-2.087-2.967-3.956-3.076-3.185.22-.536-3.75-2.76-2.4.2-1.406-3.429-3.258-2.512-.06-.3-.769H71.617l-.158-2.689-2.479-2.7-3.845-1.538-2.637.989-1.487-2.019-2.578-.508-.854,5.339-2,1.3-.529,4.678L53,155.237l-2.7-1.131-3.181-2.757-3.076.219.549,2.637,2.21,1.263-.672,1.154-2.237,1.385.146,4.482-1.425,1.933-3.076,1.1-5.158-.1.936,16.424,2.415.384.125-1.292,2.274.155,10.55,9.4-.005.638,3.37-.065,1.4,2.438,7.676.24-5.267,3.795,2,1.372-3.227,3.1.541,2.546,3.241,2.868.918,3.307,2.777,1.3,0,1.677,1.671.7,2.554-.334-.212-6.34,6.15-5.131,3.651,1.718,4.7-1.279,1.538-1.978-2.417-2.856,1.318-2.418,3.306,1.4.641,5.556-1.222,1.308,5.076,3.53.53,4.478,2.324-.417,3.076,2.085,2.531.521,1.659,1.866,5.08.112,8.513,5.193,9.647-.183,7.464-4.905,1.26-4.061-.879-3.3-.65-4.767,1.063-2.856-1.624-1.413,2.749-1.073,1.946,1.514,1.711-.4.518-7.491-3.037-.513-1.8-1.685,1.978-3.516,2.856,2.2,8.865.439,5.074-2.145,5.18.607,2.123,2.971,1.868.909,2.568-5.565,2.812.355,3.741,6.259-.366,2.323L166.1,192.8l1.539,4.664-2.09,4.523-3.158,5.225-1.1,5.933-3.673,4.754-5.26,3.979-.719,6.477.019.153,4.8-1.3,3.076-3.077h7.472l3.077,6.373-1.539,3.3,2.933,1.369,3.22,2.147,5.118,1.493,2.354,4,.835,4.176-1.274,2.417.879,2.637-1.978,1.538-9.669-8.131-6.593-1.318-1.978,2.857h0l-.659,3.516-1.319,1.538-2.2,4.175,2.417,1.758-.22,1.978L156.866,261l-.848-.165-4.4-7.471.22-1.319,2.417-.659.879-3.736,2.2-2.2.439-1.041,2.308-.184h-2.53l-1.316-.752-2.2.439L150.3,240.4h-3.516l.143-.114-4.1,2.531,1.1,2.2.219,5.494-1.977,3.736,1.1,2.2,4.592,1.461,3.851,6.02-.673,2.413-2.843.428-.312,5.5L145.47,274.9l1.454,2.285-1.333,1.625-5.176-2.372-10.328,4.175-3.956-1.538-6.812.22-3.077,4.175.648,6.476-2.57,5.925-3.775,4.671-.331.466,3.572-.068,38.807,23.709s31.969,1.93,41.571,5.635l9.144-9.994.85-2.658,25.853-11.271.439-5.264-2.632-2.632,2.851-.658h3.32l6.769-4.167,1.96-4.029,1.33,1.178,10.747-.219-3.29-4.387H249.98l-3.3-6.579-.878-2.852v-1.535l-3.289-4.386,2.193-2.413.438-4.825-2.193-.658-9.65-9.65,1.1-7.676h1.754l3.948-4.168-.219-4.825,9.65,14.037h.658l2.632,3.509,4.386-3.728-1.316-5.264,4.825-4.606,4.606.219,3.28-6.153.449-3.058,3.509-7.018v-5.484l-1.316-1.1.658-1.535-4.387-4.168-.658-9.43,5.376-14.645.546-3.34-.219-2.412,1.563-.977,3.481,3.389,4.825.219.658,4.606,3.29,5.7,3.948-7.019,3.34-.626Z"
                  className="cursor-pointer"
                  fill={selectedRegion === 'oromiya' ? '#F59E0B' : hoveredRegion === 'oromiya' ? '#FBBF24' : '#E7E5E4'}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                  onClick={() => setSelectedRegion('oromiya')}
                  onMouseEnter={() => setHoveredRegion('oromiya')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />

                {/* Amhara Region */}
                <motion.polygon
                  id="amhara"
                  points="202.279 164.013 199.592 164.645 199.434 171.916 196.905 172.39 192.638 175.235 190.267 173.18 188.528 174.761 186.316 175.551 185.525 169.229 188.272 165.108 185.525 162.907 185.051 160.062 190.425 158.165 190.267 155.478 186.157 154.372 186.303 152.921 187.917 152.791 189.793 147.576 188.054 146.153 183.471 147.892 182.252 151.549 179.638 151.122 177.781 146.944 174.539 147.561 171.617 145.837 171.459 140.622 167.774 138.011 172.565 135.564 172.407 128.926 163.714 128.452 160.711 132.403 160.41 134.362 157.076 136.196 154.073 137.461 145.222 141.886 143.326 141.886 142.377 143.783 137.952 143.625 133.685 139.199 131.63 139.515 131.472 137.935 128.268 139.155 123.569 136.038 123.569 133.035 119.513 131.191 114.718 129.716 108.185 129.347 105.235 128.61 104.919 126.239 100.652 125.765 100.02 125.133 97.649 124.342 97.965 120.707 99.565 118.09 97.807 116.124 97.965 114.859 98.439 113.595 102.232 109.011 102.877 109.162 105.235 107.747 102.232 105.376 105.077 101.741 103.655 97.79 99.546 93.048 98.439 87.2 94.08 91.108 88.008 81.985 83.899 81.195 80.105 83.723 76.312 85.936 75.68 87.833 68.701 87.816 67.303 86.884 67.461 84.988 65.194 84.167 70.323 77.54 78.147 65.414 79.908 63.555 89.514 61.627 92.885 61.488 94.201 60.31 93.35 55.845 93.563 52.549 101.407 33.683 104.596 36.055 104.723 36.569 108.149 36.997 108.378 37.683 110.759 37.683 116.129 42.384 119.051 42.888 122.548 41.225 126.09 41.111 127.005 42.825 134.547 43.054 139.46 39.283 139.689 36.883 141.289 35.054 143.231 37.797 146.743 38.894 157.058 39.397 161.058 37.226 163.801 39.625 167.343 39.397 168.714 40.54 169.4 46.368 175.571 46.596 178.313 48.653 177.881 53.195 184.027 53.453 185.627 62.023 182.427 63.509 184.37 68.08 184.141 72.308 185.741 73.45 192.712 72.879 194.562 74.216 196.826 73.222 199.414 73.118 200.55 81.048 202.753 83.723 203.069 88.781 206.546 92.89 206.388 93.997 208.443 97.316 208.443 100.477 212.078 105.85 212.552 109.96 211.288 111.224 210.673 117.861 211.273 123.259 212.236 126.397 211.288 131.138 210.023 133.983 210.497 136.67 207.178 136.67 205.598 137.302 209.119 140.211 208.117 143.529 206.704 146.944 202.121 146.627 202.874 150.093 203.069 155.004 200.698 157.059 202.911 159.113 203.004 160.942 202.279 164.013"
                  className="cursor-pointer"
                  fill={selectedRegion === 'amhara' ? '#F59E0B' : hoveredRegion === 'amhara' ? '#FBBF24' : '#E7E5E4'}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                  onClick={() => setSelectedRegion('amhara')}
                  onMouseEnter={() => setHoveredRegion('amhara')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />

                {/* Somalia Region */}
                <motion.polygon
                  id="somalia"
                  points="435.339 196.127 429.429 196.825 412.524 196.825 353.82 177.356 325.342 167.481 307.161 152.915 303.227 146.19 301.845 143.24 298.544 141.514 290.362 131.864 286.641 122.189 289.937 115.809 293.432 111.361 285.79 108.792 269.842 111.557 263.782 112.088 258.577 111.075 244.32 111.382 244.162 113.121 239.105 119.759 238.472 124.026 237.208 126.871 236.027 131.888 233.731 138.409 236.892 141.254 233.025 143.931 230.886 144.573 230.412 146.311 227.087 152.024 226.52 153.823 228.215 155.088 229.376 155.088 230.001 154.195 232.59 154.195 233.572 154.999 233.482 156.784 230.536 157.766 232.956 159.268 237.927 156.778 242.678 153.927 245.713 153.481 249.284 154.82 250.623 154.999 251.605 153.838 255.266 153.392 257.319 154.909 256.646 154.412 257.765 151.338 258.212 149.196 260.533 149.196 262.318 148.035 265.979 150.267 270.889 145.446 273.032 145.446 275.016 147.405 273.005 148.828 270.621 149.196 272.941 148.871 275.174 147.41 275.429 147.405 277.403 152.669 278.938 152.888 283.544 163.416 284.202 166.706 290.782 173.066 290.388 176.215 292.317 180.084 292.524 184.847 289.027 185.787 286.078 191.474 285.079 192.805 281.77 186.97 281.131 182.497 276.306 182.278 273.016 178.768 271.262 179.865 271.458 182.44 270.933 185.621 267.095 195.218 265.559 200.262 266.202 209.448 270.604 213.86 269.946 215.395 271.077 216.338 271.262 221.975 267.753 228.993 267.533 231.625 264.024 238.205 259.418 237.986 254.593 242.591 255.909 247.855 251.674 251.455 248.891 248.075 248.233 248.075 238.739 234.265 238.802 238.863 234.854 243.03 233.1 243.03 232.031 250.511 241.469 260.173 243.846 261.015 243.408 265.84 241.215 268.252 244.504 272.639 244.504 274.174 245.491 277.23 248.891 283.605 250.207 283.605 253.497 287.991 242.75 288.211 241.434 287.333 239.46 291.062 232.886 295.436 229.371 295.229 226.52 295.887 229.152 298.519 228.79 302.472 229.266 303.435 241.455 313.034 253.949 312.321 263.357 311.12 266.759 308.249 287.81 305.06 296.741 295.703 303.546 290.706 313.482 287.4 326.192 284.54 338.465 285.172 354.032 284.865 374.372 264.99 384.356 254.783 400.074 238.589 410.702 227.549 421.928 215.724 432.514 205.234 440.805 197.038 435.339 196.127"
                  className="cursor-pointer"
                  fill={selectedRegion === 'somalia' ? '#F59E0B' : hoveredRegion === 'somalia' ? '#FBBF24' : '#E7E5E4'}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                  onClick={() => setSelectedRegion('somalia')}
                  onMouseEnter={() => setHoveredRegion('somalia')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />

                {/* Afar Region */}
                <motion.polygon
                  id="afar"
                  points="202.279 163.697 206.072 167.964 208.759 168.597 207.178 172.706 209.233 172.548 213.184 168.597 213.5 166.226 220.296 158.797 220.613 157.217 225.71 156.753 227.06 152.122 230.412 146.311 230.886 144.573 232.782 144.099 236.828 141.298 233.731 138.409 235.88 132.423 237.185 126.97 238.472 124.026 239.104 119.759 244.162 113.121 244.28 111.223 258.577 111.075 258.998 94.758 275.371 71.155 265.909 54.888 243.934 33.241 233.442 23.995 211.963 10.169 208.708 10.127 204.881 12.679 202.874 11.829 201.52 13.643 197.168 15.171 198.485 16.69 197.004 19.854 200.497 22.75 200.935 33.643 201.42 34.278 201.62 36.997 199.225 38.14 198.891 44.043 198.197 46.482 199.641 47.593 199.568 56.995 203.453 59.395 203.111 62.48 203.453 59.395 199.568 56.995 199.682 47.625 198.197 46.482 199.641 47.593 199.568 56.995 203.453 59.395 203.111 62.48 200.597 66.137 200.482 73.222 199.414 73.267 200.53 80.965 202.753 83.723 203.065 88.71 206.546 92.89 206.399 93.917 208.39 97.23 208.443 100.417 212.078 105.85 212.552 109.96 211.288 111.224 210.655 117.704 211.288 123.394 212.212 126.323 211.288 131.138 210.034 134.042 210.466 136.492 207.178 136.67 205.536 137.236 209.111 140.205 206.767 146.801 202.121 146.627 202.911 150.263 203.064 154.867 200.734 157.027 202.805 159.015 203.069 160.694 202.279 163.697"
                  className="cursor-pointer"
                  fill={selectedRegion === 'afar' ? '#F59E0B' : hoveredRegion === 'afar' ? '#FBBF24' : '#E7E5E4'}
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  whileHover={{ scale: 1.02, filter: 'brightness(1.05)' }}
                  onClick={() => setSelectedRegion('afar')}
                  onMouseEnter={() => setHoveredRegion('afar')}
                  onMouseLeave={() => setHoveredRegion(null)}
                />
              </svg>
            </div>
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {activeRegionData ? (
                <motion.div 
                  key={activeRegionData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white p-8 rounded-[2.5rem] border border-stone-200 shadow-xl"
                >
                  <div className="mb-6">
                    <span className="bg-stone-900 text-amber-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-2 inline-block shadow-lg">Region Details</span>
                    <h2 className="text-4xl font-black text-stone-900 tracking-tighter leading-none">{activeRegionData.name}</h2>
                  </div>

                  <p className="text-stone-600 text-sm mb-6 leading-relaxed">{activeRegionData.summary}</p>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Traditions</h4>
                      <ul className="text-sm text-stone-800 list-disc list-inside space-y-1">
                        {activeRegionData.traditions.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Local Foods</h4>
                      <div className="flex flex-wrap gap-2">
                        {activeRegionData.foods.map((f, i) => (
                          <span key={i} className="bg-stone-100 text-stone-800 text-xs font-bold px-3 py-1.5 rounded-lg">{f}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-black text-amber-600 uppercase tracking-widest mb-2">Music Style</h4>
                      <p className="text-sm text-stone-800 font-medium">{activeRegionData.music}</p>
                    </div>

                    <div className="pt-6 border-t border-stone-100">
                      <h4 className="text-xs font-black text-stone-400 uppercase tracking-widest mb-3">Gallery</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {activeRegionData.images.map((img, i) => (
                          <div key={i} className="relative h-24 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <img src={img} alt={`${activeRegionData.name} gallery ${i}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-white p-10 rounded-[2.5rem] border border-stone-200 shadow-xl text-center py-32">
                  <div className="w-20 h-20 bg-stone-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-stone-100">
                    <svg className="w-10 h-10 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  </div>
                  <p className="text-stone-400 font-black text-[10px] uppercase tracking-widest max-w-[200px] mx-auto">Select a region on the map to explore its heritage</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CulturalMap;

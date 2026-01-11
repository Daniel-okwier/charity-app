import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import { Button } from '@components/ui/button';
import { useAuth } from '@contexts/AuthContext';
import heroImage from '@assets/HERO1.jpg'; 
import arabicTextImage from '@assets/Teawoon-2.png';
import waterWellImage from '@assets/values.png';
import schoolConstructionImage from '@assets/quran.png';
import medicalProjectImage from '@assets/religion.png';
import mosqueImage from '@assets/mosque.png';
import icon2Image from '@assets/icon-2.png';
import religionImage from '@assets/religion.png';
import socialSecurityImage from '@assets/social-security.png';
import icon5Image from '@assets/icon-5.png';
import icon7Image from '@assets/icon-7.png';
import icon3Image from '@assets/icon-3.png';
import icon6Image from '@assets/icon-6.png';
import teawoonImage from '@assets/Teawoon-logo.jpg';
import AboutPage from './AboutPage'; 
import ProjectsPage from './ProjectsPage';  

const HomePage = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "አት-ተዓውን የዳዕዋና ኢስላማዊ አስተምህሮ ማህበር",
      description: "አት-ተዓውን የዳዕዋና ኢስላማዊ አስተምህሮ ማህበር” የተባለ ድርጅት በረመዳን 1444 አ.ሂ./በመጋቢት 2015 ዓ.ል. ተቋቁሟል፡፡"
    },
    {
      image: arabicTextImage,
      description: "ሁሉ አቀፍ በሆነ መልኩ የሙስሊሙን ችግር በመጋራት መፍትሄ ለማምጣት እንተጋለን"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section  id="home" className="relative h-[600px] overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={heroImage} alt="Hero Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative text-center z-10">
          {currentSlide === 0 ? (
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                <strong>{slides[currentSlide].title}</strong>
              </h1>
              <p className="hero-paragraph mb-8 text-gray-200">
                {slides[currentSlide].description}
              </p>
            </div>
          ) : (
            <div>
              <img src={slides[currentSlide].image} alt="Arabic Text" className="w-full h-auto mb-4" />
              <p className="hero-paragraph mb-8 text-gray-200">
                {slides[currentSlide].description}
              </p>
            </div>
          )}
          <div className="flex justify-center mt-4">
            <button onClick={prevSlide} className="text-white px-4 py-2">❮</button>
            <button onClick={nextSlide} className="text-white px-4 py-2">❯</button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <div id="about" className="scroll-mt-20">
        <AboutPage />
      </div>

 <section className="py-16 bg-white">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-800">
      {/* Left Column */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-islamic-primary">ራዕይ</h3>
        <p className="mb-4">
          የእስልምና ሀይማኖትን መሠረት በማድረግ ከሸሪዓ ሕግ እና ከማህበሩ ዓላማ አንጻር በመንቀሳቀስ በተለያየ ቦታ የሚገኘው ሙስሊም በማስተባበርና በመልካም ስራዎች ላይ በማነሳሳትና በመስገንዘብ ሙስሊሙ ማህበረሰብ ከዳዕዋና ኢስላማዊ አስተምህሮ እንዲሁም ከበጎ ተግባራት በላቀ ሁኔታ ተጠቃሚ እና ሃይማኖቱን በቅጡ ተረድቶ ተግባር ላይ የሚያውልና በጥሩ ስነምግባር የታነፀ ማህበረሰብ ተፈጥሮ
        </p>
      </div>
      {/* Right Column */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-islamic-primary">ተልዕኮ</h3>
        <p className="mb-4">
          በኢስላማዊ አስተምህሮ መነሻና ተቋማዊ በሆነ መልኩ ተግባራዊ እንቅስቃሴ በማድረግ ዲናችንን በማስተማር እና በማስፋፋት በሙስሊሙ ዘንድ የሚታየውን ክፍተት በተገቢው በመለየት ለማስተማር፣ ጅህልና ለመቀነስና የአክፍሮት ኃይላት እንቅስቃሴን ለመግታት ብሎም ማህበራችንን ለሙስሊሙ የግብረገብነት እና የማህበረሰባዊ ግንባታ ማዕከል ሆኖ እንዲያገለግል ማድረግ ነው፡፡
        </p>
      </div>
    </div>
    <div className="border-b-4 border-islamic-primary w-full mt-8"></div>
  </div>
</section>

<section className="py-16 px-4 md:px-8 max-w-screen-xl mx-auto">
  <h2 className="section-title text-center mb-8 font-bold text-3xl">
    የማህበሩ እሴቶች
  </h2>

  <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
    {/* Left Image */}
    <img 
      src={waterWellImage} 
      alt="Water Well Project" 
      className="w-full md:w-1/2 h-64 object-contain rounded-lg"
    />

    {/* Right Image */}
    <img 
      src={schoolConstructionImage} 
      alt="Education Project" 
      className="w-full md:w-1/2 h-64 object-contain rounded-lg"
    />
  </div>
</section>


<section className="py-16 px-4 md:px-6 max-w-5xl mx-auto">
  {/* Section Title */}
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
    የማህበሩ አላማና የትኩረት አቅጣጫዎች
  </h2>

  {/* Subtitle */}
  <div className="text-center mb-12">
    <span className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full text-sm md:text-base font-medium shadow-md">
      የማህበሩ ዓላማዎቻችንና የትኩረት አቅጣጫችን የሚከተሉት ይሆናሉ፡:-
    </span>
  </div>

  {/* Grid Block 1 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
    <div className="text-center">
      <img src={mosqueImage} alt="Goal" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">ትክክለኛ የሆነውን የእስልምና አስተምህሮ/አቂዳ ማስተማር</h3>
      <p className="text-sm text-gray-700">
        በጥቅል በሀገራችን ኢትዮጰያ በተለይም በስልጤ ክልል ትክክለኛ የሆነውን የእስልምና አስተምህሮ/አቂዳ ማስተማር፣ ሙስሊሙ ህ/ሰብ ኢስላማዊ እሴቶቹን እንዲጠብቅ ለማድረግ ከተለያዩ ኢስላማዊ ተቋማትና ማኅበራት ጋር በጋራ ለመስራት
      </p>
    </div>

    <div className="text-center">
      <img src={icon2Image} alt="Focus" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">አእምሮዋቸው በዲናዊ እውቀት የተገነባና ብቁ የሆኑ ወጣቶችን ማፍራት</h3>
      <p className="text-sm text-gray-700">
        ወቅቱንና ተጨባጩን የተረዱ፣ አእምሮዋቸው በዲናዊ እውቀት የተገነባና የበሰሉ፣ በስነምግባር የታነጹ፣ ሙያዊ ክህሎት ያላቸው፣ ኃላፊነት የሚሰማቸው እና በሁለንተናዊ የዱንያ ጉዳዮች ግንባር ቀደምና ብቁ የሆኑ ወጣቶችን በማፍራት ረገድ የርስ በርስ ግንኙነትን ለማጠናከር፣
      </p>
    </div>

    <div className="text-center">
      <img src={religionImage} alt="Impact" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">የአክፍሮት ኃይላት እንቅስቃሴን በተደራጀና በተናበበ መልኩ መመከት</h3>
      <p className="text-sm text-gray-700">
        ከፍተኛ የሆነ ትኩረት በመስጠት የአክፍሮት ኃይላት እንቅስቃሴን በተደራጀና በተናበበ መልኩ ለመመከት ተያያዥ ተግባራትን ለማከናወን
      </p>
    </div>
  </div>

  {/* Grid Block 2 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
    <div className="text-center">
      <img src={socialSecurityImage} alt="Goal" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">ህጻናቶችን/የቲሞችን እና አቅመ ደካሞችን በተገቢው ለይቶ መርዳት</h3>
      <p className="text-sm text-gray-700">
        ባሎቻቸው የሞቱባቸውን፣ ወላጆቻቸውን ያጡ ህጻናቶችን/የቲሞችን እና አቅመ ደካሞችን በተገቢው ለይቶ በመርዳት የአክፍሮት ኃይላት የሚገቡበትን መንገድ መዝጋትና መግቢያ ማሳጣት እንዲሁም በነዚህ የማህበረሰባችን አካላት ዘንድ ያሉ ኢኮኖሚያና ማህበራዊ ችግሮች እንዲቀረፉ ከሚመለከታቸው ጋር ተባብሮ ለመስራት
      </p>
    </div>

    <div className="text-center">
      <img src={icon5Image} alt="Focus" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">የሙስሊሙን አንድነት መጠበቅ እና ጤናማ ግንኙነት መፍጠር</h3>
      <p className="text-sm text-gray-700">
        ትክክለኛውን የኢስላም አስተምህሮን በመከተልና ሌሎችም እንዲከተሉ በማስገንዘብና በማነጽ የሙስሊሙ አንድነትና ጤናማ ግንኙነት በመፍጠርና በማረጋገጥ ረገድ የጎላ አስተዋጽኦ በማበርከት ግንኙነቱ የበለጠ እንዲጠናከር ለማድረግ፣
      </p>
    </div>

    <div className="text-center">
      <img src={icon7Image} alt="Impact" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">ልዩ ልዩ መጽሃፍትን የያዘ በዓይነቱ ለየት ያለ ቤተ-መጽሃፍት መመስረት</h3>
      <p className="text-sm text-gray-700">
        የዲናዊና አካዳሚክ ዕውቀት የሚሸመትባቸውንና ሙስሊሙ ህ/ሰብ ለማጣቀሻነት የሚገለገልባቸውን ልዩ ልዩ መጽሃፍትን የያዘ በዓይነቱ ለየት ያለ ቤተ-መጽሃፍት መመስረት፣ አገልግሎት እንዲሰጥ ማድረግና መሰረት ለመጣል
      </p>
    </div>
  </div>

  {/* Grid Block 3 */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
    <div className="text-center">
      <img src={icon3Image} alt="Goal" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">የቁርዓን ሂፍዝ ማዕከላትን መክፈትና አገልግሎት እንዲሰጡ ማድረግ</h3>
      <p className="text-sm text-gray-700">
        ተመላላሽና አዳሪ ወጣቶች ቁርዓን የሚያፍዙበት ማዕከል በመክፈት አገልግሎት እንዲሰጥ ማድረግ። እንዲሁም ሙስሊሙ አሉባልታ ወሬዎችን በመተው ወደ ቁርዓንና ሐዲስ ተመልሶ ትክክለኛውን የኢስላም ጎዳና እንዲያጸና ሰፊ የሆነ ስራ መስራት
      </p>
    </div>

    <div className="text-center">
      <img src={icon6Image} alt="Focus" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">የወቅፍ ማዕከል ማቋቋም</h3>
      <p className="text-sm text-gray-700">
        ለተለያዩ ከይር ስራዎች ምንጭና የሚደጉም ይሆን ዘንድ የወቅፍ ማዕከል ማቋቋም
      </p>
      <h3 className="text-xl font-bold mb-2 mt-6">በአደጋዎች ግዜ የተጎዱ አካላትን መርዳት</h3>
      <p className="text-sm text-gray-700">
        በልዩ ልዩ አደጋዎች የተጎዱ አካላትን ኢስላም በሚያዘው መሰረት መርዳት፣
      </p>
    </div>

    <div className="text-center">
      <img src={teawoonImage} alt="Impact" className="w-full h-60 object-contain rounded-lg mb-4" />
      <h3 className="text-xl font-bold mb-2">ከላይ ለተጠቀሱ ተግባራት ተፈጻሚነት በትጋት መስራት</h3>
      <p className="text-sm text-gray-700">
        ከተለያዩ ማህበራት፣ ድርጅቶች፣ መያዶች፣ የግል ሴክተሮች ጋር በመተባበር አጫጭር ስልጠናዎችንና የግንዛቤ ማስጨባጫ መድረኮችን በማዘጋጀት የምክር አገልግሎት መስጠትና ጥናታዊ ጽሁፎችን በማቅረብ ችግር ፈቺ ስራ ማከናወን የሚሉት ይጠቀሳሉ፡፡
      </p>
    </div>
  </div>
</section>


      <section className="py-16 px-4 md:px-8 bg-gray-100">
  <div className="max-w-screen-xl mx-auto">
    {/* Main Title */}
    <h2 className="text-3xl md:text-4xl font-bold mb-10 text-left text-green-700">
      አባል መሆን ይፈልጋሉ?
    </h2>

    {/* Two Columns */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Left Column - መደበኛ አባላት */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-green-700">መደበኛ አባላት</h3>
        <p className="mb-4">
          1. መስራች አባላትንና በጠቅላላው ጉባኤ ውሣኔ ተቀባይነት ያገኙ አባላትን ይይዛል፡፡
        </p>
        <p className="mb-4">
          2. የሚከተሉትን መመዘኛዎች የሚያሟላ/የምታሟላ ማንኛውም ሙስሊም ሰው መደበኛ አባል መሆን ይችላል/ትችላለች፡፡
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>በማህበሩ አላማና ግብ የሚያምን/የምታምን፤</li>
          <li>ዕድሜው/ዋ ከ15 ዓመት በላይ የሆነ/ች፣</li>
          <li>
            የማህበሩን የመተዳደሪያ ደንብ እንዲሁም በጠቅላላ ጉባኤው በየጊዜው የሚወጡ የሥነ-ምግባር ደንቦችን የሚቀበል/የምትቀበልና ተግባራዊ የሚያደርግ/የምታደርግ፣
          </li>
          <li>ክፍያዎችና መዋጮዎች መክፈል የሚችል/የምትችል፣</li>
          <li>በህግ መብቱ/ቷ ያልተገፈፈ፣</li>
        </ul>
      </div>

      {/* Right Column - የክብር አባላት */}
      <div>
        <h3 className="text-2xl font-bold mb-4 text-green-700">የክብር አባላት</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
          <li>የማህበሩ አባል ያልሆኑና አላማውን የሚያበረክቱ፤</li>
          <li>በዘርፎች ተሰማርተው አርአያ ሆነው ተቀባይነት ያገኙ ግለሰቦች/ድርጅቶች።</li>
          <li>በመምረጥ፣መመረጥ፣ድምፅ መስጠት መብት አይኖራቸውም።</li>
          <li>ከፍያዎችና መዋጮዎች ነፃ ናቸው፤ ማለትም ግዴታ የለባቸውም።</li>
        </ul>
      </div>
    </div>

    {/* Register Button */}
    <div className="mt-12 text-center">
      <Link
  to="/register"
  className="inline-block bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-8 rounded-full shadow-md transition duration-300"
>
  አባል ይሁኑ
</Link>

    </div>
  </div>
</section>

      {/* Projects Section */}
      <div id="projects" className="scroll-mt-20">
        <ProjectsPage />
      </div>

    </MainLayout>
  );
};

export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@components/ui/button';
import aboutImage from '@assets/Teawoon-4.jpg';

const AboutPage = () => {
  return (
    <section className="py-16 bg-islamic-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center bg-white p-8 rounded-lg shadow-md">
          <div className="md:w-1/2 flex items-center justify-center mb-6 md:mb-0">
            <img 
              src={aboutImage} 
              alt="About Us"
              className="w-full h-auto rounded"
            />
          </div>
          <div className="md:w-1/2 pl-6">
            <Link to="/about" className="inline-block mb-4">
              <Button className="bg-islamic-primary text-white hover:bg-islamic-secondary">
                ስለ ማህበሩ
              </Button>
            </Link>
            <p className="text-gray-600 mb-2">
              የአት-ተዓውን የዳዕዋና ኢስላማዊ አስተምህሮ ማህበር በአዋጅ ቁጥር 1207/2012 አንቀጽ 2 መሰረት በኢትዮጵያ እስልምና ጉዳዮች ጠቅላይ ም/ቤት በመዝገብ ቁጥር 100/11/16 ተመዝግቦ ሰፈር 28 1445 አ.ሂ/ በመስከረም 2 2016 ዓ.ል /በ 13/9/2023 የምዝገባና ፈቃድ የምስክር ወረቀት ተሰጥቶታል፡፡
            </p>
            <p className="text-gray-600 mb-4">
              የማህበሩ መስራች አባላት 36 (16 በማስተር ድግሪ የተመረቁ፣ 11 በድግሪ እና 10 የቀለም ትምህርት ያጠናቀቁ) ሲሆኑ የጠቅላላ ጉባኤ አባላት በመሆን የሚቀጥሉ ናቸው፡፡
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
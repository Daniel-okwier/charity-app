
import React from 'react';
import iftar1Image from '@assets/iftar1.jpg'; // Update with the correct path
import carouselImage from '@assets/carousel-1.jpg'; // Update with the correct path
import dawaImage from '@assets/dawa.jpg'; // Update with the correct path

const ProjectsPage = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-screen-xl mx-auto">
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
          የማህበሩ የእስካሁን እንቅስቃስዎች
        </h2>

        {/* 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Activity 1 */}
          <div className="relative border-t-4 border-green-600 bg-gray-50 rounded shadow-md p-4 pt-10">
            {/* Centered Title Button */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
              በየቲሞች ዘርፍ
            </div>
            <img 
              src={iftar1Image} 
              alt="Activity 1" 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="text-gray-700 text-sm">
              በበዓላትና በጾም ጊዜ ለየቲሞችና ለአቅመ ደካሞች የተከፋፈሉ ግብዓቶች
            </p>
          </div>

          {/* Activity 2 */}
          <div className="relative border-t-4 border-green-600 bg-gray-50 rounded shadow-md p-4 pt-10">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
              በዳእዋው ዘርፍ
            </div>
            <img 
              src={carouselImage} 
              alt="Activity 2" 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="text-gray-700 text-sm">
              ከማህበሩ ጋር በጋራ ከማዕከላዊ ክልል ለተውጣጡ ዓሊሞች የተሰጠው ስልጠና
            </p>
          </div>

          {/* Activity 3 */}
          <div className="relative border-t-4 border-green-600 bg-gray-50 rounded shadow-md p-4 pt-10">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow">
              በዳእዋው ዘርፍ
            </div>
            <img 
              src={dawaImage} 
              alt="Activity 3" 
              className="w-full h-48 object-cover rounded mb-4"
            />
            <p className="text-gray-700 text-sm">
              የገበያ ላይ ዳዕዋ እየተደረገ
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectsPage;
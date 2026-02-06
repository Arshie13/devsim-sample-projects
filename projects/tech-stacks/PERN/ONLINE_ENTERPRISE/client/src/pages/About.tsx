import { Heart, Leaf, Award, Users } from 'lucide-react';

const About = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-primary-600 section-gap-sm">
        <div className="page-container text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            About UrbanPottery
          </h1>
          <p className="text-primary-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Handcrafted ceramics made with love, tradition, and a passion for modern design.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-gap-md bg-white">
        <div className="page-container">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-warm-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-warm-600 leading-relaxed">
                <p>
                  Founded in 2018, UrbanPottery began as a small studio in the heart of the city.
                  What started as a passion project has grown into a beloved brand known for
                  creating timeless ceramic pieces that bring warmth to modern homes.
                </p>
                <p>
                  Each piece is carefully handcrafted by our team of skilled artisans, combining
                  traditional pottery techniques with contemporary aesthetics. We believe that
                  everyday objects should be beautiful, functional, and made to last.
                </p>
                <p>
                  Our commitment to quality and sustainability drives everything we do—from
                  sourcing eco-friendly materials to minimizing waste in our production process.
                </p>
              </div>
            </div>
            <div className="bg-warm-100 rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary-600 flex items-center justify-center">
                  <span className="text-white font-bold text-4xl">U</span>
                </div>
                <p className="text-warm-500 text-sm">Artisan Studio Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-gap-md bg-warm-50">
        <div className="page-container">
          <h2 className="text-2xl md:text-3xl font-bold text-warm-900 mb-10 text-center">
            Our Values
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-warm-100">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-primary-100 flex items-center justify-center">
                <Heart className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">Crafted with Care</h3>
              <p className="text-warm-600 text-sm">
                Every piece receives personal attention from start to finish.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-warm-100">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                <Leaf className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">Eco-Friendly</h3>
              <p className="text-warm-600 text-sm">
                Sustainable materials and responsible production practices.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-warm-100">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-100 flex items-center justify-center">
                <Award className="w-7 h-7 text-amber-600" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">Quality First</h3>
              <p className="text-warm-600 text-sm">
                Premium ceramics designed to last for generations.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-warm-100">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-7 h-7 text-blue-600" />
              </div>
              <h3 className="font-semibold text-warm-900 mb-2">Community</h3>
              <p className="text-warm-600 text-sm">
                Supporting local artisans and fostering creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-gap-md bg-white">
        <div className="page-container text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-warm-900 mb-4">
            Ready to Explore?
          </h2>
          <p className="text-warm-600 mb-8 max-w-xl mx-auto">
            Discover our collection of handcrafted ceramics and find the perfect piece for your home.
          </p>
          <a
            href="/shop"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Shop Now
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;

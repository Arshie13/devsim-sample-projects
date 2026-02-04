import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Heart, Leaf } from 'lucide-react';
import { Button } from '../components/ui';

const Home = () => {
  const features = [
    {
      icon: Heart,
      title: 'Handcrafted',
      description: 'Made by skilled artisans with traditional techniques.',
    },
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Complimentary shipping on orders over $75.',
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '30-day satisfaction guarantee on all products.',
    },
    {
      icon: Leaf,
      title: 'Eco-Friendly',
      description: 'Sustainable materials and conscious packaging.',
    },
  ];


  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-warm-50 border-b border-warm-200">
        <div className="page-container">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 py-20 lg:py-32">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="inline-block px-5 py-2.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
                Artisan Ceramics
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-warm-900 mb-8 leading-tight">
                Beautiful Ceramics for{' '}
                <span className="text-primary-600">Modern Living</span>
              </h1>
              <p className="text-lg text-warm-600 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Discover handcrafted ceramic pieces that bring warmth and character to your home.
                Each creation tells a unique story.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start">
                <Link to="/shop">
                  <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    Shop Collection
                  </Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10 mt-14 pt-10 border-t border-warm-200">
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-warm-900">2,000+</p>
                  <p className="text-sm text-warm-600 mt-1">Happy Customers</p>
                </div>
                <div className="hidden sm:block w-px h-14 bg-warm-300" aria-hidden="true" />
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-warm-900">500+</p>
                  <p className="text-sm text-warm-600 mt-1">Unique Pieces</p>
                </div>
                <div className="hidden sm:block w-px h-14 bg-warm-300" aria-hidden="true" />
                <div className="text-center lg:text-left">
                  <p className="text-2xl sm:text-3xl font-bold text-warm-900">4.9</p>
                  <p className="text-sm text-warm-600 mt-1">Rating</p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="flex-1 w-full max-w-lg lg:max-w-none">
              <div className="relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-warm-200">
                  <img
                    src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&h=800&fit=crop"
                    alt="Handcrafted pottery"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 card-shadow border border-warm-100">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                      <Leaf className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-warm-900">100% Sustainable</p>
                      <p className="text-sm text-warm-500 mt-0.5">Eco-friendly materials</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-gap-lg bg-white border-b border-warm-200">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-warm-900 mb-5">Why Choose Us?</h2>
            <p className="text-warm-600 max-w-2xl mx-auto text-lg leading-relaxed">
              We're committed to bringing you the finest handcrafted ceramics.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 md:p-8 rounded-2xl bg-warm-50 hover:bg-primary-50 transition-colors border border-warm-100 hover:border-primary-200 flex flex-col items-center"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 mb-5 md:mb-6 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-600">
                  <feature.icon className="w-7 h-7 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg font-semibold text-warm-900 mb-3">{feature.title}</h3>
                <p className="text-warm-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

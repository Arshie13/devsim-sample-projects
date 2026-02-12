import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import type { Product, Category } from '../types';
import { productService, categoryService } from '../services';
import { ProductCard, Spinner, Input, Select } from '../components';
import { Badge, Button } from '../components/ui';

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          productService.getAll(),
          categoryService.getAll(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || product.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSortBy('');
  };

  const hasActiveFilters = searchQuery || selectedCategory || sortBy;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spinner size="lg" />
        <p className="text-warm-500">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <section className="bg-primary-600 section-gap-sm">
        <div className="page-container text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">Our Collection</h1>
          <p className="text-primary-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Discover unique, handmade ceramic pieces crafted by talented artisans
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-gap-md bg-warm-50">
        <div className="page-container">
          {/* Filters Card */}
          <div className="bg-white rounded-2xl p-8 mb-10 card-shadow border border-warm-100">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400 pointer-events-none" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 rounded-xl"
                />
              </div>

              {/* Dropdowns */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categories.map((c) => ({ value: c.id, label: c.name })),
                  ]}
                  className="w-full sm:w-44 h-12 rounded-xl"
                />
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  options={[
                    { value: '', label: 'Sort by' },
                    { value: 'name', label: 'Name A-Z' },
                    { value: 'price-asc', label: 'Price: Low to High' },
                    { value: 'price-desc', label: 'Price: High to Low' },
                  ]}
                  className="w-full sm:w-44 h-12 rounded-xl"
                />
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-warm-100">
                <span className="text-sm text-warm-500 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filters:
                </span>
                {searchQuery && (
                  <Badge variant="primary" size="sm">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="ml-1.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedCategory && (
                  <Badge variant="primary" size="sm">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('')} className="ml-1.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {sortBy && (
                  <Badge variant="primary" size="sm">
                    {sortBy === 'name' ? 'Name' : sortBy === 'price-asc' ? 'Low→High' : 'High→Low'}
                    <button onClick={() => setSortBy('')} className="ml-1.5">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                <button onClick={clearFilters} className="text-sm text-warm-500 hover:text-primary-600 underline">
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="mb-6 md:mb-8">
            <p className="text-warm-600 text-base md:text-lg">
              Showing <span className="font-semibold text-warm-800">{filteredProducts.length}</span> of{' '}
              <span className="font-semibold text-warm-800">{products.length}</span> products
            </p>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 md:py-24 bg-white rounded-2xl border border-warm-100">
              <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-5 md:mb-6 rounded-full bg-warm-100 flex items-center justify-center">
                <Search className="w-6 h-6 md:w-8 md:h-8 text-warm-400" />
              </div>
              <h3 className="text-xl md:text-2xl font-semibold text-warm-900 mb-3">No products found</h3>
              <p className="text-warm-600 mb-6 md:mb-8 text-base md:text-lg">Try adjusting your search or filters</p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Shop;

'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { CATEGORIES } from '@/lib/constants';
import { ServiceCard } from '@/components/ui/ServiceCard';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { fetchServices, discoverServices, DiscoverResult } from '@/lib/api';
import { Service } from '@/lib/types';
import { REFERENCE_SERVICES } from '@/lib/mockData';
import { Search, SlidersHorizontal, RotateCcw, Sparkles, Filter, Loader2 } from 'lucide-react';

export default function ExplorePage() {
  const [services, setServices] = useState<Service[]>(REFERENCE_SERVICES);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(0.05);
  const [minTrustScore, setMinTrustScore] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'trust' | 'price' | 'calls'>('trust');
  const [discoverResults, setDiscoverResults] = useState<DiscoverResult[] | null>(null);

  // Animated placeholder text rotation
  const placeholders = [
    'Describe the task, e.g. India EV registrations by state...',
    'Search for Solidity AST vulnerability scanner...',
    'Find low-latency sentiment extraction for financial news...',
    'Lightweight token volatility forecast models...',
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [placeholders.length]);

  // Load live services from Backend
  useEffect(() => {
    let mounted = true;
    fetchServices().then((res) => {
      if (mounted) {
        setServices(res);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Perform task-based discovery if query has more than 3 words or user pauses
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().split(' ').length < 2) {
      setDiscoverResults(null);
      return;
    }

    const timer = setTimeout(() => {
      discoverServices(searchQuery, maxPrice).then((res) => {
        if (res && res.results && res.results.length > 0) {
          setDiscoverResults(res.results);
        }
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, maxPrice]);

  const filteredServices = useMemo(() => {
    return services
      .filter((service) => {
        // Category filter
        if (selectedCategory !== 'all' && service.category !== selectedCategory) {
          return false;
        }
        // Price filter
        if (service.price > maxPrice) {
          return false;
        }
        // Trust score filter
        if (service.trustScore < minTrustScore) {
          return false;
        }
        // Search query
        if (searchQuery.trim() && !discoverResults) {
          const q = searchQuery.toLowerCase();
          const matchName = service.name.toLowerCase().includes(q);
          const matchDesc = service.description.toLowerCase().includes(q);
          const matchTags = service.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchName && !matchDesc && !matchTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'trust') return b.trustScore - a.trustScore;
        if (sortBy === 'price') return a.price - b.price;
        if (sortBy === 'calls') return b.verifiedCalls - a.verifiedCalls;
        return 0;
      });
  }, [services, searchQuery, selectedCategory, maxPrice, minTrustScore, sortBy, discoverResults]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setMaxPrice(0.05);
    setMinTrustScore(0);
    setSortBy('trust');
    setDiscoverResults(null);
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'all' ||
    maxPrice < 0.05 ||
    minTrustScore > 0 ||
    sortBy !== 'trust';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      {/* Header & Search Bar */}
      <div className="mb-8 space-y-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#FFFFFF] tracking-tight">
            Explore AI Agent Services
          </h1>
          <p className="text-sm text-[#D4D4D8] mt-1">
            Browse verified on-chain endpoints. Pay in USDC with zero charge on failed executions.
          </p>
        </div>

        {/* Search Input with Animated Placeholder */}
        <div className="relative w-full max-w-3xl">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholders[placeholderIndex]}
            leftIcon={<Search className="w-4 h-4 text-[#6D001A]" />}
            className="h-12 text-sm bg-[#0C0608] border-[rgba(255,255,255,0.10)] pl-10 focus:border-[#6D001A]"
          />
        </div>

        {/* Quick Filter Pill Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-1">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                type="button"
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#CE1A1E] text-[#FFFFFF] shadow-sm shadow-[#CE1A1E]/30 border border-[#CE1A1E]'
                    : 'bg-[#223330]/40 text-[#837F78] hover:text-[#FFFFFF] border border-[#4D524B]/40 hover:border-[#CE1A1E]/40'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Discovery Reason Banner */}
      {discoverResults && discoverResults.length > 0 && (
        <div className="mb-6 p-4 rounded-xl bg-[#223330]/40 border border-[#CE1A1E]/40 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-[#CE1A1E] shrink-0 mt-0.5" />
          <div className="text-xs text-[#E8EBE4]">
            <p className="font-semibold text-[#F4F6F4]">
              Semantic Ranking Activated (TRD-A §8):
            </p>
            <p className="mt-1">
              Top match: <strong className="text-[#CE1A1E]">{discoverResults[0].name}</strong> — {discoverResults[0].reason}
            </p>
          </div>
        </div>
      )}

      {/* Main Layout: Filters Sidebar + Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar Filters */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#223330]/30 border border-[#4D524B]/40 rounded-2xl p-5 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#4D524B]/30">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F4F6F4]">
                <Filter className="w-4 h-4 text-[#CE1A1E]" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <button
                  onClick={resetFilters}
                  type="button"
                  className="text-xs text-[#CE1A1E] hover:text-[#FFFFFF] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#837F78] uppercase tracking-wider font-mono">
                Sort By
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#081919] rounded-lg border border-[#4D524B]/40">
                {(['trust', 'price', 'calls'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSortBy(s)}
                    className={`py-1.5 text-xs font-medium rounded-md capitalize transition-all cursor-pointer font-mono ${
                      sortBy === s
                        ? 'bg-[#223330] text-[#FFFFFF] shadow-xs border border-[#CE1A1E]/50'
                        : 'text-[#837F78] hover:text-[#FFFFFF]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#837F78] uppercase tracking-wider font-mono">
                  Max Price
                </span>
                <span className="font-mono text-[#2DD4BF] font-medium">
                  {maxPrice.toFixed(3)} USDC
                </span>
              </div>
              <input
                type="range"
                min="0.005"
                max="0.05"
                step="0.005"
                value={maxPrice}
                onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#081919] rounded-lg appearance-none cursor-pointer accent-[#CE1A1E]"
              />
              <div className="flex justify-between text-[10px] text-[#837F78] font-mono">
                <span>0.005</span>
                <span>0.025</span>
                <span>0.050</span>
              </div>
            </div>

            {/* Min Trust Score Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#837F78] uppercase tracking-wider font-mono">
                  Min Trust Score
                </span>
                <span className="font-mono text-[#CE1A1E] font-medium">
                  {minTrustScore}+
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="10"
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-[#081919] rounded-lg appearance-none cursor-pointer accent-[#CE1A1E]"
              />
              <div className="flex justify-between text-[10px] text-[#837F78] font-mono">
                <span>Any (0)</span>
                <span>Prov (40)</span>
                <span>Est (70)</span>
              </div>
            </div>

            {/* Security Guarantee Notice */}
            <div className="p-3 rounded-xl bg-[#081919] border border-[#4D524B]/40 text-[11px] text-[#E8EBE4] leading-relaxed">
              <span className="text-[#2DD4BF] font-medium">Pay-on-Success Guarantee:</span>{' '}
              All calls are gated by x402. If a provider fails or times out, you are charged 0 USDC.
            </div>
          </div>
        </div>

        {/* Right Main Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#837F78] space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#CE1A1E]" />
              <p className="text-sm">Querying Agentra Registry ...</p>
            </div>
          ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <ServiceCard key={service.slug} service={service} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[#223330]/30 border border-[#4D524B]/40 rounded-2xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#081919] flex items-center justify-center text-[#837F78] mb-4">
                <SlidersHorizontal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[#F4F6F4]">
                No matching services found
              </h3>
              <p className="text-sm text-[#837F78] max-w-sm mt-1">
                Try loosening your filters, reducing the minimum Trust Score, or broadening your search terms.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={resetFilters}
                className="mt-6"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



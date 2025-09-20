"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Download, Eye, Star, Clock, TrendingUp, Users, Zap, Grid, List } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { mockDatasets } from '../../utils/mockData';
import { Dataset } from '../../types';

export default function MarketplacePage() {
  const [datasets] = useState<Dataset[]>(mockDatasets);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filteredDatasets = datasets.filter(dataset => {
    const matchesSearch = dataset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dataset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = selectedFilter === 'all' || dataset.type === selectedFilter;
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return (a.price || 0) - (b.price || 0);
      case 'price-high': return (b.price || 0) - (a.price || 0);
      case 'size': return b.size - a.size;
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tabular': return '📊';
      case 'text': return '📝';
      case 'time-series': return '📈';
      case 'images': return '🖼️';
      default: return '📄';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'tabular': return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'text': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'time-series': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'images': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-teal-50 via-white to-purple-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Dataset Marketplace
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Discover high-quality synthetic datasets for your AI projects
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search datasets, tags, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-700 font-medium"
              >
                <option value="all">All Types</option>
                <option value="tabular">📊 Tabular</option>
                <option value="text">📝 Text</option>
                <option value="time-series">📈 Time-Series</option>
                <option value="images">🖼️ Images</option>
              </select>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white text-gray-700 font-medium"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="size">Largest First</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-gray-600 mr-6">
              <span className="font-semibold">{filteredDatasets.length}</span> datasets found
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-teal-100 text-teal-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-teal-100 text-teal-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Dataset Grid */}
        {filteredDatasets.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredDatasets.map((dataset) => (
              <Link
                key={dataset.id} 
                href={`/dataset/${dataset.id}`}
                className="block"
              >
                <Card 
                  hover 
                  className="group cursor-pointer h-full"
                >
                  <CardHeader>
                    <div className="mb-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-purple-500 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                          {getTypeIcon(dataset.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 leading-tight mb-1">
                            {dataset.name}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(dataset.type)}`}>
                            {dataset.type}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-4">
                        {dataset.description}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {dataset.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                        {dataset.tags.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded-md text-xs">
                            +{dataset.tags.length - 3}
                          </span>
                        )}
                      </div>
                      
                      <div className="pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-6 h-6 bg-gradient-to-br from-teal-500 to-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {dataset.author.slice(2, 4).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">
                              {dataset.author.slice(0, 6)}...{dataset.author.slice(-4)}
                            </span>
                          </div>
                          <span className="text-xs text-gray-400">{dataset.createdAt}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-lg font-bold text-teal-600">{dataset.price} FIL</div>
                          <div className="text-sm text-gray-500 font-medium">{dataset.size.toLocaleString()} rows</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-16 text-center">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No datasets found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search terms or filters to discover the perfect dataset for your project.
              </p>
              <Button onClick={() => { setSearchTerm(''); setSelectedFilter('all'); }}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

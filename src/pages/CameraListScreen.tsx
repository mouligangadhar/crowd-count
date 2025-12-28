import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SearchIcon, FilterIcon, WifiIcon, SignalIcon, PlusIcon, MoreVerticalIcon, PlayIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { BottomNavigation } from '../components/layout/BottomNavigation';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Tabs } from '../components/ui/Tabs';
const mockCameras = [{
  id: 1,
  name: 'Main Entrance',
  location: 'Building A, Floor 1',
  status: 'online',
  count: 234,
  signal: 95,
  fps: 30,
  thumbnail: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=300&h=200&fit=crop'
}, {
  id: 2,
  name: 'Food Court',
  location: 'Building B, Floor 2',
  status: 'online',
  count: 156,
  signal: 88,
  fps: 30,
  thumbnail: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=200&fit=crop'
}, {
  id: 3,
  name: 'Parking Level A',
  location: 'Basement 1',
  status: 'online',
  count: 89,
  signal: 72,
  fps: 25,
  thumbnail: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=300&h=200&fit=crop'
}, {
  id: 4,
  name: 'Exit Gate North',
  location: 'Building A, Floor 1',
  status: 'offline',
  count: 0,
  signal: 0,
  fps: 0,
  thumbnail: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&h=200&fit=crop'
}, {
  id: 5,
  name: 'Conference Hall',
  location: 'Building C, Floor 3',
  status: 'online',
  count: 45,
  signal: 91,
  fps: 30,
  thumbnail: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=300&h=200&fit=crop'
}, {
  id: 6,
  name: 'Lobby Area',
  location: 'Building A, Floor 1',
  status: 'warning',
  count: 312,
  signal: 65,
  fps: 20,
  thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=200&fit=crop'
}];
export function CameraListScreen() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const tabs = [{
    id: 'all',
    label: 'All'
  }, {
    id: 'online',
    label: 'Online'
  }, {
    id: 'offline',
    label: 'Offline'
  }];
  const filteredCameras = mockCameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(search.toLowerCase()) || camera.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || camera.status === filter || filter === 'online' && camera.status === 'warning';
    return matchesSearch && matchesFilter;
  });
  const onlineCount = mockCameras.filter(c => c.status !== 'offline').length;
  const offlineCount = mockCameras.filter(c => c.status === 'offline').length;
  return <>
      <MobileLayout title="Cameras" subtitle={`${onlineCount} online • ${offlineCount} offline`} rightAction={<Button size="sm" icon={<PlusIcon className="w-4 h-4" />} onClick={() => navigate('/camera/add')}>
            Add
          </Button>}>
        {/* Search */}
        <div className="mb-4">
          <Input placeholder="Search cameras..." value={search} onChange={e => setSearch(e.target.value)} icon={<SearchIcon className="w-5 h-5" />} />
        </div>

        {/* Filter tabs */}
        <div className="mb-4">
          <Tabs tabs={tabs} activeTab={filter} onChange={setFilter} variant="pills" />
        </div>

        {/* Camera list */}
        <div className="space-y-3">
          {filteredCameras.map((camera, index) => <motion.div key={camera.id} initial={{
          opacity: 0,
          y: 10
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.05
        }}>
              <Card padding="none" className="overflow-hidden">
                <button onClick={() => navigate(`/camera/${camera.id}`)} className="w-full text-left">
                  {/* Thumbnail */}
                  <div className="relative aspect-video">
                    <img src={camera.thumbnail} alt={camera.name} className={`w-full h-full object-cover ${camera.status === 'offline' ? 'opacity-50 grayscale' : ''}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Live indicator */}
                    {camera.status !== 'offline' && <div className="absolute top-3 left-3">
                        <span className="flex items-center gap-1.5 text-xs bg-neon-red/90 text-white px-2 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          LIVE
                        </span>
                      </div>}

                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <PlayIcon className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>

                    {/* Count badge */}
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-dark-900/80 backdrop-blur-sm rounded-lg px-3 py-1.5">
                        <span className="text-lg font-bold text-white">
                          {camera.count}
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          people
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold text-white">
                          {camera.name}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {camera.location}
                        </p>
                      </div>
                      <Badge variant={camera.status === 'online' ? 'success' : camera.status === 'warning' ? 'warning' : 'offline'} dot pulse={camera.status === 'warning'}>
                        {camera.status === 'online' ? 'Online' : camera.status === 'warning' ? 'Weak Signal' : 'Offline'}
                      </Badge>
                    </div>

                    {/* Stats */}
                    {camera.status !== 'offline' && <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <SignalIcon className="w-4 h-4" />
                          <span>{camera.signal}%</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <WifiIcon className="w-4 h-4" />
                          <span>5G</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="font-mono">{camera.fps} FPS</span>
                        </div>
                      </div>}
                  </div>
                </button>
              </Card>
            </motion.div>)}
        </div>

        {filteredCameras.length === 0 && <div className="text-center py-12">
            <p className="text-slate-400">No cameras found</p>
          </div>}
      </MobileLayout>
      <BottomNavigation />
    </>;
}
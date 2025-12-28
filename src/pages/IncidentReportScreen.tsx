import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AlertTriangleIcon, CameraIcon, MapPinIcon, UploadIcon, SendIcon, XIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
export function IncidentReportScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'overcrowding',
    zone: 'zone-a',
    severity: 'medium',
    description: ''
  });
  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleImageUpload = () => {
    // Simulate image upload
    setImage('https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop');
  };
  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    navigate('/home');
  };
  const typeOptions = [{
    value: 'overcrowding',
    label: 'Overcrowding'
  }, {
    value: 'obstruction',
    label: 'Obstruction'
  }, {
    value: 'emergency',
    label: 'Medical Emergency'
  }, {
    value: 'security',
    label: 'Security Threat'
  }, {
    value: 'maintenance',
    label: 'Maintenance Issue'
  }];
  const zoneOptions = [{
    value: 'zone-a',
    label: 'Zone A - Main Entrance'
  }, {
    value: 'zone-b',
    label: 'Zone B - Food Court'
  }, {
    value: 'zone-c',
    label: 'Zone C - Retail Area'
  }, {
    value: 'zone-d',
    label: 'Zone D - Parking'
  }];
  const severityOptions = [{
    value: 'low',
    label: 'Low - Monitor'
  }, {
    value: 'medium',
    label: 'Medium - Action Required'
  }, {
    value: 'high',
    label: 'High - Immediate Response'
  }, {
    value: 'critical',
    label: 'Critical - Evacuation'
  }];
  return <MobileLayout title="Report Incident" subtitle="Log security or safety issue" showBack>
      <Card variant="neon" padding="lg">
        <div className="space-y-4">
          <Select label="Incident Type" value={formData.type} onChange={e => updateForm('type', e.target.value)} options={typeOptions} />

          <Select label="Location / Zone" value={formData.zone} onChange={e => updateForm('zone', e.target.value)} options={zoneOptions} />

          <Select label="Severity Level" value={formData.severity} onChange={e => updateForm('severity', e.target.value)} options={severityOptions} />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description
            </label>
            <textarea rows={4} className="w-full bg-dark-800 border border-dark-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/30" placeholder="Describe the incident details..." value={formData.description} onChange={e => updateForm('description', e.target.value)} />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Evidence (Optional)
            </label>
            {image ? <div className="relative rounded-xl overflow-hidden aspect-video group">
                <img src={image} alt="Evidence" className="w-full h-full object-cover" />
                <button onClick={() => setImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-neon-red transition-colors">
                  <XIcon className="w-4 h-4" />
                </button>
              </div> : <button onClick={handleImageUpload} className="w-full h-32 border-2 border-dashed border-dark-600 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-neon-cyan hover:text-neon-cyan transition-colors">
                <CameraIcon className="w-8 h-8 mb-2" />
                <span className="text-sm">Tap to take photo or upload</span>
              </button>}
          </div>

          <div className="pt-4">
            <Button fullWidth loading={loading} onClick={handleSubmit} icon={<SendIcon className="w-4 h-4" />} variant={formData.severity === 'critical' ? 'danger' : 'primary'}>
              Submit Report
            </Button>
          </div>
        </div>
      </Card>
    </MobileLayout>;
}
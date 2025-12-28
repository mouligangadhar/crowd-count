import React, { useState, Fragment } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CameraIcon, WifiIcon, MapPinIcon, LinkIcon, SettingsIcon, CheckCircleIcon, SignalIcon } from 'lucide-react';
import { MobileLayout } from '../components/layout/MobileLayout';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { Toggle } from '../components/ui/Toggle';
import { Badge } from '../components/ui/Badge';
type Step = 1 | 2 | 3 | 4;
export function AddCameraScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testSuccess, setTestSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    streamUrl: '',
    zone: 'zone-a',
    location: '',
    connectionType: '5g',
    resolution: '1080p',
    frameRate: '30',
    enableAI: true,
    enableRecording: true,
    enableMotion: false
  });
  const updateForm = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleTestConnection = async () => {
    setTesting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setTesting(false);
    setTestSuccess(true);
  };
  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    navigate('/cameras');
  };
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
  }, {
    value: 'zone-e',
    label: 'Zone E - Event Hall'
  }];
  const connectionOptions = [{
    value: '5g',
    label: '5G Network'
  }, {
    value: 'wifi',
    label: 'WiFi'
  }, {
    value: 'ethernet',
    label: 'Ethernet'
  }];
  const resolutionOptions = [{
    value: '4k',
    label: '4K (3840x2160)'
  }, {
    value: '1080p',
    label: '1080p (1920x1080)'
  }, {
    value: '720p',
    label: '720p (1280x720)'
  }];
  const frameRateOptions = [{
    value: '60',
    label: '60 FPS'
  }, {
    value: '30',
    label: '30 FPS'
  }, {
    value: '15',
    label: '15 FPS'
  }];
  const steps = [{
    number: 1,
    label: 'Basic'
  }, {
    number: 2,
    label: 'Network'
  }, {
    number: 3,
    label: 'Settings'
  }, {
    number: 4,
    label: 'Test'
  }];
  return <MobileLayout title="Add Camera" subtitle="Configure new camera" showBack>
      {/* Progress steps */}
      <div className="flex items-center justify-between mb-6">
        {steps.map((s, index) => <Fragment key={s.number}>
            <div className="flex flex-col items-center">
              <motion.div animate={{
            backgroundColor: step >= s.number ? '#06B6D4' : '#334155',
            scale: step === s.number ? 1.1 : 1
          }} className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step >= s.number ? 'text-dark-900' : 'text-slate-400'}`}>
                {step > s.number ? <CheckCircleIcon className="w-4 h-4" /> : s.number}
              </motion.div>
              <span className="text-[10px] text-slate-400 mt-1">{s.label}</span>
            </div>
            {index < steps.length - 1 && <div className="flex-1 h-0.5 mx-1 bg-dark-600">
                <motion.div initial={{
            width: '0%'
          }} animate={{
            width: step > s.number ? '100%' : '0%'
          }} className="h-full bg-neon-cyan" />
              </div>}
          </Fragment>)}
      </div>

      {/* Step content */}
      <Card variant="neon" padding="lg">
        {step === 1 && <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="space-y-4">
            <Input label="Camera Name" placeholder="e.g., Main Entrance Cam 1" value={formData.name} onChange={e => updateForm('name', e.target.value)} icon={<CameraIcon className="w-5 h-5" />} />
            <Input label="Stream URL" placeholder="rtsp://192.168.1.100:554/stream" value={formData.streamUrl} onChange={e => updateForm('streamUrl', e.target.value)} icon={<LinkIcon className="w-5 h-5" />} />
            <Select label="Assign to Zone" value={formData.zone} onChange={e => updateForm('zone', e.target.value)} options={zoneOptions} />
            <Input label="Physical Location" placeholder="Building A, Floor 1, Near Exit" value={formData.location} onChange={e => updateForm('location', e.target.value)} icon={<MapPinIcon className="w-5 h-5" />} />
          </motion.div>}

        {step === 2 && <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="space-y-4">
            <Select label="Connection Type" value={formData.connectionType} onChange={e => updateForm('connectionType', e.target.value)} options={connectionOptions} />
            {formData.connectionType === '5g' && <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <SignalIcon className="w-5 h-5 text-neon-cyan" />
                  <span className="font-medium text-white">
                    5G Configuration
                  </span>
                </div>
                <p className="text-sm text-slate-400 mb-3">
                  5G provides ultra-low latency and high bandwidth for real-time
                  AI processing.
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Signal Strength</span>
                  <Badge variant="success">Excellent</Badge>
                </div>
              </div>}
            <Select label="Resolution" value={formData.resolution} onChange={e => updateForm('resolution', e.target.value)} options={resolutionOptions} />
            <Select label="Frame Rate" value={formData.frameRate} onChange={e => updateForm('frameRate', e.target.value)} options={frameRateOptions} />
          </motion.div>}

        {step === 3 && <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-700 rounded-xl">
              <div>
                <p className="font-medium text-white">AI Detection</p>
                <p className="text-sm text-slate-400">
                  Enable crowd counting & detection
                </p>
              </div>
              <Toggle checked={formData.enableAI} onChange={checked => updateForm('enableAI', checked)} />
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-700 rounded-xl">
              <div>
                <p className="font-medium text-white">Recording</p>
                <p className="text-sm text-slate-400">
                  Save footage to cloud storage
                </p>
              </div>
              <Toggle checked={formData.enableRecording} onChange={checked => updateForm('enableRecording', checked)} />
            </div>
            <div className="flex items-center justify-between p-4 bg-dark-700 rounded-xl">
              <div>
                <p className="font-medium text-white">Motion Detection</p>
                <p className="text-sm text-slate-400">
                  Alert on unusual movement
                </p>
              </div>
              <Toggle checked={formData.enableMotion} onChange={checked => updateForm('enableMotion', checked)} />
            </div>
          </motion.div>}

        {step === 4 && <motion.div initial={{
        opacity: 0,
        x: 20
      }} animate={{
        opacity: 1,
        x: 0
      }} className="space-y-4">
            <div className="text-center py-4">
              {!testSuccess ? <>
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-dark-700 flex items-center justify-center">
                    <CameraIcon className="w-10 h-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Test Connection
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Verify camera stream before adding
                  </p>
                  <Button onClick={handleTestConnection} loading={testing} fullWidth>
                    {testing ? 'Testing...' : 'Test Connection'}
                  </Button>
                </> : <>
                  <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} className="w-20 h-20 mx-auto mb-4 rounded-full bg-neon-green/20 flex items-center justify-center">
                    <CheckCircleIcon className="w-10 h-10 text-neon-green" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Connection Successful!
                  </h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Camera is ready to be added
                  </p>
                  <div className="aspect-video bg-dark-700 rounded-xl mb-4 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=225&fit=crop" alt="Camera preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-2 bg-dark-700 rounded-lg">
                      <p className="text-slate-400">Resolution</p>
                      <p className="text-white font-medium">1920x1080</p>
                    </div>
                    <div className="p-2 bg-dark-700 rounded-lg">
                      <p className="text-slate-400">FPS</p>
                      <p className="text-white font-medium">30</p>
                    </div>
                    <div className="p-2 bg-dark-700 rounded-lg">
                      <p className="text-slate-400">Latency</p>
                      <p className="text-white font-medium">12ms</p>
                    </div>
                    <div className="p-2 bg-dark-700 rounded-lg">
                      <p className="text-slate-400">Signal</p>
                      <p className="text-neon-green font-medium">Excellent</p>
                    </div>
                  </div>
                </>}
            </div>
          </motion.div>}

        {/* Navigation buttons */}
        <div className="flex gap-3 mt-6">
          {step > 1 && <Button variant="secondary" onClick={() => setStep(step - 1 as Step)} className="flex-1">
              Back
            </Button>}
          {step < 4 ? <Button onClick={() => setStep(step + 1 as Step)} className="flex-1">
              Continue
            </Button> : testSuccess && <Button onClick={handleSubmit} loading={loading} className="flex-1">
                Add Camera
              </Button>}
        </div>
      </Card>
    </MobileLayout>;
}
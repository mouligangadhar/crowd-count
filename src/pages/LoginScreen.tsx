import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, SmartphoneIcon, ShieldIcon, ArrowRightIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
type LoginMethod = 'email' | 'otp' | 'admin';
export function LoginScreen() {
  const navigate = useNavigate();
  const [method, setMethod] = useState<LoginMethod>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    navigate('/home');
  };
  const handleSendOtp = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setOtpSent(true);
    setLoading(false);
  };
  const tabs = [{
    id: 'email',
    label: 'Email',
    icon: <MailIcon className="w-4 h-4" />
  }, {
    id: 'otp',
    label: 'OTP',
    icon: <SmartphoneIcon className="w-4 h-4" />
  }, {
    id: 'admin',
    label: 'Admin',
    icon: <ShieldIcon className="w-4 h-4" />
  }];
  return <div className="min-h-screen bg-dark-900 cyber-grid flex flex-col">
      {/* Header gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-neon-cyan/10 via-neon-purple/5 to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col justify-center px-4 py-8 max-w-md mx-auto w-full relative z-10">
        {/* Logo */}
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple flex items-center justify-center shadow-neon-cyan">
            <ShieldIcon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">Welcome Back</h1>
          <p className="text-slate-400">Sign in to CrowdVision</p>
        </motion.div>

        {/* Login Card */}
        <Card variant="neon" padding="lg">
          <Tabs tabs={tabs} activeTab={method} onChange={id => {
          setMethod(id as LoginMethod);
          setOtpSent(false);
        }} variant="pills" />

          <div className="mt-6 space-y-4">
            {method === 'email' && <motion.div initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-4">
                <Input label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} icon={<MailIcon className="w-5 h-5" />} />
                <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} icon={<LockIcon className="w-5 h-5" />} />
                <div className="flex justify-end">
                  <button onClick={() => navigate('/forgot-password')} className="text-sm text-neon-cyan hover:underline">
                    Forgot password?
                  </button>
                </div>
                <Button fullWidth loading={loading} onClick={handleLogin} icon={<ArrowRightIcon className="w-4 h-4" />} iconPosition="right">
                  Sign In
                </Button>
              </motion.div>}

            {method === 'otp' && <motion.div initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-4">
                <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={e => setPhone(e.target.value)} icon={<SmartphoneIcon className="w-5 h-5" />} disabled={otpSent} />
                {otpSent && <motion.div initial={{
              opacity: 0,
              height: 0
            }} animate={{
              opacity: 1,
              height: 'auto'
            }}>
                    <Input label="Verification Code" type="text" placeholder="Enter 6-digit code" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
                    <p className="text-xs text-slate-500 mt-2">
                      Code sent to {phone}.{' '}
                      <button className="text-neon-cyan">Resend</button>
                    </p>
                  </motion.div>}
                <Button fullWidth loading={loading} onClick={otpSent ? handleLogin : handleSendOtp}>
                  {otpSent ? 'Verify & Sign In' : 'Send OTP'}
                </Button>
              </motion.div>}

            {method === 'admin' && <motion.div initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-4">
                <div className="p-3 bg-neon-purple/10 border border-neon-purple/30 rounded-xl">
                  <p className="text-sm text-neon-purple">
                    Admin access requires organization credentials
                  </p>
                </div>
                <Input label="Admin Email" type="email" placeholder="admin@organization.com" value={email} onChange={e => setEmail(e.target.value)} icon={<MailIcon className="w-5 h-5" />} />
                <Input label="Password" type="password" placeholder="Enter admin password" value={password} onChange={e => setPassword(e.target.value)} icon={<LockIcon className="w-5 h-5" />} />
                <Input label="Organization Code" type="text" placeholder="ORG-XXXX-XXXX" value={adminCode} onChange={e => setAdminCode(e.target.value)} icon={<ShieldIcon className="w-5 h-5" />} />
                <Button fullWidth loading={loading} onClick={handleLogin}>
                  Admin Sign In
                </Button>
              </motion.div>}
          </div>
        </Card>

        {/* Sign up link */}
        <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3
      }} className="text-center mt-6 text-slate-400">
          Don't have an account?{' '}
          <button onClick={() => navigate('/signup')} className="text-neon-cyan font-medium hover:underline">
            Sign up
          </button>
        </motion.p>
      </div>
    </div>;
}
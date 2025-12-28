import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MailIcon, ArrowLeftIcon, KeyIcon, CheckCircleIcon, LockIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
type Stage = 'email' | 'code' | 'reset' | 'success';
export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSendCode = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStage('code');
  };
  const handleVerifyCode = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    setStage('reset');
  };
  const handleResetPassword = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setStage('success');
  };
  return <div className="min-h-screen bg-dark-900 cyber-grid flex flex-col">
      {/* Header gradient */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-neon-blue/10 via-neon-cyan/5 to-transparent pointer-events-none" />

      <div className="flex-1 flex flex-col px-4 py-8 max-w-md mx-auto w-full relative z-10">
        {/* Back button */}
        {stage !== 'success' && <motion.button initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} onClick={() => {
        if (stage === 'email') navigate('/login');else if (stage === 'code') setStage('email');else if (stage === 'reset') setStage('code');
      }} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 self-start">
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back</span>
          </motion.button>}

        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {stage === 'email' && <motion.div key="email" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neon-blue/20 flex items-center justify-center">
                    <MailIcon className="w-8 h-8 text-neon-blue" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Forgot Password?
                  </h1>
                  <p className="text-slate-400">
                    Enter your email and we'll send you a reset code
                  </p>
                </div>

                <Card variant="neon" padding="lg">
                  <Input label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} icon={<MailIcon className="w-5 h-5" />} />
                  <Button fullWidth loading={loading} onClick={handleSendCode} className="mt-4">
                    Send Reset Code
                  </Button>
                </Card>
              </motion.div>}

            {stage === 'code' && <motion.div key="code" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neon-purple/20 flex items-center justify-center">
                    <KeyIcon className="w-8 h-8 text-neon-purple" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    Enter Code
                  </h1>
                  <p className="text-slate-400">
                    We sent a 6-digit code to{' '}
                    <span className="text-white">{email}</span>
                  </p>
                </div>

                <Card variant="neon" padding="lg">
                  <Input label="Verification Code" type="text" placeholder="000000" value={code} onChange={e => setCode(e.target.value)} maxLength={6} className="text-center text-2xl tracking-widest font-mono" />
                  <p className="text-sm text-slate-500 mt-2 text-center">
                    Didn't receive code?{' '}
                    <button className="text-neon-cyan hover:underline">
                      Resend
                    </button>
                  </p>
                  <Button fullWidth loading={loading} onClick={handleVerifyCode} className="mt-4">
                    Verify Code
                  </Button>
                </Card>
              </motion.div>}

            {stage === 'reset' && <motion.div key="reset" initial={{
            opacity: 0,
            y: 20
          }} animate={{
            opacity: 1,
            y: 0
          }} exit={{
            opacity: 0,
            y: -20
          }}>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-neon-cyan/20 flex items-center justify-center">
                    <LockIcon className="w-8 h-8 text-neon-cyan" />
                  </div>
                  <h1 className="text-2xl font-bold text-white mb-2">
                    New Password
                  </h1>
                  <p className="text-slate-400">Create a strong new password</p>
                </div>

                <Card variant="neon" padding="lg">
                  <div className="space-y-4">
                    <Input label="New Password" type="password" placeholder="Enter new password" value={password} onChange={e => setPassword(e.target.value)} icon={<LockIcon className="w-5 h-5" />} />
                    <Input label="Confirm Password" type="password" placeholder="Confirm new password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} icon={<LockIcon className="w-5 h-5" />} />
                  </div>
                  <Button fullWidth loading={loading} onClick={handleResetPassword} className="mt-4">
                    Reset Password
                  </Button>
                </Card>
              </motion.div>}

            {stage === 'success' && <motion.div key="success" initial={{
            opacity: 0,
            scale: 0.9
          }} animate={{
            opacity: 1,
            scale: 1
          }} className="text-center">
                <motion.div initial={{
              scale: 0
            }} animate={{
              scale: 1
            }} transition={{
              type: 'spring',
              stiffness: 200,
              delay: 0.2
            }} className="w-20 h-20 mx-auto mb-6 rounded-full bg-neon-green/20 flex items-center justify-center">
                  <CheckCircleIcon className="w-10 h-10 text-neon-green" />
                </motion.div>
                <h1 className="text-2xl font-bold text-white mb-2">
                  Password Reset!
                </h1>
                <p className="text-slate-400 mb-8">
                  Your password has been successfully reset
                </p>
                <Button fullWidth onClick={() => navigate('/login')}>
                  Back to Sign In
                </Button>
              </motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </div>;
}
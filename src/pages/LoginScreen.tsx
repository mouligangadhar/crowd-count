import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MailIcon, LockIcon, ShieldIcon, ArrowRightIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

export function LoginScreen() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
    } else {
      // Successfully logged in, navigate to home
      navigate('/home');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

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
        <div className="space-y-4">
          {error && <motion.div initial={{
            opacity: 0,
            y: -10
          }} animate={{
            opacity: 1,
            y: 0
          }} className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
            <AlertCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-400">{error}</p>
          </motion.div>}

          <motion.div initial={{
            opacity: 0,
            x: -10
          }} animate={{
            opacity: 1,
            x: 0
          }} className="space-y-4">
            <Input label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} onKeyPress={handleKeyPress} icon={<MailIcon className="w-5 h-5" />} />
            <Input label="Password" type="password" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} onKeyPress={handleKeyPress} icon={<LockIcon className="w-5 h-5" />} />
            <div className="flex justify-end">
              <button onClick={() => navigate('/forgot-password')} className="text-sm text-neon-cyan hover:underline">
                Forgot password?
              </button>
            </div>
            <Button fullWidth loading={loading} onClick={handleLogin} icon={<ArrowRightIcon className="w-4 h-4" />} iconPosition="right">
              Sign In
            </Button>
          </motion.div>
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
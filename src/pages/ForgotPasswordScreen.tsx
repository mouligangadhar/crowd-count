import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MailIcon, ArrowLeftIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { useAuth } from '../contexts/AuthContext';

type Stage = 'email' | 'success';

export function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  const [stage, setStage] = useState<Stage>('email');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendResetLink = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    const { error: resetError } = await resetPassword(email);

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setLoading(false);
      setStage('success');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && stage === 'email') {
      handleSendResetLink();
    }
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
      }} onClick={() => navigate('/login')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 self-start">
        <ArrowLeftIcon className="w-4 h-4" />
        <span>Back to Sign In</span>
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
                Enter your email and we'll send you a password reset link
              </p>
            </div>

            <Card variant="neon" padding="lg">
              {error && <motion.div initial={{
                opacity: 0,
                y: -10
              }} animate={{
                opacity: 1,
                y: 0
              }} className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-start gap-2">
                <AlertCircleIcon className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </motion.div>}

              <Input label="Email Address" type="email" placeholder="you@company.com" value={email} onChange={e => setEmail(e.target.value)} onKeyPress={handleKeyPress} icon={<MailIcon className="w-5 h-5" />} />
              <Button fullWidth loading={loading} onClick={handleSendResetLink} className="mt-4">
                Send Reset Link
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
              Check Your Email
            </h1>
            <p className="text-slate-400 mb-2">
              We've sent a password reset link to
            </p>
            <p className="text-white font-medium mb-8">{email}</p>
            <p className="text-sm text-slate-500 mb-8">
              Click the link in the email to reset your password. The link will expire in 1 hour.
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
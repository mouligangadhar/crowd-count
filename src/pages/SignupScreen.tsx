import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserIcon, MailIcon, LockIcon, BuildingIcon, PhoneIcon, ArrowRightIcon, ArrowLeftIcon, CheckIcon, AlertCircleIcon } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Select } from '../components/ui/Select';
import { useAuth } from '../contexts/AuthContext';

type Step = 1 | 2 | 3;

export function SignupScreen() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    organization: '',
    role: 'security',
    department: ''
  });

  const updateForm = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setError('');

    // Validation for step 1
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        setError('Please enter a valid email address');
        return;
      }
    }

    // Validation for step 2
    if (step === 2) {
      if (!formData.organization) {
        setError('Please enter your organization name');
        return;
      }
    }

    if (step < 3) setStep(step + 1 as Step);
  };

  const handleBack = () => {
    setError('');
    if (step > 1) setStep(step - 1 as Step);
  };

  const handleSubmit = async () => {
    setError('');

    // Validation
    if (!formData.password || !formData.confirmPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Sign up with Supabase
    const { error: signUpError } = await signUp(formData.email, formData.password, {
      full_name: formData.fullName,
      phone: formData.phone,
      organization: formData.organization,
      role: formData.role,
      department: formData.department
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
    } else {
      // Successfully signed up, navigate to role selection or home
      navigate('/role-selection');
    }
  };

  const roleOptions = [{
    value: 'security',
    label: 'Security Staff'
  }, {
    value: 'event_manager',
    label: 'Event Manager'
  }, {
    value: 'mall_operator',
    label: 'Mall Operator'
  }, {
    value: 'admin',
    label: 'Administrator'
  }];

  const steps = [{
    number: 1,
    label: 'Personal'
  }, {
    number: 2,
    label: 'Organization'
  }, {
    number: 3,
    label: 'Security'
  }];

  return <div className="min-h-screen bg-dark-900 cyber-grid flex flex-col">
    {/* Header gradient */}
    <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-neon-purple/10 via-neon-cyan/5 to-transparent pointer-events-none" />

    <div className="flex-1 flex flex-col px-4 py-8 max-w-md mx-auto w-full relative z-10">
      {/* Back button */}
      <motion.button initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} onClick={() => step > 1 ? handleBack() : navigate('/login')} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 self-start">
        <ArrowLeftIcon className="w-4 h-4" />
        <span>{step > 1 ? 'Back' : 'Sign In'}</span>
      </motion.button>

      {/* Header */}
      <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Create Account</h1>
        <p className="text-slate-400">Join CrowdVision in 3 easy steps</p>
      </motion.div>

      {/* Progress steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((s, index) => <Fragment key={s.number}>
          <div className="flex flex-col items-center">
            <motion.div animate={{
              backgroundColor: step >= s.number ? '#06B6D4' : '#334155',
              scale: step === s.number ? 1.1 : 1
            }} className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${step >= s.number ? 'text-dark-900' : 'text-slate-400'}`}>
              {step > s.number ? <CheckIcon className="w-5 h-5" /> : s.number}
            </motion.div>
            <span className="text-xs text-slate-400 mt-1">{s.label}</span>
          </div>
          {index < steps.length - 1 && <div className="flex-1 h-0.5 mx-2 bg-dark-600 relative">
            <motion.div initial={{
              width: '0%'
            }} animate={{
              width: step > s.number ? '100%' : '0%'
            }} className="absolute inset-y-0 left-0 bg-neon-cyan" />
          </div>}
        </Fragment>)}
      </div>

      {/* Form Card */}
      <Card variant="neon" padding="lg" className="flex-1">
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

        <AnimatePresence mode="wait">
          {step === 1 && <motion.div key="step1" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-4">
            <Input label="Full Name" placeholder="John Doe" value={formData.fullName} onChange={e => updateForm('fullName', e.target.value)} icon={<UserIcon className="w-5 h-5" />} />
            <Input label="Email Address" type="email" placeholder="you@company.com" value={formData.email} onChange={e => updateForm('email', e.target.value)} icon={<MailIcon className="w-5 h-5" />} />
            <Input label="Phone Number" type="tel" placeholder="+1 (555) 000-0000" value={formData.phone} onChange={e => updateForm('phone', e.target.value)} icon={<PhoneIcon className="w-5 h-5" />} />
          </motion.div>}

          {step === 2 && <motion.div key="step2" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-4">
            <Input label="Organization Name" placeholder="Acme Corporation" value={formData.organization} onChange={e => updateForm('organization', e.target.value)} icon={<BuildingIcon className="w-5 h-5" />} />
            <Select label="Your Role" value={formData.role} onChange={e => updateForm('role', e.target.value)} options={roleOptions} />
            <Input label="Department (Optional)" placeholder="Security Operations" value={formData.department} onChange={e => updateForm('department', e.target.value)} />
          </motion.div>}

          {step === 3 && <motion.div key="step3" initial={{
            opacity: 0,
            x: 20
          }} animate={{
            opacity: 1,
            x: 0
          }} exit={{
            opacity: 0,
            x: -20
          }} className="space-y-4">
            <Input label="Password" type="password" placeholder="Create a strong password" value={formData.password} onChange={e => updateForm('password', e.target.value)} icon={<LockIcon className="w-5 h-5" />} hint="At least 8 characters with numbers and symbols" />
            <Input label="Confirm Password" type="password" placeholder="Confirm your password" value={formData.confirmPassword} onChange={e => updateForm('confirmPassword', e.target.value)} icon={<LockIcon className="w-5 h-5" />} />
            <div className="p-3 bg-dark-700 rounded-xl">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" className="mt-1 w-4 h-4 rounded border-dark-600 bg-dark-800 text-neon-cyan focus:ring-neon-cyan/50" />
                <span className="text-sm text-slate-400">
                  I agree to the{' '}
                  <a href="#" className="text-neon-cyan hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-neon-cyan hover:underline">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
          </motion.div>}
        </AnimatePresence>

        {/* Action button */}
        <div className="mt-6">
          <Button fullWidth loading={loading} onClick={step === 3 ? handleSubmit : handleNext} icon={<ArrowRightIcon className="w-4 h-4" />} iconPosition="right">
            {step === 3 ? 'Create Account' : 'Continue'}
          </Button>
        </div>
      </Card>

      {/* Sign in link */}
      <motion.p initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.3
      }} className="text-center mt-6 text-slate-400">
        Already have an account?{' '}
        <button onClick={() => navigate('/login')} className="text-neon-cyan font-medium hover:underline">
          Sign in
        </button>
      </motion.p>
    </div>
  </div>;
}
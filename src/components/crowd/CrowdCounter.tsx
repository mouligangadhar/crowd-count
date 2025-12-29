import { motion } from 'framer-motion';
import { Users, TrendingUp, TrendingDown, Minus, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { useLatestCrowdCount, useCrowdTrend } from '../hooks/useCrowdData';
import { Card } from './ui/Card';

interface CrowdCounterProps {
    showTrend?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function CrowdCounter({ showTrend = true, size = 'md', className = '' }: CrowdCounterProps) {
    const { count, timestamp, loading, error } = useLatestCrowdCount();
    const { trend } = useCrowdTrend(30);

    const getTrendIcon = () => {
        switch (trend) {
            case 'increasing':
                return <TrendingUp className="w-5 h-5 text-neon-green" />;
            case 'decreasing':
                return <TrendingDown className="w-5 h-5 text-neon-red" />;
            default:
                return <Minus className="w-5 h-5 text-slate-400" />;
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'increasing':
                return 'text-neon-green';
            case 'decreasing':
                return 'text-neon-red';
            default:
                return 'text-slate-400';
        }
    };

    const getTrendText = () => {
        switch (trend) {
            case 'increasing':
                return 'Increasing';
            case 'decreasing':
                return 'Decreasing';
            default:
                return 'Stable';
        }
    };

    const sizeClasses = {
        sm: 'text-2xl',
        md: 'text-4xl',
        lg: 'text-6xl'
    };

    if (loading) {
        return (
            <Card className={className}>
                <div className="flex items-center justify-center p-8">
                    <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin" />
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className={className}>
                <div className="p-6 text-center">
                    <p className="text-red-400">Error loading crowd count</p>
                    <p className="text-xs text-slate-500 mt-2">{error}</p>
                </div>
            </Card>
        );
    }

    const formattedTime = timestamp
        ? new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
        : '--:--';

    return (
        <Card className={className} variant="neon">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-neon-cyan/20 flex items-center justify-center">
                            <Users className="w-6 h-6 text-neon-cyan" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-white">Current Crowd</h3>
                            <p className="text-xs text-slate-400">Live Count</p>
                        </div>
                    </div>
                    {showTrend && (
                        <div className="flex items-center gap-1">
                            {getTrendIcon()}
                            <span className={`text-xs font-medium ${getTrendColor()}`}>
                                {getTrendText()}
                            </span>
                        </div>
                    )}
                </div>

                {/* Count Display */}
                <motion.div
                    key={count}
                    initial={{ scale: 1.1, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mb-4"
                >
                    <div className={`${sizeClasses[size]} font-bold text-white mb-1`}>
                        {count !== null ? count.toLocaleString() : '--'}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                        <span className="text-xs text-slate-400">
                            Updated at {formattedTime}
                        </span>
                    </div>
                </motion.div>

                {/* Status Bar */}
                <div className="flex items-center gap-2 pt-4 border-t border-dark-700">
                    <div className="flex-1 text-center">
                        <div className="text-xs text-slate-500">Status</div>
                        <div className="text-sm font-medium text-neon-cyan">Active</div>
                    </div>
                    <div className="w-px h-8 bg-dark-700" />
                    <div className="flex-1 text-center">
                        <div className="text-xs text-slate-500">Trend</div>
                        <div className={`text-sm font-medium ${getTrendColor()}`}>
                            {getTrendText()}
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

interface CrowdStatsCardProps {
    entries: number;
    exits: number;
    currentCount: number;
    className?: string;
}

export function CrowdStatsCard({ entries, exits, currentCount, className = '' }: CrowdStatsCardProps) {
    return (
        <Card className={className}>
            <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">Today's Activity</h3>

                <div className="space-y-4">
                    {/* Current Count */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                                <Users className="w-5 h-5 text-neon-cyan" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Current Count</p>
                                <p className="text-xl font-bold text-white">{currentCount.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Entries */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
                                <ArrowUpIcon className="w-5 h-5 text-neon-green" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Total Entries</p>
                                <p className="text-xl font-bold text-white">{entries.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Exits */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neon-red/20 flex items-center justify-center">
                                <ArrowDownIcon className="w-5 h-5 text-neon-red" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400">Total Exits</p>
                                <p className="text-xl font-bold text-white">{exits.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>

                    {/* Net Change */}
                    <div className="flex items-center justify-between p-3 rounded-xl bg-neon-purple/10 border border-neon-purple/30">
                        <div className="flex-1">
                            <p className="text-xs text-slate-400 mb-1">Net Change</p>
                            <p className={`text-lg font-bold ${entries - exits >= 0 ? 'text-neon-green' : 'text-neon-red'}`}>
                                {entries - exits >= 0 ? '+' : ''}{(entries - exits).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}

import React, { useEffect, useRef } from 'react';
import { Flame, Sparkles, Activity, Radio } from 'lucide-react';
import { EmotionIntensity } from '../types';

interface EmotionDynamicsMeterProps {
  emotionId: string;
  emotionLabel?: string;
  intensity: EmotionIntensity;
  isRtl?: boolean;
}

export const EmotionDynamicsMeter: React.FC<EmotionDynamicsMeterProps> = ({
  emotionId,
  emotionLabel = 'طبيعي',
  intensity = 'medium',
  isRtl = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Intensity configuration
  const intensityConfigs: Record<
    EmotionIntensity,
    { label: string; pct: number; color: string; speed: number; amp: number }
  > = {
    low: { label: 'مستوى 1: هادئ ومضبوط', pct: 28, color: '#06B6D4', speed: 0.04, amp: 8 },
    medium: { label: 'مستوى 2: متزن وطبيعي', pct: 55, color: '#10B981', speed: 0.08, amp: 14 },
    high: { label: 'مستوى 3: مسرحي حيوي', pct: 82, color: '#F59E0B', speed: 0.13, amp: 20 },
    extreme: { label: 'مستوى 4: ذروة قصوى ومكهربة', pct: 100, color: '#EF4444', speed: 0.2, amp: 26 },
  };

  const currentCfg = intensityConfigs[intensity] || intensityConfigs.medium;

  // Emotion mood styling
  let moodGlow = currentCfg.color;
  if (emotionId.includes('angry') || emotionId.includes('rage')) {
    moodGlow = '#DC2626';
  } else if (emotionId.includes('sad') || emotionId.includes('grief')) {
    moodGlow = '#3B82F6';
  } else if (emotionId.includes('joy') || emotionId.includes('laugh')) {
    moodGlow = '#10B981';
  } else if (emotionId.includes('fear') || emotionId.includes('astonished')) {
    moodGlow = '#F59E0B';
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      phase += currentCfg.speed;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw animated frequency vertical equalizer bars
      const numBars = 36;
      const barWidth = width / numBars - 2;

      for (let i = 0; i < numBars; i++) {
        const x = i * (barWidth + 2);
        const norm = i / numBars;
        // Peak in center
        const bell = Math.sin(norm * Math.PI);
        const wave = Math.sin(phase + i * 0.35) * Math.cos(phase * 0.7 + i * 0.2);
        const barHeight = Math.max(4, (currentCfg.amp * bell * (1.2 + wave * 0.8)));

        const gradient = ctx.createLinearGradient(0, centerY - barHeight, 0, centerY + barHeight);
        gradient.addColorStop(0, moodGlow);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.15)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
      }

      // Draw central dynamic overlay line
      ctx.beginPath();
      ctx.strokeStyle = moodGlow;
      ctx.lineWidth = intensity === 'extreme' ? 3 : 2;
      ctx.shadowBlur = intensity === 'extreme' ? 12 : 6;
      ctx.shadowColor = moodGlow;

      for (let x = 0; x < width; x += 3) {
        const t = (x / width) * Math.PI * 4;
        let yOffset = Math.sin(t + phase) * currentCfg.amp;
        if (intensity === 'extreme') {
          yOffset += (Math.random() - 0.5) * 6; // dramatic electrical spikes
        }
        const y = centerY + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [emotionId, intensity, currentCfg, moodGlow]);

  return (
    <div className="p-3.5 rounded-2xl bg-[#18181B] text-white border border-[#27272A] shadow-md space-y-2.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-white shadow-xs"
            style={{ backgroundColor: moodGlow }}
          >
            {intensity === 'extreme' ? (
              <Flame className="w-3.5 h-3.5 animate-bounce" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
            )}
          </div>
          <div>
            <span className="font-extrabold text-xs text-zinc-100 flex items-center gap-1.5">
              <span>مؤشر الشحنة الدرامية والتعبير الحي</span>
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: moodGlow }} />
            </span>
            <span className="text-[10px] text-zinc-400 block">
              طبيعة النبرة: <strong className="text-zinc-200">{emotionLabel}</strong>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span
            className="px-2 py-0.5 rounded-md text-white font-bold text-[10px] shadow-2xs"
            style={{ backgroundColor: moodGlow }}
          >
            {currentCfg.label}
          </span>
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-bold border border-zinc-700">
            طاقة: {currentCfg.pct}%
          </span>
        </div>
      </div>

      {/* Dynamic Animated Canvas */}
      <div className="relative rounded-xl overflow-hidden bg-black/60 border border-zinc-800">
        <canvas
          ref={canvasRef}
          width={500}
          height={65}
          className="w-full h-16 block"
        />
        <div className="absolute bottom-1 right-2 text-[9px] font-mono text-zinc-500">
          DRAMATIC VOLTAGE RHYTHM (LEVEL {intensity.toUpperCase()})
        </div>
      </div>

      {/* Dynamic Intensity Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[10px] text-zinc-400">
          <span>شحنة النبرة والأداء التمثيلي:</span>
          <span className="font-mono font-bold text-zinc-200">{currentCfg.pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden p-0.5 border border-zinc-700">
          <div
            className="h-full rounded-full transition-all duration-300 shadow-sm"
            style={{
              width: `${currentCfg.pct}%`,
              backgroundColor: moodGlow,
            }}
          />
        </div>
      </div>
    </div>
  );
};

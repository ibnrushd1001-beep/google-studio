import React, { useEffect, useRef } from 'react';
import { Activity, Zap, Mic2, HeartPulse } from 'lucide-react';
import { VocalCordsTension, ResonanceChamber, VocalTexture, VocalCordTremor } from '../types';

interface VocalCordsMeterProps {
  age: number;
  gender: 'female' | 'male';
  tension?: VocalCordsTension;
  resonance?: ResonanceChamber;
  texture?: VocalTexture;
  tremor?: VocalCordTremor;
  isRtl?: boolean;
}

export const VocalCordsMeter: React.FC<VocalCordsMeterProps> = ({
  age,
  gender,
  tension = 'elastic_melodic',
  resonance = 'throat',
  texture = 'pure',
  tremor = 'steady_pure',
  isRtl = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Compute physical acoustic F0 estimate based on age & gender
  const isChild = age <= 12;
  const isTeen = age > 12 && age <= 17;
  const isElder = age >= 56;

  let baseF0 = 175;
  if (isChild) {
    baseF0 = Math.round(340 - (age - 4) * 12); // ~340Hz at 4yo down to ~244Hz at 12yo
  } else if (gender === 'female') {
    baseF0 = isElder ? 175 : isTeen ? 230 : 210;
  } else {
    baseF0 = isElder ? 100 : isTeen ? 145 : 125;
  }

  // Glottal closure percentage
  let glottalClosurePct = 70;
  let tensionColor = '#10B981'; // emerald
  if (tension === 'taut_firm') {
    glottalClosurePct = 92;
    tensionColor = '#F59E0B'; // amber
  } else if (tension === 'pressed_creaky') {
    glottalClosurePct = 96;
    tensionColor = '#EF4444'; // red
  } else if (tension === 'relaxed_breathy') {
    glottalClosurePct = 42;
    tensionColor = '#06B6D4'; // cyan
  } else {
    glottalClosurePct = 68;
    tensionColor = '#10B981'; // emerald
  }

  // Resonance title
  const resonanceTitles: Record<ResonanceChamber, string> = {
    head: 'رأسي طفولي رقيق (Head)',
    throat: 'حنجري فموي مباشر (Throat/Pharyngeal)',
    chest: 'صدري عميق وقور (Chest)',
    nasal: 'أنفي شعبي حار (Nasal)',
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      phase += 0.08;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 15) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Calculate wave parameters
      const freqMultiplier = isChild ? 3.2 : isTeen ? 2.2 : isElder ? 1.1 : 1.6;
      const amplitude = tension === 'taut_firm' ? 18 : tension === 'relaxed_breathy' ? 9 : 14;
      const centerY = height / 2;

      // Draw secondary shadow wave
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(200, 100, 70, 0.25)';
      ctx.lineWidth = 1.5;
      for (let x = 0; x < width; x++) {
        const t = (x / width) * Math.PI * 4 * freqMultiplier;
        let yOffset = Math.sin(t + phase * 0.8) * (amplitude * 0.7);
        if (texture === 'raspy') {
          yOffset += (Math.random() - 0.5) * 4;
        }
        if (tremor === 'frightened_shiver') {
          yOffset += Math.sin(phase * 4 + x * 0.1) * 3;
        }
        const y = centerY + yOffset;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw primary glowing glottal wave
      ctx.beginPath();
      ctx.strokeStyle = isChild ? '#38BDF8' : tensionColor;
      ctx.lineWidth = 2.5;
      ctx.shadowBlur = 8;
      ctx.shadowColor = isChild ? '#38BDF8' : tensionColor;

      for (let x = 0; x < width; x++) {
        const t = (x / width) * Math.PI * 4 * freqMultiplier;
        let yOffset = 0;

        if (tension === 'pressed_creaky') {
          // Sharp asymmetrical pulses with fry glitches
          yOffset = Math.sin(t + phase) * amplitude;
          if (Math.sin(t + phase) > 0.5) {
            yOffset += (Math.random() - 0.5) * 6;
          }
        } else if (tension === 'taut_firm') {
          // Sharp triangular peaks
          yOffset = Math.sign(Math.sin(t + phase)) * Math.pow(Math.abs(Math.sin(t + phase)), 0.6) * amplitude;
        } else if (tension === 'relaxed_breathy') {
          // Smooth sine with gentle air flutter
          yOffset = Math.sin(t + phase) * amplitude + Math.sin(t * 3) * 2;
        } else {
          // Smooth sinusoidal wave
          yOffset = Math.sin(t + phase) * amplitude;
        }

        // Apply tremor
        if (tremor === 'frightened_shiver') {
          yOffset += Math.sin(phase * 5 + x * 0.2) * 4;
        } else if (tremor === 'aged_quiver') {
          yOffset += Math.sin(phase * 1.5 + x * 0.05) * 5;
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
  }, [age, gender, tension, resonance, texture, tremor, isChild, isTeen, isElder, tensionColor]);

  return (
    <div className="p-3.5 rounded-2xl bg-[#18181B] text-white border border-[#27272A] shadow-md space-y-2.5">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#C86446]/20 text-[#C86446] flex items-center justify-center font-bold">
            <HeartPulse className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-xs text-zinc-100 flex items-center gap-1.5">
              <span>مؤشر اهتزاز الأحبال الصوتية المباشر</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </span>
            <span className="text-[10px] text-zinc-400 block">
              {isChild
                ? '👶 حنجرة طفل: تردد اهتزازي عالٍ جداً وأحبال مرنة خفيفة'
                : isElder
                ? '🧓 حنجرة كهل: تردد منخفض واهتزاز وقور عميق'
                : '🧑 حنجرة بالغة: اهتزاز متزن ورنين طبيعي'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-cyan-400 font-bold border border-zinc-700">
            F0: ~{baseF0} Hz
          </span>
          <span
            className="px-2 py-0.5 rounded-md text-white font-bold text-[10px]"
            style={{ backgroundColor: tensionColor }}
          >
            انغلاق: {glottalClosurePct}%
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
          GLOTTAL PULSE WAVEFORM (LIVE 60FPS)
        </div>
      </div>

      {/* Reactive Parameter Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-zinc-300">
        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <span className="text-zinc-500 block text-[9px]">الرنين التجويفي</span>
          <span className="font-bold text-zinc-200 truncate block mt-0.5">
            {resonanceTitles[resonance] || resonance}
          </span>
        </div>
        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <span className="text-zinc-500 block text-[9px]">توتر الأحبال</span>
          <span className="font-bold text-emerald-400 truncate block mt-0.5">
            {tension === 'taut_firm'
              ? 'مشدودة محكمة'
              : tension === 'pressed_creaky'
              ? 'مضغوطة خشنة'
              : tension === 'relaxed_breathy'
              ? 'مرتخية همسية'
              : 'مرنة مطاطية طروبة'}
          </span>
        </div>
        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <span className="text-zinc-500 block text-[9px]">نقاء الخامة</span>
          <span className="font-bold text-cyan-300 truncate block mt-0.5">
            {texture === 'pure'
              ? 'صافٍ بلوري'
              : texture === 'breathy'
              ? 'مشوب بأنفاس'
              : texture === 'raspy'
              ? 'أجش وبحة'
              : 'مخنوق بكتمان'}
          </span>
        </div>
        <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-center">
          <span className="text-zinc-500 block text-[9px]">ثبات الأحبال</span>
          <span className="font-bold text-amber-300 truncate block mt-0.5">
            {tremor === 'steady_pure'
              ? 'ثبات نقي'
              : tremor === 'frightened_shiver'
              ? 'رجفة خوف وتأثر'
              : 'اهتزاز كبر السن'}
          </span>
        </div>
      </div>
    </div>
  );
};

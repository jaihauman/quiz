import React from 'react';
import { 
  Calculator, 
  BrainCircuit, 
  BookOpen, 
  Globe, 
  Code, 
  FlaskConical, 
  Trophy,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  ScrollText,
  Landmark,
  Palette
} from 'lucide-react';

interface IconProps {
  name: string;
  size?: number;
  className?: string;
}

const icons: Record<string, React.FC<any>> = {
  Calculator,
  BrainCircuit,
  BookOpen,
  Globe,
  Code,
  FlaskConical,
  Trophy,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  BarChart3,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  ScrollText,
  Landmark,
  Palette
};

export const Icon: React.FC<IconProps> = ({ name, size = 24, className = "" }) => {
  const IconComponent = icons[name] || AlertCircle;
  return <IconComponent size={size} className={className} />;
};
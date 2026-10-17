export type NavTab = 'home' | 'studio' | 'my-courses' | 'learning-player' | 'analytics' | 'agent-logs' | 'oral-defense' | 'settings';

export interface IngestionFileItem {
  id: string;
  name: string;
  format: 'PDF' | 'PPTX' | 'DOCX' | 'XLSX' | 'CSV';
  size: string;
  details: string;
  status: 'indexed' | 'processing' | 'synced';
  progress?: number;
  remainingTime?: string;
  chunksCount?: number;
  timestamp: string;
  vectorsGenerated: string;
}

export interface CourseItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  badgeClass: string;
  modulesCount: number;
  duration: string;
  description: string;
  feature: string;
  techStack: string;
  instructorName: string;
  instructorRole: string;
  instructorAvatar?: string;
  instructorInitial: string;
  imageSrc: string;
  progressPercent?: number;
  currentModuleTitle?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  userId: string;
  agentName: 'EnrollmentAgent' | 'ArtifactAgent' | 'RAGAgent' | 'RoutingAgent' | 'EvaluationAgent';
  actionExecuted: string;
  toolCalled: string;
  status: 'SUCCESS' | 'RETRY (2/3)' | 'FAILED' | 'PROCESSING';
  latency: string;
  latencyBreakdown?: {
    network: number;
    reasoning: number;
    storage: number;
  };
  triggerSource: string;
  input: string;
  output: string;
  parameters: Record<string, any>;
  evalScore?: {
    intentConfidence: number;
    guardrailsPassed: boolean;
  };
}

export interface SkillNode {
  id: string;
  name: string;
  category: 'all' | 'vectors' | 'agentic' | 'infra';
  status: 'mastered' | 'in-progress' | 'locked' | 'recommended';
  percentage: number;
  x: number;
  y: number;
  subtitle: string;
  threshold: string;
  verifiedList: string[];
  pendingRequirement?: string;
}

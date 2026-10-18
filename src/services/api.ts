import { CourseItem, IngestionFileItem, LogEntry, SkillNode } from '../types';

export interface BackendHealthResponse {
  status: string;
  timestamp: string;
  service: string;
  version: string;
  geminiStatus: string;
  capabilities: string[];
}

export interface UserProfileData {
  id: string;
  fullName: string;
  headline: string;
  email: string;
  organization: string;
  location: string;
  bio: string;
  skills: string[];
  gcpProjectId: string;
  gcpRegion: string;
  storageBucket: string;
  vectorIndexId: string;
  preferredTutor: 'lyra' | 'atlas' | 'nova';
  voiceSpeed: number;
  defenseDifficulty: 'standard' | 'rigorous' | 'fellow';
  autoSpeechEnabled: boolean;
  autoRunCode: boolean;
  notifyDefense: boolean;
  notifyIngestion: boolean;
  notifyCertExpiry: boolean;
  emailDigest: 'instant' | 'daily' | 'weekly';
  webhookUrl: string;
}

export interface CodeExecutionResult {
  success: boolean;
  executionId: string;
  status: string;
  telemetry: {
    vectorDimensions: number;
    datasetVectors: number;
    metric: string;
    hnswQueryTimeMs: number;
    bruteForceTimeMs: number;
    speedup: string;
    recall: string;
    memoryAllocatedMb: number;
    cpuCoresUtilized: number;
  };
  stdout: string;
}

export interface DefenseEvalResult {
  success: boolean;
  source: string;
  overallScore: number;
  rubricScores: {
    factual: string;
    terminology: string;
    clarity: string;
    edge: string;
  };
  feedback: string;
  hash: string;
  status?: string;
  timestamp?: string;
  signedBy?: string;
}

export interface GeneratedSyllabus {
  title: string;
  summary: string;
  estimatedHours: number;
  modules: {
    moduleNumber: number;
    title: string;
    objective: string;
    labExercise: string;
    keyConcepts: string[];
  }[];
}

export interface GoogleServiceStatus {
  id: string;
  name: string;
  category: string;
  model?: string;
  endpoint?: string;
  bucket?: string;
  status: string;
  latency?: string;
  dimensions?: number;
  throughput?: string;
  features?: string[];
  recallAt10?: string;
  qps?: string;
  latencyP99?: string;
  storageClass?: string;
  indexedDocs?: number;
  version?: string;
  instance?: string;
}

export interface GoogleServicesStatusResponse {
  success: boolean;
  timestamp: string;
  gcpProjectId: string;
  gcpRegion: string;
  services: GoogleServiceStatus[];
}

export interface VectorSearchResultItem {
  id: string;
  title: string;
  category: string;
  content: string;
  similarityScore: number;
  cosineDistance: number;
  euclideanDistance: number;
  vectorMatchPercent: string;
}

export interface VectorSearchResponse {
  success: boolean;
  query: string;
  metric: string;
  topK: number;
  totalCorpusVectors: number;
  searchLatencyMs: number;
  speedupFactor: string;
  endpoint: string;
  results: VectorSearchResultItem[];
}

class ApiService {
  private baseUrl = '/api';

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      return await res.json();
    } catch (err) {
      console.warn(`[API] Request failed for ${endpoint}:`, err);
      throw err;
    }
  }

  // Health
  async getHealth(): Promise<BackendHealthResponse> {
    return this.request<BackendHealthResponse>('/health');
  }

  async checkHealth(): Promise<BackendHealthResponse> {
    return this.getHealth();
  }

  // Profile & GCP Settings
  async getProfile(): Promise<UserProfileData> {
    const res = await this.request<{ success: boolean; data: UserProfileData }>('/user/profile');
    return res.data;
  }

  async updateProfile(updates: Partial<UserProfileData>): Promise<UserProfileData> {
    const res = await this.request<{ success: boolean; message: string; data: UserProfileData }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    return res.data;
  }

  async testGcpConnection(configOrProjectId?: any, region?: string): Promise<{ success: boolean; message: string; timestamp?: string }> {
    let payload: any = {};
    if (typeof configOrProjectId === 'object' && configOrProjectId !== null) {
      payload = configOrProjectId;
    } else {
      payload = { projectId: configOrProjectId, region };
    }
    return this.request('/gcp/test-connection', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  // Courses
  async getCourses(category?: string, search?: string): Promise<CourseItem[]> {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    const query = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request<{ success: boolean; total: number; data: CourseItem[] }>(`/courses${query}`);
    return res.data;
  }

  async getCourse(id: string): Promise<CourseItem | any> {
    const res = await this.request<{ success: boolean; data: any }>(`/courses/${id}`);
    return res.data;
  }

  async updateCourseProgress(id: string, progressPercent: number, currentModuleTitle?: string): Promise<any> {
    return this.request(`/courses/${id}/progress`, {
      method: 'POST',
      body: JSON.stringify({ progressPercent, currentModuleTitle }),
    });
  }

  async publishCourse(courseData: Partial<CourseItem>): Promise<CourseItem> {
    const res = await this.request<{ success: boolean; message: string; data: CourseItem }>('/courses/publish', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
    return res.data;
  }

  // Ingestion
  async getIngestionFiles(): Promise<IngestionFileItem[]> {
    const res = await this.request<{ success: boolean; count: number; data: IngestionFileItem[] }>('/ingestion/files');
    return res.data;
  }

  async uploadFile(
    payloadOrName: { name?: string; fileName?: string; format?: string; size?: string } | string,
    format?: string,
    size?: string
  ): Promise<IngestionFileItem> {
    let body: any = {};
    if (typeof payloadOrName === 'object' && payloadOrName !== null) {
      body = {
        fileName: payloadOrName.fileName || payloadOrName.name,
        format: payloadOrName.format || 'PDF',
        size: payloadOrName.size || '5.0 MB',
      };
    } else {
      body = {
        fileName: payloadOrName,
        format: format || 'PDF',
        size: size || '5.0 MB',
      };
    }

    const res = await this.request<{ success: boolean; data: IngestionFileItem }>('/ingestion/upload', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    return res.data;
  }

  async generateSyllabus(topic: string, difficulty?: string): Promise<GeneratedSyllabus> {
    const res = await this.request<{ success: boolean; source: string; data: GeneratedSyllabus }>('/ingestion/generate-syllabus', {
      method: 'POST',
      body: JSON.stringify({ topic, difficulty }),
    });
    return res.data;
  }

  // Learning Player & AI Tutor
  async sendTutorChat(
    message: string,
    personality = 'Socratic',
    lessonId = '2.1'
  ): Promise<{ success: boolean; reply: string; source: string; time: string }> {
    return this.request('/player/chat', {
      method: 'POST',
      body: JSON.stringify({ message, lessonId, personality }),
    });
  }

  async executeCodeBenchmark(
    datasetSize = 250000,
    dimensions = 1536,
    metric = 'cosine'
  ): Promise<CodeExecutionResult> {
    return this.request<CodeExecutionResult>('/player/code/execute', {
      method: 'POST',
      body: JSON.stringify({ datasetSize, dimensions, metric }),
    });
  }

  async getNotes(courseId: string): Promise<string[]> {
    const res = await this.request<{ success: boolean; notes: string | string[] }>(`/player/notes/${courseId}`);
    if (Array.isArray(res.notes)) return res.notes;
    if (typeof res.notes === 'string') {
      try {
        const parsed = JSON.parse(res.notes);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        return res.notes.split('\n').filter((l) => l.trim().length > 0);
      }
    }
    return [];
  }

  async saveNotes(courseId: string, notes: string | string[]): Promise<boolean> {
    const payload = Array.isArray(notes) ? JSON.stringify(notes) : notes;
    const res = await this.request<{ success: boolean }>(`/player/notes/${courseId}`, {
      method: 'POST',
      body: JSON.stringify({ notes: payload }),
    });
    return res.success;
  }

  // Oral Defense
  async getDefenseQuestions(courseId = 'crs_vector_101'): Promise<any[]> {
    const res = await this.request<{ success: boolean; data: any[] }>(`/defense/questions/${courseId}`);
    return res.data;
  }

  async evaluateOralDefense(
    stepOrPayload: number | { stepNumber?: number; step?: number; question?: string; questionText?: string; spokenAnswer?: string; transcript?: string; courseId?: string },
    transcript?: string,
    questionText?: string
  ): Promise<DefenseEvalResult> {
    let body: any = {};
    if (typeof stepOrPayload === 'object' && stepOrPayload !== null) {
      body = {
        step: stepOrPayload.stepNumber || stepOrPayload.step || 2,
        transcript: stepOrPayload.spokenAnswer || stepOrPayload.transcript || '',
        questionText: stepOrPayload.question || stepOrPayload.questionText || '',
        courseId: stepOrPayload.courseId,
      };
    } else {
      body = {
        step: stepOrPayload,
        transcript: transcript || '',
        questionText: questionText || '',
      };
    }

    return this.request<DefenseEvalResult>('/defense/evaluate', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async getCertificate(id: string): Promise<any> {
    return this.request(`/defense/certificate/${id}`);
  }

  // Agent Logs & Observability
  async getAgentLogs(params?: { agent?: string; status?: string; search?: string; limit?: number }): Promise<LogEntry[]> {
    const searchParams = new URLSearchParams();
    if (params?.agent) searchParams.set('agent', params.agent);
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);
    if (params?.limit) searchParams.set('limit', String(params.limit));

    const q = searchParams.toString() ? `?${searchParams.toString()}` : '';
    const res = await this.request<{
      success: boolean;
      total: number;
      data: LogEntry[];
    }>(`/agent-logs${q}`);
    return res.data;
  }

  async postAgentLog(log: Partial<LogEntry>): Promise<LogEntry> {
    const res = await this.request<{ success: boolean; data: LogEntry }>('/agent-logs', {
      method: 'POST',
      body: JSON.stringify(log),
    });
    return res.data;
  }

  // SSE Live Stream for Agent Logs
  subscribeAgentLogsStream(
    onNewLog: (log: LogEntry) => void,
    onStatusChange?: (connected: boolean) => void
  ): () => void {
    if (typeof window === 'undefined' || !window.EventSource) {
      return () => {};
    }

    let eventSource: EventSource | null = null;
    try {
      eventSource = new EventSource(`${this.baseUrl}/agent-logs/stream`);

      eventSource.onopen = () => {
        onStatusChange?.(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'NEW_LOG' && payload.log) {
            onNewLog(payload.log);
          }
        } catch (e) {
          // ignore parse errors
        }
      };

      eventSource.onerror = () => {
        onStatusChange?.(false);
      };
    } catch (err) {
      console.warn('[SSE] EventSource init failed:', err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
        onStatusChange?.(false);
      }
    };
  }

  // Notifications
  async getNotifications(): Promise<any[]> {
    const res = await this.request<{ success: boolean; count: number; data: any[] }>('/notifications');
    return res.data;
  }

  async markNotificationRead(id: string): Promise<any> {
    return this.request(`/notifications/${id}/read`, { method: 'PUT' });
  }

  async clearAllNotifications(): Promise<any> {
    return this.request('/notifications/clear-all', { method: 'POST' });
  }

  // Analytics & Skill Graph
  async getAnalytics(): Promise<any> {
    return this.request('/analytics/overview');
  }

  async getSkillGraph(): Promise<SkillNode[]> {
    const res = await this.request<{ success: boolean; data: SkillNode[] }>('/analytics/skill-graph');
    return res.data;
  }

  // Google Cloud Services & Fast APIs Suite
  async getGoogleServicesStatus(): Promise<GoogleServicesStatusResponse> {
    return this.request<GoogleServicesStatusResponse>('/google-services/status');
  }

  async getFastApiDocs(): Promise<any> {
    return this.request('/docs');
  }

  async generateEmbedding(text: string): Promise<any> {
    return this.request('/services/embeddings', {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  }

  async searchVectors(query: string, metric = 'cosine', topK = 3): Promise<VectorSearchResponse> {
    return this.request<VectorSearchResponse>('/services/vector-search', {
      method: 'POST',
      body: JSON.stringify({ query, metric, topK }),
    });
  }

  async analyzeDocument(fileName: string, format = 'PDF', fileSize = '14.2 MB'): Promise<any> {
    return this.request('/ingestion/analyze-document', {
      method: 'POST',
      body: JSON.stringify({ fileName, format, fileSize }),
    });
  }

  async streamTutorChat(
    message: string,
    onChunk: (text: string) => void,
    onDone: () => void,
    personality = 'Socratic',
    lessonId = '2.1'
  ): Promise<() => void> {
    let cancelled = false;
    try {
      const response = await fetch(`${this.baseUrl}/player/chat/stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, personality, lessonId }),
      });

      if (!response.body) {
        onDone();
        return () => {};
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      (async () => {
        try {
          while (!cancelled) {
            const { value, done } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') {
                  onDone();
                  return;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) onChunk(parsed.text);
                } catch (e) {
                  // ignore malformed chunk
                }
              }
            }
          }
          onDone();
        } catch (e) {
          onDone();
        }
      })();
    } catch (e) {
      onDone();
    }

    return () => {
      cancelled = true;
    };
  }
}

export const api = new ApiService();

import { CourseItem, IngestionFileItem, LogEntry, SkillNode } from '../src/types';
export type { CourseItem, IngestionFileItem, LogEntry, SkillNode } from '../src/types';

export interface UserProfile {
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

export interface DefenseQuestion {
  step: number;
  title: string;
  tag: string;
  question: string;
  modelAnswer: string;
  rubric: {
    factual: number;
    terminology: number;
    clarity: number;
    edge: number;
  };
}

export interface DefenseSubmission {
  id: string;
  courseId: string;
  learnerName: string;
  step: number;
  transcript: string;
  overallScore: number;
  status: 'passed' | 're-test-recommended';
  feedback: string;
  rubricScores: {
    factual: string;
    terminology: string;
    clarity: string;
    edge: string;
  };
  hash: string;
  timestamp: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'defense' | 'system' | 'ingestion' | 'credential';
  read: boolean;
  actionUrl?: string;
  actionTab?: string;
}

// In-Memory Global Datastore with initial rich seed state
export const store = {
  profile: {
    id: 'usr_alex_rivera',
    fullName: 'Alex Rivera',
    headline: 'Lead GenAI & ML Engineer',
    email: 'alex.rivera@vertex-cloud.dev',
    organization: 'Google Cloud AI Center of Excellence',
    location: 'Mountain View, CA (Hybrid / us-central1)',
    bio: 'Specializing in multimodal Gemini pipelines, high-throughput vector search (ScaNN/HNSW), and real-time interactive avatar instruction systems.',
    skills: [
      'Vertex AI',
      'Gemini 2.5 Flash',
      'Vector Search',
      'TensorFlow / JAX',
      'RAG Architectures',
      'Cloud TPU v5e',
      'Kubernetes (GKE)',
    ],
    gcpProjectId: 'vertex-gemini-sandbox-prod',
    gcpRegion: 'us-central1',
    storageBucket: 'gs://vertex-academy-knowledge-lake',
    vectorIndexId: '489201984210/locations/us-central1/indexes/corpus-rag-v4',
    preferredTutor: 'lyra' as const,
    voiceSpeed: 1.0,
    defenseDifficulty: 'rigorous' as const,
    autoSpeechEnabled: true,
    autoRunCode: true,
    notifyDefense: true,
    notifyIngestion: true,
    notifyCertExpiry: true,
    emailDigest: 'daily' as const,
    webhookUrl: 'https://chat.googleapis.com/v1/spaces/AAQA8921/messages?key=AIza...',
  } as UserProfile,

  courses: [
    {
      id: 'crs_vector_101',
      title: 'Advanced Vector Embeddings & HNSW Graph Indexing',
      category: 'Vector Architecture',
      badge: 'Core Specialist',
      badgeClass: 'bg-[#e8f0fe] text-[#1a73e8] border-[#c2e7ff]',
      modulesCount: 6,
      duration: '4h 15m',
      description: 'Master high-dimensional vector spaces, distance metric equivalence, hierarchical navigable small worlds (HNSW), and pgvector query optimization with Cloud SQL.',
      feature: 'Interactive HNSW 3D Visualizer & Gemini S2S Defense',
      techStack: 'Vertex AI Vector Search • ScaNN • pgvector • Python 3.11',
      instructorName: 'Dr. Elena Rostova',
      instructorRole: 'Staff AI Research Scientist, Google DeepMind',
      instructorInitial: 'E',
      imageSrc: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      progressPercent: 68,
      currentModuleTitle: 'Module 2.3: Cosine Distance vs Euclidean Geometry',
    },
    {
      id: 'crs_agentic_rag_201',
      title: 'Production Agentic RAG with Vertex AI Search & Reasoning Engines',
      category: 'Agent Systems',
      badge: 'Enterprise Lab',
      badgeClass: 'bg-[#fce8e6] text-[#c5221f] border-[#f4c7c3]',
      modulesCount: 8,
      duration: '6h 30m',
      description: 'Architect autonomous multi-agent pipelines with dynamic query decomposition, citation-grounded generation, and self-correcting retrieval loops using LangGraph.',
      feature: 'Real-time Agentic Observability & Tool Sandbox',
      techStack: 'Gemini 2.5 Flash • LangGraph • Vertex Reasoning Engine',
      instructorName: 'Marcus Vance',
      instructorRole: 'Principal Cloud AI Architect, Google Cloud',
      instructorInitial: 'M',
      imageSrc: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80',
      progressPercent: 42,
      currentModuleTitle: 'Module 3: Multi-Hop Retrieval Deconstruction',
    },
    {
      id: 'crs_defense_eval_301',
      title: 'Gemini Multimodal Oral Defense & Automated Rubric Engineering',
      category: 'Evaluation & Trust',
      badge: 'Accredited',
      badgeClass: 'bg-[#e6f4ea] text-[#137333] border-[#ceead6]',
      modulesCount: 5,
      duration: '3h 45m',
      description: 'Design rigorous oral examination guardrails with real-time speech sentiment analysis, multi-dimensional scoring rubrics, and tamper-proof cryptographic credential issuance.',
      feature: 'Voice S2S Live Evaluation & Hash-Verified Certificates',
      techStack: 'Gemini Live Speech API • Web Audio API • Cryptographic SHA-256',
      instructorName: 'Aisha Patel',
      instructorRole: 'Director of AI Trust & Certification, Vertex Academy',
      instructorInitial: 'A',
      imageSrc: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=600&q=80',
      progressPercent: 100,
      currentModuleTitle: 'Module 5: Cryptographic Hash Verification Completed',
    },
    {
      id: 'crs_tpu_v5e_401',
      title: 'Distributed Inference & Fine-Tuning on Cloud TPU v5e',
      category: 'Hardware & Scale',
      badge: 'High Performance',
      badgeClass: 'bg-[#fef7e0] text-[#b06000] border-[#feefc3]',
      modulesCount: 7,
      duration: '5h 20m',
      description: 'Accelerate large-scale transformer deployment using JAX, vLLM, and TPU pod slices with memory-efficient sharding (SPMD) and speculative decoding.',
      feature: 'Live TPU Profiler & Latency Simulator',
      techStack: 'Cloud TPU v5e • JAX • vLLM • Ray on GKE',
      instructorName: 'Kenji Sato',
      instructorRole: 'Lead TPU Systems Engineer, Google Cloud',
      instructorInitial: 'K',
      imageSrc: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
      progressPercent: 15,
      currentModuleTitle: 'Module 1.2: Tensor Parallelism vs Pipeline Parallelism',
    },
  ] as CourseItem[],

  files: [
    {
      id: 'doc-1',
      name: 'Vector_DB_Architecture.pdf',
      format: 'PDF',
      size: '14.2 MB',
      details: '14.2 MB • 42 Pages • 1,248 Chunks in pgvector',
      status: 'indexed',
      progress: 100,
      timestamp: 'Today, 10:42 AM',
      vectorsGenerated: '1,248 Vectors (text-embedding-004)',
    },
    {
      id: 'doc-2',
      name: 'Course_Syllabus.pptx',
      format: 'PPTX',
      size: '28.6 MB',
      details: '28.6 MB • 34 Slides • Synthesizing storyboard',
      status: 'synced',
      progress: 100,
      remainingTime: 'Synced',
      timestamp: 'Today, 10:38 AM',
      vectorsGenerated: '840 Vectors • 34 Keyframes',
    },
    {
      id: 'doc-3',
      name: 'Lab_Exercises_Dataset.xlsx',
      format: 'XLSX',
      size: '4.8 MB',
      details: '4.8 MB • 1,500 Rows • Schema mapped & normalized',
      status: 'synced',
      progress: 100,
      timestamp: 'Today, 09:15 AM',
      vectorsGenerated: '1,500 Vectors (Normalized)',
    },
  ] as IngestionFileItem[],

  logs: [
    {
      id: 'log_771122',
      timestamp: '11:25:01.428',
      userId: 'usr_998822',
      agentName: 'EnrollmentAgent',
      actionExecuted: 'ENROLL_USER',
      toolCalled: 'Firestore.update()',
      status: 'SUCCESS',
      latency: '120ms',
      latencyBreakdown: { network: 14, reasoning: 88, storage: 18 },
      triggerSource: 'Gemini Live Speech Tutor',
      input: 'User verbally requested: "Enroll me in the hands-on lab"',
      output: 'Updated user doc. Provisioned sandbox container.',
      parameters: {
        courseId: 'crs_vector_101',
        labModule: '2.3_exact_vs_approx_knn',
        grantedTier: 'COMPUTE_SANDBOX_A100',
      },
      evalScore: {
        intentConfidence: 0.994,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771121',
      timestamp: '11:24:45.891',
      userId: 'usr_998822',
      agentName: 'ArtifactAgent',
      actionExecuted: 'GENERATE_DIAGRAM',
      toolCalled: 'Mermaid.render()',
      status: 'SUCCESS',
      latency: '450ms',
      latencyBreakdown: { network: 22, reasoning: 390, storage: 38 },
      triggerSource: 'Learning Canvas In-Line Query',
      input: 'User requested skip-list visualization for HNSW hierarchy',
      output: 'Rendered SVG vector skip-list flowchart asset.',
      parameters: {
        diagramType: 'HNSW_SKIP_LIST',
        layersCount: 3,
      },
      evalScore: {
        intentConfidence: 0.988,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771120',
      timestamp: '11:23:10.104',
      userId: 'usr_334411',
      agentName: 'RAGAgent',
      actionExecuted: 'VECTOR_SEARCH',
      toolCalled: 'VertexAI.VectorSearch()',
      status: 'SUCCESS',
      latency: '85ms',
      latencyBreakdown: { network: 10, reasoning: 65, storage: 10 },
      triggerSource: 'Prompt Engine Retrieval',
      input: 'Query vector embedding lookup for cosine vs euclidean',
      output: 'Retrieved 4 high-affinity chunks with >0.88 cosine score.',
      parameters: {
        indexName: 'hnsw-cosine-prod-01',
        topK: 4,
        vectorDimensions: 1536,
      },
      evalScore: {
        intentConfidence: 0.999,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771119',
      timestamp: '11:21:04.550',
      userId: 'usr_110294',
      agentName: 'EvaluationAgent',
      actionExecuted: 'RUBRIC_SCORE',
      toolCalled: 'Gemini.evaluateSpeechRubric()',
      status: 'SUCCESS',
      latency: '340ms',
      latencyBreakdown: { network: 18, reasoning: 310, storage: 12 },
      triggerSource: 'Oral Defense Voice Stream',
      input: 'Evaluated Step 2 Oral Defense submission: Euclidean vs Cosine equivalency',
      output: 'Grade: 95/100. Generated cryptographic certification hash.',
      parameters: {
        criteriaWeights: { factual: 0.35, depth: 0.35, edge: 0.3 },
        score: 95,
      },
      evalScore: {
        intentConfidence: 0.992,
        guardrailsPassed: true,
      },
    },
    {
      id: 'log_771118',
      timestamp: '11:18:22.012',
      userId: 'usr_998822',
      agentName: 'RoutingAgent',
      actionExecuted: 'ROUTE_TO_SPECIALIST',
      toolCalled: 'Router.dispatch()',
      status: 'SUCCESS',
      latency: '45ms',
      latencyBreakdown: { network: 8, reasoning: 32, storage: 5 },
      triggerSource: 'Navigation Intent Parser',
      input: 'User clicked "Open Ingestion Studio"',
      output: 'Dispatched to IngestionStudioAgent with Cloud Storage context.',
      parameters: {
        targetView: 'studio',
        bucket: 'gs://vertex-academy-knowledge-lake',
      },
      evalScore: {
        intentConfidence: 0.997,
        guardrailsPassed: true,
      },
    },
  ] as LogEntry[],

  defenseQuestions: [
    {
      step: 1,
      title: 'DYNAMIC QUESTION 1 OF 3 (FOUNDATIONAL MASTERY)',
      tag: 'Vector Dimensionality & Density',
      question:
        'Define high-dimensional embedding spaces and analyze how sparsity impacts nearest-neighbor calculation complexity in non-indexed vector search.',
      modelAnswer:
        'High-dimensional spaces suffer from the curse of dimensionality where distances between points converge, drastically reducing contrast. Brute-force kNN requires linear O(N·D) evaluations.',
      rubric: { factual: 10, terminology: 10, clarity: 9.8, edge: 9.5 },
    },
    {
      step: 2,
      title: 'DYNAMIC QUESTION 2 OF 3 (ADAPTIVE DIFFICULTY)',
      tag: 'Vector Distance Formulations',
      question:
        'Explain in your own words how vector embeddings preserve semantic meaning in high-dimensional space and contrast Cosine vs Euclidean distance for normalized embeddings.',
      modelAnswer:
        'Vector embeddings map semantic relationships into high-dimensional geometric coordinates. For unit-normalized vectors, Euclidean distance squared equals 2 - 2*(Cosine Similarity).',
      rubric: { factual: 10, terminology: 10, clarity: 9.0, edge: 9.5 },
    },
    {
      step: 3,
      title: 'DYNAMIC QUESTION 3 OF 3 (EDGE CASE & SCALE DEFENSE)',
      tag: 'Concurrency & Index Mutation',
      question:
        'Under heavy ingestion spikes with concurrent read queries, how do you prevent HNSW graph degradation without degrading recall guarantees?',
      modelAnswer:
        'Decouple insertion pipelines via two-phase buffered staging queues while dynamically adjusting efConstruction and M parameters. Utilize copy-on-write pointer swaps for lock-free read traversals.',
      rubric: { factual: 9.5, terminology: 10, clarity: 9.5, edge: 9.8 },
    },
  ] as DefenseQuestion[],

  notifications: [
    {
      id: 'notif-1',
      title: 'Oral Defense Certification Verified',
      message: 'Alex Rivera passed the Gemini 2.5 Oral Defense for Vector Search Architecture with 96% Distinction. Hash: ALMS-VEC-884920',
      timestamp: '12m ago',
      type: 'defense',
      read: false,
      actionTab: 'oral-defense',
    },
    {
      id: 'notif-2',
      title: 'Ingestion Pipeline Complete',
      message: 'Vector_DB_Architecture.pdf successfully chunked and indexed into 1,248 embeddings using text-embedding-004.',
      timestamp: '45m ago',
      type: 'ingestion',
      read: false,
      actionTab: 'studio',
    },
    {
      id: 'notif-3',
      title: 'Vertex AI Model Synced',
      message: 'Gemini 2.5 Flash instance connected to project vertex-gemini-sandbox-prod in region us-central1.',
      timestamp: '2h ago',
      type: 'system',
      read: true,
      actionTab: 'settings',
    },
    {
      id: 'notif-4',
      title: 'New Module Released',
      message: 'Module 3: Multi-Hop Retrieval Deconstruction is now available in Production Agentic RAG course.',
      timestamp: '5h ago',
      type: 'credential',
      read: true,
      actionTab: 'learning-player',
    },
  ] as NotificationItem[],

  learnerNotes: {} as Record<string, string>,

  skillNodes: [
    {
      id: 'node-py',
      name: 'Python Async & uvloop',
      category: 'infra',
      status: 'mastered',
      percentage: 100,
      x: 30,
      y: 50,
      subtitle: 'Asynchronous event loops & GIL bypassing',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'uvloop custom event loop policy',
        'asyncio.gather() error boundary isolation',
        'SIMD vectorized batch slicing',
      ],
    },
    {
      id: 'node-emb',
      name: 'Text Embeddings (004)',
      category: 'vectors',
      status: 'mastered',
      percentage: 100,
      x: 30,
      y: 220,
      subtitle: 'Vertex AI 1536-dimensional embeddings',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'L2 unit hypersphere normalization',
        'Chunk tokenization windowing (512 tokens)',
        'Cosine vs Dot Product equivalence',
      ],
    },
    {
      id: 'node-cos',
      name: 'Cosine & Euclidean',
      category: 'vectors',
      status: 'mastered',
      percentage: 100,
      x: 230,
      y: 220,
      subtitle: 'Geometric distance metric isomorphism',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'Euclidean distance squared = 2 - 2*cos',
        'Elimination of square-root floating point ops',
        'Unit sphere angle invariance proof',
      ],
    },
    {
      id: 'node-knn',
      name: 'Exact kNN Complexity',
      category: 'vectors',
      status: 'mastered',
      percentage: 100,
      x: 430,
      y: 170,
      subtitle: 'Brute-force O(N*D) cost boundaries',
      threshold: '100 / 100 Pts',
      verifiedList: [
        'Linear memory bandwidth exhaustion limits',
        'Exhaustive dot-product hardware throughput',
        'Cache miss penalties across 250k vectors',
      ],
    },
    {
      id: 'node-hnsw',
      name: 'HNSW Graph Skip-Lists',
      category: 'vectors',
      status: 'in-progress',
      percentage: 75,
      x: 630,
      y: 130,
      subtitle: 'Hierarchical Navigable Small World search',
      threshold: '75 / 100 Pts',
      verifiedList: [
        'efConstruction vs M edge density balance',
        'Dynamic greedy heuristic path pruning',
      ],
      pendingRequirement: 'Complete live speech oral defense on edge case concurrency.',
    },
    {
      id: 'node-pg',
      name: 'pgvector on Cloud SQL',
      category: 'infra',
      status: 'in-progress',
      percentage: 45,
      x: 630,
      y: 270,
      subtitle: 'Relational storage with HNSW index extension',
      threshold: '45 / 100 Pts',
      verifiedList: [
        'CREATE EXTENSION IF NOT EXISTS vector',
        'Hybrid BM25 + pgvector query plan indexing',
      ],
      pendingRequirement: 'Pass oral defense and configure index build workers.',
    },
    {
      id: 'node-pq',
      name: 'Product Quantization (PQ)',
      category: 'vectors',
      status: 'locked',
      percentage: 0,
      x: 820,
      y: 70,
      subtitle: '8-bit vector sub-space codebooks',
      threshold: '0 / 100 Pts',
      verifiedList: [],
      pendingRequirement: 'Prerequisite: Master HNSW Skip-List Graphs.',
    },
    {
      id: 'node-vllm',
      name: 'vLLM & PagedAttention',
      category: 'infra',
      status: 'recommended',
      percentage: 0,
      x: 820,
      y: 250,
      subtitle: 'Non-contiguous KV-cache memory management',
      threshold: '0 / 100 Pts',
      verifiedList: [],
      pendingRequirement: 'Recommended next after Vector DBs 101.',
    },
  ] as SkillNode[],

  corpusVectors: [
    {
      id: 'vec-1',
      title: 'Cosine Distance vs Euclidean Equivalence on Unit Hypersphere',
      category: 'Geometry',
      content: 'When vectors are normalized to ||v|| = 1, Euclidean distance squared equals 2 * (1 - cosine similarity). Thus ranking nearest neighbors by angular similarity avoids square roots.',
      vector: [0.354, 0.412, -0.128, 0.589, 0.021, -0.422, 0.189, 0.375],
    },
    {
      id: 'vec-2',
      title: 'Hierarchical Navigable Small World (HNSW) Skip-Lists',
      category: 'Indexing',
      content: 'Multi-layer graph where upper layers contain sparse long-range express links for logarithmic exploration, and bottom layer 0 contains dense ground-truth nearest neighbors.',
      vector: [0.512, 0.288, 0.045, 0.612, -0.154, -0.312, 0.224, 0.342],
    },
    {
      id: 'vec-3',
      title: 'Google Cloud Vertex AI ScaNN Algorithm (Anisotropic Vector Quantization)',
      category: 'Vertex AI',
      content: 'ScaNN introduces anisotropic loss penalizing parallel component error more than orthogonal error, yielding state-of-the-art MIPS (Maximum Inner Product Search) QPS.',
      vector: [0.621, 0.198, -0.054, 0.542, 0.112, -0.284, 0.312, 0.298],
    },
    {
      id: 'vec-4',
      title: 'Cloud SQL pgvector HNSW vs IVFFlat Topologies',
      category: 'Databases',
      content: 'IVFFlat clusters vectors into Voronoi centroids requiring periodic re-indexing. HNSW maintains incremental graph edges supporting real-time concurrent writes without recall collapse.',
      vector: [0.212, 0.612, -0.312, 0.384, -0.214, -0.482, 0.112, 0.244],
    },
    {
      id: 'vec-5',
      title: 'Gemini Multimodal Embedding Topologies & Text-Embedding-004',
      category: 'Embeddings',
      content: 'Google text-embedding-004 projects arbitrary length code, technical docs, and speech transcripts into a dense 1536-dimensional manifold preserving semantic affinity.',
      vector: [0.442, 0.354, -0.112, 0.498, 0.042, -0.398, 0.212, 0.482],
    },
  ],
};

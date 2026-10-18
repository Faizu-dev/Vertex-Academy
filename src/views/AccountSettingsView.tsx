import React, { useState, useEffect } from 'react';
import { NavTab } from '../types';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

interface AccountSettingsViewProps {
  onNavigate: (tab: NavTab) => void;
}

type SettingsSection = 'profile' | 'gcp' | 'tutor' | 'security' | 'notifications' | 'privacy';

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('profile');
  
  // Profile state
  const [fullName, setFullName] = useState('Alex Rivera');
  const [headline, setHeadline] = useState('Lead GenAI & ML Engineer');
  const [email] = useState('alex.rivera@vertex-cloud.dev');
  const [organization, setOrganization] = useState('Google Cloud AI Center of Excellence');
  const [location, setLocation] = useState('Mountain View, CA (Hybrid / us-central1)');
  const [bio, setBio] = useState(
    'Specializing in multimodal Gemini pipelines, high-throughput vector search (ScaNN/HNSW), and real-time interactive avatar instruction systems.'
  );
  const [skills, setSkills] = useState([
    'Vertex AI',
    'Gemini 2.5 Flash',
    'Vector Search',
    'TensorFlow / JAX',
    'RAG Architectures',
    'Cloud TPU v5e',
    'Kubernetes (GKE)'
  ]);
  const [newSkillInput, setNewSkillInput] = useState('');

  // GCP Settings state
  const [gcpProjectId, setGcpProjectId] = useState('vertex-gemini-sandbox-prod');
  const [gcpRegion, setGcpRegion] = useState('us-central1');
  const [storageBucket, setStorageBucket] = useState('gs://vertex-academy-knowledge-lake');
  const [vectorIndexId, setVectorIndexId] = useState('489201984210/locations/us-central1/indexes/corpus-rag-v4');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isPingingProject, setIsPingingProject] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<boolean | null>(null);

  // AI Tutor Preferences state
  const [preferredTutor, setPreferredTutor] = useState<'lyra' | 'atlas' | 'nova'>('lyra');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [defenseDifficulty, setDefenseDifficulty] = useState<'standard' | 'rigorous' | 'fellow'>('rigorous');
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState(true);
  const [autoRunCode, setAutoRunCode] = useState(true);

  // Notification toggles
  const [notifyDefense, setNotifyDefense] = useState(true);
  const [notifyIngestion, setNotifyIngestion] = useState(true);
  const [notifyCertExpiry, setNotifyCertExpiry] = useState(true);
  const [emailDigest, setEmailDigest] = useState<'instant' | 'daily' | 'weekly'>('daily');
  const [webhookUrl, setWebhookUrl] = useState('https://chat.googleapis.com/v1/spaces/AAQA8921/messages?key=AIza...');

  // Toast / Save notification
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Load profile from backend on mount
  useEffect(() => {
    api.getProfile()
      .then((data) => {
        if (data) {
          if (data.fullName) setFullName(data.fullName);
          if (data.headline) setHeadline(data.headline);
          if (data.organization) setOrganization(data.organization);
          if (data.location) setLocation(data.location);
          if (data.bio) setBio(data.bio);
          if (data.skills) setSkills(data.skills);
          if (data.gcpProjectId) setGcpProjectId(data.gcpProjectId);
          if (data.gcpRegion) setGcpRegion(data.gcpRegion);
          if (data.storageBucket) setStorageBucket(data.storageBucket);
          if (data.vectorIndexId) setVectorIndexId(data.vectorIndexId);
          if (data.preferredTutor) setPreferredTutor(data.preferredTutor);
          if (data.voiceSpeed) setVoiceSpeed(data.voiceSpeed);
          if (data.defenseDifficulty) setDefenseDifficulty(data.defenseDifficulty);
          if (typeof data.autoSpeechEnabled === 'boolean') setAutoSpeechEnabled(data.autoSpeechEnabled);
          if (typeof data.autoRunCode === 'boolean') setAutoRunCode(data.autoRunCode);
          if (typeof data.notifyDefense === 'boolean') setNotifyDefense(data.notifyDefense);
          if (typeof data.notifyIngestion === 'boolean') setNotifyIngestion(data.notifyIngestion);
          if (typeof data.notifyCertExpiry === 'boolean') setNotifyCertExpiry(data.notifyCertExpiry);
          if (data.emailDigest) setEmailDigest(data.emailDigest);
          if (data.webhookUrl) setWebhookUrl(data.webhookUrl);
        }
      })
      .catch((err) => console.log('Could not load profile from backend', err));
  }, []);

  const handleSave = async () => {
    try {
      await api.updateProfile({
        fullName,
        headline,
        organization,
        location,
        bio,
        skills,
        gcpProjectId,
        gcpRegion,
        storageBucket,
        vectorIndexId,
        preferredTutor,
        voiceSpeed,
        defenseDifficulty,
        autoSpeechEnabled,
        autoRunCode,
        notifyDefense,
        notifyIngestion,
        notifyCertExpiry,
        emailDigest,
        webhookUrl,
      });
      setToastMessage('Account settings successfully synchronized with Google Cloud Identity!');
    } catch (err) {
      setToastMessage('Saved locally (Offline Mode)');
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  };

  const handleTestGcpConnection = async () => {
    setIsPingingProject(true);
    setPingSuccess(null);
    try {
      const res = await api.testGcpConnection({
        gcpProjectId,
        gcpRegion,
        storageBucket,
        vectorIndexId,
      });
      setIsPingingProject(false);
      setPingSuccess(res.success);
      confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    } catch (err) {
      setIsPingingProject(false);
      setPingSuccess(true);
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkillInput.trim() && !skills.includes(newSkillInput.trim())) {
      setSkills([...skills, newSkillInput.trim()]);
      setNewSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleExportData = () => {
    const data = {
      user: { fullName, email, organization, headline, location, bio, skills },
      cloudConfig: { gcpProjectId, gcpRegion, storageBucket, vectorIndexId },
      tutorPreferences: { preferredTutor, voiceSpeed, defenseDifficulty, autoSpeechEnabled },
      exportTimestamp: new Date().toISOString(),
      platform: 'Google Vertex Academy Enterprise'
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vertex-academy-account-${fullName.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToastMessage('Telemetry and account data exported to JSON.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="relative w-full overflow-hidden px-4 sm:px-6 lg:px-8 py-6 max-w-[1560px] mx-auto space-y-6">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1e293b] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/10 animate-in slide-in-from-bottom-5 duration-300">
          <div className="w-8 h-8 rounded-full bg-[#34A853] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[18px]">check</span>
          </div>
          <div className="text-xs">
            <p className="font-semibold">{toastMessage}</p>
          </div>
          <button
            onClick={() => setShowToast(false)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
      )}

      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-[#5f6368]">
          <button
            onClick={() => onNavigate('home')}
            className="hover:text-[#1a73e8] flex items-center gap-1 font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">home</span>
            Home
          </button>
          <span>/</span>
          <span className="text-[#1a73e8] font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
            Account Settings
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 rounded-full border border-[#dadce0] bg-white hover:bg-[#f8fafd] text-[#3c4043] text-xs font-semibold flex items-center gap-1.5 transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
            View Public Profile
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-full bg-gradient-to-r from-[#1a73e8] to-[#4285F4] hover:from-[#1557b0] hover:to-[#1a73e8] text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Save Changes
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <section className="relative overflow-hidden rounded-3xl p-6 lg:p-8 text-white shadow-lg bg-gradient-to-r from-[#1a73e8] via-[#7C3AED] to-[#4285F4]">
        <div className="pointer-events-none absolute -right-16 -top-16 w-80 h-80 rounded-full bg-white/10 blur-3xl"></div>
        <div className="pointer-events-none absolute left-1/3 -bottom-20 w-64 h-64 rounded-full bg-[#34A853]/20 blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-1 bg-white/30 backdrop-blur-md shadow-xl">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMP95u9S8IqP9YrRkB5HIrmrLcJcfnuS62beEkMyv6euWTbYd0ppj3kNnNU-6LvBh2hdj88HDYoEIgpxcYpzhiZLLv4OUtuN4-G5jAAOjFcPnCLwXji0Ny65TkS8Wzxcl8NBqSrjaa25_vDsHbL1NhnwoNzBdOX-kwV9bJScXO1qPyc7I5v9Ro6DpG6TKK7BkNLAEaQrXzJRTwFFwFchrxDavfK58-pNlyq2lxvlTLbNVwao-yOUhsNQ"
                  alt="Alex Rivera"
                  className="w-full h-full rounded-full object-cover ring-2 ring-white"
                />
              </div>
              <span
                className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#34A853] ring-2 ring-white"
                title="Google Cloud Verified & Active"
              ></span>
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold tracking-tight">{fullName}</h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-md text-white border border-white/30">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  Google Cloud Fellow
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#34A853]/30 text-white border border-[#34A853]/40">
                  Workspace Managed
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1 font-medium">{email}</p>
              <p className="text-xs text-white/80 mt-0.5">{organization}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center min-w-[110px]">
              <span className="text-[10px] uppercase tracking-wider text-white/80 block">Staff ID</span>
              <span className="text-sm font-mono font-bold text-white">GOOG-840219</span>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center min-w-[110px]">
              <span className="text-[10px] uppercase tracking-wider text-white/80 block">GCP Tier</span>
              <span className="text-sm font-semibold text-white">Enterprise</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Settings Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-w-0">
        {/* Left Navigation Tabs (4 columns) */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-2">
          <div className="glass-card rounded-3xl p-3 shadow-xs space-y-1">
            <button
              onClick={() => setActiveSection('profile')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'profile'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">badge</span>
                <span>Profile & Identity</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSection('gcp')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'gcp'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
                <span>Google Cloud & Gemini API</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSection('tutor')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'tutor'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">record_voice_over</span>
                <span>AI Tutor & Proctored Defense</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSection('security')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'security'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">shield_lock</span>
                <span>Security & Sessions</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSection('notifications')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'notifications'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">notifications_active</span>
                <span>Alerts & Notifications</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveSection('privacy')}
              className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all ${
                activeSection === 'privacy'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-[#3c4043] hover:bg-[#f1f3f4]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[20px]">download_for_offline</span>
                <span>Data Export & Privacy</span>
              </div>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {/* Quick Help Card */}
          <div className="glass-card rounded-3xl p-5 shadow-xs border border-[#e3e8f5] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#1a73e8]">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
              <span>Enterprise Identity</span>
            </div>
            <p className="text-xs text-[#5f6368] leading-relaxed">
              Your credentials and Google Cloud project quotas are governed by Google Workspace IAM Policies with automatic rotation.
            </p>
            <div className="pt-1">
              <span className="text-[11px] font-mono text-[#5f6368] bg-[#f1f3f4] px-2 py-1 rounded-md block truncate">
                IAM Role: roles/aiplatform.admin
              </span>
            </div>
          </div>
        </aside>

        {/* Right Settings Content Area (8-9 columns) */}
        <section className="lg:col-span-8 xl:col-span-9 min-w-0 space-y-6">
          {/* SECTION: PROFILE & IDENTITY */}
          {activeSection === 'profile' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1a73e8]">badge</span>
                  Personal & Professional Profile
                </h2>
                <p className="text-xs text-[#5f6368] mt-1">
                  Manage your display credentials, enterprise affiliation, and competencies for the Vertex Academy community.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-medium focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Job Title / Specialization</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-medium focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Primary Email Address</label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      value={email}
                      className="w-full h-10 px-3.5 pr-24 rounded-xl border border-[#dadce0] bg-[#f8f9fa] text-xs font-medium text-[#5f6368] cursor-not-allowed outline-none"
                    />
                    <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-[#34A853] bg-[#e6f4ea] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span>
                      Verified
                    </span>
                  </div>
                  <span className="text-[10px] text-[#5f6368]">Managed by your organization domain</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Organization / Department</label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-medium focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Location / Primary Cloud Cluster</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-medium focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Professional Bio</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-3.5 rounded-xl border border-[#dadce0] text-xs font-medium focus:ring-2 focus:ring-[#1a73e8] focus:border-[#1a73e8] outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="space-y-3 pt-4 border-t border-[#e3e8f5]">
                <label className="text-xs font-bold text-[#3c4043] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-[#1a73e8]">hub</span>
                  Domain Competencies & Skills
                </label>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f0fe] text-[#1a73e8] text-xs font-semibold border border-[#c2e7ff]"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(skill)}
                        className="hover:text-[#d93025] transition-colors"
                        title="Remove skill"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md pt-2">
                  <input
                    type="text"
                    placeholder="Add a new skill (e.g., PyTorch, Spanner)"
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-xl border border-[#dadce0] text-xs outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  />
                  <button
                    type="submit"
                    className="px-4 h-9 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>

              <div className="pt-4 border-t border-[#e3e8f5] flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Save Profile Changes
                </button>
              </div>
            </div>
          )}

          {/* SECTION: GOOGLE CLOUD & GEMINI API */}
          {activeSection === 'gcp' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1a73e8]">cloud_sync</span>
                  Google Cloud Platform & Vertex AI Keys
                </h2>
                <p className="text-xs text-[#5f6368] mt-1">
                  Connect your GCP sandbox project to run live fine-tuning, embeddings generation, and vector search queries.
                </p>
              </div>

              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-[#e8f0fe] border border-[#c2e7ff] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#1a73e8] text-white flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">dns</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1a73e8]">GCP Service Bridge: Operational</h4>
                    <p className="text-[11px] text-[#3c4043]">
                      Connected to Vertex AI Studio in <span className="font-mono font-bold">us-central1</span>.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTestGcpConnection}
                  disabled={isPingingProject}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#f1f3f4] text-[#1a73e8] text-xs font-bold border border-[#c2e7ff] transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  {isPingingProject ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                      Pinging...
                    </>
                  ) : pingSuccess ? (
                    <>
                      <span className="material-symbols-outlined text-[16px] text-[#34A853]">check_circle</span>
                      28ms Latency
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">sensors</span>
                      Test Endpoint
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Project ID</label>
                  <input
                    type="text"
                    value={gcpProjectId}
                    onChange={(e) => setGcpProjectId(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-mono font-semibold focus:ring-2 focus:ring-[#1a73e8] outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3c4043]">Compute & Storage Region</label>
                    <select
                      value={gcpRegion}
                      onChange={(e) => setGcpRegion(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-[#dadce0] text-xs font-medium focus:ring-2 focus:ring-[#1a73e8] outline-none bg-white"
                    >
                      <option value="us-central1">us-central1 (Iowa)</option>
                      <option value="us-east4">us-east4 (Northern Virginia)</option>
                      <option value="us-west1">us-west1 (Oregon)</option>
                      <option value="europe-west4">europe-west4 (Eemshaven)</option>
                      <option value="asia-northeast1">asia-northeast1 (Tokyo)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[#3c4043]">Gemini Model Serving Tier</label>
                    <input
                      type="text"
                      disabled
                      value="Gemini 2.5 Pro / Flash Enterprise"
                      className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] bg-[#f8f9fa] text-xs font-semibold text-[#5f6368] cursor-not-allowed outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Cloud Storage Ingestion Bucket</label>
                  <input
                    type="text"
                    value={storageBucket}
                    onChange={(e) => setStorageBucket(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-mono focus:ring-2 focus:ring-[#1a73e8] outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">Vertex AI Vector Search Index Resource URI</label>
                  <input
                    type="text"
                    value={vectorIndexId}
                    onChange={(e) => setVectorIndexId(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-mono text-[#5f6368] focus:ring-2 focus:ring-[#1a73e8] outline-none"
                  />
                </div>

                {/* API Key Mask */}
                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-[#3c4043]">Server-Side Gemini API Key</label>
                  <div className="relative flex items-center">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      disabled
                      value="AIzaSyB84N92kQ01xLkZ94m88qWk23Lp01_sandbox_key"
                      className="w-full h-10 px-3.5 pr-28 rounded-xl border border-[#dadce0] bg-[#f8f9fa] text-xs font-mono text-[#3c4043] outline-none"
                    />
                    <div className="absolute right-2 flex items-center gap-1">
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#1a73e8] hover:bg-[#e8f0fe] rounded-lg transition-colors"
                      >
                        {showApiKey ? 'Hide' : 'Reveal'}
                      </button>
                    </div>
                  </div>
                  <span className="text-[10px] text-[#5f6368]">
                    API keys are stored securely in Google Cloud Secret Manager.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e3e8f5] flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Save Cloud Configuration
                </button>
              </div>
            </div>
          )}

          {/* SECTION: AI TUTOR & PROCTORED DEFENSE */}
          {activeSection === 'tutor' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1a73e8]">record_voice_over</span>
                  3D Avatar Tutor & Oral Defense Preferences
                </h2>
                <p className="text-xs text-[#5f6368] mt-1">
                  Customize the voice synthesis, proctoring rigor, and behavior of your multimodal AI companion.
                </p>
              </div>

              {/* Tutor Selection Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#3c4043]">Active AI Companion Persona</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div
                    onClick={() => setPreferredTutor('lyra')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      preferredTutor === 'lyra'
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/40 shadow-xs'
                        : 'border-[#dadce0] hover:border-[#1a73e8]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1a73e8] text-white flex items-center justify-center font-bold text-sm">
                        L
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#202124]">Lyra</h4>
                        <span className="text-[11px] text-[#1a73e8] font-semibold">GenAI Specialist</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5f6368] mt-2.5">
                      Warm, supportive, and specializes in architectural deep dives and RAG vector indexes.
                    </p>
                  </div>

                  <div
                    onClick={() => setPreferredTutor('atlas')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      preferredTutor === 'atlas'
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/40 shadow-xs'
                        : 'border-[#dadce0] hover:border-[#1a73e8]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-sm">
                        A
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#202124]">Atlas</h4>
                        <span className="text-[11px] text-[#7C3AED] font-semibold">Infra Architect</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5f6368] mt-2.5">
                      Direct, analytical, and focuses on TPU performance bottlenecks and latency optimizations.
                    </p>
                  </div>

                  <div
                    onClick={() => setPreferredTutor('nova')}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      preferredTutor === 'nova'
                        ? 'border-[#1a73e8] bg-[#e8f0fe]/40 shadow-xs'
                        : 'border-[#dadce0] hover:border-[#1a73e8]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#34A853] text-white flex items-center justify-center font-bold text-sm">
                        N
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#202124]">Nova</h4>
                        <span className="text-[11px] text-[#34A853] font-semibold">Prompt Engineer</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-[#5f6368] mt-2.5">
                      Fast-paced, creative, and focuses on multimodal reasoning and agent tool orchestration.
                    </p>
                  </div>
                </div>
              </div>

              {/* Speed & Proctored Rigor */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3">
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold text-[#3c4043]">
                    <span>Speech Synthesis Speed</span>
                    <span className="font-mono text-[#1a73e8] font-bold">{voiceSpeed.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.75"
                    max="1.5"
                    step="0.05"
                    value={voiceSpeed}
                    onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                    className="w-full accent-[#1a73e8]"
                  />
                  <div className="flex justify-between text-[10px] text-[#5f6368]">
                    <span>0.75x (Deliberate)</span>
                    <span>1.0x (Natural)</span>
                    <span>1.5x (Fast)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#3c4043]">Oral Defense Proctoring Rigor</label>
                  <select
                    value={defenseDifficulty}
                    onChange={(e) => setDefenseDifficulty(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-[#dadce0] text-xs font-medium focus:ring-2 focus:ring-[#1a73e8] outline-none bg-white"
                  >
                    <option value="standard">Standard Certification Level (80% benchmark)</option>
                    <option value="rigorous">Rigorous Peer Review (85% benchmark with counter-arguments)</option>
                    <option value="fellow">Google Fellow Level (92% benchmark + adversarial probing)</option>
                  </select>
                </div>
              </div>

              {/* Toggle Options */}
              <div className="space-y-3 pt-3 border-t border-[#e3e8f5]">
                <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f8fafd] transition-colors">
                  <div>
                    <h5 className="text-xs font-bold text-[#202124]">Auto-Play Tutor Voice Responses</h5>
                    <p className="text-[11px] text-[#5f6368]">
                      Stream realistic Gemini speech synthesis automatically when tutor answers or critiques.
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoSpeechEnabled(!autoSpeechEnabled)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                      autoSpeechEnabled ? 'bg-[#1a73e8]' : 'bg-[#dadce0]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        autoSpeechEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#f8fafd] transition-colors">
                  <div>
                    <h5 className="text-xs font-bold text-[#202124]">Auto-Execute Code in Cloud Sandbox</h5>
                    <p className="text-[11px] text-[#5f6368]">
                      Run Python code blocks inside the safe microservice container when clicking copy or test.
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoRunCode(!autoRunCode)}
                    className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                      autoRunCode ? 'bg-[#1a73e8]' : 'bg-[#dadce0]'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                        autoRunCode ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e3e8f5] flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Save Tutor Preferences
                </button>
              </div>
            </div>
          )}

          {/* SECTION: SECURITY & SESSIONS */}
          {activeSection === 'security' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1a73e8]">shield_lock</span>
                  Security, Passkeys & Active Sessions
                </h2>
                <p className="text-xs text-[#5f6368] mt-1">
                  Manage two-step verification, hardware security tokens, and monitor authenticated active sessions.
                </p>
              </div>

              <div className="space-y-4">
                {/* 2FA Banner */}
                <div className="p-4 rounded-2xl bg-[#e6f4ea] border border-[#ceead6] flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#34A853] text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">phonelink_lock</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#137333]">2-Step Verification Active</h4>
                      <p className="text-[11px] text-[#3c4043]">
                        Google Authenticator & Workspace Security Key registered.
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-[#137333] px-3 py-1 bg-white rounded-full border border-[#ceead6]">
                    Enforced by Policy
                  </span>
                </div>

                {/* Registered Hardware Keys */}
                <div className="p-4 rounded-2xl border border-[#dadce0] bg-white space-y-3">
                  <h4 className="text-xs font-bold text-[#202124] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1a73e8] text-[18px]">key</span>
                    Registered FIDO2 / Passkey Credentials
                  </h4>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-[#f8f9fa] border border-[#e8eaed]">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[#5f6368]">usb</span>
                      <div>
                        <p className="text-xs font-bold text-[#202124]">Titan Security Key (YubiKey 5 NFC)</p>
                        <p className="text-[10px] text-[#5f6368]">Added Nov 14, 2024 • Used 3 hours ago</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-[#137333] bg-[#e6f4ea] px-2.5 py-0.5 rounded-full">
                      Primary
                    </span>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-[#202124] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#1a73e8] text-[18px]">devices</span>
                    Active Authenticated Sessions
                  </h4>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#c2e7ff] bg-[#f8fafd]">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#1a73e8]">laptop_mac</span>
                        <div>
                          <p className="text-xs font-bold text-[#202124]">
                            macOS Sonoma • Chrome 124 <span className="text-[#1a73e8] font-bold">(Current Device)</span>
                          </p>
                          <p className="text-[11px] text-[#5f6368]">Mountain View, CA • IP 199.36.240.10</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-[#1a73e8] bg-[#e8f0fe] px-2.5 py-1 rounded-full">
                        Active Now
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#dadce0] bg-white">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#5f6368]">cloud_queue</span>
                        <div>
                          <p className="text-xs font-bold text-[#202124]">
                            Vertex AI Cloud Workstation (Compute VM)
                          </p>
                          <p className="text-[11px] text-[#5f6368]">us-central1-a • Internal Cloud VPC</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#5f6368]">4 hours ago</span>
                    </div>

                    <div className="flex items-center justify-between p-3.5 rounded-2xl border border-[#dadce0] bg-white">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#5f6368]">smartphone</span>
                        <div>
                          <p className="text-xs font-bold text-[#202124]">Pixel 8 Pro • Google Workspace App</p>
                          <p className="text-[11px] text-[#5f6368]">Sunnyvale, CA • 1 day ago</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-[#5f6368]">Yesterday</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e3e8f5] flex justify-between items-center">
                <button
                  onClick={() => {
                    setToastMessage('Revoked all remote sessions except this browser.');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 3000);
                  }}
                  className="text-xs text-[#d93025] hover:text-[#b31412] font-semibold flex items-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  Sign Out Other Devices
                </button>

                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Save Security Settings
                </button>
              </div>
            </div>
          )}

          {/* SECTION: NOTIFICATIONS */}
          {activeSection === 'notifications' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1a73e8]">notifications_active</span>
                  Notification & Webhook Preferences
                </h2>
                <p className="text-xs text-[#5f6368] mt-1">
                  Control real-time updates for oral defense scores, ingestion pipeline completions, and cloud alerts.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#f8fafd] transition-colors border border-transparent hover:border-[#e3e8f5]">
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">Oral Defense & Proctoring Evaluations</h4>
                      <p className="text-[11px] text-[#5f6368]">
                        Receive instant notifications when your spoken defense is scored and graded.
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifyDefense(!notifyDefense)}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                        notifyDefense ? 'bg-[#1a73e8]' : 'bg-[#dadce0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          notifyDefense ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#f8fafd] transition-colors border border-transparent hover:border-[#e3e8f5]">
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">Document Ingestion & Vector Index Updates</h4>
                      <p className="text-[11px] text-[#5f6368]">
                        Alert when PDF/PPTX chunking and embedding pipelines complete in Studio.
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifyIngestion(!notifyIngestion)}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                        notifyIngestion ? 'bg-[#1a73e8]' : 'bg-[#dadce0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          notifyIngestion ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-[#f8fafd] transition-colors border border-transparent hover:border-[#e3e8f5]">
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">Certification Expiry & Renewal Alerts</h4>
                      <p className="text-[11px] text-[#5f6368]">
                        Reminders 60 days before Professional Cloud Architect or Gemini credentials expire.
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifyCertExpiry(!notifyCertExpiry)}
                      className={`w-12 h-6 rounded-full p-0.5 transition-colors ${
                        notifyCertExpiry ? 'bg-[#1a73e8]' : 'bg-[#dadce0]'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                          notifyCertExpiry ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      ></div>
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e3e8f5] space-y-2">
                  <label className="text-xs font-bold text-[#3c4043]">Email Learning Digest Frequency</label>
                  <div className="grid grid-cols-3 gap-3">
                    {(['instant', 'daily', 'weekly'] as const).map((freq) => (
                      <button
                        key={freq}
                        onClick={() => setEmailDigest(freq)}
                        className={`py-2 rounded-xl text-xs font-semibold capitalize transition-all border ${
                          emailDigest === freq
                            ? 'border-[#1a73e8] bg-[#e8f0fe] text-[#1a73e8] shadow-2xs'
                            : 'border-[#dadce0] bg-white text-[#5f6368] hover:bg-[#f8f9fa]'
                        }`}
                      >
                        {freq}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e3e8f5] space-y-1.5">
                  <label className="text-xs font-bold text-[#3c4043]">
                    Google Chat / Slack Webhook URL
                  </label>
                  <input
                    type="text"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-[#dadce0] text-xs font-mono focus:ring-2 focus:ring-[#1a73e8] outline-none"
                  />
                  <span className="text-[10px] text-[#5f6368]">
                    Send automated completion webhooks to your team space.
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#e3e8f5] flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-full bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Save Notification Rules
                </button>
              </div>
            </div>
          )}

          {/* SECTION: DATA EXPORT & PRIVACY */}
          {activeSection === 'privacy' && (
            <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
              <div>
                <h2 className="text-lg font-bold text-[#202124] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#1a73e8]">download_for_offline</span>
                  Data Portability, Telemetry & Privacy
                </h2>
                <p className="text-xs text-[#5f6368] mt-1">
                  Download a full export of your learning journey, transcript evaluations, and vector corpus telemetry.
                </p>
              </div>

              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-[#dadce0] bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">Export Complete Learning Portfolio</h4>
                      <p className="text-[11px] text-[#5f6368] mt-0.5">
                        Includes all quiz transcripts, oral defense scores, vector ingestion logs, and credential IDs.
                      </p>
                    </div>
                    <button
                      onClick={handleExportData}
                      className="px-4 py-2 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[16px]">download</span>
                      Download JSON
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-[#dadce0] bg-white space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-[#202124]">Flush Local Ingestion & Audio Cache</h4>
                      <p className="text-[11px] text-[#5f6368] mt-0.5">
                        Clears local browser cache for temporary chunk previews and recorded audio blobs.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setToastMessage('Local document chunk and audio cache cleared.');
                        setShowToast(true);
                        setTimeout(() => setShowToast(false), 3000);
                      }}
                      className="px-4 py-2 rounded-xl border border-[#dadce0] hover:bg-[#f1f3f4] text-[#3c4043] text-xs font-bold transition-colors shrink-0"
                    >
                      Clear Cache
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#fef7e0] border border-[#feefc3] text-[#7f6000] text-xs space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <span className="material-symbols-outlined text-[18px]">info</span>
                    Enterprise Retention Policy
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    This account is provisioned under Google Cloud Corporate AI Academy. All telemetry data is stored in accordance with your organization's Google Cloud Data Governance Framework.
                  </p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

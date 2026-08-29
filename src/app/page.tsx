'use client';

import { useState } from 'react';
import { 
  useUser, 
  SignInButton, 
  UserButton 
} from '@clerk/nextjs';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Zap, 
  Download, 
  User, 
  Crown, 
  Sliders, 
  Loader2,
  RefreshCw,
  Flame
} from 'lucide-react';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  const [activeTab, setActiveTab] = useState<'image' | 'video'>('image');
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [loading, setLoading] = useState(false);
  const [outputUrl, setOutputUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // User Tier State
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [credits, setCredits] = useState(5);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt!');
      return;
    }

    if (credits <= 0 && userTier === 'free') {
      alert('Free credits exhausted! Please upgrade to Pro.');
      return;
    }

    setLoading(true);
    setOutputUrl('');
    setErrorMsg('');

    try {
      const endpoint = activeTab === 'image' ? '/api/generate-image' : '/api/generate-video';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, aspectRatio }),
      });

      const data = await res.json();

      if (res.ok && (data.imageUrl || data.videoUrl)) {
        setOutputUrl(data.imageUrl || data.videoUrl);
        if (userTier === 'free') {
          setCredits((prev) => prev - 1);
        }
      } else {
        setErrorMsg(data.error || 'Generation failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Network error. Check server console.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070712] text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* BACKGROUND ACCENT GLOWS */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* HEADER */}
      <header className="w-full border-b border-purple-900/40 bg-[#0c0c1e]/90 backdrop-blur-xl sticky top-0 z-50 px-8 py-5 flex items-center justify-between shadow-2xl shadow-purple-950/20">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-tr from-amber-400 via-orange-500 to-purple-600 p-3 rounded-2xl shadow-xl shadow-amber-500/25">
            <Sparkles className="w-8 h-8 text-slate-950 stroke-[2.5]" />
          </div>
          <span className="text-3xl font-black tracking-tight bg-gradient-to-r from-amber-300 via-orange-400 to-purple-400 bg-clip-text text-transparent">
            CreatorStack <span className="text-amber-400">AI</span>
          </span>
        </div>

        {/* User Stats & Actions */}
        <div className="flex items-center gap-5">
          <div className="bg-[#12122b] border border-amber-500/40 px-5 py-2.5 rounded-full flex items-center gap-2.5 text-sm font-extrabold text-amber-300 shadow-inner">
            <Zap className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span>{userTier === 'pro' ? 'UNLIMITED' : `${credits} FREE CREDITS`}</span>
          </div>

          {userTier === 'free' ? (
            <button 
              onClick={() => setUserTier('pro')}
              className="flex items-center gap-2.5 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:brightness-110 text-slate-950 text-sm font-black px-6 py-3 rounded-full transition-all shadow-xl shadow-amber-500/30 active:scale-95 cursor-pointer"
            >
              <Crown className="w-5 h-5 fill-slate-950" /> Upgrade Pro
            </button>
          ) : (
            <span className="bg-purple-900/40 border border-purple-500/50 text-purple-300 text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> PRO MEMBER
            </span>
          )}

          {/* CLERK AUTH PROFILE BUTTON */}
          <div className="flex items-center justify-center">
            {!isLoaded ? (
              <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
            ) : isSignedIn ? (
              <UserButton 
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-12 h-12 rounded-2xl border-2 border-amber-400/80 shadow-lg"
                  }
                }}
              />
            ) : (
              <SignInButton mode="modal">
                <button className="flex items-center gap-2 bg-[#12122b] hover:bg-purple-950/40 border border-purple-500/40 px-5 py-2.5 rounded-2xl text-amber-300 font-extrabold text-sm transition shadow-lg cursor-pointer">
                  <User className="w-5 h-5" /> Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="flex-1 max-w-[1500px] w-full mx-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 relative z-10">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-5 flex flex-col gap-8 bg-[#0f0f24]/90 border border-purple-800/30 p-8 rounded-[32px] backdrop-blur-2xl shadow-2xl shadow-black/80">
          
          {/* TAB SWITCHER */}
          <div className="grid grid-cols-2 p-2 bg-[#070712] rounded-2xl border border-purple-800/30">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center justify-center gap-3 py-4 rounded-xl font-black text-base transition-all ${
                activeTab === 'image'
                  ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/30'
                  : 'text-slate-400 hover:text-amber-300'
              }`}
            >
              <ImageIcon className="w-5 h-5" /> AI Image
            </button>

            <button
              onClick={() => setActiveTab('video')}
              className={`flex items-center justify-center gap-3 py-4 rounded-xl font-black text-base transition-all ${
                activeTab === 'video'
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/30'
                  : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              <Video className="w-5 h-5" /> AI Video
            </button>
          </div>

          {/* PROMPT AREA */}
          <div className="flex flex-col gap-3">
            <label className="text-base font-black text-amber-400 tracking-wider flex items-center justify-between uppercase">
              <span>Prompt Text</span>
              <span className="text-slate-400 text-xs font-medium lowercase"></span>
            </label>
            <textarea
              rows={10}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={
                activeTab === 'image'
                  ? 'Describe the visual scene in detail...'
                  : 'Describe motion, camera movement, and video action...'
              }
              className="w-full min-h-[220px] bg-[#070712] border border-purple-800/40 focus:border-amber-400 rounded-2xl p-5 text-xl text-slate-100 placeholder-slate-500 focus:outline-none transition shadow-inner leading-relaxed"
            />
          </div>

          {/* ASPECT RATIO */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-black text-amber-400 tracking-wider flex items-center gap-2 uppercase">
              <Sliders className="w-4 h-4" /> Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['1:1', '16:9', '9:16'].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`py-4 rounded-2xl border text-sm font-black transition-all ${
                    aspectRatio === ratio
                      ? 'border-amber-400 bg-amber-400/15 text-amber-300 shadow-md shadow-amber-500/20'
                      : 'border-purple-800/30 bg-[#070712] text-slate-400 hover:border-purple-600 hover:text-slate-200'
                  }`}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          {/* GENERATE BUTTON */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-base uppercase tracking-wider flex items-center justify-center gap-3 transition-all shadow-2xl active:scale-95 cursor-pointer ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 hover:brightness-110 shadow-amber-500/30'
                : 'bg-gradient-to-r from-purple-500 via-indigo-600 to-purple-600 text-white hover:brightness-110 shadow-purple-500/30'
            } disabled:opacity-50`}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-current" />
                Generating {activeTab === 'image' ? 'Image...' : 'Video...'}
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 fill-current" />
                Generate {activeTab === 'image' ? 'AI Image' : 'AI Video'}
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-5 bg-red-500/10 border border-red-500/40 rounded-2xl text-red-400 text-sm font-semibold">
              {errorMsg}
            </div>
          )}
        </div>

        {/* RIGHT PANEL (OUTPUT CANVAS) */}
        <div className="lg:col-span-7 bg-[#0f0f24]/90 border border-purple-800/30 rounded-[32px] p-8 flex flex-col items-center justify-center min-h-[550px] relative overflow-hidden backdrop-blur-2xl shadow-2xl shadow-black/80">
          
          {loading && (
            <div className="flex flex-col items-center gap-5 text-amber-400">
              <Loader2 className="w-14 h-14 text-amber-400 animate-spin" />
              <p className="text-base font-extrabold tracking-wide animate-pulse">Rendering high quality content...</p>
            </div>
          )}

          {!loading && !outputUrl && (
            <div className="flex flex-col items-center text-center gap-4 text-slate-500 max-w-md">
              <div className="w-24 h-24 rounded-3xl bg-[#070712] border border-purple-800/40 flex items-center justify-center shadow-inner">
                <Sparkles className="w-12 h-12 text-amber-400/70" />
              </div>
              <h3 className="text-amber-300 font-extrabold text-2xl">Canvas Ready</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Configure your options on the left and click generate to create AI visual content here.
              </p>
            </div>
          )}

          {!loading && outputUrl && (
            <div className="w-full h-full flex flex-col items-center justify-center gap-6">
              {activeTab === 'image' ? (
                <img
                  src={outputUrl}
                  alt="AI Output"
                  className="max-h-[550px] w-auto rounded-3xl shadow-2xl border border-amber-500/40 object-contain ring-1 ring-amber-500/20"
                />
              ) : (
                <video
                  src={outputUrl}
                  controls
                  autoPlay
                  loop
                  className="max-h-[550px] w-auto rounded-3xl shadow-2xl border border-purple-500/40 object-contain ring-1 ring-purple-500/20"
                />
              )}

              <div className="flex items-center gap-4">
                <a
                  href={outputUrl}
                  download={`creatorstack-${Date.now()}`}
                  className="flex items-center gap-2.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:brightness-110 text-slate-950 text-sm font-extrabold px-6 py-3.5 rounded-2xl transition shadow-lg shadow-amber-500/20"
                >
                  <Download className="w-5 h-5" /> Download Result
                </a>
                <button
                  onClick={handleGenerate}
                  className="flex items-center gap-2.5 bg-[#070712] hover:bg-purple-950/40 text-purple-300 text-sm font-extrabold px-6 py-3.5 rounded-2xl border border-purple-800/50 transition"
                >
                  <RefreshCw className="w-5 h-5" /> Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
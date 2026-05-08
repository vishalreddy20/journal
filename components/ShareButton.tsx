'use client';

import { useState } from 'react';

interface ShareButtonProps {
  auditId: string | null;
  monthlySavings: number;
}

export default function ShareButton({ auditId, monthlySavings }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  if (!auditId) return null;

  const shareUrl = `${window.location.origin}/audit/${auditId}`;
  const tweetText = `I just found $${Math.round(monthlySavings)}/month in AI tool savings with @SpendLens — run your free audit:`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('input');
      el.value = shareUrl;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="glow-card p-6">
      <h3 className="font-semibold text-white mb-1">Share this audit</h3>
      <p className="text-slate-500 text-xs mb-4">
        Company name and email are not included in the public link.
      </p>

      <div className="flex items-center gap-2 p-3 bg-slate-800/60 rounded-lg mb-4 text-sm overflow-hidden">
        <span className="text-slate-500 truncate flex-1 font-mono text-xs">{shareUrl}</span>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleCopy}
          className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
            copied
              ? 'bg-green-400/20 border border-green-400 text-green-400'
              : 'btn-ghost'
          }`}
          aria-label="Copy shareable audit link to clipboard"
          id="copy-link-btn"
        >
          {copied ? '✓ Copied!' : '📋 Copy Link'}
        </button>

        <a
          href={twitterUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost py-2.5 px-4 text-sm font-medium no-underline"
          aria-label="Share audit results on Twitter"
          id="share-twitter-btn"
        >
          𝕏 Share
        </a>
      </div>
    </div>
  );
}

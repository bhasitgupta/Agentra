import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Agentra — AI Agent Marketplace. Pay Only for Results.',
  description:
    'Discover AI services. Pay in USDC. Charged only when it works. Cryptographic proof on Avalanche.',
};

const extensionInterceptor = `(function() {
  if (typeof window === 'undefined') return;

  // 1. Intercept console.error to eliminate extension & bis_skin_checked hydration warnings
  var origConsoleError = console.error;
  console.error = function() {
    var str = '';
    for (var i = 0; i < arguments.length; i++) {
      try { str += ' ' + (typeof arguments[i] === 'object' ? JSON.stringify(arguments[i]) : arguments[i]); } catch(e) {}
    }
    if (
      str.indexOf('bis_skin_checked') !== -1 ||
      str.indexOf('chrome-extension://') !== -1 ||
      str.indexOf('M_ID') !== -1
    ) {
      return;
    }
    return origConsoleError.apply(console, arguments);
  };

  // 2. Intercept window.onerror completely for browser extensions
  var origOnError = window.onerror;
  window.onerror = function(msg, url, line, col, error) {
    var source = (url || '') + '';
    var message = (msg || '') + '';
    var stack = (error && error.stack) ? error.stack : '';
    if (
      source.indexOf('chrome-extension://') !== -1 ||
      source.indexOf('moz-extension://') !== -1 ||
      message.indexOf('M_ID') !== -1 ||
      message.indexOf('bis_skin_checked') !== -1 ||
      stack.indexOf('chrome-extension://') !== -1 ||
      stack.indexOf('M_ID') !== -1
    ) {
      return true; // suppresses Next.js error overlay completely
    }
    if (origOnError) return origOnError.apply(this, arguments);
    return false;
  };

  // 3. Capture-phase error listener (runs before Next dev overlay)
  window.addEventListener('error', function(e) {
    var f = (e && e.filename) || '';
    var m = (e && e.message) ? e.message + '' : '';
    var s = (e && e.error && e.error.stack) ? e.error.stack : '';
    if (
      f.indexOf('chrome-extension://') !== -1 ||
      f.indexOf('moz-extension://') !== -1 ||
      m.indexOf('M_ID') !== -1 ||
      m.indexOf('bis_skin_checked') !== -1 ||
      s.indexOf('chrome-extension://') !== -1 ||
      s.indexOf('M_ID') !== -1
    ) {
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      if (e.preventDefault) e.preventDefault();
      return true;
    }
  }, true);

  // 4. Capture-phase unhandled promise rejections from extensions
  window.addEventListener('unhandledrejection', function(e) {
    var r = e && e.reason;
    var msg = (r && (r.stack || r.message)) ? (r.stack || r.message) : (r + '');
    if (msg.indexOf('chrome-extension://') !== -1 || msg.indexOf('M_ID') !== -1) {
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      if (e.preventDefault) e.preventDefault();
    }
  }, true);

  // 5. Block bis_skin_checked DOM mutation and attribute injection
  try {
    var origSet = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, val) {
      if (name === 'bis_skin_checked') return;
      return origSet.apply(this, arguments);
    };
    Object.defineProperty(Element.prototype, 'bis_skin_checked', {
      set: function() {},
      get: function() { return undefined; },
      configurable: true
    });
  } catch(e) {}

  try {
    new MutationObserver(function(mutations) {
      mutations.forEach(function(m) {
        if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked' && m.target && m.target.removeAttribute) {
          m.target.removeAttribute('bis_skin_checked');
        }
      });
    }).observe(document.documentElement, {
      subtree: true,
      attributes: true,
      attributeFilter: ['bis_skin_checked']
    });
  } catch(e) {}
})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: extensionInterceptor }} />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col bg-[#081919] text-[#F4F6F4] selection:bg-[#CE1A1E] selection:text-[#FFFFFF] font-sans"
      >
        <Providers>
          <Navbar />
          <main className="flex-1 w-full flex flex-col">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

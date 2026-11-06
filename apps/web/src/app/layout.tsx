import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers/Providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'Agentra — The Marketplace Where Agents Pay Only for Results',
  description:
    'Discover AI services. Pay in USDC. Trust what you can verify on Avalanche. Pay-on-success cryptographic escrow protocol for autonomous agents.',
};

const extensionInterceptorScript = `
(function() {
  try {
    if (typeof Element !== 'undefined') {
      var origSetAttr = Element.prototype.setAttribute;
      Element.prototype.setAttribute = function(name, val) {
        if (name === 'bis_skin_checked') return;
        return origSetAttr.apply(this, arguments);
      };
      Object.defineProperty(Element.prototype, 'bis_skin_checked', {
        set: function() {},
        get: function() { return undefined; },
        configurable: true,
      });
    }
  } catch (e) {}

  try {
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(function(mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.type === 'attributes' && m.attributeName === 'bis_skin_checked' && m.target && m.target.removeAttribute) {
            m.target.removeAttribute('bis_skin_checked');
          }
        }
      });
      observer.observe(document.documentElement, { subtree: true, attributes: true, attributeFilter: ['bis_skin_checked'] });
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    window.addEventListener('error', function(event) {
      var filename = (event && event.filename) || '';
      var message = (event && event.message ? event.message : '') + '';
      var stack = (event && event.error && event.error.stack) ? event.error.stack : '';
      if (
        filename.indexOf('chrome-extension://') !== -1 ||
        filename.indexOf('executors') !== -1 ||
        message.indexOf('M_ID') !== -1 ||
        message.indexOf('bis_skin_checked') !== -1 ||
        stack.indexOf('chrome-extension://') !== -1 ||
        stack.indexOf('M_ID') !== -1
      ) {
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        if (event.preventDefault) event.preventDefault();
        return true;
      }
    }, true);

    window.addEventListener('unhandledrejection', function(event) {
      var reason = event && event.reason;
      var msg = (reason && (reason.stack || reason.message)) ? (reason.stack || reason.message) : (reason + '');
      if (
        msg.indexOf('chrome-extension://') !== -1 ||
        msg.indexOf('M_ID') !== -1 ||
        msg.indexOf('bis_skin_checked') !== -1
      ) {
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        if (event.preventDefault) event.preventDefault();
      }
    }, true);

    var origConsoleError = console.error;
    console.error = function() {
      var fullText = '';
      for (var i = 0; i < arguments.length; i++) {
        var a = arguments[i];
        fullText += ' ' + (a && a.stack ? a.stack : (typeof a === 'object' ? JSON.stringify(a) : a));
      }
      if (
        fullText.indexOf('bis_skin_checked') !== -1 ||
        fullText.indexOf('chrome-extension://') !== -1 ||
        fullText.indexOf('M_ID') !== -1
      ) {
        return;
      }
      return origConsoleError.apply(console, arguments);
    };
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: extensionInterceptorScript,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col bg-[#07070F] text-[#F1F0FF] selection:bg-[#2E1065] selection:text-[#F1F0FF] font-sans"
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

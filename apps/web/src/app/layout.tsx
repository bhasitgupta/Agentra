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

const extensionInterceptor = `(function(){try{var o=Element.prototype.setAttribute;Element.prototype.setAttribute=function(n,v){if(n==='bis_skin_checked')return;return o.apply(this,arguments)};Object.defineProperty(Element.prototype,'bis_skin_checked',{set:function(){},get:function(){return undefined},configurable:true})}catch(e){}try{new MutationObserver(function(ms){ms.forEach(function(m){if(m.type==='attributes'&&m.attributeName==='bis_skin_checked'&&m.target&&m.target.removeAttribute)m.target.removeAttribute('bis_skin_checked')})}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['bis_skin_checked']})}catch(e){}if(typeof window!=='undefined'){window.addEventListener('error',function(e){var f=(e&&e.filename)||'';var m=(e&&e.message?e.message:''+'');if(f.indexOf('chrome-extension://')!==-1||m.indexOf('M_ID')!==-1||m.indexOf('bis_skin_checked')!==-1){if(e.stopImmediatePropagation)e.stopImmediatePropagation();if(e.preventDefault)e.preventDefault();return true}},true);window.addEventListener('unhandledrejection',function(e){var r=e&&e.reason;var msg=r&&(r.stack||r.message)?r.stack||r.message:r+'';if(msg.indexOf('chrome-extension://')!==-1||msg.indexOf('M_ID')!==-1){if(e.stopImmediatePropagation)e.stopImmediatePropagation();if(e.preventDefault)e.preventDefault()}},true)}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: extensionInterceptor }} />
      </head>
      <body
        suppressHydrationWarning
        className="antialiased min-h-screen flex flex-col bg-[#000000] text-[#FFFFFF] selection:bg-[#6D001A] selection:text-[#FFFFFF] font-sans"
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

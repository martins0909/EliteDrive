import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function SmartsuppChat() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (isAdmin) return;

    const existing = document.getElementById('smartsupp-script');
    if (existing) return;

    const script = document.createElement('script');
    script.id = 'smartsupp-script';
    script.type = 'text/javascript';
    script.innerHTML = `
      var _smartsupp = _smartsupp || {};
      _smartsupp.key = '600bfac9d92c20e129683cf9ce5d79cd63c0a0bd';
      window.smartsupp||(function(d) {
        var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
        s=d.getElementsByTagName('script')[0];c=d.createElement('script');
        c.type='text/javascript';c.charset='utf-8';c.async=true;
        c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
      })(document);
    `;
    document.body.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.id = 'smartsupp-noscript';
    noscript.innerHTML = 'Powered by <a href="https://www.smartsupp.com" target="_blank">Smartsupp</a>';
    document.body.appendChild(noscript);

    return () => {
      script.remove();
      noscript.remove();
    };
  }, [isAdmin]);

  return null;
}

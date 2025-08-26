import React from 'react'

/**
 * Körs i <head> före hydration. Sätter korrekt theme-klass utan FOUC.
 */
export function SafeThemeScript() {
  const js = `(function(){
    try {
      var key='pt-theme';
      var t=localStorage.getItem(key);
      if (t==='dark') { document.documentElement.classList.add('dark'); }
      else { document.documentElement.classList.remove('dark'); }
    } catch(e){}
  })();`;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}



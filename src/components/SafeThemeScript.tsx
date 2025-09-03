import React from 'react'

/**
 * Körs i <head> före hydration. Sätter korrekt theme-klass utan FOUC.
 */
export function SafeThemeScript() {
  const js = `(function(){
    try {
      // Lock light theme for demo
      var key='pt-theme';
      localStorage.setItem(key,'light');
      document.documentElement.classList.remove('dark');
    } catch(e){}
  })();`;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: js }} />
}



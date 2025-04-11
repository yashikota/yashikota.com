declare module 'html-parser-lite' {
  export function parse(html: string): {
    querySelectorAll: (selector: string) => Array<{
      getAttribute: (name: string) => string | null;
      textContent: string | null;
    }>;
    querySelector: (selector: string) => {
      getAttribute: (name: string) => string | null;
      textContent: string | null;
    } | null;
  };
}

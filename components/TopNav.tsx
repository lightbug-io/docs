import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function TopNav({children}) {
  return (
    <nav>
      <a href="https://lightbug.io" id="logo" target="blank">
        <Image src="https://lightbug.io/images/logo-orange_hudcdce2ead9cbe2715b5cf652e648439f_53864_17x30_fit_q95_h2_box_3.webp" alt="Logo" width={17} height={30}/>
        <span id="logo-text">Lightbug</span>
      </a>
      <Link href="/" className="flex">
        Overview
      </Link>
      <Link href="/docs/introduction" className="flex">
        Documentation
      </Link>
      <Link href="https://api.lightbug.cloud/docs/" className="flex" target='blank'>
        API Reference
      </Link>
      <Link href="/examples" className="flex">
        Examples
      </Link>
      <Link href="/sdk" className="flex">
        SDKs
      </Link>
      <section>{children}</section>
      <style jsx>
        {`
          nav {
            top: 0;
            position: fixed;
            width: 100%;
            z-index: 100;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            gap: 1rem;
            padding: 1rem 2rem;
            background: white;
            border-bottom: 1px solid var(--border-color);
          }
          nav :global(a) {
            text-decoration: none;
          }
          section {
            display: flex;
            gap: 1rem;
            padding: 0;
          }
          #logo {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-right: 1rem;
          }
          #logo-text {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary-color);
          }
        `}
      </style>
    </nav>
  );
}

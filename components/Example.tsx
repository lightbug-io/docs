import * as React from 'react';

export function Example({ title, href, children }) {
  return (
    <div className="example">
      <a href={href} className="example-title-link" target="_blank"><strong className="example-title">{title}</strong></a>
      <span>{children}</span>
      <style jsx>
        {`
          .example {
            display: flex;
            flex-direction: column;
            padding: 12px 16px;
            background: #f6f9fc;
            border: 1px solid #dce6e9;
            border-radius: 4px;
            margin: 25px 0;
          }
          .example :global(p) {
            margin: 0;
          }
          .example-title-link {
            text-decoration: none;
          }
          .example-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: var(--primary-color);
          }
        `}
      </style>
    </div>
  );
}

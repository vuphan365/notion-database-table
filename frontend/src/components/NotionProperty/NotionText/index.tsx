import * as React from 'react';

import { Decoration } from 'notion-types';

const NotionText: React.FC<{
  value: Decoration[];
}> = ({ value }) => (
  <React.Fragment>
    {value?.map(([text, decorations], index) => {
      if (!decorations) {
        if (text === ',') {
          return <span key={index} style={{ padding: '0.5em' }} />;
        } else {
          return <React.Fragment key={index}>{text}</React.Fragment>;
        }
      }

      const formatted = decorations.reduce(
        (element: React.ReactNode, decorator) => {
          switch (decorator[0]) {
            case 'h':
              return (
                <span className={`notion-${decorator[1]}`}>{element}</span>
              );

            case 'c':
              return <code className="notion-inline-code">{element}</code>;

            case 'b':
              return <b>{element}</b>;

            case 'i':
              return <em>{element}</em>;

            case 's':
              return <s>{element}</s>;

            case '_':
              return (
                <span className="notion-inline-underscore">{element}</span>
              );

            case 'a': {
              const v = decorator[1];

              return (
                <a
                  className="notion-link"
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {element}
                </a>
              );
            }

            default:
              return element;
          }
        },
        <>{text}</>
      );

      return <React.Fragment key={index}>{formatted}</React.Fragment>;
    })}
  </React.Fragment>
);

export default NotionText;

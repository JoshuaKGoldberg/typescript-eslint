import React, { useEffect, useState } from 'react';

import styles from './ASTViewer.module.css';
import PropertyValue from './PropertyValue';

export interface HiddenItemProps {
  readonly isArray?: boolean;
  readonly level: string;
  readonly value: [string, unknown][];
}

export default function HiddenItem({
  isArray,
  level,
  value,
}: HiddenItemProps): React.JSX.Element {
  const [isComplex, setIsComplex] = useState<boolean>(true);
  const [length, setLength] = useState<number>(0);

  useEffect(() => {
    if (isArray) {
      const filtered = value.filter(([key]) => !isNaN(Number(key)));
      setIsComplex(filtered.some(([, item]) => typeof item !== 'number'));
      setLength(filtered.length);
    }
  }, [value, isArray]);

  return (
    <span className={styles.hidden}>
      {isArray && !isComplex ? (
        value.map(([, item], index) => (
          <span key={`${level}_[${index}]`}>
            {index > 0 && ', '}
            <PropertyValue value={item} />
          </span>
        ))
      ) : isArray ? (
        <>
          {length} {length === 1 ? 'element' : 'elements'}
        </>
      ) : (
        value.map(([key], index) => (
          <span key={`${level}_[${index}]`}>
            {index > 0 && ', '}
            {key}
          </span>
        ))
      )}
    </span>
  );
}

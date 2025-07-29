import React from 'react';

// HOC để memoize các component
const withMemo = (Component) => {
  return React.memo(Component);
};

export default withMemo;

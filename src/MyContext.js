// MyContext.js
import React from 'react';

const MyContext = React.createContext({
  search: false,
  setSearch: () => {},
  setSelectedKeys: () => {}, // Add setSelectedKeys to the context
});

export default MyContext;
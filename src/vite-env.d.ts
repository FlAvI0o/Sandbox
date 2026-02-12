/// <reference types="vite/client" />

// This allows you to import .glsl files as strings
declare module '*.glsl' {
  const value: string;
  export default value;
}
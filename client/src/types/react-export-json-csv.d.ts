declare module 'react-export-json-csv' {
    import * as React from 'react';
  
    export interface ExportJsonCsvProps {
      headers: { key: string; name: string }[];
      items: any[];       // use `items` instead of `data` if the component expects it
      fileTitle?: string; // note you use fileTitle instead of filename
      style?: React.CSSProperties;
      children?: React.ReactNode; // <-- add this line
    }
  
    export const ExportJsonCsv: React.FC<ExportJsonCsvProps>;
  }
  
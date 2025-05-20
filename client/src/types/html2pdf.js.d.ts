declare module 'html2pdf.js' {
    interface Html2PdfOptions {
      margin?: number | [number, number, number, number];
      filename?: string;
      image?: { type?: string; quality?: number };
      html2canvas?: any;
      jsPDF?: any;
      pagebreak?: any;
      enableLinks?: boolean;
      // add more as needed
    }
  
    interface Html2PdfInstance {
      set(options: Html2PdfOptions): Html2PdfInstance;
      from(element: HTMLElement | string): Html2PdfInstance;
      toPdf(): Html2PdfInstance;
      save(): Promise<void>;
      outputPdf(): Promise<Blob>;
      outputImg(): Promise<string>;
      outputPdfObj(): Promise<any>;
    }
  
    function html2pdf(): Html2PdfInstance;
    export default html2pdf;
  }
  
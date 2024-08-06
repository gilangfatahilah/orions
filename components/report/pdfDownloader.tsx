import dynamic from 'next/dynamic';

const PDFDownloadLink = dynamic(() => import('@react-pdf/renderer').then(mod => mod.PDFDownloadLink), { ssr: false });

export default PDFDownloadLink;
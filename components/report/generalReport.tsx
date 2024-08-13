/* eslint-disable jsx-a11y/alt-text */
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';

export interface ReportItem {
  name: string;
  startStock: number;
  stockIn: number;
  stockOut: number;
  finalStock: number;
  price: string;
  totalPrice: string;
}

interface ReportDocumentProps {
  data: ReportItem[];
  period: string;
  user: string;
  date: string;
}

Font.register({
  family: 'Roboto',
  src: '/fonts/roboto/Roboto-Bold.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'Open Sans',
  src: '/fonts/open-sans/OpenSans-Bold.ttf',
  fontWeight: 'bold',
});

Font.register({
  family: 'Roboto',
  src: '/fonts/roboto/Roboto-Regular.ttf',
});

Font.register({
  family: 'Open Sans',
  src: '/fonts/open-sans/OpenSans-Regular.ttf',
});

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: 'Open Sans',
  },
  header: {
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottom: '1px solid #000',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  company: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  companyInfo: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  companyTagline: {
    fontSize: 10,
    color: '#555',
  },
  reportTitle: {
    fontFamily: 'Roboto',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  reportPeriod: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  table: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    borderRadius: 5,
    marginBottom: 20,
    borderCollapse: 'collapse',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '14.28%',
    borderWidth: 0,
    backgroundColor: '#f7f7f7',
    padding: 5,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 10,
    color: '#333',
  },
  tableCol: {
    width: '14.28%',
    borderWidth: 0,
    padding: 5,
    textAlign: 'center',
    fontSize: 10,
    color: '#333',
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    gap: 60,
    marginTop: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#555',
  },
});

// Create Document Component
const ReportDocument: React.FC<ReportDocumentProps> = ({ data, period, user, date }) => (
  <Document>
    <Page size="A4" style={styles.page} orientation="landscape">
      <View style={styles.header}>
        <View style={styles.company}>
          <Image
            style={styles.logo}
            src="https://utfs.io/f/31073a3a-15a6-4325-9dd1-fa8ecc05257a-1r46yt.png"
          />
          <View style={styles.companyInfo}>
            <Text style={styles.companyName}>Orion Inv.</Text>
            <Text style={styles.companyTagline}>Baker street 221B, London UK, 1999</Text>
          </View>
        </View>
      </View>
      <Text style={styles.reportTitle}>GENERAL MONTHLY REPORT</Text>
      <Text style={styles.reportPeriod}>{period}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>NAME</Text>
          <Text style={styles.tableColHeader}>START MONTH STOCK</Text>
          <Text style={styles.tableColHeader}>STOCK IN</Text>
          <Text style={styles.tableColHeader}>STOCK OUT</Text>
          <Text style={styles.tableColHeader}>END MONTH STOCK</Text>
          <Text style={styles.tableColHeader}>PRICE VALUE</Text>
          <Text style={styles.tableColHeader}>TOTAL PRICE VALUE</Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCol}>{item.name}</Text>
            <Text style={styles.tableCol}>{item.startStock}</Text>
            <Text style={styles.tableCol}>{item.stockIn}</Text>
            <Text style={styles.tableCol}>{item.stockOut}</Text>
            <Text style={styles.tableCol}>{item.finalStock}</Text>
            <Text style={styles.tableCol}>{item.price}</Text>
            <Text style={styles.tableCol}>{item.totalPrice}</Text>
          </View>
        ))}
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>{date}</Text>
        <Text style={styles.footerText}>{user}</Text>
      </View>
    </Page>
  </Document>
);

export default ReportDocument;

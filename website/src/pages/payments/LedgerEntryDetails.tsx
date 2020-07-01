import React from 'react';
import { ILedgerEntry } from '../../model/LedgerEntry';

interface LedgerEntryDetailsProps {
  entry: ILedgerEntry;
}

export class LedgerEntryDetails extends React.Component<LedgerEntryDetailsProps> {
  render() {
    return <div>LedgerEntryDetails</div>;
  }
}

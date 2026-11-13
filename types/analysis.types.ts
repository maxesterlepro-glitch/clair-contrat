export interface RedAlert {
  id: string;
  title: string;
  exactQuote: string;
  explanation: string;
  legalReference: string;
}

export interface OrangePriceAlert {
  id: string;
  item: string;
  quotedPrice: string;
  marketAveragePrice: string;
  overchargePercentage: string;
  explanation: string;
}

export interface ContractAnalysisResult {
  documentTitle: string;
  documentCategory: string;
  trustScore: number;
  summaryPoints: string[];
  redAlerts: RedAlert[];
  orangePriceAlerts: OrangePriceAlert[];
  counterAttack: {
    subject: string;
    emailBody: string;
    recommendedLetterBody: string;
  };
}

// Literature evidence for the Executive Dashboard, retrieved from the local
// engel-curves corpus (corpus_query over ~/Documents/zk-data/corpus-mcp/engel-curves/engel-curves.db).
// Quotes are verbatim from the source text; line-break hyphenation in the PDF
// extraction ("pur- chase") is joined for display. Verified by scripts/verify-citations.mjs.

export type SupportLevel = 'supported' | 'partial' | 'gap';

export interface LiteratureSource {
  key: string;
  citation: string;
}

export interface EvidenceItem {
  id: number;
  claim: string;
  support: SupportLevel;
  quote: string | null;
  sourceKey: string | null;
  chunkRef: string | null;
  note: string;
}

export const literatureSources: LiteratureSource[] = [
  {
    key: 'osadchiy2013',
    citation:
      'Osadchiy, N., Gaur, V. & Seshadri, S. (2013). Sales Forecasting with Financial Indicators and Experts\u2019 Input. Production and Operations Management, 22(5), 1056\u20131076. doi:10.1111/poms.12022',
  },
  {
    key: 'aitsahalia2004',
    citation:
      'A\u00eft-Sahalia, Y., Parker, J. A. & Yogo, M. (2004). Luxury Goods and the Equity Premium. The Journal of Finance, 59(6), 2959\u20133004.',
  },
  {
    key: 'singh2021',
    citation:
      'Singh, B. (2021). Housing and stock market wealth effects in developing economies. International Economics and Economic Policy. doi:10.1007/s10368-021-00510-9',
  },
  {
    key: 'caporale2011',
    citation:
      'Caporale, G. M. & Sousa, R. M. (2011). Consumption, Wealth, Stock and Housing Returns: Evidence from Emerging Markets. DIW Discussion Papers, No. 1159, DIW Berlin.',
  },
];

export const evidenceItems: EvidenceItem[] = [
  {
    id: 1,
    claim: 'The share of spending on discretionary goods rises with income (the Engel relationship the dashboard is built on).',
    support: 'supported',
    quote:
      'Engel, in the 19th century, first observed that the proportion of income spent on discretionary purchase goods, such as luxury goods, increases with income.',
    sourceKey: 'osadchiy2013',
    chunkRef: 'corpus:engel-curves::utf8-6f73616463686979323031332e7064662e747874:21',
    note: 'Direct statement of the Engel relationship, citing Banks, Blundell & Lewbel (1997) for modern estimates.',
  },
  {
    id: 2,
    claim: 'In theory, at low total expenditure households buy basic goods only, and the luxury share grows as expenditure grows.',
    support: 'partial',
    quote:
      'households consume only basic goods at low levels of total expenditures, while the share of luxury goods in overall consumption rises with expenditures.',
    sourceKey: 'aitsahalia2004',
    chunkRef: 'corpus:engel-curves::utf8-4c757875617279676f6f64732e7064662e747874:3',
    note: 'Model prediction, not an empirical estimate. Supports the existence of a switching point, not its dollar value.',
  },
  {
    id: 3,
    claim: 'The switching point sits at $15,000 per capita (PPP, constant 2021 international $).',
    support: 'gap',
    quote: null,
    sourceKey: null,
    chunkRef: null,
    note: 'No passage in the corpus states an income threshold in dollars. The $15,000 level is an analyst judgment applied to World Bank data and should be read as [JDG].',
  },
  {
    id: 4,
    claim: 'Demand for everyday goods and demand for discretionary goods are correlated with income in opposite directions.',
    support: 'partial',
    quote:
      'demand for everyday purchase products is negatively correlated with income, whereas demand for discretionary purchase products is positively correlated with income.',
    sourceKey: 'osadchiy2013',
    chunkRef: 'corpus:engel-curves::utf8-6f73616463686979323031332e7064662e747874:21',
    note: 'Correlation reported as a literature summary; not a causal estimate and not emerging-market data.',
  },
  {
    id: 5,
    claim: 'Sales surprises at higher-margin retailers track market returns more closely than at lower-margin retailers.',
    support: 'partial',
    quote: 'higher margin retailers have higher correlation coefficients after controlling for differences across industry segments.',
    sourceKey: 'osadchiy2013',
    chunkRef: 'corpus:engel-curves::utf8-6f73616463686979323031332e7064662e747874:12',
    note: 'Correlation of sales forecast errors with market returns, 105 US retailers, 1997\u20132010. Margin is the measured variable; "discretionary" is the authors\u2019 interpretation.',
  },
  {
    id: 6,
    claim: 'In emerging markets, household wealth gains feed into consumption, mainly through housing.',
    support: 'supported',
    quote:
      'Empirical inquiry, using panel data of 20 large emerging market and developing countries over the period 1996:Q1 to 2019:Q4, reveals a strong housing wealth effect',
    sourceKey: 'singh2021',
    chunkRef: 'corpus:engel-curves::utf8-73696e6768323032312e7064662e747874:0',
    note: 'The same study finds no clear positive stock-market wealth effect in the full emerging-market sample.',
  },
  {
    id: 7,
    claim: 'Financial deepening is a precondition for financial-market gains to reach household consumption.',
    support: 'partial',
    quote:
      'the stock market wealth effect turns positive and significant when the financial sector crosses a threshold of development.',
    sourceKey: 'singh2021',
    chunkRef: 'corpus:engel-curves::utf8-73696e6768323032312e7064662e747874:1',
    note: 'A financial-development threshold, not an income threshold. It supports prioritizing financial infrastructure in less-developed markets, but not a specific per-capita income cut-off.',
  },
  {
    id: 8,
    claim: 'Across emerging economies, expected financial returns move household consumption.',
    support: 'partial',
    quote:
      'We use quarterly data for a panel of 31 emerging economies and find that, when agents expect future stock returns to be higher, they will temporarily allow consumption to rise.',
    sourceKey: 'caporale2011',
    chunkRef: 'corpus:engel-curves::utf8-3732323231323436312e7064662e747874:2',
    note: 'Temporary effect, and the sign for housing depends on whether housing and stocks are complements or substitutes.',
  },
];

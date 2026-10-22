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
  {
    key: 'clements2010',
    citation:
      'Clements, K. W. & Chen, D. (2010). Affluence and Food: A Simple Way to Infer Incomes. American Journal of Agricultural Economics, 92(4). doi:10.1093/ajae/aaq049 (UWA working paper version)',
  },
  {
    key: 'pritchett2013',
    citation:
      'Pritchett, L. & Spivack, M. (2013). Estimating Income/Expenditure Differences across Populations: New Fun with Old Engel\u2019s Law. Center for Global Development Working Paper.',
  },
  {
    key: 'almas2012',
    citation:
      'Alm\u00e5s, I. (2012). International Income Inequality: Measuring PPP Bias by Estimating Engel Curves for Food. American Economic Review, 102(2), 1093\u20131117. doi:10.1257/aer.102.2.1093 (LIS Working Paper 473 version)',
  },
  {
    key: 'kharas2017',
    citation:
      'Kharas, H. (2017). The Unprecedented Expansion of the Global Middle Class: An Update. Brookings Global Economy & Development Working Paper 100.',
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
    note: 'No passage in the corpus (15 papers) places a switching point at $15,000 GDP per capita. The dashboard now uses boundaries estimated from 85 household surveys instead: a break near $6.6k and a 35% food share near $17.8k (see Testing the Threshold).',
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
  {
    id: 9,
    claim: 'Across countries, richer countries spend a smaller share of their budget on food.',
    support: 'partial',
    quote:
      'With only a few exceptions, for each pairwise comparison, the share in the poorer country is greater than that in the richer country, which is a reflection of Engel\u2019s law.',
    sourceKey: 'clements2010',
    chunkRef: 'corpus:engel-curves::utf8-636c656d656e74735f6368656e323031302e7064662e747874:17',
    note: 'Sample of 42 countries, mostly OECD plus Mexico, Turkey and Russia; no low-income countries, and the pattern has a few exceptions. Median slope of about -0.13: a country 50% richer has a food share about 5 percentage points lower (5.27 pp recomputed with lisp_eval).',
  },
  {
    id: 10,
    claim: 'The food share of the median household falls in steps with a country\u2019s income group.',
    support: 'supported',
    quote:
      'the food share of the typical (median) household in the typical \u201clow income\u201d country is over 50 percent, is between 40 and 50 percent in \u201clower middle income\u201d countries and 30 to 40 percent even in \u201cupper middle income\u201d countries.',
    sourceKey: 'pritchett2013',
    chunkRef: 'corpus:engel-curves::utf8-6367645f696e636f6d655f657870656e6469747572652e7064662e747874:15',
    note: 'Bands are by World Bank income group, not by a dollar threshold. Same paper: poor households in rich countries spend about 15% on food.',
  },
  {
    id: 11,
    claim: 'Even affluent households in poor and middle-income countries spend more of their budget on food than poor households in rich countries.',
    support: 'partial',
    quote:
      'the \u201cstatistical\u201d rich of the 95th percentile in poor countries have food shares 5 to 15 percentage points higher than the poor in rich countries.',
    sourceKey: 'pritchett2013',
    chunkRef: 'corpus:engel-curves::utf8-6367645f696e636f6d655f657870656e6469747572652e7064662e747874:70',
    note: 'The paper\u2019s figure includes Indonesia, Vietnam, India and South Africa, but the quoted range is stated for "poor countries" in general, not per dashboard market.',
  },
  {
    id: 12,
    claim: 'PPP-adjusted incomes overstate the real income of poorer countries.',
    support: 'supported',
    quote: 'the poorer is a country, the more its income tends to be overestimated.',
    sourceKey: 'almas2012',
    chunkRef: 'corpus:engel-curves::utf8-616c6d6173323031322e7064662e747874:0',
    note: 'Estimated on Penn World Table incomes, not the World Bank series used on this dashboard. If the bias carries over, the distance-to-threshold of pre-inflection markets is understated.',
  },
  {
    id: 13,
    claim: 'One middle-class definition, used by Kharas and others he cites, starts at $10 per person per day (2005 PPP), about $11 in 2011 PPP.',
    support: 'partial',
    quote:
      'comprising those households with per capita incomes between $10 and $100 per person per day (pppd) in 2005 PPP terms',
    sourceKey: 'kharas2017',
    chunkRef: 'corpus:engel-curves::utf8-6b6861726173323031372e7064662e747874:9',
    note: 'Household income or consumption per person, not GDP per capita: $11 a day is about $4,015 a year per person (2011 PPP). It cannot be compared directly with the $15,000 GDP-per-capita reference.',
  },
  {
    id: 14,
    claim: 'Most of the next billion middle-class consumers will be in Asia.',
    support: 'supported',
    quote:
      'almost 90 percent\u2014of the next billion entrants into the global middle class will be in Asia: 380 million Indians, 350 million Chinese, and 210 million other Asians.',
    sourceKey: 'kharas2017',
    chunkRef: 'corpus:engel-curves::utf8-6b6861726173323031372e7064662e747874:34',
    note: 'A 2017 projection, not an observation. The listed components sum to 940 million.',
  },
];

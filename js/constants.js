var FILTERS_DATA = {
  discipline: [
    {
      label: 'Earth Sciences & Environment',
      value: 'Earth Sciences & Environment'
    },
    {
      label: 'Engineering & Technology',
      value: 'Engineering & Technology'
    },
    {
      label: 'Humanities',
      value: 'Humanities'
    },
    {
      label: 'Information & Communication Technologies',
      value: 'Information & Communication Technologies'
    },
    {
      label: 'Life Sciences & Biotech',
      value: 'Life Sciences & Biotech'
    },
    {
      label: 'Material Sciences',
      value: 'Material Sciences'
    },
    {
      label: 'Physics',
      value: 'Physics'
    },
    {
      label: 'Social Sciences',
      value: 'Social Sciences'
    }
  ],
  funding_round: [
    {
      label: 'SYNTHESYS (2004 - 2009)',
      value: 'R1'
    },
    {
      label: 'SYNTHESYS2 (2009 - 2013)',
      value: 'R2'
    },
    {
      label: 'SYNTHESYS3 (2013 - 2017)',
      value: 'R3'
    }
  ],
  country: [
    {
      value: "ALB",
      label: "Albania"
    }, {
      value: "AUT",
      label: "Austria"
    }, {
      value: "BEL",
      label: "Belgium"
    }, {
      value: "BGR",
      label: "Bulgaria"
    }, {
      value: "BIH",
      label: "Bosnia and Herzegovina"
    }, {
      value: "CHE",
      label: "Switzerland"
    }, {
      value: "CYP",
      label: "Cyprus"
    }, {
      value: "CZE",
      label: "Czech Republic"
    }, {
      value: "DEU",
      label: "Germany"
    }, {
      value: "DNK",
      label: "Denmark"
    }, {
      value: "ESP",
      label: "Spain"
    }, {
      value: "EST",
      label: "Estonia"
    }, {
      value: "FIN",
      label: "Finland"
    }, {
      value: "FRA",
      label: "France"
    }, {
      value: "GBR",
      label: "United Kingdom"
    }, {
      value: "GRC",
      label: "Greece"
    }, {
      value: "GUF",
      label: "French Guiana"
    }, {
      value: "HRV",
      label: "Croatia"
    }, {
      value: "HUN",
      label: "Hungary"
    }, {
      value: "IRL",
      label: "Ireland"
    }, {
      value: "ISL",
      label: "Iceland"
    }, {
      value: "ISR",
      label: "Israel"
    }, {
      value: "ITA",
      label: "Italy"
    }, {
      value: "LIE",
      label: "Liechtenstein"
    }, {
      value: "LTU",
      label: "Lithuania"
    }, {
      value: "LUX",
      label: "Luxembourg"
    }, {
      value: "LVA",
      label: "Latvia"
    }, {
      value: "MKD",
      label: "Macedonia"
    }, {
      value: "NLD",
      label: "Netherlands"
    }, {
      value: "NOR",
      label: "Norway"
    }, {
      value: "POL",
      label: "Poland"
    }, {
      value: "PRT",
      label: "Portugal"
    }, {
      value: "PSE",
      label: "Palestina"
    }, {
      value: "REU",
      label: "Reunion"
    }, {
      value: "ROU",
      label: "Romania"
    }, {
      value: "SRB",
      label: "Serbia"
    }, {
      value: "SVK",
      label: "Slovakia"
    }, {
      value: "SVN",
      label: "Slovenia"
    }, {
      value: "SWE",
      label: "Sweden"
    }, {
      value: "TUR",
      label: "Turkey"
    }]
};

var ISO_TO_ISO2 = {
  'ALB': 'AL',
  'AUT': 'AT',
  'BEL': 'BE',
  'BGR': 'BG',
  'BIH': 'BA',
  'CHE': 'CH',
  'CYP': 'CY',
  'CZE': 'CZ',
  'DEU': 'DE',
  'DNK': 'DK',
  'ESP': 'ES',
  'EST': 'EE',
  'FIN': 'FI',
  'FRA': 'FR',
  'GBR': 'GB',
  'GRC': 'GR',
  'GUF': 'GF',
  'HRV': 'HR',
  'HUN': 'HU',
  'IRL': 'IE',
  'ISL': 'IS',
  'ISR': 'IL',
  'ITA': 'IT',
  'LIE': 'LI',
  'LTU': 'LT',
  'LUX': 'LU',
  'LVA': 'LV',
  'MKD': 'MK',
  'NLD': 'NL',
  'NOR': 'NO',
  'POL': 'PL',
  'PRT': 'PT',
  'PSE': 'PS',
  'REU': 'RE',
  'ROU': 'RO',
  'SRB': 'RS',
  'SVK': 'SK',
  'SVN': 'SI',
  'SWE': 'SE',
  'TUR': 'TR'
};

var INSTITUTES = {
  0: 'Botanischer Garten und Botanisches Museum',
  1: 'Botanischer Garten und Botanisches Museum',
  2: 'Botanischer Garten und Botanisches Museum',
  3: 'Botanischer Garten und Botanisches Museum',
  4: 'Botanischer Garten und Botanisches Museum',
  5: 'Botanischer Garten und Botanisches Museum',
  6: 'Consejo Superior de Investigaciones Científicas',
  7: 'Hungarian Natural History Museum',
  8: 'Hungarian Natural History Museum',
  9: 'Hungarian Natural History Museum',
  10: 'Hungarian Natural History Museum',
  11: 'Hungarian Natural History Museum',
  12: 'Museum National d’Histoire Naturelle',
  13: 'Museum National d’Histoire Naturelle',
  14: 'Museum National d’Histoire Naturelle',
  15: 'Museum National d’Histoire Naturelle',
  16: 'Museum National d’Histoire Naturelle',
  17: 'Museum National d’Histoire Naturelle',
  18: 'Polish Academy of Sciences (MIZPAN)',
  19: 'Museum für Naturkunde',
  20: 'Museum für Naturkunde',
  21: 'Museum für Naturkunde',
  22: 'Museum für Naturkunde',
  23: 'Museum für Naturkunde',
  24: 'National Museum Prague',
  25: 'Natural History Museum London',
  26: 'Natural History Museum London',
  27: 'Natural History Museum London',
  28: 'Natural History Museum London',
  29: 'Natural History Museum Vienna',
  30: 'Naturalis Biodiversity Center',
  31: 'Naturhistoriska riksmuseet',
  32: 'Royal Belgian Institute of Natural Sciences',
  33: 'Royal Botanic Garden Edinburgh',
  34: 'Royal Botanic Gardens Kew',
  35: 'Royal Museum of Central Africa',
  36: 'Senckenberg Gesellschaft für Naturforschung',
  37: 'Senckenberg Gesellschaft für Naturforschung',
  38: 'State Museum of Natural History Stuttgart',
  39: 'University of Amsterdam',
  40: 'University of Copenhagen'
};

var RESEARCHER_TYPES = {
  EXP: 'Experienced Researcher',
  PDOC: 'Postdoctoral Researcher',
  PGR: 'Postgraduate Researcher',
  TEC: 'Technician',
  UND: 'Undergraduate'
};

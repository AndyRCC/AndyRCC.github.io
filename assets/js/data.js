(function () {
  'use strict';

  var CATEGORIES = [
    { id: 'ai', label: 'AI' },
    { id: 'inst', label: 'Instrumentation' },
    { id: 'research', label: 'Research' },
    { id: 'soft', label: 'Software' }
  ];

  var PROJECTS = [
    {
      id: 'hydradetect',
      no: 'P.01',
      title: 'HydraDetect-AI',
      short: 'HydraDetect-AI',
      kicker: 'Big Brother × Little Brother',
      summary: 'Detects clandestine water taps in city pipes using a controlled water hammer and machine learning. Lab-to-field transfer reaches 89% accuracy, running offline on an Arduino edge device.',
      tags: ['Arduino', 'Python', 'Machine Learning', 'Signal Processing', 'Edge AI'],
      cats: ['ai', 'inst'],
      url: 'https://andyrcc.github.io/HydraDetect-AI/',
      linkLabel: 'Open',
      featured: true,
      stats: [
        { value: '89%', label: 'field accuracy' },
        { value: 'Offline', label: 'edge inference' },
        { value: 'Arduino', label: 'on-device ML' }
      ]
    },
    {
      id: 'reservoir',
      no: 'P.02',
      title: 'Reservoir Outlet 3D',
      short: 'Reservoir 3D',
      kicker: 'Why the flowmeter lies',
      summary: 'Interactive 3D hydraulics (Manning, H2/H3/S2 profiles): why a partly full pipe makes an electromagnetic flowmeter over-read by about 35%, and how a gooseneck fixes it.',
      tags: ['Three.js', 'JavaScript', 'Hydraulics', 'Flow Metering'],
      cats: ['inst', 'soft'],
      url: 'https://andyrcc.github.io/simulacion-reservorio-3d/',
      linkLabel: 'Open'
    },
    {
      id: 'meter-verification',
      no: 'P.03',
      title: 'Bulk Meter Verification',
      short: 'Meter Check',
      kicker: 'Field metrology',
      summary: '53 bulk water meters at a utility’s wells and reservoirs, checked against a portable clamp-on ultrasonic reference. 41 tested on site; 15 corrected in the field without cutting supply, all re-verified.',
      tags: ['Calibration', 'Field Work', 'Data Viz'],
      cats: ['inst'],
      url: 'https://andyrcc.github.io/contrastacion-emapica/',
      linkLabel: 'Open'
    },
    {
      id: 'erdos-straus',
      no: 'P.04',
      title: 'Erdős–Straus: Blind Sets',
      short: 'Erdős–Straus',
      kicker: 'Number theory · Zenodo DOI',
      summary: 'For every shift c ≡ 3 (mod 4), counts the primes where that shift fails, settling the open case c = 3, plus exact computations for 128 million “hard” primes below 10¹¹. Not a proof of the conjecture.',
      tags: ['Python', 'Numba', 'SymPy'],
      cats: ['research'],
      url: 'https://github.com/AndyRCC/erdos-straus',
      linkLabel: 'Code',
      extra: {
        label: 'DOI',
        url: 'https://doi.org/10.5281/zenodo.24569380'
      }
    },
    {
      id: 'bsd-audit',
      no: 'P.05',
      title: 'BSD Period–Trace Audit',
      short: 'BSD Audit',
      kicker: 'Independent audit · preprint',
      summary: 'Independent audit of reported correlations among elliptic curves (Cremona data, N < 10⁵): a collider and a Simpson reversal explain them. Also found a documentation error in Cremona’s ecdata, now fixed upstream.',
      tags: ['Python', 'PARI/GP', 'Statistics'],
      cats: ['research'],
      url: 'https://github.com/AndyRCC/bsd-period-trace-audit',
      linkLabel: 'Code',
      extra: {
        label: 'DOI',
        url: 'https://doi.org/10.5281/zenodo.24450625'
      }
    },
    {
      id: 'hoardling',
      no: 'P.06',
      title: 'Hoardling',
      short: 'Hoardling',
      kicker: 'A dragon that guards your limits',
      summary: 'A tiny Windows desktop dragon that keeps an eye on my Claude Code and Antigravity usage limits: glasses on while they work, napping when they’re closed. Local-only, no telemetry.',
      tags: ['C#', '.NET 10', 'WPF'],
      cats: ['soft'],
      url: 'https://github.com/AndyRCC/hoardling',
      linkLabel: 'Code'
    }
  ];

  var SITE_DATA = { PROJECTS: PROJECTS, CATEGORIES: CATEGORIES };
  if (typeof module === 'object' && module.exports) module.exports = SITE_DATA;
  else window.SITE_DATA = SITE_DATA;
})();

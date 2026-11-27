(function () {
  'use strict';

  var SITE_FIGURES = {
    hydradetect: `<svg class="ill" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="gl"><line x1="0" y1="50" x2="320" y2="50"/><line x1="0" y1="100" x2="320" y2="100"/><line x1="0" y1="150" x2="320" y2="150"/><line x1="80" y1="0" x2="80" y2="200"/><line x1="160" y1="0" x2="160" y2="200"/><line x1="240" y1="0" x2="240" y2="200"/></g>
      <text x="16" y="22">FIG. 1 — WATER HAMMER SIGNATURE</text>
      <rect class="s pf" x="16" y="34" width="180" height="66" rx="3"/>
      <path class="s" d="M22 67 H190" style="stroke-width:.8;opacity:.25"/>
      <path class="s" d="M24 67 H64 L70 42 L76 92 L82 50 L88 84 L94 58 L100 74 L106 63 L112 69 L118 67 H130"/>
      <path class="a" d="M130 67 L135 55 L140 77 L145 63 L150 67"/>
      <path class="s" d="M150 67 H188"/>
      <circle class="a" cx="140" cy="66" r="14" style="stroke-width:1.4"/>
      <path class="a d" d="M146 100 Q200 108 228 160" style="stroke-width:1.5"/>
      <text class="serif" x="212" y="70" style="font-size:34px">89%</text>
      <text x="214" y="88">FIELD ACCURACY</text>
      <path class="s" d="M16 128 H304 M16 152 H216 M240 152 H304"/>
      <rect class="s pf" x="94" y="122" width="7" height="36" rx="1"/>
      <rect class="s pf" x="276" y="122" width="7" height="36" rx="1"/>
      <path class="s" d="M216 152 V190 M240 152 V190"/>
      <path class="af" d="M218 166 L238 178 V166 L218 178 Z"/>
      <path class="s" d="M140 140 H170 M164 135 L170 140 L164 145" style="stroke-width:1.5"/>
      <rect class="s pf" x="42" y="114" width="20" height="14" rx="2"/>
      <circle class="af" cx="57" cy="121" r="2"/>
      <path class="s d" d="M52 114 V100" style="stroke-width:1.3"/>
    </svg>`,

    reservoir: `<svg class="ill" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="gl"><line x1="0" y1="50" x2="320" y2="50"/><line x1="0" y1="100" x2="320" y2="100"/><line x1="0" y1="150" x2="320" y2="150"/><line x1="80" y1="0" x2="80" y2="200"/><line x1="160" y1="0" x2="160" y2="200"/><line x1="240" y1="0" x2="240" y2="200"/></g>
      <text x="16" y="22">FIG. 2 — PARTLY FULL PIPE</text>
      <rect class="aw" x="24" y="70" width="96" height="100"/>
      <path class="a" d="M24 70 H120"/>
      <path class="s" d="M54 60 H66 L60 69 Z M56 75 H64 M58 80 H62" style="stroke-width:1.5"/>
      <path class="aw2" d="M120 141 H152 L157.5 156 L201.5 200 H193 L149 156 H120 Z"/>
      <path class="a" d="M152 141 L157.5 156 L201.5 200" style="stroke-width:1.5"/>
      <path class="s" d="M24 36 V170 H120 V156 M120 140 V36" style="stroke-width:2.6"/>
      <path class="s" d="M12 170 H132 M18 178 L26 170 M34 178 L42 170 M50 178 L58 170 M66 178 L74 170 M82 178 L90 170 M98 178 L106 170 M114 178 L122 170" style="stroke-width:1.2"/>
      <path class="s" d="M120 140 H156 L216 200 M120 156 H149 L193 200"/>
      <g transform="rotate(45 177 171)"><rect class="s pf" x="162" y="155" width="30" height="32" rx="3"/><rect class="s pf" x="157" y="151" width="5" height="40" rx="1"/><rect class="s pf" x="192" y="151" width="5" height="40" rx="1"/><circle class="a" cx="177" cy="171" r="6"/></g>
      <path class="s" d="M192 158 L214 136" style="stroke-width:1.2"/>
      <text class="serif" x="212" y="128" style="font-size:34px">+35%</text>
      <text x="216" y="146">READS HIGH</text>
    </svg>`,

    'meter-verification': `<svg class="ill" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="gl"><line x1="0" y1="50" x2="320" y2="50"/><line x1="0" y1="100" x2="320" y2="100"/><line x1="0" y1="150" x2="320" y2="150"/><line x1="80" y1="0" x2="80" y2="200"/><line x1="160" y1="0" x2="160" y2="200"/><line x1="240" y1="0" x2="240" y2="200"/></g>
      <text x="16" y="22">FIG. 3 — CLAMP-ON REFERENCE</text>
      <path class="s" d="M16 112 H110 M16 142 H110 M178 112 H304 M178 142 H304"/>
      <rect class="s pf" x="118" y="104" width="52" height="46" rx="4"/>
      <rect class="s pf" x="110" y="98" width="8" height="58" rx="1"/>
      <rect class="s pf" x="170" y="98" width="8" height="58" rx="1"/>
      <circle class="s" cx="144" cy="127" r="9" style="stroke-width:1.4;opacity:.6"/>
      <line class="s" x1="144" y1="104" x2="144" y2="90"/>
      <rect class="s pf" x="120" y="50" width="48" height="40" rx="5"/>
      <path class="s" d="M128 61 H160" style="stroke-width:1.2;opacity:.45"/>
      <path class="a" d="M133 73 L140 80 L155 66"/>
      <rect class="s pf" x="206" y="100" width="20" height="12" rx="2"/>
      <rect class="s pf" x="262" y="100" width="20" height="12" rx="2"/>
      <path class="a d" d="M216 112 L244 142 L272 112"/>
      <path class="s d" d="M216 100 Q244 70 272 100" style="stroke-width:1.2;opacity:.5"/>
      <text x="226" y="70">REFERENCE</text>
      <text class="serif" x="16" y="188" style="font-size:34px">53</text>
      <text x="56" y="186">METERS VERIFIED</text>
      <text x="200" y="186">15 FIXED ON SITE</text>
    </svg>`,

    'erdos-straus': `<svg class="ill" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="gl"><line x1="0" y1="50" x2="320" y2="50"/><line x1="0" y1="100" x2="320" y2="100"/><line x1="0" y1="150" x2="320" y2="150"/><line x1="80" y1="0" x2="80" y2="200"/><line x1="160" y1="0" x2="160" y2="200"/><line x1="240" y1="0" x2="240" y2="200"/></g>
      <text x="16" y="22">FIG. 4 — EGYPTIAN FRACTIONS</text>
      <text class="serif si" x="16" y="64" style="font-size:30px">4/n = 1/x + 1/y + 1/z</text>
      <rect class="aw" x="16" y="80" width="144" height="26"/>
      <path class="s" d="M164 106 L176 80 M172 106 L184 80 M180 106 L192 80 M188 106 L200 80 M196 106 L208 80 M204 106 L216 80 M212 106 L224 80 M220 106 L232 80 M228 106 L240 80 M236 106 L248 80" style="stroke-width:1.1;opacity:.55"/>
      <rect class="af" x="256" y="80" width="48" height="26"/>
      <rect class="s" x="16" y="80" width="288" height="26"/>
      <path class="s" d="M160 80 V106 M256 80 V106"/>
      <text class="serif si" x="76" y="128" style="font-size:17px">1/x</text>
      <text class="serif si" x="196" y="128" style="font-size:17px">1/y</text>
      <text class="serif si" x="268" y="128" style="font-size:17px">1/z</text>
      <line x1="20" y1="158" x2="300" y2="158" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-dasharray="0 8" opacity=".55"/>
      <circle class="a" cx="68" cy="158" r="5.5"/>
      <circle class="a" cx="156" cy="158" r="5.5"/>
      <circle class="a" cx="252" cy="158" r="5.5"/>
      <text x="56" y="182">193</text>
      <text x="140" y="182">2521</text>
      <text x="234" y="182">66529</text>
    </svg>`,

    'bsd-audit': `<svg class="ill" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="gl"><line x1="0" y1="50" x2="320" y2="50"/><line x1="0" y1="100" x2="320" y2="100"/><line x1="0" y1="150" x2="320" y2="150"/><line x1="80" y1="0" x2="80" y2="200"/><line x1="160" y1="0" x2="160" y2="200"/><line x1="240" y1="0" x2="240" y2="200"/></g>
      <text x="16" y="22">FIG. 5 — SIMPSON'S REVERSAL</text>
      <path class="s" d="M36 36 V172 H304"/>
      <text class="serif si" x="14" y="50" style="font-size:18px">Ω</text>
      <text class="serif si" x="286" y="192" style="font-size:18px">a</text><text class="serif si" x="296" y="196" style="font-size:11px">p</text>
      <path class="a d" d="M50 160 L298 46"/>
      <text class="serif" x="250" y="96" style="font-size:22px">r &gt; 0</text>
      <path class="s" d="M62 127 L120 153 M142 91 L200 117 M222 55 L280 81" style="stroke-width:1.6"/>
      <g class="inkf">
        <circle cx="66" cy="124" r="2.6"/><circle cx="76" cy="135" r="2.6"/><circle cx="84" cy="128" r="2.6"/><circle cx="92" cy="142" r="2.6"/><circle cx="100" cy="137" r="2.6"/><circle cx="108" cy="150" r="2.6"/><circle cx="116" cy="145" r="2.6"/>
        <circle cx="146" cy="88" r="2.6"/><circle cx="156" cy="99" r="2.6"/><circle cx="164" cy="93" r="2.6"/><circle cx="172" cy="106" r="2.6"/><circle cx="180" cy="100" r="2.6"/><circle cx="188" cy="113" r="2.6"/><circle cx="196" cy="109" r="2.6"/>
        <circle cx="226" cy="52" r="2.6"/><circle cx="236" cy="63" r="2.6"/><circle cx="244" cy="57" r="2.6"/><circle cx="252" cy="70" r="2.6"/><circle cx="260" cy="64" r="2.6"/><circle cx="268" cy="77" r="2.6"/><circle cx="276" cy="73" r="2.6"/>
      </g>
      <text x="44" y="190">WITHIN EACH STRATUM: r &lt; 0</text>
    </svg>`,

    hoardling: `<svg class="ill" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g class="gl"><line x1="0" y1="50" x2="320" y2="50"/><line x1="0" y1="100" x2="320" y2="100"/><line x1="0" y1="150" x2="320" y2="150"/><line x1="80" y1="0" x2="80" y2="200"/><line x1="160" y1="0" x2="160" y2="200"/><line x1="240" y1="0" x2="240" y2="200"/></g>
      <text x="16" y="22">FIG. 6 — GUARDING THE LIMITS</text>
      <circle class="s" cx="160" cy="112" r="66" style="stroke-width:5;opacity:.12"/>
      <circle class="a" cx="160" cy="112" r="66" transform="rotate(-90 160 112)" style="stroke-width:5;stroke-dasharray:290 415"/>
      <circle class="s" cx="160" cy="112" r="58" style="stroke-width:3;opacity:.12"/>
      <circle class="s" cx="160" cy="112" r="58" transform="rotate(-90 160 112)" style="stroke-width:3;stroke-dasharray:91 365"/>
      <path class="s pf" d="M143 116 L118 101 L124 117 L113 124 L141 131 Z"/>
      <path class="s pf" d="M177 116 L202 101 L196 117 L207 124 L179 131 Z"/>
      <path class="s" d="M146 146 Q123 157 120 139 Q119 127 131 129" style="stroke-width:2.2"/>
      <ellipse class="s pf" cx="160" cy="133" rx="19" ry="20"/>
      <ellipse class="s pf" cx="151" cy="153" rx="7" ry="3.6"/>
      <ellipse class="s pf" cx="169" cy="153" rx="7" ry="3.6"/>
      <path class="s pf" d="M145 84 L139 63 L153 76 Z"/>
      <path class="s pf" d="M175 84 L181 63 L167 76 Z"/>
      <path class="af" d="M156 76 L160 66 L164 76 Z"/>
      <circle class="s pf" cx="160" cy="96" r="22"/>
      <ellipse class="aw2" cx="144.5" cy="104" rx="3.6" ry="2.1"/>
      <ellipse class="aw2" cx="175.5" cy="104" rx="3.6" ry="2.1"/>
      <circle class="s" cx="152" cy="95" r="6.5" style="stroke-width:2.2"/>
      <circle class="s" cx="168" cy="95" r="6.5" style="stroke-width:2.2"/>
      <path class="s" d="M158.5 95 H161.5"/>
      <circle class="inkf" cx="152" cy="96" r="2.4"/>
      <circle class="inkf" cx="168" cy="96" r="2.4"/>
      <path class="s" d="M156 105 Q160 108.5 164 105" style="stroke-width:1.6"/>
      <rect class="inkf" x="145" y="124" width="30" height="18" rx="2"/>
      <circle class="pf" cx="160" cy="133" r="1.8"/>
      <path class="inkf" d="M139 142 H181 L177 147 H143 Z"/>
      <ellipse class="af" cx="150" cy="142" rx="4" ry="2.6"/>
      <ellipse class="af" cx="170" cy="142" rx="4" ry="2.6"/>
      <path class="af" d="M108 56 L110.5 62 L117 64 L110.5 66 L108 72 L105.5 66 L99 64 L105.5 62 Z"/>
      <path class="af" d="M212 150 L213.6 154 L218 155.5 L213.6 157 L212 161 L210.4 157 L206 155.5 L210.4 154 Z"/>
      <text class="serif" x="236" y="70" style="font-size:34px">70%</text>
      <text x="238" y="88">CLAUDE · 5H</text>
    </svg>`
  };

  if (typeof module === 'object' && module.exports) module.exports = SITE_FIGURES;
  else window.SITE_FIGURES = SITE_FIGURES;
})();

/*
  JewelArt — draws each piece as a small gold or silver SVG illustration,
  so the catalogue looks finished before real photographs exist.

  To use a real photo instead, add  image: 'assets/img/your-photo.jpg'
  to that item in catalog.js — the illustration is then skipped.

  JewelArt.svg({ name, metal: 'gold'|'silver', art: { type, variant, gem, label } })
*/
(function () {
  'use strict';

  var uid = 0;

  var METAL = {
    gold:   ['#fff1c4', '#e3bd6c', '#a8792c', '#f6dc97', '#c99a48', '#8a6220'],
    silver: ['#ffffff', '#d9dce0', '#878d95', '#f5f6f8', '#b9bec5', '#6c727a']
  };
  var GEM = {
    ruby:     ['#ff8fa3', '#b3123a', '#5e0a20'],
    emerald:  ['#7fe6bb', '#0f7a55', '#053d2b'],
    sapphire: ['#9db9ff', '#1c3f9e', '#0c1c4f'],
    diamond:  ['#ffffff', '#d6e8ff', '#8fa9c9'],
    pearl:    ['#ffffff', '#f3eee4', '#c9c0b0'],
    onyx:     ['#6b6b6b', '#232323', '#000000']
  };

  function r(n) { return Math.round(n * 10) / 10; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  /* ---------- geometry ---------- */

  // point on a cubic bezier, P = [x0,y0, x1,y1, x2,y2, x3,y3]
  function cub(P, t) {
    var u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    return [a * P[0] + b * P[2] + c * P[4] + d * P[6], a * P[1] + b * P[3] + c * P[5] + d * P[7]];
  }

  // n points evenly spaced (by arc length) around an ellipse: [x, y, tangentAngleDeg]
  function ellPts(cx, cy, rx, ry, n) {
    var S = 360, raw = [], acc = [0], i, t, x, y, px = cx + rx, py = cy;
    raw.push([px, py]);
    for (i = 1; i <= S; i++) {
      t = i / S * 2 * Math.PI;
      x = cx + rx * Math.cos(t); y = cy + ry * Math.sin(t);
      acc.push(acc[i - 1] + Math.sqrt((x - px) * (x - px) + (y - py) * (y - py)));
      raw.push([x, y]); px = x; py = y;
    }
    var total = acc[S], out = [], j = 0, target, f;
    for (i = 0; i < n; i++) {
      target = total * i / n;
      while (j < S - 1 && acc[j + 1] < target) j++;
      f = (target - acc[j]) / ((acc[j + 1] - acc[j]) || 1);
      out.push([
        raw[j][0] + (raw[j + 1][0] - raw[j][0]) * f,
        raw[j][1] + (raw[j + 1][1] - raw[j][1]) * f,
        Math.atan2(raw[j + 1][1] - raw[j][1], raw[j + 1][0] - raw[j][0]) * 180 / Math.PI
      ]);
    }
    return out;
  }

  /* ---------- drawing primitives (c = { M: metal paint, G: gem paint }) ---------- */

  function line(c, d, w) {
    return '<path d="' + d + '" fill="none" stroke="' + c.M + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }
  function dashed(c, d, w, dash) {
    return '<path d="' + d + '" fill="none" stroke="' + c.M + '" stroke-width="' + w + '" stroke-dasharray="' + dash + '"/>';
  }
  // a row of round beads along a path
  function beads(c, d, w, gap) {
    return '<path d="' + d + '" fill="none" stroke="' + c.M + '" stroke-width="' + w + '" stroke-linecap="round" stroke-dasharray="0.01 ' + gap + '"/>';
  }
  // engraved texture laid over a metal stroke
  function carve(d, w, dash) {
    return '<path d="' + d + '" fill="none" stroke="rgba(0,0,0,.26)" stroke-width="' + w + '" stroke-dasharray="' + dash + '"/>';
  }
  function dot(c, x, y, rad) {
    return '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + r(rad) + '" fill="' + c.M + '"/>';
  }
  function gem(c, x, y, rad) {
    return '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + r(rad * 1.3) + '" fill="' + c.M + '"/>' +
           '<circle cx="' + r(x) + '" cy="' + r(y) + '" r="' + r(rad) + '" fill="' + c.G + '"/>' +
           '<circle cx="' + r(x - rad * 0.32) + '" cy="' + r(y - rad * 0.32) + '" r="' + r(Math.max(0.7, rad * 0.22)) + '" fill="#fff" opacity=".8"/>';
  }
  // teardrop hanging from (x,y): L long, W half-width
  function tear(x, y, L, W) {
    return 'M' + r(x) + ' ' + r(y) +
      ' C' + r(x + W * 0.9) + ' ' + r(y + L * 0.45) + ' ' + r(x + W * 0.78) + ' ' + r(y + L) + ' ' + r(x) + ' ' + r(y + L) +
      ' C' + r(x - W * 0.78) + ' ' + r(y + L) + ' ' + r(x - W * 0.9) + ' ' + r(y + L * 0.45) + ' ' + r(x) + ' ' + r(y) + 'Z';
  }
  function dropGem(c, x, y, L, W) {
    return '<path d="' + tear(x, y, L, W) + '" fill="' + c.G + '" stroke="' + c.M + '" stroke-width="' + r(Math.max(1.2, W * 0.22)) + '" stroke-linejoin="round"/>';
  }
  function spark(x, y, s, cls) {
    var k = s * 0.18;
    return '<path class="spk ' + (cls || '') + '" d="M' + x + ' ' + (y - s) + 'L' + (x + k) + ' ' + (y - k) + 'L' + (x + s) + ' ' + y + 'L' + (x + k) + ' ' + (y + k) +
      'L' + x + ' ' + (y + s) + 'L' + (x - k) + ' ' + (y + k) + 'L' + (x - s) + ' ' + y + 'L' + (x - k) + ' ' + (y - k) + 'Z" fill="#fff"/>';
  }

  /* ---------- pieces ---------- */

  function necklace(c, v) {
    var o = '', i, t, p, P, d;

    if (v === 'choker') {                      // broad collar with kundan-style drops
      d = 'M34 58 C50 132 150 132 166 58';
      P = [34, 58, 50, 132, 150, 132, 166, 58];
      o += line(c, d, 13) + carve(d, 13, '1.5 8');
      for (i = 1; i <= 9; i++) {
        p = cub(P, i / 10);
        var L = 21 - 2.7 * Math.abs(5 - i);
        o += dropGem(c, p[0], p[1] + 6, L, L * 0.4);
        o += gem(c, p[0], p[1], i === 5 ? 6 : 4.2);
      }
      return o;
    }

    if (v === 'temple') {                      // bead strand hung with coin medallions
      d = 'M40 34 C44 172 156 172 160 34';
      P = [40, 34, 44, 172, 156, 172, 160, 34];
      o += beads(c, d, 6, 8.6);
      for (i = 0; i < 5; i++) {
        t = 0.3 + i * 0.1;
        p = cub(P, t);
        var rad = i === 2 ? 11 : 8.5;
        o += '<circle cx="' + r(p[0]) + '" cy="' + r(p[1] + rad + 4) + '" r="' + rad + '" fill="' + c.M + '"/>' +
             '<circle cx="' + r(p[0]) + '" cy="' + r(p[1] + rad + 4) + '" r="' + r(rad - 2.6) + '" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1"/>';
        o += gem(c, p[0], p[1] + rad + 4, i === 2 ? 3.6 : 2.4);
      }
      return o;
    }

    if (v === 'haar') {                        // long layered strands with a medallion
      o += beads(c, 'M42 32 C42 116 80 148 100 148 C120 148 158 116 158 32', 5.2, 7.6);
      o += beads(c, 'M58 32 C58 98 84 122 100 122 C116 122 142 98 142 32', 3.4, 5.4);
      o += '<circle cx="100" cy="158" r="15" fill="' + c.M + '"/>' +
           '<circle cx="100" cy="158" r="11" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.01 4.3"/>';
      o += gem(c, 100, 158, 5.6);
      o += dropGem(c, 100, 174, 15, 6.5);
      return o;
    }

    // default: fine strand with a single pendant
    o += beads(c, 'M42 34 C42 118 80 146 100 146 C120 146 158 118 158 34', 4, 6.2);
    o += gem(c, 100, 154, 8);
    o += dropGem(c, 100, 165, 17, 7);
    return o;
  }

  // one earring, drawn hanging from (0,0), about 60 units tall
  function earring(c, v) {
    var o = '', i, a;

    if (v === 'chandbali') {
      o += gem(c, 0, 7, 5.5) + line(c, 'M0 13V21', 2);
      o += '<circle cx="0" cy="40" r="19" fill="none" stroke="' + c.M + '" stroke-width="4.6"/>';
      o += '<circle cx="0" cy="34" r="10" fill="none" stroke="' + c.M + '" stroke-width="2.2"/>';
      for (i = 0; i < 5; i++) {
        a = (20 + i * 35) * Math.PI / 180;
        o += dot(c, 27 * Math.cos(a), 40 + 27 * Math.sin(a), 2.5);
        o += gem(c, 19 * Math.cos(a), 40 + 19 * Math.sin(a), 2.8);
      }
      o += gem(c, 0, 34, 4.2);
      return o;
    }

    if (v === 'stud') {
      var ring = ellPts(0, 30, 18, 18, 16);
      for (i = 0; i < ring.length; i++) o += dot(c, ring[i][0], ring[i][1], 2.5);
      o += gem(c, 0, 30, 10.5);
      return o;
    }

    if (v === 'drop') {
      o += gem(c, 0, 8, 6) + line(c, 'M0 15V24', 2);
      o += dropGem(c, 0, 24, 34, 13);
      return o;
    }

    // jhumka
    o += gem(c, 0, 7, 6) + line(c, 'M0 14V22', 2);
    o += '<path d="M-17 42C-17 26 -9 21 0 21C9 21 17 26 17 42Z" fill="' + c.M + '"/>';
    o += '<path d="M-10 40C-9 31 -5 26 0 25M10 40C9 31 5 26 0 25M0 25V40" fill="none" stroke="rgba(0,0,0,.24)" stroke-width="1.2"/>';
    o += line(c, 'M-19 43H19', 4.6);
    for (i = -15; i <= 15; i += 6) o += dot(c, i, 51.5, 2.6);
    o += gem(c, 0, 58, 2.6);
    return o;
  }

  function earrings(c, v) {
    var y = v === 'stud' ? 40 : 42, s = v === 'stud' ? 2.1 : 1.75, gap = 44;
    return '<g transform="translate(' + (100 - gap) + ' ' + y + ') scale(' + s + ')">' + earring(c, v) + '</g>' +
           '<g transform="translate(' + (100 + gap) + ' ' + y + ') scale(' + s + ')">' + earring(c, v) + '</g>';
  }

  function setPiece(c, v) {
    var ear = v === 'haar' ? 'chandbali' : (v === 'temple' ? 'drop' : 'jhumka');
    var dy = v === 'choker' ? -14 : -24;
    return '<g transform="translate(100 ' + dy + ') scale(.9) translate(-100 0)">' + necklace(c, v || 'choker') + '</g>' +
           '<g transform="translate(34 128) scale(.56)">' + earring(c, ear) + '</g>' +
           '<g transform="translate(166 128) scale(.56)">' + earring(c, ear) + '</g>';
  }

  function ring(c, v) {
    var o = '', i, a;

    if (v === 'pair') {                        // a pair of small rings (toe rings)
      [66, 134].forEach(function (cx) {
        o += '<ellipse cx="' + cx + '" cy="112" rx="27" ry="29" fill="none" stroke="' + c.M + '" stroke-width="8"/>';
        for (i = 0; i < 6; i++) {
          a = i * Math.PI / 3;
          o += dot(c, cx + 8.5 * Math.cos(a), 80 + 8.5 * Math.sin(a), 4);
        }
        o += gem(c, cx, 80, 4.2);
      });
      return o;
    }

    o += '<ellipse cx="100" cy="124" rx="44" ry="46" fill="none" stroke="' + c.M + '" stroke-width="10"/>';
    o += '<ellipse cx="100" cy="124" rx="39.4" ry="41.4" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"/>';

    if (v === 'trio') {
      o += gem(c, 79, 79, 6.6) + gem(c, 121, 79, 6.6) + gem(c, 100, 71, 10);
    } else if (v === 'signet') {
      o += '<ellipse cx="100" cy="74" rx="26" ry="17" fill="' + c.M + '"/>' +
           '<ellipse cx="100" cy="74" rx="19" ry="11" fill="' + c.G + '"/>' +
           '<ellipse cx="94" cy="70" rx="6" ry="2.4" fill="#fff" opacity=".35"/>';
    } else if (v === 'band') {
      for (i = 0; i < 7; i++) {
        a = (-135 + i * 15) * Math.PI / 180;
        o += gem(c, 100 + 44 * Math.cos(a), 124 + 46 * Math.sin(a), 3.4);
      }
    } else {                                   // solitaire
      o += line(c, 'M86 72L93 82M114 72L107 82', 3.2);
      o += '<path d="M80 60L89 46H111L120 60L100 83Z" fill="' + c.G + '" stroke="' + c.M + '" stroke-width="2.6" stroke-linejoin="round"/>';
      o += '<path d="M80 60H120M89 46L95 60L100 46L105 60L111 46M95 60L100 83L105 60" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1"/>';
    }
    return o;
  }

  function bangle(c, v) {
    var o = '', d;

    if (v === 'stack') {                       // four slim bangles
      [58, 82, 106, 130].forEach(function (cy, i) {
        o += '<ellipse cx="100" cy="' + cy + '" rx="62" ry="24" fill="none" stroke="' + c.M + '" stroke-width="8.6"/>';
        if (i % 2 === 0) o += '<ellipse cx="100" cy="' + cy + '" rx="62" ry="24" fill="none" stroke="rgba(0,0,0,.24)" stroke-width="8.6" stroke-dasharray="1.4 7"/>';
        o += '<ellipse cx="100" cy="' + (cy - 2.6) + '" rx="62" ry="24" fill="none" stroke="rgba(255,255,255,.28)" stroke-width="1"/>';
      });
      return o;
    }

    if (v === 'kada') {                        // open cuff with knob ends
      d = 'M71 150.2A58 58 0 1 1 129 150.2';
      o += line(c, d, 17) + carve(d, 17, '2 9.5');
      o += '<path d="' + d + '" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1.2" transform="translate(-2.4 -2.4)"/>';
      o += '<circle cx="71" cy="150" r="12.5" fill="' + c.M + '"/><circle cx="129" cy="150" r="12.5" fill="' + c.M + '"/>';
      o += gem(c, 71, 150, 4.6) + gem(c, 129, 150, 4.6);
      return o;
    }

    // a pair of bangles leaning on each other
    o += '<g transform="rotate(-16 88 98)"><ellipse cx="88" cy="98" rx="60" ry="42" fill="none" stroke="' + c.M + '" stroke-width="11"/>' +
         '<ellipse cx="88" cy="98" rx="60" ry="42" fill="none" stroke="rgba(0,0,0,.24)" stroke-width="11" stroke-dasharray="1.6 8"/></g>';
    o += '<g transform="rotate(14 114 108)"><ellipse cx="114" cy="108" rx="60" ry="42" fill="none" stroke="' + c.M + '" stroke-width="11"/>' +
         '<ellipse cx="114" cy="105" rx="60" ry="42" fill="none" stroke="rgba(255,255,255,.3)" stroke-width="1"/></g>';
    return o;
  }

  function bracelet(c, v) {
    var o = '', i, p, pts;

    if (v === 'tennis') {                      // a continuous line of stones
      pts = ellPts(100, 102, 68, 44, 30);
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        o += dot(c, p[0], p[1], 6.2) +
             '<circle cx="' + r(p[0]) + '" cy="' + r(p[1]) + '" r="4.2" fill="' + c.G + '"/>' +
             '<circle cx="' + r(p[0] - 1.3) + '" cy="' + r(p[1] - 1.3) + '" r="1" fill="#fff" opacity=".8"/>';
      }
      return o;
    }

    if (v === 'beaded') {
      pts = ellPts(100, 102, 68, 44, 22);
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        if (i % 11 === 5) { o += gem(c, p[0], p[1], 6); continue; }
        o += dot(c, p[0], p[1], 7.6) +
             '<circle cx="' + r(p[0] - 2.4) + '" cy="' + r(p[1] - 2.6) + '" r="1.8" fill="#fff" opacity=".55"/>';
      }
      return o;
    }

    // link chain (optionally with charms)
    pts = ellPts(100, 98, 68, 44, 24);
    for (i = 0; i < pts.length; i++) {
      p = pts[i];
      o += '<g transform="translate(' + r(p[0]) + ' ' + r(p[1]) + ') rotate(' + r(p[2]) + ')">' +
        (i % 2 === 0
          ? '<rect x="-8.4" y="-4.6" width="16.8" height="9.2" rx="4.6" fill="none" stroke="' + c.M + '" stroke-width="2.7"/>'
          : '<path d="M-6 0H6" stroke="' + c.M + '" stroke-width="3.4" stroke-linecap="round"/>') +
        '</g>';
    }
    if (v === 'charm') {
      [4, 6, 8].forEach(function (k, n) {
        p = pts[k];
        o += line(c, 'M' + r(p[0]) + ' ' + r(p[1] + 4) + 'V' + r(p[1] + 12), 1.6);
        if (n === 1) {
          o += '<path d="M' + r(p[0]) + ' ' + r(p[1] + 34) + 'c-17 -11 -11 -25 0 -17c11 -8 17 6 0 17Z" fill="' + c.M + '"/>';
          o += gem(c, p[0], p[1] + 22, 2.6);
        } else {
          o += gem(c, p[0], p[1] + 19, 5.4);
        }
      });
    }
    return o;
  }

  function chain(c, v) {
    var d1 = 'M48 24C48 132 84 172 100 172C116 172 152 132 152 24';
    var d2 = 'M64 24C64 112 88 144 100 144C112 144 136 112 136 24';
    if (v === 'rope') return line(c, d1, 4.8) + carve(d1, 4.8, '1.4 3.2') + line(c, d2, 3.6) + carve(d2, 3.6, '1.2 2.8');
    if (v === 'curb') return dashed(c, d1, 6.4, '6.6 2.2') + dashed(c, d2, 4.8, '5 1.8');
    if (v === 'figaro') return dashed(c, d1, 5.4, '11 2.4 3.6 2.4 3.6 2.4 3.6 2.4') + dashed(c, d2, 4, '8.5 2 3 2 3 2 3 2');
    return beads(c, d1, 4.4, 6.4) + beads(c, d2, 3.2, 4.8);
  }

  function pendant(c, v) {
    var o = beads(c, 'M38 26C60 96 84 116 100 122C116 116 140 96 162 26', 2.6, 4.2);
    o += '<circle cx="100" cy="126" r="5" fill="none" stroke="' + c.M + '" stroke-width="2.4"/>';
    if (v === 'heart') {
      o += '<path d="M100 176C64 151 75 121 100 138C125 121 136 151 100 176Z" fill="' + c.M + '"/>';
      o += '<path d="M100 169C73 150 81 129 100 143" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1.2"/>';
      o += gem(c, 100, 152, 5);
    } else if (v === 'pearl') {
      o += '<path d="M90 138C92 131 108 131 110 138Z" fill="' + c.M + '"/>';
      o += '<circle cx="100" cy="153" r="16" fill="' + c.G + '"/>';
      o += '<ellipse cx="94" cy="146" rx="5.5" ry="3.4" fill="#fff" opacity=".85" transform="rotate(-30 94 146)"/>';
    } else {
      o += dropGem(c, 100, 131, 42, 16);
      o += '<path d="M95 150C93 158 95 165 99 168" fill="none" stroke="rgba(255,255,255,.6)" stroke-width="1.4" stroke-linecap="round"/>';
    }
    return o;
  }

  function anklet(c) {
    var o = '', k, i, p, y, P, d;
    for (k = 0; k < 2; k++) {
      y = 52 + k * 56;
      d = 'M24 ' + y + 'C60 ' + (y + 46) + ' 140 ' + (y + 46) + ' 176 ' + y;
      P = [24, y, 60, y + 46, 140, y + 46, 176, y];
      o += line(c, d, 4.4) + carve(d, 4.4, '1.3 3');
      for (i = 1; i <= 11; i++) {
        p = cub(P, i / 12);
        o += line(c, 'M' + r(p[0]) + ' ' + r(p[1] + 2) + 'V' + r(p[1] + 7), 1.3);
        o += dot(c, p[0], p[1] + 10.4, 3.6);
      }
      o += '<circle cx="24" cy="' + y + '" r="4" fill="none" stroke="' + c.M + '" stroke-width="2.2"/>' +
           '<circle cx="176" cy="' + y + '" r="4" fill="none" stroke="' + c.M + '" stroke-width="2.2"/>';
    }
    return o;
  }

  function coin(c, v, label) {
    var o = '', i, txt = 'font-family="Georgia,serif" text-anchor="middle" fill="rgba(0,0,0,.5)"';
    label = label || ['FINE', '999'];

    if (v === 'bar') {
      o += '<rect x="56" y="28" width="88" height="144" rx="9" fill="' + c.M + '"/>';
      o += '<rect x="63.5" y="35.5" width="73" height="129" rx="5" fill="none" stroke="rgba(0,0,0,.24)" stroke-width="1.2"/>';
      o += '<rect x="58" y="30" width="84" height="140" rx="7.5" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="1"/>';
      o += '<text x="100" y="78" font-size="10" letter-spacing="3" ' + txt + '>' + esc(label[0]) + '</text>';
      o += '<text x="100" y="112" font-size="25" ' + txt + '>' + esc(label[1]) + '</text>';
      o += '<path d="M78 124H122" stroke="rgba(0,0,0,.3)" stroke-width="1"/>';
      o += '<text x="100" y="144" font-size="12" letter-spacing="1" ' + txt + '>' + esc(label[2] || '') + '</text>';
      return o;
    }

    o += '<circle cx="100" cy="100" r="64" fill="' + c.M + '"/>';
    o += '<circle cx="100" cy="100" r="63" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="1"/>';
    o += '<circle cx="100" cy="100" r="57" fill="none" stroke="rgba(0,0,0,.3)" stroke-width="2.2" stroke-linecap="round" stroke-dasharray="0.01 5.11"/>';
    o += '<circle cx="100" cy="100" r="50" fill="none" stroke="rgba(0,0,0,.22)" stroke-width="1"/>';
    for (i = -2; i <= 2; i++) {
      o += '<path d="M100 112C91 100 93 86 100 78C107 86 109 100 100 112Z" fill="rgba(0,0,0,.16)" stroke="rgba(255,255,255,.45)" stroke-width=".8" transform="rotate(' + (i * 32) + ' 100 112)"/>';
    }
    o += '<path d="M78 118H122" stroke="rgba(0,0,0,.3)" stroke-width="1"/>';
    o += '<text x="100" y="134" font-size="10.5" letter-spacing="2" ' + txt + '>' + esc(label[0] + ' ' + label[1]) + '</text>';
    return o;
  }

  var TYPES = {
    necklace: necklace, set: setPiece, earrings: earrings, ring: ring, bangle: bangle,
    bracelet: bracelet, chain: chain, pendant: pendant, anklet: anklet, coin: coin
  };

  function svg(item) {
    var a = item.art || {};
    var metal = item.metal === 'silver' ? 'silver' : 'gold';
    var m = METAL[metal], g = GEM[a.gem] || GEM.diamond;
    var id = ++uid;
    var c = { M: 'url(#jm' + id + ')', G: 'url(#jg' + id + ')' };
    var draw = TYPES[a.type] || ring;

    return '<svg class="jart" viewBox="0 0 200 200" role="img" aria-label="' + esc(item.name || a.type || 'Jewellery') + '">' +
      '<defs>' +
        '<linearGradient id="jm' + id + '" gradientUnits="userSpaceOnUse" x1="10" y1="0" x2="190" y2="200">' +
          '<stop offset="0" stop-color="' + m[0] + '"/><stop offset=".22" stop-color="' + m[1] + '"/>' +
          '<stop offset=".45" stop-color="' + m[2] + '"/><stop offset=".62" stop-color="' + m[3] + '"/>' +
          '<stop offset=".8" stop-color="' + m[4] + '"/><stop offset="1" stop-color="' + m[5] + '"/>' +
        '</linearGradient>' +
        '<radialGradient id="jg' + id + '" cx=".36" cy=".3" r=".85">' +
          '<stop offset="0" stop-color="' + g[0] + '"/><stop offset=".55" stop-color="' + g[1] + '"/><stop offset="1" stop-color="' + g[2] + '"/>' +
        '</radialGradient>' +
      '</defs>' +
      draw(c, a.variant, a.label) +
      spark(166, 40, 8, 'spk-a') + spark(30, 164, 5.5, 'spk-b') +
    '</svg>';
  }

  window.JewelArt = { svg: svg };
})();

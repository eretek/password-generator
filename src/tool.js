/*! Eretek Online Araçlar #69 — Güvenli Parola ve Passphrase Üretici */
ERT.def('69', {
	rnd: function (n) { // reddetmeli örnekleme ile [0, n)
		var lim = Math.floor(4294967296 / n) * n, a = new Uint32Array(1);
		do { crypto.getRandomValues(a); } while (a[0] >= lim);
		return a[0] % n;
	},
	run: function (v, c) {
		var R = ERT.tools['69'].rnd, out = [], bits, cnt = v.count || 5, msgs = [];
		if (v.mode === 'pp') {
			var C = 'bdfgklmnprstvz'.split(''), V = 'aeiou'.split(''), N = v.words || 5, sep = v.sep === undefined || v.sep === null ? '-' : v.sep;
			var word = function () { var w = ''; for (var i = 0; i < 3; i++) { w += C[R(C.length)] + V[R(V.length)]; } return w; };
			for (var k = 0; k < cnt; k++) { var ws = []; for (var j = 0; j < N; j++) { ws.push(word()); } if (v.digit) { ws.push(String(R(100)).padStart(2, '0')); } out.push(ws.join(sep)); }
			bits = N * 3 * Math.log2(C.length * V.length) + (v.digit ? Math.log2(100) : 0);
			msgs.push(['info', c.t('ppNote', { b: c.n(3 * Math.log2(C.length * V.length), 1) })]);
		} else {
			var S = { u: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', l: 'abcdefghijklmnopqrstuvwxyz', d: '0123456789', s: '!#$%&*+-=?@^_~.,:;' }, amb = /[O0Il1|]/g, sets = [];
			if (v.up) { sets.push(S.u); } if (v.low) { sets.push(S.l); } if (v.dig) { sets.push(S.d); } if (v.sym) { sets.push(S.s); }
			if (!sets.length) { throw c.fe('up', 'noSet'); }
			if (v.noamb) { sets = sets.map(function (s) { return s.replace(amb, ''); }); }
			if (v.len < sets.length) { throw c.fe('len', 'short', { n: sets.length }); }
			var pool = sets.join('');
			for (var q = 0; q < cnt; q++) {
				var p;
				do { p = ''; for (var i2 = 0; i2 < v.len; i2++) { p += pool[R(pool.length)]; } } while (!sets.every(function (s) { return p.split('').some(function (ch) { return s.indexOf(ch) !== -1; }); }));
				out.push(p);
			}
			bits = v.len * Math.log2(pool.length);
			msgs.push(['info', c.t('pwNote', { n: pool.length })]);
		}
		var lvl = bits >= 100 ? 'ok' : (bits >= 70 ? 'ok' : (bits >= 50 ? 'warn' : 'err'));
		msgs.unshift([lvl, c.t(bits >= 100 ? 'e_vh' : (bits >= 70 ? 'e_h' : (bits >= 50 ? 'e_m' : 'e_l')), { b: c.n(bits, 0) })]);
		msgs.push(['info', c.t('local')]);
		return { big: out[0], pre: { text: out.join('\n') }, msgs: msgs, kv: [[c.t('entropy'), c.n(bits, 1) + ' bit']], x: { copy: out.join('\n') }, v: { list: out, bits: Math.round(bits * 10) / 10 } };
	}
});

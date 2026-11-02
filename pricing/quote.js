// Live quote on the pricing page. Prices live here and in the page copy; keep them in sync.
// The chosen package and add-ons are kept in the URL (?plan=booking&add=missed,reviews),
// so a quote can be copied and sent to an owner.
(function () {
  var form = document.getElementById('quote');
  if (!form) return;

  var PLANS = {
    starter: { name: 'Starter Site', setup: 200, monthly: 35 },
    booking: { name: 'Site + Booking', setup: 400, monthly: 50 }
  };
  var ADDS = {
    missed: { name: 'Missed-call text-back', setup: 150 },
    reviews: { name: 'Automatic review requests', setup: 100 }
  };

  var $ = function (id) { return document.getElementById(id); };
  var money = function (n) { return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 2 }); };
  var half = function (n) { return Math.round(n / 2 * 100) / 100; };

  // Date stamp, in New York time
  try {
    $('quote-date').textContent = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'America/New_York' });
  } catch (e) {}

  // Read a quote from the URL, if one was sent
  var params = new URLSearchParams(location.search);
  var planParam = params.get('plan');
  if (PLANS[planParam]) form.querySelector('input[name=plan][value=' + planParam + ']').checked = true;
  (params.get('add') || '').split(',').forEach(function (k) {
    if (ADDS[k]) form.querySelector('input[name=add][value=' + k + ']').checked = true;
  });

  // Twelve month bars, built once
  var bars = $('q-bars');
  for (var i = 1; i <= 12; i++) {
    var col = document.createElement('div');
    col.className = 'q-col';
    col.innerHTML = '<div class="q-stack"><i class="q-seg-setup"></i><i class="q-seg-month"></i></div><span>' + i + '</span>';
    bars.appendChild(col);
  }
  var cols = bars.querySelectorAll('.q-col');

  function state() {
    var plan = form.querySelector('input[name=plan]:checked').value;
    var adds = Array.from(form.querySelectorAll('input[name=add]:checked'), function (el) { return el.value; });
    return { plan: plan, adds: adds };
  }

  function render() {
    var s = state();
    var p = PLANS[s.plan];
    var items = [{ name: p.name + ' setup', amt: p.setup }];
    s.adds.forEach(function (k) { items.push({ name: ADDS[k].name, amt: ADDS[k].setup }); });
    var setup = items.reduce(function (t, it) { return t + it.amt; }, 0);
    var first = half(setup);
    var year = setup + p.monthly * 12;

    $('q-items').innerHTML = items.map(function (it) {
      return '<li><span>' + it.name + '</span><span>' + money(it.amt) + '</span></li>';
    }).join('');
    $('q-setup').textContent = money(setup);
    $('q-half1').textContent = money(first);
    $('q-half2').textContent = money(setup - first);
    $('q-month').textContent = money(p.monthly);
    $('q-year').textContent = money(year);

    // Month 1 carries the setup fee plus the first monthly fee; bars share one scale
    var max = setup + p.monthly;
    cols.forEach(function (col, idx) {
      var su = idx === 0 ? setup : 0;
      col.querySelector('.q-seg-setup').style.height = (su / max * 100) + '%';
      col.querySelector('.q-seg-month').style.height = (p.monthly / max * 100) + '%';
      col.title = 'Month ' + (idx + 1) + ': ' + money(su + p.monthly);
    });

    // Email link carries the quote
    var lines = items.map(function (it) { return '- ' + it.name + ': ' + money(it.amt); });
    var body = 'Hi Pierce,\n\nI\'d like a free mockup for my business. This is the quote I put together:\n\n' +
      lines.join('\n') + '\n\nSetup: ' + money(setup) + ' (half to start, half at launch)\nThen ' + money(p.monthly) + ' a month\n\n' +
      'Business name:\nWhat we do:\n';
    $('q-email').href = 'mailto:pierce@regularsnyc.co?subject=' + encodeURIComponent('Free mockup: ' + p.name) + '&body=' + encodeURIComponent(body);

    // Keep the URL in step so it can be shared
    var q = new URLSearchParams();
    q.set('plan', s.plan);
    if (s.adds.length) q.set('add', s.adds.join(','));
    try { history.replaceState(null, '', location.pathname + '?' + q.toString().replace(/%2C/g, ',')); } catch (e) {}
    $('q-copied').textContent = '';
  }

  form.addEventListener('change', render);
  render();

  $('q-copy').addEventListener('click', function () {
    var url = location.href;
    var done = function () { $('q-copied').textContent = 'Link copied. Anyone who opens it sees this quote.'; };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () { $('q-copied').textContent = url; });
    } else {
      $('q-copied').textContent = url;
    }
  });
})();

// Printing the page opens every answer so the PDF is complete
window.addEventListener('beforeprint', function () {
  document.querySelectorAll('.faq details').forEach(function (d) { d.open = true; });
});

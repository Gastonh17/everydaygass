/* EverydayGass — 12-week checkout. Paste a Stripe Payment Link to go live. */
(function (root) {
  const CONTACT = "hello@everydaygass.com";
  const STRIPE = {
    plan12: "",
    premium: ""
  };

  function profileBody(profile, product) {
    const premium = product === "premium";
    const lines = [
      premium
        ? "I’d like to start the 12-week Premium Hybrid Plan (€249)."
        : "I’d like to start the 12-week Hybrid Plan (€129).",
      ""
    ];
    (root.EGProfile?.summaryLines(profile) || []).forEach((line) => lines.push(line));
    return lines.join("\n");
  }

  function mailto(profile, product) {
    const premium = product === "premium";
    const subject = encodeURIComponent(
      premium ? "Start my 12-week Premium Hybrid Plan" : "Start my 12-week Hybrid Plan"
    );
    const body = encodeURIComponent(profileBody(profile, product));
    return `mailto:${CONTACT}?subject=${subject}&body=${body}`;
  }

  function url(profile, product) {
    const key = product === "premium" ? "premium" : "plan12";
    return STRIPE[key] || mailto(profile, product);
  }

  function start(profile, product) {
    const href = url(profile, product);
    if (typeof location !== "undefined") location.href = href;
    return href;
  }

  function usesStripe(product) {
    const key = product === "premium" ? "premium" : "plan12";
    return Boolean(STRIPE[key]);
  }

  const api = { CONTACT, STRIPE, profileBody, mailto, url, start, usesStripe };
  root.EGCheckout = api;
  if (typeof module !== "undefined") module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

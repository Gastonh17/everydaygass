/* Sales page — duration toggle, FAQ, mailto checkout, 1:1 form. */
(function () {
  const CONTACT = "hello@everydaygass.com";
  const PRICES = {
    8: {
      core: { eur: "€99", chf: "CHF 95", week: "CHF 11.88 / week · €12.38 / week" },
      plus: { eur: "€249", chf: "CHF 235", week: "CHF 29.38 / week · €31.13 / week" }
    },
    16: {
      core: { eur: "€179", chf: "CHF 169", week: "CHF 10.56 / week · €11.19 / week" },
      plus: { eur: "€449", chf: "CHF 419", week: "CHF 26.19 / week · €28.06 / week" }
    },
    24: {
      core: { eur: "€249", chf: "CHF 235", week: "CHF 9.79 / week · €10.38 / week" },
      plus: { eur: "€635", chf: "CHF 595", week: "CHF 24.79 / week · €26.46 / week" }
    }
  };

  let weeks = 8;

  function paintPrices() {
    const pack = PRICES[weeks];
    document.querySelectorAll("[data-price]").forEach((node) => {
      const kind = node.dataset.price;
      const field = node.dataset.field;
      node.textContent = pack[kind][field];
    });
    document.querySelectorAll("[data-weeks-label]").forEach((node) => {
      node.textContent = `${weeks} weeks`;
    });
  }

  function mailto(offer) {
    const subject = encodeURIComponent(`EverydayGass — ${offer} — ${weeks} weeks`);
    const body = encodeURIComponent(
      `Hi Gaston,\n\nI want to start with ${offer} (${weeks} weeks).\n\nName:\nCity / country:\nGoal:\n`
    );
    location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`;
  }

  document.querySelectorAll("[data-cycle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      weeks = Number(btn.dataset.cycle);
      document.querySelectorAll("[data-cycle]").forEach((b) => b.classList.toggle("is-on", b === btn));
      paintPrices();
    });
  });

  document.querySelectorAll("[data-buy]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      mailto(btn.dataset.buy);
    });
  });

  document.querySelectorAll("[data-faq] .item button").forEach((btn) => {
    btn.addEventListener("click", () => btn.parentElement.classList.toggle("is-open"));
  });

  const form = document.querySelector("[data-oneone]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const subject = encodeURIComponent("EverydayGass Method — more info");
      const body = encodeURIComponent(
        `Hi Gaston,\n\nI’d like more info on EverydayGass Method and to book a call.\n\nName: ${data.name || ""}\nEmail: ${data.email || ""}\nGoal: ${data.goal || ""}\nExperience: ${data.experience || ""}\nDays: ${data.days || ""}\n`
      );
      location.href = `mailto:${CONTACT}?subject=${subject}&body=${body}`;
      form.classList.add("is-sent");
    });
  }

  const sticky = document.querySelector(".sales-sticky");
  const call = document.querySelector("#call");
  if (sticky && call && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      sticky.style.display = entries[0].isIntersecting ? "none" : "";
    }, { threshold: 0.15 });
    io.observe(call);
  }

  paintPrices();
})();

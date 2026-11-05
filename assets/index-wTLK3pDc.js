/**
 * Al-Amin Khan - Portfolio Single Page Application
 * Ultra-Responsive, High-Performance Interactive Portfolio Engine
 */

(async function initPortfolio() {
  // 1. Immediately dismiss bootstrap loader
  function removeLoader() {
    const loader = document.getElementById('bootstrap-loader');
    if (loader) {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 250);
    }
  }

  // 2. Fetch or load Database
  let db = null;
  try {
    const rawGlobal = localStorage.getItem("site_config_global");
    if (rawGlobal) {
      db = {
        siteConfigGlobal: JSON.parse(rawGlobal),
        siteConfigSeo: JSON.parse(localStorage.getItem("site_config_seo") || "{}"),
        projects: JSON.parse(localStorage.getItem("db_projects") || "[]"),
        blogPosts: JSON.parse(localStorage.getItem("db_blogPosts") || "[]"),
        services: JSON.parse(localStorage.getItem("db_services") || "[]"),
        skills: JSON.parse(localStorage.getItem("db_skills") || "[]"),
        testimonials: JSON.parse(localStorage.getItem("db_testimonials") || "[]"),
        resume: JSON.parse(localStorage.getItem("db_resume") || "[]"),
        pricingPlans: JSON.parse(localStorage.getItem("db_pricingPlans") || "[]"),
        products: JSON.parse(localStorage.getItem("db_products") || "[]"),
        contactSubmissions: JSON.parse(localStorage.getItem("db_contactSubmissions") || "[]")
      };
    }
  } catch (e) {
    console.warn("Could not parse localStorage DB:", e);
  }

  try {
    const res = await fetch('/assets/db.json?v=' + Date.now());
    if (res.ok) {
      const serverDb = await res.json();
      db = serverDb;
      try {
        if (db.blogPosts) localStorage.setItem("db_blogPosts", JSON.stringify(db.blogPosts));
        if (db.projects) localStorage.setItem("db_projects", JSON.stringify(db.projects));
        if (db.pricingPlans) localStorage.setItem("db_pricingPlans", JSON.stringify(db.pricingPlans));
        if (db.services) localStorage.setItem("db_services", JSON.stringify(db.services));
        if (db.skills) localStorage.setItem("db_skills", JSON.stringify(db.skills));
        if (db.testimonials) localStorage.setItem("db_testimonials", JSON.stringify(db.testimonials));
        if (db.resume) localStorage.setItem("db_resume", JSON.stringify(db.resume));
        if (db.products) localStorage.setItem("db_products", JSON.stringify(db.products));
        if (db.faqs) localStorage.setItem("db_faqs", JSON.stringify(db.faqs));
      } catch (err) { }
    }
  } catch (e) {
    console.error("Failed to fetch /assets/db.json:", e);
  }

  const root = document.getElementById('root');
  if (!root) {
    console.error("No #root container found.");
    removeLoader();
    return;
  }

  // High quality SVG Icons
  const icons = {
    check: '<svg class="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',
    arrowRight: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>',
    download: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>',
    sparkles: '<svg class="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>',
    sun: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>',
    moon: '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>',
    menu: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>',
    close: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>',
    star: '<svg class="w-4 h-4 text-amber-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>',
    whatsapp: '<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.993.541 1.94.828 2.796.829 3.184 0 5.77-2.587 5.771-5.766.001-3.181-2.585-5.766-5.771-5.766zm10.155 5.766c-.002 5.617-4.57 10.184-10.186 10.184-1.787 0-3.486-.466-4.975-1.282l-5.695 1.493 1.523-5.556c-.902-1.537-1.378-3.307-1.378-5.127.002-5.617 4.57-10.185 10.186-10.185 5.618 0 10.185 4.568 10.185 10.185zm-5.068 4.298c-.281-.141-1.66-.82-1.921-.914-.26-.095-.449-.141-.638.141-.189.282-.733.914-.898 1.103-.166.189-.331.212-.612.071-.282-.142-1.189-.438-2.264-1.397-.837-.746-1.402-1.668-1.567-1.95-.165-.282-.018-.435.123-.575.127-.126.282-.33.423-.495.142-.165.189-.282.283-.471.094-.189.047-.354-.024-.495-.071-.141-.638-1.538-.874-2.106-.23-.553-.464-.478-.638-.487l-.543-.01c-.189 0-.495.071-.754.354-.26.282-.99.968-.99 2.36s1.013 2.738 1.155 2.926c.142.189 1.994 3.045 4.831 4.269.675.291 1.202.465 1.613.595.678.216 1.295.186 1.783.113.545-.082 1.66-.679 1.896-1.334.236-.655.236-1.216.165-1.334-.07-.118-.259-.189-.54-.33z"/></svg>',
    settings: '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    pin: '<svg class="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
    mail: '<svg class="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>',
    phone: '<svg class="w-5 h-5 text-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>'
  };

  // State
  let currentCurrency = localStorage.getItem('portfolio_pricing_currency') || 'BDT'; // 'BDT' or 'USD'
  let isLightMode = localStorage.getItem('portfolio_theme') === 'light';

  if (isLightMode) {
    document.body.classList.add('light-mode');
  } else {
    document.body.classList.remove('light-mode');
  }

  // Fallback plans helper
  const plans = [
    {
      name: "Basic Package",
      category: "Starter / Small Business",
      badge: "Starter Business",
      target: "For small e-commerce businesses or local pages that need consistent sales with a lean budget.",
      priceBdt: "10,000 - 12,000 BDT",
      priceUsd: "$100 - $120 USD",
      cycleBdt: "/ month",
      cycleUsd: "/ month",
      buttonText: "Start Basic Plan",
      buttonUrl: "https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20the%20Basic%20Package.",
      features: [
        "1 Ad Platform Management (Meta or Google Ads)",
        "Campaign Setup & Management (1-2 Campaigns)",
        "Basic Pixel Setup & Configuration",
        "Audience Targeting & Ad Creative Optimization",
        "Monthly In-depth Performance Report"
      ]
    },
    {
      name: "Intermediate Package",
      category: "E-Commerce Growth",
      badge: "Best Value / Most Popular",
      accent: true,
      target: "For scaling businesses that require high-ROAS ads and accurate server-side conversion tracking.",
      priceBdt: "20,000 - 25,000 BDT",
      priceUsd: "$200 - $250 USD",
      cycleBdt: "/ month",
      cycleUsd: "/ month",
      buttonText: "Get Best Value Plan",
      buttonUrl: "https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20the%20Intermediate%20Package.",
      features: [
        "2 Ad Platforms Management (Meta and Google Ads)",
        "Advanced Tracking (GTM & Server-Side Tracking / CAPI)",
        "GA4 E-Commerce Event Funnel Tracking (Purchase, Add to Cart)",
        "Full Retargeting Campaigns & Dynamic Sales Funnels",
        "High-Converting Ad Copy & Creative Direction",
        "Bi-weekly Strategy & Performance Reports"
      ]
    },
    {
      name: "Premium Package",
      category: "Full Stack Marketing",
      badge: "Enterprise Full-Stack",
      target: "For large brands and scaling companies needing full-funnel ad management, advanced analytics, and SEO.",
      priceBdt: "35,000 - 40,000 BDT",
      priceUsd: "$350 - $400 USD",
      cycleBdt: "/ month",
      cycleUsd: "/ month",
      buttonText: "Scale to Premium",
      buttonUrl: "https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20the%20Premium%20Package.",
      features: [
        "Multi-Channel Ads Management (Meta, Google, LinkedIn)",
        "Advanced Data Tracking & Live Looker Studio Dashboard",
        "Email Marketing Automation & B2B Lead Generation",
        "Website & WordPress Management Technical Support",
        "On-Page & Technical SEO Audit and Continuous Fixes",
        "Priority 24/7 Support & Weekly Growth Meetings"
      ]
    }
  ];

  // Web Development & Design Packages (Top Set)
  const webPlans = [
    {
      name: "Basic Package",
      category: "Landing Page / Portfolio",
      badge: "Starter Web",
      target: "1-2 page layout, premium theme setup, mobile-responsive design, and contact form integration.",
      priceBdt: "5,000 - 8,000 BDT",
      priceUsd: "$50 - $80 USD",
      cycleBdt: "/ project",
      cycleUsd: "/ project",
      buttonText: "Order Basic Plan",
      buttonUrl: "https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20the%20Basic%20Package%20(Landing%20Page/Portfolio).",
      features: [
        "1-2 page layout",
        "Premium theme setup",
        "Mobile-responsive design",
        "Contact form integration"
      ]
    },
    {
      name: "Intermediate Package",
      category: "Business Website",
      badge: "Best Value / Most Popular",
      accent: true,
      target: "3-5 page business site, custom Elementor design, basic SEO, speed optimization, and social media integration.",
      priceBdt: "10,000 - 15,000 BDT",
      priceUsd: "$100 - $150 USD",
      cycleBdt: "/ project",
      cycleUsd: "/ project",
      buttonText: "Get Best Value Plan",
      buttonUrl: "https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20the%20Intermediate%20Package%20(Business%20Website).",
      features: [
        "3-5 page business site",
        "Custom Elementor design",
        "Basic SEO",
        "Speed optimization",
        "Social media integration"
      ]
    },
    {
      name: "Premium Package",
      category: "E-commerce Store",
      badge: "Full E-Commerce Solution",
      target: "Complete WooCommerce setup (e.g., WoodMart), payment gateway integration, 20-30 product uploads, and bonus basic Pixel setup for future ads.",
      priceBdt: "20,000 - 25,000 BDT",
      priceUsd: "$200 - $250 USD",
      cycleBdt: "/ project",
      cycleUsd: "/ project",
      buttonText: "Scale to Premium",
      buttonUrl: "https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20the%20Premium%20Package%20(E-commerce%20Store).",
      features: [
        "Complete WooCommerce setup (e.g., WoodMart)",
        "Payment gateway integration",
        "20-30 product uploads",
        "Bonus basic Pixel setup for future ads"
      ]
    }
  ];

  function renderVideoEmbed(url) {
    if (!url || !url.trim()) {
      return `
        <div class="w-full h-full flex flex-col items-center justify-center text-gray-400 p-6 text-center">
          <svg class="w-16 h-16 text-accent/60 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span class="text-sm font-semibold">Video will be available soon</span>
        </div>
      `;
    }
    url = url.trim();
    const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return `<iframe src="https://www.youtube-nocookie.com/embed/${ytMatch[1]}?rel=0&modestbranding=1" class="w-full h-full border-0 rounded-2xl" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    }
    const vmMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)/i);
    if (vmMatch && vmMatch[3]) {
      return `<iframe src="https://player.vimeo.com/video/${vmMatch[3]}?title=0&byline=0&portrait=0" class="w-full h-full border-0 rounded-2xl" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    }
    return `<video src="${url}" controls preload="metadata" playsinline class="w-full h-full object-cover rounded-2xl bg-black"></video>`;
  }

  function renderPricingCard(p, isWeb, idx) {
    const isBestValue = !!p.accent || (p.badge && p.badge.toLowerCase().includes('best value'));
    const borderClass = isBestValue ? 'border-2 border-accent shadow-2xl shadow-accent/25' : 'border border-white/5 hover:border-accent/30 shadow-xl';

    // Top badge pill (Guaranteed Horizontally Centered in Middle of Box)
    const badgeText = p.badge || (isWeb ? 'Web Solution' : 'Marketing Plan');
    const badgeHTML = `
      <div class="pricing-badge-wrapper" style="position:absolute; top:-16px; left:0; right:0; width:100%; display:flex; justify-content:center; align-items:center; z-index:30; pointer-events:none; margin:0 auto; text-align:center;">
        <div class="pricing-badge-pill ${isBestValue ? 'pricing-badge-best' : 'pricing-badge-standard'}" style="display:inline-flex; align-items:center; justify-content:center; gap:6px; padding:6px 18px; border-radius:9999px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; line-height:1; margin:0 auto; white-space:nowrap;">
          ${icons.sparkles}
          <span>${badgeText}</span>
        </div>
      </div>
    `;

    const defaultCycle = isWeb ? '/ project' : '/ month';
    const priceValClass = isBestValue ? 'text-accent' : 'text-white';
    const btnClass = isBestValue ? 'pricing-btn-primary' : 'pricing-btn-secondary';

    const cleanTitle = p.name ? p.name.replace(/\s*\(.*?\)/, '').trim() : 'Package';
    let categoryText = p.category;
    if (!categoryText) {
      if (p.name && p.name.includes('(')) {
        const match = p.name.match(/\((.*?)\)/);
        if (match) categoryText = match[1];
      }
    }
    if (!categoryText) {
      categoryText = isWeb ? 'Website Solution' : 'Marketing Solution';
    }

    const currentPrice = (currentCurrency === 'BDT' ? p.priceBdt : p.priceUsd) || p.priceBdt;
    const currentCycle = (currentCurrency === 'BDT' ? p.cycleBdt : p.cycleUsd) || defaultCycle;

    return `
      <div class="pricing-card-box relative rounded-3xl pt-12 pb-8 px-6 md:px-8 bg-[#121824] ${borderClass} transition-all duration-300 flex flex-col justify-between reveal-on-scroll card-hover-interactive h-full"
           data-plan-name="${cleanTitle} (${categoryText})"
           data-base-btn-text="${p.buttonText || (isBestValue ? 'Get Best Value Plan' : 'Start Plan')}"
           data-base-price-bdt="${p.priceBdt || ''}"
           data-base-price-usd="${p.priceUsd || ''}">

        ${badgeHTML}

        <div class="flex-grow flex flex-col justify-between">
          <div>
            <!-- Package Header (Strictly Centered in Middle of Every Box) -->
            <div class="pricing-card-header mb-5 text-center flex flex-col items-center justify-center w-full" style="text-align:center !important;align-items:center !important;justify-content:center !important;">
              <div class="flex items-center justify-center gap-2 mb-2 h-6 w-full text-center" style="justify-content:center !important;text-align:center !important;">
                <span class="pricing-card-category text-xs font-black text-accent uppercase tracking-widest text-center block w-full" style="text-align:center !important;">${categoryText}</span>
                <span class="custom-count-badge hidden text-[11px] font-bold px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/25"></span>
              </div>
              <h3 class="pricing-card-title text-xl sm:text-2xl font-black text-white leading-tight h-14 flex items-center justify-center text-center w-full" style="text-align:center !important;justify-content:center !important;">${cleanTitle}</h3>
              <p class="pricing-card-target text-sm text-gray-400 mt-2 min-h-[95px] leading-relaxed flex items-center justify-center text-center w-full" style="text-align:center !important;justify-content:center !important;">
                ${p.target || ''}
              </p>
            </div>

            <!-- Price Display (Flush Aligned Box across all 3 cards with fixed 105px height & whitespace-nowrap) -->
            <div class="py-3 px-4 rounded-2xl ${isBestValue ? 'bg-accent/10 border border-accent/25' : 'bg-white/[0.03] border border-white/5'} mb-6 text-center h-[105px] flex flex-col justify-center items-center">
              <div class="pricing-val text-xl sm:text-2xl md:text-[26px] font-black ${priceValClass} whitespace-nowrap tracking-tight transition-all duration-300"
                   data-bdt="${p.priceBdt || ''}"
                   data-usd="${p.priceUsd || ''}">
                ${currentCurrency === 'BDT' ? (p.priceBdt || '') : (p.priceUsd || '')}
              </div>
              <!-- Secondary / Equivalent currency line so USD is ALWAYS visible! -->
              <div class="pricing-secondary text-xs sm:text-sm text-cyan-400 font-bold block mt-1 tracking-wide"
                   data-bdt="${p.priceUsd || ''}"
                   data-usd="${p.priceBdt || ''}">
                ${currentCurrency === 'BDT' ? (p.priceUsd || '') : (p.priceBdt || '')}
              </div>
              <span class="text-[11px] text-gray-400 font-semibold block mt-0.5 pricing-cycle"
                    data-bdt="${p.cycleBdt || defaultCycle}"
                    data-usd="${p.cycleUsd || defaultCycle}">
                ${currentCycle}
              </span>
            </div>

            <!-- Interactive Deliverables List (Square Checkboxes) with min-h-[220px] -->
            <div class="mb-6 text-left min-h-[220px] flex flex-col justify-start">
              <div class="flex items-center justify-between mb-3 px-1">
                <span class="text-xs font-bold text-gray-300 uppercase tracking-wider">Included Deliverables:</span>
                <span class="text-[11px] text-accent font-semibold font-mono">click box to toggle</span>
              </div>
              <ul class="space-y-1.5 text-sm">
                ${(p.features || []).map(f => `
                  <li class="custom-feature-item flex items-start gap-3 p-2 rounded-xl hover:bg-white/5 transition-all duration-150 cursor-pointer select-none group"
                      data-feature="${f}"
                      data-included="true"
                      title="Click square box to include/exclude this deliverable">
                    <div class="checkbox-square w-5 h-5 rounded-md border-2 border-accent bg-accent flex items-center justify-center text-white shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110 shadow-sm shadow-accent/20">
                      <svg class="w-3.5 h-3.5 checkmark-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div class="flex-grow pt-0.5">
                      <span class="feature-text text-sm text-gray-200 font-medium leading-snug transition-colors block">${f}</span>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>

          <!-- CTA Button (Pinned to bottom baseline) -->
          <div class="pt-2 mt-auto">
            <a href="${p.buttonUrl || 'https://wa.me/8801971708689'}" target="_blank" rel="noopener"
               class="pricing-cta-btn ${btnClass} group">
              ${icons.whatsapp}
              <span class="btn-text">${p.buttonText || (isBestValue ? 'Get Best Value Plan' : 'Start Plan')}</span>
            </a>
          </div>
        </div>

      </div>
    `;
  }
  // Render Full Application Structure
  root.innerHTML = `
    <!-- MAIN WRAPPER -->
    <div class="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans transition-colors duration-300">
      
      <!-- HEADER / NAVBAR: ONLY Home, About, Service, Meta Ads, Contacts, Blog & Day/Night Toggle -->
      <header id="main-header" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md bg-[#0b0f19]/85 border-b border-white/5">
        <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          <!-- Logo -->
          <a href="/#home" class="flex items-center gap-3 group">
            <img src="${(db.siteConfigGlobal && db.siteConfigGlobal.siteLogo) || '/assets/logo.png'}" alt="Al-Amin Khan Logo" class="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </a>

          <!-- Desktop Navigation with Active Indicator Bar & Scrollspy -->
          <nav class="hidden lg:flex items-center gap-7 text-sm font-semibold text-gray-300" id="desktop-navbar-nav">
            <a href="/#home" data-nav-section="home" class="nav-item-link hover:text-accent transition-all relative py-2">Home</a>
            <a href="/#about" data-nav-section="about" class="nav-item-link hover:text-accent transition-all relative py-2">About</a>
            <a href="/#services" data-nav-section="services" class="nav-item-link hover:text-accent transition-all relative py-2">Service</a>
            <a href="/#pricing" data-nav-section="pricing" class="nav-item-link hover:text-accent transition-all relative py-2">Pricing</a>
            <a href="/#meta-ads" data-nav-section="meta-ads" class="nav-item-link hover:text-accent transition-all relative py-2">Meta Ads</a>
            <a href="/#testimonials" data-nav-section="testimonials" class="nav-item-link hover:text-accent transition-all relative py-2">Reviews</a>
            <a href="/#faq" data-nav-section="faq" class="nav-item-link hover:text-accent transition-all relative py-2">FAQ</a>
            <a href="/#blog" data-nav-section="blog" class="nav-item-link hover:text-accent transition-all relative py-2">Blog</a>
            <a href="/#contact" data-nav-section="contact" class="nav-item-link hover:text-accent transition-all relative py-2">Contacts</a>
          </nav>

          <!-- Right Controls: Day / Night Option ONLY -->
          <div class="flex items-center gap-4">
            <!-- Day / Night Theme Toggle Button -->
            <button id="theme-toggle-btn" type="button" aria-label="Toggle Day / Night Mode" title="Toggle Day / Night Mode" class="p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-accent text-gray-300 hover:text-accent transition-all duration-300 shadow-md">
              ${isLightMode ? icons.moon : icons.sun}
            </button>

            <!-- Mobile Hamburger Toggle Button -->
            <button id="mobile-menu-toggle" type="button" aria-label="Open Navigation Menu" class="lg:hidden p-2 text-gray-300 hover:text-white">
              ${icons.menu}
            </button>
          </div>
        </div>

        <!-- Mobile Drawer: Strictly Home, About, Service, Meta Ads, Contacts, Blog & Day/Night -->
        <div id="mobile-drawer" class="lg:hidden hidden bg-[#0b0f19] border-b border-white/10 px-6 py-6 transition-all duration-300">
          <div class="flex flex-col gap-4 text-base font-medium text-gray-200">
            <a href="/#home" class="mobile-nav-link hover:text-accent py-1 font-semibold">Home</a>
            <a href="/#about" class="mobile-nav-link hover:text-accent py-1 font-semibold">About</a>
            <a href="/#services" class="mobile-nav-link hover:text-accent py-1 font-semibold">Service</a>
            <a href="/#pricing" class="mobile-nav-link hover:text-accent py-1 font-semibold">Pricing</a>
            <a href="/#meta-ads" class="mobile-nav-link hover:text-accent py-1 font-semibold">Meta Ads</a>
            <a href="/#testimonials" class="mobile-nav-link hover:text-accent py-1 font-semibold">Reviews</a>
            <a href="/#faq" class="mobile-nav-link hover:text-accent py-1 font-semibold">FAQ</a>
            <a href="/#blog" class="mobile-nav-link hover:text-accent py-1 font-semibold">Blog</a>
            <a href="/#contact" class="mobile-nav-link hover:text-accent py-1 font-semibold">Contacts</a>
            <div class="pt-3 border-t border-white/10 flex items-center justify-between">
              <span class="text-sm text-gray-400">Day / Night Mode</span>
              <button id="mobile-theme-toggle" type="button" aria-label="Toggle Theme" class="p-2 rounded-full bg-white/5 border border-white/10 text-gray-300 hover:text-accent">
                ${isLightMode ? icons.moon : icons.sun}
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- MAIN CONTENT -->
      <main class="flex-grow">
        
                        <!-- HERO SECTION (#home) - Restored Original Suit Profile Image & Continuous Rotating Double Circles -->
        <section id="home" class="relative min-h-[92vh] flex items-center pt-28 pb-16 px-6 overflow-hidden bg-[#070b14]">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <!-- Corner Cyber Net Grid Patterns -->
          <div class="hero-corner-grid hero-corner-grid-tl pointer-events-none"></div>
          <div class="hero-corner-grid hero-corner-grid-br pointer-events-none"></div>
          
          <!-- Background Ambient Glows -->
          <div class="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-accent/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-ambient-glow"></div>
          <div class="absolute bottom-10 right-10 w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none -z-10 animate-ambient-glow" style="animation-delay: -4s;"></div>

          <div class="max-w-7xl mx-auto w-full relative z-10 py-6">
            <div class="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              <!-- Left Column: Kicker, Headline with Al-Amin on top & Khan underneath, Subtitle, Buttons -->
              <div class="lg:col-span-7 space-y-6">
                <!-- Status Badge -->
                <div class="reveal-on-scroll inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  ${(db.siteConfigGlobal && db.siteConfigGlobal.heroAvailability) || 'Available for projects'}
                </div>

                <!-- Kicker Header (Cyan bold uppercase tracking) -->
                <p class="reveal-on-scroll text-accent text-xs sm:text-sm font-black tracking-[0.28em] uppercase">
                  ${(db.siteConfigGlobal && db.siteConfigGlobal.brandTagline) || 'GROWTH STRATEGIST & PERFORMANCE MARKETER'}
                </p>

                <!-- Giant Headline: HELLO, I'M / AL-AMIN / KHAN. (Enlarged bolder styling) -->
                <h1 class="reveal-on-scroll text-6xl sm:text-8xl lg:text-[116px] xl:text-[128px] 2xl:text-[136px] font-black font-sans tracking-tight text-white leading-[1.0] uppercase select-none">
                  <span style="display:block !important; margin-bottom: 4px;">HELLO, I'M</span>
                  <span class="text-accent" style="display:block !important;">${(db.siteConfigGlobal && db.siteConfigGlobal.heroHeading1) || 'AL-AMIN'}</span>
                  <span class="text-accent" style="display:block !important;">${(db.siteConfigGlobal && db.siteConfigGlobal.heroHeading2) || 'KHAN.'}</span>
                </h1>

                <!-- Subtitle -->
                <p class="reveal-on-scroll text-base sm:text-lg text-gray-300 max-w-xl leading-relaxed">
                  ${(db.siteConfigGlobal && db.siteConfigGlobal.heroSubtitle) || 'A Performance Marketing Specialist & Growth Strategist scaling e-commerce brands with high-ROAS Meta Ads, server-side CAPI tracking architectures, and high-conversion web experiences.'}
                </p>

                <!-- Action Buttons: Rounded-xl buttons matching reference -->
                <div class="reveal-on-scroll flex flex-wrap items-center gap-4 pt-2">
                  <a href="https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20discussing%20a%20project." target="_blank" rel="noopener" class="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#00c6ff] to-[#0072ff] hover:from-[#00b4eb] hover:to-[#005ecc] text-white font-bold text-sm tracking-wide shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all">
                    <span>Let''s Discuss</span>
                  </a>
                  <a href="${(db.siteConfigGlobal && db.siteConfigGlobal.cvUrl) || '/assets/Al-Amin_Khan_CV.pdf'}" download class="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:border-accent text-white font-bold text-sm tracking-wide hover:bg-white/10 hover:-translate-y-0.5 transition-all">
                    <span>Download CV</span>
                  </a>
                </div>
              </div>

              <!-- Right Column: Re-created Showcase Profile Card matching reference design -->
              <div class="lg:col-span-5 flex justify-center items-center relative py-6">
                <!-- Dual Orbital Accent Rings -->
                <div class="hero-orbit-ring hero-orbit-ring-outer pointer-events-none"></div>
                <div class="hero-orbit-ring hero-orbit-ring-inner pointer-events-none"></div>

                <!-- Main Showcase Card matching reference design -->
                <div class="hero-card-walid reveal-on-scroll relative z-10 w-full max-w-[340px] sm:max-w-[380px] h-[490px] sm:h-[530px] rounded-[32px] overflow-hidden bg-[#0c111e] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] card-hover-interactive group">
                  <!-- Crimson Radial Glow Backdrop -->
                  <div class="hero-card-walid-glow absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(200,25,35,0.55)_0%,rgba(12,17,30,0.95)_70%)] pointer-events-none"></div>

                  <!-- Bold Condensed Watermark Behind Portrait: AL-AMIN -->
                  <div class="hero-card-watermark select-none pointer-events-none">${(db.siteConfigGlobal && db.siteConfigGlobal.heroHeading1) || 'AL-AMIN'}</div>

                  <!-- Cutout Portrait Photo of Al-Amin -->
                  <div class="absolute inset-x-0 bottom-0 top-10 flex items-end justify-center overflow-hidden z-10 pointer-events-none">
                    <img src="${(db.siteConfigGlobal && db.siteConfigGlobal.heroCutout) || (db.siteConfigGlobal && db.siteConfigGlobal.footerPortrait) || '/assets/footer-portrait.png'}" alt="Al-Amin Khan" class="h-[96%] w-auto object-contain object-bottom transition-transform duration-700 group-hover:scale-105 drop-shadow-[0_12px_24px_rgba(0,0,0,0.7)]" />
                  </div>

                  <!-- Floating Active Now Status Badge -->
                  <div class="hero-card-badge absolute bottom-4 left-4 right-4 z-20 backdrop-blur-md bg-black/65 border border-white/10 rounded-2xl p-4 shadow-xl select-none">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                      <span class="text-[11px] font-black text-cyan-400 tracking-wider uppercase">ACTIVE NOW</span>
                    </div>
                    <div class="text-xs sm:text-sm font-semibold text-white/95">
                      ${(db.siteConfigGlobal && db.siteConfigGlobal.heroAvailability) || 'Available for projects'}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        <!-- CONTINUOUS MARQUEE TICKER ANIMATION -->
        <div class="w-full py-4 bg-[#121824]/80 border-y border-white/5 overflow-hidden relative select-none">
          <div class="marquee-track flex items-center gap-10 text-xs font-black tracking-[0.25em] uppercase text-gray-400">
            <div class="flex items-center gap-8 whitespace-nowrap shrink-0">
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Meta Ads Specialist</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Google Ads Expert</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Server-Side Tracking (CAPI)</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span> High-ROAS B2B Funnels</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Looker Studio Analytics</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span> E-Commerce Growth</span>
              <span>•</span>
            </div>
            <div class="flex items-center gap-8 whitespace-nowrap shrink-0" aria-hidden="true">
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-accent animate-pulse"></span> Meta Ads Specialist</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span> Google Ads Expert</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Server-Side Tracking (CAPI)</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span> High-ROAS B2B Funnels</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span> Looker Studio Analytics</span>
              <span>•</span>
              <span class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span> E-Commerce Growth</span>
              <span>•</span>
            </div>
          </div>
        </div>

        <!-- ABOUT SECTION (#about) - Re-designed per Image 1 with Intro Video & Skill Badges -->
        <section id="about" class="py-20 md:py-32 px-6 border-t border-white/5 relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <!-- Header with Title & Cyan Accent Line -->
            <div class="mb-12 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-2 block">${(db.siteConfigGlobal && db.siteConfigGlobal.aboutKicker) || 'ABOUT ME'}</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">${(db.siteConfigGlobal && db.siteConfigGlobal.aboutHeading) || 'Crafting Digital Excellence'}</h2>
              <div class="w-20 h-1.5 rounded-full bg-accent shadow-[0_0_12px_#3db4bd]"></div>
            </div>

            <!-- 2-Column Layout: Left Text & Skill Pills | Right Video Player Container -->
            <div class="grid lg:grid-cols-12 gap-12 items-center mb-16">
              
              <!-- Left Column: Bio & Skill Pills -->
              <div class="lg:col-span-6 space-y-6 text-gray-300 text-base md:text-lg leading-relaxed reveal-on-scroll">
                <p id="about-display-paragraph" class="leading-relaxed text-gray-300">
                  ${(db.siteConfigGlobal && db.siteConfigGlobal.aboutParagraph) || 'As a Team Leader specializing in digital marketing, ed-tech, e-commerce, and brand management, I drive growth and innovation through a multidisciplinary blend of strategy, design, product, and sales expertise.'}
                </p>

                <!-- Skill Pill Badges matching user reference image -->
                <div class="pt-2 flex flex-wrap gap-3">
                  ${((db.siteConfigGlobal && db.siteConfigGlobal.aboutSkills) || [
      "Project Management",
      "Web Development",
      "Digital Marketing",
      "Brand Development",
      "Product Design"
    ]).map(skill => `
                    <span class="about-skill-pill inline-flex items-center px-4 py-2 rounded-full text-xs md:text-sm font-semibold tracking-wide border border-accent/40 bg-accent/10 text-cyan-300 shadow-sm transition-all hover:bg-accent/25 hover:border-accent hover:scale-105 cursor-default">
                      ${skill}
                    </span>
                  `).join('')}
                </div>

                <!-- CTA Button -->
                <div class="pt-4 flex gap-4">
                  <a href="https://wa.me/8801971708689?text=Hi!%20I%20would%20like%20to%20work%20with%20you." target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-white font-semibold text-sm shadow-lg shadow-accent/20 hover:-translate-y-1 transition-all">
                    Work With Me
                  </a>
                </div>
              </div>

              <!-- Right Column: Introduction Video Player Container -->
              <div class="lg:col-span-6 reveal-on-scroll">
                <div class="about-video-card relative rounded-3xl border border-white/10 shadow-2xl overflow-hidden aspect-video bg-black/70 flex items-center justify-center group">
                  ${renderVideoEmbed((db.siteConfigGlobal && db.siteConfigGlobal.aboutVideoUrl) || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
                </div>
              </div>

            </div>

            <!-- Core Competencies with Animated Skill Bars (Preserved underneath) -->
            <div id="core-competencies-card" class="bg-[#121824]/60 p-8 rounded-3xl border border-white/5 shadow-xl reveal-on-scroll card-hover-interactive">
              <h3 class="text-xl font-bold text-white mb-6">Core Competencies & Proficiency</h3>
              <div class="grid md:grid-cols-2 gap-x-10 gap-y-4">
                ${(db.skills || []).map((skill, sIdx) => `
                  <div class="skill-item-row">
                    <div class="flex justify-between text-sm font-semibold mb-2">
                      <span class="text-gray-200">${skill.name}</span>
                      <span class="text-accent font-bold skill-level-text" data-target="${skill.level}">0%</span>
                    </div>
                    <div class="skill-bar-track">
                      <div class="skill-bar-fill" style="width: 0%;" data-level="${skill.level}%" data-delay="${sIdx * 0.08}"></div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>
        </section>

        <!-- RESUME SECTION (#resume) -->
        <section id="resume" class="py-20 md:py-32 px-6 border-t border-white/5 bg-[#0b0f19] relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <div class="mb-12 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Experience</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Career Progression & Roles</h2>
            </div>

            <div class="grid lg:grid-cols-12 gap-10 items-center">
              <div class="lg:col-span-7 space-y-6">
                ${(db.resume || []).map(item => `
                  <div class="p-6 rounded-2xl bg-[#121824] border border-white/5 hover:border-accent/30 transition-all shadow-md reveal-on-scroll card-hover-interactive">
                    <span class="text-xs font-bold text-accent uppercase tracking-wider block mb-1">${item.year}</span>
                    <h3 class="text-lg font-bold text-white mb-1">${item.role}</h3>
                    <div class="text-sm font-semibold text-gray-400 mb-3">${item.company}</div>
                    <p class="text-sm text-gray-400 leading-relaxed">${item.desc}</p>
                  </div>
                `).join('')}
              </div>

              <div class="lg:col-span-5 flex justify-center reveal-on-scroll">
                <div class="rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#121824] p-4 card-hover-interactive">
                  <img src="${(db.siteConfigGlobal && db.siteConfigGlobal.resumeImage) || '/assets/journey.png'}" alt="Career Journey Roadmap" class="w-full h-auto object-contain rounded-2xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- SERVICES SECTION (#services) -->
        <section id="services" class="py-20 md:py-32 px-6 border-t border-white/5 relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <div class="mb-14 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Services</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Comprehensive Marketing Solutions</h2>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              ${(db.services || []).map((service, sIdx) => {
      const sNum = service.displayId || String(sIdx + 1).padStart(2, '0');
      return `
                <div class="group relative p-8 rounded-3xl bg-[#121824] border border-white/5 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between shadow-xl reveal-on-scroll card-hover-interactive overflow-hidden min-h-[300px]">
                  <div>
                    <h3 class="text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors">${service.title}</h3>
                    <p class="text-sm text-gray-400 leading-relaxed mb-6">${service.description}</p>
                  </div>
                  <div class="flex items-end justify-between pt-4 mt-auto border-t border-white/5 relative z-10">
                    <a href="https://wa.me/8801971708689?text=Hi!%20I%20am%20interested%20in%20your%20service:%20${encodeURIComponent(service.title)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-wider group-hover:gap-3 transition-all">
                      <span>Discuss Service</span>
                      ${icons.arrowRight}
                    </a>
                    <span class="text-5xl md:text-6xl font-black font-mono text-white/10 group-hover:text-accent/30 transition-colors select-none leading-none pointer-events-none">${sNum}</span>
                  </div>
                </div>
              `;
    }).join('')}
            </div>
          </div>
        </section>

        <!-- PROJECTS SECTION (#projects) -->
        <section id="projects" class="py-20 md:py-32 px-6 border-t border-white/5 bg-[#0b0f19] relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <div class="mb-14 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Projects</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Featured Project Highlights</h2>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              ${(db.projects || []).map(project => `
                <div class="group rounded-3xl overflow-hidden bg-[#121824] border border-white/5 hover:border-accent/40 transition-all duration-300 flex flex-col shadow-xl reveal-on-scroll card-hover-interactive">
                  <div class="aspect-[16/10] overflow-hidden bg-black/40 relative">
                    <img src="${project.image}" alt="${project.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span class="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                      ${project.category}
                    </span>
                  </div>
                  <div class="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 class="text-lg font-bold text-white mb-2 group-hover:text-accent transition-colors">${project.title}</h3>
                      <p class="text-xs text-gray-400 leading-relaxed mb-4">${project.content}</p>
                    </div>
                    <div class="flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      ${(project.tags || []).map(tag => `
                        <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300 font-medium">${tag}</span>
                      `).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- PRICING SECTION (#pricing) -->
        <section id="pricing" class="py-20 md:py-32 px-6 border-t border-white/5 bg-[#0b0f19] relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <!-- Header (100% English) -->
            <div class="text-center max-w-3xl mx-auto mb-10 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Pricing Packages</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">Transparent & Custom-Tailored Pricing</h2>
              <p class="text-base md:text-lg text-gray-400">
                Select your package below. You can include or exclude deliverables with the square checkboxes to create your ideal customized scope.
              </p>
            </div>

            <!-- CURRENCY TOGGLE SLIDER BUTTON (Dual Currency BDT / USD) -->
            <div class="flex flex-col items-center justify-center mb-14 reveal-on-scroll">
              <div id="currency-toggle-wrapper" class="relative inline-flex items-center bg-[#121824] border-2 border-[#3db4bd] rounded-full p-1 cursor-pointer select-none shadow-[0_8px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(61,180,189,0.35)] w-[260px] h-[52px]">
                <!-- Animated Sliding Active Pill -->
                <div id="currency-slider-pill" class="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] bg-gradient-to-r from-[#3db4bd] to-[#00c6ff] rounded-full shadow-[0_4px_16px_rgba(61,180,189,0.5)] transition-transform duration-300 ease-out pointer-events-none z-10" style="transform: ${currentCurrency === 'USD' ? 'translateX(100%)' : 'translateX(0px)'};"></div>

                <!-- BDT Option Button -->
                <button type="button" id="toggle-bdt-btn" class="relative z-20 flex-1 h-full flex items-center justify-center text-sm font-black uppercase tracking-wider ${currentCurrency === 'BDT' ? 'text-white' : 'text-gray-400 hover:text-gray-200'} transition-colors duration-250 cursor-pointer border-none bg-transparent focus:outline-none">
                  &#2547; BDT
                </button>

                <!-- USD Option Button -->
                <button type="button" id="toggle-usd-btn" class="relative z-20 flex-1 h-full flex items-center justify-center text-sm font-black uppercase tracking-wider ${currentCurrency === 'USD' ? 'text-white' : 'text-gray-400 hover:text-gray-200'} transition-colors duration-250 cursor-pointer border-none bg-transparent focus:outline-none">
                  $ USD
                </button>
              </div>
              <span class="text-[11px] font-semibold text-gray-400 mt-2.5 tracking-wider uppercase flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                Select Preferred Currency (BDT / USD)
              </span>
            </div>

            <!-- 1. TOP SET: Website Development & Design Packages -->
            <div class="mb-20">
              <div class="text-center max-w-2xl mx-auto mb-10 reveal-on-scroll">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 text-accent border border-accent/25 text-xs font-black tracking-widest uppercase mb-3">
                  <span>Part 01 • Web Development & Design</span>
                </div>
                <h3 class="text-2xl md:text-3xl font-black text-white">Website & E-Commerce Packages</h3>
                <p class="text-xs md:text-sm text-gray-400 mt-2">
                  High-speed, conversion-focused websites. Click any square box to include or exclude features.
                </p>
              </div>

              <!-- 3 Web Pricing Cards -->
              <div class="pricing-grid grid lg:grid-cols-3 gap-8 items-stretch pt-6">
                ${webPlans.map((p, idx) => renderPricingCard(p, true, idx)).join('')}
              </div>
            </div>

            <!-- 2. BOTTOM SET: Digital Marketing & Meta Ads Packages -->
            <div>
              <div class="text-center max-w-2xl mx-auto mb-10 reveal-on-scroll">
                <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/25 text-xs font-black tracking-widest uppercase mb-3">
                  <span>Part 02 • Growth Marketing & Meta Ads</span>
                </div>
                <h3 class="text-2xl md:text-3xl font-black text-white">Digital Marketing & Performance Packages</h3>
                <p class="text-xs md:text-sm text-gray-400 mt-2">
                  Data-driven Meta & Google Ads campaigns, CAPI server-side tracking, and multi-channel attribution.
                </p>
              </div>

              <!-- 3 Marketing Pricing Cards -->
              <div class="pricing-grid grid lg:grid-cols-3 gap-8 items-stretch pt-6">
                ${plans.map((p, idx) => renderPricingCard(p, false, idx)).join('')}
              </div>
            </div>

          </div>
        </section>

        <!-- META ADS CASE STUDIES SECTION (#meta-ads) -->
        <section id="meta-ads" class="py-20 md:py-32 px-6 border-t border-white/5 bg-[#0b0f19] relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <div class="mb-14 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Performance</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Meta Ads Case Studies</h2>
              <p class="text-gray-400 mt-4 max-w-2xl text-base md:text-lg">
                Proven success in managing Facebook & Instagram campaigns. Here are actual performance metrics from live client accounts, showing lead generation, page growth, and brand reach.
              </p>
            </div>

            <div class="grid md:grid-cols-3 gap-8">
              <!-- Card 1 -->
              <div class="group bg-[#121824] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl hover:border-accent/30 transition-all duration-300 flex flex-col justify-between reveal-on-scroll card-hover-interactive">
                <div>
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <span class="text-[10px] font-black text-accent uppercase tracking-[0.2em] block mb-1">Lead Generation</span>
                      <h3 class="text-xl font-bold text-white leading-tight">Messenger Lead Campaign</h3>
                    </div>
                    <span class="bg-accent/10 px-3 py-1 rounded-full text-xs font-bold text-accent">Active</span>
                  </div>
                  <div class="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Conversions</span>
                      <span class="text-lg font-black text-white">128</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Lead Quality</span>
                      <span class="text-lg font-black text-accent">High Intent</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Efficiency</span>
                      <span class="text-lg font-black text-white">Top ROAS</span>
                    </div>
                  </div>
                  <ul class="space-y-2 text-sm text-gray-400 mb-6">
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Target: B2B Business Owners</li>
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Funnel: Automated Messenger Lead Forms</li>
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Outcome: High-intent leads with 82% completion</li>
                  </ul>
                </div>
                <div class="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#0b0f19] group-hover:border-accent/40 transition-all duration-300">
                  <img src="/assets/meta-ads-1.png" alt="Messenger Lead Campaign performance chart" class="w-full h-full object-contain p-1 group-hover:scale-102 transition-all duration-500" />
                </div>
              </div>

              <!-- Card 2 -->
              <div class="group bg-[#121824] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl hover:border-accent/30 transition-all duration-300 flex flex-col justify-between reveal-on-scroll card-hover-interactive">
                <div>
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <span class="text-[10px] font-black text-accent uppercase tracking-[0.2em] block mb-1">Brand Growth</span>
                      <h3 class="text-xl font-bold text-white leading-tight">Page Likes & Engagement</h3>
                    </div>
                    <span class="bg-accent/10 px-3 py-1 rounded-full text-xs font-bold text-accent">Completed</span>
                  </div>
                  <div class="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Followers</span>
                      <span class="text-lg font-black text-white">905</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Engagement</span>
                      <span class="text-lg font-black text-accent">Viral Velocity</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Growth</span>
                      <span class="text-lg font-black text-white">+340%</span>
                    </div>
                  </div>
                  <ul class="space-y-2 text-sm text-gray-400 mb-6">
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Target: Targeted niche demographic</li>
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Funnel: Viral page engagement campaign</li>
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Outcome: Built highly engaged targeted community</li>
                  </ul>
                </div>
                <div class="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#0b0f19] group-hover:border-accent/40 transition-all duration-300">
                  <img src="/assets/meta-ads-2.png" alt="Page Growth & Engagement performance chart" class="w-full h-full object-contain p-1 group-hover:scale-102 transition-all duration-500" />
                </div>
              </div>

              <!-- Card 3 -->
              <div class="group bg-[#121824] border border-white/5 rounded-3xl p-6 md:p-8 shadow-xl hover:border-accent/30 transition-all duration-300 flex flex-col justify-between reveal-on-scroll card-hover-interactive">
                <div>
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <span class="text-[10px] font-black text-accent uppercase tracking-[0.2em] block mb-1">Awareness</span>
                      <h3 class="text-xl font-bold text-white leading-tight">Brand Reach Campaign</h3>
                    </div>
                    <span class="bg-accent/10 px-3 py-1 rounded-full text-xs font-bold text-accent">Completed</span>
                  </div>
                  <div class="grid grid-cols-3 gap-4 mb-6 py-4 border-y border-white/5">
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Total Reach</span>
                      <span class="text-lg font-black text-white">97,541</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Brand Recall</span>
                      <span class="text-lg font-black text-accent">Top Tier</span>
                    </div>
                    <div>
                      <span class="text-xs text-gray-500 block mb-1">Impressions</span>
                      <span class="text-lg font-black text-white">145K+</span>
                    </div>
                  </div>
                  <ul class="space-y-2 text-sm text-gray-400 mb-6">
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Target: Geographic wide audience</li>
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Format: Rich video & placement awareness</li>
                    <li class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent"></span> Outcome: Mass market brand reach at industry-best CTR</li>
                  </ul>
                </div>
                <div class="aspect-[4/3] rounded-2xl overflow-hidden border border-white/5 bg-[#0b0f19] group-hover:border-accent/40 transition-all duration-300">
                  <img src="/assets/meta-ads-3.png" alt="Brand Reach Campaign performance chart" class="w-full h-full object-contain p-1 group-hover:scale-102 transition-all duration-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- TESTIMONIALS SECTION (#testimonials) with Continuous Auto-Sliding Carousel -->
        <section id="testimonials" class="py-20 md:py-32 px-6 border-t border-white/5 bg-[#0b0f19] relative overflow-hidden">
          <!-- Background cyber net grid pattern -->
          <div class="cyber-grid-pattern absolute inset-0 pointer-events-none opacity-35"></div>

          <div class="max-w-7xl mx-auto relative z-10">
            <div class="mb-14 text-center max-w-2xl mx-auto reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Testimonials</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-3">Client Success Stories</h2>
              <p class="text-xs md:text-sm text-gray-400">Real feedback and results from leading brands, startups, and e-commerce stores.</p>
            </div>

            <!-- Auto-sliding continuous carousel (infinite loop, pauses on hover) -->
            <div class="testimonials-slider-container relative overflow-hidden select-none py-4">
              <div class="testimonials-slider-track flex items-stretch gap-6">
                ${[...((db.testimonials && db.testimonials.length) ? db.testimonials : []), ...((db.testimonials && db.testimonials.length) ? db.testimonials : [])].map((item, tIdx) => `
                  <div class="testimonial-card shrink-0 w-[300px] sm:w-[360px] md:w-[390px] p-7 rounded-3xl bg-[#121824] border border-white/5 hover:border-accent/30 flex flex-col justify-between shadow-xl card-hover-interactive transition-all">
                    <div>
                      <div class="flex gap-1 mb-4 text-amber-400">
                        ${Array(5).fill(icons.star).join('')}
                      </div>
                      <p class="text-sm text-gray-300 leading-relaxed mb-6 italic">"${item.content}"</p>
                    </div>
                    <div class="flex items-center gap-3 pt-4 border-t border-white/5">
                      <img src="${item.avatar || '/assets/profile.png'}" alt="${item.name}" class="w-11 h-11 rounded-full object-cover bg-white/10 border border-white/10" />
                      <div>
                        <div class="text-sm font-bold text-white">${item.name}</div>
                        <div class="text-xs text-gray-400">${item.role}</div>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </section>

        <!-- BLOG SECTION (#blog) -->
        <section id="blog" class="py-20 md:py-32 px-6 border-t border-white/5 relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <div class="mb-14 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Articles & Insights</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white">Latest Industry Case Studies</h2>
            </div>

            <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              ${(db.blogPosts || []).map(post => `
                <a href="/blog-details.html?id=${post.id}" class="group rounded-3xl overflow-hidden bg-[#121824] border border-white/5 hover:border-accent/40 transition-all duration-300 flex flex-col justify-between shadow-xl reveal-on-scroll card-hover-interactive block cursor-pointer">
                  <div>
                    <div class="aspect-[16/9] overflow-hidden bg-black/40 relative">
                      <img src="${post.image || '/assets/meta-ads.png'}" alt="${post.title}" onerror="this.src='/assets/meta-ads.png'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div class="p-6">
                      <div class="flex items-center justify-between mb-2">
                        <span class="text-xs text-accent font-bold">${post.date}</span>
                        <span class="text-[11px] text-gray-400 font-medium">5 min read</span>
                      </div>
                      <h3 class="text-lg font-bold text-white mb-3 group-hover:text-accent transition-colors leading-snug">${post.title}</h3>
                      <p class="text-xs text-gray-400 leading-relaxed mb-4">${post.excerpt}</p>
                    </div>
                  </div>
                  <div class="px-6 pb-6 pt-2 flex items-center justify-between border-t border-white/5">
                    <div class="flex flex-wrap gap-1.5">
                      ${(post.tags || []).map(tag => `
                        <span class="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-300">${tag}</span>
                      `).join('')}
                    </div>
                    <span class="inline-flex items-center gap-1 text-xs font-bold text-accent group-hover:translate-x-1 transition-transform">
                      <span>Read Article</span>
                      ${icons.arrowRight}
                    </span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- FAQ SECTION (#faq) -->
        <section id="faq" class="py-20 md:py-32 px-6 border-t border-white/5 bg-[#0b0f19] relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-4xl mx-auto">
            <div class="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
              <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Got Questions?</span>
              <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">Frequently Asked Questions</h2>
              <p class="text-gray-400 text-base md:text-lg leading-relaxed">
                Clear answers regarding Meta Ads campaigns, CAPI server-side tracking, pricing retainers, and WordPress services for clients in Bangladesh and worldwide.
              </p>
            </div>

            <div class="space-y-4">
              ${(db.faqs || [
      {
        question: "Do you provide digital marketing services for businesses in Bangladesh and international clients worldwide?",
        answer: "Yes. While I am a top-rated Meta Ads and Performance Marketing Specialist based in Bangladesh, I work as an independent remote contractor for clients globally. I ensure flexible communication and overlap with your local business hours, whether you are located in the US, UK, Australia, APAC, or right here in Bangladesh."
      },
      {
        question: "How much does it cost to hire a Meta Ads expert in Bangladesh for local and global campaigns?",
        answer: "My monthly retainer for Meta Ads management starts at highly affordable rates of 10,000 BDT (or $100 USD) for basic setups, scaling up to 40,000 BDT ($400 USD) for full-stack omnichannel marketing. This fee strictly covers campaign management and advanced tracking setup. The actual advertising budget (Ad Spend) is billed directly to your payment method by Meta or Google."
      },
      {
        question: "Why do e-commerce brands in Bangladesh and globally need Server-Side Tracking (Meta CAPI)?",
        answer: "Due to recent iOS updates and strict browser ad blockers worldwide, standard browser pixels lose up to 30% of critical user data. I implement Server-Side Tracking via Meta Conversions API (CAPI) to bypass these blocks. This ensures 100% data accuracy for e-commerce businesses globally, feeding the Meta algorithm precise signals for lower Cost Per Acquisition (CPA) and higher ROAS."
      },
      {
        question: "Can you guarantee a specific ROAS or sales volume for my e-commerce business?",
        answer: "While I guarantee highly optimized campaigns, flawless CAPI tracking architectures, and data-driven scaling strategies, I cannot guarantee exact sales numbers. Sales depend on external factors like product quality, pricing, website conversion rate (CRO), and local or global market demand. My goal as a growth strategist is to build a profitable sales funnel that scales your revenue efficiently."
      },
      {
        question: "Do I need to sign a long-term contract for your Meta Ads and performance marketing services?",
        answer: "No, my digital marketing retainers for local and international clients operate on a flexible month-to-month basis. However, I highly recommend a minimum 3-month commitment, as advertising algorithms need time to learn, and continuous A/B testing requires sufficient data to achieve optimal global or local scaling."
      },
      {
        question: "Do you provide domain and hosting with your WordPress website development services?",
        answer: "No, domain and hosting are not included in my WordPress design packages. However, whether you are a local business in Bangladesh or an international brand, I will guide you in selecting the fastest, SEO-friendly global hosting providers and fully assist with the server setup before beginning the website development phase."
      }
    ]).map((faq, idx) => `
                <div class="faq-item group bg-[#121824] border border-white/5 hover:border-accent/40 rounded-2xl p-6 transition-all duration-300 shadow-lg reveal-on-scroll card-hover-interactive select-none cursor-pointer"
                     data-faq-id="${idx}">
                  <div class="faq-header flex items-center justify-between gap-4">
                    <h3 class="faq-question text-base sm:text-lg font-bold text-white group-hover:text-accent transition-colors leading-snug">
                      ${faq.question}
                    </h3>
                    <div class="faq-icon-wrapper w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-accent transition-transform duration-300">
                      <svg class="w-4 h-4 faq-chevron transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 9l-7 7-7-7"/></svg>
                    </div>
                  </div>
                  <div class="faq-body hidden pt-4 mt-4 border-t border-white/5 text-sm sm:text-base text-gray-300 leading-relaxed">
                    <p class="faq-answer">${faq.answer}</p>
                  </div>
                </div>
              `).join('')}
            </div>

            <!-- Still Have Questions CTA -->
            <div class="mt-12 text-center p-8 rounded-3xl bg-[#121824] border border-white/5 reveal-on-scroll flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
              <div class="text-left">
                <h4 class="text-lg font-bold text-white mb-1">Have a specific question not listed here?</h4>
                <p class="text-xs sm:text-sm text-gray-400">Message me directly on WhatsApp for a quick response and custom strategy.</p>
              </div>
              <a href="https://wa.me/8801971708689?text=Hi!%20I%20have%20a%20question%20about%20your%20services." target="_blank" rel="noopener" class="px-7 py-3.5 rounded-full bg-accent hover:opacity-90 text-white font-bold text-sm transition-all shadow-xl shadow-accent/25 whitespace-nowrap shrink-0 flex items-center gap-2">
                ${icons.whatsapp}
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

        <!-- CONTACT SECTION (#contact) -->
        <section id="contact" class="py-20 md:py-32 px-6 border-t border-white/5 bg-[#0b0f19] relative overflow-hidden">
          <!-- Section Background Net Pattern -->
          <div class="section-net-pattern"></div>
          <div class="max-w-7xl mx-auto">
            <div class="grid lg:grid-cols-12 gap-12">
              <div class="lg:col-span-5 reveal-on-scroll">
                <span class="text-xs text-accent font-black uppercase tracking-[0.3em] mb-3 block">Contact</span>
                <h2 class="text-3xl md:text-5xl font-black tracking-tight text-white mb-6">Let's Build Something Exceptional</h2>
                <p class="text-gray-400 text-base mb-8 leading-relaxed">
                  Have an ad account that needs higher ROAS, missing tracking conversions, or require consultation? Get in touch directly.
                </p>

                <div class="space-y-4">
                  <div class="flex items-center gap-4 p-4 rounded-2xl bg-[#121824] border border-white/5 shadow-md card-hover-interactive">
                    <span class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      ${icons.pin}
                    </span>
                    <div>
                      <span class="text-xs text-gray-400 block">Location</span>
                      <span class="text-sm font-bold text-white">${(db.siteConfigGlobal && db.siteConfigGlobal.officeAddress) || '1162, East Monipur Road, Mirpur-2, Dhaka-1216'}</span>
                    </div>
                  </div>

                  <div class="flex items-center gap-4 p-4 rounded-2xl bg-[#121824] border border-white/5 shadow-md card-hover-interactive">
                    <span class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      ${icons.mail}
                    </span>
                    <div>
                      <span class="text-xs text-gray-400 block">Email Address</span>
                      <a href="mailto:${(db.siteConfigGlobal && db.siteConfigGlobal.contactEmail) || 'skhan.ict@gmail.com'}" class="text-sm font-bold text-white hover:text-accent transition-colors">${(db.siteConfigGlobal && db.siteConfigGlobal.contactEmail) || 'skhan.ict@gmail.com'}</a>
                    </div>
                  </div>

                  <div class="flex items-center gap-4 p-4 rounded-2xl bg-[#121824] border border-white/5 shadow-md card-hover-interactive">
                    <span class="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                      ${icons.phone}
                    </span>
                    <div>
                      <span class="text-xs text-gray-400 block">Phone / WhatsApp</span>
                      <a href="tel:${(db.siteConfigGlobal && db.siteConfigGlobal.officePhone) || '01971708689'}" class="text-sm font-bold text-white hover:text-accent transition-colors">${(db.siteConfigGlobal && db.siteConfigGlobal.officePhone) || '01971708689'}</a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Contact Form -->
              <div class="lg:col-span-7 bg-[#121824] p-8 md:p-10 rounded-3xl border border-white/5 shadow-xl reveal-on-scroll card-hover-interactive">
                <form id="portfolio-contact-form" class="space-y-6">
                  <div class="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label class="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">Your Name</label>
                      <input type="text" name="name" required placeholder="John Doe" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none text-sm transition-colors" />
                    </div>
                    <div>
                      <label class="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">Email Address</label>
                      <input type="email" name="email" required placeholder="john@example.com" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none text-sm transition-colors" />
                    </div>
                  </div>

                  <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">Subject / Interested Service</label>
                    <input type="text" name="subject" placeholder="Meta Ads / Tracking Consultation" class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none text-sm transition-colors" />
                  </div>

                  <div>
                    <label class="text-xs font-bold uppercase tracking-wider text-gray-300 block mb-2">Message</label>
                    <textarea name="message" rows="4" required placeholder="Describe your project, ad spend, and goals..." class="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-accent outline-none text-sm transition-colors"></textarea>
                  </div>

                  <button type="submit" class="w-full py-4 rounded-xl bg-accent text-white font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-accent/25 hover:scale-105">
                    Send Message
                  </button>
                  <p id="form-feedback" class="text-xs text-center text-emerald-400 hidden pt-2">Thank you! Your message has been sent successfully.</p>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>

      <!-- FOOTER (Matching Image 2 Layout with 3rd Image Portrait Cutout) -->
      <footer id="footer" class="relative pt-16 pb-10 px-6 border-t border-white/5 bg-[#080d1a] overflow-hidden">
        <!-- Top perspective cyber net grid lines (as seen in Image 2) -->
        <div class="perspective-grid-net"></div>
        <div class="cyber-grid-pattern absolute inset-0 pointer-events-none opacity-25"></div>

        <div class="max-w-7xl mx-auto relative z-10">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-end pb-12">
            
            <!-- Column 1: Brand Info & Bio & Socials (lg:col-span-4) -->
            <div class="lg:col-span-4 space-y-4">
              <div class="flex items-center gap-3">
                <img src="${(db.siteConfigGlobal && db.siteConfigGlobal.siteLogo) || '/assets/logo.png'}" alt="Al-Amin Khan Logo" class="h-10 w-auto object-contain" />
                
              </div>
              <p class="text-xs sm:text-sm text-gray-400 leading-relaxed max-w-sm">
                Certified Digital Marketing Specialist & Growth Strategist crafting high-converting Meta & Google campaigns, advanced server-side CAPI architectures, and conversion-focused web applications.
              </p>
              <!-- Circular Social Icon Buttons -->
              <div class="flex items-center gap-3 pt-2">
                <a href="https://www.linkedin.com/in/al-aminkhan/?locale=en" target="_blank" rel="noopener" aria-label="LinkedIn" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/15 flex items-center justify-center text-gray-300 hover:text-accent transition-all duration-300 shadow-md">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a href="https://www.facebook.com/mohammad.shaon.al.amin.2025/" target="_blank" rel="noopener" aria-label="Facebook" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-accent hover:bg-accent/15 flex items-center justify-center text-gray-300 hover:text-accent transition-all duration-300 shadow-md">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </a>
                <a href="https://wa.me/8801971708689" target="_blank" rel="noopener" aria-label="WhatsApp" class="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-emerald-400 hover:bg-emerald-500/15 flex items-center justify-center text-gray-300 hover:text-emerald-400 transition-all duration-300 shadow-md">
                  <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.275.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824zm-3.423-14.416c-6.627 0-12 5.373-12 12 0 2.13.56 4.129 1.536 5.867l-1.636 5.973 6.136-1.61c1.701.928 3.649 1.455 5.719 1.455 6.627 0 12-5.373 12-12 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>

            <!-- Column 2: Navigation (2 sub-columns, lg:col-span-2) -->
            <div class="lg:col-span-2 space-y-4">
              <h4 class="text-sm font-bold text-white uppercase tracking-wider">Navigation</h4>
              <div class="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs sm:text-sm text-gray-400">
                <a href="/#home" class="hover:text-accent transition-colors">Home</a>
                <a href="/#about" class="hover:text-accent transition-colors">About</a>
                <a href="/#resume" class="hover:text-accent transition-colors">Resume</a>
                <a href="/#services" class="hover:text-accent transition-colors">Services</a>
                <a href="/#projects" class="hover:text-accent transition-colors">Projects</a>
                <a href="/#meta-ads" class="hover:text-accent transition-colors">Meta Ads</a>
                <a href="/#pricing" class="hover:text-accent transition-colors">Pricing</a>
                <a href="/#faq" class="hover:text-accent transition-colors">FAQ</a>
                <a href="/#contact" class="hover:text-accent transition-colors">Contact</a>
                <a href="/#blog" class="hover:text-accent transition-colors">Blog</a>
              </div>
            </div>

            <!-- Column 3: Contact Info (lg:col-span-3) -->
            <div class="lg:col-span-3 space-y-4">
              <h4 class="text-sm font-bold text-white uppercase tracking-wider">Contact Info</h4>
              <div class="space-y-3 text-xs sm:text-sm text-gray-400">
                <div class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>1162, East Monipur Road, Mirpur-2, Dhaka-1216</span>
                </div>
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                  <a href="mailto:skhan.ict@gmail.com" class="hover:text-accent transition-colors">skhan.ict@gmail.com</a>
                </div>
                <div class="flex items-center gap-2.5">
                  <svg class="w-4 h-4 text-cyan-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <a href="tel:+8801971708689" class="hover:text-accent transition-colors">+880 1971 708 689</a>
                </div>
              </div>
            </div>

            <!-- Column 4: Portrait Photo Cutout from 3rd Image (lg:col-span-3 - Bigger & Prominent) -->
            <div class="lg:col-span-3 flex justify-center lg:justify-end items-end h-full">
              <div class="relative group">
                <img src="/assets/footer-portrait.png" alt="Al-Amin Khan" class="h-80 sm:h-96 md:h-[420px] lg:h-[460px] w-auto max-w-full object-contain object-bottom -mb-12 transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_18px_45px_rgba(0,0,0,0.9)] pointer-events-none select-none" />
              </div>
            </div>

          </div>

          <!-- Bottom bar with copyright and policy links -->
          <div class="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div>
              &copy; 2026 Md. Al-Amin Khan. All rights reserved.
            </div>
            <div class="flex flex-wrap items-center gap-6">
              <a href="/terms-of-service.html" class="hover:text-accent transition-colors">Terms of Service</a>
              <a href="/privacy-policy.html" class="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="/refund-policy.html" class="hover:text-accent transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  `;

  // 3. CURRENCY SLIDER TOGGLE BEHAVIOR (Guaranteed Smooth Switch Animation)
  const toggleWrapper = document.getElementById('currency-toggle-wrapper');
  const sliderPill = document.getElementById('currency-slider-pill');
  const bdtBtn = document.getElementById('toggle-bdt-btn');
  const usdBtn = document.getElementById('toggle-usd-btn');

  function updateCurrency(curr) {
    currentCurrency = curr;
    try {
      localStorage.setItem('portfolio_pricing_currency', curr);
    } catch (e) { }

    if (curr === 'BDT') {
      if (sliderPill) sliderPill.style.transform = 'translateX(0px)';
      if (bdtBtn) {
        bdtBtn.classList.remove('text-gray-400');
        bdtBtn.classList.add('text-white');
      }
      if (usdBtn) {
        usdBtn.classList.remove('text-white');
        usdBtn.classList.add('text-gray-400');
      }
    } else {
      if (sliderPill) sliderPill.style.transform = 'translateX(100%)';
      if (usdBtn) {
        usdBtn.classList.remove('text-gray-400');
        usdBtn.classList.add('text-white');
      }
      if (bdtBtn) {
        bdtBtn.classList.remove('text-white');
        bdtBtn.classList.add('text-gray-400');
      }
    }

    const pricingCards = document.querySelectorAll('.pricing-val');
    const pricingCycles = document.querySelectorAll('.pricing-cycle');

    pricingCards.forEach(el => {
      const val = (curr === 'BDT' ? el.getAttribute('data-bdt') : el.getAttribute('data-usd')) || '';
      el.style.opacity = '0';
      el.style.transform = 'scale(0.96)';
      setTimeout(() => {
        el.textContent = val;
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      }, 120);
    });

    pricingCycles.forEach(el => {
      const cycle = (curr === 'BDT' ? el.getAttribute('data-bdt') : el.getAttribute('data-usd')) || '';
      el.textContent = cycle;
    });

    const pricingSecondary = document.querySelectorAll('.pricing-secondary');
    pricingSecondary.forEach(el => {
      const val = (curr === 'BDT' ? el.getAttribute('data-bdt') : el.getAttribute('data-usd')) || '';
      el.textContent = val;
    });

    if (typeof window.refreshCardButtonsCurrency === 'function') {
      setTimeout(window.refreshCardButtonsCurrency, 150);
    }
  }

  if (bdtBtn) {
    bdtBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateCurrency('BDT');
    });
  }

  if (usdBtn) {
    usdBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateCurrency('USD');
    });
  }

  if (toggleWrapper) {
    toggleWrapper.addEventListener('click', (e) => {
      e.preventDefault();
      updateCurrency(currentCurrency === 'BDT' ? 'USD' : 'BDT');
    });
  }

  window.setPricingCurrency = updateCurrency;
  updateCurrency(currentCurrency);

  // 4. DAY / NIGHT THEME TOGGLE
  function toggleTheme() {
    isLightMode = !isLightMode;
    if (isLightMode) {
      document.body.classList.add('light-mode');
      localStorage.setItem('portfolio_theme', 'light');
    } else {
      document.body.classList.remove('light-mode');
      localStorage.setItem('portfolio_theme', 'dark');
    }
    const iconHTML = isLightMode ? icons.moon : icons.sun;
    const desktopBtn = document.getElementById('theme-toggle-btn');
    const mobileBtn = document.getElementById('mobile-theme-toggle');
    if (desktopBtn) desktopBtn.innerHTML = iconHTML;
    if (mobileBtn) mobileBtn.innerHTML = iconHTML;
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  const mobileThemeBtn = document.getElementById('mobile-theme-toggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
  if (mobileThemeBtn) mobileThemeBtn.addEventListener('click', toggleTheme);

  // 5. SMOOTH OFFSET SCROLLING & NAVIGATION (Prevents headers cutting off section content)
  function scrollToTargetId(targetId) {
    if (typeof window.updateSectionSeo === 'function') {
      window.updateSectionSeo(targetId || 'home');
    }
    if (!targetId || targetId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const cleanId = targetId.replace(/^\/?#/, '');
    const el = document.getElementById(cleanId);
    if (!el) return;
    const header = document.getElementById('main-header');
    const headerHeight = header ? header.offsetHeight : 80;
    // Exactly headerHeight (80px) ensures section title lands nicely framed right below sticky header
    const targetY = el.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({
      top: Math.max(0, targetY),
      behavior: 'smooth'
    });
  }

  // Intercept all menu links (Desktop Nav & Mobile Drawer)
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href.startsWith('javascript:')) return;
      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;
      const hash = href.substring(hashIndex + 1);
      const linkPath = href.substring(0, hashIndex);

      if (!linkPath || linkPath === '/' || linkPath === window.location.pathname) {
        e.preventDefault();
        const drawer = document.getElementById('mobile-drawer');
        if (drawer) drawer.classList.add('hidden');
        history.pushState(null, null, '#' + hash);
        scrollToTargetId(hash);
      }
    });
  });

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-drawer');
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.toggle('hidden');
    });
  }

  // Check initial hash on page load
  if (window.location.hash) {
    setTimeout(() => {
      scrollToTargetId(window.location.hash);
    }, 350);
  }

  // 5.5 INTERACTIVE SQUARE CHECKBOX CUSTOMIZER (Include / Exclude Deliverables)
  function initSquareCheckboxCustomizer() {
    document.querySelectorAll('.pricing-card-box').forEach(card => {
      const planName = card.getAttribute('data-plan-name') || 'Selected Package';
      const ctaBtn = card.querySelector('.pricing-cta-btn');
      const baseBtnText = card.getAttribute('data-base-btn-text') || 'Order Package';
      const featureItems = card.querySelectorAll('.custom-feature-item');
      const countBadge = card.querySelector('.custom-count-badge');

      function updateCardState() {
        const included = [];
        const excluded = [];
        featureItems.forEach(item => {
          const isInc = item.getAttribute('data-included') === 'true';
          const text = item.getAttribute('data-feature') || '';
          if (isInc) included.push(text);
          else excluded.push(text);
        });

        const priceEl = card.querySelector('.pricing-val');
        const currPrice = priceEl ? priceEl.textContent.trim() : '';

        let msg = `Hi Al-Amin! I am interested in ${planName} (${currPrice}).`;
        if (excluded.length > 0) {
          msg += `\n\nCustomized Scope:\n• Included (${included.length}): ${included.join(', ')}\n• Excluded (${excluded.length}): ${excluded.join(', ')}`;
          if (countBadge) {
            countBadge.textContent = `${included.length}/${featureItems.length} items`;
            countBadge.classList.remove('hidden');
          }
          if (ctaBtn) {
            const span = ctaBtn.querySelector('.btn-text');
            if (span) span.textContent = 'Order Customized Plan';
          }
        } else {
          if (countBadge) countBadge.classList.add('hidden');
          if (ctaBtn) {
            const span = ctaBtn.querySelector('.btn-text');
            if (span) span.textContent = baseBtnText;
          }
        }

        if (ctaBtn) {
          ctaBtn.href = `https://wa.me/8801971708689?text=${encodeURIComponent(msg)}`;
        }
      }

      featureItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const currentlyIncluded = item.getAttribute('data-included') === 'true';
          const nextState = !currentlyIncluded;
          item.setAttribute('data-included', nextState ? 'true' : 'false');

          const box = item.querySelector('.checkbox-square');
          const text = item.querySelector('.feature-text');
          const icon = item.querySelector('.checkmark-icon');

          if (nextState) {
            // Included state
            box.className = 'checkbox-square w-5 h-5 rounded-md border-2 border-accent bg-accent flex items-center justify-center text-white shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110 shadow-sm shadow-accent/20';
            if (icon) icon.classList.remove('hidden');
            text.className = 'feature-text text-sm text-gray-200 font-medium transition-colors';
            const exBadge = item.querySelector('.excluded-tag');
            if (exBadge) exBadge.remove();
          } else {
            // Excluded state
            box.className = 'checkbox-square w-5 h-5 rounded-md border-2 border-gray-600 bg-white/5 flex items-center justify-center text-transparent shrink-0 mt-0.5 transition-all duration-200 group-hover:scale-110';
            if (icon) icon.classList.add('hidden');
            text.className = 'feature-text text-sm text-gray-500 line-through opacity-60 transition-colors';
            if (!item.querySelector('.excluded-tag')) {
              const exSpan = document.createElement('span');
              exSpan.className = 'excluded-tag text-[10px] font-bold text-rose-400/90 uppercase ml-2 px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20';
              exSpan.textContent = 'Excluded';
              text.parentNode.appendChild(exSpan);
            }
          }

          updateCardState();
        });
      });

      // Initial update
      updateCardState();
    });

    window.refreshCardButtonsCurrency = function () {
      document.querySelectorAll('.pricing-card-box').forEach(card => {
        const planName = card.getAttribute('data-plan-name') || 'Selected Package';
        const ctaBtn = card.querySelector('.pricing-cta-btn');
        const priceEl = card.querySelector('.pricing-val');
        const currPrice = priceEl ? priceEl.textContent.trim() : '';
        const featureItems = card.querySelectorAll('.custom-feature-item');
        const included = [];
        const excluded = [];
        featureItems.forEach(item => {
          if (item.getAttribute('data-included') === 'true') included.push(item.getAttribute('data-feature'));
          else excluded.push(item.getAttribute('data-feature'));
        });
        let msg = `Hi Al-Amin! I am interested in ${planName} (${currPrice}).`;
        if (excluded.length > 0) {
          msg += `\n\nCustomized Scope:\n• Included (${included.length}): ${included.join(', ')}\n• Excluded (${excluded.length}): ${excluded.join(', ')}`;
        }
        if (ctaBtn) {
          ctaBtn.href = `https://wa.me/8801971708689?text=${encodeURIComponent(msg)}`;
        }
      });
    };
  }

  // 6. TYPEWRITER EFFECT (Hero Heading)
  function initTypewriter() {
    const typewriterEl = document.getElementById('hero-typewriter');
    const cursorEl = document.getElementById('hero-typewriter-cursor');
    if (!typewriterEl) return;
    const nameText = "Al-Amin Khan";
    let charIdx = 0;
    typewriterEl.textContent = "";
    if (cursorEl) cursorEl.classList.remove('is-hidden');

    const typeTimer = setInterval(() => {
      typewriterEl.textContent = nameText.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx >= nameText.length) {
        clearInterval(typeTimer);
        // Automatically hide cursor once typing is done, so no permanent dag is left!
        if (cursorEl) {
          setTimeout(() => {
            cursorEl.classList.add('is-hidden');
          }, 450);
        }
      }
    }, 110);
  }

  // 7. SMOOTH NUMBER COUNTER ANIMATION (0 -> 8+ Yrs, 0 -> 1K+, 0 -> 97%)
  function initNumberCounters() {
    const animate = (id, target, formatK = false) => {
      const el = document.getElementById(id);
      if (!el) return;
      const duration = 1800;
      let startTime = null;
      const step = (now) => {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // cubic ease-out
        const current = Math.floor(ease * target);
        el.textContent = (formatK && current >= 1000) ? '1K' : current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = formatK ? '1K' : target;
        }
      };
      requestAnimationFrame(step);
    };

    animate('counter-exp', 8);
    animate('counter-clients', 1000, true);
    animate('counter-rate', 97);
  }

  // 8. SCROLL REVEAL & SKILLS PROGRESS ANIMATIONS
  function initScrollAnimations() {
    const revealItems = document.querySelectorAll('.reveal-on-scroll');
    const competenciesCard = document.getElementById('core-competencies-card');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillTexts = document.querySelectorAll('.skill-level-text');

    let skillsAnimated = false;
    function triggerSkillBarsAnimation() {
      if (skillsAnimated) return;
      skillsAnimated = true;

      const bars = document.querySelectorAll('.skill-bar-fill');
      bars.forEach((bar) => {
        const targetWidth = bar.getAttribute('data-level');
        const delay = parseFloat(bar.getAttribute('data-delay') || '0');
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, delay * 1000 + 100);
      });

      const texts = document.querySelectorAll('.skill-level-text');
      texts.forEach((txt, idx) => {
        const target = parseInt(txt.getAttribute('data-target') || '0', 10);
        const delay = (idx * 0.08) * 1000 + 100;
        setTimeout(() => {
          let current = 0;
          const stepTime = Math.max(12, Math.floor(1200 / target));
          const timer = setInterval(() => {
            current++;
            txt.textContent = current + '%';
            if (current >= target) {
              clearInterval(timer);
              txt.textContent = target + '%';
            }
          }, stepTime);
        }, delay);
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

      revealItems.forEach((el, index) => {
        el.style.transitionDelay = `${(index % 4) * 0.1}s`;
        observer.observe(el);
      });

      // Skill Bars Observer on parent card (#core-competencies-card)
      if (competenciesCard) {
        const cardObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              triggerSkillBarsAnimation();
              cardObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.02, rootMargin: '60px 0px 0px 0px' });
        cardObserver.observe(competenciesCard);
      }
    } else {
      // Fallback
      revealItems.forEach(el => el.classList.add('is-revealed'));
      triggerSkillBarsAnimation();
    }

    // Scroll listener fallback to ensure skill bars always trigger
    function checkSkillsScroll() {
      if (skillsAnimated) return;
      if (!competenciesCard) return;
      const rect = competenciesCard.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= vh * 0.95 && rect.bottom >= 0) {
        triggerSkillBarsAnimation();
        window.removeEventListener('scroll', checkSkillsScroll);
      }
    }
    window.addEventListener('scroll', checkSkillsScroll, { passive: true });
    window.addEventListener('resize', checkSkillsScroll, { passive: true });
    setTimeout(checkSkillsScroll, 400);
    setTimeout(checkSkillsScroll, 1200);
  }

  // 8. CONTACT FORM SUBMISSION
  const contactForm = document.getElementById('portfolio-contact-form');
  const formFeedback = document.getElementById('form-feedback');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      const formData = new FormData(contactForm);
      const submission = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        date: new Date().toISOString()
      };

      try {
        if (!db.contactSubmissions) db.contactSubmissions = [];
        db.contactSubmissions.unshift(submission);
        localStorage.setItem("db_contactSubmissions", JSON.stringify(db.contactSubmissions));

        // Attempt server sync
        try {
          await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(db)
          });
        } catch (serverErr) { }

        if (formFeedback) {
          formFeedback.classList.remove('hidden');
        }
        contactForm.reset();
      } catch (err) {
        alert("Thank you! Your message was received.");
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        }
      }
    });
  }

  // 9. FAQ ACCORDION INTERACTIVITY
  function initFaqAccordion() {
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const body = item.querySelector('.faq-body');
        const chevron = item.querySelector('.faq-chevron');
        if (!body) return;
        const isHidden = body.classList.contains('hidden');

        document.querySelectorAll('.faq-item').forEach(other => {
          if (other !== item) {
            const ob = other.querySelector('.faq-body');
            const oc = other.querySelector('.faq-chevron');
            if (ob) ob.classList.add('hidden');
            if (oc) oc.style.transform = 'rotate(0deg)';
          }
        });

        if (isHidden) {
          body.classList.remove('hidden');
          if (chevron) chevron.style.transform = 'rotate(180deg)';
        } else {
          body.classList.add('hidden');
          if (chevron) chevron.style.transform = 'rotate(0deg)';
        }
      });
    });
  }

  // 10. SCROLLSPY ACTIVE MENU HIGHLIGHTING
  function initScrollspy() {
    const sections = ['home', 'about', 'services', 'pricing', 'meta-ads', 'testimonials', 'faq', 'blog', 'contact'];
    const navLinks = document.querySelectorAll('.nav-item-link');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    function updateActiveNav() {
      const scrollPos = window.scrollY + 160;
      let current = '';

      for (const id of sections) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            current = id;
          }
        }
      }

      if (!current && window.scrollY < 200) {
        current = 'home';
      }

      navLinks.forEach(link => {
        const sec = link.getAttribute('data-nav-section');
        if (sec === current) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      mobileLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes('#' + current)) {
          link.classList.add('text-accent', 'font-black');
        } else {
          link.classList.remove('text-accent', 'font-black');
        }
      });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav, { passive: true });
    setTimeout(updateActiveNav, 300);
  }

  // 11. Dismiss loader & initiate all animations
  removeLoader();
  setTimeout(initTypewriter, 200);
  setTimeout(initNumberCounters, 350);
  setTimeout(initScrollAnimations, 150);
  setTimeout(initSquareCheckboxCustomizer, 100);
  setTimeout(initFaqAccordion, 100);
  setTimeout(initScrollspy, 200);

})();

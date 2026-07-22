/* Lógica compartida de "Entre Amigos".
 *
 * Todo el comportamiento del componente (datos de cafés y productos, carrito,
 * tema claro/oscuro, menú, animaciones, etc.) vive aquí una sola vez. Tanto la
 * página principal (index.html) como la página independiente de cafés
 * (cafes.html) construyen su componente con esta misma factory, evitando
 * duplicar código.
 *
 * El runtime (support.js) evalúa el <script data-dc-script> de cada página con
 * `DCLogic` disponible, así que cada página solo necesita:
 *     const Component = window.EA.makeComponent(DCLogic, { page: "home" });
 *
 * `opts.page`:
 *   - "home"  -> enlaces de navegación internos (#seccion) hacia la misma página.
 *   - "cafes" -> los enlaces de secciones apuntan a index.html#seccion.
 */
window.EA = {
  makeComponent(DCLogic, opts) {
    opts = opts || {};
    const PAGE = opts.page || "home";
    // Enlace a una sección: en la home es un ancla local; en otras páginas
    // apunta a la home para no romper la navegación.
    const sec = (hash) => (PAGE === "home" ? hash : "index.html" + hash);

    return class Component extends DCLogic {
      state = { theme: null, menuOpen: false, cartOpen: false, cart: [], query: "", cat: "all", coffeeQuery: "", coffeeTag: "all", featSlide: 0, featPerView: 4, openFaq: 0, cToast: false, nToast: false };

      // Cantidad de equipos destacados en el carrusel de inicio (múltiplo de 4).
      get FEAT_COUNT(){ return Math.min(12, this.PRODUCTS.length); }
      featPages(perView){ return Math.max(1, Math.ceil(this.FEAT_COUNT / (perView || this.state.featPerView))); }

      fmt(n){ return "₲ " + n.toLocaleString("es-PY"); }

      get COFFEES(){ return [
        { id:"espresso", name:"Espresso", tag:"Clásico", price:12000, slot:"cf-espresso", desc:"Shot intenso y aromático, corazón de todo buen café.", img:"https://images.pexels.com/photos/18604200/pexels-photo-18604200.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"americano", name:"Americano", tag:"Suave", price:15000, slot:"cf-americano", desc:"Espresso alargado con agua caliente, equilibrado y ligero.", img:"https://images.pexels.com/photos/12039010/pexels-photo-12039010.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"capuccino", name:"Capuccino", tag:"Cremoso", price:22000, slot:"cf-capuccino", desc:"Espresso, leche vaporizada y una nube de espuma sedosa.", img:"https://images.pexels.com/photos/997670/pexels-photo-997670.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"latte", name:"Latte", tag:"Suave", price:24000, slot:"cf-latte", desc:"Mucha leche cremosa sobre un espresso delicado.", img:"https://images.pexels.com/photos/459489/pexels-photo-459489.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"mocaccino", name:"Mocaccino", tag:"Dulce", price:26000, slot:"cf-mocaccino", desc:"Café, chocolate y leche: el abrazo perfecto.", img:"https://images.pexels.com/photos/8058120/pexels-photo-8058120.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"flatwhite", name:"Flat White", tag:"Intenso", price:23000, slot:"cf-flatwhite", desc:"Doble ristretto con microespuma aterciopelada.", img:"https://images.pexels.com/photos/32938771/pexels-photo-32938771.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"macchiato", name:"Macchiato", tag:"Clásico", price:18000, slot:"cf-macchiato", desc:"Espresso 'manchado' con un toque de espuma.", img:"https://images.pexels.com/photos/11160148/pexels-photo-11160148.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"chocolate", name:"Chocolate Caliente", tag:"Dulce", price:25000, slot:"cf-chocolate", desc:"Chocolate fundido y leche, para consentirte.", img:"https://images.pexels.com/photos/16607248/pexels-photo-16607248.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"te", name:"Té", tag:"Sin café", price:14000, slot:"cf-te", desc:"Selección de infusiones y tés de hoja entera.", img:"https://images.pexels.com/photos/6448532/pexels-photo-6448532.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"frappe", name:"Frappé", tag:"Frío", price:28000, slot:"cf-frappe", desc:"Café helado batido, cremoso y refrescante.", img:"https://images.pexels.com/photos/12166771/pexels-photo-12166771.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"coldbrew", name:"Cold Brew", tag:"Frío", price:27000, slot:"cf-coldbrew", desc:"Extracción en frío por 18 horas, suave y dulce.", img:"https://images.pexels.com/photos/1078773/pexels-photo-1078773.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"especialidad", name:"Café de Especialidad", tag:"Premium", price:32000, slot:"cf-especialidad", desc:"Grano de origen único, tostado y servido con arte.", img:"https://images.pexels.com/photos/19873648/pexels-photo-19873648.jpeg?auto=compress&cs=tinysrgb&w=900" },
      ]; }

      get PRODUCTS(){ return [
        { id:"p-italiana", name:"Cafetera Italiana", cat:"cafeteras", price:180000, slot:"pr-italiana", desc:"Moka clásica para un espresso casero con carácter.", img:"https://images.pexels.com/photos/28613082/pexels-photo-28613082.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-francesa", name:"Cafetera Francesa", cat:"cafeteras", price:210000, slot:"pr-francesa", desc:"Prensa de émbolo para un cuerpo redondo y aromático.", img:"https://images.pexels.com/photos/34566502/pexels-photo-34566502.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-goteo", name:"Cafetera de Goteo", cat:"cafeteras", price:250000, slot:"pr-goteo", desc:"Preparación automática por goteo, ideal para la familia.", img:"https://images.pexels.com/photos/8937271/pexels-photo-8937271.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-espresso", name:"Cafetera Espresso", cat:"cafeteras", price:1450000, slot:"pr-espresso", desc:"Bomba de 15 bares para espresso de nivel barista.", img:"https://images.pexels.com/photos/6032797/pexels-photo-6032797.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-automatica", name:"Cafetera Automática", cat:"cafeteras", price:2900000, slot:"pr-automatica", desc:"Del grano a la taza con solo un botón.", img:"https://images.pexels.com/photos/2566027/pexels-photo-2566027.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-molinillo", name:"Molinillo", cat:"accesorios", price:320000, slot:"pr-molinillo", desc:"Molienda uniforme para liberar todo el aroma.", img:"https://images.pexels.com/photos/2972365/pexels-photo-2972365.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-tazas", name:"Set de Tazas", cat:"accesorios", price:95000, slot:"pr-tazas", desc:"Tazas de cerámica que conservan el calor.", img:"https://images.pexels.com/photos/6312194/pexels-photo-6312194.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-termo", name:"Termo", cat:"accesorios", price:140000, slot:"pr-termo", desc:"Lleva tu café caliente a donde vayas.", img:"https://images.pexels.com/photos/7734743/pexels-photo-7734743.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-filtros", name:"Filtros", cat:"accesorios", price:35000, slot:"pr-filtros", desc:"Filtros de papel para una taza limpia y clara.", img:"https://images.pexels.com/photos/34566499/pexels-photo-34566499.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-prensa", name:"Prensa Francesa", cat:"accesorios", price:210000, slot:"pr-prensa", desc:"Émbolo de acero inoxidable, resistente y elegante.", img:"https://images.pexels.com/photos/13935593/pexels-photo-13935593.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-jarra", name:"Jarra para Leche", cat:"accesorios", price:85000, slot:"pr-jarra", desc:"Pitcher de acero para texturizar y hacer latte art.", img:"https://images.pexels.com/photos/13882006/pexels-photo-13882006.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-tamper", name:"Tamper", cat:"accesorios", price:120000, slot:"pr-tamper", desc:"Prensa el café con presión pareja y precisa.", img:"https://images.pexels.com/photos/4349794/pexels-photo-4349794.jpeg?auto=compress&cs=tinysrgb&w=900" },
        { id:"p-balanza", name:"Balanza para Café", cat:"accesorios", price:180000, slot:"pr-balanza", desc:"Precisión al gramo para recetas perfectas.", img:"https://images.pexels.com/photos/34492952/pexels-photo-34492952.jpeg?auto=compress&cs=tinysrgb&w=900" },
      ]; }

      get theme(){ return this.state.theme ?? (this.props.themeDefault ?? "light"); }
      get waNumber(){ return (this.props.waNumber ?? "595971234567").replace(/\D/g,""); }

      add(item){ this.setState(s => {
        const cart = s.cart.slice();
        const ex = cart.find(x => x.id === item.id);
        if (ex) ex.qty++; else cart.push({ id:item.id, name:item.name, price:item.price, qty:1 });
        return { cart, cartOpen:true };
      }); }
      inc(id){ this.setState(s => ({ cart: s.cart.map(x => x.id===id?{...x,qty:x.qty+1}:x) })); }
      dec(id){ this.setState(s => ({ cart: s.cart.map(x => x.id===id?{...x,qty:x.qty-1}:x).filter(x => x.qty>0) })); }

      applyTex(){ const r = document.getElementById("ea-root"); if (r) r.style.setProperty("--hero-tex", this.props.heroTexture===false ? "0" : "1"); }
      componentDidUpdate(){ this.applyTex(); }
      componentDidMount(){
        this.applyTex();
        // scroll-triggered reveal
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const els = Array.from(document.querySelectorAll("[data-reveal]"));
        if (!reduce && "IntersectionObserver" in window){
          els.forEach(el => { el.style.opacity="0"; el.style.transform="translateY(40px)"; el.style.transition="opacity .8s cubic-bezier(.2,.7,.2,1), transform .8s cubic-bezier(.2,.7,.2,1)"; });
          const io = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting){ e.target.style.opacity="1"; e.target.style.transform="none"; io.unobserve(e.target); } });
          }, { threshold:.12 });
          els.forEach(el => io.observe(el));
        }
        // Entrada escalonada de las tarjetas de café. Se maneja por CSS con una
        // clase en <html> (nodo que el framework nunca reconcilia) para que
        // sobreviva a los re-render del sc-for que regenera las tarjetas. Se
        // dispara al llegar a la sección o al apretar "Ver nuestro café".
        const root = document.documentElement;
        this._cafesPlayed = false;
        const playCafes = () => {
          if (this._cafesPlayed || reduce) return;
          this._cafesPlayed = true;
          root.classList.add("ea-cafes-in");
          // Congela el estado final tras la animación para que un re-render
          // posterior (p. ej. agregar al carrito) no reinicie la entrada.
          setTimeout(() => { root.classList.add("ea-cafes-done"); }, 12 * 75 + 700);
        };
        if (!reduce && "IntersectionObserver" in window){
          const cio = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting){ playCafes(); cio.disconnect(); } });
          }, { threshold:.15 });
          const sec = document.getElementById("cafes");
          if (sec) cio.observe(sec);
        }
        // Botón CTA: dejamos que el ancla haga su scroll nativo suave a #cafes
        // (scroll-behavior:smooth) y solo agregamos el "pulse" del botón y el
        // disparo de la animación escalonada de las tarjetas.
        const cta = document.getElementById("ea-cta-cafes");
        if (cta){
          this._onCtaCafes = () => {
            cta.style.transform = "scale(.94)";
            setTimeout(() => { cta.style.transform = ""; }, 170);
            playCafes();
          };
          cta.addEventListener("click", this._onCtaCafes);
        }
        // nav shadow + back-to-top (DOM only, no re-render)
        this._onScroll = () => {
          const y = window.scrollY;
          const nav = document.getElementById("ea-nav");
          if (nav) nav.style.boxShadow = y > 20 ? "0 8px 30px rgba(78,52,46,.10)" : "none";
          const top = document.getElementById("ea-top");
          if (top){ const on = y > 500; top.style.opacity = on?"1":"0"; top.style.pointerEvents = on?"auto":"none"; top.style.transform = on?"none":"translateY(12px)"; }
        };
        window.addEventListener("scroll", this._onScroll, { passive:true });
        this._onScroll();
        this._onKey = (e) => { if (e.key==="Escape") this.setState({ cartOpen:false, menuOpen:false }); };
        window.addEventListener("keydown", this._onKey);

        // Carrusel de equipos destacados: solo se activa en la página que lo
        // contiene (#destacados). Ajusta cuántas imágenes se ven según el ancho
        // (4 / 2 / 1) y rota una página cada 4 s. Se maneja por estado para
        // sobrevivir a los re-render del framework.
        if (document.getElementById("destacados") || document.getElementById("cafes-destacados")) {
          const computePerView = () => { const w = window.innerWidth; return w >= 880 ? 4 : w >= 560 ? 2 : 1; };
          const applyPerView = () => {
            const pv = computePerView();
            if (pv !== this.state.featPerView) {
              this.setState(s => ({ featPerView: pv, featSlide: Math.min(s.featSlide, this.featPages(pv) - 1) }));
            }
          };
          applyPerView();
          this._onFeatResize = applyPerView;
          window.addEventListener("resize", this._onFeatResize, { passive:true });
          if (!reduce) {
            this._featTimer = setInterval(() => {
              if (document.hidden) return; // no rotar en pestañas en segundo plano
              this.setState(s => ({ featSlide: (s.featSlide + 1) % this.featPages(s.featPerView) }));
            }, 4000);
          }
        }
      }
      componentWillUnmount(){ window.removeEventListener("scroll", this._onScroll); window.removeEventListener("keydown", this._onKey); window.removeEventListener("resize", this._onFeatResize); if (this._featTimer) clearInterval(this._featTimer); const cta = document.getElementById("ea-cta-cafes"); if (cta && this._onCtaCafes) cta.removeEventListener("click", this._onCtaCafes); }

      renderVals(){
        const dark = this.theme === "dark";
        const cartItems = this.state.cart.map(it => ({
          ...it, priceLabel: this.fmt(it.price),
          inc: () => this.inc(it.id), dec: () => this.dec(it.id),
        }));
        const totalNum = this.state.cart.reduce((a,x) => a + x.price*x.qty, 0);
        const cartCount = this.state.cart.reduce((a,x) => a + x.qty, 0);

        // Buscador + filtro por tipo para la página de cafés.
        const cq = this.state.coffeeQuery.trim().toLowerCase();
        const coffees = this.COFFEES
          .filter(c => this.state.coffeeTag === "all" || c.tag === this.state.coffeeTag)
          .filter(c => !cq || c.name.toLowerCase().includes(cq) || c.desc.toLowerCase().includes(cq))
          .map(c => ({ ...c, priceLabel: this.fmt(c.price), add: () => this.add(c) }));

        const q = this.state.query.trim().toLowerCase();
        const catLabels = { cafeteras:"Cafeteras", accesorios:"Accesorios" };
        const products = this.PRODUCTS
          .filter(p => this.state.cat==="all" || p.cat===this.state.cat)
          .filter(p => !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q))
          .map(p => ({ ...p, priceLabel: this.fmt(p.price), catLabel: catLabels[p.cat], add: () => this.add(p) }));

        const catBtn = (active) => "padding:11px 22px;border-radius:999px;border:1px solid " + (active?"transparent":"var(--line-2)") + ";background:" + (active?"var(--btn-bg)":"var(--surface)") + ";color:" + (active?"var(--btn-ink)":"var(--ink-soft)") + ";font-family:Poppins,sans-serif;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s";
        const cats = [
          { key:"all", label:"Todos" }, { key:"cafeteras", label:"Cafeteras" }, { key:"accesorios", label:"Accesorios" },
        ].map(c => ({ ...c, style: catBtn(this.state.cat===c.key), onClick: () => this.setState({ cat:c.key }) }));

        // Chips de filtro por tipo de café (Todos + tags únicos: Clásico, Suave, ...).
        const coffeeTagList = ["all", ...new Set(this.COFFEES.map(c => c.tag))];
        const coffeeCats = coffeeTagList.map(t => ({
          key: t, label: t === "all" ? "Todos" : t,
          style: catBtn(this.state.coffeeTag === t),
          onClick: () => this.setState({ coffeeTag: t }),
        }));

        // Carrusel de equipos destacados (inicio): muestra los productos de a
        // "páginas" de 4 imágenes y rota automáticamente cada 4 s.
        const featPerView = this.state.featPerView;
        const featPages = this.featPages(featPerView);
        const featSlide = Math.min(this.state.featSlide, featPages - 1);
        const featBasis = (100 / featPerView);
        const featured = this.PRODUCTS.slice(0, this.FEAT_COUNT).map(p => ({
          ...p, priceLabel: this.fmt(p.price), catLabel: catLabels[p.cat], add: () => this.add(p),
          itemStyle: "flex:0 0 " + featBasis + "%;max-width:" + featBasis + "%;padding:0 12px",
        }));
        const featTrackStyle = "display:flex;transform:translateX(-" + (featSlide * 100) + "%);transition:transform .6s cubic-bezier(.2,.7,.2,1)";
        const featDots = Array.from({ length: featPages }, (_, i) => ({
          onClick: () => this.setState({ featSlide: i }),
          style: "height:9px;border:none;cursor:pointer;transition:all .3s;border-radius:999px;padding:0;width:" + (i === featSlide ? "26px" : "9px") + ";background:" + (i === featSlide ? "var(--brand-2)" : "var(--line-2)"),
        }));
        const featPrev = () => this.setState(s => ({ featSlide: (s.featSlide - 1 + this.featPages(s.featPerView)) % this.featPages(s.featPerView) }));
        const featNext = () => this.setState(s => ({ featSlide: (s.featSlide + 1) % this.featPages(s.featPerView) }));

        // Cafés destacados (página de cafés): mismo carrusel, con id de slot
        // propio (feat-*) para no colisionar con la grilla, y un retardo de
        // barrido escalonado por posición dentro del grupo de 4.
        const coffeesFeatured = this.COFFEES.slice(0, this.FEAT_COUNT).map((c, i) => ({
          ...c, slot: "feat-" + c.slot, priceLabel: this.fmt(c.price), add: () => this.add(c),
          itemStyle: "flex:0 0 " + featBasis + "%;max-width:" + featBasis + "%;padding:0 12px;--sweep-delay:" + ((i % 4) * 0.3) + "s",
        }));

        const faqData = [
          { q:"¿Puedo pedir para llevar?", a:"¡Claro! Todas nuestras bebidas están disponibles para llevar y también para delivery a través de WhatsApp." },
          { q:"¿Ofrecen opciones sin lácteos?", a:"Sí, contamos con leche de almendras, avena y soja para casi todas nuestras preparaciones." },
          { q:"¿Venden el café en grano?", a:"Vendemos nuestro café de especialidad en grano o molido, además de equipos e insumos en la sección Tienda." },
          { q:"¿Tienen espacio para eventos?", a:"Nuestro salón es ideal para reuniones pequeñas y encuentros entre amigos. Escríbenos para reservar." },
        ];
        const faqs = faqData.map((f,i) => {
          const open = this.state.openFaq === i;
          return { ...f,
            toggle: () => this.setState(s => ({ openFaq: s.openFaq===i ? -1 : i })),
            iconStyle: "flex:none;transition:transform .3s;color:var(--brand-2);transform:rotate(" + (open?"180deg":"0deg") + ")",
            bodyStyle: "overflow:hidden;transition:grid-template-rows .35s ease;display:grid;grid-template-rows:" + (open?"1fr":"0fr"),
          };
        });

        const wa = this.waNumber;
        const checkoutMsg = this.state.cart.length
          ? "Hola Entre Amigos! Quiero pedir: " + this.state.cart.map(x => x.qty + "x " + x.name).join(", ") + ". Total aprox " + this.fmt(totalNum) + "."
          : "Hola Entre Amigos! Quiero hacer un pedido.";

        const contacts = [
          { label:"Teléfono", value:"+595 971 234 567", href:"tel:+595971234567", icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>' },
          { label:"WhatsApp", value:"+595 971 234 567", href:"https://wa.me/"+wa, icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.4 8.4 0 0 1-12.7 7.2L3 20l1.3-5.2A8.4 8.4 0 1 1 21 11.5z"/></svg>' },
          { label:"Correo", value:"hola@entreamigos.com.py", href:"mailto:hola@entreamigos.com.py", icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>' },
          { label:"Facebook", value:"/entreamigospy", href:"https://facebook.com", icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>' },
          { label:"Instagram", value:"@entreamigospy", href:"https://instagram.com", icon:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/></svg>' },
        ];

        return {
          theme: dark ? "dark" : "light", isDark: dark, isLight: !dark,
          menuOpen: this.state.menuOpen,
          navLinks: [
            { label:"Inicio", href: sec("#inicio") }, { label:"Nosotros", href: sec("#nosotros") },
            { label:"Nuestros Cafés", href:"cafes.html" }, { label:"Equipos", href:"equipos.html" },
            { label:"Horarios", href: sec("#horarios") }, { label:"Ubicación", href: sec("#ubicacion") },
            { label:"Contacto", href: sec("#contacto") },
          ],
          values: ["Pasión","Calidad","Atención personalizada","Café artesanal","Ambiente familiar"],
          coffees, cats, products, noResults: products.length===0,
          query: this.state.query,
          setSearch: (e) => this.setState({ query: e.target.value }),
          coffeeCats, coffeeQuery: this.state.coffeeQuery,
          setCoffeeSearch: (e) => this.setState({ coffeeQuery: e.target.value }),
          coffeeNoResults: coffees.length===0,
          featured, coffeesFeatured, featTrackStyle, featDots, featPrev, featNext,
          hours: [
            { day:"Lunes a Viernes", time:"07:00 – 21:00" },
            { day:"Sábados", time:"08:00 – 22:00" },
            { day:"Domingos", time:"08:00 – 20:00" },
          ],
          testimonials: [
            { quote:"El mejor capuccino de la ciudad y un trato que te hace sentir en casa. Mi lugar favorito para trabajar.", name:"Lucía Giménez", role:"Cliente frecuente", initial:"L" },
            { quote:"Vine por el café y me quedé por el ambiente. Se nota la pasión en cada detalle.", name:"Marcos Rolón", role:"Vecino del barrio", initial:"M" },
            { quote:"Compré mi cafetera acá y me asesoraron increíble. Café artesanal de verdad.", name:"Sofía Núñez", role:"Amante del café", initial:"S" },
          ],
          faqs,
          contacts,
          submitContact: (e) => { e.preventDefault(); e.target.reset && e.target.reset(); this.setState({ cToast:true }); setTimeout(() => this.setState({ cToast:false }), 2600); },
          submitNews: (e) => { e.preventDefault(); e.target.reset && e.target.reset(); this.setState({ nToast:true }); setTimeout(() => this.setState({ nToast:false }), 2600); },
          contactBtn: this.state.cToast ? "¡Mensaje enviado! ✓" : "Enviar mensaje",
          newsBtn: this.state.nToast ? "✓ Listo" : "Suscribir",
          callHref: "tel:+595971234567", phoneLabel: "+595 971 234 567",
          waHref: "https://wa.me/"+wa+"?text="+encodeURIComponent("Hola Entre Amigos! Tengo una consulta."),
          checkoutHref: "https://wa.me/"+wa+"?text="+encodeURIComponent(checkoutMsg),
          cart: cartItems, cartCount, cartEmpty: cartItems.length===0, cartTotal: this.fmt(totalNum),
          openCart: () => this.setState({ cartOpen:true }),
          closeCart: () => this.setState({ cartOpen:false }),
          toggleMenu: () => this.setState(s => ({ menuOpen: !s.menuOpen })),
          closeMenu: () => this.setState({ menuOpen:false }),
          stop: (e) => e.stopPropagation(),
          toggleTheme: () => this.setState({ theme: dark ? "light" : "dark" }),
          scrollTop: () => window.scrollTo({ top:0, behavior:"smooth" }),
          cartOverlayStyle: "position:fixed;inset:0;z-index:70;background:rgba(28,19,15,.5);opacity:" + (this.state.cartOpen?"1":"0") + ";pointer-events:" + (this.state.cartOpen?"auto":"none") + ";transition:opacity .35s",
          cartStyle: "position:fixed;top:0;right:0;z-index:80;width:min(92vw,420px);height:100%;background:var(--bg);box-shadow:var(--shadow-strong);display:flex;flex-direction:column;transform:translateX(" + (this.state.cartOpen?"0":"100%") + ");transition:transform .4s cubic-bezier(.2,.7,.2,1)",
          cartFooterStyle: "padding:22px 26px;border-top:1px solid var(--line);background:var(--surface)" + (cartItems.length===0?";display:none":""),
          heroTex: this.props.heroTexture===false ? 0 : 1,
        };
      }
    };
  }
};

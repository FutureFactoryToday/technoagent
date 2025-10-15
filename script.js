
document.addEventListener('DOMContentLoaded', ()=>{
  const menuToggle = document.getElementById('menuToggle');
  const mobileMenu=document.getElementById('mobileMenu');
  if(menuToggle){menuToggle.addEventListener('click',()=>mobileMenu.classList.toggle('open'));}
  const nav = document.querySelector('.nav');
  const langBtn = document.getElementById('langBtn');
  const searchForm = document.getElementById('searchForm');
  const searchInput = document.getElementById('searchInput');
  const revealItems = document.querySelectorAll('.reveal');

/*  if(menuToggle){
    menuToggle.addEventListener('click', ()=>{
      if(nav.style.display==='flex'){ nav.style.display='none'; }
      else { nav.style.display='flex'; nav.style.flexDirection='column'; nav.style.gap='0'; nav.style.background='var(--blue)'; nav.style.padding='10px'; }
    });
  } */

  function revealScroll(){ const trigger = window.innerHeight * 0.9; revealItems.forEach(el=>{ const r = el.getBoundingClientRect(); if(r.top < trigger) el.classList.add('show'); }); }
  window.addEventListener('scroll', revealScroll); revealScroll();

  const translations = {
    ru:{home:'Главная', about:'О нас', products:'Продукты', solutions:'Наши решения', faq:'FAQ', contacts:'Контакты', milling_products:'Фрезерная обработка', turning_products:'Токарная обработка', software_products:'Программные решения и программно-аппаратные комплексы', milling_solutions:'Фрезерные решения', turning_solutions:'Токарные решения', contact_us:'Свяжитесь с нами', name:'Имя', email:'Email', message:'Сообщение', send:'Отправить', search_no:'По запросу ничего не найдено.'},
    en:{home:'Home', about:'About', products:'Products', solutions:'Our Solutions', faq:'FAQ', contacts:'Contacts', milling_products:'Milling Processing', turning_products:'Turning Processing', software_products:'Software & Systems', milling_solutions:'Milling Solutions', turning_solutions:'Turning Solutions', contact_us:'Contact Us', name:'Name', email:'Email', message:'Message', send:'Send', search_no:'Nothing found.'}
  };

  function getLang(){ return localStorage.getItem('ta_lang') || 'ru'; }
  function setLang(l){ localStorage.setItem('ta_lang', l); applyLang(); }
  function applyLang(){ const lang = getLang(); document.querySelectorAll('[data-i18n]').forEach(el=>{ const key = el.getAttribute('data-i18n'); if(translations[lang] && translations[lang][key]) el.textContent = translations[lang][key]; }); if(searchInput) searchInput.placeholder = getLang()==='ru' ? 'Поиск...' : 'Search...'; }
  if(!localStorage.getItem('ta_lang')) localStorage.setItem('ta_lang','ru');
  applyLang();
  if(langBtn) langBtn.addEventListener('click', ()=>{ const newL = getLang()==='ru' ? 'en' : 'ru'; setLang(newL); });

  function clearHighlights(root=document.body){ root.querySelectorAll('span.__hl').forEach(s=>{ const t=document.createTextNode(s.textContent); s.parentNode.replaceChild(t,s); }); }
  function highlightMatches(root,q){ if(!q) return 0; const regex=new RegExp(q,'ig'); let total=0; const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false); let node; const nodes=[]; while(node=walker.nextNode()){ if(regex.test(node.nodeValue)) nodes.push(node); } nodes.forEach(textNode=>{ const frag=document.createDocumentFragment(); let lastIndex=0; textNode.nodeValue.replace(regex,(match,offset)=>{ const before=textNode.nodeValue.slice(lastIndex,offset); if(before) frag.appendChild(document.createTextNode(before)); const span=document.createElement('span'); span.className='__hl'; span.textContent=match; frag.appendChild(span); lastIndex=offset+match.length; total++; }); const after=textNode.nodeValue.slice(lastIndex); if(after) frag.appendChild(document.createTextNode(after)); textNode.parentNode.replaceChild(frag,textNode); }); return total; }

  if(searchForm){
    searchForm.addEventListener('submit',(e)=>{
      e.preventDefault();
      clearHighlights();
      const q = searchInput.value.trim();
      if(!q) return;
      const total = highlightMatches(document.querySelector('main'), q);
      if(total===0) alert(getLang()==='ru' ? translations['ru']['search_no'] : translations['en']['search_no']);
      else { const first = document.querySelector('span.__hl'); if(first) first.scrollIntoView({behavior:'smooth', block:'center'}); }
    });
  }

});

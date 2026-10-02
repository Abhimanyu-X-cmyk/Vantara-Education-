const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);

const programs=[
  ["Learning Hub","Central learning space"],
  ["Classes 6–10","Class-wise learning"],
  ["Subjects & Chapters","Subject and chapter learning"],
  ["Olympiad Hub","IOQM, IMO, IOM and Science Olympiads"],
  ["AI Learning","AI Learning Tools"],
  ["AI Editing Program","AI-assisted creative editing"],
  ["Skill Labs","Coding, AI and practical skills"],
  ["Practice Zone","Questions and practice"],
  ["Resource Library","Notes and worksheets"],
  ["Student Progress","Learning progress"],
  ["Faculty / Mentors","Mentor information"],
  ["Research Program","Student research"],
  ["Idea-to-Project","Build projects"],
  ["Communication Lab","Communication skills"],
  ["Career Explorer","Future pathways"],
  ["Challenge Arena","Competitions and challenges"],
  ["Announcements","VANTARA updates"]
];

function closeWelcome(){
  $("#welcomeScreen").classList.add("hidden");
  localStorage.setItem("vantaraWelcomeSeen","1");
}
if(localStorage.getItem("vantaraWelcomeSeen")==="1") closeWelcome();

$("#skipBtn").onclick=closeWelcome;
$("#continueBtn").onclick=async()=>{
  const email=$("#emailInput").value.trim();
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
    $("#emailMessage").textContent="Please enter a valid email address.";
    return;
  }
  localStorage.setItem("vantaraEmail",email);
  $("#emailMessage").textContent="Thanks! Welcome to VANTARA EDUCATION.";
  setTimeout(closeWelcome,600);
  // Connect this endpoint to a real subscriber database when backend is ready.
  try{ await fetch("/api/subscribe",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email})}); }catch(e){}
};

$("#footerSubscribe").onsubmit=e=>{
  e.preventDefault();
  const email=$("#footerEmail").value.trim();
  if(email){localStorage.setItem("vantaraEmail",email);$("#footerMessage").textContent="You're on the VANTARA update list on this device. Backend connection can be added later.";}
};

$("#menuBtn").onclick=()=>$("#mainNav").classList.toggle("open");
$$('#mainNav a').forEach(a=>a.onclick=()=>$("#mainNav").classList.remove("open"));

const classSubjects={
  6:["Mathematics","Science","English","Social Science","Computer"],
  7:["Mathematics","Science","English","Social Science","Computer"],
  8:["Mathematics","Science","English","Social Science","Computer"],
  9:["Mathematics","Science","English","Social Science","Computer"],
  10:["Mathematics","Science","English","Social Science","Computer"]
};
$$(".class-card").forEach(btn=>btn.onclick=()=>{
  const c=btn.dataset.class;
  $("#classPanel").innerHTML=`<strong>Class ${c}</strong><div class="welcome-points" style="margin-top:12px">${classSubjects[c].map(s=>`<span>${s}</span>`).join("")}</div><p>Chapter pages and resources can be connected here as you add your content.</p>`;
});

const questions=[
  {s:"Maths",l:"Foundation",q:"Find the smallest prime number greater than 20."},
  {s:"Maths",l:"Olympiad",q:"What invariant would you look for in a parity problem?"},
  {s:"Science",l:"Foundation",q:"Name the force that pulls objects toward Earth."},
  {s:"Logic",l:"Intermediate",q:"Complete the pattern: 2, 6, 12, 20, __."},
  {s:"English",l:"Foundation",q:"Identify the tense: 'She has completed her work.'"},
  {s:"Coding",l:"Intermediate",q:"What is a loop used for in programming?"}
];
function renderQuestions(){
  const s=$("#practiceSubject").value,l=$("#practiceLevel").value;
  const list=questions.filter(x=>(s==="all"||x.s===s)&&(l==="all"||x.l===l));
  $("#practiceList").innerHTML=list.map((x,i)=>`<article class="question-card"><span class="tag">${x.s} • ${x.l}</span><h3>Question ${i+1}</h3><p>${x.q}</p><button class="secondary-btn practice-done" data-index="${i}" style="margin-top:14px">Mark Practised</button></article>`).join("")||"<p>No questions match these filters yet.</p>";
  $$(".practice-done").forEach(b=>b.onclick=()=>{
    const n=Number(localStorage.getItem("vantaraPractised")||0)+1;
    localStorage.setItem("vantaraPractised",n);
    updateProgress();
    b.textContent="✓ Practised";
  });
}
$("#practiceSubject").onchange=renderQuestions;
$("#practiceLevel").onchange=renderQuestions;
renderQuestions();

function updateProgress(){
  const n=Math.min(Number(localStorage.getItem("vantaraPractised")||0),20);
  const pct=Math.round(n/20*100);
  $("#progressBar").style.width=pct+"%";
  $("#progressText").textContent=`${pct}% completed • ${n} practice items`;
}
updateProgress();

const searchInput=$("#globalSearch");
function search(){
  const q=searchInput.value.toLowerCase().trim();
  const matches=q?programs.filter(x=>(x[0]+" "+x[1]).toLowerCase().includes(q)):[];
  $("#searchResults").innerHTML=matches.map(x=>`<a class="search-result" href="#programs">${x[0]} — ${x[1]}</a>`).join("")||(q?"No matching section found.":"");
}
searchInput.oninput=search;

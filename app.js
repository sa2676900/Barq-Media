const files=[
 {name:"Welcome to BARQ Media.mp3",type:"audio",size:"—"},
 {name:"Sample Video.mp4",type:"video",size:"—"},
 {name:"Sample Document.pdf",type:"pdf",size:"—"}
];
let selected="all";
function icon(t){return t==="audio"?"🎵":t==="video"?"🎬":"📄"}
function render(){
 const q=document.getElementById("search").value.toLowerCase();
 const list=files.filter(f=>(selected==="all"||f.type===selected)&&f.name.toLowerCase().includes(q));
 document.getElementById("count").textContent=list.length+" files";
 document.getElementById("files").innerHTML=list.map(f=>`
  <article class="file-card"><div class="icon">${icon(f.type)}</div>
  <h3>${f.name}</h3><div class="meta">${f.type.toUpperCase()} • ${f.size}</div>
  <button class="open" onclick="alert('Storage/player will be connected in the next step.')">Open</button></article>`).join("")||"<p>No files found.</p>";
}
function setType(t,el){selected=t;document.querySelectorAll(".cat").forEach(x=>x.classList.remove("active"));el.classList.add("active");render()}
function filterFiles(){render()}
function openAdmin(){document.getElementById("adminModal").classList.remove("hidden")}
function closeAdmin(){document.getElementById("adminModal").classList.add("hidden")}
function demoLogin(){alert("Demo screen ready. Next we connect real secure admin authentication.");closeAdmin()}
render();

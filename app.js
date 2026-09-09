const SUPABASE_URL = "https://smauzesoyhjndibtwsgm.supabase.co";
const SUPABASE_KEY = "sb_publishable_hJgwNVRaNITwtH6ci-WjCg_UsUrIlFy";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let files = [];
let selected = "all";

function getType(name) {
  const ext = name.split(".").pop().toLowerCase();

  if (["mp3", "wav", "m4a", "aac", "ogg", "flac"].includes(ext))
    return "audio";

  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext))
    return "video";

  if (ext === "pdf")
    return "pdf";

  return null;
}

function formatSize(bytes) {
  if (!bytes) return "—";

  if (bytes < 1024)
    return bytes + " B";

  if (bytes < 1024 * 1024)
    return (bytes / 1024).toFixed(1) + " KB";

  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

async function loadFiles() {
  const filesBox = document.getElementById("files");

  filesBox.innerHTML =
    "<p style='padding:20px;'>Loading files...</p>";

  const { data, error } = await supabase
    .storage
    .from("media")
    .list("", {
      limit: 100
    });

  if (error) {
    console.error(error);

    filesBox.innerHTML =
      `<p style="color:red;padding:20px;">
        Supabase Error: ${error.message}
      </p>`;

    return;
  }

  files = data
    .filter(file => getType(file.name))
    .map(file => {
      const type = getType(file.name);

      const { data: urlData } =
        supabase
          .storage
          .from("media")
          .getPublicUrl(file.name);

      return {
        name: file.name,
        type: type,
        size: formatSize(file.metadata?.size),
        url: urlData.publicUrl
      };
    });

  render();
}

function icon(type) {
  if (type === "audio") return "🎵";
  if (type === "video") return "🎬";
  return "📄";
}

function render() {
  const q = document
    .getElementById("search")
    .value
    .toLowerCase();

  const list = files.filter(file =>
    (selected === "all" || file.type === selected) &&
    file.name.toLowerCase().includes(q)
  );

  document.getElementById("count").textContent =
    list.length + " files";

  document.getElementById("files").innerHTML =
    list.map(file => `
      <article class="file-card">
        <div class="icon">${icon(file.type)}</div>

        <h3>${file.name}</h3>

        <div class="meta">
          ${file.type.toUpperCase()} • ${file.size}
        </div>

        <button class="open"
          onclick="openFile('${file.url}')">
          Open
        </button>
      </article>
    `).join("") || "<p>No files found.</p>";
}

function openFile(url) {
  window.open(url, "_blank");
}

function setType(type, el) {
  selected = type;

  document
    .querySelectorAll(".cat")
    .forEach(x => x.classList.remove("active"));

  el.classList.add("active");

  render();
}

function filterFiles() {
  render();
}

function openAdmin() {
  document
    .getElementById("adminModal")
    .classList.remove("hidden");
}

function closeAdmin() {
  document
    .getElementById("adminModal")
    .classList.add("hidden");
}

loadFiles();

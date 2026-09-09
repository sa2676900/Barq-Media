const SUPABASE_URL = "https://smauzesoyhjndibtwsgm.supabase.co";

// Yahan apna Supabase Publishable/Anon key paste karo
const SUPABASE_KEY = "sb_publishable_hJgwNVRaNITwtH6ci-WjCg_UsUrIlFy";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

let files = [];
let selected = "all";

function icon(type) {
  if (type === "audio") return "🎵";
  if (type === "video") return "🎬";
  return "📄";
}

function getType(name) {
  const ext = name.split(".").pop().toLowerCase();

  if (["mp3", "wav", "m4a", "aac", "ogg", "flac"].includes(ext)) {
    return "audio";
  }

  if (["mp4", "webm", "mov", "avi", "mkv"].includes(ext)) {
    return "video";
  }

  if (ext === "pdf") {
    return "pdf";
  }

  return null;
}

async function loadFiles() {
  const { data, error } = await supabase
    .storage
    .from("media")
    .list("", {
      limit: 100,
      sortBy: {
        column: "created_at",
        order: "desc"
      }
    });

  if (error) {
    console.error(error);
    document.getElementById("files").innerHTML =
      "<p>Files load nahi ho paaye.</p>";
    return;
  }

  files = data
    .filter(file => getType(file.name))
    .map(file => {
      const type = getType(file.name);

      const { data: urlData } = supabase
        .storage
        .from("media")
        .getPublicUrl(file.name);

      return {
        name: file.name,
        type: type,
        size: file.metadata?.size
          ? formatSize(file.metadata.size)
          : "—",
        url: urlData.publicUrl
      };
    });

  render();
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024)
    return (bytes / 1024).toFixed(1) + " KB";

  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

function render() {
  const q = document
    .getElementById("search")
    .value
    .toLowerCase();

  const list = files.filter(
    f =>
      (selected === "all" || f.type === selected) &&
      f.name.toLowerCase().includes(q)
  );

  document.getElementById("count").textContent =
    list.length + " files";

  document.getElementById("files").innerHTML =
    list
      .map(
        f => `
        <article class="file-card">
          <div class="icon">${icon(f.type)}</div>
          <h3>${f.name}</h3>
          <div class="meta">
            ${f.type.toUpperCase()} • ${f.size}
          </div>
          <button class="open" onclick="openFile('${f.url}')">
            Open
          </button>
        </article>
        `
      )
      .join("") || "<p>No files found.</p>";
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

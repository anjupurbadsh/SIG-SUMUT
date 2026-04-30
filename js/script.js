// ===============================
// DATA WISATA (UNTUK SEARCH)
// ===============================
const dataWisata = [
  "Danau Toba",
  "Bukit Lawang",
  "Air Terjun Sipiso-piso",
  "Pulau Nias",
  "Pantai Sorake",
  "Danau Linting",
  "Danau Siais"
];

// ===============================
// DATA CARD (UNTUK MAP)
// ===============================
const lokasiCard = [
  "Danau Toba",
  "Bukit Lawang",
  "Sipiso-piso",
  "Pulau Nias",
  "Pantai Sorake",
  "Danau Linting",
  "Danau Siais"
];


// ===============================
// MAP POPUP
// ===============================
function bukaMap(lokasi) {
  const popup = document.getElementById("mapPopup");
  const frame = document.getElementById("mapFrame");
  const link = document.getElementById("mapLink");

  frame.src = `https://maps.google.com/maps?q=${lokasi}&output=embed`;
  link.href = `https://www.google.com/maps?q=${lokasi}`;

  popup.style.display = "flex";
}

function tutupMap() {
  document.getElementById("mapPopup").style.display = "none";
}


// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // tombol close
  const closeBtn = document.getElementById("closeMap");
  if (closeBtn) {
    closeBtn.addEventListener("click", tutupMap);
  }

  const cards = document.querySelectorAll(".card");

  cards.forEach((card, index) => {

    // animasi masuk
    setTimeout(() => {
      card.classList.add("show");
    }, index * 200);

    // klik card
    card.addEventListener("click", () => {
      bukaMap(lokasiCard[index]);
    });

  });

});


// ===============================
// SEARCH
// ===============================
function cariWisata() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const hasil = document.getElementById("hasilPencarian");

  hasil.innerHTML = "";

  if (!input) return;

  const hasilFilter = dataWisata.filter(item =>
    item.toLowerCase().includes(input)
  );

  hasilFilter.forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.textContent = item;

    div.addEventListener("click", () => {
      bukaMap(item);
    });

    hasil.appendChild(div);
  });
}
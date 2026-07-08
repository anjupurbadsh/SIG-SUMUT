// ======================================
// SIG WISATA SUMUT - FINAL VERSION
// ======================================

// ======================================
// DATA WISATA
// ======================================

const wisataData = {

  "Danau Toba": {
    coords: [2.6845, 98.8756],
    deskripsi: "Danau vulkanik terbesar di dunia dan ikon wisata Sumatera Utara.",
    kategori: "Danau",
    rating: 4.9,
    tiket: "Rp10.000",
    gambar: "assets/danau-toba.jpg"
  },

  "Bukit Lawang": {
    coords: [3.5413, 98.1350],
    deskripsi: "Habitat orangutan Sumatera dengan wisata jungle trekking.",
    kategori: "Hutan",
    rating: 4.8,
    tiket: "Rp15.000",
    gambar: "assets/bukit-lawang.jpg"
  },

  "Sipiso-piso": {
    coords: [2.9050, 98.5190],
    deskripsi: "Air terjun tertinggi di Sumatera Utara.",
    kategori: "Air Terjun",
    rating: 4.8,
    tiket: "Rp5.000",
    gambar: "assets/sipiso-piso.jpg"
  },

  "Pulau Nias": {
    coords: [1.0840, 97.6350],
    deskripsi: "Pulau wisata surfing kelas internasional.",
    kategori: "Pulau",
    rating: 4.9,
    tiket: "Gratis",
    gambar: "assets/pulau-nias.jpg"
  },

  "Pantai Sorake": {
    coords: [0.5870, 97.8090],
    deskripsi: "Pantai terkenal dengan ombak surfing terbaik.",
    kategori: "Pantai",
    rating: 4.9,
    tiket: "Rp10.000",
    gambar: "assets/pantai-sorake.jpg"
  },

  "Danau Linting": {
    coords: [3.3820, 98.5330],
    deskripsi: "Danau unik dengan warna hijau kebiruan.",
    kategori: "Danau",
    rating: 4.7,
    tiket: "Rp5.000",
    gambar: "assets/danau-linting.jpg"
  },

  "Danau Siais": {
    coords: [1.5750, 99.2910],
    deskripsi: "Danau alami indah dengan suasana tenang.",
    kategori: "Danau",
    rating: 4.7,
    tiket: "Gratis",
    gambar: "assets/danau-siasis.jpg"
  },

  "Bukit Sibea-bea": {
    coords: [2.6540, 98.8570],
    deskripsi: "Bukit wisata religi dengan pemandangan Danau Toba.",
    kategori: "Bukit",
    rating: 4.8,
    tiket: "Rp15.000",
    gambar: "assets/bukit-sibeabea.jpg"
  }

};

// ======================================
// GLOBAL VARIABLE
// ======================================

let popupMap;
let routingControl;
let userLocation = null;
let currentDestination = null;
let watchId = null;
let userMarker = null;

// ======================================
// LOADING SCREEN
// ======================================

window.addEventListener("load", () => {

  const loading =
  document.getElementById("loadingScreen");

  if (!loading) return;

  setTimeout(() => {

    loading.style.opacity = "0";

    setTimeout(() => {
      loading.style.display = "none";
    }, 500);

  }, 1500);

});

// ======================================
// DOM READY
// ======================================

document.addEventListener("DOMContentLoaded", () => {

  tampilkanFavorit();

  // Statistik
  const totalWisata =
  document.getElementById("totalWisata");

  if(totalWisata){
    totalWisata.innerText =
    Object.keys(wisataData).length;
  }

  // Filter
  const kategori =
  document.getElementById("kategoriFilter");

  if(kategori){
    kategori.addEventListener(
      "change",
      filterKategori
    );
  }

  // Card wisata
  const cards =
  document.querySelectorAll(".card");

  cards.forEach((card,index)=>{

    setTimeout(()=>{
      card.classList.add("show");
    },index * 120);

    card.addEventListener("click",()=>{

      const nama =
      card.querySelector(".label")
      .innerText.trim();

      bukaPopup(nama);

    });

  });

  // Tombol close
  document
  .getElementById("closeMap")
  ?.addEventListener(
    "click",
    tutupPopup
  );

  // Tombol navigasi
  document
  .getElementById("startNav")
  ?.addEventListener(
    "click",
    mulaiNavigasi
  );

  // Tombol share
  document
  .getElementById("shareBtn")
  ?.addEventListener(
    "click",
    shareLokasi
  );

  // Tombol favorit
  document
  .getElementById("favBtn")
  ?.addEventListener(
    "click",
    simpanFavorit
  );

  // Klik area gelap popup
  const popup =
  document.getElementById("mapPopup");

  if(popup){

    popup.addEventListener("click",(e)=>{

      if(e.target === popup){

        tutupPopup();

      }

    });

  }

  // ESC
  document.addEventListener("keydown",(e)=>{

    if(e.key === "Escape"){

      tutupPopup();

    }

  });

});


// ======================================
// FILTER KATEGORI
// ======================================

function filterKategori(){

  const kategori =
  document.getElementById("kategoriFilter").value;

  document.querySelectorAll(".card")
  .forEach(card=>{

    const nama =
    card.querySelector(".label").innerText;

    const data =
    wisataData[nama];

    if(
      kategori==="Semua" ||
      data.kategori===kategori
    ){
      card.style.display="block";
    }
    else{
      card.style.display="none";
    }

  });

}


// ======================================
// BUKA POPUP
// ======================================

function bukaPopup(nama){

  const data = wisataData[nama];

  if(!data) return;

  currentDestination = data.coords;

  const popup =
  document.getElementById("mapPopup");

  popup.classList.add("show");

  document.getElementById("popupTitle").innerText = nama;
  document.getElementById("popupDesc").innerText = data.deskripsi;
  document.getElementById("popupImage").src = data.gambar;

  document.getElementById("popupInfo").innerHTML = `
    ⭐ Rating : ${data.rating}<br>
    🎫 Tiket : ${data.tiket}<br>
    📍 Kategori : ${data.kategori}
  `;

  setTimeout(()=>{

    if(popupMap){
      popupMap.remove();
    }

    popupMap =
    L.map("popupMap")
    .setView(data.coords,12);

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:"© OpenStreetMap"
      }
    ).addTo(popupMap);

    L.marker(data.coords)
    .addTo(popupMap)
    .bindPopup(nama)
    .openPopup();

    popupMap.invalidateSize();

  },300);

}

// ======================================
// ROUTING
// ======================================

function buatRute(tujuan){

  if(!userLocation) return;

  if(routingControl){
    popupMap.removeControl(
      routingControl
    );
  }

  routingControl =
  L.Routing.control({

    waypoints:[
      L.latLng(userLocation),
      L.latLng(tujuan)
    ],

    routeWhileDragging:false,
    addWaypoints:false,
    draggableWaypoints:false,
    fitSelectedRoutes:true,
    show:false,

    createMarker:()=>null

  }).addTo(popupMap);

}

// ======================================
// NAVIGASI
// ======================================

function mulaiNavigasi(){

  if(!currentDestination){

    alert(
      "Pilih destinasi terlebih dahulu"
    );

    return;
  }

  bicara(
    "Navigasi dimulai"
  );

  if(watchId){
    navigator.geolocation.clearWatch(
      watchId
    );
  }

  watchId =
  navigator.geolocation.watchPosition(

    pos=>{

      userLocation = [
        pos.coords.latitude,
        pos.coords.longitude
      ];

      if(userMarker){
        popupMap.removeLayer(
          userMarker
        );
      }

      userMarker =
      L.marker(userLocation)
      .addTo(popupMap)
      .bindPopup("Lokasi Kamu");

      popupMap.setView(
        userLocation,
        15
      );

      buatRute(
        currentDestination
      );

      hitungJarak(
        currentDestination
      );

    },

    ()=>{

      alert(
        "GPS gagal diakses"
      );

    },

    {
      enableHighAccuracy:true,
      maximumAge:0,
      timeout:5000
    }

  );

}

// ======================================
// HITUNG JARAK
// ======================================

function hitungJarak(tujuan){

  if(!userLocation) return;

  const jarak =
  popupMap.distance(
    userLocation,
    tujuan
  ) / 1000;

  const waktu =
  (jarak/40*60).toFixed(0);

  document
  .getElementById("popupDistance")
  .innerHTML = `
  📏 Jarak : ${jarak.toFixed(1)} KM
  <br>
  ⏱ Estimasi : ${waktu} Menit
  `;

}

// ======================================
// SEARCH
// ======================================

function cariWisata(){

  const input =
  document.getElementById("searchInput")
  .value.toLowerCase();

  const hasil =
  document.getElementById(
    "hasilPencarian"
  );

  hasil.innerHTML = "";

  if(!input) return;

  Object.keys(wisataData)

  .filter(item=>
    item.toLowerCase()
    .includes(input)
  )

  .forEach(item=>{

    const div =
    document.createElement("div");

    div.className = "item";

    div.innerHTML =
    "🔍 " + item;

    div.onclick = ()=>{
      bukaPopup(item);
    };

    hasil.appendChild(div);

  });

}

// ======================================
// FAVORIT
// ======================================

function simpanFavorit(){

  const nama =
  document.getElementById(
    "popupTitle"
  ).innerText;

  let favorit =
  JSON.parse(
    localStorage.getItem(
      "favorit"
    )
  ) || [];

  if(
    !favorit.includes(nama)
  ){

    favorit.push(nama);

    localStorage.setItem(
      "favorit",
      JSON.stringify(favorit)
    );

    tampilkanFavorit();

    alert(
      nama +
      " berhasil ditambahkan ke favorit"
    );

  }
  else{

    alert(
      "Wisata sudah ada di favorit"
    );

  }

}

function tampilkanFavorit(){

  const container =
  document.getElementById(
    "favoriteList"
  );

  if(!container) return;

  const favorit =
  JSON.parse(
    localStorage.getItem(
      "favorit"
    )
  ) || [];

  container.innerHTML = "";

  if(favorit.length===0){

    container.innerHTML =
    `
    <p class="empty-favorite">
      Belum ada wisata favorit
    </p>
    `;

    return;
  }

  favorit.forEach(nama=>{

    const card =
    document.createElement("div");

    card.className =
    "favorite-card";

    card.innerHTML =
    `
    <h4>${nama}</h4>

    <button
    onclick="hapusFavorit('${nama}')">
      Hapus
    </button>
    `;

    container.appendChild(card);

  });

}

function hapusFavorit(nama){

  let favorit =
  JSON.parse(
    localStorage.getItem(
      "favorit"
    )
  ) || [];

  favorit =
  favorit.filter(
    item => item !== nama
  );

  localStorage.setItem(
    "favorit",
    JSON.stringify(favorit)
  );

  tampilkanFavorit();

}

// ======================================
// SHARE
// ======================================

function shareLokasi(){

  const nama =
  document.getElementById(
    "popupTitle"
  ).innerText;

  if(navigator.share){

    navigator.share({

      title:nama,

      text:
      "Yuk kunjungi " +
      nama,

      url:
      window.location.href

    });

  }else{

    alert(
      "Browser tidak mendukung fitur share"
    );

  }

}

// ======================================
// VOICE
// ======================================

function bicara(teks){

  const suara =
  new SpeechSynthesisUtterance(
    teks
  );

  suara.lang =
  "id-ID";

  speechSynthesis.speak(
    suara
  );

}


// ======================================
// TUTUP POPUP
// ======================================

function tutupPopup(){

  document
  .getElementById("mapPopup")
  .classList.remove("show");

  if(watchId){

    navigator.geolocation
    .clearWatch(watchId);

  }

}

// ======================================
// LOGIN ADMIN
// ======================================

const btnLogin =
document.getElementById("btnLogin");

const loginModal =
document.getElementById("loginModal");

const closeLogin =
document.getElementById("closeLogin");

const loginBtn =
document.getElementById("loginBtn");

if(btnLogin){

    btnLogin.onclick = ()=>{

        loginModal.style.display =
        "flex";

    };

}

if(closeLogin){

    closeLogin.onclick = ()=>{

        loginModal.style.display =
        "none";

    };

}

if(loginBtn){

    loginBtn.onclick = ()=>{

        const username =
        document.getElementById("username")
        .value;

        const password =
        document.getElementById("password")
        .value;

        if(
            username==="admin" &&
            password==="admin123"
        ){

            alert(
              "Login berhasil"
            );

            window.location.href =
            "admin.html";

        }

        else{

            alert(
              "Username atau password salah"
            );

        }

    };

}
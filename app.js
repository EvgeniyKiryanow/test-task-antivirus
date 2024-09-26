const API_URL = "https://veryfast.io/t/front_test_api.php";

window.onload = () => {
  fetchData();
};

const fetchData = () => {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", API_URL, true);

  xhr.onload = () => {
    if (xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if (data && data.result && data.result.elements) {
        renderItems(data.result.elements);
        attachDownloadListeners();
        deleteLoadingBlock();
      } else {
        console.error("Invalid data structure");
      }
    } else {
      console.error(`Error fetching data: ${xhr.statusText}`);
    }
  };

  xhr.onerror = () => {
    console.error("Network error occurred");
  };

  xhr.send();
};

const renderItems = (items) => {
  const itemList = document.getElementById("item-list");
  itemList.innerHTML = "";
  items.forEach((item) => {
    const itemElement = createItemElement(item);
    itemList.appendChild(itemElement);
  });
};

const createItemElement = (itemData) => {
  const itemElement = document.createElement("div");
  const itemDataWrapper = document.createElement("div");

  itemElement.className = "item";
  itemDataWrapper.className = "item-data-wrapper";

  const { price_key, license_name, amount, is_best, name_display, link } =
    itemData;

  appendPriceDetails(price_key, license_name, amount, is_best, itemElement);
  appendItemDetails(name_display, license_name, itemDataWrapper);
  appendDownloadButton(link, itemDataWrapper);

  itemElement.appendChild(itemDataWrapper);
  return itemElement;
};

const appendPriceDetails = (
  priceKey,
  licenseName,
  amount,
  isBest,
  parentElement
) => {
  const priceElement = document.createElement("p");
  priceElement.className = "price";

  const period = licenseName.includes("1-Year") ? "per year" : "mo";
  priceElement.innerHTML = `<span class="amount">$${amount}<span class="license-period">/${period}</span></span> ${
    priceKey.includes("%") ? `<span class="prev-price">$9.99</span>` : ""
  }`;

  const priceKeySvg = document.createElement("div");
  if (priceKey.includes("%")) {
    priceKeySvg.innerHTML = `<span class="sale-price">${priceKey}</span>${getRibbonSVG()}`;
  }
  priceElement.appendChild(priceKeySvg);

  if (isBest) {
    const bestValueBadge = document.createElement("span");
    bestValueBadge.className = "badge";
    bestValueBadge.textContent = "Best Value";
    priceElement.appendChild(bestValueBadge);
  }

  parentElement.appendChild(priceElement);
};

const appendItemDetails = (nameDisplay, licenseName, parentElement) => {
  const nameElement = document.createElement("p");
  nameElement.className = "name";
  const nameText =
    nameDisplay.split("Total Protection")[0] + "Total Protection";
  nameElement.innerHTML = `<span>${nameText}</span> <span class="license-name">${licenseName}</span>`;
  parentElement.appendChild(nameElement);
};

const appendDownloadButton = (link, parentElement) => {
  const downloadButton = document.createElement("a");
  downloadButton.href = link;
  downloadButton.className = "download-link";
  downloadButton.innerHTML = `Download ${getDownloadSVG()}`;
  parentElement.appendChild(downloadButton);
};

const getDownloadSVG = () => {
  return `<svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0C6.72517 0 0 6.71012 0 15C0 23.2899 6.71013 30 15 30C23.2899 30 30 23.2899 30 15C30 6.71012 23.2748 0 15 0ZM12.2768 14.6239H13.2547C13.4654 14.6239 13.6459 14.4584 13.6459 14.2327V8.33501C13.6459 8.12438 13.8114 7.94382 14.0371 7.94382H15.9629C16.1735 7.94382 16.3541 8.10933 16.3541 8.33501V14.2327C16.3541 14.4433 16.5195 14.6239 16.7452 14.6239H17.7231C18.0391 14.6239 18.2196 15 18.0241 15.2558L15.3009 18.671C15.1505 18.8666 14.8495 18.8666 14.6991 18.671L11.991 15.2558C11.7803 15 11.9609 14.6239 12.2768 14.6239ZM23.5155 20.2507V21.65C23.5155 21.8606 23.3501 22.0411 23.1244 22.0411H8.39516H6.86056C6.64993 22.0411 6.46941 21.8756 6.46941 21.65V20.2507V16.4443C6.46941 16.2337 6.63489 16.0532 6.86056 16.0532H8.00401C8.21464 16.0532 8.39516 16.2186 8.39516 16.4443V19.8596C8.39516 20.0702 8.56067 20.2507 8.78635 20.2507H21.1534C21.3641 20.2507 21.5446 20.0853 21.5446 19.8596V16.4443C21.5446 16.2337 21.7101 16.0532 21.9358 16.0532H23.1394C23.35 16.0532 23.5306 16.2186 23.5306 16.4443V20.2507H23.5155Z" fill="white"/>
  </svg>`;
};

const getRibbonSVG = () => {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="102" viewBox="0 0 100 102" fill="none">
        <path d="M71.3128 22.1769L79.2505 14.2994H79.1113L71.3128 22.1769Z" fill="url(#paint0_linear_901_42)"/>
        <path d="M83.1497 10.22L79.2505 14.1588H100L94.0119 8.25065C94.0119 8.25065 91.0875 5.99994 88.8593 6.14061C86.6312 6.42195 83.1497 10.22 83.1497 10.22Z" fill="url(#paint1_linear_901_42)"/>
        <path d="M85.9349 5.8593C78.1365 5.43729 43.1826 0.232535 43.1826 0.232535C43.1826 0.232535 36.4982 -1.03349 32.3205 2.34257L3.2155 31.7424C3.2155 31.7424 -0.822992 34.9778 0.151816 43.84C1.12662 52.7021 5.72215 86.0407 5.72215 86.0407C5.72215 86.0407 6.13992 92.2302 7.81102 94.9029C5.44363 88.0101 10.0392 84.212 10.0392 84.212L13.9384 80.1326L71.3128 22.0363L79.1113 14.1588H79.2505L83.289 10.22C83.289 10.22 85.6564 7.40666 88.9986 6.14064C88.0238 5.99997 87.049 5.99997 85.9349 5.8593Z" fill="url(#paint2_linear_901_42)"/>
        <path d="M7.81103 94.9029C7.95029 95.1842 8.08955 95.3249 8.2288 95.4656C10.3177 97.5756 13.9384 101.374 13.9384 101.374V80.1326L10.0391 84.212C10.0391 84.212 5.44366 88.1508 7.81103 94.9029Z" fill="url(#paint3_linear_901_42)"/>
        <path opacity="0.3" d="M33.9916 2.20192L82.3142 7.96942L39.8404 1.49857C39.8404 1.49857 37.0553 0.935888 33.9916 2.20192Z" fill="white"/>
        <path d="M40.8152 41.8706C41.5115 42.5739 41.9293 43.418 42.2078 44.1213C42.4863 44.9653 42.4863 45.6687 42.3471 46.372C42.2078 47.0754 41.79 47.7787 41.233 48.3414C40.676 48.9041 39.9797 49.3261 39.2834 49.4668C38.5871 49.6074 37.8908 49.6074 37.0552 49.1854C36.3589 48.9041 35.5234 48.3414 34.9664 47.6381L34.4093 47.0754C33.713 46.372 33.2953 45.6687 33.0167 44.8247C32.7382 43.9806 32.7382 43.2773 32.8775 42.5739C33.0167 41.8706 33.4345 41.1672 33.9916 40.6046C34.5486 40.0419 35.2449 39.6199 35.9412 39.4792C36.6375 39.3385 37.473 39.3385 38.1693 39.7606C38.8656 40.0419 39.7012 40.6046 40.3974 41.3079L40.8152 41.8706ZM39.4226 42.2926C38.5871 41.4486 37.7515 40.8859 36.916 40.7452C36.0804 40.6046 35.3841 40.8859 34.8271 41.4486C34.2701 42.0113 33.9916 42.7146 33.9916 43.5586C34.1308 44.4027 34.5486 45.2467 35.3841 46.0907L35.9412 46.6534C36.7767 47.4974 37.6123 48.0601 38.4478 48.2007C39.2834 48.3414 39.9797 48.0601 40.676 47.4974C41.3723 46.9347 41.5115 46.2314 41.5115 45.3873C41.3723 44.5433 40.9545 43.6993 40.1189 42.8553L39.4226 42.2926Z" fill="white"/>
        <path d="M46.5248 36.6659L43.4611 39.62L46.5248 42.8554L45.55 43.8401L38.4478 36.3846L43.0433 31.8831L43.7396 32.7271L40.1189 36.2439L42.4863 38.776L45.55 35.8219L46.5248 36.6659Z" fill="white"/>
        <path d="M52.2344 31.1798L49.1707 34.1338L52.2344 37.3692L51.2596 38.3539L44.1574 30.8984L48.7529 26.397L49.4492 27.241L45.9678 30.7578L48.3352 33.2898L51.3988 30.3358L52.2344 31.1798Z" fill="white"/>
        <defs>
        <linearGradient id="paint0_linear_901_42" x1="71.2659" y1="18.1838" x2="79.2079" y2="18.1838" gradientUnits="userSpaceOnUse">
        <stop stop-color="#E40210"/>
        <stop offset="1" stop-color="#660027"/>
        </linearGradient>
        <linearGradient id="paint1_linear_901_42" x1="79.2079" y1="10.2117" x2="99.9752" y2="10.2117" gradientUnits="userSpaceOnUse">
        <stop offset="0.503" stop-color="#660027"/>
        <stop offset="1" stop-color="#E40210"/>
        </linearGradient>
        <linearGradient id="paint2_linear_901_42" x1="1.50248" y1="51.7412" x2="88.8143" y2="35.073" gradientUnits="userSpaceOnUse">
        <stop stop-color="#E40210"/>
        <stop offset="0.0666482" stop-color="#7B0022"/>
        <stop offset="0.4147" stop-color="#FF0000"/>
        <stop offset="0.5146" stop-color="#FF0505"/>
        <stop offset="0.6321" stop-color="#FF1313"/>
        <stop offset="0.758" stop-color="#FF2B2B"/>
        <stop offset="0.786" stop-color="#FF3131"/>
        <stop offset="1" stop-color="#F40106"/>
        </linearGradient>
        <linearGradient id="paint3_linear_901_42" x1="10.5153" y1="83.6368" x2="10.5153" y2="99.5551" gradientUnits="userSpaceOnUse">
        <stop offset="0.2551" stop-color="#660027"/>
        <stop offset="1" stop-color="#E40210"/>
        </linearGradient>
        </defs>
        </svg>
    `;
};

const detectBrowser = () => {
  const userAgent = navigator.userAgent;
  if (!isMobileOrTablet()) {
    if (userAgent.includes("Chrome")) return "Chrome";
    if (userAgent.includes("Firefox")) return "Mozilla Firefox";
  } else {
    return "Mobile";
  }
  return "Unknown browser";
};

const attachDownloadListeners = () => {
  const downloadLinks = document.querySelectorAll(".download-link");
  downloadLinks.forEach((link) => {
    link.addEventListener("click", handleDownloadClick);
  });
};

const handleDownloadClick = () => {
  const browser = detectBrowser();
  const arrowHelp = document.getElementById("arrow-help");
  if (browser === "Mobile") return;
  setTimeout(() => {
    arrowHelp.style.opacity = "1";
    arrowHelp.classList.add(
      browser === "Chrome" ? "hide-before" : "hide-after"
    );

    if (browser !== "Chrome") {
      arrowHelp.style.top = "35px";
      arrowHelp.style.right = "15px";
      arrowHelp.style.left = "unset";
    }
    setTimeout(() => {
      arrowHelp.style.opacity = "0";
    }, 3000);
  }, 1500);
};

function deleteLoadingBlock() {
  const loadingBlock = document.getElementById("loading");
  loadingBlock.style.display = "none";
}

function isMobileOrTablet() {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;

  if (
    /android|ipad|iphone|ipod|mobile|tablet|kindle|silk|playbook/i.test(
      userAgent
    )
  ) {
    return true;
  }

  return false;
}

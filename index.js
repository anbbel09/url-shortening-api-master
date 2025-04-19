const menu = document.getElementById('menu');
const token = "d3d945fde65011a943eecc79e6b85b6f4835221b"; // Tu token de Bitly

const inputLinkBtn = document.getElementById('inputLinkBtn');
const shortenListCard = document.getElementById('shortenList');
const menuCard = document.getElementById('menuCard');

let longLinks = [];

// Función para mostrar/ocultar el menú
menu.addEventListener('click', () => {
    menuCard.classList.toggle('hidden');
});

// Función para acortar el link
inputLinkBtn.addEventListener('click', (e) => {
    e.preventDefault();

    const inputElement = document.getElementById('inputLink');
    const inputLink = inputElement.value.trim();
    const textRed = document.getElementById('textRed');
    
    if (!inputLink) {
        textRed.classList.remove('hidden');
        inputElement.classList.add('border', 'border-red-500');
        return;
    } else {
        textRed.classList.add('hidden');
        inputElement.classList.remove('border', 'border-red-500');
    }
    

    fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            long_url: inputLink,
            domain: "bit.ly"
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Shortened URL:', data.link);

        // Guarda en la lista
        longLinks.push({
            original: inputLink,
            short: data.link
        });

        renderLinks();

    })
    .catch(error => {
        console.error('Error shortening URL:', error);
    });
});

function renderLinks() {
    shortenListCard.innerHTML = ''; 
    longLinks.forEach(linkObj => {
     
        shortenListCard.innerHTML += `
        <div class="bg-white rounded-md py-1 my-5 md:flex md:items-center md:justify-between">
           <p class="p-3 md:w-auto">${linkObj.original}</p>
    <hr class="border-gray-400">
    <div class="p-3 md:flex md:w-1/2 md:justify-between" md:items-center">
      <p class="font-medium text-teal-500 my-2  md:gap-5">${linkObj.short}</p>
      <button  class="bg-teal-500 rounded-lg w-full py-2 m-auto cursor-pointer font-semibold text-white copyBtn md:w-1/3 md:m-0">Copy</button>
    </div>
    </div>
        `;
       
    });

    const copyBtns = document.querySelectorAll('.copyBtn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const linkToCopy = btn.getAttribute('data-link');
            navigator.clipboard.writeText(linkToCopy)
            .then(() => {
                btn.textContent = 'Copied!';
                btn.classList.remove('bg-teal-500');
                btn.classList.add('bg-[#232127]');
            
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('bg-[#232127]');
                    btn.classList.add('bg-teal-500');
                }, 1500);
            })
            .catch(err => {
                console.error('Error al copiar:', err);
            });
            
        });
    });

}
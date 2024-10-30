const apiKey = "zle3vHHGkg_ruTl07BYPy1Gk6iKuX9-ccYLX_7bm5eg";
const searchButton = document.getElementById("searchButton");
const imageResult = document.getElementById("imageResult");
//https://unsplash.com/oauth/applications
//JSON
//POSTMAN
async function fetchImage(imgSearch) {
  const endpoint = `https://api.unsplash.com/search/photos?query=${imgSearch}&client_id=${apiKey}`;
  const response = await fetch(endpoint);
  console.log(response);
  return response.json();
}

function displayImage(data) {
  if (data.results && data.results.length > 0) {
    console.log(data.results);
    const imageUrl = data.results[0].urls.regular;
    imageResult.innerHTML = `<img src="${imageUrl}" alt="Imagem de ${searchInput.value}">`;
  } else {
    imageResult.innerHTML = "<p>Nenhuma imagem encontrada.</p>";
  }
}

async function handleSearch() {
  const searchInput = document.getElementById("searchInput").value;
  if (searchInput) {
    try {
      const data = await fetchImage(searchInput);
      displayImage(data);
    } catch (error) {
      console.error("Erro ao buscar imagem:", error);
      imageResult.innerHTML = "<p>Erro ao buscar imagem. Tente novamente.</p>";
    } finally {
      // O bloco finally é executado independentemente de erro ou sucesso
      console.log("Busca de imagem concluída.");
    }
  }
}

// function handleSearch() {
//   const searchInput = document.getElementById("searchInput").value;
//   if (searchInput) {
//     fetchImage(searchInput)
//       .then(displayImage)
//       .catch((error) => {
//         console.error("Erro ao buscar imagem:", error);
//         imageResult.innerHTML =
//           "<p>Erro ao buscar imagem. Tente novamente.</p>";
//       });
//   }
// }

searchButton.addEventListener("click", handleSearch);

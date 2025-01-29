export function renderTotalAndUniqueChart (totalWordsQuantities, uniqueWordsQuantities) {
  const labels = Array.from({ length: totalWordsQuantities.length }, (_, i) => `${i + 1}`);

  const ctx = document.getElementById("totalAndUniqueChart").getContext("2d");
  const wordChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total de Palavras",
          data: totalWordsQuantities,
          backgroundColor: "rgba(75, 192, 192, 0.5)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1
        },
        {
          label: "Palavras Distintas",
          data: uniqueWordsQuantities,
          backgroundColor: "rgba(153, 102, 255, 0.5)",
          borderColor: "rgba(153, 102, 255, 1)",
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          stacked: false, // Não empilhar as barras
          title: {
            display: true,
            text: "Número de letras"
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Ocorrências"
          },
          ticks: {callback: showOnlyIntegers}
        }
      },
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        }
      }
    }
  });
 }

export function renderLetterFrequency(lettersFrequency) {
  const ctx = document.getElementById("lettersFrequency").getContext("2d");
  const chart = new Chart(ctx, {
      type: "bar",
      data: {
          labels: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", 
            "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "ç"],
          datasets: [{
              label: "Ocorrência de Letras",
              data: lettersFrequency,
              backgroundColor: "rgba(255,159,64,0.2)",
              borderColor: "rgb(255, 159, 64)",
              borderWidth: 1
          }]
      },
      options: {
          responsive: true,
          scales: {
              x: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: "Letras"
                  }
              },
              y: {
                  beginAtZero: true,
                  title: {
                      display: true,
                      text: "Ocorrência"
                  },
                  ticks: {callback: showOnlyIntegers}
              }
          }
      }
  });
}

function showOnlyIntegers(value) {
  if (Number.isInteger(value)) {
      return value;
  }
  return '';
}
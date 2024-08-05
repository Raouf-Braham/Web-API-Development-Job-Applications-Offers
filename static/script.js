document.addEventListener("DOMContentLoaded", function () {

  ScrollReveal({
    //reset: true,
    distance: "90px",
    duration: 2500,
    delay: 600,
  });

  ScrollReveal().reveal(".jobs-number", { origin: "left" });
  ScrollReveal().reveal(".job-item", { origin: "left" });
  ScrollReveal().reveal(".job-detail", { origin: "right" });
  ScrollReveal().reveal(".pagination-container", { origin: "bottom" });

  // Get the bookmark icon element
  const bookmarkIcon = document.querySelector(".postuler i");

  // Add click event listener to toggle classes
  bookmarkIcon.addEventListener("click", function () {
    // Toggle between fa-regular and fa-solid classes
    if (bookmarkIcon.classList.contains("fa-regular")) {
      bookmarkIcon.classList.remove("fa-regular");
      bookmarkIcon.classList.add("fa-solid");
    } else {
      bookmarkIcon.classList.remove("fa-solid");
      bookmarkIcon.classList.add("fa-regular");
    }
  });

  const popupForm = document.getElementById("popup-form");
  const openButton = document.getElementById("six");
  const closeButton = document.getElementById("close-application");

  // Initially hide the popup form
  popupForm.style.display = "none";

  // Show the form with fade-in and zoom-in effect when the button is clicked
  openButton.addEventListener("click", function () {
    popupForm.style.display = "flex";
    setTimeout(() => {
      popupForm.classList.add("active");
      popupForm.querySelector(".zoom-container").classList.add("active");
    }, 10);
    document.body.classList.add("no-scroll");
  });

  // Hide the form with fade-out and zoom-out effect when the close button is clicked
  closeButton.addEventListener("click", function () {
    const zoomContainer = popupForm.querySelector(".zoom-container");
    zoomContainer.classList.add("fade-out");
    popupForm.classList.remove("active"); // Start fading out background
    setTimeout(() => {
      zoomContainer.classList.remove("active", "fade-out");
      popupForm.style.display = "none"; // Hide the form after animations
    }, 500); // Match the timeout with CSS transition duration
    document.body.classList.remove("no-scroll");
  });

  $(document).ready(function () {
    $("#dropdown-label").on("click", function () {
      $("#other-filters-options").prop(
        "checked",
        !$("#other-filters-options").prop("checked")
      );
      $("#modalBackdrop").fadeIn(); // Show backdrop
      $("#other-filters-popup").fadeIn(); // Show popup
      document.body.classList.add("no-scroll");
    });

    // Function to close the popup filter
    $("#close-filter").on("click", function () {
      $("#other-filters-options").prop("checked", false); // Uncheck the dropdown checkbox
      $("#modalBackdrop").fadeOut(); // Hide backdrop
      $("#other-filters-popup").fadeOut(); // Hide popup
      document.body.classList.remove("no-scroll");
    });
  });

  $(document).ready(function () {
    var filterNames = [
      "Ressources humaines et recrutement",
      "Services aux particuliers",
      "Management, conseil aux entreprises",
      "Enseignement et formation",
      "Informatique",
      "Médias et communication",
      "Finance",
      "Télécommunications",
      "Immobilier",
      "Travail les jours fériés",
      "Repos le week-end",
      "Tous les week-ends",
      "Travail de nuit",
      "Travail en matinée",
      "Période de travail de 10 heures",
      "Week-ends uniquement",
      "Travail posté",
      "Nuits selon les besoins",
    ];

    // Select all checkboxes within #other-filters-popup
    $('#other-filters-popup input[type="checkbox"]').each(function (index) {
      var label = filterNames[index]; // Get the filter name from the filterNames array

      // Create a new custom checkbox element
      var customCheckbox = $(
        '<label class="mcui-checkbox">' +
          '<input type="checkbox">' +
          "<div>" +
          '<svg class="mcui-check" viewBox="-2 -2 35 35" aria-hidden="true">' +
          '<polyline points="7.57 15.87 12.62 21.07 23.43 9.93" />' +
          "</svg>" +
          "</div>" +
          "<div>" +
          label +
          "</div>" + // Use the label text from the filterNames array
          "</label>"
      );

      // Replace the current checkbox with the custom checkbox
      $(this).replaceWith(customCheckbox);

      // Copy the attributes (e.g., name, id) from original checkbox to custom checkbox
      customCheckbox.find('input[type="checkbox"]').attr({
        name: $(this).attr("name"),
        id: $(this).attr("id"),
        checked: $(this).prop("checked"), // Preserve checked state if needed
      });
    });
  });

  // Get references to the buttons
  const newestButton = document.getElementById("sort-by-newest");
  const dateButton = document.getElementById("sort-by-date");

  // Function to handle button clicks
  function handleButtonClick(event) {
    // Remove active class from both buttons
    newestButton.classList.remove("active-button-filter");
    dateButton.classList.remove("active-button-filter");

    // Add active class to the clicked button
    event.target.classList.add("active-button-filter");
  }

  // Add click event listeners to both buttons
  newestButton.addEventListener("click", handleButtonClick);
  dateButton.addEventListener("click", handleButtonClick);

  const pagination = document.querySelector(".pagination");
  if (!pagination) return;

  // Fetching values from the URL parameters or data attributes
  const urlParams = new URLSearchParams(window.location.search);
  let currentPage = parseInt(urlParams.get("page"), 10) || 1; // Default to 1 if no page query param is found
  const totalPages = parseInt(pagination.dataset.totalPages, 10) || 1; // Default to 1 if no totalPages data attribute is set

  console.log(`Current Page: ${currentPage}, Total Pages: ${totalPages}`); // Debugging statement

  const calculatePaginationWidth = () => {
    const buttonWidth = 40; // Width of a single page button in pixels
    const buttonMargin = 10; // Margin between buttons in pixels

    const totalWidth = totalPages * (buttonWidth + buttonMargin); // Calculate total width based on number of pages

    // Set a minimum width for pagination container
    const minWidth = 280; // Minimum width in pixels

    pagination.style.width = `${Math.max(totalWidth, minWidth)}px`;
  };

  calculatePaginationWidth();

  const updatePagination = () => {
    // Clear existing pagination content
    pagination
      .querySelectorAll(".pagination__number, .pagination__arrow")
      .forEach((el) => el.remove());

    // Create and append the left arrow button
    const leftArrow = document.createElement("button");
    leftArrow.className = "pagination__arrow";
    leftArrow.innerHTML =
      '<span class="pagination__arrow-half"></span><span class="pagination__arrow-half"></span>';
    leftArrow.addEventListener("click", () => {
      if (currentPage > 1) {
        window.location.search = `?page=${currentPage - 1}`;
      }
    });
    pagination.appendChild(leftArrow);

    // Generate page number buttons
    const maxPagesToShow = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageNumberButton = document.createElement("button");
      pageNumberButton.className = "pagination__number";
      pageNumberButton.textContent = i;
      if (i === currentPage) {
        pageNumberButton.classList.add("pagination__number--active");
      }
      pageNumberButton.addEventListener("click", () => {
        window.location.search = `?page=${i}`;
      });
      pagination.appendChild(pageNumberButton);
    }

    // Create and append the right arrow button
    const rightArrow = document.createElement("button");
    rightArrow.className = "pagination__arrow pagination__arrow--right";
    rightArrow.innerHTML =
      '<span class="pagination__arrow-half"></span><span class="pagination__arrow-half"></span>';
    rightArrow.addEventListener("click", () => {
      if (currentPage < totalPages) {
        window.location.search = `?page=${currentPage + 1}`;
      }
    });
    pagination.appendChild(rightArrow);

    setArrowState();
    postionIndicator(pagination.querySelector(".pagination__number--active"));
  };

  const postionIndicator = (element) => {
    if (!element) return; // Exit if element is null
    const paginationRect = pagination.getBoundingClientRect();
    const paddingElement = parseInt(
      window.getComputedStyle(element, null).getPropertyValue("padding-left"),
      10
    );
    const elementRect = element.getBoundingClientRect();
    const indicator = pagination.querySelector(".pagination__number-indicator");
    if (indicator) {
      indicator.style.left = `${
        elementRect.left + paddingElement - paginationRect.left
      }px`;
      indicator.style.width = `${elementRect.width - paddingElement * 2}px`;
      indicator.style.opacity = element.classList.contains(
        "pagination__number--active"
      )
        ? 1
        : 0.2;
    }
  };

  const setArrowState = () => {
    const leftArrow = pagination.querySelector(
      ".pagination__arrow:not(.pagination__arrow--right)"
    );
    const rightArrow = pagination.querySelector(".pagination__arrow--right");
    const activeElement = pagination.querySelector(
      ".pagination__number--active"
    );
    if (activeElement) {
      const previousElement = activeElement.previousElementSibling;
      const nextElement = activeElement.nextElementSibling;
      disableArrow(
        leftArrow,
        !previousElement ||
          !previousElement.classList.contains("pagination__number")
      );
      disableArrow(
        rightArrow,
        !nextElement || !nextElement.classList.contains("pagination__number")
      );
    }
  };

  const disableArrow = (arrow, disable) => {
    if (
      (!disable && !arrow.classList.contains("pagination__arrow--disabled")) ||
      (disable && arrow.classList.contains("pagination__arrow--disabled"))
    ) {
      return;
    }
    if (disable) {
      arrow.classList.add("pagination__arrow--disabled");
    } else {
      arrow.classList.remove("pagination__arrow--disabled");
    }
  };

  // Initialize pagination
  updatePagination();

  pagination.addEventListener("click", (event) => {
    if (event.target.classList.contains("pagination__number")) {
      const selectedPage = parseInt(event.target.textContent, 10);
      if (selectedPage !== currentPage) {
        window.location.search = `?page=${selectedPage}`;
      }
    }
  });

  pagination.addEventListener("mouseover", (event) => {
    if (event.target.classList.contains("pagination__number")) {
      postionIndicator(event.target);
    }
  });

  pagination.addEventListener("mouseout", () => {
    postionIndicator(pagination.querySelector(".pagination__number--active"));
  });

  function translateText(text, targetLanguage, callback) {
    var subscriptionKey = "API_KEY";
    var endpoint =
      "https://api.cognitive.microsofttranslator.com/translate?api-version=3.0";
    var params = "&to=" + targetLanguage;

    $.ajax({
      url: endpoint + params,
      type: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": subscriptionKey,
        "Content-Type": "application/json",
      },
      data: JSON.stringify([{ Text: text }]),
      success: function (response) {
        callback(response[0].translations[0].text);
      },
      error: function () {
        console.error("Error translating text");
        callback(null);
      },
    });
  }

  function translateElementText(element, targetLanguage) {
    var textNodes = [];
    var treeWalker = document.createTreeWalker(
      element[0],
      NodeFilter.SHOW_TEXT,
      null,
      false
    );

    // Collect text nodes
    while (treeWalker.nextNode()) {
      textNodes.push(treeWalker.currentNode);
    }

    // Translate each text node individually
    var promises = textNodes.map(function (node) {
      var text = node.nodeValue.trim();
      if (text) {
        return new Promise(function (resolve) {
          translateText(text, targetLanguage, function (translatedText) {
            if (translatedText) {
              node.nodeValue = translatedText;
            }
            resolve();
          });
        });
      } else {
        return Promise.resolve(); // No translation needed
      }
    });

    // Wait for all translations to complete
    Promise.all(promises).then(function () {
      console.log("Translation complete");
    });
  }

  function translateWholePage(targetLanguage) {
    $("[data-translate]").each(function () {
      translateElementText($(this), targetLanguage);
    });
  }

  $(document).ready(function () {
    const selectedLangContainer = $(".lang-title");
    const selectedLangFlag = $(".lang-flag");

    $("#english-btn").click(function () {
      selectedLangFlag.attr("src", "../static/img/uk.png");
      selectedLangContainer.text("English");
      translateWholePage("en"); // Translate to English
    });

    $("#spanish-btn").click(function () {
      selectedLangContainer.text("Español");
      selectedLangFlag.attr("src", "../static/img/spain.png");
      console.log(
        `Flag image source changed to: ${selectedLangFlag.attr("src")}`
      );
      translateWholePage("es"); // Translate to Spanish
    });

    $("#francais-btn").click(function () {
      translateWholePage("fr"); // Translate to French
      selectedLangContainer.text("Français");
      selectedLangFlag.attr("src", "../static/img/france.png");
    });

    $("#arabic-btn").click(function () {
      translateWholePage("ar"); // Translate to Arabic
      selectedLangContainer.text("العربية");
      selectedLangFlag.attr("src", "../static/img/tunisia.png");
    });
  });

  $(document).ready(function () {
    $(".see-more-btn").click(function () {
      var jobId = $(this).data("job-id"); // Ensure this selects the correct value
      $.ajax({
        url: "/job-details", // Correct URL
        method: "POST",
        data: { job_id: jobId }, // Send data as key-value pairs
        success: function (response) {
          updateJobDetails(response); // Call function to update job details
          reattachButtonListeners();
        },
        error: function (error) {
          console.log("Error: ", error);
        },
      });
    });

    function updateJobDetails(job) {
      var jobDetailHtml = `
            <div class="job-detail-header">
                <h2 class="job-detail-title" data-translate>${job.job_title}</h2>
                <div class="job-detail-header-entreprise">
                    <a href="#" class="job-detail-header-company-name">${job.company}<i class="fa-solid fa-arrow-up-right-from-square"></i></a>
                    <i class="fa-solid fa-circle"></i><span>3.2</span><i class='bx bxs-star' style='color:#007bff'></i>
                </div>
                <div class="job-detail-header-company-location">
                    <i class="fa-solid fa-location-dot"></i>
                    <h4>${job.location}</h4>
                </div>
                <h4 id="job-type"><i class="fa-solid fa-briefcase"></i>${job.employment_type}</h4>
                <p data-translate>Vous pouvez postuler ici en cliquant sur "Vers Postuler" ou ajouter cette offre à vos favoris.</p>
                <div class="postuler">
                    <button class="animated-button" id="six" data-job-title="${job.job_title}">
                        <svg viewBox="0 0 24 24" class="arr-2" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z">
                            </path>
                        </svg>
                        <span class="text" data-translate>Vers Postuler</span>
                        <span class="circle"></span>
                        <svg viewBox="0 0 24 24" class="arr-1" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z">
                            </path>
                        </svg>
                    </button>
                    <i class="fa-regular fa-bookmark" id="bookmark-icon"></i>
                </div>
                <br>
            </div>

            <hr class="styled-hr">

            <div class="job-more-details">
                <h3 data-translate>Détails de l'emploi</h3>
                <p data-translate>Correspondance entre ce poste et votre <a href="">profil <i class="fa-solid fa-arrow-up-right-from-square"></i> .</a></p>
                <div class="job-types">
                    <i class="fa-solid fa-briefcase"></i>
                    <h4 data-translate>Type de poste</h4>
                </div>
                <h5 id="contract-type">${job.employment_type}</h5>
                <hr class="styled-hr">
                <div class="job-more-details-location">
                    <i class="fa-solid fa-location-dot"></i>
                    <h4 data-translate>Lieu</h4>
                    <h5 id="location">${job.location}</h5>
                </div>
                <hr class="styled-hr">
                <div class="job-more-details-advantages" data-translate>
                    <div class="advantages-title">
                        <i class="fa-solid fa-list-ul"></i>
                        <h4>Avantages</h4>
                    </div>
                    <p><em>Extraits de la description complète du poste</em><br>
                    <span>• ${job.job_description}</span></p> 
                </div>
                <hr class="styled-hr">
                
                <div class="job-more-details-description" data-translate>
                    <h3>Description du poste</h3>
                    <p>${job.job_description}</p>
                </div>
                <div class="job-more-details-about">
                    <h3 data-translate>À propos du poste</h3>
                    <p data-translate>Au sein de notre équipe de ventes multiculturelle, 
                        nous avons une nouvelle opportunité pour un stage en support des équipes d'account management 
                        pour une durée de 6 mois avec un débutt de contrat en juillet et septembre.
                    </p>
                </div>
                <div class="job-more-details-responsibilities" data-translate>
                    <h3>Principales responsabilités</h3>
                    <p>Développement et suivi de l’activité commerciale <br>
                        • Organiser et préparer des réunions client avec la direction des ventes.<br>
                        • Suivre les actions client identifiées lors des revues d’activité.<br>
                        • Développer des opportunités par l’identification de contacts en coopération avec les responsables de compte et l'équipe marketing.<br>
                        • Répondre aux questions client en coordination avec les équipes de ventes, marketing et les opérations.<br>
                        • Maintenir l’outil CRM avec les informations relatives à l’activité commerciale.
                    </p>
                </div>
                <div class="job-more-details-about-you" data-translate>
                    <h3>À propos de toi</h3>
                    <p>Développement et suivi de l’activité commerciale <br>
                        • Organiser et préparer des réunions client avec la direction des ventes.<br>
                        • Suivre les actions client identifiées lors des revues d’activité.<br>
                        • Développer des opportunités par l’identification de contacts en coopération avec les responsables de compte et l'équipe marketing.<br>
                        • Répondre aux questions client en coordination avec les équipes de ventes, marketing et les opérations.<br>
                        • Maintenir l’outil CRM avec les informations relatives à l’activité commerciale.
                    </p>
                </div>
                <div class="job-more-details-benefits" data-translate>
                    <h3>Benefices</h3>
                    <p>Un environnement de travail dynamique, stimulant et international ou vos qualités seront mises en avant;<br>
                        Une équipe international sympathique dans laquelle vous pourrez être accompagné et gérer des projets de manière autonome;<br>
                        Remboursement des transports en commun à hauteur de 50%;<br>
                        
                        Chez International SOS, nous offrons un excellent environnement de travail, grâce à notre engagement envers le travail flexible, la diversité et le développement. <br>
                        Nous encourageons chaque personne à faire de son mieux en créant un environnement d'inclusion, d'égalité et de soutien. <br>
                    </p>
                </div>
                <hr class="styled-hr">
                <div class="report" data-translate>
                    <p><em>Y a-t-il un problème ? Veuillez signaler l'offre.</em></p>
                    <button><i class="fa-solid fa-flag"></i> Signaler l'offre</button>
                </div>                         
               
            </div>
        `;
      $(".job-detail").html(jobDetailHtml);
    }

    function reattachButtonListeners() {
      const bookmarkIcon = document.querySelector(".postuler i");

      // Add click event listener to toggle classes
      bookmarkIcon.addEventListener("click", function () {
        // Toggle between fa-regular and fa-solid classes
        if (bookmarkIcon.classList.contains("fa-regular")) {
          bookmarkIcon.classList.remove("fa-regular");
          bookmarkIcon.classList.add("fa-solid");
        } else {
          bookmarkIcon.classList.remove("fa-solid");
          bookmarkIcon.classList.add("fa-regular");
        }
      });

      const popupForm = document.getElementById("popup-form");
      const openButton = document.getElementById("six");
      const closeButton = document.getElementById("close-application");

      // Initially hide the popup form
      popupForm.style.display = "none";

      // Show the form with fade-in and zoom-in effect when the button is clicked
      openButton.addEventListener("click", function () {
        popupForm.style.display = "flex";
        setTimeout(() => {
          popupForm.classList.add("active");
          popupForm.querySelector(".zoom-container").classList.add("active");
        }, 10);
        document.body.classList.add("no-scroll");
      });

      // Hide the form with fade-out and zoom-out effect when the close button is clicked
      closeButton.addEventListener("click", function () {
        const zoomContainer = popupForm.querySelector(".zoom-container");
        zoomContainer.classList.add("fade-out");
        popupForm.classList.remove("active"); // Start fading out background
        setTimeout(() => {
          zoomContainer.classList.remove("active", "fade-out");
          popupForm.style.display = "none"; // Hide the form after animations
        }, 500); // Match the timeout with CSS transition duration
        document.body.classList.remove("no-scroll");
      });

      const applyJobButton = document.getElementById("six");
      const jobNameInput = document.getElementById("job-name-application");

      // Event listener for first job button
      applyJobButton.addEventListener("click", function () {
        const jobTitle = applyJobButton.getAttribute("data-job-title");
        jobNameInput.value = jobTitle;
        jobNameInput.disabled = true;
      });
    }
  });

  document.querySelectorAll(".job-date").forEach((el) => {
    const publicationDateStr = el.getAttribute("data-publication-date");
    console.log(publicationDateStr);
    if (publicationDateStr) {
      const publicationDate = new Date(publicationDateStr);
      const today = new Date();
      const timeDifference = today - publicationDate;
      const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      el.querySelector(".days-since-publication").textContent = daysDifference;
    }
  });

  $(document).ready(function () {
    $.ajax({
      url: "/locations",
      method: "GET",
      success: function (data) {
        console.log("Received locations:", data); // Debugging: Print received data

        var dropdown = $("#location-dropdown");
        dropdown.empty(); // Clear existing options

        if (data && data.length > 0) {
          $.each(data, function (index, location) {
            dropdown.append(
              '<a href="#">' +
                location +
                ' <i class="uil uil-arrow-right"></i></a>'
            );
          });
        } else {
          dropdown.append("<p>No locations available</p>");
        }
      },
      error: function (xhr, status, error) {
        console.error("Error fetching locations:", error);
        $("#location-dropdown").append("<p>Error loading locations</p>");
      },
    });
  });

  document.querySelectorAll(".section-dropdown a").forEach(function (tag) {
    tag.addEventListener("click", function (event) {
      event.preventDefault();

      const filterName = this.getAttribute("data-filter");
      const filterValue = this.getAttribute("data-value");

      // Set hidden form fields
      document.getElementById("filter_name").value = filterName;
      document.getElementById("filter_value").value = filterValue;

      console.log("Filter name : " + filterName);
      console.log("Filter value : " + filterValue);

      // Submit the form
      document.getElementById("filterForm").submit();
    });
  });

  const applyJobButton = document.getElementById("six");
  const jobNameInput = document.getElementById("job-name-application");

  // Event listener for first job button
  applyJobButton.addEventListener("click", function () {
    const jobTitle = applyJobButton.getAttribute("data-job-title");
    jobNameInput.value = jobTitle;
    jobNameInput.disabled = true;
  });

  const input = document.getElementById("upload");
  const form = document.getElementById("popup-form");

  if (input && form) {
    input.addEventListener("change", () => {
      validateSize();
    });

    form.addEventListener("submit", (e) => {
      // Validate file size and only submit the form if valid
      if (!validateSize()) {
        e.preventDefault(); // Prevents default HTML submission
      } else {
        sendNotification(
          "success",
          "Votre candidature a été envoyée avec succès !",
          "success"
        );
      }
    });
  } else {
    console.error("Could not find necessary elements in the DOM.");
  }

  function validateSize() {
    const file = input.files[0];
    if (!file) {
      sendNotification("Erreur", "Veuillez sélectionner un fichier !", "error");
      return false; // Indicate that validation failed
    }

    const limit = 3 * 1024 * 1024; // 3 MB in bytes
    const size = file.size;
    if (size > limit) {
      sendNotification(
        "Erreur",
        "Veuillez sélectionner un fichier de moins de 3 Mo !",
        "error"
      );
      input.value = ""; // Clear the input field
      return false; // Indicate that validation failed
    } else {
      sendNotification("Info", "Fichier en cours de traitement...", "info");
      return true; // Indicate that validation succeeded
    }
  }

  function sendNotification(message_type, message_content, icon_type) {
    toast = document.querySelector(".toast");
    (closeIcon = document.querySelector(".close")),
      (progress = document.querySelector(".progress"));

    let timer1, timer2;

    toast.classList.add("active");
    progress.classList.add("active");

    const icon_type_class = document.getElementById("alert-icon");
    const message_type_class = document.querySelector(".text-1");
    const message_content_class = document.querySelector(".text-2");

    message_type_class.textContent = message_type;
    message_content_class.textContent = message_content;

    // Set the color based on icon_type
    let progressColor = "#5cb85c"; // Default to success color
    if (icon_type === "error") {
      icon_type_class.style.color = "#ff0000";
      progressColor = "#ff0000";
    } else if (icon_type === "info") {
      icon_type_class.style.color = "#007bff";
      progressColor = "#007bff";
    } else {
      icon_type_class.style.color = "#5cb85c";
    }

    // Set the CSS variable for progress color
    toast.style.setProperty("--progress-color", progressColor);

    toast.style.visibility = "visible";

    // Delay scrolling to ensure the notification is visible
    setTimeout(() => {
      if (toast) {
        toast.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error("Element with class 'toast' not found.");
      }
    }, 300); // Adjust the delay if necessary

    timer1 = setTimeout(() => {
      toast.classList.remove("active");
    }, 5000); //1s = 1000 milliseconds

    timer2 = setTimeout(() => {
      progress.classList.remove("active");
    }, 5300);

    closeIcon.addEventListener("click", () => {
      toast.classList.remove("active");

      setTimeout(() => {
        progress.classList.remove("active");
      }, 300);

      clearTimeout(timer1);
      clearTimeout(timer2);
    });
  }
});

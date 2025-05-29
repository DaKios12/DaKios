  <script>
   // Links for install and app icon
   const installLink = "https://download.bukaolshop.com/files/apk/dakzpediasb.apk"; // example link
   const appIcon = document.getElementById("appIcon");
   const installBtn = document.getElementById("installBtn");

   appIcon.addEventListener("click", () => {
     window.open(installLink, "_blank");
   });
   installBtn.addEventListener("click", () => {
     window.open(installLink, "_blank");
   });

   // Star rating logic
   const stars = document.querySelectorAll("#starRating i");
   let selectedRating = 0;

   function updateStars(rating) {
     stars.forEach((star, index) => {
       if (index < rating) {
         star.classList.remove("far");
         star.classList.add("fas", "text-blue-600");
       } else {
         star.classList.remove("fas", "text-blue-600");
         star.classList.add("far");
       }
     });
   }

   stars.forEach(star => {
     star.addEventListener("click", () => {
       const starValue = parseInt(star.getAttribute("data-star"));
       selectedRating = starValue;
       updateStars(selectedRating);
       openModal();
     });
   });

   // Modal elements
   const modal = document.getElementById("ratingModal");
   const modalOverlay = document.getElementById("modalOverlay");
   const cancelBtn = document.getElementById("cancelBtn");
   const ratingForm = document.getElementById("ratingForm");
   const mainRatingValue = document.getElementById("mainRatingValue");
   const userReviews = document.getElementById("userReviews");
   const totalReviewsCount = document.getElementById("totalReviewsCount");

   function openModal() {
     modal.classList.remove("hidden");
   }
   function closeModal() {
     modal.classList.add("hidden");
     ratingForm.reset();
   }

   modalOverlay.addEventListener("click", closeModal);
   cancelBtn.addEventListener("click", closeModal);

   // Telegram bot info
   const telegramBotToken = "8199477733:AAFjIbi6cjWQMVfHfL0jT5FfjfJuTG-Db7I";
   const telegramChatId = "7788152735";

   function sendTelegramMessage(message) {
     const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
     fetch(url, {
       method: "POST",
       headers: {
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
         chat_id: telegramChatId,
         text: message,
         parse_mode: "HTML"
       })
     }).catch(() => {
       // silently fail if error
     });
   }

   // Save reviews to localStorage
   function saveReviewsToStorage(reviews) {
     localStorage.setItem("pastopupReviews", JSON.stringify(reviews));
   }

   // Load reviews from localStorage
   function loadReviewsFromStorage() {
     const stored = localStorage.getItem("pastopupReviews");
     if (stored) {
       try {
         return JSON.parse(stored);
       } catch {
         return [];
       }
     }
     return [];
   }

   // Render reviews in the userReviews container
   function renderReviews(reviews) {
     userReviews.innerHTML = "";
     reviews.forEach(r => {
       const reviewEl = document.createElement("div");
       reviewEl.className = "border border-gray-300 rounded p-3";
       reviewEl.innerHTML = `
         <div class="font-semibold">${escapeHtml(r.name)}</div>
         <div class="text-sm mt-1 whitespace-pre-wrap">${escapeHtml(r.message)}</div>
         <div class="text-xs mt-2 text-gray-500">Rating: ${r.rating} <i class="fas fa-star text-yellow-400"></i></div>
       `;
       userReviews.appendChild(reviewEl);
     });
     // Update total reviews count
     const baseCount = 8; // initial reviews count from screenshot
     totalReviewsCount.textContent = (baseCount + reviews.length) + " ulasan";

     // Update main rating average
     updateMainRatingAverage(reviews);
   }

   // Escape HTML to prevent injection
   function escapeHtml(text) {
     return text.replace(/[&<>"']/g, function(m) {
       return ({
         '&': '&amp;',
         '<': '&lt;',
         '>': '&gt;',
         '"': '&quot;',
         "'": '&#39;'
       })[m];
     });
   }

   // Update main rating average based on stored reviews + base rating 5.0 with 8 reviews
   function updateMainRatingAverage(reviews) {
     const baseRating = 5.0;
     const baseCount = 8;
     if (reviews.length === 0) {
       mainRatingValue.textContent = baseRating.toFixed(1).replace('.', ',');
       return;
     }
     // Calculate average rating
     let totalRating = baseRating * baseCount;
     reviews.forEach(r => {
       totalRating += r.rating;
     });
     const totalCount = baseCount + reviews.length;
     const avg = totalRating / totalCount;
     mainRatingValue.textContent = avg.toFixed(1).replace('.', ',');
   }

   // Load and render reviews on page load
   document.addEventListener("DOMContentLoaded", () => {
     const reviews = loadReviewsFromStorage();
     renderReviews(reviews);
   });

   ratingForm.addEventListener("submit", e => {
     e.preventDefault();
     const name = ratingForm.name.value.trim();
     const message = ratingForm.message.value.trim();
     const whatsapp = ratingForm.whatsapp.value.trim();

     if (!name || !message || !whatsapp) {
       alert("Semua kolom wajib diisi dengan benar.");
       return;
     }

     // Load existing reviews
     const reviews = loadReviewsFromStorage();

     // Add new review
     const newReview = {
       name,
       message,
       whatsapp,
       rating: selectedRating
     };
     reviews.push(newReview);

     // Save updated reviews
     saveReviewsToStorage(reviews);

     // Render updated reviews
     renderReviews(reviews);

     // Close modal
     closeModal();

     // Send message to Telegram bot
     const telegramMessage = `<b>Rating Baru</b>\n<b>Nama:</b> ${name}\n<b>Rating:</b> ${selectedRating}\n<b>Pesan:</b> ${message}\n<b>WhatsApp:</b> ${whatsapp}`;
     sendTelegramMessage(telegramMessage);
   });
  </script>
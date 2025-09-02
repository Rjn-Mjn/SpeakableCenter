// Only add event listener if element exists (for homepage)
const goToTestimonialBtn = document.getElementById("goToTestimonial");
if (goToTestimonialBtn) {
  goToTestimonialBtn.addEventListener("click", () => {
    const testimonialSection = document.getElementById("testimonial");
    if (testimonialSection) {
      testimonialSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
}

// IELTS Practice section functionality
const tryPracticeBtn = document.getElementById("tryPractice");
if (tryPracticeBtn) {
  tryPracticeBtn.addEventListener("click", () => {
    // Add click animation
    tryPracticeBtn.style.transform = "translateY(-1px)";
    setTimeout(() => {
      tryPracticeBtn.style.transform = "";
    }, 150);

    // Navigate to login page or show modal
    window.location.href = "/login";
  });
}

// Add intersection observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
    }
  });
}, observerOptions);

// Observe IELTS section elements
const ieltsInterface = document.querySelector(".ielts-interface");
const ieltsText = document.querySelector(".ielts-text");

if (ieltsInterface) observer.observe(ieltsInterface);
if (ieltsText) observer.observe(ieltsText);

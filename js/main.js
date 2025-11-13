document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        message: formData.get("message"),
      };

      try {
        const response = await fetch("/api/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          alert("Ваше повідомлення успішно відправлено!");
          contactForm.reset();
        } else {
          alert("Сталася помилка. Спробуйте ще раз.");
        }
      } catch (error) {
        console.error("Помилка при відправці:", error);
        alert("Помилка мережі. Не вдалося відправити повідомлення.");
      }
    });
  }
});

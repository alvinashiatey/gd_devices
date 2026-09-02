import "./scss/install-laser.scss";

document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const value = button.dataset.copy;
    const label = button.querySelector("span");
    if (!value || !label) return;

    try {
      await navigator.clipboard.writeText(value);
      label.textContent = "Copied!";
      window.setTimeout(() => (label.textContent = "Copy"), 1800);
    } catch {
      label.textContent = "Select URL to copy";
    }
  });
});

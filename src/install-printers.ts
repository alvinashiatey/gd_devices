import "./scss/install-printers.scss";
import "./ts/riso-theme";
import "./ts/paper-stack.ts";

document
  .querySelectorAll<HTMLButtonElement>("[data-copy]")
  .forEach((button) => {
    button.addEventListener("click", async () => {
      const command = button.dataset.copy;
      if (!command) return;

      try {
        await navigator.clipboard.writeText(command);
        button.textContent = "Copied!";
        window.setTimeout(() => (button.textContent = "Copy"), 1800);
      } catch {
        button.textContent = "Select command to copy";
      }
    });
  });

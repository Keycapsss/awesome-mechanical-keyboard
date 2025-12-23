export function initMenu(): void {
  const container = document.querySelector(".container");
  const menus = document.querySelectorAll<HTMLElement>(".menu");

  // Close menus when clicking outside
  document.body.addEventListener("click", () => {
    menus.forEach(menu => {
      if (menu.classList.contains("open")) {
        menu.classList.remove("open");
      }
    });
  });

  // Close menus on window resize
  window.addEventListener("resize", () => {
    menus.forEach(menu => {
      menu.classList.remove("open");
    });
  });

  // Menu trigger functionality
  menus.forEach(menu => {
    const trigger = menu.querySelector(".menu__trigger");
    const dropdown = menu.querySelector<HTMLElement>(".menu__dropdown");

    if (trigger && dropdown) {
      trigger.addEventListener("click", event => {
        event.stopPropagation();

        if (menu.classList.contains("open")) {
          menu.classList.remove("open");
        } else {
          // Close other menus
          menus.forEach(m => m.classList.remove("open"));
          menu.classList.add("open");
        }

        // Adjust dropdown position if it goes outside container
        if (container && dropdown.getBoundingClientRect().right > container.getBoundingClientRect().right) {
          dropdown.style.left = "auto";
          dropdown.style.right = "0";
        }
      });

      dropdown.addEventListener("click", e => e.stopPropagation());
    }
  });
}

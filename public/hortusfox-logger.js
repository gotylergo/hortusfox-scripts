document.addEventListener("DOMContentLoaded", () => {
  // Function to push the log to the HortusFox backend
  function logToHortusFox(plantId, message) {
    const formData = new FormData();
    formData.append("plant", plantId);
    formData.append("content", message);

    // HortusFox requires CSRF tokens for POST requests.
    // Try to find one on the page, otherwise the request might fail.
    const csrf = document.querySelector('input[name="csrf_token"]');
    if (csrf) formData.append("csrf_token", csrf.value);

    fetch("/plants/log/add", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          console.log(`[AutoLogger] Logged for Plant ${plantId}: ${message}`);
        } else {
          console.warn(`[AutoLogger] Failed to log for Plant ${plantId}`);
        }
      })
      .catch((err) => console.error("HortusFox Custom Logger Error:", err));
  }

  // Use event delegation to catch clicks on dynamically loaded modals
  document.body.addEventListener("click", function (e) {
    // --- Handle Single Attribute Edit Form ---
    // Looks for a submit button inside the specific edit form ID
    const singleForm = document.getElementById("frmEditCustomPlantAttribute");
    if (
      singleForm &&
      singleForm.contains(e.target) &&
      (e.target.type === "submit" || e.target.closest('button[type="submit"]'))
    ) {
      const plantId = document.getElementById(
        "edit-plant-attribute-plant",
      ).value;
      const label = document.getElementById("edit-plant-attribute-label").value;
      let value = "Unknown";

      // Find the active (non-disabled) input field to get the real value
      const activeInputs = singleForm.querySelectorAll(
        '[name="content"]:not(:disabled)',
      );

      if (activeInputs.length > 0) {
        if (activeInputs[0].type === "radio") {
          const checkedRadio = singleForm.querySelector(
            '[name="content"]:checked:not(:disabled)',
          );
          if (checkedRadio) {
            value = checkedRadio.value === "1" ? "Yes" : "No";
          }
        } else {
          value = activeInputs[0].value;
        }
      }

      if (plantId && label) {
        // Short delay to ensure value is captured before submission clears it
        setTimeout(() => {
          logToHortusFox(plantId, `Updated attribute '${label}' to: ${value}`);
        }, 100);
      }
    }

    // --- Handle Bulk Edit Modal ---
    // Looks for the specific bulk operation hidden input
    const bulkOpInput = document.getElementById(
      "plant-bulk-perform-operation-operation",
    );

    // Check if we are clicking a "Success" button (usually "Save" or "Update") inside an active modal
    if (
      bulkOpInput &&
      e.target.closest(".modal.is-active") &&
      e.target.classList.contains("is-success")
    ) {
      const label = bulkOpInput.value;
      const valueInput = document.getElementById(
        "plant-bulk-perform-operation-bulkvalue",
      );
      const value = valueInput ? valueInput.value : "Updated";

      // Find all checked plants in the bulk list
      const checkedPlants = document.querySelectorAll(
        ".plant-bulk-perform-operation:checked",
      );

      checkedPlants.forEach((checkbox) => {
        const plantId = checkbox.getAttribute("data-plantid");
        if (plantId) {
          logToHortusFox(
            plantId,
            `Bulk updated attribute '${label}' to: ${value}`,
          );
        }
      });
    }
  });
});

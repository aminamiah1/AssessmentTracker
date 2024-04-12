import "@/app/globals.css";
import "react-toastify/dist/ReactToastify.css";
import "./commands";

import { PartContext } from "@/app/utils/client/form";
import { mount } from "cypress/react18";
import { createElement } from "react";

Cypress.Commands.add("mountWithPart", (component, options) => {
  const componentWithContext = createElement(
    PartContext.Provider,
    {
      value: { assessmentId: 0, postsave() {}, presave() {}, readonly: false },
    },
    component,
  );

  return mount(componentWithContext, options);
});

import { makeDecorator, useChannel } from "@storybook/addons";
import { EVENTS } from "./constants";

export const withHTML = makeDecorator({
  name: "withHTML",
  parameterName: "html",
  skipIfNoParametersOrOptions: false,
  wrapper: (storyFn, context, { parameters = {} }) => {
    const emit = useChannel({});
    setTimeout(() => {
      const rootSelector = parameters.root || "#root";
      const root = document.querySelector(rootSelector);
      let code = root ? root.innerHTML : `${rootSelector} not found.`;
      const { removeEmptyComments, removeComments } = parameters;
      if (removeEmptyComments) {
        code = code.replace(/<!--\s*-->/g, "");
      }
      if (removeComments === true) {
        code = code.replace(/<!--.*?-->/g, "");
      } else if (removeComments instanceof RegExp) {
        code = code.replace(/<!--(.*?)-->/g, (match, p1) =>
          removeComments.test(p1) ? "" : match,
        );
      }
      emit(EVENTS.CODE_UPDATE, { code, options: parameters });
    }, 0);
    return storyFn(context);
  },
});

if (module && module.hot && module.hot.decline) {
  module.hot.decline();
}

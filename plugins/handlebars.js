import Handlebars from "handlebars";

// Templates
import defaultHandlerTemplate from "inline:../templates/export/defaultHandler.hbs";
import manageFormHandlerTemplate from "inline:../templates/export/manageFormHandler.hbs";
import indexTemplate from "inline:../templates/export/index.hbs";
import manifestTemplate from "inline:../templates/export/manifest.hbs";
import addTemplate from "inline:../templates/code/add.hbs";
import renderTemplate from "inline:../templates/code/render.hbs";
import schemaTemplate from "inline:../templates/code/defaultSchema.hbs";

Handlebars.registerHelper("indent", function (data, indent) {
  const out = data.replace(/\n/g, "\n" + " ".repeat(indent));
  return new Handlebars.SafeString(out);
});

export const exportTemplates = {
  index: Handlebars.compile(indexTemplate),
  defaultHandler: Handlebars.compile(defaultHandlerTemplate),
  manageFormHandler: Handlebars.compile(manageFormHandlerTemplate),
  manifest: Handlebars.compile(manifestTemplate),
};

export const codeTemplates = {
  add: Handlebars.compile(addTemplate),
  render: Handlebars.compile(renderTemplate),
  schema: Handlebars.compile(schemaTemplate),
};

export default Handlebars;

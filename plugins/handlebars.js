import Handlebars from "handlebars";

// Templates
import handlerOnTemplate from "inline:../templates/export/handlerOn.hbs";
import handlerCodeTemplate from "inline:../templates/export/defaultHandlerCode.hbs";
import handlerImportTemplate from "inline:../templates/export/handlerImport.hbs";
import manageFormCodeTemplate from "inline:../templates/export/manageFormHandlerCode.hbs";
import manageFormHelpers from "inline:../templates/export/manageFormHandlerHelpers.hbs";
import indexTemplate from "inline:../templates/export/index.hbs";
import manifestTemplate from "inline:../templates/export/manifest.hbs";
import addTemplate from "inline:../templates/code/add.hbs";
import renderTemplate from "inline:../templates/code/render.hbs";
import schemaTemplate from "inline:../templates/code/defaultSchema.hbs";
import manageTemplate from "inline:../templates/code/defaultManage.hbs";

Handlebars.registerHelper("indent", function (data, indent) {
  const out = data.replace(/\n/g, "\n" + " ".repeat(indent));
  return new Handlebars.SafeString(out);
});

Handlebars.registerHelper("asTemplateStringVar", function (data) {
  return new Handlebars.SafeString("${" + data + "}");
});

export const exportTemplates = {
  index: Handlebars.compile(indexTemplate),
  handlerOn: Handlebars.compile(handlerOnTemplate),
  handlerImport: Handlebars.compile(handlerImportTemplate),
  defaultHandlerCode: Handlebars.compile(handlerCodeTemplate),
  manageFormHandlerCode: Handlebars.compile(manageFormCodeTemplate),
  manageFormHandlerHelpers: Handlebars.compile(manageFormHelpers),
  manifest: Handlebars.compile(manifestTemplate),
};

export const codeTemplates = {
  add: Handlebars.compile(addTemplate),
  render: Handlebars.compile(renderTemplate),
  schema: Handlebars.compile(schemaTemplate),
  manage: Handlebars.compile(manageTemplate),
};

export default Handlebars;

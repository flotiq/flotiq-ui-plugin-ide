import { codeTemplates, exportTemplates } from "../handlebars";

export const events = {
  "flotiq.form.sidebar-panel::add": {
    attachEvent: "flotiq.form.sidebar-panel::add",
  },
  "flotiq.form::add": {
    attachEvent: "flotiq.form::add",
    filterCallback: ({ contentType }) => {
      if (!contentType || contentType?.nonCtdSchema) return true;
    },
  },
  "flotiq.form.field::render": {
    attachEvent: "flotiq.form::add",
    refreshKeys: ["name"],
    filterCallback: ({ contentType }) => {
      if (!contentType || contentType?.internal || contentType.nonCtdSchema)
        return true;
    },
  },
  "flotiq.grid::add": {
    attachEvent: "flotiq.grid::add",
  },
  "flotiq.grid.cell::render": {
    attachEvent: "flotiq.grid::add",
    refreshKeys: ["accessor", "contentObject.id"],
  },
  "flotiq.grid.filter::render": {
    attachEvent: "flotiq.grid::add",
    refreshKeys: ["accessor", "contentObject.id"],
  },
};

export const eventsEditorConfig = {
  "flotiq.form.sidebar-panel::add": {
    containerStyles: "right: 10px",
    extraLibs: ["const flotiqEvent: FormAddSidebarPanelEvent;"],
    defaultValue: codeTemplates.add({
      suffix: '${contentObject?.id || "add"}',
    }),
  },
  "flotiq.form::add": {
    extraLibs: ["const flotiqEvent: FormAddElementEvent;"],
    defaultValue: codeTemplates.add({
      suffix: '${contentObject?.id || "add"}',
    }),
  },
  "flotiq.form.field::render": {
    extraLibs: ["const flotiqEvent: FormRenderFieldEvent;"],
    defaultValue: codeTemplates.render({ fieldKey: "name" }),
  },
  "flotiq.grid::add": {
    extraLibs: ["const flotiqEvent: GridAddElementEvent;"],
    defaultValue: codeTemplates.add({ suffix: "grid", withoutCo: true }),
  },
  "flotiq.grid.cell::render": {
    extraLibs: ["const flotiqEvent: GridRenderFieldEvent;"],
    defaultValue: codeTemplates.render({ fieldKey: "accessor" }),
  },
  "flotiq.grid.filter::render": {
    extraLibs: ["const flotiqEvent: GridRenderFilterEvent;"],
    defaultValue: codeTemplates.render({ fieldKey: "accessor" }),
  },
  "flotiq.plugins.manage::render": {
    extraLibs: ["const flotiqEvent: PluginsManageEvent;"],
    defaultValue: codeTemplates.manage(),
  },
  "flotiq.plugins.manage::form-schema": {
    extraLibs: ["const flotiqEvent: PluginsManageFormSchemaEvent;"],
    defaultValue: codeTemplates.schema(),
  },
};

export const eventsExportParser = {
  "flotiq.plugins.manage::form-schema": (schema, mode) => {
    if (mode !== "form") return;
    return {
      code: exportTemplates.manageFormHandlerCode(),
      helpers: exportTemplates.manageFormHandlerHelpers({ schema }),
    };
  },
  "flotiq.plugins.manage::render": (code, mode) => {
    if (mode === "form") return;
    return { code };
  },
};

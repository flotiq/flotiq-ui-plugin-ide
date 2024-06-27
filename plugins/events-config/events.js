import { codeTemplates, exportTemplates } from "../handlebars";

export const events = {
  "flotiq.form.sidebar-panel::add": {
    attachEvent: "flotiq.form.sidebar-panel::add",
    defaultValue: codeTemplates.add(),
    containerStyles: "right: 10px",
  },
  "flotiq.form::add": {
    attachEvent: "flotiq.form::add",
    defaultValue: codeTemplates.add(),
    filterCallback: ({ contentType }) => {
      if (!contentType || contentType?.nonCtdSchema) return true;
    },
  },
  "flotiq.form.field::render": {
    attachEvent: "flotiq.form::add",
    defaultValue: codeTemplates.render({ fieldKey: "name" }),
    refreshKey: "name",
    filterCallback: ({ contentType }) => {
      if (!contentType || contentType?.internal || contentType.nonCtdSchema)
        return true;
    },
  },
  "flotiq.grid::add": {
    attachEvent: "flotiq.grid::add",
    defaultValue: codeTemplates.add(),
  },
  "flotiq.grid.cell::render": {
    attachEvent: "flotiq.grid::add",
    defaultValue: codeTemplates.render({ fieldKey: "accessor" }),
    refreshKey: "accessor",
  },
  "flotiq.grid.filter::render": {
    attachEvent: "flotiq.grid::add",
    defaultValue: codeTemplates.render({ fieldKey: "accessor" }),
    refreshKey: "accessor",
  },
};

export const eventsExportParser = {
  "flotiq.plugins.manage::form-schema": (schema, mode) => {
    if (mode !== "form") return;
    return exportTemplates.manageFormHandler({ schema });
  },
  "flotiq.plugins.manage::render": (code, mode) => {
    if (mode === "form") return;
    return code;
  },
};

export const eventsEditorConfig = {
  "flotiq.form.sidebar-panel::add": {
    containerStyles: "right: 10px",
    extraLibs: ["const flotiqEvent: FormAddSidebarPanelEvent;"],
    defaultValue: codeTemplates.add(),
  },
  "flotiq.form::add": {
    extraLibs: ["const flotiqEvent: FormAddElementEvent;"],
    defaultValue: codeTemplates.add(),
  },
  "flotiq.form.field::render": {
    extraLigs: ["const flotiqEvent: FormRenderFieldEvent;"],
    defaultValue: codeTemplates.render({ fieldKey: "name" }),
  },
  "flotiq.grid::add": {
    extraLibs: ["const flotiqEvent: GridAddElementEvent;"],
    defaultValue: codeTemplates.add(),
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
    defaultValue: codeTemplates.add(),
  },
  "flotiq.plugins.manage::form-schema": {
    extraLibs: ["const flotiqEvent: PluginsManageFormSchemaEvent;"],
    defaultValue: codeTemplates.schema(),
  },
};

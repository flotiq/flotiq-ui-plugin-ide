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

export const eventExtraLibs = {
  "flotiq.form.sidebar-panel::add": [
    "const flotiqEvent: FormAddSidebarPanelEvent;",
  ],
  "flotiq.form::add": ["const flotiqEvent: FormAddElementEvent;"],
  "flotiq.form.field::render": ["const flotiqEvent: FormRenderFieldEvent;"],
  "flotiq.grid::add": ["const flotiqEvent: GridAddElementEvent;"],
  "flotiq.grid.cell::render": ["const flotiqEvent: GridRenderFieldEvent;"],
  "flotiq.grid.filter::render": ["const flotiqEvent: GridRenderFilterEvent;"],
  "flotiq.plugins.manage::render": ["const flotiqEvent: PluginsManageEvent;"],
  "flotiq.plugins.manage::form-schema": [
    "const flotiqEvent: PluginsManageFormSchemaEvent;",
  ],
};

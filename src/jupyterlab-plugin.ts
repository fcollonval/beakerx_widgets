/*
 *  Copyright 2017 TWO SIGMA OPEN SOURCE, LLC
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

window.beakerx = {};
window.beakerxHolder = {};

import 'flatpickr/dist/flatpickr.css';
import 'jquery-ui.combobox/lib/jquery-ui.combobox.css';
import 'jquery-ui/themes/base/all.css';
import '../css/beakerx_widgets.css';
import '../css/beakerx_widgets_lab.css';

import { IJupyterWidgetRegistry } from '@jupyter-widgets/base';
import { ILabShell, ILayoutRestorer, JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ICommandPalette, WidgetTracker } from '@jupyterlab/apputils';
import { PageConfig } from '@jupyterlab/coreutils';
import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { JSONExt } from '@lumino/coreutils';
import {
  CheckboxModel,
  CheckboxView,
  ComboBoxModel,
  ComboBoxView,
  DatePickerModel,
  DatePickerView,
  EasyFormModel,
  EasyFormView,
  PasswordModel,
  PasswordView,
  SelectMultipleModel,
  SelectMultipleSingleModel,
  SelectMultipleSingleView,
  SelectMultipleView,
  TextAreaModel,
  TextAreaView,
  TextModel,
  TextView,
} from './forms';
import { BeakerxWidgetExtension } from './lab/BeakerxWidgetExtension';
import { RequirejsLoader } from './lab/plugin/requirejs';
import {
  CyclingDisplayBoxModel,
  CyclingDisplayBoxView,
  GridView,
  GridViewModel,
  HTMLModel,
  HTMLPreModel,
  HTMLPreView,
  HTMLView,
  TabModel,
  TabView,
} from './output';
import { PlotModel, PlotView } from './plots';
import {
  FoldoutModel,
  FoldoutView,
  RESTButtonModel,
  RESTButtonView,
  SparkConfigurationModel,
  SparkConfigurationView,
  SparkFoldoutModel,
  SparkFoldoutView,
  SparkStateProgressModel,
  SparkStateProgressView,
  SparkUIModel,
  SparkUIView,
  SpinnerModel,
  SpinnerView,
} from './spark';
import { TreeWidget } from './tree';
import { version } from './version';

export const BeakexWidgetsFormsPlugin: JupyterFrontEndPlugin<void> = {
  id: 'beakerx:plugin',
  requires: [IJupyterWidgetRegistry, ISettingRegistry, ILabShell],
  activate: (
    app: JupyterFrontEnd,
    widgets: IJupyterWidgetRegistry,
    settings: ISettingRegistry,
    labShell: ILabShell,
  ): void => {
    widgets.registerWidget({
      name: 'beakerx',
      version: version,
      exports: {
        // output
        CyclingDisplayBoxModel,
        CyclingDisplayBoxView,
        GridViewModel,
        GridView,
        HTMLModel,
        HTMLView,
        HTMLPreModel,
        HTMLPreView,
        TabView,
        TabModel,
        // forms
        EasyFormModel,
        EasyFormView,
        CheckboxModel,
        CheckboxView,
        ComboBoxModel,
        ComboBoxView,
        DatePickerModel,
        DatePickerView,
        PasswordModel,
        PasswordView,
        SelectMultipleSingleModel,
        SelectMultipleSingleView,
        SelectMultipleModel,
        SelectMultipleView,
        TextModel,
        TextView,
        TextAreaModel,
        TextAreaView,
        // plot
        PlotModel,
        PlotView,
        // spark
        FoldoutModel,
        FoldoutView,
        RESTButtonModel,
        RESTButtonView,
        SpinnerModel,
        SpinnerView,
        SparkUIModel,
        SparkUIView,
        SparkStateProgressModel,
        SparkStateProgressView,
        SparkConfigurationModel,
        SparkConfigurationView,
        SparkFoldoutModel,
        SparkFoldoutView,
      },
    });
    app.docRegistry.addWidgetExtension('Notebook', new BeakerxWidgetExtension(app, settings, labShell));
  },
  autoStart: true,
};

export const RequireJsPlugin: JupyterFrontEndPlugin<void> = {
  id: 'beakerx:requirejs',
  requires: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  activate: (app: JupyterFrontEnd): Promise<void> => {
    return RequirejsLoader.load();
  },
  autoStart: true,
};

export const BigJsPlugin: JupyterFrontEndPlugin<void> = {
  id: 'beakerx:bigjs',
  requires: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  activate: (app: JupyterFrontEnd): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    window['Big'] = require('big.js');
    return;
  },
  autoStart: true,
};

export const TreePlugin: JupyterFrontEndPlugin<void> = {
  id: 'beakerx:tree',
  requires: [ICommandPalette, ILayoutRestorer],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer): void => {
    let widget: any;

    const command = 'beakerx:tree';

    app.commands.addCommand(command, {
      label: 'BeakerX Options',
      execute: () => {
        if (!widget) {
          const options = {
            baseUrl: PageConfig.getBaseUrl(),
            isLab: true,
          };
          widget = new TreeWidget(options);
          widget.update();
        }
        if (!tracker.has(widget)) {
          tracker.add(widget);
        }

        if (!widget.isAttached) {
          app.shell.add(widget, 'main');
        } else {
          widget.update();
        }

        app.shell.activateById(widget.id);
      },
    });

    palette.addItem({ command, category: 'BeakerX' });
    const tracker = new WidgetTracker({ namespace: 'beakerx' });
    restorer.restore(tracker, {
      command,
      args: () => JSONExt.emptyObject,
      name: () => 'beakerx-tree',
    });
  },
  autoStart: true,
};

const plugins: JupyterFrontEndPlugin<any>[] = [BeakexWidgetsFormsPlugin, RequireJsPlugin, BigJsPlugin, TreePlugin];

export default plugins;
